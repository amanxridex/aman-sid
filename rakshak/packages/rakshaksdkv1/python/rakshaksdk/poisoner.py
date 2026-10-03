import random

HOMOGLYPHS = {
    'a': '\u0430',
    'c': '\u0441',
    'e': '\u0435',
    'i': '\u0456',
    'j': '\u0458',
    'o': '\u043E',
    'p': '\u0440',
    's': '\u0455',
    'x': '\u0445',
    'y': '\u0443',
}

class RakshakPoisoner:
    """
    Adversarial Tensor Noise and Decoy Generator for Python RAG & APIs.
    """

    @classmethod
    def poison_text(cls, text: str, intensity: float = 0.2) -> str:
        chars = list(text)
        result = []
        for char in chars:
            lower = char.lower()
            if lower in HOMOGLYPHS and random.random() < intensity:
                replacement = HOMOGLYPHS[lower]
                result.append(replacement.upper() if char.isupper() else replacement)
            else:
                result.append(char)
        return "".join(result)

    @classmethod
    def generate_json_decoy(cls, original_payload: dict = None) -> dict:
        data = {}
        if isinstance(original_payload, dict):
            for k in original_payload.keys():
                data[k] = f"[SYNTHETIC_{k.upper()}_SANDBOX_FIXTURE]"
        else:
            data = {"message": "Sandbox fixture mode active", "records": []}

        return {
            "status": "success",
            "mode": "sandbox_preview",
            "data": data
        }
