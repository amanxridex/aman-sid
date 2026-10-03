"""Offline 0.01 hedged-scalp backtester. Never touches live trading."""
import argparse
import pandas as pd
from typing import Dict, Any, List


def run_backtest(candles: List[Dict[str, Any]], params: Dict[str, Any] = None) -> Dict[str, Any]:
    p = params or {}
    min_profit = p.get("min_profit", 0.15)
    pair_min = p.get("pair_min", 0.15)
    basket_min = p.get("basket_min", 0.20)
    basket_leg = p.get("basket_leg", 0.05)
    trail_peak = p.get("trail_peak", 0.12)
    trail_slip = p.get("trail_slip", 0.04)
    trail_lock = p.get("trail_lock", 0.06)
    time_stop = p.get("time_stop", 75)
    spacing = p.get("spacing", 0.04)
    max_pos = p.get("max_pos", 500)
    spread = p.get("spread", 0.25)

    positions: List[Dict[str, Any]] = []
    peak: Dict[int, float] = {}
    opened_at: Dict[int, float] = {}
    ticket = 1
    wins = 0
    profit = 0.0
    t = 0.0

    def pnl(pos, px):
        d = (px - pos["open"]) if pos["side"] == "BUY" else (pos["open"] - px)
        return round(d * 0.01 * 100.0, 2)

    for c in candles:
        for px in (c["open"], c["high"], c["low"], c["close"]):
            t += 1.0
            # exits
            for pos in list(positions):
                pr = pnl(pos, px)
                peak[pos["id"]] = max(peak.get(pos["id"], pr), pr)
                pk = peak[pos["id"]]
                age = t - opened_at[pos["id"]]
                if pr >= min_profit or (pk >= trail_peak and pr <= pk - trail_slip and pr >= trail_lock) or (age >= time_stop and pr >= 0.02):
                    positions.remove(pos)
                    peak.pop(pos["id"], None)
                    opened_at.pop(pos["id"], None)
                    wins += 1
                    profit += pr
            # basket
            tot = sum(pnl(x, px) for x in positions)
            if tot >= basket_min and len(positions) >= 2:
                for pos in list(positions):
                    if pnl(pos, px) >= basket_leg:
                        positions.remove(pos)
                        wins += 1
                        profit += pnl(pos, px)
            # entries: alternate to mimic hedge grid
            if len(positions) < max_pos:
                side = "BUY" if (len(positions) % 2 == 0) else "SELL"
                ep = px + spread / 2 if side == "BUY" else px - spread / 2
                if not any(x["side"] == side and abs(x["open"] - ep) < spacing for x in positions):
                    positions.append({"id": ticket, "side": side, "open": ep})
                    peak[ticket] = 0.0
                    opened_at[ticket] = t
                    ticket += 1

    open_pnl = 0.0
    if positions:
        last = candles[-1]["close"]
        open_pnl = round(sum(pnl(x, last) for x in positions), 2)
    return {
        "closed": wins,
        "profit": round(profit, 2),
        "open_count": len(positions),
        "open_pnl": open_pnl,
        "total": round(profit + open_pnl, 2),
    }


def load_mt5_candles(symbol="XAUUSD", timeframe="M1", count=2000):
    try:
        import MetaTrader5 as mt5
        tf = getattr(mt5, f"TIMEFRAME_{timeframe}")
        rates = mt5.copy_rates_from_pos(symbol, tf, 0, count)
        if rates is None:
            return []
        return [{"open": float(r["open"]), "high": float(r["high"]), "low": float(r["low"]), "close": float(r["close"]), "time": int(r["time"])} for r in rates]
    except Exception:
        return []


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--live-mt5", action="store_true", help="Load real MT5 candles instead of synthetic")
    ap.add_argument("--count", type=int, default=2000)
    args = ap.parse_args()

    if args.live_mt5:
        candles = load_mt5_candles(count=args.count)
        if not candles:
            print("No MT5 candles available")
            raise SystemExit(1)
    else:
        import math
        candles = []
        base = 2650.0
        for i in range(1000):
            c = base + math.sin(i / 20.0) * 3.0
            candles.append({"open": c, "high": c + 0.8, "low": c - 0.8, "close": c + 0.2, "time": i})

    base_params = {"min_profit": 0.15, "spacing": 0.04, "time_stop": 75}
    r0 = run_backtest(candles, base_params)
    print("BASE:", r0)
    for mp in (0.10, 0.12, 0.15, 0.20):
        r = run_backtest(candles, {**base_params, "min_profit": mp})
        print(f"min_profit={mp}:", r)
