import os
import asyncio
import json
import logging
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.config import config
from backend.mt5_bridge import MT5Bridge
from backend.ai_engine import GoldAIEngine
from backend.risk_manager import GoldRiskManager
from backend.trade_executor import TradeExecutor

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("App")

bridge = MT5Bridge(config)
ai_engine = GoldAIEngine(config)
risk_manager = GoldRiskManager(config)
executor = TradeExecutor(config, bridge, ai_engine, risk_manager)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

ws_manager = ConnectionManager()

# Background broadcast task
async def market_broadcast_worker():
    broadcast_ticks = 0
    while True:
        try:
            tick = bridge.get_current_tick()
            account = bridge.sync_account_info(tick)
            positions = bridge.positions
            signal = executor.latest_signal
            rates = bridge.get_rates(config.timeframe, count=1)
            latest_bar = rates[-1] if rates else None

            # Periodically sync closed trades from MT5 every ~2s (10 ticks)
            broadcast_ticks += 1
            if broadcast_ticks % 10 == 0:
                bridge.sync_trade_history()

            payload = {
                "type": "market_update",
                "tick": tick,
                "account": account,
                "positions": positions,
                "history": bridge.trade_history,
                "signal": signal,
                "latest_bar": latest_bar,
                "auto_trade_enabled": config.auto_trade_enabled,
                "is_connected": bridge.is_connected,
                "symbol": bridge.active_symbol,
                "scalp_stats": {
                    "scalp_wins": executor.scalp_wins,
                    "total_scalp_profit": round(executor.total_scalp_profit, 2),
                    "debt_retired": round(getattr(executor, "debt_retired", 0.0), 2),
                    "debt_bank": round(getattr(executor, "debt_bank", 0.0), 2),
                    "offset_count": getattr(executor, "offset_count", 0),
                    "scalping_mode": config.scalping_mode,
                    "scalp_close_on_profit": config.scalp_close_on_profit,
                    "scalp_min_profit_dollars": config.scalp_min_profit_dollars,
                    "max_positions": config.max_open_positions
                },
                "deepseek_stats": ai_engine.get_stats(),
                "logs": executor.logs[:15]
            }
            await ws_manager.broadcast(payload)
        except Exception as e:
            logger.error(f"Error in broadcast worker: {e}")
        await asyncio.sleep(0.2)  # High-speed 200ms broadcast

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Try connecting to MT5 if configured
    if not config.simulation_mode and config.mt5_login > 0:
        bridge.connect()
    else:
        logger.info("Starting in Simulation / Paper Trading mode for Gold XAU/USD.")

    # Start background executor loop and broadcast worker
    trading_task = asyncio.create_task(executor.run_loop())
    broadcast_task = asyncio.create_task(market_broadcast_worker())

    yield

    # Shutdown
    executor.stop()
    trading_task.cancel()
    broadcast_task.cancel()
    bridge.disconnect()

app = FastAPI(title="AURA Gold XAU/USD AI AutoTrader", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class ConnectRequest(BaseModel):
    login: int
    password: str
    server: str
    path: Optional[str] = ""
    simulation_mode: bool = False

class TradeRequest(BaseModel):
    action: str  # BUY or SELL
    lot_size: Optional[float] = None
    sl: Optional[float] = 0.0
    tp: Optional[float] = 0.0

class BurstRequest(BaseModel):
    action: str  # BUY or SELL
    burst_count: int = 3
    lot_size: float = 0.01

class CloseRequest(BaseModel):
    ticket: Optional[int] = None
    close_all: bool = False

class SettingsRequest(BaseModel):
    auto_trade_enabled: Optional[bool] = None
    risk_percent: Optional[float] = None
    lot_size: Optional[float] = None
    timeframe: Optional[str] = None
    max_drawdown_percent: Optional[float] = None
    use_dynamic_lot: Optional[bool] = None
    scalping_mode: Optional[bool] = None
    scalp_close_on_profit: Optional[bool] = None
    scalp_min_profit_dollars: Optional[float] = None
    scalp_cooldown_seconds: Optional[float] = None
    scalp_burst_size: Optional[int] = None
    max_open_positions: Optional[int] = None

# REST Endpoints
@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "symbol": bridge.active_symbol, "connected": bridge.is_connected}

@app.get("/api/status")
async def get_status():
    bridge.sync_trade_history()
    rates = bridge.get_rates(config.timeframe, count=150)
    return {
        "status": "online",
        "symbol": bridge.active_symbol,
        "is_connected": bridge.is_connected,
        "simulation_mode": config.simulation_mode,
        "account": bridge.sync_account_info(),
        "positions": bridge.positions,
        "history": bridge.trade_history,
        "config": config.dict(),
        "signal": executor.latest_signal,
        "scalp_stats": {
            "scalp_wins": executor.scalp_wins,
            "total_scalp_profit": round(executor.total_scalp_profit, 2),
            "debt_retired": round(getattr(executor, "debt_retired", 0.0), 2),
            "debt_bank": round(getattr(executor, "debt_bank", 0.0), 2),
            "offset_count": getattr(executor, "offset_count", 0),
            "scalping_mode": config.scalping_mode,
            "scalp_close_on_profit": config.scalp_close_on_profit,
            "scalp_min_profit_dollars": config.scalp_min_profit_dollars,
            "max_positions": config.max_open_positions
        },
        "deepseek_stats": ai_engine.get_stats(),
        "logs": executor.logs[:50]
    }

@app.get("/api/history")
async def get_full_history():
    bridge.sync_trade_history(days=30)
    return {
        "total": len(bridge.trade_history),
        "history": bridge.trade_history
    }

@app.get("/api/candles")
async def get_candles(timeframe: str = "M15", count: int = 200):
    rates = bridge.get_rates(timeframe, count=count)
    return {"symbol": bridge.active_symbol, "timeframe": timeframe, "candles": rates}

@app.post("/api/connect")
async def connect_mt5(req: ConnectRequest):
    config.simulation_mode = req.simulation_mode
    if req.simulation_mode:
        bridge.disconnect()
        executor.log("Switched to Paper Trading / Simulation Mode.")
        return {"success": True, "message": "Simulation Mode activated for XAU/USD."}

    success, message = bridge.connect(
        login=req.login,
        password=req.password,
        server=req.server,
        path=req.path
    )
    if success:
        executor.log(f"Successfully connected to MT5 ({req.server}) - Symbol: {bridge.active_symbol}", "SUCCESS")
    else:
        executor.log(f"MT5 Connection Failed: {message}", "ERROR")

    return {"success": success, "message": message, "is_connected": bridge.is_connected}

@app.post("/api/trade")
async def execute_trade(req: TradeRequest):
    tick = bridge.get_current_tick()
    entry_price = tick["ask"] if req.action.upper() == "BUY" else tick["bid"]
    
    # Calculate SL/TP if not explicitly provided
    sl = req.sl or 0.0
    tp = req.tp or 0.0
    if sl == 0.0 or tp == 0.0:
        atr = executor.latest_signal.get("indicators", {}).get("atr", 3.50)
        calc_sl, calc_tp = risk_manager.calculate_atr_sl_tp(entry_price, req.action.upper(), atr)
        if sl == 0.0:
            sl = calc_sl
        if tp == 0.0:
            tp = calc_tp

    # Lot size
    if req.lot_size and req.lot_size > 0:
        lot = round(req.lot_size, 2)
    else:
        lot = risk_manager.calculate_lot_size(bridge.account_info["equity"], entry_price, sl)

    res = bridge.execute_order(req.action.upper(), lot, sl, tp)
    if res.get("success"):
        executor.log(f"Manual Trade: {req.action.upper()} {lot} lots @ ${entry_price:.2f} (SL: ${sl:.2f}, TP: ${tp:.2f})", "SUCCESS")
    else:
        executor.log(f"Manual Trade Failed: {res.get('message')}", "ERROR")

    return res

@app.post("/api/close")
async def close_trade(req: CloseRequest):
    if req.close_all:
        res = bridge.close_all_positions()
        executor.log(f"Emergency Action: Closed all {res.get('closed_count', 0)} open positions!", "WARNING")
        return res
    if req.ticket:
        res = bridge.close_position(req.ticket)
        executor.log(f"Closed Position #{req.ticket}: {res.get('message')}")
        return res
    raise HTTPException(status_code=400, detail="Must provide ticket or close_all=true")

@app.post("/api/close-profit")
async def close_profitable_trades():
    """Immediately harvests and locks all trades currently in profit."""
    closed = []
    total_harvested = 0.0
    for p in list(bridge.positions):
        profit = p.get("profit", 0.0)
        if profit > 0:
            res = bridge.close_position(p["ticket"])
            if res.get("success"):
                closed.append(p["ticket"])
                total_harvested += profit
    executor.log(f"⚡ Instant Profit Lock: Closed {len(closed)} profitable positions (+${total_harvested:.2f})!", "SUCCESS")
    return {"success": True, "closed_tickets": closed, "count": len(closed), "profit": round(total_harvested, 2)}

@app.post("/api/rapid-burst")
async def execute_rapid_burst(req: BurstRequest):
    """Fires multiple market orders in rapid sequence (sub-second scalping burst)."""
    results = []
    tick = bridge.get_current_tick()
    entry_price = tick["ask"] if req.action.upper() == "BUY" else tick["bid"]
    atr = executor.latest_signal.get("indicators", {}).get("atr", 2.0)
    sl, tp = risk_manager.calculate_atr_sl_tp(entry_price, req.action.upper(), atr)
    
    count = max(1, min(req.burst_count, 5))
    for _ in range(count):
        res = bridge.execute_order(req.action.upper(), req.lot_size, sl, tp)
        results.append(res)
    
    success_count = sum(1 for r in results if r.get("success"))
    executor.log(f"⚡ RAPID BURST: Fired {success_count}/{count} {req.action.upper()} scalps within milliseconds!", "SUCCESS")
    return {"success": True, "results": results, "fired": success_count}

@app.post("/api/settings")
async def update_settings(req: SettingsRequest):
    if req.auto_trade_enabled is not None:
        config.auto_trade_enabled = req.auto_trade_enabled
        status_txt = "ENABLED" if config.auto_trade_enabled else "PAUSED"
        executor.log(f"Auto-Trader Master Switch set to: {status_txt}", "SUCCESS" if config.auto_trade_enabled else "WARNING")

    if req.scalping_mode is not None:
        config.scalping_mode = req.scalping_mode
        executor.log(f"Scalping Mode {'ENABLED' if req.scalping_mode else 'DISABLED'}", "SUCCESS")

    if req.scalp_close_on_profit is not None:
        config.scalp_close_on_profit = req.scalp_close_on_profit

    if req.scalp_min_profit_dollars is not None:
        config.scalp_min_profit_dollars = req.scalp_min_profit_dollars
        executor.log(f"Scalp profit take target set to +${req.scalp_min_profit_dollars:.2f}")

    if req.scalp_cooldown_seconds is not None:
        config.scalp_cooldown_seconds = req.scalp_cooldown_seconds

    if req.scalp_burst_size is not None:
        config.scalp_burst_size = req.scalp_burst_size
        executor.log(f"Scalp burst size set to {req.scalp_burst_size} orders/pulse")

    if req.max_open_positions is not None:
        config.max_open_positions = req.max_open_positions

    if req.risk_percent is not None:
        config.risk_percent_per_trade = req.risk_percent

    if req.lot_size is not None:
        config.lot_size = req.lot_size

    if req.use_dynamic_lot is not None:
        config.use_dynamic_lot = req.use_dynamic_lot

    if req.max_drawdown_percent is not None:
        config.max_daily_drawdown_percent = req.max_drawdown_percent

    if req.timeframe is not None:
        config.timeframe = req.timeframe
        executor.log(f"Active timeframe switched to {req.timeframe}")

    return {"success": True, "config": config.dict()}

@app.websocket("/ws/market")
async def websocket_market_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep connection open & handle incoming ping/messages
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                if msg.get("action") == "ping":
                    await websocket.send_json({"type": "pong"})
            except Exception:
                pass
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

# Mount frontend static directory
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

@app.get("/")
async def serve_index():
    index_file = os.path.join(frontend_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return JSONResponse({"status": "Frontend not found. Please verify frontend directory."})
