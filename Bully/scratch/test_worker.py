import os, time, threading
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("NVIDIA_API_KEY")
model = os.getenv("DEEPSEEK_MODEL", "deepseek-ai/deepseek-v4.1-flash")

client = OpenAI(base_url="https://integrate.api.nvidia.com/v1", api_key=api_key, timeout=25.0)

def worker(worker_id):
    for i in range(2):
        t0 = time.time()
        print(f"Worker {worker_id} sending request {i}...")
        try:
            res = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a Gold scalper. Output ONLY JSON: {\"action\": \"BUY\"|\"SELL\"|\"HOLD\", \"confidence\": 80, \"regime\": \"BULL\", \"reason\": \"test\"}"},
                    {"role": "user", "content": "Gold 4286.00, EMA9=4286.20, RSI=65. JSON:"}
                ],
                max_tokens=150,
                temperature=0.1
            )
            dt = time.time() - t0
            msg = res.choices[0].message
            txt = msg.content or getattr(msg, "reasoning_content", "") or ""
            print(f"Worker {worker_id} request {i} finished in {dt:.2f}s: {txt[:80]}...")
        except Exception as e:
            dt = time.time() - t0
            print(f"Worker {worker_id} request {i} failed in {dt:.2f}s: {e}")

threads = [threading.Thread(target=worker, args=(w,), daemon=True) for w in range(2)]
for t in threads:
    t.start()
for t in threads:
    t.join(timeout=60)
print("Test completed!")
