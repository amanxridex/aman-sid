import json
import time
import secrets

ZW_ZERO = "\u200B"
ZW_ONE = "\u200C"
ZW_DELIM = "\u200D"

class RakshakWatermark:
    """
    Steganographic Zero-Width Canary Watermarking for Python text.
    """

    @classmethod
    def inject(cls, content: str, org_id: str) -> str:
        payload = json.dumps({
            "org": org_id,
            "t": int(time.time()),
            "nonce": secrets.token_hex(4)
        })
        
        bytes_data = payload.encode("utf-8")
        binary = "".join(f"{b:08b}" for b in bytes_data)
        
        zw_str = ZW_DELIM + "".join(ZW_ZERO if bit == "0" else ZW_ONE for bit in binary) + ZW_DELIM
        
        # Inject after first period
        period_idx = content.find(". ")
        if period_idx != -1:
            return content[:period_idx + 1] + zw_str + content[period_idx + 1:]
        return content + zw_str

    @classmethod
    def extract(cls, text: str):
        start = text.find(ZW_DELIM)
        if start == -1:
            return None
        end = text.find(ZW_DELIM, start + 1)
        if end == -1:
            return None
            
        zw_content = text[start + 1:end]
        binary = "".join("0" if c == ZW_ZERO else "1" for c in zw_content if c in (ZW_ZERO, ZW_ONE))
        
        if len(binary) % 8 != 0:
            return None
            
        try:
            bytes_list = [int(binary[i:i+8], 2) for i in range(0, len(binary), 8)]
            decoded = bytes(bytes_list).decode("utf-8")
            return json.loads(decoded)
        except Exception:
            return None
