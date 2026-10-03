import os
import sqlite3
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List

logger = logging.getLogger("Journal")

def db_path() -> str:
    return os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "trades.db")

SCHEMA = """
CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket INTEGER,
    symbol TEXT,
    type TEXT,
    lots REAL,
    open_price REAL,
    close_price REAL,
    open_ts REAL,
    close_ts REAL,
    hold_sec REAL,
    profit REAL,
    close_reason TEXT,
    mode TEXT,
    ai_action TEXT,
    ai_conf INTEGER,
    ema9 REAL,
    ema21 REAL,
    deviation REAL,
    rsi REAL,
    atr REAL,
    spread INTEGER,
    velocity REAL,
    net_exposure INTEGER,
    total_pnl_at_close REAL
);
"""

def init_db(path: str = None) -> str:
    p = path or db_path()
    try:
        con = sqlite3.connect(p, timeout=5)
        try:
            con.execute("PRAGMA journal_mode=WAL;")
            con.execute(SCHEMA)
            con.commit()
        finally:
            con.close()
    except Exception as e:
        logger.error(f"Journal init failed: {e}")
    return p

def log_trade(row: Dict[str, Any], path: str = None):
    """Never raises. Safe to call from live loop."""
    try:
        p = path or db_path()
        con = sqlite3.connect(p, timeout=5)
        try:
            con.execute(SCHEMA)
            con.execute(
                """INSERT INTO trades
                (ticket,symbol,type,lots,open_price,close_price,open_ts,close_ts,hold_sec,
                 profit,close_reason,mode,ai_action,ai_conf,ema9,ema21,deviation,rsi,atr,
                 spread,velocity,net_exposure,total_pnl_at_close)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    row.get("ticket"), row.get("symbol"), row.get("type"), row.get("lots"),
                    row.get("open_price"), row.get("close_price"), row.get("open_ts"),
                    row.get("close_ts"), row.get("hold_sec"), row.get("profit"),
                    row.get("close_reason"), row.get("mode"), row.get("ai_action"),
                    row.get("ai_conf"), row.get("ema9"), row.get("ema21"),
                    row.get("deviation"), row.get("rsi"), row.get("atr"),
                    row.get("spread"), row.get("velocity"), row.get("net_exposure"),
                    row.get("total_pnl_at_close"),
                ),
            )
            con.commit()
        finally:
            con.close()
    except Exception as e:
        logger.error(f"Journal write failed: {e}")

def recent(limit: int = 20, path: str = None) -> List[Dict[str, Any]]:
    try:
        p = path or db_path()
        if not os.path.exists(p):
            return []
        con = sqlite3.connect(p, timeout=5)
        try:
            con.row_factory = sqlite3.Row
            cur = con.execute("SELECT * FROM trades ORDER BY id DESC LIMIT ?", (limit,))
            return [dict(r) for r in cur.fetchall()]
        finally:
            con.close()
    except Exception:
        return []

def stats(path: str = None) -> Dict[str, Any]:
    try:
        p = path or db_path()
        if not os.path.exists(p):
            return {"count": 0}
        con = sqlite3.connect(p, timeout=5)
        try:
            cur = con.execute("SELECT COUNT(*), COALESCE(SUM(profit),0), COALESCE(AVG(profit),0) FROM trades")
            c, s, a = cur.fetchone()
            return {"count": c, "total_profit": round(s or 0, 2), "avg_profit": round(a or 0, 4)}
        finally:
            con.close()
    except Exception:
        return {"count": 0}
