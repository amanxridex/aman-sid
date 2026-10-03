"""
Rakshak SDK v1 - Python Cybersecurity & Anti-AI Defense Engine
Engineered with Native C-ABI Linkage, Adversarial AI Inversion, and Zero-Trust Telemetry Defenses.
"""

from .detector import detect_ai_scraper, DetectionResult
from .watermark import RakshakWatermark
from .poisoner import RakshakPoisoner
from .topology import RakshakTopologyEngine, HeaderFingerprintResult
from .entropy import RakshakEntropyEngine, VelocityMetrics
from .polymorphic import RakshakPolymorphicEngine
from .waterfall import RakshakWaterfallEngine, WaterfallMetrics
from .adversarial import RakshakAdversarialEngine
from .core_native import RakshakNativeCore
from .middleware_fastapi import RakshakFastAPIShield
from .middleware_flask import RakshakFlaskShield
from .workstation import RakshakWorkstationShield, find_rakshak_executable
from .os_shield import RakshakOSShield

__version__ = "1.0.0"

__all__ = [
    "detect_ai_scraper",
    "DetectionResult",
    "RakshakWatermark",
    "RakshakPoisoner",
    "RakshakTopologyEngine",
    "HeaderFingerprintResult",
    "RakshakEntropyEngine",
    "VelocityMetrics",
    "RakshakPolymorphicEngine",
    "RakshakWaterfallEngine",
    "WaterfallMetrics",
    "RakshakAdversarialEngine",
    "RakshakNativeCore",
    "RakshakFastAPIShield",
    "RakshakFlaskShield",
    "RakshakWorkstationShield",
    "RakshakOSShield",
    "find_rakshak_executable",
]

