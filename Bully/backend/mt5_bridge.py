import time
import math
import random
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional, Tuple

logger = logging.getLogger("MT5Bridge")

# Try importing official MetaTrader5 package
try:
    import MetaTrader5 as mt5
    MT5_AVAILABLE = True
except ImportError:
    MT5_AVAILABLE = False
    logger.warning("MetaTrader5 python module not installed or not supported on this platform.")

class MT5Bridge:
    """
    Direct bridge to MetaTrader 5 terminal with symbol normalization for XAU/USD (Gold).
    Includes a realistic fallback market simulator so the GUI and strategy can run
    immediately even when MT5 terminal is offline or in paper trading mode.
    """
    def __init__(self, config):
        self.config = config
        self.is_connected = False
        self.active_symbol = "XAUUSD"
        self.account_info = {
            "login": 0,
            "server": "Demo",
            "balance": 10000.0,
            "equity": 10000.0,
            "margin": 0.0,
            "free_margin": 10000.0,
            "margin_level": 0.0,
            "profit": 0.0,
            "currency": "USD"
        }
        self.positions: List[Dict[str, Any]] = []
        self.trade_history: List[Dict[str, Any]] = []
        
        # Simulator state (Realistic Gold price centered around $2650.00)
        self.sim_price = 2652.50
        self.sim_candles = self._generate_initial_sim_candles(250)
        self.sim_ticket_counter = 10001

    def connect(self, login: int = None, password: str = None, server: str = None, path: str = None) -> Tuple[bool, str]:
        """
        Attempts to initialize and log into the MetaTrader 5 terminal.
        """
        if login is not None:
            self.config.mt5_login = int(login)
        if password is not None:
            self.config.mt5_password = password
        if server is not None:
            self.config.mt5_server = server
        if path is not None and path.strip():
            self.config.mt5_path = path

        if not MT5_AVAILABLE:
            self.is_connected = False
            return False, "MetaTrader5 Python library is not available."

        if self.config.simulation_mode:
            self.is_connected = False
            return True, "Simulation Mode Active. MT5 live bridge is paused."

        init_kwargs = {}
        if self.config.mt5_path:
            init_kwargs["path"] = self.config.mt5_path

        try:
            logger.info("Initializing MetaTrader 5 connection...")
            if not mt5.initialize(**init_kwargs):
                err = mt5.last_error()
                logger.error(f"MT5 initialize failed: {err}")
                self.is_connected = False
                return False, f"MT5 initialize failed: {err}"

            # Login if credentials provided
            if self.config.mt5_login > 0 and self.config.mt5_password:
                authorized = mt5.login(
                    login=self.config.mt5_login,
                    password=self.config.mt5_password,
                    server=self.config.mt5_server
                )
                if not authorized:
                    err = mt5.last_error()
                    logger.error(f"MT5 login failed: {err}")
                    self.is_connected = False
                    return False, f"MT5 login failed: {err}"

            # Resolve broker-specific Gold symbol name
            self.active_symbol = self._resolve_gold_symbol()
            self.is_connected = True
            self.sync_account_info()
            self.sync_trade_history()
            logger.info(f"Connected to MT5 successfully! Active Gold symbol: {self.active_symbol} (Loaded {len(self.trade_history)} closed trades)")
            return True, f"Connected to MT5 ({self.active_symbol})"

        except Exception as e:
            logger.exception("Exception during MT5 connection")
            self.is_connected = False
            return False, str(e)

    def disconnect(self):
        """Disconnects and shuts down MT5 connection."""
        if MT5_AVAILABLE and self.is_connected:
            try:
                mt5.shutdown()
            except Exception:
                pass
        self.is_connected = False

    def _resolve_gold_symbol(self) -> str:
        """Finds the correct symbol name for Gold on the connected broker."""
        candidates = ["XAUUSD", "XAUUSDm", "XAUUSD.pro", "XAUUSD.raw", "GOLD", "XAUUSD_i", "XAUUSD_micro"]
        if not MT5_AVAILABLE or not self.is_connected:
            return "XAUUSD"

        for sym in candidates:
            info = mt5.symbol_info(sym)
            if info is not None:
                mt5.symbol_select(sym, True)
                return sym
        return "XAUUSD"

    def get_current_tick(self) -> Dict[str, Any]:
        """Returns live Bid, Ask, Spread, and Time for Gold."""
        if self.is_connected and MT5_AVAILABLE:
            try:
                tick = mt5.symbol_info_tick(self.active_symbol)
                if tick is not None:
                    bid = float(tick.bid)
                    ask = float(tick.ask)
                    spread_pts = int(round((ask - bid) * 100))  # standard 2 decimals = cents
                    return {
                        "symbol": self.active_symbol,
                        "bid": round(bid, 2),
                        "ask": round(ask, 2),
                        "spread_points": spread_pts,
                        "time": datetime.fromtimestamp(tick.time, timezone.utc).isoformat(),
                        "is_live": True
                    }
            except Exception as e:
                logger.error(f"Error fetching tick from MT5: {e}")

        # Fallback Simulation Tick
        return self._get_simulated_tick()

    def get_rates(self, timeframe_str: str = "M15", count: int = 150) -> List[Dict[str, Any]]:
        """Fetches OHLCV candlestick data."""
        if self.is_connected and MT5_AVAILABLE:
            try:
                tf_map = {
                    "M1": mt5.TIMEFRAME_M1,
                    "M5": mt5.TIMEFRAME_M5,
                    "M15": mt5.TIMEFRAME_M15,
                    "H1": mt5.TIMEFRAME_H1,
                    "D1": mt5.TIMEFRAME_D1
                }
                tf = tf_map.get(timeframe_str, mt5.TIMEFRAME_M15)
                rates = mt5.copy_rates_from_pos(self.active_symbol, tf, 0, count)
                if rates is not None and len(rates) > 0:
                    bars = []
                    for r in rates:
                        bars.append({
                            "time": int(r['time']),
                            "open": round(float(r['open']), 2),
                            "high": round(float(r['high']), 2),
                            "low": round(float(r['low']), 2),
                            "close": round(float(r['close']), 2),
                            "volume": int(r['tick_volume'])
                        })
                    return bars
            except Exception as e:
                logger.error(f"Error fetching rates from MT5: {e}")

        # Fallback Simulated Candles
        return self.sim_candles[-count:]

    def sync_account_info(self, tick: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Synchronizes account balance, equity, and open positions in real-time."""
        if self.is_connected and MT5_AVAILABLE:
            try:
                acc = mt5.account_info()
                if acc is not None:
                    self.account_info = {
                        "login": acc.login,
                        "server": acc.server,
                        "balance": round(acc.balance, 2),
                        "equity": round(acc.equity, 2),
                        "margin": round(acc.margin, 2),
                        "free_margin": round(acc.margin_free, 2),
                        "margin_level": round(acc.margin_level, 2) if acc.margin > 0 else 0.0,
                        "profit": round(acc.profit, 2),
                        "currency": acc.currency
                    }
                
                # Fetch live tick if not provided
                if not tick:
                    tick = self.get_current_tick()

                # Sync positions
                mt5_positions = mt5.positions_get(symbol=self.active_symbol)
                pos_list = []
                total_floating_pnl = 0.0

                if mt5_positions:
                    bid = tick.get("bid", 0.0) if tick else 0.0
                    ask = tick.get("ask", 0.0) if tick else 0.0
                    for p in mt5_positions:
                        is_buy = (p.type == mt5.ORDER_TYPE_BUY)
                        curr_price = bid if is_buy else ask
                        
                        # Real-time tick profit calculation: (Price_Diff) * Volume * 100
                        if curr_price > 0:
                            if is_buy:
                                live_pnl = (bid - p.price_open) * p.volume * 100.0
                            else:
                                live_pnl = (p.price_open - ask) * p.volume * 100.0
                            live_pnl = round(live_pnl, 2)
                        else:
                            curr_price = p.price_current
                            live_pnl = round(p.profit, 2)

                        total_floating_pnl += live_pnl

                        pos_list.append({
                            "ticket": p.ticket,
                            "symbol": p.symbol,
                            "type": "BUY" if is_buy else "SELL",
                            "lots": round(p.volume, 2),
                            "open_price": round(p.price_open, 2),
                            "current_price": round(curr_price, 2),
                            "sl": round(p.sl, 2) if p.sl else 0.0,
                            "tp": round(p.tp, 2) if p.tp else 0.0,
                            "profit": live_pnl,
                            "time": datetime.fromtimestamp(p.time, timezone.utc).strftime("%H:%M:%S"),
                            "open_ts": int(p.time)
                        })

                    # Update account floating profit & equity dynamically with tick speed!
                    total_floating_pnl = round(total_floating_pnl, 2)
                    self.account_info["profit"] = total_floating_pnl
                    self.account_info["equity"] = round(self.account_info["balance"] + total_floating_pnl, 2)
                    self.account_info["free_margin"] = round(self.account_info["equity"] - self.account_info["margin"], 2)

                self.positions = pos_list
                return self.account_info
            except Exception as e:
                logger.error(f"Failed to sync MT5 account: {e}")

        # Simulated account update
        self._update_simulated_positions()
        return self.account_info

    def sync_trade_history(self, days: int = 30) -> List[Dict[str, Any]]:
        """Fetches closed deals from MT5 history and parses them into trade_history."""
        if not MT5_AVAILABLE or not self.is_connected:
            return self.trade_history

        now = time.time()
        if hasattr(self, "_last_history_sync") and (now - self._last_history_sync < 3.0) and self.trade_history:
            return self.trade_history
        self._last_history_sync = now

        try:
            from_date = datetime.now(timezone.utc) - timedelta(days=days)
            to_date = datetime.now(timezone.utc) + timedelta(days=1)
            deals = mt5.history_deals_get(from_date, to_date)
            if not deals:
                return self.trade_history

            # Index entry deals (DEAL_ENTRY_IN) by position_id to get original type and open price
            ins = {d.position_id: d for d in deals if d.entry == mt5.DEAL_ENTRY_IN}
            # Closing deals are DEAL_ENTRY_OUT or DEAL_ENTRY_INOUT
            outs = [d for d in deals if d.entry in (mt5.DEAL_ENTRY_OUT, mt5.DEAL_ENTRY_INOUT)]

            history_list = []
            for out in reversed(outs):  # Newest first
                in_deal = ins.get(out.position_id)
                if in_deal:
                    trade_type = "BUY" if in_deal.type == mt5.DEAL_TYPE_BUY else "SELL"
                    open_price = round(in_deal.price, 2)
                else:
                    trade_type = "BUY" if out.type == mt5.DEAL_TYPE_SELL else "SELL"
                    open_price = round(out.price, 2)

                pnl = round(float(out.profit), 2)
                history_list.append({
                    "ticket": out.position_id,
                    "deal_ticket": out.ticket,
                    "symbol": out.symbol,
                    "type": trade_type,
                    "lots": round(float(out.volume), 2),
                    "open_price": open_price,
                    "close_price": round(float(out.price), 2),
                    "current_price": round(float(out.price), 2),
                    "profit": pnl,
                    "close_time": datetime.fromtimestamp(out.time, timezone.utc).strftime("%H:%M:%S"),
                    "close_date": datetime.fromtimestamp(out.time, timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
                    "won": pnl > 0,
                    "lost": pnl < 0,
                    "breakeven": pnl == 0
                })

            self.trade_history = history_list
            return self.trade_history
        except Exception as e:
            logger.error(f"Failed to sync MT5 trade history: {e}")
            return self.trade_history

    def _get_filling_mode(self) -> int:
        """Determines the broker-supported order filling mode (FOK, IOC, or RETURN)."""
        if not MT5_AVAILABLE or not self.is_connected:
            return 0
        try:
            info = mt5.symbol_info(self.active_symbol)
            if info:
                if info.filling_mode & 1:  # FOK supported (OctaFX standard)
                    return mt5.ORDER_FILLING_FOK
                elif info.filling_mode & 2:  # IOC supported
                    return mt5.ORDER_FILLING_IOC
                elif info.filling_mode & 4:  # RETURN supported
                    return mt5.ORDER_FILLING_RETURN
        except Exception:
            pass
        return mt5.ORDER_FILLING_FOK

    def execute_order(self, action: str, lot_size: float, sl: float = 0.0, tp: float = 0.0, sync: bool = True) -> Dict[str, Any]:
        """
        Dispatches a market order (BUY or SELL) with optional Stop Loss and Take Profit.
        """
        action = action.upper()
        if action not in ("BUY", "SELL"):
            return {"success": False, "message": f"Invalid order action: {action}"}

        tick = self.get_current_tick()
        price = tick["ask"] if action == "BUY" else tick["bid"]

        if self.is_connected and MT5_AVAILABLE:
            try:
                order_type = mt5.ORDER_TYPE_BUY if action == "BUY" else mt5.ORDER_TYPE_SELL
                filling_mode = self._get_filling_mode()
                request = {
                    "action": mt5.TRADE_ACTION_DEAL,
                    "symbol": self.active_symbol,
                    "volume": float(lot_size),
                    "type": order_type,
                    "price": price,
                    "sl": float(sl) if sl > 0 else 0.0,
                    "tp": float(tp) if tp > 0 else 0.0,
                    "deviation": 50,
                    "magic": 987654,
                    "comment": "Bully AI Gold Trader",
                    "type_time": mt5.ORDER_TIME_GTC,
                    "type_filling": filling_mode,
                }
                result = mt5.order_send(request)
                if result.retcode != mt5.TRADE_RETCODE_DONE:
                    return {
                        "success": False,
                        "retcode": result.retcode,
                        "message": f"MT5 order failed with code: {result.retcode} ({result.comment})"
                    }

                if sync:
                    self.sync_account_info()
                return {
                    "success": True,
                    "ticket": result.order,
                    "action": action,
                    "lot": lot_size,
                    "price": result.price,
                    "message": f"MT5 executed {action} {lot_size} lots at ${result.price:.2f}"
                }
            except Exception as e:
                return {"success": False, "message": str(e)}

        # Simulated Order
        return self._execute_simulated_order(action, lot_size, price, sl, tp)

    def execute_burst(self, action: str, count: int = 3, lot_size: float = 0.01) -> List[Dict[str, Any]]:
        """Dispatches an ultra-rapid burst of orders in milliseconds."""
        results = []
        for i in range(count):
            res = self.execute_order(action, lot_size, 0.0, 0.0, sync=(i == count - 1))
            if res.get("success"):
                results.append(res)
        return results

    def close_position(self, ticket: int) -> Dict[str, Any]:
        """Closes a specific open position by its ticket."""
        if self.is_connected and MT5_AVAILABLE:
            try:
                pos = mt5.positions_get(ticket=ticket)
                if not pos:
                    return {"success": False, "message": f"Position {ticket} not found."}
                p = pos[0]
                tick = self.get_current_tick()
                close_type = mt5.ORDER_TYPE_SELL if p.type == mt5.ORDER_TYPE_BUY else mt5.ORDER_TYPE_BUY
                price = tick["bid"] if p.type == mt5.ORDER_TYPE_BUY else tick["ask"]
                filling_mode = self._get_filling_mode()

                request = {
                    "action": mt5.TRADE_ACTION_DEAL,
                    "symbol": p.symbol,
                    "volume": p.volume,
                    "type": close_type,
                    "position": ticket,
                    "price": price,
                    "deviation": 50,
                    "magic": 987654,
                    "comment": "Bully AI Close",
                    "type_time": mt5.ORDER_TIME_GTC,
                    "type_filling": filling_mode,
                }
                res = mt5.order_send(request)
                if res.retcode == mt5.TRADE_RETCODE_DONE:
                    self.sync_account_info()
                    return {"success": True, "ticket": ticket, "message": f"Closed position #{ticket}"}
                return {"success": False, "message": f"MT5 close error: {res.comment}"}
            except Exception as e:
                return {"success": False, "message": str(e)}

        # Simulated Close
        for idx, p in enumerate(self.positions):
            if p["ticket"] == ticket:
                closed = self.positions.pop(idx)
                self.account_info["balance"] += closed["profit"]
                self.account_info["balance"] = round(self.account_info["balance"], 2)
                closed["close_time"] = datetime.now(timezone.utc).strftime("%H:%M:%S")
                self.trade_history.insert(0, closed)
                self._update_simulated_positions()
                return {"success": True, "ticket": ticket, "message": f"Simulated Close #{ticket} (PnL: ${closed['profit']:+.2f})"}

        return {"success": False, "message": f"Ticket #{ticket} not found in positions"}

    def close_all_positions(self) -> Dict[str, Any]:
        """Closes all currently open positions."""
        results = []
        tickets = [p["ticket"] for p in self.positions]
        for t in tickets:
            results.append(self.close_position(t))
        return {"success": True, "closed_count": len(results), "details": results}

    # -------------------------------------------------------------
    # High-Fidelity Simulation Helpers
    # -------------------------------------------------------------
    def _generate_initial_sim_candles(self, count: int) -> List[Dict[str, Any]]:
        """Generates realistic historical M15 Gold candles with realistic ATR waves."""
        now = int(time.time())
        m15_seconds = 15 * 60
        candles = []
        base = 2650.0

        for i in range(count, 0, -1):
            t = now - (i * m15_seconds)
            # Random walk with mean reversion
            drift = (2650.0 - base) * 0.05 + random.uniform(-1.8, 1.8)
            o = round(base, 2)
            c = round(base + drift, 2)
            h = round(max(o, c) + random.uniform(0.3, 2.5), 2)
            l = round(min(o, c) - random.uniform(0.3, 2.5), 2)
            base = c
            candles.append({
                "time": t,
                "open": o,
                "high": h,
                "low": l,
                "close": c,
                "volume": random.randint(120, 850)
            })
        self.sim_price = candles[-1]["close"]
        return candles

    def _get_simulated_tick(self) -> Dict[str, Any]:
        # Micro fluctuations on Gold (0.05 to 0.40 cents)
        change = random.choice([-0.25, -0.15, -0.05, 0.0, 0.05, 0.15, 0.25]) + random.uniform(-0.1, 0.1)
        self.sim_price = round(self.sim_price + change, 2)
        spread = 0.25  # 25 points spread ($0.25)
        bid = round(self.sim_price - (spread / 2), 2)
        ask = round(bid + spread, 2)

        # Update latest candle
        if self.sim_candles:
            last_c = self.sim_candles[-1]
            now = int(time.time())
            if now - last_c["time"] > 15 * 60:
                # New candle
                self.sim_candles.append({
                    "time": now,
                    "open": self.sim_price,
                    "high": self.sim_price,
                    "low": self.sim_price,
                    "close": self.sim_price,
                    "volume": 1
                })
                if len(self.sim_candles) > 300:
                    self.sim_candles.pop(0)
            else:
                last_c["close"] = self.sim_price
                last_c["high"] = max(last_c["high"], self.sim_price)
                last_c["low"] = min(last_c["low"], self.sim_price)
                last_c["volume"] += 1

        return {
            "symbol": "XAUUSD (Sim)",
            "bid": bid,
            "ask": ask,
            "spread_points": 25,
            "time": datetime.now(timezone.utc).isoformat(),
            "is_live": False
        }

    def _execute_simulated_order(self, action: str, lot: float, price: float, sl: float, tp: float) -> Dict[str, Any]:
        ticket = self.sim_ticket_counter
        self.sim_ticket_counter += 1
        pos = {
            "ticket": ticket,
            "symbol": "XAUUSD",
            "type": action,
            "lots": round(lot, 2),
            "open_price": price,
            "current_price": price,
            "sl": sl,
            "tp": tp,
            "profit": 0.0,
            "time": datetime.now(timezone.utc).strftime("%H:%M:%S"),
            "open_ts": int(time.time())
        }
        self.positions.append(pos)
        self._update_simulated_positions()
        return {
            "success": True,
            "ticket": ticket,
            "action": action,
            "lot": lot,
            "price": price,
            "message": f"Simulated {action} {lot} lots executed at ${price:.2f}"
        }

    def _update_simulated_positions(self):
        total_profit = 0.0
        used_margin = 0.0
        contract = 100.0  # 100 oz per lot
        to_close = []

        for p in self.positions:
            curr = self.sim_price
            p["current_price"] = curr
            if p["type"] == "BUY":
                pnl = (curr - p["open_price"]) * p["lots"] * contract
                if p["sl"] > 0 and curr <= p["sl"]:
                    to_close.append((p["ticket"], "SL Hit"))
                elif p["tp"] > 0 and curr >= p["tp"]:
                    to_close.append((p["ticket"], "TP Hit"))
            else:  # SELL
                pnl = (p["open_price"] - curr) * p["lots"] * contract
                if p["sl"] > 0 and curr >= p["sl"]:
                    to_close.append((p["ticket"], "SL Hit"))
                elif p["tp"] > 0 and curr <= p["tp"]:
                    to_close.append((p["ticket"], "TP Hit"))

            p["profit"] = round(pnl, 2)
            total_profit += pnl
            # Margin on Gold (typically 1:100 leverage = 1% margin requirement)
            used_margin += (p["lots"] * contract * p["open_price"]) / 100.0

        for ticket, reason in to_close:
            logger.info(f"Simulated position #{ticket} auto-closed: {reason}")
            self.close_position(ticket)

        equity = round(self.account_info["balance"] + total_profit, 2)
        self.account_info["equity"] = equity
        self.account_info["profit"] = round(total_profit, 2)
        self.account_info["margin"] = round(used_margin, 2)
        self.account_info["free_margin"] = round(equity - used_margin, 2)
        self.account_info["margin_level"] = round((equity / used_margin * 100.0), 2) if used_margin > 0 else 0.0
