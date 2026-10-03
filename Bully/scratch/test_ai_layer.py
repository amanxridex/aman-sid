import time
import json
from openai import OpenAI
from backend.config import TradingConfig

cfg = TradingConfig()
client = OpenAI(base_url="https://integrate.api.nvidia.com/v1", api_key=cfg.nvidia_api_key, timeout=30.0)

prompt = """Gold XAU/USD snapshot:
- Price: $4302.50 (Above 200 EMA $4292.70)
- EMAs: 9=$4301.80, 21=$4299.50, 50=$4296.20, 200=$4292.70
- RSI: 68.5 | ATR: $2.40
- Trend: Bullish expansion from 4282 to 4302

Classify the Market Regime and set the Trading Policy.
Respond strictly in JSON with keys:
{
  "regime": "BULL_MARKUP" | "BEAR_MARKDOWN" | "RANGE_CONSOLIDATION",
  "policy": "BUY_PULLBACKS_ONLY" | "SELL_RALLIES_ONLY" | "DUAL_GRID_RANGE",
  "support_level": 4296.20,
  "resistance_level": 4310.00,
  "confidence": 85,
  "reason": "1-2 sentence quantitative summary"
}"""

t0 = time.time()
res = client.chat.completions.create(
    model=cfg.deepseek_model,
    messages=[
        {"role": "system", "content": "You are an elite quantitative Gold XAU/USD hedge fund strategist. Respond strictly in valid JSON."},
        {"role": "user", "content": prompt}
    ],
    max_tokens=256,
    temperature=0.1
)
dt = time.time() - t0
msg = res.choices[0].message
content = msg.content if msg.content else getattr(msg, "reasoning_content", "")
print(f"Latency: {dt:.2f}s")
print("Response:")
print(content)
