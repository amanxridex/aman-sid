"""
Rakshak SDK v1 - Shannon Entropy & Clockwork Velocity Analysis Engine (Python)
Measures request distribution entropy H = -sum(p_i * log2(p_i)) and inter-arrival
latency standard deviation to detect robotic automated harvesting.
"""

import math
import time
from collections import defaultdict
from typing import List, Dict, Tuple

class VelocityMetrics:
    def __init__(self, path_entropy: float, req_count: int, std_dev_latency_ms: float, is_robotic_velocity: bool, reasons: List[str]):
        self.path_entropy = path_entropy
        self.req_count = req_count
        self.std_dev_latency_ms = std_dev_latency_ms
        self.is_robotic_velocity = is_robotic_velocity
        self.reasons = reasons

class RakshakEntropyEngine:
    _history: Dict[str, List[Tuple[float, str]]] = defaultdict(list)
    _MAX_WINDOW_MS = 60_000 # 60-second sliding ring buffer

    @staticmethod
    def calculate_shannon_entropy(text: str) -> float:
        """Calculates normalized Shannon entropy H = -sum(p * log2(p)) for any token/path stream."""
        if not text:
            return 0.0
        frequencies: Dict[str, int] = defaultdict(int)
        for ch in text:
            frequencies[ch] += 1
        entropy = 0.0
        length = len(text)
        for count in frequencies.values():
            p = count / length
            entropy -= p * math.log2(p)
        return round(entropy, 4)

    @classmethod
    def record_and_analyze(cls, client_id: str, path: str) -> VelocityMetrics:
        now = time.time() * 1000.0
        client_records = cls._history[client_id]

        # Prune events outside sliding window
        window_start = now - cls._MAX_WINDOW_MS
        cls._history[client_id] = [r for r in client_records if r[0] >= window_start]
        cls._history[client_id].append((now, path))

        records = cls._history[client_id]
        req_count = len(records)
        reasons: List[str] = []
        is_robotic = False

        if req_count < 5:
            return VelocityMetrics(
                path_entropy=0.0,
                req_count=req_count,
                std_dev_latency_ms=0.0,
                is_robotic_velocity=False,
                reasons=[]
            )

        # 1. Compute inter-arrival deltas
        deltas: List[float] = []
        for i in range(1, req_count):
            deltas.append(records[i][0] - records[i - 1][0])

        mean_delta = sum(deltas) / len(deltas)
        variance = sum((d - mean_delta) ** 2 for d in deltas) / len(deltas)
        std_dev = math.sqrt(variance)

        # Clockwork AI Scraper Detection:
        # Humans exhibit natural log-normal variance in inter-keystroke / navigation intervals (stdDev > 250ms).
        # Algorithmic pollers/crawlers exhibit ultra-low jitter (stdDev < 65ms).
        if req_count >= 15 and std_dev < 65.0:
            is_robotic = True
            reasons.append(
                f"CLOCKWORK_VELOCITY_ANOMALY: Deterministic inter-request jitter observed "
                f"(stdDev = {std_dev:.2f}ms across {req_count} requests in 60s window)."
            )

        # 2. Shannon Path Transition Entropy
        path_stream = "".join(r[1] for r in records)
        entropy = cls.calculate_shannon_entropy(path_stream)

        # Monotonous path hammering (e.g. brute-forcing an API endpoint)
        if req_count >= 20 and entropy < 1.8:
            is_robotic = True
            reasons.append(
                f"LOW_ENTROPY_HAMMERING: Request path sequence entropy abnormally low "
                f"(H = {entropy:.2f} bits/symbol across {req_count} queries)."
            )

        return VelocityMetrics(
            path_entropy=entropy,
            req_count=req_count,
            std_dev_latency_ms=round(std_dev, 2),
            is_robotic_velocity=is_robotic,
            reasons=reasons
        )
