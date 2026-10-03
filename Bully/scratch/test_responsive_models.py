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

req = urllib.request.Request("https://integrate.api.nvidia.com/v1/models", headers=headers, method="GET")
with urllib.request.urlopen(req, timeout=10) as resp:
    data = json.loads(resp.read().decode("utf-8"))
    all_models = [m['id'] for m in data.get('data', [])]

print(f"Scanning all {len(all_models)} models with 4s timeout...", flush=True)

working = []
for m in all_models:
    payload = json.dumps({
        "model": m,
        "messages": [{"role": "user", "content": "hello"}],
        "max_tokens": 15,
        "temperature": 0.1
    }).encode("utf-8")

    t0 = time.time()
    try:
        r = urllib.request.Request("https://integrate.api.nvidia.com/v1/chat/completions", data=payload, headers=headers, method="POST")
        with urllib.request.urlopen(r, timeout=4) as res:
            dt = time.time() - t0
            body = json.loads(res.read().decode("utf-8"))
            content = body['choices'][0]['message'].get('content') or ""
            print(f"[OK] {m} ({dt:.2f}s): {content.strip()[:60]}", flush=True)
            working.append((m, dt))
    except urllib.error.HTTPError as e:
        # 404 or other HTTP error
        pass
    except Exception as e:
        # timeout
        pass

print("\n--- Summary of Fast Working Models ---", flush=True)
for m, dt in working:
    print(f"{dt:.2f}s -> {m}")
