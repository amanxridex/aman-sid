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

models_to_test = [
    "deepseek-ai/deepseek-v4.1-flash",
    "deepseek-ai/deepseek-coder-6.7b-instruct",
    "mistralai/mistral-7b-instruct-v0.3",
    "z-ai/glm-5.3-flash",
    "google/gemma-3-4b-it",
    "writer/palmyra-fin-70b-32k"
]

prompt = """XAU/USD Gold Snapshot:
- Close: $4296.50 (Above 200 EMA $4292.00)
- EMAs: 9=$4296.80, 21=$4297.20, 50=$4298.00, 200=$4292.00
- RSI: 42.5 | ATR: $2.10
- Structure: Short pullback inside larger M15 Bull Trend (4280 -> 4305).

Respond strictly in valid JSON format:
{
  "regime": "BULL_MARKUP" | "BEAR_MARKDOWN" | "RANGE_CONSOLIDATION",
  "policy": "BUY_PULLBACKS_ONLY" | "SELL_RALLIES_ONLY" | "DUAL_GRID_RANGE",
  "support_level": 4292.0,
  "resistance_level": 4305.0,
  "confidence": 85,
  "reason": "1 concise sentence"
}"""

for model in models_to_test:
    print(f"\n--- Testing model: {model} ---", flush=True)
    payload = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": "You are an institutional Gold quant hedge fund architect. Respond strictly with compact valid JSON."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 128,
        "temperature": 0.1
    }).encode("utf-8")
    
    t0 = time.time()
    try:
        req = urllib.request.Request("https://integrate.api.nvidia.com/v1/chat/completions", data=payload, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=12) as resp:
            body = resp.read().decode("utf-8")
            dt = time.time() - t0
            print(f"SUCCESS in {dt:.2f}s! Status: {resp.status}", flush=True)
            data = json.loads(body)
            msg = data['choices'][0]['message']
            content = msg.get('content') or msg.get('reasoning_content')
            print(f"Content: {content[:200]}...", flush=True)
    except urllib.error.HTTPError as e:
        print(f"HTTPError {e.code}: {e.read().decode('utf-8')[:200]}", flush=True)
    except Exception as e:
        print(f"FAILED/TIMEOUT in {time.time()-t0:.2f}s: {e}", flush=True)
