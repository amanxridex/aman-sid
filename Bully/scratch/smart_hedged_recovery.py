import MetaTrader5 as mt5
import time

def run_recovery(max_pairs=None, close_excess=False):
    if not mt5.initialize():
        print("MT5 initialization failed")
        return

    account = mt5.account_info()
    positions = mt5.positions_get(symbol="XAUUSD")
    if not positions:
        print("No open positions found.")
        mt5.shutdown()
        return

    print("=== BEFORE RECOVERY ===")
    print(f"Balance: ${account.balance:.2f} | Equity: ${account.equity:.2f} | Floating PnL: ${account.profit:.2f}")
    print(f"Total Open Positions: {len(positions)}")

    buys = sorted([p for p in positions if p.type == mt5.ORDER_TYPE_BUY], key=lambda x: x.price_open)
    sells = sorted([p for p in positions if p.type == mt5.ORDER_TYPE_SELL], key=lambda x: x.price_open, reverse=True)

    pairs_count = min(len(buys), len(sells))
    if max_pairs is not None:
        pairs_count = min(pairs_count, max_pairs)

    print(f"\nExecuting Smart Paired Closure for {pairs_count} pairs...")
    
    closed_pairs = 0
    total_net_realized = 0.0

    def close_ticket(ticket, p_type, volume, symbol):
        tick = mt5.symbol_info_tick(symbol)
        price = tick.bid if p_type == mt5.ORDER_TYPE_BUY else tick.ask
        order_type = mt5.ORDER_TYPE_SELL if p_type == mt5.ORDER_TYPE_BUY else mt5.ORDER_TYPE_BUY
        req = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": symbol,
            "volume": volume,
            "type": order_type,
            "position": ticket,
            "price": price,
            "deviation": 50,
            "magic": 987654,
            "comment": "Smart Paired Close",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
        }
        res = mt5.order_send(req)
        if res.retcode != mt5.TRADE_RETCODE_DONE:
            req["type_filling"] = mt5.ORDER_FILLING_FOK
            res = mt5.order_send(req)
        return res

    for i in range(pairs_count):
        b = buys[i]
        s = sells[i]
        pair_loss = b.profit + s.profit

        res_b = close_ticket(b.ticket, b.type, b.volume, b.symbol)
        res_s = close_ticket(s.ticket, s.type, s.volume, s.symbol)

        if res_b.retcode == mt5.TRADE_RETCODE_DONE and res_s.retcode == mt5.TRADE_RETCODE_DONE:
            closed_pairs += 1
            total_net_realized += pair_loss
            print(f"[{closed_pairs}/{pairs_count}] Closed BUY #{b.ticket} & SELL #{s.ticket} | Pair PnL: ${pair_loss:.2f}")
        else:
            print(f"Failed to close pair #{b.ticket}/#{s.ticket}: B={res_b.retcode}, S={res_s.retcode}")

    if close_excess and len(sells) > len(buys):
        excess_sells = sells[pairs_count:]
        print(f"\nClosing {len(excess_sells)} remaining unhedged SELL positions...")
        for s in excess_sells:
            res_s = close_ticket(s.ticket, s.type, s.volume, s.symbol)
            if res_s.retcode == mt5.TRADE_RETCODE_DONE:
                print(f"Closed Excess SELL #{s.ticket} (PnL: ${s.profit:.2f})")

    time.sleep(1.0)
    acc_after = mt5.account_info()
    pos_after = mt5.positions_get(symbol="XAUUSD")
    rem_count = len(pos_after) if pos_after else 0

    print("\n=== AFTER RECOVERY ===")
    print(f"Balance: ${acc_after.balance:.2f} | Equity: ${acc_after.equity:.2f} | Floating PnL: ${acc_after.profit:.2f}")
    print(f"Remaining Open Positions: {rem_count}")
    print(f"Net Realized Profit Above $50k Starting Capital: ${acc_after.balance - 50000.0:.2f}")
    print(f"Drawdown relative to peak: {max(0, acc_after.balance - acc_after.equity):.2f}")

    mt5.shutdown()

if __name__ == "__main__":
    import sys
    count = int(sys.argv[1]) if len(sys.argv) > 1 else None
    close_all = "--all" in sys.argv
    run_recovery(max_pairs=count, close_excess=close_all)
