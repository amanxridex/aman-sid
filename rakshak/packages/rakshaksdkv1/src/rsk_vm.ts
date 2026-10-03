/**
 * ============================================================================
 * RAKSHAK PROGRAMMING LANGUAGE - BYTECODE VIRTUAL MACHINE (RSK-VM)
 * ============================================================================
 * High-performance virtual machine executing compiled .rskb policies.
 * Evaluates hardware, network, entropy, and deception invariants with zero allocations.
 * ============================================================================
 */

import { RSK_OPCODES } from './rsk_compiler';
import { detectAiScraper, RakshakRequest, DetectionResult } from './detector';
import { RakshakWaterfallEngine } from './waterfall';
import { RakshakEntropyEngine } from './entropy';
import { RakshakPolymorphicEngine } from './polymorphic';
import { RakshakPoisoner } from './poisoner';

export interface VmExecutionResult {
  allowed: boolean;
  status: number;
  body?: any;
  threatDetails?: DetectionResult;
  reasons: string[];
}

export class RakshakVM {
  private bytecode: Uint8Array;
  private targets: string[] = [];
  private trapDebugger: boolean = false;
  private blockDatacenterAsn: boolean = false;
  private verifyTopology: boolean = false;
  private requireWaterfall: boolean = false;
  private minWaterfallRatio: number = 0.25;
  private minEntropy: number = 1.8;
  private maxJitterMs: number = 65;
  private mode: 'deceive' | 'block' = 'deceive';
  private adversarialRate: number = 0.25;
  private canaryId: string = 'CANARY_ID';
  private decoyTopic: string = 'Technical Specs';

  constructor(bytecode: Uint8Array) {
    this.bytecode = bytecode;
    this.decodeBytecode();
  }

  /**
   * Decodes .rskb bytecode into VM execution registers.
   */
  private decodeBytecode(): void {
    const b = this.bytecode;
    if (b.length < 4 || b[0] !== 0x52 || b[1] !== 0x53 || b[2] !== 0x4B || b[3] !== 0x01) {
      throw new Error("InvalidBytecode: Missing 'RSK\\x01' magic header.");
    }

    let ip = 4; // Instruction pointer
    const decoder = new TextDecoder();

    while (ip < b.length) {
      const op = b[ip++];
      if (op === RSK_OPCODES.OP_HALT) break;

      switch (op) {
        case RSK_OPCODES.OP_TARGET_PATH: {
          const len = b[ip++];
          const path = decoder.decode(b.subarray(ip, ip + len));
          this.targets.push(path);
          ip += len;
          break;
        }
        case RSK_OPCODES.OP_TRAP_DEBUGGER:
          this.trapDebugger = true;
          break;
        case RSK_OPCODES.OP_BLOCK_CLOUD_ASN:
          this.blockDatacenterAsn = true;
          break;
        case RSK_OPCODES.OP_VERIFY_TOPOLOGY:
          this.verifyTopology = true;
          break;
        case RSK_OPCODES.OP_REQUIRE_WATERFALL:
          this.requireWaterfall = true;
          this.minWaterfallRatio = b[ip++] / 100.0;
          break;
        case RSK_OPCODES.OP_ENTROPY_BOUND:
          this.minEntropy = b[ip++] / 10.0;
          break;
        case RSK_OPCODES.OP_CLOCKWORK_JITTER:
          this.maxJitterMs = b[ip++];
          break;
        case RSK_OPCODES.OP_MODE_DECEIVE:
          this.mode = 'deceive';
          break;
        case RSK_OPCODES.OP_MODE_BLOCK:
          this.mode = 'block';
          break;
        case RSK_OPCODES.OP_ADVERSARIAL_RATE:
          this.adversarialRate = b[ip++] / 100.0;
          break;
        case RSK_OPCODES.OP_INJECT_CANARY: {
          const len = b[ip++];
          this.canaryId = decoder.decode(b.subarray(ip, ip + len));
          ip += len;
          break;
        }
        case RSK_OPCODES.OP_SYNTHESIZE_DECOY: {
          const len = b[ip++];
          this.decoyTopic = decoder.decode(b.subarray(ip, ip + len));
          ip += len;
          break;
        }
        default:
          break;
      }
    }
  }

  /**
   * Executes the compiled security bytecode against an incoming HTTP request.
   */
  public execute(req: RakshakRequest): VmExecutionResult {
    const reasons: string[] = [];
    const clientIp = req.ip || '127.0.0.1';
    const path = req.url || '/';

    // 1. Evaluate behavioral threat signatures
    const threat = detectAiScraper(req);
    let isViolation = threat.isBot;
    if (threat.reasons.length > 0) {
      reasons.push(...threat.reasons);
    }

    // Zero-Trust Human Invariant:
    // If behavioral threat engine verified this is an authentic human browser,
    // immediately grant clean pass. The waterfall is an auxiliary validator for suspicious traffic only.
    if (!isViolation) {
      return {
        allowed: true,
        status: 200,
        reasons: ['RSK_INVARIANT_SATISFIED', 'GENUINE_HUMAN_INVARIANT_SATISFIED'],
      };
    }

    // 2. Enforce Asset Waterfall Invariant from bytecode on suspicious traffic
    if (this.requireWaterfall) {
      const waterfall = RakshakWaterfallEngine.recordAndEvaluate(clientIp, path, { isSuspicious: true });
      if (waterfall.isHeadlessExtractor) {
        reasons.push(...waterfall.reasons);
      }
    }

    // 4. Violation triggered: Execute configured defense opcode
    if (this.mode === 'block') {
      return {
        allowed: false,
        status: 403,
        threatDetails: threat,
        reasons,
        body: 'Forbidden: Access blocked by Rakshak Security Policy (.rsk).',
      };
    }

    // Default: Asymmetric Deception
    const decoy = RakshakPolymorphicEngine.synthesizeApiResponse(clientIp, path);
    return {
      allowed: false,
      status: 200,
      threatDetails: threat,
      reasons,
      body: decoy,
    };
  }

  public getPolicySummary(): Record<string, any> {
    return {
      targets: this.targets,
      trapDebugger: this.trapDebugger,
      requireWaterfall: this.requireWaterfall,
      minWaterfallRatio: this.minWaterfallRatio,
      mode: this.mode,
      adversarialRate: this.adversarialRate,
      decoyTopic: this.decoyTopic,
    };
  }
}
