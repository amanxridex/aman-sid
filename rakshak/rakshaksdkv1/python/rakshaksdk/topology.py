"""
Rakshak SDK v1 - Passive Header Topology & Fingerprint Engine (Python)
Evaluates HTTP header order, casing, and Sec-Fetch state machines to differentiate
genuine Blink/WebKit desktop engines from headless automated AI agents.
"""

from typing import Dict, List, Any

CHROMIUM_HEADER_ORDER_PREFIX = [
    'host',
    'connection',
    'sec-ch-ua',
    'sec-ch-ua-mobile',
    'sec-ch-ua-platform',
    'upgrade-insecure-requests',
    'user-agent',
    'accept',
    'sec-fetch-site',
    'sec-fetch-mode',
    'sec-fetch-user',
    'sec-fetch-dest',
    'accept-encoding',
    'accept-language',
]

class HeaderFingerprintResult:
    def __init__(self, is_anomalous: bool, score: int, reasons: List[str]):
        self.is_anomalous = is_anomalous
        self.score = score
        self.reasons = reasons

class RakshakTopologyEngine:
    @staticmethod
    def evaluate(raw_headers: Any) -> HeaderFingerprintResult:
        reasons: List[str] = []
        anomaly_score = 0

        # Extract header names in sequence
        if isinstance(raw_headers, dict):
            header_names = [k.lower() for k in raw_headers.keys()]
            header_map = {k.lower(): v for k, v in raw_headers.items()}
        elif isinstance(raw_headers, (list, tuple)):
            header_names = [k.lower() for k, _ in raw_headers]
            header_map = {k.lower(): v for k, v in raw_headers}
        else:
            header_names = []
            header_map = {}

        header_set = set(header_names)
        user_agent = str(header_map.get('user-agent', ''))
        claims_chrome = ('chrome/' in user_agent.lower()) and ('edg/' not in user_agent.lower())
        claims_desktop = any(os in user_agent.lower() for os in ['windows', 'macintosh', 'x11'])

        # 1. Chromium Claim vs Missing Sec-Fetch Metadata
        if claims_chrome and claims_desktop:
            has_sec_fetch = any(h.startswith('sec-fetch-') for h in header_names)
            if not has_sec_fetch:
                anomaly_score += 70
                reasons.append(
                    "CRITICAL_TOPOLOGY_ANOMALY: Desktop Chromium User-Agent claimed, "
                    "but mandatory Sec-Fetch-* metadata state headers are absent (indicative of python-requests/curl spoofing)."
                )

            has_sec_ch = 'sec-ch-ua' in header_set
            if not has_sec_ch:
                anomaly_score += 30
                reasons.append("TOPOLOGY_ANOMALY: Missing Blink sec-ch-ua client hint on claimed modern desktop browser.")

        # 2. Python / Go / Scrapy Default Header Casing & Signatures
        raw_keys = list(raw_headers.keys()) if isinstance(raw_headers, dict) else [k for k, _ in raw_headers]
        if any(k == 'User-Agent' and 'Python' in str(header_map.get('user-agent', '')) for k in raw_keys):
            anomaly_score += 60
            reasons.append("AUTOMATION_SIGNATURE: Default standard library HTTP client headers identified.")

        # 3. Topological Inversion Detection
        if claims_chrome and len(header_names) >= 4:
            accept_idx = header_names.index('accept') if 'accept' in header_names else -1
            ua_idx = header_names.index('user-agent') if 'user-agent' in header_names else -1
            if accept_idx != -1 and ua_idx != -1 and accept_idx < ua_idx:
                anomaly_score += 25
                reasons.append("TOPOLOGY_INVERSION: Accept precedes User-Agent contrary to standard Chromium Blink emission order.")

        final_score = min(100, anomaly_score)
        return HeaderFingerprintResult(
            is_anomalous=final_score >= 40,
            score=final_score,
            reasons=reasons
        )
