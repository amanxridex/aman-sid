import crypto from 'crypto';
import { generateLicenseKey } from '../../../../lib/licenseEngine.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      email = 'developer@rakshak.local',
      organization = 'Independent Developer',
      role = 'Security Engineer'
    } = body;

    const accountId = `dev_${crypto.randomBytes(8).toString('hex')}`;
    const apiKey = `sk_live_rakshak_${crypto.randomBytes(24).toString('hex')}`;
    const license = generateLicenseKey('developer-free', email, 365);

    return Response.json({
      success: true,
      account: {
        accountId,
        email,
        organization,
        role,
        createdAt: new Date().toISOString()
      },
      credentials: {
        apiKey,
        licenseKey: license.licenseKey,
        tier: 'developer-free',
        tierName: 'Rakshak Community Developer Tier',
        expiresAt: license.expiresAt
      },
      quickstart: {
        npmInstall: 'npm install https://rakshakus.vercel.app/releases/rakshaksdkv1-1.0.0.tgz',
        npxInit: 'npx rakshak init',
        npxActivate: `npx rakshak activate ${license.licenseKey}`,
        curlInstallUnix: 'curl -fsSL https://rakshakus.vercel.app/install.sh | bash',
        curlInstallWin: 'powershell -c "irm https://rakshakus.vercel.app/install.ps1 | iex"'
      }
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  return Response.json({
    portal: 'Rakshak Developer Account Management & Key Registry',
    status: 'ACTIVE',
    documentation: 'https://rakshakus.vercel.app/developers',
    capabilities: [
      'Universal Next.js / Express / Python Defense SDK',
      'Native Workstation Shield (Windows x64 / macOS / Linux)',
      'Zero Cloud Telemetry Guarantee',
      'Free Developer & Academic Grant Licenses'
    ]
  });
}
