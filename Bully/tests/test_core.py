import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
import numpy as np
from backend.config import TradingConfig
from backend.ai_engine import GoldAIEngine
from backend.risk_manager import GoldRiskManager
from backend.mt5_bridge import MT5Bridge

def test_risk_manager_lot_calculation():
    config = TradingConfig(risk_percent_per_trade=1.0, lot_size=0.01, use_dynamic_lot=True)
    rm = GoldRiskManager(config)
    
    equity = 10000.0  # $10,000 account
    entry_price = 2650.0
    sl_price = 2645.0  # $5.00 stop loss distance
    
    # 1% risk = $100
    # $5.00 distance * 100 oz contract = $500 risk per 1 lot
    # Lot = $100 / $500 = 0.20 lots
    lot = rm.calculate_lot_size(equity, entry_price, sl_price)
    assert lot == 0.20, f"Expected 0.20 lots, got {lot}"

def test_circuit_breaker():
    config = TradingConfig(max_daily_drawdown_percent=3.0, circuit_breaker_enabled=True)
    rm = GoldRiskManager(config)
    
    # Starting baseline
    rm.update_daily_baseline(10000.0)
    
    # 2% loss -> should not trip
    tripped, reason = rm.check_circuit_breaker(9800.0)
    assert not tripped
    
    # 3.5% loss -> must trip circuit breaker
    tripped, reason = rm.check_circuit_breaker(9650.0)
    assert tripped
    assert "Daily Drawdown Limit Hit" in reason

def test_ai_engine_indicators_and_signals():
    config = TradingConfig()
    engine = GoldAIEngine(config)
    
    # Generate 100 candles
    base = 2650.0
    candles = []
    for i in range(100):
        c = base + np.sin(i / 5.0) * 10.0 + (i * 0.2)
        candles.append({
            "time": 1700000000 + (i * 900),
            "open": c - 0.5,
            "high": c + 1.5,
            "low": c - 1.5,
            "close": c,
            "volume": 250
        })
        
    df = pd.DataFrame(candles)
    signal = engine.generate_signal(df)
    
    assert "action" in signal
    assert "confidence" in signal
    assert "indicators" in signal
    assert "rsi" in signal["indicators"]
    assert "atr" in signal["indicators"]
    assert "ema_9" in signal["indicators"]
    assert "ema_21" in signal["indicators"]
    assert "ema_50" in signal["indicators"]

def test_mt5_bridge_simulation():
    config = TradingConfig(simulation_mode=True)
    bridge = MT5Bridge(config)
    
    tick = bridge.get_current_tick()
    assert "bid" in tick
    assert "ask" in tick
    assert tick["ask"] > tick["bid"]
    
    rates = bridge.get_rates("M15", count=50)
    assert len(rates) == 50
    
    # Test simulated order
    order_res = bridge.execute_order("BUY", 0.05, sl=2640.0, tp=2670.0)
    assert order_res["success"] is True
    assert len(bridge.positions) == 1
    
    # Test close
    ticket = bridge.positions[0]["ticket"]
    close_res = bridge.close_position(ticket)
    assert close_res["success"] is True
    assert len(bridge.positions) == 0

if __name__ == "__main__":
    test_risk_manager_lot_calculation()
    test_circuit_breaker()
    test_ai_engine_indicators_and_signals()
    test_mt5_bridge_simulation()
    print("ALL CORE UNIT TESTS PASSED SUCCESSFULLY!")
