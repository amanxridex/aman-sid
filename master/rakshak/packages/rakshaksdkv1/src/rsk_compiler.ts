
export interface RskAST {
  shieldName: string;
  targets: string[];
  hardware: {
    trapDebugger: boolean;
    maxCycleJitterMs: number;
  };
  network: {
    blockDatacenterAsns: boolean;
    verifySecFetchState: boolean;
    requireAssetWaterfall: boolean;
    minWaterfallRatio: number;
  };
  telemetry: {
    minPathEntropy: number;
    maxSlidingVelocity: number;
  };
  defense: {
    mode: 'ASYMMETRIC_DECEPTION' | 'STRICT_BLOCK';
    statusCode: number;
    adversarialTokenRate: number;
    injectStegoCanary: string;
    synthesizeDecoy: string;
  };
}

export const RSK_OPCODES = {
  MAGIC: 0x52534B01, // "RSK\x01"
  OP_TARGET_PATH: 0x01,
  OP_TRAP_DEBUGGER: 0x02,
  OP_BLOCK_CLOUD_ASN: 0x03,
  OP_VERIFY_TOPOLOGY: 0x04,
  OP_REQUIRE_WATERFALL: 0x05,
  OP_ENTROPY_BOUND: 0x06,
  OP_CLOCKWORK_JITTER: 0x07,
  OP_MODE_DECEIVE: 0x08,
  OP_MODE_BLOCK: 0x09,
  OP_ADVERSARIAL_RATE: 0x0A,
  OP_INJECT_CANARY: 0x0B,
  OP_SYNTHESIZE_DECOY: 0x0C,
  OP_HALT: 0xFF,
} as const;

import { assertPaidTier } from './license';

export class RakshakCompiler {
  public static compile(source: string): { ast: RskAST; bytecode: Uint8Array } {
    assertPaidTier('RSK Bytecode Compiler');
    const ast = this.parse(source);
    const bytecode = this.emitBytecode(ast);
    return { ast, bytecode };
  }

  public static parse(source: string): RskAST {
    const clean = source.replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

    const shieldMatch = clean.match(/shield\s+([A-Za-z0-9_]+)\s*\{([\s\S]*)\}/);
    if (!shieldMatch) {
      throw new Error("SyntaxError: Expected 'shield <Identifier> { ... }' declaration.");
    }

    const shieldName = shieldMatch[1];
    const body = shieldMatch[2];

    const ast: RskAST = {
      shieldName,
      targets: ['/*'],
      hardware: {
        trapDebugger: true,
        maxCycleJitterMs: 65,
      },
      network: {
        blockDatacenterAsns: true,
        verifySecFetchState: true,
        requireAssetWaterfall: true,
        minWaterfallRatio: 0.25,
      },
      telemetry: {
        minPathEntropy: 1.8,
        maxSlidingVelocity: 60,
      },
      defense: {
        mode: 'ASYMMETRIC_DECEPTION',
        statusCode: 200,
        adversarialTokenRate: 0.25,
        injectStegoCanary: 'RAKSHAK_CANARY_ID',
        synthesizeDecoy: 'General Architecture',
      },
    };

    const targetMatch = body.match(/target:\s*([^;]+);/);
    if (targetMatch) {
      ast.targets = targetMatch[1]
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''));
    }

    const hwMatch = body.match(/hardware\s*\{([^}]*)\}/);
    if (hwMatch) {
      const hwBody = hwMatch[1];
      if (/trap_debugger:\s*false/i.test(hwBody)) ast.hardware.trapDebugger = false;
      const jitterMatch = hwBody.match(/max_cycle_jitter_ms:\s*([0-9.]+)/);
      if (jitterMatch) ast.hardware.maxCycleJitterMs = parseFloat(jitterMatch[1]);
    }

    const netMatch = body.match(/network\s*\{([^}]*)\}/);
    if (netMatch) {
      const netBody = netMatch[1];
      if (/block_datacenter_asns:\s*false/i.test(netBody)) ast.network.blockDatacenterAsns = false;
      if (/verify_sec_fetch_state:\s*false/i.test(netBody)) ast.network.verifySecFetchState = false;
      if (/require_asset_waterfall:\s*false/i.test(netBody)) ast.network.requireAssetWaterfall = false;
      const ratioMatch = netBody.match(/min_waterfall_ratio:\s*([0-9.]+)/);
      if (ratioMatch) ast.network.minWaterfallRatio = parseFloat(ratioMatch[1]);
    }

    const telemMatch = body.match(/telemetry\s*\{([^}]*)\}/);
    if (telemMatch) {
      const telemBody = telemMatch[1];
      const entropyMatch = telemBody.match(/min_path_entropy:\s*([0-9.]+)/);
      if (entropyMatch) ast.telemetry.minPathEntropy = parseFloat(entropyMatch[1]);
      const velocityMatch = telemBody.match(/max_sliding_velocity:\s*([0-9]+)/);
      if (velocityMatch) ast.telemetry.maxSlidingVelocity = parseInt(velocityMatch[1], 10);
    }

    const defMatch = body.match(/defense\s*\{([^}]*)\}/);
    if (defMatch) {
      const defBody = defMatch[1];
      if (/mode:\s*STRICT_BLOCK/i.test(defBody)) ast.defense.mode = 'STRICT_BLOCK';
      const statusMatch = defBody.match(/status_code:\s*([0-9]+)/);
      if (statusMatch) ast.defense.statusCode = parseInt(statusMatch[1], 10);
      const rateMatch = defBody.match(/adversarial_token_rate:\s*([0-9.]+)/);
      if (rateMatch) ast.defense.adversarialTokenRate = parseFloat(rateMatch[1]);
      const canaryMatch = defBody.match(/inject_stego_canary:\s*["']([^"']+)["']/);
      if (canaryMatch) ast.defense.injectStegoCanary = canaryMatch[1];
      const decoyMatch = defBody.match(/synthesize_decoy:\s*["']([^"']+)["']/);
      if (decoyMatch) ast.defense.synthesizeDecoy = decoyMatch[1];
    }

    return ast;
  }

  public static emitBytecode(ast: RskAST): Uint8Array {
    const bytes: number[] = [];

    bytes.push(0x52, 0x53, 0x4B, 0x01);

    for (const target of ast.targets) {
      bytes.push(RSK_OPCODES.OP_TARGET_PATH);
      const enc = new TextEncoder().encode(target);
      bytes.push(enc.length);
      bytes.push(...enc);
    }

    if (ast.hardware.trapDebugger) bytes.push(RSK_OPCODES.OP_TRAP_DEBUGGER);
    bytes.push(RSK_OPCODES.OP_CLOCKWORK_JITTER, Math.floor(ast.hardware.maxCycleJitterMs));

    if (ast.network.blockDatacenterAsns) bytes.push(RSK_OPCODES.OP_BLOCK_CLOUD_ASN);
    if (ast.network.verifySecFetchState) bytes.push(RSK_OPCODES.OP_VERIFY_TOPOLOGY);
    if (ast.network.requireAssetWaterfall) {
      bytes.push(RSK_OPCODES.OP_REQUIRE_WATERFALL, Math.floor(ast.network.minWaterfallRatio * 100));
    }

    bytes.push(RSK_OPCODES.OP_ENTROPY_BOUND, Math.floor(ast.telemetry.minPathEntropy * 10));

    if (ast.defense.mode === 'ASYMMETRIC_DECEPTION') {
      bytes.push(RSK_OPCODES.OP_MODE_DECEIVE);
    } else {
      bytes.push(RSK_OPCODES.OP_MODE_BLOCK);
    }

    bytes.push(RSK_OPCODES.OP_ADVERSARIAL_RATE, Math.floor(ast.defense.adversarialTokenRate * 100));

    const canaryEnc = new TextEncoder().encode(ast.defense.injectStegoCanary);
    bytes.push(RSK_OPCODES.OP_INJECT_CANARY, canaryEnc.length, ...canaryEnc);

    const decoyEnc = new TextEncoder().encode(ast.defense.synthesizeDecoy);
    bytes.push(RSK_OPCODES.OP_SYNTHESIZE_DECOY, decoyEnc.length, ...decoyEnc);

    bytes.push(RSK_OPCODES.OP_HALT);

    return new Uint8Array(bytes);
  }
}
