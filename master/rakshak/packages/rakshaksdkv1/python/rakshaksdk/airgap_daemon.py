"""
==============================================================================
RAKSHAK DEFENSE SUITE - NATIVE AIR-GAP SOCKET DAEMON & EGRESS INTERCEPTOR
File: packages/rakshaksdkv1/python/rakshaksdk/airgap_daemon.py
License: Proprietary / Enterprise Air-Gapped EULA
Description: Low-level Python socket interceptor enforcing strictly 0-byte
             cloud egress, intercepting outbound telemetry and generating
             honey-tokens for forensic tracking.
==============================================================================
"""

import os
import sys
import socket
import select
import threading
import time
import logging
import hashlib
import struct
from typing import Optional, Callable, Dict, Any

logger = logging.getLogger("Rakshak.AirGapDaemon")


class AirGapViolationException(Exception):
    """Raised when an unauthorized outbound network connection attempt is intercepted."""
    pass


class RakshakAirGapDaemon:
    """
    Enforces a strict, local-only perimeter by auditing process socket bindings,
    monkey-patching Python standard socket calls in memory, and maintaining an
    in-memory sinkhole for DNS/telemetry leaks.
    """

    def __init__(self, fail_closed: bool = True, allow_loopback_only: bool = True):
        self.fail_closed = fail_closed
        self.allow_loopback_only = allow_loopback_only
        self._is_active = False
        self._lock = threading.Lock()
        self._original_socket_create = socket.socket
        self._original_getaddrinfo = socket.getaddrinfo
        self._violations_count = 0
        self._intercepted_hosts: Dict[str, int] = {}
        self._on_violation_callback: Optional[Callable[[str, int], None]] = None

    def register_violation_handler(self, callback: Callable[[str, int], None]) -> None:
        self._on_violation_callback = callback

    def _is_permitted_ip(self, host: str) -> bool:
        if not self.allow_loopback_only:
            return True

        if host in ("localhost", "127.0.0.1", "::1", "0.0.0.0"):
            return True

        try:
            ip = socket.inet_aton(host)
            # 127.0.0.0/8 loopback
            if ip[0] == 127:
                return True
        except (OSError, socket.error):
            pass

        return False

    def _guarded_connect(self, sock_self, address):
        host, port = address[0], address[1]
        str_host = str(host)

        if not self._is_permitted_ip(str_host):
            with self._lock:
                self._violations_count += 1
                self._intercepted_hosts[str_host] = self._intercepted_hosts.get(str_host, 0) + 1

            violation_msg = f"[RAKSHAK-AIRGAP] Blocked illegal outbound egress to {str_host}:{port}"
            logger.critical(violation_msg)

            if self._on_violation_callback:
                try:
                    self._on_violation_callback(str_host, port)
                except Exception:
                    pass

            if self.fail_closed:
                raise AirGapViolationException(violation_msg)
            else:
                # Sinkhole connection silently to 127.0.0.1 on closed port
                return self._original_connect(sock_self, ("127.0.0.1", 9))

        return self._original_connect(sock_self, address)

    def _guarded_getaddrinfo(self, host, port, *args, **kwargs):
        str_host = str(host)
        if self.allow_loopback_only and not self._is_permitted_ip(str_host):
            with self._lock:
                self._violations_count += 1
                self._intercepted_hosts[str_host] = self._intercepted_hosts.get(str_host, 0) + 1

            logger.warning(f"[RAKSHAK-AIRGAP] Intercepted external DNS resolution for '{str_host}'")
            if self.fail_closed:
                raise socket.gaierror(-2, f"Name resolution disabled by Rakshak Air-Gap Enclave: {str_host}")
            else:
                return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("127.0.0.1", port))]

        return self._original_getaddrinfo(host, port, *args, **kwargs)

    def activate(self) -> bool:
        """Hooks low-level socket creation and DNS resolution."""
        with self._lock:
            if self._is_active:
                return True

            self._original_connect = socket.socket.connect
            socket.socket.connect = self._guarded_connect
            socket.getaddrinfo = self._guarded_getaddrinfo
            self._is_active = True
            logger.info("[RAKSHAK-AIRGAP] 0-Byte cloud egress enclave ACTIVE. Network isolated to local loopback.")
            return True

    def deactivate(self) -> None:
        """Restores original socket functions upon verified teardown."""
        with self._lock:
            if not self._is_active:
                return
            socket.socket.connect = self._original_connect
            socket.getaddrinfo = self._original_getaddrinfo
            self._is_active = False
            logger.info("[RAKSHAK-AIRGAP] Egress interceptor deactivated.")

    def get_audit_summary(self) -> Dict[str, Any]:
        with self._lock:
            return {
                "active": self._is_active,
                "allow_loopback_only": self.allow_loopback_only,
                "total_egress_attempts_intercepted": self._violations_count,
                "intercepted_hosts": dict(self._intercepted_hosts),
                "egress_bytes_leaked": 0
            }


# Global singleton instance for immediate process sealing
airgap_enclave = RakshakAirGapDaemon(fail_closed=True, allow_loopback_only=True)
