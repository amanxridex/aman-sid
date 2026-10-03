"""
Rakshak SDK v1 - Asset Waterfall & Zero-Signature Scraper Detector (Python)
Catches stealth crawlers that spoof genuine Google Chrome User-Agents by analyzing
their refusal to download subresource bundles (CSS, JS, fonts, images).
"""

import re
import time
from collections import defaultdict
from typing import List, Dict

ASSET_REGEX = re.compile(r'\.(css|js|mjs|woff|woff2|ttf|png|jpg|jpeg|svg|webp|ico)(\?.*)?$', re.IGNORECASE)

class WaterfallMetrics:
    def __init__(self, doc_count: int, asset_count: int, ratio: float, is_headless_extractor: bool, confidence: int, reasons: List[str]):
        self.doc_count = doc_count
        self.asset_count = asset_count
        self.ratio = ratio
        self.is_headless_extractor = is_headless_extractor
        self.confidence = confidence
        self.reasons = reasons

class RakshakWaterfallEngine:
    _sessions: Dict[str, Dict[str, float]] = defaultdict(lambda: {"docs": 0, "assets": 0, "last_seen": time.time()})

    @classmethod
    def record_and_evaluate(cls, client_id: str, path: str) -> WaterfallMetrics:
        now = time.time()
        session = cls._sessions[client_id]
        session["last_seen"] = now

        if ASSET_REGEX.search(path):
            session["assets"] += 1
        else:
            session["docs"] += 1

        docs = int(session["docs"])
        assets = int(session["assets"])
        reasons: List[str] = []
        is_headless = False
        confidence = 0

        # Behavioral Anomaly: Real Chrome downloads 15-50 assets per page HTML.
        # Scrapers (Crawl4AI, Firecrawl, Python Requests) deliberately abort asset downloads.
        if docs >= 4 and assets == 0:
            is_headless = True
            confidence = 95
            reasons.append(
                f"ZERO_SUBRESOURCE_WATERFALL: Client queried {docs} documents/endpoints without initiating a single CSS/JS/image render cascade."
            )
        elif docs >= 8 and (assets / docs) < 0.25:
            is_headless = True
            confidence = 85
            reasons.append(
                f"ABNORMAL_ASSET_RATIO: Subresource ratio ({assets / docs:.2f}) mathematically disproves genuine browser rendering."
            )

        ratio = (assets / docs) if docs > 0 else 1.0
        return WaterfallMetrics(
            doc_count=docs,
            asset_count=assets,
            ratio=round(ratio, 2),
            is_headless_extractor=is_headless,
            confidence=confidence,
            reasons=reasons
        )
