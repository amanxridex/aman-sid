import os
import json
import time
import urllib.request

api_key = os.getenv("NVIDIA_API_KEY", "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")
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

prompt = """Gold XAU/USD snapshot:
- Price: $4296.50
- Key EMAs: M15 EMA200=$4282.50, M5 EMA50=$4294.00, EMA9=$4296.80
- Multi-hour trend: Aggressive Bullish Markup from $4280 low to $4305 high.
- Current price: Pullback into 50 EMA support at $4294-$4296.
- RSI: 45.0 (Reset from overbought) | ATR: $2.40

Classify the Macro Regime & Policy. Respond strictly in valid JSON format:
{
  "regime": "BULL_MARKUP" | "BEAR_MARKDOWN" | "RANGE_CONSOLIDATION",
  "policy": "BUY_PULLBACKS_ONLY" | "SELL_RALLIES_ONLY" | "DUAL_GRID_RANGE",
  "support_level": 4292.00,
  "resistance_level": 4305.00,
  "confidence": 90,
  "reason": "1 concise sentence"
}"""

for model in ["meta/llama-3.2-11b-vision-instruct", "nvidia/nemotron-3-super-120b-a12b"]:
    print(f"\nTesting {model}...", flush=True)
    payload = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a quantitative macro hedge fund strategist. Respond strictly in valid compact JSON."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 150,
        "temperature": 0.1
    }).encode("utf-8")
    
    t0 = time.time()
    try:
        req = urllib.request.Request("https://integrate.api.nvidia.com/v1/chat/completions", data=payload, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            dt = time.time() - t0
            content = data['choices'][0]['message'].get('content') or ""
            print(f"SUCCESS in {dt:.2f}s! Status: 200", flush=True)
            print("Content:\n", content)
    except Exception as e:
        print(f"Error in {time.time()-t0:.2f}s: {e}", flush=True)
