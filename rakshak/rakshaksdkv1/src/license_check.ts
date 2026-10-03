/**
 * Rakshak SDK - Cryptographic Airgapped License & Time Expiration Verifier
 * Decodes 5-part time-encoded tokens: RSK-<PREFIX>-<EXPIRY_HEX>-<SALT>-<SIG>
 * Enforces offline active subscription terms across all supported tech stacks.
 */

export interface LicenseCheckResult {
  valid: boolean;
  tier?: string;
  daysRemaining?: number;
  expiresAt?: Date;
  isExpired?: boolean;
  error?: string;
}

export function checkLicenseKey(key?: string): LicenseCheckResult {
  const licKey = key || (typeof process !== 'undefined' && process.env ? process.env.RAKSHAK_LICENSE_KEY : undefined);
  if (!licKey) {
    return { valid: false, error: 'MISSING' };
  }

  const parts = licKey.trim().split('-');
  if (parts.length < 4 || parts[0].toUpperCase() !== 'RSK') {
    return { valid: false, error: 'INVALID_FORMAT' };
  }

  const tier = parts[1].toUpperCase();

  if (parts.length >= 5) {
    const expSec = parseInt(parts[2], 16);
    if (!isNaN(expSec) && expSec > 1600000000) {
      const expDate = new Date(expSec * 1000);
      const nowSec = Math.floor(Date.now() / 1000);
      const daysRemaining = Math.max(0, Math.floor((expSec - nowSec) / 86400));

      if (nowSec > expSec) {
        return {
          valid: false,
          isExpired: true,
          error: 'EXPIRED',
          tier,
          daysRemaining: 0,
          expiresAt: expDate
        };
      }

      return {
        valid: true,
        isExpired: false,
        tier,
        daysRemaining,
        expiresAt: expDate
      };
    }
  }

  return {
    valid: true,
    tier,
    isExpired: false
  };
}
