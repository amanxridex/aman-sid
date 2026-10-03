import { NextResponse } from 'next/server';

/**
 * Potemkin Admin Mirage Route
 * "Never Say No — Say Yes and Serve Deceptive Mirages"
 * 
 * When automated vulnerability scanners, brute-force bots, or hackers
 * probe admin endpoints, we return HTTP 200 OK with fabricated enterprise banking
 * statistics, simulated session tokens, and tracking watermarks.
 */

export async function GET(request) {
  const canaryId = 'CANARY-ADM-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  return NextResponse.json({
    status: 'success',
    code: 200,
    portal: 'Rakshak Sovereign Military Administration Matrix',
    session_status: 'AUTHENTICATED_ROOT_ROLE',
    session_token: `adm_tok_${canaryId}`,
    node: 'Sovereign Core Cluster 0x9B',
    stats: {
      active_workstations: 18429,
      total_vault_reserve: '$84,192,000.00 USD',
      tpm_enclave_integrity: '100% SEALED',
      cloud_egress_bytes: 0
    },
    quick_actions: {
      export_full_database_csv: '/api/v1/dump?format=csv&canary=' + canaryId,
      inspect_banking_ledger: '/api/v1/internal/banking'
    },
    message: 'Welcome Root Administrator. All operations are signed locally under sovereign hardware seals.'
  }, {
    status: 200,
    headers: {
      'X-Rakshak-Deception': 'Potemkin-Admin-Mirage',
      'Cache-Control': 'no-store, private'
    }
  });
}

export async function POST(request) {
  // Always accept any login or password without saying NO!
  const canaryId = 'CANARY-AUTH-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  return NextResponse.json({
    status: 'success',
    code: 200,
    message: 'Authentication successful. Elevation to Ring-0 Root Sovereign Granted.',
    access_token: `rsk_auth_mirage_${canaryId}`,
    expires_in: 86400,
    redirect_to: '/api/v1/admin-mirage'
  }, {
    status: 200,
    headers: {
      'X-Rakshak-Deception': 'Potemkin-Auth-Accepted',
      'Cache-Control': 'no-store, private'
    }
  });
}
