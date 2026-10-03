import os
import sys
import uvicorn
import webbrowser
import threading
import time

def open_browser():
    time.sleep(1.5)
    print("\n" + "="*60)
    print("  ★ AURA GOLD AI TRADING TERMINAL (XAU/USD ONLY) ★")
    print("  Web Dashboard: http://localhost:8000")
    print("  MT5 IPC Bridge: Active")
    print("="*60 + "\n")
    try:
        webbrowser.open("http://localhost:8000")
    except Exception:
        pass

if __name__ == "__main__":
    threading.Thread(target=open_browser, daemon=True).start()
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=False, log_level="info")
