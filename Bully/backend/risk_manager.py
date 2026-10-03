import math
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Tuple

logger = logging.getLogger("RiskManager")

class GoldRiskManager:
    """
    Dedicated Risk Management module specifically calibrated for Gold (XAU/USD).
    Gold Contract: Standard 100 oz per 1.00 lot.
    A $1.00 price movement with 0.01 lot = $1.00 PnL.
    """
    def __init__(self, config):
        self.config = config
        self.daily_start_equity = 0.0
        self.daily_start_date = None
        self.circuit_breaker_tripped = False
        self.circuit_breaker_reason = ""
        self.contract_size = 100.0  # 100 oz per 1 lot standard

    def update_daily_baseline(self, current_equity: float):
        """Resets or initializes the daily equity baseline at midnight or on startup."""
        today = datetime.now(timezone.utc).date()
        if self.daily_start_date != today or self.daily_start_equity <= 0:
            self.daily_start_equity = current_equity
            self.daily_start_date = today
            self.circuit_breaker_tripped = False
            self.circuit_breaker_reason = ""
            logger.info(f"Daily Risk Baseline set to ${current_equity:.2f} for date {today}")

    def check_circuit_breaker(self, current_equity: float) -> Tuple[bool, str]:
        """
        Validates if account drawdown has breached the daily maximum risk threshold.
        Bypassed if circuit breaker guardrail is disabled.
        """
        if not getattr(self.config, "circuit_breaker_enabled", False):
            return False, ""

        self.update_daily_baseline(current_equity)
        
        if self.daily_start_equity <= 0:
            return False, "Baseline not set"

        drawdown_dollars = self.daily_start_equity - current_equity
        drawdown_pct = (drawdown_dollars / self.daily_start_equity) * 100.0

        if drawdown_pct >= self.config.max_daily_drawdown_percent:
            self.circuit_breaker_tripped = True
            self.circuit_breaker_reason = (
                f"Daily Drawdown Limit Hit! Down {drawdown_pct:.2f}% "
                f"(${drawdown_dollars:.2f} loss against ${self.daily_start_equity:.2f} baseline). "
                f"Threshold: {self.config.max_daily_drawdown_percent}%."
            )
            logger.critical(self.circuit_breaker_reason)
            return True, self.circuit_breaker_reason

        return False, ""

    def calculate_lot_size(
        self,
        equity: float,
        entry_price: float,
        sl_price: float,
        min_lot: float = 0.01,
        max_lot: float = 5.0,
        lot_step: float = 0.01
    ) -> float:
        """
        Calculates exact position size in lots based on dollar risk tolerance and ATR-based SL distance.
        Formula:
          Risk Amount ($) = Equity * (Risk_Percent / 100)
          Price Distance ($) = |Entry Price - SL Price|
          Dollar Risk Per Lot = Price Distance * Contract Size (100)
          Lot = Risk Amount / Dollar Risk Per Lot
        """
        if not self.config.use_dynamic_lot:
            return round(self.config.lot_size, 2)

        price_distance = abs(entry_price - sl_price)
        if price_distance <= 0:
            logger.warning("Invalid SL distance for lot calculation. Falling back to minimum lot.")
            return min_lot

        risk_capital = equity * (self.config.risk_percent_per_trade / 100.0)
        risk_per_full_lot = price_distance * self.contract_size

        if risk_per_full_lot <= 0:
            return min_lot

        calculated_lot = risk_capital / risk_per_full_lot
        
        # Snap to broker lot step
        steps = math.floor(calculated_lot / lot_step)
        final_lot = steps * lot_step

        # Enforce bounds
        final_lot = max(min_lot, min(final_lot, max_lot))
        return round(final_lot, 2)

    def validate_trade_entry(
        self,
        current_equity: float,
        current_spread_points: int,
        open_positions_count: int,
        signal_type: str
    ) -> Tuple[bool, str]:
        """
        Performs pre-flight risk checks before any order is dispatched.
        """
        # 1. Circuit Breaker Check (if enabled)
        if getattr(self.config, "circuit_breaker_enabled", False):
            is_tripped, reason = self.check_circuit_breaker(current_equity)
            if is_tripped:
                return False, f"Trade Rejected: Circuit breaker active ({reason})"

        # 2. Open Positions Cap - Respect OctaFX broker ceiling (500 max positions)
        cfg_max = getattr(self.config, "max_open_positions", 480)
        max_pos = min(cfg_max, 480)  # OctaFX hard ceiling is 500; cap at 480 to leave headroom
        if open_positions_count >= max_pos:
            return False, f"Maximum broker limits reached ({open_positions_count}/{max_pos})"

        # 3. High Spread Shield (bypassed or relaxed in scalping mode)
        if not getattr(self.config, "scalping_mode", False):
            if current_spread_points > self.config.max_spread_points:
                return False, f"Trade Rejected: Gold spread too wide ({current_spread_points} pts)"

        # 4. Valid signal
        if signal_type not in ("BUY", "SELL"):
            return False, f"Trade Rejected: Signal is {signal_type}"

        return True, "Passed all filters"

    def calculate_atr_sl_tp(
        self,
        entry_price: float,
        action: str,
        atr_value: float
    ) -> Tuple[float, float]:
        """
        Computes dynamic SL and TP levels.
        In Scalping Mode, SL is 0.0 (no broker stop loss guardrails to avoid premature cuts).
        """
        if getattr(self.config, "scalping_mode", False):
            sl = 0.0
            tp = round(entry_price + 3.00 if action == "BUY" else entry_price - 3.00, 2)
            return sl, tp

        sl_distance = atr_value * self.config.atr_sl_multiplier
        tp_distance = atr_value * self.config.atr_tp_multiplier
        sl_distance = max(sl_distance, 1.50)
        tp_distance = max(tp_distance, 2.50)

        if action == "BUY":
            sl = entry_price - sl_distance
            tp = entry_price + tp_distance
        else:  # SELL
            sl = entry_price + sl_distance
            tp = entry_price - tp_distance

        return round(sl, 2), round(tp, 2)
