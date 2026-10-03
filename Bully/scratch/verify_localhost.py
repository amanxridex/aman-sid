import urllib.request
import json

resp = urllib.request.urlopen("http://127.0.0.1:8000/")
print(f"GET / -> Status: {resp.status} (Length: {len(resp.read())} bytes)")

resp2 = urllib.request.urlopen("http://127.0.0.1:8000/api/status")
data = json.loads(resp2.read().decode("utf-8"))
print(f"GET /api/status -> Status: {resp2.status} | Account Balance: ${data['account']['balance']:,.2f} | Positions: {len(data['positions'])} | Regime: {data['deepseek_stats']['macro_regime']}")
