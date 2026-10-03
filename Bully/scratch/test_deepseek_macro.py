import os
import json
import time
import urllib.request
import urllib.error

api_key = os.getenv("NVIDIA_API_KEY", "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")
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0"
}

prompt = """Gold XAU/USD Macro Structure (M15 / H1):
- Current Price: $4296.80
- Key EMAs: M15 EMA200=$4282.50, H1 EMA200=$4265.00, M5 EMA50=$4294.00
- Multi-hour trend: Aggressive Bullish Markup from $4280 low to $4305 high.
- Current 5m price action: Healthy pullback to $4296 retesting M5 50-EMA support.
- RSI: 46.0 (Reset from overbought 82)
- ATR: $2.40

Task: Determine the Macro AI Market Regime and Institutional Trading Policy.
Respond strictly in valid JSON format:
{
  "regime": "BULL_MARKUP" | "BEAR_MARKDOWN" | "RANGE_CONSOLIDATION",
  "policy": "BUY_PULLBACKS_ONLY" | "SELL_RALLIES_ONLY" | "DUAL_GRID_RANGE",
  "support_level": 4292.00,
  "resistance_level": 4305.00,
  "confidence": 90,
  "reason": "1-2 sentence quantitative institutional rationale"
}"""

payload = json.dumps({
    "model": "deepseek-ai/deepseek-v4.1-flash",
    "messages": [
        {"role": "system", "content": "You are a Chief Quantitative Currency & Commodity Strategist. Output strictly valid JSON."},
        {"role": "user", "content": prompt}
    ],
    "max_tokens": 128,
    "temperature": 0.1
}).encode("utf-8")

print("Sending Macro Regime Request to DeepSeek V4.1 Flash...", flush=True)
t0 = time.time()
try:
    req = urllib.request.Request("https://integrate.api.nvidia.com/v1/chat/completions", data=payload, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=60) as resp:
        body = resp.read().decode("utf-8")
        dt = time.time() - t0
        print(f"DEEPSEEK RESPONDED in {dt:.2f}s! Status: {resp.status}", flush=True)
        data = json.loads(body)
        msg = data['choices'][0]['message']
        content = msg.get('content') or msg.get('reasoning_content')
        print("\n=== DEEPSEEK RESPONSE ===")
        print(content)
except Exception as e:
    print(f"Error in {time.time()-t0:.2f}s: {e}", flush=True)
