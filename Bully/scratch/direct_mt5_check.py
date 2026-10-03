import MetaTrader5 as mt5

if not mt5.initialize():
    print(f"Failed to initialize MT5: {mt5.last_error()}")
    exit()

acc = mt5.account_info()
pos = mt5.positions_get(symbol="XAUUSD")
buys = [p for p in pos if p.type == 0]
sells = [p for p in pos if p.type == 1]
total_float = sum(p.profit for p in pos)

print(f"=== MT5 DIRECT BROKER STATUS ===")
print(f"Account: {acc.login} ({acc.server})")
print(f"Balance: ${acc.balance:,.2f}")
print(f"Equity: ${acc.equity:,.2f}")
print(f"Floating Drawdown: ${total_float:,.2f}")
print(f"Total Open: {len(pos)} (BUYS: {len(buys)}, SELLS: {len(sells)}, Net: {len(buys)-len(sells)})")

mt5.shutdown()
