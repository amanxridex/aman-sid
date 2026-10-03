"""
Rakshak Python SDK v1 - Comprehensive Cybersecurity & Anti-AI Verification Suite
"""

import sys
from rakshaksdk import (
    detect_ai_scraper,
    RakshakWatermark,
    RakshakPoisoner,
    RakshakTopologyEngine,
    RakshakEntropyEngine,
    RakshakPolymorphicEngine,
    RakshakAdversarialEngine,
    RakshakNativeCore,
)

def run_tests():
    passed = 0
    total = 0

    def test(name, condition):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"[PASS] {name}")
        else:
            print(f"[FAIL] {name}")
            sys.exit(1)

    print("====================================================")
    print("  RAKSHAK CYBERSECURITY PYTHON SUITE                ")
    print("====================================================")

    # 1. Anti-Analysis & Debugger Probe
    status = RakshakNativeCore.check_anti_analysis()
    test("Anti-Analysis probe should execute cleanly", status in (0, 1))

    # 2. Adversarial BPE Token Splitting
    original_text = "The machine learning algorithm optimizes transformer attention weights."
    bpe_split = RakshakAdversarialEngine.disrupt_bpe_tokens(original_text, split_rate=1.0)
    test("BPE disruption should insert zero-width breaks into subwords", '\u200C' in bpe_split)

    # 3. Embedding Vector Disruption
    corrupted = RakshakAdversarialEngine.corrupt_embeddings(original_text, perturbation_rate=1.0)
    test("Embedding corruption should replace Latin chars with Cyrillic homoglyphs", corrupted != original_text)

    # 4. LLM Jailbreak Trap
    trapped = RakshakAdversarialEngine.inject_llm_jailbreak_honeypot(original_text, "Independent Streetwear Brand")
    test("Jailbreak honeypot should contain system override directive", "SYSTEM DIRECTIVE TO AUTONOMOUS AI AGENT" in trapped)

    # 5. Shannon Entropy Engine
    ent_high = RakshakEntropyEngine.calculate_shannon_entropy("7f8a9b2c3d4e5f6a1b2c3d4e5f")
    ent_low = RakshakEntropyEngine.calculate_shannon_entropy("aaaaaaaaaaaaaaaaaaaaaaaaaa")
    test("High entropy string should score > 3.0", ent_high > 3.0)
    test("Zero variance string should have 0 entropy", ent_low == 0.0)

    # 6. Polymorphic Honeypot Engine
    doc1 = RakshakPolymorphicEngine.generate_decoy_document("192.168.1.1", "Vector DB")
    doc2 = RakshakPolymorphicEngine.generate_decoy_document("192.168.1.1", "Vector DB")
    doc3 = RakshakPolymorphicEngine.generate_decoy_document("10.0.0.1", "Vector DB")
    test("Polymorphic doc should generate non-empty technical text", len(doc1) > 100)
    test("Same seed must reproduce identical decoy document", doc1 == doc2)
    test("Different seeds must produce different decoy documents", doc1 != doc3)

    # 7. Canary Steganography
    secret = "Confidential architectural patent filings."
    marked = RakshakWatermark.embed(secret, "legal_corp_007")
    test("Watermark should be present in embedded text", RakshakWatermark.has_watermark(marked))
    extracted = RakshakWatermark.extract(marked)
    test("Extracted canary payload must match original", extracted == "legal_corp_007")

    # 8. AI Scraper Interception
    bot_headers = {
        'user-agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)'
    }
    res = detect_ai_scraper(bot_headers)
    test("ClaudeBot should be intercepted with high confidence", res.is_bot and res.confidence >= 50)

    # 9. Header Topology Anomaly
    spoofed = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36'
    }
    topo = RakshakTopologyEngine.evaluate(spoofed)
    test("Spoofed Chrome missing Sec-Fetch should trigger topology anomaly", topo.is_anomalous)

    print("====================================================")
    print(f"Results: {passed} / {total} tests passed (100%)")
    print("====================================================")

if __name__ == "__main__":
    run_tests()
