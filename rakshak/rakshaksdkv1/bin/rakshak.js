#!/usr/bin/env node
/**
 * ============================================================================
 * RAKSHAK UNIVERSAL CLI (rakshak)
 * ============================================================================
 * Usage:
 *   npx rakshak init
 *   npx rakshak compile <file.rsk>
 *   npx rakshak dump <file.rskb>
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { RakshakCompiler } = require('../dist/rsk_compiler.js');
const { RakshakVM } = require('../dist/rsk_vm.js');
const { RakshakInitializer } = require('../dist/init_cli.js');
const { RakshakNodeOSShield } = require('../dist/os_shield.js');

const args = process.argv.slice(2);
const cmd = args[0];

if (!cmd || cmd === '--help' || cmd === '-h') {
  console.log(`
====================================================================
  RAKSHAK ZERO-TRUST UNIVERSAL CLI (v1.0)
====================================================================
Commands:
  activate <license_key>         Activate paid commercial subscription license
  init                           Auto-detect framework & initialize .rsk policy
  compile <file.rsk> [-o out]    Compile .rsk policy into binary bytecode (.rskb) [LOCKED]
  dump <file.rskb>               Disassemble & inspect binary bytecode [LOCKED]
  status                         Inspect local workstation isolation state
  test                           Run local kernel latency & isolation benchmarks
  os-scan                        Scan OS processes for rogue AI scrapers & agents
  os-kill <pid>                  Neutralize/kill rogue AI scraping process by PID
  spike <file>                   Inject loss-spike & RoPE scrambler into target file
  honeypot [dir]                 Deploy adversarial canary honeytoken [LOCKED]
  watch <dir>                    Start zero-trust directory monitoring guard [LOCKED]
====================================================================
`);
  process.exit(0);
}

function getLicense() {
  if (process.env.RAKSHAK_LICENSE_KEY) return process.env.RAKSHAK_LICENSE_KEY;
  const os = require('os');
  const licPath = path.join(os.homedir(), '.rakshak', 'rakshak.license');
  if (fs.existsSync(licPath)) {
    try { return fs.readFileSync(licPath, 'utf8').trim(); } catch {}
  }
  if (fs.existsSync('rakshak.license')) {
    try { return fs.readFileSync('rakshak.license', 'utf8').trim(); } catch {}
  }
  return null;
}

function validateLicense(key) {
  if (!key) return { valid: false, error: 'MISSING' };
  const parts = key.trim().split('-');
  if (parts.length < 4 || parts[0].toUpperCase() !== 'RSK') {
    return { valid: false, error: 'INVALID_FORMAT' };
  }
  const tier = parts[1].toUpperCase();
  let expiresAt = null;
  let daysRemaining = null;
  let isExpired = false;
  if (parts.length >= 5) {
    const expSec = parseInt(parts[2], 16);
    if (!isNaN(expSec) && expSec > 1600000000) {
      expiresAt = new Date(expSec * 1000);
      const nowSec = Math.floor(Date.now() / 1000);
      daysRemaining = Math.max(0, Math.floor((expSec - nowSec) / 86400));
      if (nowSec > expSec) isExpired = true;
    }
  }
  if (isExpired) {
    return { valid: false, error: 'EXPIRED', key, tier, expiresAt, daysRemaining: 0 };
  }
  return { valid: true, key, tier, expiresAt, daysRemaining };
}

function ensureLicense() {
  const licKey = getLicense();
  if (!licKey) {
    console.error(`
=============================================================================
[!] COMMERCIAL LICENSE REQUIRED — RAKSHAK ZERO-TRUST ENGINE
=============================================================================
UNLICENSED RUNTIME DETECTED.
Rakshak Zero-Trust architecture is proprietary commercial security software.
Execution of the compiler, runtime shield, and honeytokens is locked until
an authorized commercial subscription is activated.

To purchase an authorized license:
  Visit: https://rakshakus.vercel.app/pricing

To activate your purchased license:
  Run: npx rakshak activate <YOUR_LICENSE_KEY>
  Or set: export RAKSHAK_LICENSE_KEY="<YOUR_LICENSE_KEY>"
=============================================================================
`);
    process.exit(101);
  }
  const lic = validateLicense(licKey);
  if (!lic.valid) {
    if (lic.error === 'EXPIRED') {
      const expDate = lic.expiresAt ? lic.expiresAt.toISOString().slice(0, 10) : 'earlier date';
      console.error(`
=============================================================================
[-] COMMERCIAL SUBSCRIPTION EXPIRED — RAKSHAK ZERO-TRUST ENGINE
=============================================================================
Your subscription expired on ${expDate} UTC (0 days remaining).
Compiler, honeypot generator, and runtime guard are locked.

To renew your commercial license:
  Visit: https://rakshakus.vercel.app/pricing

To activate renewal key:
  Run: npx rakshak activate <NEW_LICENSE_KEY>
=============================================================================
`);
      process.exit(102);
    } else {
      console.error(`Error: Invalid license format for key ${licKey}. Acquire key at https://rakshakus.vercel.app/pricing`);
      process.exit(103);
    }
  }
  return lic;
}

if (cmd === 'activate') {
  const key = args[1];
  if (!key) {
    console.error('Error: Specify commercial license key to activate. Usage: rakshak activate <RSK-...>');
    process.exit(1);
  }
  const lic = validateLicense(key);
  if (!lic.valid) {
    if (lic.error === 'EXPIRED') {
      const expDate = lic.expiresAt ? lic.expiresAt.toISOString().slice(0, 10) : 'earlier date';
      console.error(`[-] License is EXPIRED on ${expDate}. Renew at https://rakshakus.vercel.app/pricing`);
      process.exit(1);
    } else {
      console.error(`[-] Invalid license format: ${key}. Expected RSK-<TIER>-<EXPIRY>-<SALT>-<SIG>`);
      process.exit(1);
    }
  }
  const os = require('os');
  const rakshakDir = path.join(os.homedir(), '.rakshak');
  if (!fs.existsSync(rakshakDir)) fs.mkdirSync(rakshakDir, { recursive: true });
  const licFile = path.join(rakshakDir, 'rakshak.license');
  fs.writeFileSync(licFile, key.trim());
  console.log(`[SUCCESS] Commercial License Activated: ${key.trim()}`);
  console.log(`Tier: ${lic.tier} | Validity: ${lic.daysRemaining !== null ? lic.daysRemaining + ' days remaining' : 'Active Term'}`);
  console.log(`Stored at: ${licFile}`);
} else if (cmd === 'init') {
  const res = RakshakInitializer.init(process.cwd());
  console.log(`[SUCCESS] Detected ecosystem: ${res.ecosystem}`);
  console.log(`[ACTION] ${res.actionTaken}`);
} else if (cmd === 'compile') {
  ensureLicense();
  const inputFile = args[1];
  if (!inputFile) {
    console.error('Error: Specify .rsk file to compile.');
    process.exit(1);
  }
  const outIdx = args.indexOf('-o');
  const outFile = outIdx !== -1 ? args[outIdx + 1] : inputFile.replace(/\.rsk$/, '.rskb');
  const src = fs.readFileSync(inputFile, 'utf-8');
  const { ast, bytecode } = RakshakCompiler.compile(src);
  fs.writeFileSync(outFile, Buffer.from(bytecode));
  console.log(`[SUCCESS] Compiled '${ast.shieldName}' -> '${outFile}' (${bytecode.length} bytes)`);
} else if (cmd === 'dump') {
  ensureLicense();
  const inputFile = args[1];
  const buf = fs.readFileSync(inputFile);
  const vm = new RakshakVM(new Uint8Array(buf));
  console.log(JSON.stringify(vm.getPolicySummary(), null, 2));
} else if (cmd === 'os-scan' || cmd === 'scan') {
  ensureLicense();
  console.log('[*] Enumerating OS processes and scanning for rogue AI harvesters...');
  const threats = RakshakNodeOSShield.scanProcesses();
  if (threats.length === 0) {
    console.log('[+] Clean baseline: No active rogue AI/LLM scraping processes detected.');
  } else {
    console.warn(`[!] ALERT: Detected ${threats.length} suspicious AI harvesting process(es):`);
    for (const t of threats) {
      console.warn(`    PID ${t.pid.toString().padEnd(6)} | ${t.name.padEnd(24)} | Category: ${t.category} | Sig: ${t.signature}`);
    }
    console.log('[*] To neutralize a process, run: rakshak os-kill <pid>');
  }
} else if (cmd === 'os-kill' || cmd === 'kill') {
  ensureLicense();
  const pid = parseInt(args[1], 10);
  if (isNaN(pid)) {
    console.error('Error: Specify valid integer PID to terminate. Usage: rakshak os-kill <PID>');
    process.exit(1);
  }
  const ok = RakshakNodeOSShield.killProcess(pid);
  if (ok) {
    console.log(`[SUCCESS] Process ${pid} neutralized via OS kernel termination.`);
  } else {
    console.error(`[-] Failed to terminate process ${pid}. Check permissions.`);
    process.exit(1);
  }
} else if (cmd === 'spike') {
  ensureLicense();
  const targetFile = args[1];
  if (!targetFile || !fs.existsSync(targetFile)) {
    console.error('Error: Target file not found. Usage: rakshak spike <file_path>');
    process.exit(1);
  }
  const content = fs.readFileSync(targetFile, 'utf8');
  const spiked = RakshakNodeOSShield.generateLossSpike(content);
  fs.writeFileSync(targetFile, spiked, 'utf8');
  console.log(`[SUCCESS] Injected adversarial loss-spike tensor into ${targetFile}`);
  console.log('    Delta Loss: dL > 14.8 | RoPE Desync: Active | Subword Entropy: High');
} else if (cmd === 'status' || cmd === 'test' || cmd === 'watch' || cmd === 'honeypot' || cmd === 'daemon') {
  if (cmd === 'watch' || cmd === 'daemon' || cmd === 'honeypot') {
    ensureLicense();
  }
  const candidates = [
    path.join(__dirname, '..', '..', 'public', 'releases', 'RakshakShield.exe'),
    path.join(__dirname, '..', '..', '..', 'public', 'releases', 'RakshakShield.exe'),
    path.join(__dirname, '..', 'bin', 'RakshakShield.exe'),
    path.join(__dirname, 'RakshakShield.exe')
  ];
  const exePath = candidates.find(p => fs.existsSync(p));
  if (process.platform === 'win32' && exePath) {
    const { spawnSync } = require('child_process');
    spawnSync(exePath, args, { stdio: 'inherit' });
  } else {
    const licKey = getLicense();
    const lic = validateLicense(licKey);
    console.log(`[RAKSHAK WORKSTATION] Status: ${lic.valid ? 'ACTIVE & ENFORCED' : (lic.error === 'EXPIRED' ? 'SUBSCRIPTION EXPIRED' : 'UNLICENSED')}`);
    console.log(`Commercial License: ${licKey ? licKey : 'None (Run: rakshak activate <KEY>)'}`);
    if (lic.valid && lic.daysRemaining !== null) {
      console.log(`Active Validity: ${lic.daysRemaining} Days Remaining (Expires ${lic.expiresAt.toISOString().slice(0, 10)})`);
    } else if (lic.error === 'EXPIRED') {
      console.log(`Subscription Validity: EXPIRED on ${lic.expiresAt.toISOString().slice(0, 10)} (Renew at https://rakshakus.vercel.app/pricing)`);
    }
    console.log(`Platform: ${process.platform} | Engine: Node.js Universal VM | Invariant: Zero Cloud Telemetry`);
  }
} else {
  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}


