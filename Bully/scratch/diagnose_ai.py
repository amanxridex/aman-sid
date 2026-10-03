import os
import sys
import time
import json
import urllib.request
import urllib.error

api_key = os.getenv("NVIDIA_API_KEY", "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")
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0"
}

print(f"Testing NVIDIA API Key: {api_key[:12]}...", flush=True)

# 1. Test models endpoint
try:
    print("Testing GET /v1/models...", flush=True)
    t0 = time.time()
    req = urllib.request.Request("https://integrate.api.nvidia.com/v1/models", headers=headers, method="GET")
    with urllib.request.urlopen(req, timeout=10) as resp:
        body = resp.read().decode("utf-8")
        print(f"Status: {resp.status} in {time.time()-t0:.2f}s", flush=True)
        data = json.loads(body)
        models = [m['id'] for m in data.get('data', [])]
        print(f"Total models available: {len(models)}", flush=True)
        deepseek_models = [m for m in models if 'deepseek' in m.lower()]
        print(f"DeepSeek models: {deepseek_models}", flush=True)
except Exception as e:
    print(f"Models error: {e}", flush=True)

# 2. Test chat completion
try:
    print("\nTesting POST /v1/chat/completions with deepseek-ai/deepseek-v4.1-flash...", flush=True)
    payload = json.dumps({
        "model": "deepseek-ai/deepseek-v4.1-flash",
        "messages": [{"role": "user", "content": "Respond strictly with: OK"}],
        "max_tokens": 10,
        "temperature": 0.1
    }).encode("utf-8")
    t0 = time.time()
    req = urllib.request.Request("https://integrate.api.nvidia.com/v1/chat/completions", data=payload, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=15) as resp:
        body = resp.read().decode("utf-8")
        print(f"Chat status: {resp.status} in {time.time()-t0:.2f}s", flush=True)
        print(f"Chat response: {body[:300]}", flush=True)
except urllib.error.HTTPError as e:
    print(f"Chat HTTPError: {e.code} - {e.read().decode('utf-8')[:300]}", flush=True)
except Exception as e:
    print(f"Chat error: {e}", flush=True)
