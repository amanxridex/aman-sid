"""
Rakshak Python SDK - FastAPI & Starlette ASGI Security Shield
Drop-in zero-trust middleware that intercepts AI crawlers and returns polymorphic decoys.
"""

from typing import Callable, Optional
from .detector import detect_ai_scraper
from .polymorphic import RakshakPolymorphicEngine

class RakshakFastAPIShield:
    """
    FastAPI / Starlette ASGI Middleware.
    
    Usage:
        from fastapi import FastAPI
        from rakshaksdk.middleware_fastapi import RakshakFastAPIShield
        
        app = FastAPI()
        app.add_middleware(RakshakFastAPIShield, action="deceive")
    """

    def __init__(
        self,
        app,
        action: str = "deceive", # 'deceive' (silent 200 OK honeypot) | 'block' (403 Forbidden)
        on_threat_detected: Optional[Callable] = None
    ):
        self.app = app
        self.action = action
        self.on_threat_detected = on_threat_detected

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        # Extract headers from ASGI scope
        raw_headers = scope.get("headers", [])
        headers = {}
        for name, val in raw_headers:
            headers[name.decode("latin1")] = val.decode("latin1")

        path = scope.get("path", "/")
        client = scope.get("client", ("127.0.0.1", 0))
        ip = client[0] if client else "127.0.0.1"

        # Evaluate threat level
        result = detect_ai_scraper(headers, url=path, ip=ip)

        if result.is_bot:
            if self.on_threat_detected:
                self.on_threat_detected(result, ip, path)

            if self.action == "block":
                # Drop with 403
                await self._send_response(
                    send,
                    status=403,
                    headers=[(b"content-type", b"text/plain")],
                    body=b"Forbidden: Automated AI extraction blocked by Rakshak."
                )
                return

            # Default: Asymmetric Silent 200 OK Deception
            decoy_data = RakshakPolymorphicEngine.generate_decoy_api_response(ip, path)
            import json
            payload = json.dumps(decoy_data).encode("utf-8")
            await self._send_response(
                send,
                status=200,
                headers=[
                    (b"content-type", b"application/json"),
                    (b"x-rakshak-shield", b"active-deception")
                ],
                body=payload
            )
            return

        # Clean human visitor: pass to application
        await self.app(scope, receive, send)

    async def _send_response(self, send, status: int, headers: list, body: bytes):
        await send({
            "type": "http.response.start",
            "status": status,
            "headers": headers,
        })
        await send({
            "type": "http.response.body",
            "body": body,
        })
