import urllib.request
import json
import time

for attempt in range(3):
    try:
        with urllib.request.urlopen("http://127.0.0.1:8000/api/status", timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            acc = data.get("account", {})
            scalp = data.get("scalp_stats", {})
            ai = data.get("deepseek_stats", {})
            pos = data.get("positions", [])
            buys = sum(1 for p in pos if p.get("type") == "BUY")
            sells = sum(1 for p in pos if p.get("type") == "SELL")
            total_float = sum(p.get("profit", 0.0) for p in pos)
            
            print(f"=== LIVE ACCOUNT SNAPSHOT (Attempt {attempt+1}) ===")
            print(f"Balance: ${acc.get('balance', 0):,.2f}")
            print(f"Equity: ${acc.get('equity', 0):,.2f}")
            print(f"Floating Drawdown: ${total_float:,.2f}")
            print(f"Open Positions: {len(pos)} (BUYS: {buys}, SELLS: {sells}, Net: {buys-sells})")
            print(f"Scalp Wins: {scalp.get('scalp_wins')} (+${scalp.get('total_scalp_profit', 0):.2f})")
            print(f"Debt Retired: ${scalp.get('debt_retired', 0):.2f}")
            print(f"Debt Bank Left: ${scalp.get('debt_bank', 0):.2f}")
            break
    except Exception as e:
        time.sleep(0.5)
