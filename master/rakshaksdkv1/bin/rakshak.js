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
  init                           Auto-detect framework & initialize .rsk policy
  compile <file.rsk> [-o out]    Compile .rsk policy into binary bytecode (.rskb)
  dump <file.rskb>               Disassemble & inspect binary bytecode
====================================================================
`);
  process.exit(0);
}

if (cmd === 'init') {
  const res = RakshakInitializer.init(process.cwd());
  console.log(`[SUCCESS] Detected ecosystem: ${res.ecosystem}`);
  console.log(`[ACTION] ${res.actionTaken}`);
} else if (cmd === 'compile') {
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
  const inputFile = args[1];
  const buf = fs.readFileSync(inputFile);
  const vm = new RakshakVM(new Uint8Array(buf));
  console.log(JSON.stringify(vm.getPolicySummary(), null, 2));
} else {
  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}
