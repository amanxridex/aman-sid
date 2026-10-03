"""
==============================================================================
RAKSHAK DEFENSE SUITE - ML ENTROPY & DISTILLATION ANALYSIS ENGINE
File: packages/rakshaksdkv1/python/rakshaksdk/ml_entropy_engine.py
License: Proprietary / Enterprise Air-Gapped EULA
Description: Streaming statistical analysis calculating Kolmogorov complexity
             approximations, Shannon entropy, and Markov token transition
             probabilities to detect automated scrapers and model extractors.
==============================================================================
"""

import math
import zlib
import collections
from typing import Dict, List, Tuple, Any


class StreamingEntropyEngine:
    """
    Computes real-time streaming metrics over incoming request bodies and prompt tokens
    to distinguish organic human exploration from automated AI crawler loops.
    """

    def __init__(self, window_size: int = 512):
        self.window_size = window_size
        self.char_counts: collections.Counter = collections.Counter()
        self.total_chars = 0
        self.bigram_counts: collections.Counter = collections.Counter()
        self.last_char: Optional[str] = None

    def calculate_shannon_entropy(self, data: str) -> float:
        """Calculates Shannon entropy in bits per character: H(X) = -sum(P(x) * log2(P(x)))."""
        if not data:
            return 0.0

        length = len(data)
        freq = collections.Counter(data)
        entropy = 0.0

        for count in freq.values():
            p = count / length
            entropy -= p * math.log2(p)

        return round(entropy, 4)

    def estimate_kolmogorov_complexity(self, data: str) -> float:
        """
        Approximates normalized Kolmogorov complexity K(s) via compressed size ratio:
        K(s) = len(compress(s)) / len(s). Low ratio implies high algorithmic predictability.
        """
        if not data:
            return 0.0

        raw_bytes = data.encode('utf-8')
        if len(raw_bytes) < 16:
            return 1.0

        compressed = zlib.compress(raw_bytes, level=9)
        ratio = len(compressed) / len(raw_bytes)
        return round(min(ratio, 1.0), 4)

    def evaluate_markov_perplexity(self, tokens: List[str]) -> float:
        """
        Calculates bigram perplexity over a token sequence. Machine-generated
        scrapers exhibit unnaturally low perplexity (rigid templates) or extreme high perplexity (fuzzers).
        """
        if len(tokens) < 2:
            return 0.0

        bigrams = list(zip(tokens[:-1], tokens[1:]))
        bigram_counts = collections.Counter(bigrams)
        unigram_counts = collections.Counter(tokens[:-1])

        log_prob_sum = 0.0
        for w1, w2 in bigrams:
            p = (bigram_counts[(w1, w2)] + 1) / (unigram_counts[w1] + len(unigram_counts))
            log_prob_sum += math.log2(p)

        cross_entropy = -log_prob_sum / len(bigrams)
        perplexity = math.pow(2, cross_entropy)
        return round(perplexity, 3)

    def classify_payload(self, text: str) -> Dict[str, Any]:
        """
        Performs multi-dimensional forensic classification of input payload.
        Returns bot likelihood score [0.0 to 1.0] and anomaly indicators.
        """
        shannon = self.calculate_shannon_entropy(text)
        kolmogorov = self.estimate_kolmogorov_complexity(text)
        tokens = text.split()
        perplexity = self.evaluate_markov_perplexity(tokens)

        # Bot indicators:
        # 1. Unusually low Kolmogorov (< 0.25) -> repetitive templated prompt injection / scraper loops
        # 2. Shannon entropy outside human normal range (3.2 - 4.8 for typical text)
        is_synthetic = False
        bot_score = 0.0

        if kolmogorov < 0.28 and len(text) > 100:
            bot_score += 0.45
            is_synthetic = True

        if shannon < 2.8 or shannon > 5.5:
            bot_score += 0.35

        if len(tokens) > 20 and perplexity < 3.0:
            bot_score += 0.30

        bot_score = min(round(bot_score, 2), 1.0)

        return {
            "shannon_entropy": shannon,
            "kolmogorov_ratio": kolmogorov,
            "markov_perplexity": perplexity,
            "bot_likelihood": bot_score,
            "is_synthetic": is_synthetic,
            "recommendation": "DECEPTION_INJECT" if bot_score >= 0.70 else "ALLOW"
        }
