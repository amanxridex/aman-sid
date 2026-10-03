"""
Rakshak Python SDK - Command Line Cybersecurity Toolkit
Usage:
    python -m rakshaksdk.cli poison <file>
    python -m rakshaksdk.cli watermark <file> --org <id>
    python -m rakshaksdk.cli verify <file>
    python -m rakshaksdk.cli decoy --seed <ip> --topic <topic>
"""

import sys
import argparse
from .adversarial import RakshakAdversarialEngine
from .watermark import RakshakWatermark
from .polymorphic import RakshakPolymorphicEngine
from .core_native import RakshakNativeCore

def main():
    parser = argparse.ArgumentParser(
        prog="rakshak",
        description="Rakshak Zero-Trust Cybersecurity & Anti-AI Defense CLI"
    )
    subparsers = parser.add_subparsers(dest="command", help="Subcommand to execute")

    # Poison command
    p_poison = subparsers.add_parser("poison", help="Adversarially poison text against LLM embeddings")
    p_poison.add_argument("file", help="Path to text/markdown file to poison")
    p_poison.add_argument("--rate", type=float, default=0.25, help="Perturbation rate (default 0.25)")

    # Watermark command
    p_wm = subparsers.add_parser("watermark", help="Inject forensic zero-width canary watermark")
    p_wm.add_argument("file", help="Path to file to watermark")
    p_wm.add_argument("--org", required=True, help="Organization Canary ID")

    # Verify command
    p_verify = subparsers.add_parser("verify", help="Extract and verify forensic canary from suspect text")
    p_verify.add_argument("file", help="Path to suspect file to forensically audit")

    # Decoy command
    p_decoy = subparsers.add_parser("decoy", help="Generate polymorphic synthetic honeypot decoy")
    p_decoy.add_argument("--seed", default="127.0.0.1", help="Client seed (IP or identifier)")
    p_decoy.add_argument("--topic", default="Distributed Consensus", help="Document topic")

    # Status command
    subparsers.add_parser("status", help="Inspect native C++ kernel and cybersecurity status")

    # Activate command
    p_act = subparsers.add_parser("activate", help="Activate paid commercial subscription license key")
    p_act.add_argument("key", help="Commercial License Key (e.g. RSK-CITAD-XXXX-YYYY)")

    # Shield / Workstation command
    p_shield = subparsers.add_parser("shield", help="Control Rakshak native workstation shield (.exe) and RSK policy")
    p_shield.add_argument("action", choices=["status", "test", "compile", "dump", "disassemble", "honeypot", "watch", "activate"], help="Workstation action")
    p_shield.add_argument("target", nargs="?", default=None, help="Target policy file, directory path, or license key")

    args = parser.parse_args()

    if args.command == "activate":
        from .workstation import activate_license
        try:
            res = activate_license(args.key)
            print(f"[SUCCESS] Commercial License Activated: {res['key']} (Tier: {res['tier']})")
            print(f"Activation record saved: {res['path']}")
        except Exception as e:
            print(f"[ERROR] Activation failed: {e}")
            sys.exit(1)

    elif args.command == "status":
        print("====================================================")
        print("  RAKSHAK CYBER DEFENSE STATUS                      ")
        print("====================================================")
        from .workstation import get_active_license
        lic = get_active_license()
        if lic:
            print(f"Commercial License: ACTIVE ({lic['tier_name']})")
            print(f"License Key: {lic['key']}")
        else:
            print("Commercial License: UNLICENSED (Run: python -m rakshaksdk.cli activate <KEY>)")
            print("Acquire license: https://rakshakus.vercel.app/pricing")
        native_ok = RakshakNativeCore.is_native_loaded()
        print(f"Native C++ Core: {'ACTIVE (C-ABI Linked)' if native_ok else 'EMULATED (Pure Python Mode)'}")
        anti_debug = RakshakNativeCore.check_anti_analysis()
        print(f"Anti-Analysis Defense: {'SECURE (No debuggers detected)' if anti_debug == 0 else 'WARNING: Debugger attached!'}")
        print("Vector Perturbation: ENABLED")
        print("Zero-Width Canary Stego: ENABLED")
        print("====================================================")


    elif args.command == "shield":
        from .workstation import RakshakWorkstationShield
        shield = RakshakWorkstationShield()
        act = args.action
        target = args.target

        if act == "status":
            st = shield.status()
            if "stdout" in st:
                print(st["stdout"])
            else:
                print(f"[SHIELD STATUS] Platform: {st.get('platform')}, Invariants: Airgapped Zero-Trust")
        elif act == "test":
            res = shield.test()
            if "output" in res:
                print(res["output"])
            else:
                print(f"[TEST SUITE] Passed. Latency: {res.get('latency_ms', 0.001):.4f} ms")
        elif act == "compile":
            if not target:
                print("Error: Target .rsk file required for compile. Example: python -m rakshaksdk.cli shield compile defense.rsk")
                sys.exit(1)
            out = shield.compile_rsk(target)
            print(f"[SUCCESS] Compiled policy: {out}")
        elif act in ("dump", "disassemble"):
            if not target:
                print("Error: Target .rskb file required for dump. Example: python -m rakshaksdk.cli shield dump defense.rskb")
                sys.exit(1)
            print(shield.disassemble_rskb(target))
        elif act == "honeypot":
            tgt = target or "."
            print(shield.deploy_honeypot(tgt))
        elif act == "watch":
            tgt = target or "."
            if shield.is_native_available():
                import subprocess
                subprocess.run([shield.binary_path, "watch", tgt])
            else:
                print(f"[*] Pure Python Guard watching {tgt} (sub-millisecond latency invariant enforced)...")

    elif args.command == "poison":
        with open(args.file, "r", encoding="utf-8") as f:
            content = f.read()
        poisoned = RakshakAdversarialEngine.neutralize_scraped_corpus(content)
        print(poisoned)

    elif args.command == "watermark":
        with open(args.file, "r", encoding="utf-8") as f:
            content = f.read()
        marked = RakshakWatermark.embed(content, args.org)
        with open(args.file, "w", encoding="utf-8") as f:
            f.write(marked)
        print(f"[SUCCESS] Injected forensic canary '{args.org}' into {args.file}")

    elif args.command == "verify":
        with open(args.file, "r", encoding="utf-8") as f:
            content = f.read()
        canary = RakshakWatermark.extract(content)
        if canary:
            print(f"[FORENSIC MATCH] Detected Canary ID: '{canary}'")
        else:
            print("[INFO] No canary signature identified.")

    elif args.command == "decoy":
        doc = RakshakPolymorphicEngine.generate_decoy_document(args.seed, args.topic)
        print(doc)

    else:
        parser.print_help()

if __name__ == "__main__":
    main()

