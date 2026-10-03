"""
Rakshak Python SDK - Flask & WSGI Security Shield
Protects Flask, Django, and generic WSGI Python servers against automated AI scraping.
"""

from typing import Callable, Optional
import json
import os
import sys
from .detector import detect_ai_scraper
from .polymorphic import RakshakPolymorphicEngine
from .workstation import get_active_license

class RakshakFlaskShield:
    """
    Flask / WSGI Middleware Shield.
    
    Usage:
        from flask import Flask
        from rakshaksdk.middleware_flask import RakshakFlaskShield
        
        app = Flask(__name__)
        shield = RakshakFlaskShield(app, action="deceive")
    """

    def __init__(
        self,
        app,
        action: str = "deceive",
        on_threat_detected: Optional[Callable] = None,
        license_key: Optional[str] = None,
        enforce_license: bool = False
    ):
        self.app = app
        self.action = action
        self.on_threat_detected = on_threat_detected
        self.license_key = license_key
        self.enforce_license = enforce_license

        if hasattr(app, "before_request"):
            # Native Flask extension hook
            @app.before_request
            def _rakshak_interceptor():
                from flask import request, Response
                lic = get_active_license()
                if lic and not lic.get("valid"):
                    if self.enforce_license:
                        return Response(
                            json.dumps({"error": "Commercial subscription expired", "renew": "https://rakshakus.vercel.app/pricing"}),
                            status=402,
                            mimetype="application/json"
                        )
                    return None

                headers = dict(request.headers)
                ip = request.remote_addr or "127.0.0.1"
                path = request.path

                res = detect_ai_scraper(headers, url=path, ip=ip)
                if res.is_bot:
                    if self.on_threat_detected:
                        self.on_threat_detected(res, ip, path)

                    if self.action == "block":
                        return Response("Forbidden: Automated scraping denied.", status=403, mimetype="text/plain")

                    # Asymmetric Silent 200 OK Honeypot
                    decoy = RakshakPolymorphicEngine.generate_decoy_api_response(ip, path)
                    return Response(
                        json.dumps(decoy),
                        status=200,
                        mimetype="application/json",
                        headers={"X-Rakshak-Shield": "active-deception"}
                    )
                return None
