"""
Rakshak Python SDK - Native C++ ABI Bridge (ctypes FFI)
Zero-overhead native linkage to C++20 cybersecurity core.
"""

import os
import sys
import ctypes
from typing import Optional

_LIB_INSTANCE: Optional[ctypes.CDLL] = None
_NATIVE_LOADED = False

def _find_and_load_native_core() -> Optional[ctypes.CDLL]:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(base_dir, "..", "..", "cpp", "build", "rakshak_core.dll"),
        os.path.join(base_dir, "..", "..", "cpp", "build", "librakshak_core.so"),
        os.path.join(base_dir, "..", "..", "cpp", "build", "librakshak_core.dylib"),
        os.path.join(base_dir, "rakshak_core.dll"),
        os.path.join(base_dir, "librakshak_core.so"),
    ]

    for path in candidates:
        if os.path.exists(path):
            try:
                lib = ctypes.CDLL(path)
                # Define signatures
                lib.rakshak_anti_analysis_check.restype = ctypes.c_int
                lib.rakshak_compute_shannon_entropy.argtypes = [ctypes.c_char_p, ctypes.c_size_t]
                lib.rakshak_compute_shannon_entropy.restype = ctypes.c_double
                lib.rakshak_poison_tokens.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_size_t, ctypes.c_float]
                lib.rakshak_poison_tokens.restype = ctypes.c_int
                return lib
            except Exception:
                continue
    return None

_LIB_INSTANCE = _find_and_load_native_core()
_NATIVE_LOADED = _LIB_INSTANCE is not None

class RakshakNativeCore:
    """Interface to native C++ Rakshak kernel / dynamic library."""

    @staticmethod
    def is_native_loaded() -> bool:
        return _NATIVE_LOADED

    @staticmethod
    def check_anti_analysis() -> int:
        if _LIB_INSTANCE:
            return _LIB_INSTANCE.rakshak_anti_analysis_check()
        # Pure Python fallback: check for common debuggers/profilers
        if sys.gettrace() is not None:
            return 1 # Traced by debugger (pdb, PyCharm, VSCode)
        return 0

    @staticmethod
    def compute_entropy(data: str) -> float:
        if _LIB_INSTANCE:
            b = data.encode('utf-8')
            return _LIB_INSTANCE.rakshak_compute_shannon_entropy(b, len(b))
        # Pure Python fallback
        from .entropy import RakshakEntropyEngine
        return RakshakEntropyEngine.calculate_shannon_entropy(data)
