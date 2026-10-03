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

function ensureLicense() {
  const lic = getLicense();
  if (!lic) {
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
  return lic;
}

if (cmd === 'activate') {
  const key = args[1];
  if (!key) {
    console.error('Error: Specify commercial license key to activate. Usage: rakshak activate <RSK-...>');
    process.exit(1);
  }
  const os = require('os');
  const rakshakDir = path.join(os.homedir(), '.rakshak');
  if (!fs.existsSync(rakshakDir)) fs.mkdirSync(rakshakDir, { recursive: true });
  const licFile = path.join(rakshakDir, 'rakshak.license');
  fs.writeFileSync(licFile, key.trim());
  console.log(`[SUCCESS] Commercial License Activated: ${key.trim()}`);
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
    const lic = getLicense();
    console.log(`[RAKSHAK WORKSTATION] Status: ${lic ? 'ACTIVE' : 'UNLICENSED'}`);
    console.log(`Commercial License: ${lic ? lic : 'None (Run: rakshak activate <KEY>)'}`);
    console.log(`Platform: ${process.platform} | Engine: Node.js Universal VM | Invariant: Zero Cloud Telemetry`);
  }
} else {
  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}


