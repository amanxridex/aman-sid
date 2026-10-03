import time, os, json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("NVIDIA_API_KEY")
model = os.getenv("DEEPSEEK_MODEL", "deepseek-ai/deepseek-v4.1-flash")

client = OpenAI(base_url="https://integrate.api.nvidia.com/v1", api_key=api_key)

t0 = time.time()
print("Starting streaming query...")
stream = client.chat.completions.create(
    model=model,
    messages=[
        {"role": "system", "content": "You are a Gold XAU/USD HFT scalper. Respond ONLY with compact JSON: {\"action\":\"BUY\"|\"SELL\"|\"HOLD\",\"confidence\":75,\"regime\":\"TREND\",\"reason\":\"short\"}"},
        {"role": "user", "content": "Gold 4285.00, EMA9=4285.50, RSI=58. JSON:"}
    ],
    max_tokens=100,
    temperature=0.1,
    stream=True
)

first_token_time = None
full_content = ""
for chunk in stream:
    delta = chunk.choices[0].delta
    token = delta.content or getattr(delta, "reasoning_content", "") or ""
    if token and first_token_time is None:
        first_token_time = time.time() - t0
        print(f"Time to first token: {first_token_time:.2f}s")
    full_content += token

dt = time.time() - t0
print(f"Total time: {dt:.2f}s")
print("Full content:\n", full_content)
