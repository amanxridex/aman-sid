/* ==========================================================================
   AURA GOLD AI TRADING TERMINAL — JAVASCRIPT CONTROLLER
   ========================================================================== */

let tvChart = null;
let candleSeries = null;
let ema9Series = null;
let ema21Series = null;
let ema50Series = null;
let ws = null;
let currentLotSize = 0.01;
let currentTimeframe = "M15";
let chartCandles = [];
let allTradeHistory = [];
let activeHistFilter = "ALL";

document.addEventListener("DOMContentLoaded", () => {
  initChart();
  initEventListeners();
  loadInitialData();
  initWebSocket();
  updateMarketSessions();
  setInterval(updateMarketSessions, 60000); // Check session every minute
  updateISTClock();
  setInterval(updateISTClock, 1000); // Live IST clock ticking every second
});


// ==========================================================================
// 1. TRADINGVIEW LIGHTWEIGHT CHARTS INITIALIZATION
// ==========================================================================
function initChart() {
  const container = document.getElementById("tv-chart-container");
  if (!container) return;

  const chartOptions = {
    layout: {
      textColor: '#475569',
      background: { type: 'solid', color: '#FFFFFF' },
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11
    },
    grid: {
      vertLines: { color: '#F1E9EA' },
      horzLines: { color: '#F1E9EA' }
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
      vertLine: { color: 'rgba(128, 0, 32, 0.45)', width: 1, style: 3 },
      horzLine: { color: 'rgba(128, 0, 32, 0.45)', width: 1, style: 3 }
    },
    rightPriceScale: {
      borderColor: '#E8D5D8',
      scaleMargins: { top: 0.1, bottom: 0.2 }
    },
    timeScale: {
      borderColor: '#E8D5D8',
      timeVisible: true,
      secondsVisible: false
    }
  };

  tvChart = LightweightCharts.createChart(container, chartOptions);

  // Candlestick Series (Emerald Green / Deep Maroon palette)
  candleSeries = tvChart.addCandlestickSeries({
    upColor: '#059669',
    downColor: '#991B1B',
    borderVisible: false,
    wickUpColor: '#059669',
    wickDownColor: '#991B1B'
  });

  // EMA Line Overlays
  ema9Series = tvChart.addLineSeries({
    color: '#2563EB',
    lineWidth: 1.5,
    title: 'EMA 9'
  });
  ema21Series = tvChart.addLineSeries({
    color: '#800020',
    lineWidth: 1.8,
    title: 'EMA 21 (Maroon Baseline)'
  });
  ema50Series = tvChart.addLineSeries({
    color: '#D97706',
    lineWidth: 1.5,
    title: 'EMA 50'
  });

  // Responsive chart resize
  window.addEventListener('resize', () => {
    if (tvChart && container) {
      tvChart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight
      });
    }
  });

  setTimeout(() => {
    tvChart.applyOptions({
      width: container.clientWidth,
      height: container.clientHeight
    });
  }, 100);
}

// Calculate simple EMA array for chart overlays
function calculateEMA(candles, period) {
  const k = 2 / (period + 1);
  let emaArray = [];
  let ema = candles[0].close;

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    ema = c.close * k + ema * (1 - k);
    emaArray.push({
      time: c.time,
      value: parseFloat(ema.toFixed(2))
    });
  }
  return emaArray;
}

// ==========================================================================
// 2. DATA LOADING & CANDLE UPDATES
// ==========================================================================
async function loadInitialData() {
  try {
    const res = await fetch(`/api/status`);
    if (res.ok) {
      const data = await res.json();
      updateAccountUI(data.account);
      updatePositionsUI(data.positions);
      updateHistoryUI(data.history);
      updateSignalUI(data.signal);
      if (data.deepseek_stats) {
        updateDeepSeekStatsUI(data.deepseek_stats);
      }
      updateAutoTradeToggle(data.config.auto_trade_enabled);
      updateConnectionStatus(data.is_connected, data.simulation_mode, data.config.mt5_server);
      populateSettingsModal(data.config);
    }

    // Load initial candles for chart
    await loadChartCandles(currentTimeframe);
  } catch (err) {
    console.error("Failed to load initial data:", err);
  }
}

async function loadChartCandles(tf) {
  try {
    const res = await fetch(`/api/candles?timeframe=${tf}&count=200`);
    if (res.ok) {
      const data = await res.json();
      chartCandles = data.candles || [];
      if (chartCandles.length > 0 && candleSeries) {
        candleSeries.setData(chartCandles);
        ema9Series.setData(calculateEMA(chartCandles, 9));
        ema21Series.setData(calculateEMA(chartCandles, 21));
        ema50Series.setData(calculateEMA(chartCandles, 50));
        tvChart.timeScale().fitContent();

        // Update header price display
        const last = chartCandles[chartCandles.length - 1];
        const first = chartCandles[0];
        const changePct = ((last.close - first.open) / first.open) * 100;
        updatePriceDisplay(last.close, changePct);
      }
    }
  } catch (err) {
    console.error("Error loading candles:", err);
  }
}

// ==========================================================================
// 3. WEBSOCKET REAL-TIME MARKET FEED
// ==========================================================================
function initWebSocket() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/ws/market`;

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("WebSocket connected to market stream");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "market_update") {
        handleMarketUpdate(data);
      }
    } catch (e) {
      console.error("Error parsing WS message:", e);
    }
  };

  ws.onclose = () => {
    console.warn("WebSocket closed. Reconnecting in 2 seconds...");
    setTimeout(initWebSocket, 2000);
  };
}

function handleMarketUpdate(data) {
  // 1. Ticker & Button Prices
  if (data.tick) {
    const tick = data.tick;
    document.getElementById("ticker-bid").innerText = tick.bid.toFixed(2);
    document.getElementById("ticker-ask").innerText = tick.ask.toFixed(2);
    document.getElementById("ticker-spread").innerText = `${tick.spread_points} pts`;

    document.getElementById("btn-buy-price").innerText = `$${tick.ask.toFixed(2)}`;
    document.getElementById("btn-sell-price").innerText = `$${tick.bid.toFixed(2)}`;

    // Update real-time Price & % Change on Chart Header!
    const midPrice = (tick.bid + tick.ask) / 2;
    let changePct = 0.0;
    if (chartCandles && chartCandles.length > 0 && chartCandles[0].open > 0) {
      changePct = ((midPrice - chartCandles[0].open) / chartCandles[0].open) * 100;
    }
    updatePriceDisplay(midPrice, changePct);

    // Update real-time candle bar on chart with live tick
    if (candleSeries && chartCandles && chartCandles.length > 0) {
      const lastCandle = chartCandles[chartCandles.length - 1];
      const updatedBar = {
        time: lastCandle.time,
        open: lastCandle.open,
        high: Math.max(lastCandle.high, midPrice),
        low: Math.min(lastCandle.low, midPrice),
        close: midPrice
      };
      candleSeries.update(updatedBar);
    } else if (data.latest_bar && candleSeries) {
      candleSeries.update(data.latest_bar);
    }
  }

  // 2. Account Health
  if (data.account) {
    updateAccountUI(data.account);
  }

  // 3. Positions
  if (data.positions) {
    updatePositionsUI(data.positions);
  }

  // 3.25 Closed Trade History
  if (data.history) {
    updateHistoryUI(data.history);
  }

  // 3.5 Scalp Stats (HFT Tracker)
  if (data.scalp_stats) {
    const s = data.scalp_stats;
    const winsEl = document.getElementById("scalp-wins-count");
    const pnlEl = document.getElementById("scalp-pnl-val");
    const targetEl = document.getElementById("scalp-harvest-target");
    const debtEl = document.getElementById("scalp-debt-retired");
    if (winsEl) winsEl.innerText = s.scalp_wins;
    if (pnlEl) pnlEl.innerText = `${s.total_scalp_profit >= 0 ? '+' : ''}$${s.total_scalp_profit.toFixed(2)}`;
    if (targetEl && s.scalp_min_profit_dollars) targetEl.innerText = `≥ +$${s.scalp_min_profit_dollars.toFixed(2)}`;
    if (debtEl && s.debt_retired !== undefined) debtEl.innerText = `+$${s.debt_retired.toFixed(2)}`;
  }

  // 4. AI Signal Radar
  if (data.signal) {
    updateSignalUI(data.signal);
  }

  // 4.5 DeepSeek Continuous Stream Telemetry
  if (data.deepseek_stats) {
    updateDeepSeekStatsUI(data.deepseek_stats);
  }

  // 5. Connection status
  updateConnectionStatus(data.is_connected, !data.is_connected, data.symbol);

  // 6. Logs
  if (data.logs) {
    updateLogsUI(data.logs);
  }
}

// ==========================================================================
// 4. UI UPDATERS
// ==========================================================================
function updatePriceDisplay(price, changePct) {
  const priceEl = document.getElementById("chart-price-display");
  const changeEl = document.getElementById("chart-change-display");

  if (priceEl) priceEl.innerText = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (changeEl) {
    const isPos = changePct >= 0;
    changeEl.innerText = `${isPos ? '+' : ''}${changePct.toFixed(2)}%`;
    changeEl.style.color = isPos ? 'var(--green-buy)' : 'var(--red-sell)';
    changeEl.style.background = isPos ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';
  }
}

function updateAccountUI(acc) {
  if (!acc) return;
  document.getElementById("acc-balance").innerText = `$${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById("acc-equity").innerText = `$${acc.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById("acc-free-margin").innerText = `$${acc.free_margin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const pnlEl = document.getElementById("acc-floating-pnl");
  const pnl = acc.profit || 0.0;
  pnlEl.innerText = `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`;
  pnlEl.className = `metric-value ${pnl > 0 ? 'pnl-profit' : (pnl < 0 ? 'pnl-loss' : 'pnl-neutral')}`;

  // Drawdown gauge
  const drawdownDollars = acc.balance > 0 ? Math.max(0, acc.balance - acc.equity) : 0;
  const drawdownPct = acc.balance > 0 ? (drawdownDollars / acc.balance) * 100 : 0;
  const limit = 10.0; // 10% limit as requested by user
  document.getElementById("drawdown-percent-label").innerText = `${drawdownPct.toFixed(2)}% / ${limit.toFixed(2)}% Limit`;

  const barFill = document.getElementById("drawdown-bar-fill");
  const fillWidth = Math.min(100, (drawdownPct / limit) * 100);
  barFill.style.width = `${fillWidth}%`;
  if (fillWidth > 80) {
    barFill.style.background = 'var(--red-sell)';
  } else if (fillWidth > 50) {
    barFill.style.background = '#f59e0b';
  } else {
    barFill.style.background = 'var(--accent-maroon)';
  }
}

function updatePositionsUI(positions) {
  const tbody = document.getElementById("positions-table-body");
  const countBadge = document.getElementById("badge-open-count");
  if (!tbody) return;

  if (countBadge) countBadge.innerText = positions.length;

  if (!positions || positions.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="10">No active positions on XAU/USD. Auto-Trader is monitoring the market.</td></tr>`;
    return;
  }

  let html = "";
  for (const p of positions) {
    const isProfit = p.profit >= 0;
    const typeClass = p.type === "BUY" ? "type-buy" : "type-sell";
    html += `
      <tr>
        <td>#${p.ticket}</td>
        <td><strong>${p.symbol}</strong></td>
        <td><span class="type-pill ${typeClass}">${p.type}</span></td>
        <td>${p.lots.toFixed(2)}</td>
        <td>$${p.open_price.toFixed(2)}</td>
        <td>$${p.current_price.toFixed(2)}</td>
        <td>${p.sl > 0 ? `$${p.sl.toFixed(2)}` : '--'}</td>
        <td>${p.tp > 0 ? `$${p.tp.toFixed(2)}` : '--'}</td>
        <td style="color: ${isProfit ? 'var(--green-buy)' : 'var(--red-sell)'}; font-weight: 700;">
          ${isProfit ? '+' : ''}$${p.profit.toFixed(2)}
        </td>
        <td>
          <button class="btn-close-trade" onclick="closePosition(${p.ticket})">CLOSE</button>
        </td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function updateHistoryUI(history) {
  if (Array.isArray(history)) {
    if (allTradeHistory.length === 0 || history.length >= allTradeHistory.length) {
      allTradeHistory = history;
    } else {
      // Merge newest closed trades at the top without truncating full history
      const existingTickets = new Set(allTradeHistory.map(h => h.ticket));
      for (const h of history) {
        if (!existingTickets.has(h.ticket)) {
          allTradeHistory.unshift(h);
          existingTickets.add(h.ticket);
        }
      }
    }
  }
  renderHistoryTable();
}

function renderHistoryTable() {
  const tbody = document.getElementById("history-table-body");
  if (!tbody) return;

  const totalAll = allTradeHistory.length;
  const wonList = allTradeHistory.filter(h => h.profit > 0);
  const lostList = allTradeHistory.filter(h => h.profit < 0);
  const totalWon = wonList.length;
  const totalLost = lostList.length;

  // Update Badges & Tab Counter
  const badgeHistCount = document.getElementById("badge-hist-count");
  if (badgeHistCount) badgeHistCount.innerText = totalAll;

  const countAllEl = document.getElementById("count-hist-all");
  const countWonEl = document.getElementById("count-hist-won");
  const countLostEl = document.getElementById("count-hist-lost");
  if (countAllEl) countAllEl.innerText = totalAll;
  if (countWonEl) countWonEl.innerText = totalWon;
  if (countLostEl) countLostEl.innerText = totalLost;

  // Metrics: Win Rate & Realized Net P&L
  const winRate = (totalWon + totalLost) > 0 ? ((totalWon / (totalWon + totalLost)) * 100).toFixed(1) : "0.0";
  const netPnL = allTradeHistory.reduce((acc, h) => acc + (parseFloat(h.profit) || 0), 0);

  const winRateEl = document.getElementById("hist-summary-winrate");
  const pnlEl = document.getElementById("hist-summary-pnl");
  if (winRateEl) winRateEl.innerText = `${winRate}%`;
  if (pnlEl) {
    pnlEl.innerText = `${netPnL >= 0 ? '+' : ''}$${netPnL.toFixed(2)}`;
    pnlEl.style.color = netPnL >= 0 ? "var(--green-buy)" : "var(--red-sell)";
  }

  // Filter based on active filter
  let displayList = allTradeHistory;
  if (activeHistFilter === "WON") {
    displayList = wonList;
  } else if (activeHistFilter === "LOST") {
    displayList = lostList;
  }

  if (displayList.length === 0) {
    const filterName = activeHistFilter === "ALL" ? "closed trades" : (activeHistFilter === "WON" ? "winning trades" : "losing trades");
    tbody.innerHTML = `<tr class="empty-row"><td colspan="8">No ${filterName} in history.</td></tr>`;
    return;
  }

  let html = "";
  for (const h of displayList) {
    const isProfit = h.profit >= 0;
    const isZero = h.profit === 0;
    const openPrice = h.open_price ? h.open_price.toFixed(2) : '--';
    const closePrice = (h.close_price || h.current_price) ? (h.close_price || h.current_price).toFixed(2) : '--';
    const pnlColor = isProfit ? (isZero ? "var(--text-muted)" : "var(--green-buy)") : "var(--red-sell)";
    const pnlPrefix = h.profit > 0 ? "+" : "";

    html += `
      <tr>
        <td>#${h.ticket}</td>
        <td><strong>${h.symbol}</strong></td>
        <td><span class="type-pill ${h.type === 'BUY' ? 'type-buy' : 'type-sell'}">${h.type}</span></td>
        <td>${h.lots.toFixed(2)}</td>
        <td>$${openPrice}</td>
        <td>$${closePrice}</td>
        <td style="color: ${pnlColor}; font-weight: 700;">
          ${pnlPrefix}$${h.profit.toFixed(2)}
        </td>
        <td>${h.close_time || h.close_date || '--'}</td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function updateSignalUI(sig) {
  if (!sig) return;

  const actionEl = document.getElementById("ai-verdict-action");
  const confEl = document.getElementById("ai-confidence-value");
  const regimeEl = document.getElementById("ai-regime-tag");
  const container = document.getElementById("ai-verdict-container");
  const reasonEl = document.getElementById("ai-reason-text");

  actionEl.innerText = sig.action;
  confEl.innerText = `${sig.confidence}%`;
  regimeEl.innerText = sig.regime || "ANALYZING";

  container.classList.remove("verdict-buy", "verdict-sell");
  if (sig.action.includes("BUY")) {
    container.classList.add("verdict-buy");
    actionEl.style.color = "var(--green-buy)";
  } else if (sig.action.includes("SELL")) {
    container.classList.add("verdict-sell");
    actionEl.style.color = "var(--red-sell)";
  } else {
    actionEl.style.color = "var(--text-main)";
  }

  if (sig.reason && reasonEl) {
    reasonEl.innerText = sig.reason;
  }

  if (sig.model) {
    const modelTag = document.getElementById("ai-model-tag");
    if (modelTag) modelTag.innerText = sig.model.includes("DeepSeek") ? "DEEPSEEK V4.1" : "QUANT AI";
  }

  // Update indicators
  if (sig.indicators) {
    const ind = sig.indicators;
    if (ind.rsi) document.getElementById("ind-rsi").innerText = `${ind.rsi}`;
    if (ind.atr) {
      document.getElementById("ind-atr").innerText = `$${ind.atr} / bar`;
      // Update ATR protection preview
      const slDist = (ind.atr * 1.8).toFixed(2);
      const tpDist = (ind.atr * 2.7).toFixed(2);
      document.getElementById("atr-calc-display").innerText = `SL: -$${slDist} | TP: +$${tpDist} (1:1.5)`;
    }
    if (ind.ema_9 && ind.ema_21 && ind.ema_50) {
      let trendText = "Neutral / Mixed";
      if (ind.ema_9 > ind.ema_21 && ind.ema_21 > ind.ema_50) trendText = "Bullish Alignment (9>21>50)";
      else if (ind.ema_9 < ind.ema_21 && ind.ema_21 < ind.ema_50) trendText = "Bearish Alignment (9<21<50)";
      document.getElementById("ind-ema-trend").innerText = trendText;
    }
    if (ind.macd_hist) {
      document.getElementById("ind-macd").innerText = ind.macd_hist > 0 ? `Bullish (+${ind.macd_hist})` : `Bearish (${ind.macd_hist})`;
    }
    if (ind.ema_200 && ind.close) {
      const isAbove = ind.close > ind.ema_200;
      document.getElementById("ind-macro").innerText = `${isAbove ? 'Above' : 'Below'} ($${ind.ema_200})`;
      document.getElementById("ind-macro").style.color = isAbove ? 'var(--green-buy)' : 'var(--red-sell)';
    }
  }
}

function updateDeepSeekStatsUI(ds) {
  if (!ds) return;
  const mandateEl = document.getElementById("ai-l1-mandate");
  const policyEl = document.getElementById("ai-l1-policy");
  const srEl = document.getElementById("ai-l1-sr");
  const srcEl = document.getElementById("ai-l1-src");

  if (mandateEl && ds.macro_regime) mandateEl.innerText = `L1: ${ds.macro_regime}`;
  if (policyEl && ds.trading_policy) {
    policyEl.innerText = ds.trading_policy;
    policyEl.style.color = ds.trading_policy.includes("BUY") ? "var(--green-buy)" : (ds.trading_policy.includes("SELL") ? "var(--red-sell)" : "var(--gold-accent)");
  }
  if (srEl && ds.support_level && ds.resistance_level) {
    srEl.innerText = `S:$${ds.support_level.toFixed(0)} / R:$${ds.resistance_level.toFixed(0)}`;
  }
  if (srcEl && ds.source) srcEl.innerText = ds.source.includes("DEEPSEEK") ? "DEEPSEEK" : "QUANT_AI";
}

function updateConnectionStatus(isConnected, isSim, serverName) {
  const dot = document.getElementById("mt5-status-dot");
  const text = document.getElementById("mt5-status-text");

  if (isSim) {
    dot.className = "status-dot connected";
    text.innerText = "Simulation Mode (Paper)";
  } else if (isConnected) {
    dot.className = "status-dot connected";
    text.innerText = `MT5: ${serverName || 'Connected'}`;
  } else {
    dot.className = "status-dot disconnected";
    text.innerText = "MT5: Disconnected";
  }
}

function updateAutoTradeToggle(enabled) {
  const toggle = document.getElementById("autotrade-toggle");
  if (toggle) toggle.checked = !!enabled;
}

function updateLogsUI(logs) {
  const viewer = document.getElementById("terminal-log-stream");
  if (!viewer || !logs) return;

  let html = "";
  for (const l of logs) {
    const lvlClass = l.level.toLowerCase();
    html += `<div class="log-line ${lvlClass}"><span class="log-time">[${l.timestamp}]</span> ${l.message}</div>`;
  }
  viewer.innerHTML = html;
}

// Market session indicator (UTC hours)
function updateMarketSessions() {
  const now = new Date();
  const utcHour = now.getUTCHours();

  const tokyoEl = document.getElementById("session-tokyo");
  const londonEl = document.getElementById("session-london");
  const nyEl = document.getElementById("session-ny");

  // Tokyo: 00:00 - 09:00 UTC
  const isTokyo = utcHour >= 0 && utcHour < 9;
  // London: 07:00 - 16:00 UTC
  const isLondon = utcHour >= 7 && utcHour < 16;
  // New York: 12:00 - 21:00 UTC
  const isNY = utcHour >= 12 && utcHour < 21;

  if (tokyoEl) tokyoEl.classList.toggle("active", isTokyo);
  if (londonEl) londonEl.classList.toggle("active", isLondon);
  if (nyEl) nyEl.classList.toggle("active", isNY);
}

// Live Indian Standard Time (IST) Clock
function updateISTClock() {
  const clockEl = document.getElementById("ist-clock-time");
  if (!clockEl) return;
  const now = new Date();
  const istString = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  clockEl.innerText = `${istString} IST`;
}

// ==========================================================================

// 5. INTERACTIVE EVENT LISTENERS & ORDER EXECUTION
// ==========================================================================
function initEventListeners() {
  // Lot Presets
  const lotBtns = document.querySelectorAll(".lot-btn");
  const customLotInput = document.getElementById("input-custom-lot");

  lotBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      lotBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentLotSize = parseFloat(btn.dataset.lot);
      customLotInput.value = currentLotSize;
    });
  });

  customLotInput.addEventListener("input", (e) => {
    lotBtns.forEach(b => b.classList.remove("active"));
    currentLotSize = parseFloat(e.target.value) || 0.01;
  });

  // Timeframe selector
  const tfBtns = document.querySelectorAll(".tf-btn");
  tfBtns.forEach(btn => {
    btn.addEventListener("click", async () => {
      tfBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentTimeframe = btn.dataset.tf;
      await loadChartCandles(currentTimeframe);
      // Update backend timeframe
      fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeframe: currentTimeframe })
      });
    });
  });

  // Auto-Trade Master Toggle
  const autoTradeToggle = document.getElementById("autotrade-toggle");
  autoTradeToggle.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auto_trade_enabled: isChecked })
    });
  });

  // 1-Click Buy & Sell Buttons
  document.getElementById("btn-manual-buy").addEventListener("click", () => {
    executeTrade("BUY");
  });
  document.getElementById("btn-manual-sell").addEventListener("click", () => {
    executeTrade("SELL");
  });

  // Rapid Scalp Burst & Harvest Buttons
  const burstBuyBtn = document.getElementById("btn-burst-buy");
  if (burstBuyBtn) {
    burstBuyBtn.addEventListener("click", async () => {
      burstBuyBtn.disabled = true;
      try {
        await fetch("/api/rapid-burst", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "BUY", burst_count: 3, lot_size: currentLotSize })
        });
      } finally {
        setTimeout(() => { burstBuyBtn.disabled = false; }, 400);
      }
    });
  }

  const burstSellBtn = document.getElementById("btn-burst-sell");
  if (burstSellBtn) {
    burstSellBtn.addEventListener("click", async () => {
      burstSellBtn.disabled = true;
      try {
        await fetch("/api/rapid-burst", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "SELL", burst_count: 3, lot_size: currentLotSize })
        });
      } finally {
        setTimeout(() => { burstSellBtn.disabled = false; }, 400);
      }
    });
  }

  const harvestBtn = document.getElementById("btn-harvest-profit");
  if (harvestBtn) {
    harvestBtn.addEventListener("click", async () => {
      harvestBtn.disabled = true;
      try {
        await fetch("/api/close-profit", { method: "POST" });
      } finally {
        setTimeout(() => { harvestBtn.disabled = false; }, 400);
      }
    });
  }

  // Emergency Kill-switch
  document.getElementById("btn-kill-switch").addEventListener("click", () => {
    if (confirm("EMERGENCY KILL-SWITCH: Are you sure you want to CLOSE ALL open XAU/USD positions immediately?")) {
      fetch("/api/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ close_all: true })
      });
    }
  });

  // Tabs
  const tabBtns = document.querySelectorAll(".panel-tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add("active");
    });
  });

  // Trade History Filter Buttons (ALL / WON / LOST)
  const histFilterBtns = document.querySelectorAll(".hist-filter-btn");
  histFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      histFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeHistFilter = btn.dataset.filter || "ALL";
      renderHistoryTable();
    });
  });

  // MT5 Modal
  const mt5Modal = document.getElementById("mt5-modal");
  document.getElementById("btn-open-mt5-modal").addEventListener("click", () => {
    mt5Modal.classList.add("active");
  });
  document.getElementById("btn-close-mt5-modal").addEventListener("click", () => {
    mt5Modal.classList.remove("active");
  });
  document.getElementById("btn-cancel-mt5").addEventListener("click", () => {
    mt5Modal.classList.remove("active");
  });
  document.getElementById("btn-save-mt5-connect").addEventListener("click", handleMT5Connect);

  // Settings Modal
  const settingsModal = document.getElementById("settings-modal");
  document.getElementById("btn-open-settings").addEventListener("click", () => {
    settingsModal.classList.add("active");
  });
  document.getElementById("btn-close-settings-modal").addEventListener("click", () => {
    settingsModal.classList.remove("active");
  });
  document.getElementById("btn-save-settings").addEventListener("click", handleSaveSettings);

  // Sliders preview
  const riskSlider = document.getElementById("input-risk-percent");
  riskSlider.addEventListener("input", (e) => {
    document.getElementById("val-risk-percent").innerText = `${parseFloat(e.target.value).toFixed(2)}%`;
  });
  const ddSlider = document.getElementById("input-drawdown-limit");
  ddSlider.addEventListener("input", (e) => {
    document.getElementById("val-drawdown-limit").innerText = `${parseFloat(e.target.value).toFixed(1)}%`;
  });
}

// 1-Click Trade Dispatch
async function executeTrade(action) {
  try {
    const res = await fetch("/api/trade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: action,
        lot_size: currentLotSize
      })
    });
    const result = await res.json();
    if (!result.success) {
      alert(`Trade Failed: ${result.message}`);
    }
  } catch (err) {
    console.error("Trade request failed:", err);
  }
}

// Close Single Position
window.closePosition = async function(ticket) {
  try {
    await fetch("/api/close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket: ticket })
    });
  } catch (e) {
    console.error("Close position error:", e);
  }
};

// Handle MT5 Credentials Submission
async function handleMT5Connect() {
  const isSim = document.getElementById("modal-sim-mode").checked;
  const login = parseInt(document.getElementById("modal-login").value) || 0;
  const pass = document.getElementById("modal-password").value;
  const server = document.getElementById("modal-server").value;
  const path = document.getElementById("modal-path").value;
  const feedback = document.getElementById("modal-connection-feedback");

  feedback.style.display = "block";
  feedback.className = "connection-feedback";
  feedback.innerText = "Attempting connection...";

  try {
    const res = await fetch("/api/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: login,
        password: pass,
        server: server,
        path: path,
        simulation_mode: isSim
      })
    });
    const result = await res.json();

    if (result.success) {
      feedback.className = "connection-feedback success";
      feedback.innerText = result.message || "Successfully connected!";
      setTimeout(() => {
        document.getElementById("mt5-modal").classList.remove("active");
      }, 1200);
    } else {
      feedback.className = "connection-feedback error";
      feedback.innerText = `Connection Failed: ${result.message}`;
    }
  } catch (err) {
    feedback.className = "connection-feedback error";
    feedback.innerText = `Network Error: ${err.message}`;
  }
}

function populateSettingsModal(cfg) {
  if (!cfg) return;
  if (cfg.risk_percent_per_trade) {
    document.getElementById("input-risk-percent").value = cfg.risk_percent_per_trade;
    document.getElementById("val-risk-percent").innerText = `${cfg.risk_percent_per_trade}%`;
  }
  if (cfg.max_daily_drawdown_percent) {
    document.getElementById("input-drawdown-limit").value = cfg.max_daily_drawdown_percent;
    document.getElementById("val-drawdown-limit").innerText = `${cfg.max_daily_drawdown_percent}%`;
  }
  if (cfg.use_dynamic_lot !== undefined) {
    document.getElementById("input-dynamic-lot").checked = cfg.use_dynamic_lot;
  }
  if (cfg.mt5_login) document.getElementById("modal-login").value = cfg.mt5_login;
  if (cfg.mt5_server) document.getElementById("modal-server").value = cfg.mt5_server;
  if (cfg.simulation_mode !== undefined) {
    document.getElementById("modal-sim-mode").checked = cfg.simulation_mode;
  }
}

async function handleSaveSettings() {
  const risk = parseFloat(document.getElementById("input-risk-percent").value);
  const dd = parseFloat(document.getElementById("input-drawdown-limit").value);
  const dynLot = document.getElementById("input-dynamic-lot").checked;

  try {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        risk_percent: risk,
        max_drawdown_percent: dd,
        use_dynamic_lot: dynLot
      })
    });
    document.getElementById("settings-modal").classList.remove("active");
  } catch (err) {
    alert("Failed to save settings: " + err.message);
  }
}
