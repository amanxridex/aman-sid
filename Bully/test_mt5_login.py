import MetaTrader5 as mt5
from backend.config import config

def test_login():
    print(f"Connecting to MT5...")
    print(f"Server: {config.mt5_server}")
    print(f"Account: {config.mt5_login}")
    
    # Initialize MT5
    if not mt5.initialize():
        print(f"FAILED to initialize MT5 terminal: {mt5.last_error()}")
        print("\nPlease make sure MetaTrader 5 is installed on this PC and launched.")
        return False
        
    print("MT5 Terminal detected and initialized successfully!")
    
    # Attempt login to OctaFX-Demo
    authorized = mt5.login(
        login=config.mt5_login,
        password=config.mt5_password,
        server=config.mt5_server
    )
    
    if not authorized:
        print(f"FAILED to login to {config.mt5_server}: {mt5.last_error()}")
        return False
        
    print("\n" + "="*50)
    print("  LOGIN SUCCESSFUL! CONNECTED TO REAL BROKER")
    print("="*50)
    
    acc = mt5.account_info()
    print(f"Account Name: {acc.name}")
    print(f"Broker: {acc.company}")
    print(f"Server: {acc.server}")
    print(f"Balance: ${acc.balance:.2f} {acc.currency}")
    print(f"Equity: ${acc.equity:.2f} {acc.currency}")
    print(f"Leverage: 1:{acc.leverage}")
    
    # Check Gold symbol
    symbols = ["XAUUSD", "XAUUSDm", "GOLD"]
    for s in symbols:
        info = mt5.symbol_info(s)
        if info:
            mt5.symbol_select(s, True)
            tick = mt5.symbol_info_tick(s)
            print(f"\nLive Real Gold Symbol Found: '{s}'")
            if tick:
                print(f"Live Real BID: ${tick.bid:.2f} | ASK: ${tick.ask:.2f} | Spread: {round((tick.ask - tick.bid)*100)} pts")
            break
            
    mt5.shutdown()
    return True

if __name__ == "__main__":
    test_login()
