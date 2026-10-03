import os, json, urllib.request
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("NVIDIA_API_KEY")

req = urllib.request.Request(
    "https://integrate.api.nvidia.com/v1/models",
    headers={
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json"
    }
)

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode("utf-8"))
        models = [m["id"] for m in data.get("data", [])]
        deepseek_models = [m for m in models if "deepseek" in m.lower()]
        print("All DeepSeek models on NVIDIA:")
        for m in deepseek_models:
            print(" -", m)
except Exception as e:
    print("Error:", e)
