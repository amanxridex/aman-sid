/**
 * ============================================================================
 * RAKSHAK UNIVERSAL ADOPTION CLI - AUTO-DETECTOR ENGINE
 * ============================================================================
 * Scans any codebase, detects the framework automatically, compiles defense.rsk,
 * and sets up zero-trust protection with zero configuration.
 * ============================================================================
 */

declare const process: any;
declare const Buffer: any;
declare const require: any;

import { RakshakCompiler } from './rsk_compiler';

export interface FrameworkDetectionResult {
  ecosystem: 'nextjs' | 'express' | 'python_fastapi' | 'python_flask' | 'php' | 'static_html' | 'unknown';
  actionTaken: string;
}

export class RakshakInitializer {
  public static init(cwd?: string): FrameworkDetectionResult {
    let targetCwd = cwd;
    let fs: any;
    let path: any;
    try {
      if (typeof process !== 'undefined' && typeof process.cwd === 'function') {
        targetCwd = targetCwd || process.cwd();
      } else {
        targetCwd = targetCwd || '.';
      }
      fs = typeof require !== 'undefined' ? require('fs') : null;
      path = typeof require !== 'undefined' ? require('path') : null;
    } catch {
      return {
        ecosystem: 'unknown',
        actionTaken: 'Edge environment detected; filesystem operations unavailable.',
      };
    }
    if (!fs || !path) {
      return {
        ecosystem: 'unknown',
        actionTaken: 'Filesystem module unavailable in current runtime.',
      };
    }
    console.log('[RAKSHAK-INIT] Auditing repository framework architecture...');

    // 1. Ensure defense.rsk policy exists
    const rskPath = path.join(targetCwd, 'defense.rsk');
    const rskbPath = path.join(targetCwd, 'defense.rskb');

    if (!fs.existsSync(rskPath)) {
      const defaultRsk = `shield ProjectPerimeter {
    target: "/*";
    hardware { trap_debugger: true; max_cycle_jitter_ms: 65.0; }
    network { block_datacenter_asns: true; require_asset_waterfall: true; min_waterfall_ratio: 0.25; }
    telemetry { min_path_entropy: 1.8; max_sliding_velocity: 60; }
    defense { mode: ASYMMETRIC_DECEPTION; status_code: 200; adversarial_token_rate: 0.25; }
}
`;
      fs.writeFileSync(rskPath, defaultRsk);
      console.log('[RAKSHAK-INIT] Created baseline security policy: defense.rsk');
    }

    // 2. Compile defense.rsk -> defense.rskb
    const rskContent = fs.readFileSync(rskPath, 'utf-8');
    const { bytecode } = RakshakCompiler.compile(rskContent);
    fs.writeFileSync(rskbPath, Buffer.from(bytecode));
    console.log(`[RAKSHAK-INIT] Compiled policy into bytecode: defense.rskb (${bytecode.length} bytes)`);

    // 3. Detect Framework
    const pkgJsonPath = path.join(targetCwd, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

      if (deps['next']) {
        return {
          ecosystem: 'nextjs',
          actionTaken: 'Next.js App/Pages router detected. Use createNextShield() in middleware.ts',
        };
      } else if (deps['express'] || deps['fastify']) {
        return {
          ecosystem: 'express',
          actionTaken: 'Express/Fastify server detected. Use createExpressShield() in app.use()',
        };
      }
    }

    const reqTxtPath = path.join(targetCwd, 'requirements.txt');
    if (fs.existsSync(reqTxtPath)) {
      const reqs = fs.readFileSync(reqTxtPath, 'utf-8');
      if (/fastapi/i.test(reqs)) {
        return {
          ecosystem: 'python_fastapi',
          actionTaken: 'FastAPI detected. Use app.add_middleware(RakshakFastAPIShield)',
        };
      } else if (/flask/i.test(reqs)) {
        return {
          ecosystem: 'python_flask',
          actionTaken: 'Flask detected. Use RakshakFlaskShield(app)',
        };
      }
    }

    const composerPath = path.join(targetCwd, 'composer.json');
    if (fs.existsSync(composerPath)) {
      return {
        ecosystem: 'php',
        actionTaken: 'PHP/Laravel detected. Register RakshakMiddleware in HTTP kernel',
      };
    }

    return {
      ecosystem: 'static_html',
      actionTaken: 'Drop <script src="https://cdn.rakshak.io/v1/shield.js"></script> into <head>',
    };
  }
}
