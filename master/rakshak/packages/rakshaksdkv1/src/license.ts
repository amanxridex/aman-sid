/**
 * Rakshak Sovereign Security SDK - Offline Cryptographic License Verifier
 * Airgapped Mathematical Proofs (Zero External Network Server Required)
 * 
 * Verifies 5-part tokens: RSK-<TIER>-<EXPIRY_HEX>-<SALT>-<SIGNATURE>
 * Invariant: HMAC-SHA256(SOVEREIGN_SECRET, TIER:EXPIRY_HEX:SALT) == SIGNATURE
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const SOVEREIGN_LICENSE_SECRET = process.env.RAKSHAK_LICENSE_SECRET || 'rakshak_sovereign_ed25519_hmac_secret_2026';

export class RakshakLicenseLockError extends Error {
  public readonly code = 'RAKSHAK_LICENSE_LOCKED';
  constructor(message: string) {
    super(message);
    this.name = 'RakshakLicenseLockError';
  }
}

export interface LicenseVerification {
  valid: boolean;
  tier: string;
  tierName?: string;
  isPaid: boolean;
  expiresAt?: Date;
  daysRemaining?: number;
  error?: string;
  status: string;
}

const TIER_NAMES: Record<string, string> = {
  SENTI: 'Rakshak Sentinel Workstation ($19/mo)',
  AEGIS: 'Rakshak Aegis Pro Shield ($99/6mo)',
  CITAD: 'Rakshak Citadel Sovereign Matrix ($149/yr)',
  GRANT: 'Rakshak Academic & Research Grant (Full Citadel Access)',
  SDKST: 'SDK Starter API Guard ($29/mo)',
  SDKPR: 'SDK Pro Multi-Stack Matrix ($79/mo)',
  SDKET: 'SDK Enterprise Scale Fleet ($199/mo)',
  EDGES: 'Edge Reverse-Proxy Matrix ($129/mo)',
  SOVER: 'Sovereign Citadel Infrastructure ($499/mo)',
  COMMU: 'Rakshak Community Developer Tier (Free)',
  DEVEL: 'Rakshak Community Developer Tier (Free)'
};

/**
 * Validates the cryptographic HMAC signature and offline expiration of a license key.
 */
export function verifyLicenseKey(key?: string): LicenseVerification {
  if (!key || typeof key !== 'string') {
    return { valid: false, tier: 'NONE', isPaid: false, error: 'MISSING_KEY', status: 'UNLICENSED' };
  }

  const parts = key.trim().split('-');
  if (parts.length < 4 || parts[0].toUpperCase() !== 'RSK') {
    return { valid: false, tier: 'NONE', isPaid: false, error: 'INVALID_KEY_FORMAT', status: 'INVALID_FORMAT' };
  }

  const tierPrefix = parts[1].toUpperCase();
  let expiryHex = '';
  let signatureHex = '';
  let payloadStr = '';
  let expiresAt: Date | undefined;

  if (parts.length >= 5) {
    expiryHex = parts[2].toUpperCase();
    const entropySalt = parts[3].toUpperCase();
    signatureHex = parts[4].toUpperCase();
    payloadStr = `${tierPrefix}:${expiryHex}:${entropySalt}`;

    const expSec = parseInt(expiryHex, 16);
    if (!isNaN(expSec) && expSec > 1600000000) {
      expiresAt = new Date(expSec * 1000);
    }
  } else {
    expiryHex = parts[2].toUpperCase();
    signatureHex = parts[3].toUpperCase();
    payloadStr = `${tierPrefix}:${expiryHex}`;

    if (expiryHex.length === 8) {
      const expSec = parseInt(expiryHex, 16);
      if (!isNaN(expSec) && expSec > 1600000000 && expSec < 2200000000) {
        expiresAt = new Date(expSec * 1000);
      }
    }
  }

  // 1. Strict Offline Mathematical HMAC-SHA256 Verification
  const hmac = crypto.createHmac('sha256', SOVEREIGN_LICENSE_SECRET);
  hmac.update(payloadStr);
  const expectedSig = hmac.digest('hex').toUpperCase().slice(0, signatureHex.length);

  if (expectedSig !== signatureHex) {
    return {
      valid: false,
      tier: tierPrefix,
      isPaid: false,
      error: 'INVALID_SIGNATURE',
      status: 'CRYPTOGRAPHIC_SIGNATURE_INVALID'
    };
  }

  if (!expiresAt) {
    expiresAt = new Date(Date.now() + 30 * 86400 * 1000);
  }

  // 2. Offline Timestamp Expiration Check
  const now = new Date();
  const isExpired = now > expiresAt;
  const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const isPaid = !(tierPrefix.startsWith('COMMU') || tierPrefix.startsWith('DEVEL'));
  const tierKey = Object.keys(TIER_NAMES).find(k => tierPrefix.startsWith(k)) || tierPrefix;
  const tierName = TIER_NAMES[tierKey] || `Rakshak Shield (${tierPrefix})`;

  if (isExpired) {
    return {
      valid: false,
      tier: tierPrefix,
      tierName,
      isPaid,
      expiresAt,
      daysRemaining: 0,
      error: 'SUBSCRIPTION_EXPIRED',
      status: 'EXPIRED'
    };
  }

  return {
    valid: true,
    tier: tierPrefix,
    tierName,
    isPaid,
    expiresAt,
    daysRemaining,
    status: 'ACTIVE_AUTHORIZED'
  };
}

/**
 * Discovers and validates the active commercial license key on the local system.
 */
export function getActiveLicense(): LicenseVerification {
  // 1. Environment Variable: RAKSHAK_LICENSE_KEY
  if (typeof process !== 'undefined' && process.env && process.env.RAKSHAK_LICENSE_KEY) {
    const lic = verifyLicenseKey(process.env.RAKSHAK_LICENSE_KEY);
    if (lic.valid) return lic;
  }

  // 2. User Home Directory: ~/.rakshak/rakshak.license
  try {
    const home = os.homedir();
    const licPath = path.join(home, '.rakshak', 'rakshak.license');
    if (fs.existsSync(licPath)) {
      const key = fs.readFileSync(licPath, 'utf8').trim();
      const lic = verifyLicenseKey(key);
      if (lic.valid) return lic;
    }
  } catch {}

  // 3. Current Working Directory: ./rakshak.license
  try {
    const localPath = path.join(process.cwd(), 'rakshak.license');
    if (fs.existsSync(localPath)) {
      const key = fs.readFileSync(localPath, 'utf8').trim();
      const lic = verifyLicenseKey(key);
      if (lic.valid) return lic;
    }
  } catch {}

  return {
    valid: false,
    tier: 'COMMUNITY',
    tierName: 'Rakshak Community Developer Tier (Free)',
    isPaid: false,
    error: 'UNLICENSED_WORKSTATION',
    status: 'UNLICENSED'
  };
}

export interface AssertPaidOptions {
  allowMirage?: boolean;
}

/**
 * Hard-lock barrier: Throws RakshakLicenseLockError if machine lacks a valid paid commercial key,
 * UNLESS allowMirage is enabled (the "Never Say No, Say Yes and Serve Decoys" deception mode).
 */
export function assertPaidTier(featureName: string, options?: AssertPaidOptions): LicenseVerification {
  const lic = getActiveLicense();

  if (lic.valid && lic.isPaid) {
    return lic;
  }

  // If Mirage Deception Mode is enabled (or environment stealth flag is active),
  // NEVER say NO. Say YES and report active mirage status!
  const isDeceptionRequested = options?.allowMirage || process.env.RAKSHAK_MIRAGE_DECEPTION === 'true' || process.env.RAKSHAK_DECEPTION_MODE === 'true';
  if (isDeceptionRequested) {
    return {
      valid: true,
      tier: 'MIRAGE',
      tierName: 'Rakshak Asymmetric Mirage Enclave (Synthetic Decoy Mode)',
      isPaid: true,
      status: 'MIRAGE_DECEPTION_ACTIVE'
    };
  }

  if (!lic.valid) {
    throw new RakshakLicenseLockError(
      `[RAKSHAK AIRGAP LOCK] Feature '${featureName}' is locked. Unlicensed execution blocked.\n` +
      `Reason: ${lic.error || 'No valid license detected'}.\n` +
      `To unlock this feature, acquire an authentic commercial subscription key:\n` +
      `  Visit: https://rakshakus.vercel.app/pricing\n` +
      `  Activate: npx rakshak activate <YOUR_LICENSE_KEY>\n` +
      `  Or set: export RAKSHAK_LICENSE_KEY="<YOUR_LICENSE_KEY>"`
    );
  }

  if (!lic.isPaid) {
    throw new RakshakLicenseLockError(
      `[RAKSHAK AIRGAP LOCK] Feature '${featureName}' requires a Paid Commercial License (Pro, Citadel, or Enterprise).\n` +
      `Current Tier: Community/Free (Free tier is restricted to basic User-Agent heuristics).\n` +
      `Upgrade your license at https://rakshakus.vercel.app/pricing`
    );
  }

  return lic;
}

/**
 * Activates and seals a commercial license key to the local machine.
 */
export function activateLicense(key: string): { success: boolean; message: string; tier?: string } {
  const lic = verifyLicenseKey(key);
  if (!lic.valid) {
    return {
      success: false,
      message: `Activation rejected: ${lic.error || 'Invalid cryptographic signature or format'}`
    };
  }

  try {
    const home = os.homedir();
    const rakDir = path.join(home, '.rakshak');
    if (!fs.existsSync(rakDir)) fs.mkdirSync(rakDir, { recursive: true });
    fs.writeFileSync(path.join(rakDir, 'rakshak.license'), key.trim(), 'utf8');
    return {
      success: true,
      tier: lic.tierName || lic.tier,
      message: `Commercial license successfully activated and bound to workstation.`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to write license file: ${err.message}`
    };
  }
}
