"""
Rakshak Python SDK - Rakshak Bytecode Virtual Machine (RSK-VM)
Executes compiled .rskb binary security policies inside Python.
"""

from typing import Dict, Any, List, Optional
from .detector import detect_ai_scraper
from .waterfall import RakshakWaterfallEngine
from .polymorphic import RakshakPolymorphicEngine

class RakshakPythonVM:
    def __init__(self, bytecode: bytes):
        self.bytecode = bytecode
        self.targets: List[str] = []
        self.trap_debugger: bool = False
        self.require_waterfall: bool = False
        self.min_waterfall_ratio: float = 0.25
        self.mode: str = "deceive"
        self.canary_id: str = "CANARY"
        self.decoy_topic: str = "Architecture"
        self._decode()

    def _decode(self):
        b = self.bytecode
        if len(b) < 4 or b[:4] != b"RSK\x01":
            raise ValueError("InvalidBytecode: Missing 'RSK\\x01' magic header.")

        ip = 4
        while ip < len(b):
            op = b[ip]
            ip += 1
            if op == 0xFF: # HALT
                break
            elif op == 0x01: # TARGET_PATH
                length = b[ip]
                ip += 1
                self.targets.append(b[ip:ip+length].decode('utf-8'))
                ip += length
            elif op == 0x02: # TRAP_DEBUGGER
                self.trap_debugger = True
            elif op == 0x05: # REQUIRE_WATERFALL
                self.require_waterfall = True
                self.min_waterfall_ratio = b[ip] / 100.0
                ip += 1
            elif op == 0x08: # MODE_DECEIVE
                self.mode = "deceive"
            elif op == 0x09: # MODE_BLOCK
                self.mode = "block"
            elif op == 0x0B: # INJECT_CANARY
                length = b[ip]
                ip += 1
                self.canary_id = b[ip:ip+length].decode('utf-8')
                ip += length
            elif op == 0x0C: # SYNTHESIZE_DECOY
                length = b[ip]
                ip += 1
                self.decoy_topic = b[ip:ip+length].decode('utf-8')
                ip += length

    def execute(self, headers: Dict[str, str], path: str = "/", ip: str = "127.0.0.1") -> Dict[str, Any]:
        threat = detect_ai_scraper(headers, url=path, ip=ip)
        is_violation = threat.is_bot

        if self.require_waterfall:
            waterfall = RakshakWaterfallEngine.record_and_evaluate(ip, path)
            if waterfall.is_headless_extractor:
                is_violation = True
                threat.reasons.extend(waterfall.reasons)

        if not is_violation:
            return {
                "allowed": True,
                "status": 200,
                "reasons": ["RSK_POLICY_PASSED"]
            }

        if self.mode == "block":
            return {
                "allowed": False,
                "status": 403,
                "body": "Forbidden by Rakshak Security Policy (.rsk)"
            }

        # Asymmetric Deception
        decoy = RakshakPolymorphicEngine.generate_decoy_api_response(ip, path)
        return {
            "allowed": False,
            "status": 200,
            "body": decoy,
            "reasons": threat.reasons
        }
