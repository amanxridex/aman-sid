/**
 * Rakshak SDK - OS-Level Anti-AI Shield & Process Neutralizer (Node.js)
 * Detects and neutralizes OS screen indexers, background OCR daemons,
 * local model runners, and autonomous AI agents.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';

export interface ThreatProcess {
  pid: number;
  name: string;
  category: string;
  signature: string;
  severity: 'CRITICAL' | 'HIGH';
}

const THREAT_SIGNATURES: Record<string, string[]> = {
  AI_SCREEN_INDEXER: ['recall.exe', 'screenindex.exe', 'coreaiplatform', 'windows.media.ocr.cli.exe', 'recall'],
  LOCAL_MODEL_SERVER: ['ollama.exe', 'ollama', 'ollama_llama_server', 'llama-server', 'vllm', 'lmstudio', 'localai', 'jan.exe', 'anythingllm'],
  AUTONOMOUS_AI_AGENT: ['langchain', 'crewai', 'autogen', 'autogpt', 'open-interpreter', 'gpt-engineer', 'smolagents', 'metagpt'],
  OCR_HARVESTER: ['tesseract.exe', 'tesseract', 'easyocr', 'paddleocr', 'capture2text'],
  HEADLESS_SCRAPER: ['playwright', 'puppeteer', 'chromedriver', 'geckodriver', 'curl-impersonate', 'crawl4ai', 'firecrawl']
};

export class RakshakNodeOSShield {
  /**
   * Scans active operating system processes for AI scraping agents.
   */
  static scanProcesses(): ThreatProcess[] {
    const threats: ThreatProcess[] = [];
    const isWin = process.platform === 'win32';

    try {
      if (isWin) {
        let scanned = false;
        // Phase 1: Deep WMI inspection for full command lines
        try {
          const out = execSync(
            'powershell -NoProfile -Command "Get-CimInstance Win32_Process | Select-Object ProcessId,Name,CommandLine | ConvertTo-Json -Compress"',
            { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 6000 }
          );
          const procs = JSON.parse(out);
          const list = Array.isArray(procs) ? procs : [procs];
          for (const p of list) {
            const pid = parseInt(p.ProcessId, 10);
            if (!pid || pid === process.pid || pid <= 4) continue;
            const name = (p.Name || '').toLowerCase();
            const cmdLine = (p.CommandLine || '').toLowerCase();
            const haystack = `${name} ${cmdLine}`;

            for (const [cat, sigs] of Object.entries(THREAT_SIGNATURES)) {
              for (const sig of sigs) {
                if (haystack.includes(sig)) {
                  threats.push({
                    pid,
                    name: p.Name || 'unknown',
                    category: cat,
                    signature: sig,
                    severity: (cat === 'AI_SCREEN_INDEXER' || cat === 'AUTONOMOUS_AI_AGENT') ? 'CRITICAL' : 'HIGH'
                  });
                  break;
                }
              }
            }
          }
          scanned = true;
        } catch {}

        // Phase 2: Fallback to tasklist if WMI/PowerShell was restricted
        if (!scanned) {
          const stdout = execSync('tasklist /fo csv /nh', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
          const lines = stdout.split('\r\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            const cols = line.split('","').map(c => c.replace(/"/g, ''));
            if (cols.length >= 2) {
              const name = cols[0].toLowerCase();
              const pid = parseInt(cols[1], 10);
              if (pid === process.pid || pid <= 4) continue;

              for (const [cat, sigs] of Object.entries(THREAT_SIGNATURES)) {
                for (const sig of sigs) {
                  if (name.includes(sig)) {
                    threats.push({
                      pid,
                      name: cols[0],
                      category: cat,
                      signature: sig,
                      severity: (cat === 'AI_SCREEN_INDEXER' || cat === 'AUTONOMOUS_AI_AGENT') ? 'CRITICAL' : 'HIGH'
                    });
                    break;
                  }
                }
              }
            }
          }
        }
      } else {
        // POSIX: Full command line arguments inspection via ps -A -o pid,args
        let stdout = '';
        try {
          stdout = execSync('ps -A -o pid,args', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        } catch {
          stdout = execSync('ps -A -o pid,comm', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        }
        const lines = stdout.split('\n');
        for (const line of lines.slice(1)) {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 2) {
            const pid = parseInt(parts[0], 10);
            const fullArgs = parts.slice(1).join(' ').toLowerCase();
            if (pid === process.pid || pid <= 1) continue;

            for (const [cat, sigs] of Object.entries(THREAT_SIGNATURES)) {
              for (const sig of sigs) {
                if (fullArgs.includes(sig)) {
                  threats.push({
                    pid,
                    name: parts[1],
                    category: cat,
                    signature: sig,
                    severity: (cat === 'AI_SCREEN_INDEXER' || cat === 'AUTONOMOUS_AI_AGENT') ? 'CRITICAL' : 'HIGH'
                  });
                  break;
                }
              }
            }
          }
        }
      }
    } catch {}

    return threats;
  }

  /**
   * Neutralizes a rogue AI process by PID.
   */
  static killProcess(pid: number): boolean {
    if (pid <= 4) return false;
    try {
      process.kill(pid, 'SIGKILL');
      return true;
    } catch {
      try {
        if (process.platform === 'win32') {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          return true;
        }
      } catch {}
      return false;
    }
  }

  /**
   * Generates mathematical Transformer loss-spike sequence.
   */
  static generateLossSpike(text: string): string {
    const sinks = ['\u200B\u200D\u2060\uFEFF', '\u200E\u200F\u061C', '\u034F\u0300\u0301'];
    const words = text.split(' ');
    const out: string[] = [];
    for (let i = 0; i < words.length; i++) {
      out.push(words[i]);
      if (i % 7 === 0) {
        out.push(sinks[i % sinks.length]);
      }
    }
    return out.join(' ');
  }

  /**
   * Desynchronizes Rotary Position Embeddings (RoPE).
   */
  static scrambleRoPE(text: string): string {
    const markers = ['\u200E', '\u200F', '\u202A', '\u202C'];
    let out = '';
    let idx = 0;
    for (const ch of text) {
      out += ch;
      if (ch === ' ' || ch === '\n' || ch === '.') {
        out += markers[idx % markers.length];
        idx++;
      }
    }
    return out;
  }
}
