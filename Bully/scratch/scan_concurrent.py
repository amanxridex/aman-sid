import os
import json
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

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

print(f"Testing {len(all_models)} models concurrently with 6s timeout...", flush=True)

def test_model(m):
    payload = json.dumps({
        "model": m,
        "messages": [{"role": "user", "content": "Say hello in 3 words"}],
        "max_tokens": 15,
        "temperature": 0.1
    }).encode("utf-8")
    t0 = time.time()
    try:
        r = urllib.request.Request("https://integrate.api.nvidia.com/v1/chat/completions", data=payload, headers=headers, method="POST")
        with urllib.request.urlopen(r, timeout=6) as res:
            dt = time.time() - t0
            body = json.loads(res.read().decode("utf-8"))
            msg = body['choices'][0]['message']
            content = msg.get('content') or msg.get('reasoning_content') or ""
            if content.strip():
                return (m, dt, content.strip(), "OK")
    except urllib.error.HTTPError as e:
        return (m, 0, f"HTTP {e.code}", "ERR")
    except Exception as e:
        return (m, 0, str(e), "ERR")
    return None

results = []
with ThreadPoolExecutor(max_workers=20) as ex:
    futures = {ex.submit(test_model, m): m for m in all_models}
    for f in as_completed(futures):
        res = f.result()
        if res and res[3] == "OK":
            print(f"[FOUND] {res[0]} in {res[1]:.2f}s -> {res[2][:80]}", flush=True)
            results.append(res)


print(f"\nTotal working text models: {len(results)}")
for r in sorted(results, key=lambda x: x[1]):
    print(f"  {r[1]:.2f}s : {r[0]}")
