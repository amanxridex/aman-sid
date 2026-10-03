import os
import json
import urllib.request

api_key = os.getenv("NVIDIA_API_KEY", "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")
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0"
}

req = urllib.request.Request("https://integrate.api.nvidia.com/v1/models", headers=headers, method="GET")
with urllib.request.urlopen(req, timeout=10) as resp:
    data = json.loads(resp.read().decode("utf-8"))
    models = sorted([m['id'] for m in data.get('data', [])])
    for m in models:
        print(m)
