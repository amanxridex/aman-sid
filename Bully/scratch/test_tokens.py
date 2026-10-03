import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

client = OpenAI(base_url="https://integrate.api.nvidia.com/v1", api_key=os.getenv("NVIDIA_API_KEY"))
res = client.chat.completions.create(
    model="deepseek-ai/deepseek-v4.1-flash",
    messages=[
        {"role": "system", "content": "You are a Gold scalper AI. Answer ONLY in JSON: {\"action\": \"BUY\", \"confidence\": 80, \"regime\": \"BULL\", \"reason\": \"fast\"}"},
        {"role": "user", "content": "Gold 4283.70, EMA9=4284.00, RSI=35."}
    ],
    max_tokens=768,
    temperature=0.1
)
choice = res.choices[0]
print("Finish reason:", choice.finish_reason)
print("Content:", choice.message.content)
print("Reasoning:", getattr(choice.message, "reasoning_content", "None")[:100] if getattr(choice.message, "reasoning_content", None) else "None")
