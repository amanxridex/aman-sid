import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv(override=True)

class TradingConfig(BaseModel):
    # MetaTrader 5 Connection (Live Broker)
    mt5_login: int = int(os.getenv("MT5_LOGIN", "213927008"))
    mt5_password: str = os.getenv("MT5_PASSWORD", "2y%R4dGY")
    mt5_server: str = os.getenv("MT5_SERVER", "OctaFX-Demo")
    mt5_path: str = os.getenv("MT5_PATH", r"C:\Program Files\MetaTrader 5\terminal64.exe")
    simulation_mode: bool = os.getenv("SIMULATION_MODE", "false").lower() in ("true", "1", "yes")

    # AI Brain (DeepSeek via NVIDIA API)
    nvidia_api_key: str = os.getenv("NVIDIA_API_KEY", "")
    deepseek_model: str = os.getenv("DEEPSEEK_MODEL", "deepseek-ai/deepseek-v4.1-flash")
    use_deepseek: bool = os.getenv("USE_DEEPSEEK", "true").lower() in ("true", "1", "yes")

    # Instrument (XAU/USD ONLY)
    symbol: str = os.getenv("SYMBOL", "XAUUSD")
    timeframe: str = os.getenv("TIMEFRAME", "M1")  # Scalping defaults to M1
    lot_size: float = 0.01  # ALWAYS strictly 0.01 as instructed by user
    use_dynamic_lot: bool = False  # Fixed 0.01 lot size permanently
    
    # Ultra-Fast Scalping Engine Settings (Hedge Fund Multi-Position Grid)
    scalping_mode: bool = True
    scalp_close_on_profit: bool = True
    scalp_min_profit_dollars: float = float(os.getenv("SCALP_MIN_PROFIT", "0.06"))  # Millisecond exit at +$0.06
    scalp_trailing_profit: bool = True  # Dynamic trailing profit lock
    pyramid_only_in_profit: bool = False
    allow_hedging: bool = True  # Delta-Neutral Multi-Position Hedging Grid
    scalp_cooldown_seconds: float = float(os.getenv("SCALP_COOLDOWN", "0.03"))  # Ultra-rapid 30ms pulse
    scalp_burst_size: int = int(os.getenv("SCALP_BURST_SIZE", "5"))
    max_open_positions: int = 2000  # Up to 2,000 positions as requested by user!

    # Smart v2 gates (seconds/minutes small-profit engine)
    max_spread_points_scalp: int = int(os.getenv("MAX_SPREAD_SCALP", "75"))
    min_atr_for_entry: float = float(os.getenv("MIN_ATR_ENTRY", "0.15"))
    time_stop_seconds: int = int(os.getenv("TIME_STOP_SEC", "15"))
    max_net_exposure: int = int(os.getenv("MAX_NET_EXPOSURE", "35"))
    base_cooldown_seconds: float = float(os.getenv("BASE_COOLDOWN", "0.03"))
    throttle_cooldown_seconds: float = float(os.getenv("THROTTLE_COOLDOWN", "0.05"))
    per_zone_cap: int = int(os.getenv("PER_ZONE_CAP", "50"))
    zone_width: float = float(os.getenv("ZONE_WIDTH", "0.04"))

    # Floating-PnL containment & PnL-to-Zero Offset Engine (10% Drawdown Ceiling = $5,000)
    float_throttle_level: float = float(os.getenv("FLOAT_THROTTLE", "-3500.0"))
    float_pause_level: float = float(os.getenv("FLOAT_PAUSE", "-5000.0"))
    float_slope_window: float = float(os.getenv("FLOAT_SLOPE_WINDOW", "60.0"))
    float_slope_limit: float = float(os.getenv("FLOAT_SLOPE_LIMIT", "-100.0"))
    pnl_offset_recovery: bool = os.getenv("PNL_OFFSET_RECOVERY", "false").lower() in ("true", "1", "yes")  # Disabled: ONLY close in profit, zero loss closures
    offset_min_net_gain: float = float(os.getenv("OFFSET_MIN_NET_GAIN", "0.02"))  # Strictly positive net gain per offset
    max_bundle_winners: int = int(os.getenv("MAX_BUNDLE_WINNERS", "5"))  # Max winning legs to bundle for 1 deep debt

    
    # Guardrails Removed as requested by user
    circuit_breaker_enabled: bool = False  # Disabled
    max_daily_drawdown_percent: float = 10.0  # 10% daily drawdown limit as requested by user!
    max_spread_points: int = 500  # Relaxed to prevent blocking entries
    risk_percent_per_trade: float = 1.0
    
    # Scalp Targets (Points / Cents in Gold)
    scalp_sl_points: float = 0.0  # ZERO STOP LOSS - No premature loss guardrails!
    scalp_tp_points: float = 3.00  # Target TP ($3.00)
    atr_period: int = 14
    atr_sl_multiplier: float = 1.2
    atr_tp_multiplier: float = 1.5
    trailing_stop_enabled: bool = True
    break_even_at_r: float = 0.5
    
    # Auto-Trader Master Switch
    auto_trade_enabled: bool = True  # Fully active and firing!

config = TradingConfig()
