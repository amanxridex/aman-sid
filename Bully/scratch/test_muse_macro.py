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
- EMAs: 9=$4296.80, 21=$4297.20, 50=$4298.00, 200=$4292.00
- RSI: 42.5 | ATR: $2.10
- Macro Trend: Bullish Markup from $4280. Pullback to $4296 near 200 EMA support.

Respond strictly in valid JSON format:
{
  "regime": "BULL_MARKUP",
  "policy": "BUY_PULLBACKS_ONLY",
  "support_level": 4292.00,
  "resistance_level": 4305.00,
  "confidence": 85,
  "reason": "Gold holding above 200 EMA in bull trend; buying dips only."
}"""

payload = json.dumps({
    "model": "meta/muse-glimmer-30b",
    "messages": [
        {"role": "system", "content": "You are a quantitative macro strategist. Output strictly valid JSON."},
        {"role": "user", "content": prompt}
    ],
    "max_tokens": 128,
    "temperature": 0.1
}).encode("utf-8")

print("Testing meta/muse-glimmer-30b...", flush=True)
t0 = time.time()
try:
    req = urllib.request.Request("https://integrate.api.nvidia.com/v1/chat/completions", data=payload, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=10) as resp:
        body = json.loads(resp.read().decode("utf-8"))
        dt = time.time() - t0
        content = body['choices'][0]['message'].get('content') or ""
        print(f"SUCCESS in {dt:.2f}s! Status: {resp.status}", flush=True)
        print("Response:\n", content)
except Exception as e:
    print(f"Error in {time.time()-t0:.2f}s: {e}", flush=True)
