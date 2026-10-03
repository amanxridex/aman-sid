import time
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("NVIDIA_API_KEY")
model = os.getenv("DEEPSEEK_MODEL", "deepseek-ai/deepseek-v4.1-flash")
print(f"Testing DeepSeek model: {model}")

client = OpenAI(base_url="https://integrate.api.nvidia.com/v1", api_key=api_key)

t0 = time.time()
prompt = """
XAU/USD Gold at 4284.10. EMA9=4284.50, EMA21=4285.00, RSI=52, ATR=1.2.
Respond ONLY with raw JSON:
{"action": "BUY"|"SELL"|"HOLD", "confidence": 85, "regime": "PULLBACK", "reason": "Brief reason"}
"""

try:
    res = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are an ultra-fast quantitative HFT scalper for Gold XAU/USD. Respond ONLY with raw JSON."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=150,
        temperature=0.1
    )
    dt = time.time() - t0
    msg = res.choices[0].message
    content = msg.content or getattr(msg, "reasoning_content", "")
    print(f"Elapsed: {dt:.2f}s")
    print(f"Result:\n{content}")
except Exception as e:
    print(f"Error: {e}")
