"""
Rakshak SDK v1 - Python Detection Heuristics & Behavioral Fusion Engine
Integrates User-Agent analysis, cloud ASN telemetry, header topology, and Shannon entropy.
"""

from typing import Dict, List, Optional
from .topology import RakshakTopologyEngine
from .entropy import RakshakEntropyEngine
from .waterfall import RakshakWaterfallEngine

CLOUD_DATACENTER_ASNS = {
    '15169', '396982', '19527', '36040', '36384',
    '16509', '14618', '8075', '8074', '12076',
    '46484', '13335', '31898', '14061', '24940',
    '16276', '63949', '20473', '28753', '9009', '174'
}

AI_BOT_KEYWORDS = [
    'claudebot', 'claude-web', 'anthropic-ai', 'claude',
    'gptbot', 'chatgpt-user', 'oai-searchbot', 'openai', 'chatgpt',
    'google-extended', 'googleother', 'googlebot', 'gemini', 'vertex',
    'perplexitybot', 'perplexity', 'deepseekbot', 'deepseek',
    'tavily', 'firecrawl', 'jina', 'crawl4ai', 'headless', 'puppeteer',
    'playwright', 'python-requests', 'aiohttp', 'httpx', 'curl', 'wget'
]

class DetectionResult:
    def __init__(self, is_bot: bool, confidence: int, threat_type: Optional[str] = None, reasons: List[str] = None):
        self.is_bot = is_bot
        self.confidence = confidence
        self.threat_type = threat_type
        self.reasons = reasons or []

    def __repr__(self) -> str:
        return f"<DetectionResult is_bot={self.is_bot} confidence={self.confidence}% threat={self.threat_type}>"

def detect_ai_scraper(headers: Dict[str, str], url: str = "/", ip: str = "client") -> DetectionResult:
    headers_lower = {k.lower(): v.lower() for k, v in headers.items()}
    reasons: List[str] = []
    score = 0

    user_agent = headers_lower.get('user-agent', '')
    sec_ch_ua = headers_lower.get('sec-ch-ua', '')
    accept_language = headers_lower.get('accept-language', '')
    asn = headers_lower.get('x-vercel-ip-as-number') or headers_lower.get('cf-ipasn', '')

    for kw in AI_BOT_KEYWORDS:
        if kw in user_agent:
            score += 75
            reasons.append(f"Matched AI crawler User-Agent signature: {kw}")
            break

    if 'headless' in sec_ch_ua or 'headless' in user_agent:
        score += 55
        reasons.append("Headless browser automation fingerprint identified")

    if asn and asn in CLOUD_DATACENTER_ASNS and not accept_language:
        score += 50
        reasons.append(f"Request originates from cloud datacenter ASN: {asn}")

    # 1. Header Topology Evaluation
    topo = RakshakTopologyEngine.evaluate(headers)
    if topo.is_anomalous:
        score += int(topo.score * 0.5)
        reasons.extend(topo.reasons)

    # 2. Shannon Entropy & Velocity Evaluation
    entropy_metric = RakshakEntropyEngine.record_and_analyze(ip, url)
    if entropy_metric.is_robotic_velocity:
        score += 45
        reasons.extend(entropy_metric.reasons)

    # 3. Zero-Signature Asset Waterfall Cascade Evaluation
    waterfall = RakshakWaterfallEngine.record_and_evaluate(ip, url)
    if waterfall.is_headless_extractor:
        score += 50
        reasons.extend(waterfall.reasons)

    confidence = min(100, score)
    is_bot = confidence >= 50
    threat_type = "LLM_CRAWLER" if ("AI crawler" in " ".join(reasons) or "gpt" in user_agent or "claude" in user_agent) else ("ANOMALOUS_SCRAPER" if is_bot else None)

    return DetectionResult(is_bot=is_bot, confidence=confidence, threat_type=threat_type, reasons=reasons)
