import crypto from 'crypto';
import { generateLicenseKey, TIER_LIMITS } from '../../../../lib/licenseEngine.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  return Response.json({
    program: 'Rakshak Sovereign Systems Research & Defense Grant (2026)',
    status: 'ACTIVE_OPEN',
    endowment: '$1,200,000 Sponsored Defense Infrastructure Pool',
    eligibility: [
      'Independent security researchers, academic faculty, and PhD students',
      'Open-source maintainers defending public repositories from AI crawler scraping',
      'Airgapped defense laboratories and critical infrastructure systems'
    ],
    grantBenefits: [
      '100% Free Full-Tier Citadel & SDK Multi-Stack License (1 Year Renewable)',
      'Direct Zero-Knowledge cryptographic node binding',
      'Pre-release RSK bytecode opcodes & micro-VM ISA documentation',
      'Zero telemetry egress, guaranteed 0 bytes external telemetry'
    ],
    application: {
      endpoint: '/api/rakshak/grants',
      method: 'POST',
      requiredFields: ['name', 'email', 'institutionOrProject', 'purpose']
    }
  });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      name = 'Independent Security Researcher',
      email = 'researcher@academic.org',
      institutionOrProject = 'Open Source Defense Collective',
      purpose = 'Counter-AI scraping defense & zero-telemetry evaluation',
      targetPlatform = 'all'
    } = body;

    // Generate authenticated 1-year research grant license
    const license = generateLicenseKey('grant-academic', email, 365);
    const grantRand = crypto.randomBytes(4).toString('hex').toUpperCase();
    const grantId = `RSK-GRANT-2026-${grantRand}`;

    return Response.json({
      success: true,
      grantId,
      status: 'APPROVED_AND_PROVISIONED',
      recipient: {
        name,
        email,
        institutionOrProject,
        purpose
      },
      license: {
        licenseKey: license.licenseKey,
        tier: 'grant-academic',
        tierName: 'Rakshak Academic & Research Grant',
        durationDays: 365,
        expiresAt: license.expiresAt,
        signature: license.signatureHex,
        zeroTelemetryEnforced: true,
        allowedWorkstations: 5,
        allowedDomains: 3
      },
      cliActivationCommand: `npx rakshak activate ${license.licenseKey}`,
      exeActivationCommand: `RakshakShield.exe activate ${license.licenseKey}`,
      certificateUrl: `/api/rakshak/grants/certificate?id=${grantId}`
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
