#!/usr/bin/env bash
# ============================================================================
# RAKSHAK LINUX KERNEL & NETWORK HARDENING SENTINEL (Bash)
# Deploys iptables/nftables packet dropping, scans /proc for headless crawlers
# ============================================================================

set -euo pipefail

echo "===================================================="
echo "  RAKSHAK LINUX HOST & NETWORK HARDENING SENTINEL    "
echo "===================================================="

# 1. Detect Headless Crawlers, Local LLMs, and Autonomous AI Agents in /proc
echo "[+] Scanning /proc for stealth AI crawlers, Recall workers, and autonomous agents..."
AI_SIGS="headless|puppeteer|playwright|selenium|crawl4ai|firecrawl|ollama|vllm|llama-server|langchain|crewai|autogen|autogpt|open-interpreter|tesseract|recall"
SUSPECT_PIDS=$(pgrep -f "$AI_SIGS" || true)

if [[ -n "$SUSPECT_PIDS" ]]; then
    echo "[!] ALERT: Found rogue AI / scraper processes running at OS level:"
    for PID in $SUSPECT_PIDS; do
        if [[ "$PID" != "$$" ]]; then
            CMD=$(cat "/proc/$PID/cmdline" 2>/dev/null | tr '\0' ' ' || echo "N/A")
            echo "    - [THREAT] PID: $PID | CMD: $CMD"
            if [[ "${RAKSHAK_AUTO_NEUTRALIZE:-0}" == "1" ]]; then
                echo "      [ACTION] Auto-terminating rogue AI PID $PID (SIGKILL)..."
                kill -9 "$PID" 2>/dev/null || true
            fi
        fi
    done
else
    echo "[OK] No rogue AI crawler or scraper processes found in /proc."
fi

# 2. Configure iptables Kernel Packet Dropping
if command -v iptables >/dev/null 2>&1; then
    echo "[+] Establishing Rakshak iptables connection rate limiting..."
    
    # Create chain if not present
    iptables -N RAKSHAK_AI_FILTER 2>/dev/null || true

    # Drop abnormal burst rates (e.g. > 60 req/sec from single IP)
    iptables -A RAKSHAK_AI_FILTER -p tcp --dport 80 -m state --state NEW -m recent --set
    iptables -A RAKSHAK_AI_FILTER -p tcp --dport 80 -m state --state NEW -m recent --update --seconds 1 --hitcount 60 -j DROP
    iptables -A RAKSHAK_AI_FILTER -p tcp --dport 443 -m state --state NEW -m recent --set
    iptables -A RAKSHAK_AI_FILTER -p tcp --dport 443 -m state --state NEW -m recent --update --seconds 1 --hitcount 60 -j DROP

    echo "[OK] iptables burst throttling active."
fi

# 3. Kernel TCP/IP Stack Hardening
if [[ -w /proc/sys/net/ipv4/tcp_syncookies ]]; then
    echo "[+] Enabling TCP SYN Cookies and Anti-Flooding flags..."
    echo 1 > /proc/sys/net/ipv4/tcp_syncookies
    echo 1 > /proc/sys/net/ipv4/tcp_rfc1337
    echo 5 > /proc/sys/net/ipv4/tcp_fin_timeout
fi

echo "===================================================="
echo "[SUCCESS] Rakshak Linux Sentinel deployed."
echo "===================================================="
