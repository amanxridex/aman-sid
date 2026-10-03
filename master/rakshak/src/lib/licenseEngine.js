import crypto from 'crypto';

const LICENSE_SECRET = process.env.RAKSHAK_LICENSE_SECRET || 'rakshak_sovereign_ed25519_hmac_secret_2026';

export const TIER_LIMITS = {
  sentinel: {
    slug: 'sentinel',
    name: 'Rakshak Sentinel Workstation',
    category: 'workstation',
    durationDays: 30,
    priceMonthly: 19,
    priceBilling: '$19 / month',
    billingPeriod: 'monthly',
    maxDevices: 1,
    maxDomains: 0,
    airgapped: true,
    techStack: 'Windows 11/10 (.exe), macOS LaunchAgent, Linux Systemd Daemon',
    description: 'Zero-Trust Local Anti-AI Perimeter for individual developers & standalone workstations.',
    features: [
      'Native RakshakShield.exe PE 64-bit Engine',
      'Local File Interceptor (/Documents, /SourceCode, .env, .ssh)',
      'High-Frequency Process Scraper Traps (< 0.02ms latency budget)',
      'Local Git Pre-Commit AI Exfiltration Guard',
      '100% Airgapped Zero-Cloud Architecture',
      'Single Workstation Enclave (Windows / macOS / Linux)'
    ]
  },
  aegis: {
    slug: 'aegis',
    name: 'Rakshak Aegis Pro Shield',
    category: 'workstation',
    durationDays: 180,
    priceMonthly: 16.5,
    priceBilling: '$99 for 6 months ($16.50/mo)',
    billingPeriod: '6-months',
    maxDevices: 1,
    maxDomains: 0,
    airgapped: true,
    techStack: 'Windows 11/10 (.exe), macOS Apple Silicon/Intel, Linux x64',
    description: 'Adversarial Honeypot & Pro Model Defense for 1 dedicated workstation.',
    features: [
      'Everything in Sentinel Workstation',
      'Single-Device Hardware-Bound Cryptographic Node (Zero Multi-Keys)',
      'Adversarial Homoglyph Perturbation & Stego Watermark Canaries',
      'Synthetic Honey-Token Decoy Generator (.env, .ts, .csv)',
      'Continuous Process Tree & Clipboard Telemetry Guard',
      'Automatic RSK Bytecode Rule Updates'
    ]
  },
  citadel: {
    slug: 'citadel',
    name: 'Rakshak Citadel Sovereign Matrix',
    category: 'workstation',
    durationDays: 365,
    priceMonthly: 12.4,
    priceBilling: '$149 / year ($12.40/mo - Save 35%)',
    billingPeriod: 'annual',
    maxDevices: 1,
    maxDomains: 0,
    airgapped: true,
    techStack: 'Windows PE Native Core, Minifilter Driver (.sys), macOS, Linux (Single Device Enclave)',
    description: 'Full-Spectrum Airgapped Fortification for 1 dedicated workstation. Strictly 1 device installation.',
    features: [
      'Everything in Aegis Pro Shield',
      'Single-Device Hardware TPM 2.0 Cryptographic Node Binding',
      'Enterprise Model Poisoning Grid & Loss-Spike Generators',
      'Offline Cryptographic License Attestation (Airgapped)',
      'Direct Security Architect Threat Response Line',
      'Guaranteed Zero-Day Scraper Rule Signatures'
    ]
  },

  'sdk-starter': {
    slug: 'sdk-starter',
    name: 'SDK Starter API Guard',
    category: 'sdk',
    durationDays: 30,
    priceMonthly: 29,
    priceBilling: '$29 / month ($290/yr)',
    billingPeriod: 'monthly',
    maxDomains: 1,
    maxMonthlyInspections: 50000,
    airgapped: false,
    techStack: 'Next.js App Router, Express.js, Python (FastAPI / Flask)',
    description: 'Zero-Trust anti-crawler defense for 1 production web application or API.',
    features: [
      '50,000 Ingress AI Crawler Inspections / Month',
      'Asymmetric 200 OK Honeypot Deflection (Synthetic Decoy Matrix)',
      'Universal Next.js (App Router) & Express middleware adapters',
      'Python FastAPI & Flask security middleware',
      'Zero False Positives for verified human residential traffic',
      'Single Production Domain Deployment'
    ]
  },
  'sdk-pro': {
    slug: 'sdk-pro',
    name: 'SDK Pro Multi-Stack Matrix',
    category: 'sdk',
    durationDays: 30,
    priceMonthly: 79,
    priceBilling: '$79 / month ($790/yr)',
    billingPeriod: 'monthly',
    maxDomains: 5,
    maxMonthlyInspections: 250000,
    airgapped: false,
    techStack: 'Next.js, Node.js, Python, Go, Ruby, PHP, Java',
    description: 'Shannon Entropy, Waterfall analysis & multi-stack defense for up to 5 domains.',
    features: [
      '250,000 Ingress Inspections / Month ($0.00015/extra)',
      'Shannon Information Entropy & Client-Hint Topology Analysis',
      'Waterfall Cascade Analyzer (Headless browser extraction blocker)',
      'Full Multi-Stack SDKs: Python, Node.js, Go, PHP, Ruby, Java',
      'Real-Time Threat Radar & Live Deflection Logs',
      'Up to 5 Production Web & API Domains'
    ]
  },
  'sdk-enterprise': {
    slug: 'sdk-enterprise',
    name: 'SDK Enterprise Scale Fleet',
    category: 'sdk',
    durationDays: 30,
    priceMonthly: 199,
    priceBilling: '$199 / month ($1,990/yr)',
    billingPeriod: 'monthly',
    maxDomains: 20,
    maxMonthlyInspections: 1000000,
    airgapped: false,
    techStack: 'All SDK Languages, Splunk SPL, Sentinel KQL, Elastic SIEM',
    description: 'Custom RSK compiler rules, SIEM integration & edge SLA guarantee for 20 domains.',
    features: [
      '1,000,000 AI Crawler Inspections / Month ($0.0001/extra)',
      'Custom .rsk Security Knowledge rule compilation (rskc)',
      'Real-time SIEM Forwarders (Splunk SPL, Sentinel KQL, YARA rules)',
      'Sub-0.2ms Edge Execution SLA & 99.99% Availability Guarantee',
      'Multi-Tenant Cluster Isolation',
      'Up to 20 Production Domains & Microservices'
    ]
  },

  'edge-sentinel': {
    slug: 'edge-sentinel',
    name: 'Edge Reverse-Proxy Matrix',
    category: 'infrastructure',
    durationDays: 30,
    priceMonthly: 129,
    priceBilling: '$129 / month ($1,290/yr)',
    billingPeriod: 'monthly',
    maxDomains: 10,
    maxMonthlyInspections: 2000000,
    airgapped: false,
    techStack: 'Cloudflare Workers (Wasm), Nginx modules, Envoy',
    description: 'Wire-speed edge deflection & Datacenter ASN blocker on Anycast edge.',
    features: [
      'Cloudflare Worker Wasm & Nginx native reverse proxy modules',
      'Datacenter ASN Auto-Blocker (AWS, Azure, GCP, Hetzner, OVH, xAI Colossus)',
      'Edge Honeypot Routing without consuming origin server bandwidth',
      'Zero-Latency Global Anycast Routing',
      'Up to 10 Production Edge Domains'
    ]
  },
  'sovereign-infra': {
    slug: 'sovereign-infra',
    name: 'Sovereign Citadel Infrastructure',
    category: 'infrastructure',
    durationDays: 365,
    priceMonthly: 400,
    priceBilling: '$499 / month or $4,800 / year',
    billingPeriod: 'annual',
    maxDevices: 999,
    maxDomains: 999,
    airgapped: true,
    techStack: 'Windows Minifilter Driver (.sys), Linux eBPF/XDP, AWS WAF Terraform',
    description: 'Dedicated Kernel & Infrastructure fortification with 24/7 Threat SOC line.',
    features: [
      'Custom Windows NT Minifilter Driver (.sys) deployment',
      'Linux eBPF / XDP wire-speed packet filter scripts',
      'AWS WAF & Terraform HCL automated deployment rules',
      'Dedicated 24/7 Red Team countermeasure hotline',
      'Unlimited Enterprise Infrastructure Nodes & Clusters'
    ]
  },
  'grant-academic': {
    slug: 'grant-academic',
    name: 'Rakshak Academic & Research Grant',
    category: 'grant',
    durationDays: 365,
    priceMonthly: 0,
    priceBilling: '$0 / year (100% Sponsored Research Grant)',
    billingPeriod: 'annual',
    maxDevices: 5,
    maxDomains: 3,
    airgapped: true,
    techStack: 'Windows 11/10 (.exe), macOS, Linux, Next.js, Express, Python',
    description: '100% Free Sovereign Defense Grant for universities, independent researchers, and security auditors.',
    features: [
      'Full Citadel & SDK Enterprise capabilities',
      'Peer-reviewed research grant authorization',
      'Zero cost, 0-byte telemetry, full micro-VM bytecode access',
      'Multi-workstation grant license'
    ]
  },
  'developer-free': {
    slug: 'developer-free',
    name: 'Rakshak Community Developer Tier',
    category: 'community',
    durationDays: 365,
    priceMonthly: 0,
    priceBilling: '$0 / year (Free Community Tier)',
    billingPeriod: 'annual',
    maxDevices: 1,
    maxDomains: 1,
    airgapped: true,
    techStack: 'Next.js, Express, Python, Windows, Linux, macOS',
    description: 'Free developer tier to defend open source projects and local workstations against AI crawlers.',
    features: [
      'Universal Next.js & Express Middleware',
      'Local Workstation Shield',
      'Zero Cloud Telemetry',
      'Instant Auto-Provisioning'
    ]
  },

  'pro-shield': {
    slug: 'pro-shield',
    name: 'SDK Starter API Guard',
    category: 'sdk',
    durationDays: 30,
    priceMonthly: 29,
    priceBilling: '$29 / month',
    maxDomains: 1,
    maxMonthlyInspections: 50000,
    airgapped: false
  },
  'scale-cloud': {
    slug: 'scale-cloud',
    name: 'SDK Enterprise Scale Fleet',
    category: 'sdk',
    durationDays: 30,
    priceMonthly: 199,
    priceBilling: '$199 / month',
    maxDomains: 20,
    maxMonthlyInspections: 1000000,
    airgapped: false
  },
  'sovereign-matrix': {
    slug: 'sovereign-matrix',
    name: 'Sovereign Citadel Infrastructure',
    category: 'infrastructure',
    durationDays: 365,
    priceMonthly: 400,
    priceBilling: '$499 / month',
    maxDomains: 999,
    maxMonthlyInspections: -1,
    airgapped: true
  }
};

export function generateLicenseKey(tier = 'sentinel', customer = 'developer', durationDays = null) {
  const normTier = tier.toLowerCase();
  const limits = TIER_LIMITS[normTier] || TIER_LIMITS['sentinel'];
  const days = durationDays || limits.durationDays || 30;

  const issuedAt = Date.now();
  const expiresAt = issuedAt + days * 24 * 60 * 60 * 1000;

  const expirySec = Math.floor(expiresAt / 1000);
  const expiryHex = expirySec.toString(16).toUpperCase().padStart(8, '0');

  const entropySalt = crypto.randomBytes(3).toString('hex').toUpperCase();
  const prefix = (limits.slug || normTier).replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 5);

  // Deterministic airgapped payload: PREFIX:EXPIRY_HEX:SALT
  const payloadStr = `${prefix}:${expiryHex}:${entropySalt}`;
  const hmac = crypto.createHmac('sha256', LICENSE_SECRET);
  hmac.update(payloadStr);
  const signatureHex = hmac.digest('hex').toUpperCase().slice(0, 8);

  const licenseKey = `RSK-${prefix}-${expiryHex}-${entropySalt}-${signatureHex}`;

  return {
    licenseKey,
    tier: limits.slug || normTier,
    tierName: limits.name,
    category: limits.category || 'workstation',
    customer,
    issuedAt: new Date(issuedAt).toISOString(),
    expiresAt: new Date(expiresAt).toISOString(),
    durationDays: days,
    expiryHex,
    daysRemaining: days,
    signatureHex,
    valid: true
  };
}

export function verifyLicenseKey(licenseKey) {
  if (!licenseKey || typeof licenseKey !== 'string') {
    return { valid: false, error: 'MISSING_KEY' };
  }

  const parts = licenseKey.trim().split('-');
  if (parts.length < 4 || parts[0].toUpperCase() !== 'RSK') {
    return { valid: false, error: 'INVALID_FORMAT' };
  }

  const tierPrefix = parts[1].toUpperCase();
  let expiryHex = null;
  let signatureHex = null;
  let payloadStr = null;
  let expiresAt = null;

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

  // Strict Offline HMAC-SHA256 Verification
  const hmac = crypto.createHmac('sha256', LICENSE_SECRET);
  hmac.update(payloadStr);
  const expectedSig = hmac.digest('hex').toUpperCase().slice(0, signatureHex.length);

  if (expectedSig !== signatureHex) {
    return {
      valid: false,
      error: 'INVALID_SIGNATURE',
      status: 'CRYPTOGRAPHIC_SIGNATURE_INVALID',
      tier: tierPrefix.toLowerCase()
    };
  }

  const matchedTierKey = Object.keys(TIER_LIMITS).find(k => 
    k.replace(/[^a-z0-9]/gi, '').toLowerCase().startsWith(tierPrefix.toLowerCase())
  ) || 'sentinel';
  const limits = TIER_LIMITS[matchedTierKey];

  if (!expiresAt) {
    expiresAt = new Date(Date.now() + (limits?.durationDays || 30) * 86400 * 1000);
  }

  const now = new Date();
  const isExpired = now > expiresAt;
  const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const isPaid = !(tierPrefix.startsWith('COMMU') || tierPrefix.startsWith('DEVEL'));

  if (isExpired) {
    return {
      valid: false,
      error: 'EXPIRED',
      tier: matchedTierKey,
      tierName: limits?.name || 'Rakshak Shield',
      expiredAt: expiresAt.toISOString(),
      daysRemaining: 0,
      isPaid,
      status: 'SUBSCRIPTION_EXPIRED'
    };
  }

  return {
    valid: true,
    tier: matchedTierKey,
    tierName: limits?.name || 'Rakshak Shield',
    category: limits?.category || 'workstation',
    techStack: limits?.techStack || 'Universal',
    expiresAt: expiresAt.toISOString(),
    daysRemaining,
    signatureHex,
    isPaid,
    status: 'ACTIVE_AUTHORIZED'
  };
}

export function generateInvoice({
  tier = 'sentinel',
  email = 'finance@company.com',
  company = 'Enterprise Partner',
  domain = 'example.com',
  taxId = 'US-EIN-9920192',
  billingCycle = 'monthly'
} = {}) {
  const normTier = tier.toLowerCase();
  const limits = TIER_LIMITS[normTier] || TIER_LIMITS['sentinel'];
  const isAnnual = billingCycle === 'annual';
  const durationDays = isAnnual ? 365 : (limits.durationDays || 30);
  const license = generateLicenseKey(normTier, email, durationDays);

  const monthlyPrice = limits.priceMonthly || 19;
  const subtotal = isAnnual ? Math.round(monthlyPrice * 12 * 0.8) : (limits.billingPeriod === '6-months' ? 99 : monthlyPrice);
  const tax = Math.round(subtotal * 0.0825 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const invoiceRand = crypto.randomBytes(3).toString('hex').toUpperCase();
  const invoiceNumber = `INV-${new Date().getUTCFullYear()}-RSK-${invoiceRand}`;
  const dateStr = new Date().toISOString();
  const dueDateStr = new Date(Date.now() + 30 * 86400 * 1000).toISOString();

  const auditHash = crypto.createHash('sha256')
    .update(`${invoiceNumber}:${license.licenseKey}:${total}:${email}`)
    .digest('hex')
    .toUpperCase()
    .slice(0, 16);

  return {
    invoiceNumber,
    issuedDate: dateStr,
    dueDate: dueDateStr,
    company,
    taxId: taxId || 'PENDING_REGISTRATION',
    email,
    domain,
    tier: normTier,
    tierName: limits.name,
    licenseKey: license.licenseKey,
    expiresAt: license.expiresAt,
    daysRemaining: durationDays,
    signatureHex: license.signatureHex,
    billingCycle: isAnnual ? 'Annual (Prepaid - 20% Discount Applied)' : (limits.billingPeriod === '6-months' ? '6-Months Term' : 'Monthly Recurring'),
    lineItems: [
      {
        description: `${limits.name} - ${limits.techStack || 'Zero-Trust Defense Matrix'}`,
        quantity: 1,
        unitPrice: `$${subtotal.toFixed(2)}`,
        amount: `$${subtotal.toFixed(2)}`
      },
      {
        description: `Active Term Validity: ${durationDays} Days (Expires ${new Date(license.expiresAt).toLocaleDateString()})`,
        quantity: 1,
        unitPrice: '$0.00',
        amount: '$0.00 (Included)'
      }
    ],
    subtotal: `$${subtotal.toFixed(2)}`,
    tax: `$${tax.toFixed(2)}`,
    total: `$${total.toFixed(2)}`,
    currency: 'USD',
    paymentTerms: 'Net 30 via ACH Wire / Corporate Card / Cryptographic Token',
    remitTo: {
      entity: 'Rakshak Security Systems Inc.',
      wireRouting: 'ACH-021000021 / SWIFT: RSKUS33',
      taxEin: '88-4290124',
      jurisdiction: 'Delaware, USA / Global Anycast Network'
    },
    auditHash,
    status: 'ISSUED_PENDING_SETTLEMENT'
  };
}
