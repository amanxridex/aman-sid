#!/usr/bin/env node
/**
 * ============================================================================
 * RAKSHAK PROGRAMMING LANGUAGE (RSK) - CLI COMPILER (rskc)
 * ============================================================================
 * Usage:
 *   node rskc.js compile <input.rsk> [-o output.rskb]
 *   node rskc.js dump <input.rskb>
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { RakshakCompiler } = require('./dist/rsk_compiler.js');
const { RakshakVM } = require('./dist/rsk_vm.js');

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  console.log(`
====================================================================
  RAKSHAK SECURITY LANGUAGE COMPILER (rskc v1.0)
====================================================================
Commands:
  compile <input.rsk> [-o output.rskb]   Compile .rsk policy into binary bytecode
  dump    <input.rskb>                   Disassemble and inspect compiled bytecode
  run     <input.rskb>                   Spin up local VM emulator on bytecode
====================================================================
`);
  process.exit(0);
}

if (command === 'compile') {
  const inputFile = args[1];
  if (!inputFile) {
    console.error('Error: Missing input .rsk file.');
    process.exit(1);
  }

  const outIdx = args.indexOf('-o');
  const outputFile = outIdx !== -1 ? args[outIdx + 1] : inputFile.replace(/\.rsk$/, '.rskb');

  const source = fs.readFileSync(inputFile, 'utf-8');
  console.log(`[RSKC] Compiling '${inputFile}'...`);

  const { ast, bytecode } = RakshakCompiler.compile(source);
  fs.writeFileSync(outputFile, Buffer.from(bytecode));

  console.log(`[SUCCESS] Compiled shield '${ast.shieldName}' -> '${outputFile}' (${bytecode.length} bytes)`);
  console.log(`[SUMMARY] Mode: ${ast.defense.mode} | Targets: ${ast.targets.join(', ')}`);
} else if (command === 'dump') {
  const inputFile = args[1];
  const buf = fs.readFileSync(inputFile);
  console.log(`====================================================================`);
  console.log(`  RAKSHAK BYTECODE DISASSEMBLY: ${inputFile} (${buf.length} bytes)`);
  console.log(`====================================================================`);

  const vm = new RakshakVM(new Uint8Array(buf));
  console.log(JSON.stringify(vm.getPolicySummary(), null, 2));
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
