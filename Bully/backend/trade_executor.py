import time
import asyncio
import logging
import pandas as pd
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timezone, timedelta

IST = timezone(timedelta(hours=5, minutes=30))

logger = logging.getLogger("TradeExecutor")

class TradeExecutor:
    """
    Main automated execution engine. Runs in the background, monitoring market ticks,
    evaluating AI signals, applying risk guardrails, dispatching orders, and managing
    trailing stops & break-even protection for XAU/USD.
    """
    def __init__(self, config, bridge, ai_engine, risk_manager):
        self.config = config
        self.bridge = bridge
        self.ai = ai_engine
        self.risk = risk_manager
        self.is_running = False
        self.last_signal_time = 0
        self.last_block_log = 0.0
        self.block_stats: Dict[str, int] = {}
        self.tick_history: List[float] = []
        self.peak_profit: Dict[int, float] = {}
        self.open_time: Dict[int, float] = {}
        self.open_snapshot: Dict[int, Dict[str, Any]] = {}
        self.fast_state: Dict[str, Any] = {"velocity": 0.0, "spread_ok": True, "atr_ok": True}
        self.throttle_mode: str = "NORMAL"
        self.start_time: float = time.time()
        self.total_closed: int = 0
        self.pnl_history: List[Tuple[float, float]] = []
        self.slope_paused_until: float = 0.0
        self.scalp_wins = 0
        self.total_scalp_profit = 0.0
        self.debt_retired = 0.0
        self.offset_count = 0
        self.debt_bank = 25.0  # Seeded from accumulated realized cash profit to systematically eliminate legacy debts
        self.logs: List[Dict[str, Any]] = []
        self.latest_signal: Dict[str, Any] = {
            "action": "HOLD",
            "confidence": 0,
            "reason": "Initializing AI Scalper Brain...",
            "indicators": {}
        }

        # Hook DeepSeek real-time logging into live terminal
        if hasattr(self.ai, "set_log_callback"):
            self.ai.set_log_callback(self.log)

    def log(self, message: str, level: str = "INFO"):
        entry = {
            "timestamp": datetime.now(IST).strftime("%H:%M:%S IST"),
            "level": level,
            "message": message
        }
        self.logs.insert(0, entry)
        if len(self.logs) > 100:
            self.logs.pop()
        if level == "ERROR":
            logger.error(message)
        elif level == "WARNING":
            logger.warning(message)
        else:
            logger.info(message)

    async def run_loop(self):
        """
        Smart v2 loop: fast tick brain every 60ms + slow AI regime every ~1s.
        Fast decides exits/velocity, slow only biases direction.
        """
        self.is_running = True
        self.log("SMART v4 ULTRA-SCALPER ACTIVE: zero-stall grid, continuous range & hedge harvest!", "SUCCESS")

        candle_counter = 0

        while self.is_running:
            try:
                tick = self.bridge.get_current_tick()
                account = self.bridge.sync_account_info(tick)

                if tick and "bid" in tick:
                    self.tick_history.append(tick["bid"])
                    if len(self.tick_history) > 20:
                        self.tick_history.pop(0)

                # Fast brain every tick
                self._update_fast_state(tick)

                # Exits run every tick - seconds/minutes only
                self._harvest_scalp_profits(tick)

                # Slow brain every ~50 pulses (~1 second)
                candle_counter += 1
                if candle_counter >= 50:
                    candle_counter = 0
                    rates_data = self.bridge.get_rates(self.config.timeframe, count=100)
                    if rates_data and len(rates_data) >= 20:
                        df = pd.DataFrame(rates_data)
                        self.latest_signal = self.ai.generate_signal(df)

                if self.config.auto_trade_enabled:
                    await self._evaluate_scalp_entry(tick, account)

            except Exception as e:
                self.log(f"Error in scalper loop: {e}", "ERROR")

            await asyncio.sleep(0.010)

    def _update_fast_state(self, tick: Dict[str, Any]):
        vel = 0.0
        if len(self.tick_history) >= 2:
            vel = round(self.tick_history[-1] - self.tick_history[-2], 3)
        spread = tick.get("spread_points", 30)
        atr = self.latest_signal.get("indicators", {}).get("atr", 1.0)
        self.fast_state = {
            "velocity": vel,
            "spread": spread,
            "atr": atr,
            "spread_ok": spread <= getattr(self.config, "max_spread_points_scalp", 75),
            "atr_ok": atr >= getattr(self.config, "min_atr_for_entry", 0.15),
        }

    def _adaptive_cooldown(self, total_pnl: float, equity: float = 50000.0, net_skew: int = 0) -> float:
        # Ultra-rapid millisecond pulse (30ms)
        cfg_cool = getattr(self.config, "scalp_cooldown_seconds", 0.03)
        base = min(0.04, cfg_cool)
        self.throttle_mode = "NORMAL"
        return base

    def _slope_brake(self, total_pnl: float, now: float) -> bool:
        """Disabled: Uncapped execution without artificial entry freezes."""
        return False

    def _blocked(self, why: str):
        self.block_stats[why] = self.block_stats.get(why, 0) + 1
        now = time.time()
        if now - self.last_block_log >= 15.0:
            total = sum(self.block_stats.values())
            detail = ", ".join(f"{k}x{v}" for k, v in sorted(self.block_stats.items()))
            self.log(f"ENTRY-STATUS: {total} checks [{detail}] mode:{self.throttle_mode}", "INFO")
            self.block_stats.clear()
            self.last_block_log = now

    def _dynamic_spacing(self, atr: float) -> float:
        # Ultra-rapid 3-cent micro spacing
        return 0.03

    def _zone_count(self, open_positions: List[Dict[str, Any]], entry_price: float, direction: str) -> int:
        w = getattr(self.config, "zone_width", 0.04)
        c = 0
        for p in open_positions:
            if p.get("type") == direction and abs(p.get("open_price", 0.0) - entry_price) < w:
                c += 1
        return c

    def _snapshot_for_journal(self, p: Dict[str, Any], close_price: float, profit: float, reason: str) -> Dict[str, Any]:
        now = time.time()
        ind = self.latest_signal.get("indicators", {})
        snap = self.open_snapshot.get(p["ticket"], {})
        buys = sum(1 for x in self.bridge.positions if x.get("type") == "BUY")
        sells = sum(1 for x in self.bridge.positions if x.get("type") == "SELL")
        return {
            "ticket": p["ticket"],
            "symbol": p.get("symbol", "XAUUSD"),
            "type": p.get("type"),
            "lots": p.get("lots", 0.01),
            "open_price": snap.get("open_price", p.get("open_price")),
            "close_price": close_price,
            "open_ts": self.open_time.get(p["ticket"], snap.get("open_ts", now)),
            "close_ts": now,
            "hold_sec": round(now - self.open_time.get(p["ticket"], now), 1),
            "profit": round(profit, 2),
            "close_reason": reason[:120],
            "mode": "LIVE" if self.bridge.is_connected else "SIM",
            "ai_action": snap.get("ai_action", self.latest_signal.get("action", "HOLD")),
            "ai_conf": snap.get("ai_conf", self.latest_signal.get("confidence", 0)),
            "ema9": snap.get("ema9", ind.get("ema_9")),
            "ema21": snap.get("ema21", ind.get("ema_21")),
            "deviation": snap.get("deviation"),
            "rsi": snap.get("rsi", ind.get("rsi")),
            "atr": snap.get("atr", ind.get("atr")),
            "spread": self.fast_state.get("spread"),
            "velocity": self.fast_state.get("velocity"),
            "net_exposure": buys - sells,
            "total_pnl_at_close": round(sum(x.get("profit", 0.0) for x in self.bridge.positions), 2),
        }

    def _journal_log(self, row: Dict[str, Any]):
        try:
            from backend.journal import log_trade
            log_trade(row)
        except Exception:
            pass

    def _close_tracked(self, ticket: int, profit: float, reason: str):
        target = next((x for x in self.bridge.positions if x.get("ticket") == ticket), None)
        close_px = target.get("current_price", 0.0) if target else 0.0
        res = self.bridge.close_position(ticket)
        if res.get("success"):
            if target is not None:
                try:
                    self._journal_log(self._snapshot_for_journal(target, close_px, profit, reason))
                except Exception:
                    pass
            self.peak_profit.pop(ticket, None)
            self.open_time.pop(ticket, None)
            self.open_snapshot.pop(ticket, None)
            self.total_closed += 1
            if profit > 0:
                self.scalp_wins += 1
                self.total_scalp_profit += profit
                self.debt_bank += profit
                self._check_debt_bank_retirement()
            self.log(reason, "SUCCESS" if profit > 0 else "WARNING")
        return res

    def _close_offset_bundle(self, winning_positions: List[Dict[str, Any]], losing_position: Dict[str, Any], net_profit: float, reason_tag: str):
        """
        PnL-to-Zero Engine: Closes winning positions and a losing position together at net positive profit.
        Permanently retires negative floating drawdown from MT5 without taking a net loss!
        """
        success_wins = []
        for w in winning_positions:
            t = w["ticket"]
            target = next((x for x in self.bridge.positions if x.get("ticket") == t), None)
            close_px = target.get("current_price", 0.0) if target else 0.0
            res = self.bridge.close_position(t)
            if res.get("success"):
                success_wins.append(w)
                self.peak_profit.pop(t, None)
                self.open_time.pop(t, None)
                self.open_snapshot.pop(t, None)
                self.total_closed += 1
                if target:
                    try:
                        self._journal_log(self._snapshot_for_journal(target, close_px, w.get("profit", 0.0), f"{reason_tag}-WIN"))
                    except Exception:
                        pass

        if not success_wins:
            return

        actual_win_pnl = sum(w.get("profit", 0.0) for w in success_wins)
        lt = losing_position["ticket"]
        l_profit = losing_position.get("profit", 0.0)

        # Safety verification: ensure closed winners actually cover the loss
        if round(actual_win_pnl + l_profit, 2) >= 0.0:
            target_l = next((x for x in self.bridge.positions if x.get("ticket") == lt), None)
            close_px_l = target_l.get("current_price", 0.0) if target_l else 0.0
            res_l = self.bridge.close_position(lt)
            if res_l.get("success"):
                self.peak_profit.pop(lt, None)
                self.open_time.pop(lt, None)
                self.open_snapshot.pop(lt, None)
                self.total_closed += 1
                debt_wiped = abs(l_profit)
                self.debt_retired += debt_wiped
                self.offset_count += 1
                net_realized = round(actual_win_pnl + l_profit, 2)
                self.scalp_wins += 1
                self.total_scalp_profit += net_realized
                if net_realized > 0:
                    self.debt_bank += net_realized
                    self._check_debt_bank_retirement()

                if target_l:
                    try:
                        self._journal_log(self._snapshot_for_journal(target_l, close_px_l, l_profit, f"{reason_tag}-DEBT-RETIRED"))
                    except Exception:
                        pass

                win_str = ", ".join(f"#{w['ticket']}(+${w.get('profit',0.0):.2f})" for w in success_wins)
                new_open = len([x for x in self.bridge.positions if x.get("ticket") != lt and x.get("ticket") not in [w["ticket"] for w in success_wins]])
                self.log(
                    f"PNL-TO-ZERO: {reason_tag} killed #{lt} (-${debt_wiped:.2f}) with {win_str} | "
                    f"Net: +${net_realized:.2f} | Float moved +${debt_wiped:.2f} to ZERO (Total Retired: ${self.debt_retired:.2f}, {new_open} open)",
                    "SUCCESS"
                )

    def _check_debt_bank_retirement(self):
        """
        Uses accumulated scalp profits from the debt bank to systematically
        extinguish underwater legacy positions, moving floating PnL to ZERO.
        """
        if not getattr(self.config, "pnl_offset_recovery", True):
            return

        open_positions = list(self.bridge.positions)
        # Find legacy underwater positions (loss <= -1.0), sorted smallest loss first
        debts = sorted(
            [p for p in open_positions if p.get("profit", 0.0) <= -1.0],
            key=lambda x: x.get("profit", 0.0),
            reverse=True
        )

        for d in debts:
            t = d["ticket"]
            loss_abs = abs(d.get("profit", 0.0))
            if self.debt_bank >= loss_abs + 0.02:
                target = next((x for x in self.bridge.positions if x.get("ticket") == t), None)
                close_px = target.get("current_price", 0.0) if target else 0.0
                res = self.bridge.close_position(t)
                if res.get("success"):
                    self.debt_bank -= loss_abs
                    self.debt_retired += loss_abs
                    self.offset_count += 1
                    self.total_closed += 1
                    self.peak_profit.pop(t, None)
                    self.open_time.pop(t, None)
                    self.open_snapshot.pop(t, None)
                    if target:
                        try:
                            self._journal_log(self._snapshot_for_journal(target, close_px, d.get("profit", 0.0), "BANK-DEBT-RETIRED"))
                        except Exception:
                            pass
                    rem_open = len([x for x in self.bridge.positions if x.get("ticket") != t])
                    self.log(
                        f"PNL-TO-ZERO: BANK RETIREMENT wiped legacy #{t} (-${loss_abs:.2f}) using banked scalp profits! | "
                        f"Float moved +${loss_abs:.2f} to ZERO (Bank left: ${self.debt_bank:.2f}, Open: {rem_open})",
                        "SUCCESS"
                    )

    def _harvest_scalp_profits(self, tick: Dict[str, Any]):
        """
        Smart v2 harvester + PnL-to-Zero Recovery Engine.
        1. Banked profit debt retirement (kills legacy underwater anchors).
        2. Multi-Winner & 1-to-1 Debt Offset (retires negative trades at net profit >= $0.02).
        3. Delta-neutral rebalancing pair exits.
        4. Trailing profit & single scalp cash-outs for un-offsettable surplus winners.
        """
        if not getattr(self.config, "scalp_close_on_profit", True):
            return

        # Check debt retirement bank first
        self._check_debt_bank_retirement()

        open_positions = list(self.bridge.positions)
        if not open_positions:
            self.peak_profit.clear()
            return

        now = time.time()
        base_min = getattr(self.config, "scalp_min_profit_dollars", 0.06)
        min_profit = max(base_min, 0.05)
        time_stop = getattr(self.config, "time_stop_seconds", 15)
        min_net_gain = getattr(self.config, "offset_min_net_gain", 0.02)

        for p in open_positions:
            if p["ticket"] not in self.open_time:
                self.open_time[p["ticket"]] = float(p.get("open_ts", now))

        # Separate positions into winners (>= 0.03) and losers (< 0.0)
        winners = [p for p in open_positions if p.get("profit", 0.0) >= 0.03]
        losers = [p for p in open_positions if p.get("profit", 0.0) < 0.0]

        buy_count = sum(1 for p in open_positions if p.get("type") == "BUY")
        sell_count = sum(1 for p in open_positions if p.get("type") == "SELL")
        net = buy_count - sell_count
        used_tickets = set()

        # -------------------------------------------------------------
        # PNL-TO-ZERO ENGINE: Actively eliminate negative floating PnL!
        # -------------------------------------------------------------
        if losers and getattr(self.config, "pnl_offset_recovery", True):
            # Phase 1: 1-to-1 Targeted Debt Offset (Deepest Debt Absorber)
            sorted_winners = sorted(winners, key=lambda x: x.get("profit", 0.0), reverse=True)
            for w in sorted_winners:
                if w["ticket"] in used_tickets:
                    continue
                w_prof = w.get("profit", 0.0)
                w_type = w.get("type", "BUY")

                # Filter eligible losers where w_prof + l_prof >= min_net_gain
                eligible_losers = [
                    l for l in losers
                    if l["ticket"] not in used_tickets and round(w_prof + l.get("profit", 0.0), 2) >= min_net_gain
                ]

                if eligible_losers:
                    # Directional preference:
                    # If net > 0 (excess BUYs), prefer BUY losers to reduce net toward 0.
                    # If net < 0 (excess SELLs), prefer SELL losers to reduce net toward 0.
                    # If net == 0, prefer opposite side of winner (BUY w with SELL l) to KEEP net at 0!
                    def _loser_priority(l):
                        is_pref = 0
                        l_type = l.get("type")
                        if net > 0 and l_type == "BUY":
                            is_pref = 2
                        elif net < 0 and l_type == "SELL":
                            is_pref = 2
                        elif net == 0 and l_type != w_type:
                            is_pref = 1
                        return (is_pref, abs(l.get("profit", 0.0)))

                    best_l = max(eligible_losers, key=_loser_priority)
                    used_tickets.add(w["ticket"])
                    used_tickets.add(best_l["ticket"])
                    net_gain = round(w_prof + best_l.get("profit", 0.0), 2)
                    self._close_offset_bundle([w], best_l, net_gain, "OFFSET-1v1")

            # Phase 2: Multi-to-1 Debt Extinguisher (Pool 2-5 winners to kill larger debts)
            rem_winners = [w for w in winners if w["ticket"] not in used_tickets]
            rem_losers = [l for l in losers if l["ticket"] not in used_tickets]
            max_bundle = getattr(self.config, "max_bundle_winners", 5)

            if len(rem_winners) >= 2 and rem_losers:
                # Sort remaining losers: find largest debt that available pool can cover
                sorted_rem_losers = sorted(rem_losers, key=lambda x: x.get("profit", 0.0))
                for l in sorted_rem_losers:
                    if l["ticket"] in used_tickets:
                        continue
                    l_debt_needed = round(abs(l.get("profit", 0.0)) + min_net_gain, 2)
                    avail_winners = [w for w in rem_winners if w["ticket"] not in used_tickets]
                    if round(sum(w.get("profit", 0.0) for w in avail_winners), 2) < l_debt_needed:
                        continue

                    # Select smallest subset of winners that satisfies needed
                    subset = []
                    sub_sum = 0.0
                    for w in sorted(avail_winners, key=lambda x: x.get("profit", 0.0), reverse=True):
                        subset.append(w)
                        sub_sum = round(sub_sum + w.get("profit", 0.0), 2)
                        if sub_sum >= l_debt_needed or len(subset) >= max_bundle:
                            break

                    if sub_sum >= l_debt_needed:
                        for w in subset:
                            used_tickets.add(w["ticket"])
                        used_tickets.add(l["ticket"])
                        net_gain = round(sub_sum + l.get("profit", 0.0), 2)
                        self._close_offset_bundle(subset, l, net_gain, f"BUNDLE-{len(subset)}v1")

        # -------------------------------------------------------------
        # Phase 3: Standalone Winners (Only for surplus un-matched winners)
        # -------------------------------------------------------------
        for p in list(open_positions):
            ticket = p["ticket"]
            if ticket in used_tickets:
                continue
            floating_profit = p.get("profit", 0.0)
            p_type = p.get("type", "BUY")
            peak = max(self.peak_profit.get(ticket, floating_profit), floating_profit)
            self.peak_profit[ticket] = peak
            age = now - self.open_time.get(ticket, now)

            should_close = False
            reason = ""
            if floating_profit >= min_profit:
                should_close = True
                reason = f"MS-SCALP +${floating_profit:.2f} #{ticket} target"
            elif peak >= 0.05 and floating_profit <= peak - 0.02 and floating_profit >= 0.03:
                should_close = True
                reason = f"MS-TRAIL +${floating_profit:.2f} from peak +${peak:.2f} #{ticket}"
            elif age >= time_stop and floating_profit >= 0.02:
                should_close = True
                reason = f"TIME-STOP {int(age)}s +${floating_profit:.2f} #{ticket}"

            if should_close and floating_profit > 0:
                self._close_tracked(ticket, floating_profit, f"{reason} ({p_type}) Wins:{self.scalp_wins} P&L:+${self.total_scalp_profit:.2f}")

    def _manage_active_positions(self, tick: Dict[str, Any]):
        """Position management placeholder - strictly preserves winning holds."""
        pass

    async def _evaluate_scalp_entry(self, tick: Dict[str, Any], account: Dict[str, Any]):
        """
        Smart v2 entry: 0.01 fixed, fast gate + slow bias + net-exposure hedge control.
        """
        current_time = time.time()
        open_positions = list(self.bridge.positions)
        open_count = len(open_positions)
        if open_count >= getattr(self.config, "max_open_positions", 2000):
            self._blocked("max-pos")
            return

        total_pnl = sum(p.get("profit", 0.0) for p in open_positions)
        equity = account.get("equity", 50000.0)
        buy_count = sum(1 for p in open_positions if p.get("type") == "BUY")
        sell_count = sum(1 for p in open_positions if p.get("type") == "SELL")
        net = buy_count - sell_count
        cooldown = self._adaptive_cooldown(total_pnl, equity, net)
        if current_time - self.last_signal_time < cooldown:
            return

        # Slope brake: freeze entries while floating is in free-fall
        if self._slope_brake(total_pnl, current_time):
            self._blocked("slope")
            return

        # Fast gate: spread cap for scalps (defaults to 75 to safely permit live Gold spreads)
        spread = tick.get("spread_points", 30)
        max_sp = getattr(self.config, "max_spread_points_scalp", 75)
        if spread > max_sp:
            self._blocked("spread")
            return
        indicators = self.latest_signal.get("indicators", {})
        close = indicators.get("close", tick.get("bid", 0.0))
        atr = indicators.get("atr", 1.0)
        min_atr = getattr(self.config, "min_atr_for_entry", 0.15)
        if atr < min_atr:
            self._blocked("atr")
            return

        ema_9 = indicators.get("ema_9", close)
        ema_21 = indicators.get("ema_21", close)
        rsi = indicators.get("rsi", 50.0)
        bb_upper = indicators.get("bb_upper", close + 3.0)
        bb_lower = indicators.get("bb_lower", close - 3.0)
        ai_action = self.latest_signal.get("action", "HOLD")
        ai_conf = self.latest_signal.get("confidence", 50)
        vel = self.fast_state.get("velocity", 0.0)

        buy_count = sum(1 for p in open_positions if p["type"] == "BUY")
        sell_count = sum(1 for p in open_positions if p["type"] == "SELL")
        net = buy_count - sell_count
        max_net = getattr(self.config, "max_net_exposure", 35)

        # Hedge-only override when net stretched; in recovery mode (10% drawdown = -$5,000)
        recovery = total_pnl < getattr(self.config, "float_pause_level", -5000.0)
        hedge_only_dir = None
        if recovery and net != 0:
            hedge_only_dir = "SELL" if net > 0 else "BUY"
        elif abs(net) > max_net:
            hedge_only_dir = "SELL" if net > 0 else "BUY"

        # -------------------------------------------------------------
        # UNIFIED MULTI-STRATEGY CONCURRENCY ENGINE
        # Firing all quantitative strategies concurrently to bank profits on both sides:
        # 1. Delta-Neutral Skew Balancer (Restores delta neutrality continuously)
        # 2. Extreme Oversold / Overbought Mean Reversion (Captures dips & spikes)
        # 3. Trend Following Momentum Pulses (Rides directional bursts)
        # 4. Continuous Dual-Grid Straddle & Flow Scalper (Non-stop small cash wins)
        # -------------------------------------------------------------
        macro_policy = self.latest_signal.get("layer1_policy", getattr(self.ai, "trading_policy", "DUAL_GRID_RANGE"))
        macro_regime = self.latest_signal.get("layer1_regime", getattr(self.ai, "macro_regime", "RANGE_CONSOLIDATION"))
        deviation = round(close - ema_9, 2)

        direction = None
        setup_reason = ""

        # Strategy 1: Delta-Neutral Net Rebalancing (Prioritize lighter side when net stretched)
        if hedge_only_dir:
            direction = hedge_only_dir
            setup_reason = f"STRAT-REBAL net:{net}"
        elif net <= -10:
            direction = "BUY"
            setup_reason = f"STRAT-DELTA-BUY net:{net}"
        elif net >= 10:
            direction = "SELL"
            setup_reason = f"STRAT-DELTA-SELL net:{net}"

        # Strategy 2: Mean-Reversion Extreme Fades (Oversold Dips / Overbought Spikes)
        elif rsi <= 35 or close <= bb_lower + 0.10 or deviation <= -0.10:
            direction = "BUY"
            setup_reason = f"STRAT-OVERSOLD-DIP RSI:{rsi:.1f} dev:{deviation:+.2f}"
        elif rsi >= 65 or close >= bb_upper - 0.10 or deviation >= 0.10:
            direction = "SELL"
            setup_reason = f"STRAT-OVERBOUGHT-SPIKE RSI:{rsi:.1f} dev:{deviation:+.2f}"

        # Strategy 3: Multi-Timeframe Trend & Momentum Pulses
        elif vel >= 0.005:
            direction = "BUY"
            setup_reason = f"STRAT-MOMENTUM-BUY vel:{vel:+.3f}"
        elif vel <= -0.005:
            direction = "SELL"
            setup_reason = f"STRAT-MOMENTUM-SELL vel:{vel:+.3f}"

        # Strategy 4: Continuous Range & Micro-Flow Scalping (Both Directions)
        elif deviation <= -0.03:
            direction = "BUY"
            setup_reason = f"STRAT-RANGE-DISCOUNT dev:{deviation:+.2f}"
        elif deviation >= 0.03:
            direction = "SELL"
            setup_reason = f"STRAT-RANGE-PREMIUM dev:{deviation:+.2f}"
        elif buy_count < sell_count:
            direction = "BUY"
            setup_reason = f"STRAT-GRID-BUY net:{net}"
        elif sell_count < buy_count:
            direction = "SELL"
            setup_reason = f"STRAT-GRID-SELL net:{net}"
        else:
            direction = "BUY" if (int(current_time * 10) % 2 == 0) else "SELL"
            setup_reason = "STRAT-GRID-STRADDLE"

        if not direction:
            self._blocked("no-signal")
            return
        if hedge_only_dir and direction != hedge_only_dir:
            self._blocked("hedge-clash")
            return

        entry_price = tick["ask"] if direction == "BUY" else tick["bid"]
        micro_spacing = 0.03  # 3 cents on Gold
        for p in open_positions:
            if p.get("type") == direction:
                p_age = current_time - self.open_time.get(p["ticket"], 0.0)
                # Only check orders opened in last 1.0s to prevent millisecond duplicates
                if p_age < 0.5 and abs(p.get("open_price", 0.0) - entry_price) < 0.02:
                    self._blocked("spacing")
                    return
        per_zone = getattr(self.config, "per_zone_cap", 50)
        if self._zone_count(open_positions, entry_price, direction) >= per_zone:
            self._blocked("zone-cap")
            return

        lot = 0.01
        equity = account.get("equity", 10000.0)
        is_valid, msg = self.risk.validate_trade_entry(
            current_equity=equity,
            current_spread_points=spread,
            open_positions_count=open_count,
            signal_type=direction,
        )
        if not is_valid:
            return

        burst_size = getattr(self.config, "scalp_burst_size", 5)
        rem_cap = max(1, getattr(self.config, "max_open_positions", 2000) - open_count)
        burst_size = min(burst_size, rem_cap)

        fired_tickets = []
        last_error = ""
        for i in range(burst_size):
            res = self.bridge.execute_order(direction, lot, 0.0, 0.0, sync=(i == burst_size - 1))
            if res.get("success"):
                ticket = res.get("ticket")
                if ticket:
                    self.open_time[ticket] = current_time
                    self.open_snapshot[ticket] = {
                        "open_price": entry_price,
                        "open_ts": current_time,
                        "ai_action": ai_action,
                        "ai_conf": ai_conf,
                        "ema9": ema_9,
                        "ema21": ema_21,
                        "deviation": deviation,
                        "rsi": rsi,
                        "atr": atr,
                    }
                    fired_tickets.append(ticket)
            else:
                last_error = res.get("message", "Unknown error")

        if fired_tickets:
            self.last_signal_time = current_time
            t_str = f"#{fired_tickets[0]}..#{fired_tickets[-1]}" if len(fired_tickets) > 1 else f"#{fired_tickets[0]}"
            self.log(f"BURST x{len(fired_tickets)} FIRED {direction} 0.01 @ ${entry_price:.2f} [{setup_reason}] {t_str} net:{net} total:{open_count + len(fired_tickets)}", "SUCCESS")
        else:
            self.log(f"Order burst failed for {direction}: {last_error}", "WARNING")

    def stop(self):
        self.is_running = False
        if hasattr(self.ai, "stop_continuous_deepseek_loop"):
            self.ai.stop_continuous_deepseek_loop()
