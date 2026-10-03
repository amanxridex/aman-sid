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

    args = parser.parse_args()

    if args.command == "status":
        print("====================================================")
        print("  RAKSHAK CYBER DEFENSE STATUS                      ")
        print("====================================================")
        native_ok = RakshakNativeCore.is_native_loaded()
        print(f"Native C++ Core: {'ACTIVE (C-ABI Linked)' if native_ok else 'EMULATED (Pure Python Mode)'}")
        anti_debug = RakshakNativeCore.check_anti_analysis()
        print(f"Anti-Analysis Defense: {'SECURE (No debuggers detected)' if anti_debug == 0 else 'WARNING: Debugger attached!'}")
        print("Vector Perturbation: ENABLED")
        print("Zero-Width Canary Stego: ENABLED")
        print("====================================================")

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
