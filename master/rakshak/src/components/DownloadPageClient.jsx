'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import releaseManifest from '@/data/releaseManifest';
import LiveChecksumVerifier from '@/components/LiveChecksumVerifier';

const osOptions = {
  windows: {
    name: 'Windows 11 / 10',
    sub: 'x64 Architecture',
    logo: '/assets/tech/windows.svg',
    size: releaseManifest.packages.windows.size,
    badge: 'Verified Production Bundle',
    primaryCta: 'Download Windows Package (.zip)',
    primaryExt: '.zip',
    secondaryCta: 'View Release Manifest',
    downloadUrl: '/releases/rakshak-windows-x64.zip',
    standaloneUrl: '/releases/RakshakShield.exe',
    cmd: 'powershell -c "irm https://rakshakus.vercel.app/install.ps1 | iex"',
    hash: releaseManifest.packages.windows.sha256,
    bullets: [
      'Native RakshakShield.exe PE 64-bit Workstation Engine',
      'Universal CLI & .rsk Compiler runtime included',
      'Root perimeter defense.rsk and bytecode engine',
      'Zero-cloud telemetry and airgapped local execution'
    ]
  },
  mac: {
    name: 'macOS Sequoia & Sonoma',
    sub: 'Apple Silicon (M1-M4) & Intel',
    logo: '/assets/tech/apple-white.svg',
    size: releaseManifest.packages.mac.size,
    badge: 'Universal POSIX Bundle',
    primaryCta: 'Download macOS Package (.zip)',
    primaryExt: '.zip',
    secondaryCta: 'View Release Manifest',
    downloadUrl: '/releases/rakshak-macos-universal.zip',
    cmd: 'curl -fsSL https://rakshakus.vercel.app/install.sh | bash',
    hash: releaseManifest.packages.mac.sha256,
    bullets: [
      'Native universal shell binary wrapper',
      'Rakshak Security Knowledge (.rsk) compiler',
      'Automatic zsh and bash shell profile integration',
      'Zero battery drain and native M-series performance'
    ]
  },
  linux: {
    name: 'Linux Distributions',
    sub: 'Debian, Ubuntu, Arch, Fedora, RHEL',
    logo: '/assets/tech/linux.svg',
    size: releaseManifest.packages.linux.size,
    badge: 'GPG Verified Tarball',
    primaryCta: 'Download Linux Tarball (.tar.gz)',
    primaryExt: '.tar.gz',
    secondaryCta: 'View Release Manifest',
    downloadUrl: '/releases/rakshak-linux-x64.tar.gz',
    cmd: 'curl -fsSL https://rakshakus.vercel.app/install.sh | bash',
    hash: releaseManifest.packages.linux.sha256,
    bullets: [
      'Lightweight POSIX daemon and system utility',
      'Built-in bytecode disassembler and VM runner',
      'Compatible with custom kernels and container runtimes',
      'Zero external dependencies outside standard Node runtime'
    ]
  },
  sdk: {
    name: 'Web & Edge SDK',
    sub: 'Next.js, Express, Edge Middleware',
    logo: '/globe.svg',
    size: releaseManifest.packages.sdk.size,
    badge: 'NPM Production Tarball (v1.0.0)',
    primaryCta: 'Download SDK Package (.tgz)',
    primaryExt: '.tgz',
    secondaryCta: 'Explore Developer Portal',
    downloadUrl: '/releases/rakshaksdkv1-1.0.0.tgz',
    cmd: 'npm install https://rakshakus.vercel.app/releases/rakshaksdkv1-1.0.0.tgz',
    hash: releaseManifest.packages.sdk.sha256,
    bullets: [
      'Direct NPM installable tarball bundle',
      'Full TypeScript adapters for Next.js & Express',
      'All 6 Rakshak Security Knowledge (.rsk) policies included',
      'Asymmetric AI honeypot deflection with zero false positives'
    ]
  }
};

export default function DownloadPageClient() {
  const [selectedOs, setSelectedOs] = useState('windows');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const [activeLicense, setActiveLicense] = useState(null);
  const [activeTier, setActiveTier] = useState(null);
  const [activeDaysRemaining, setActiveDaysRemaining] = useState(null);
  const [activeExpiresAt, setActiveExpiresAt] = useState(null);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [keySuccess, setKeySuccess] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('rakshak_active_license');
      const savedTier = localStorage.getItem('rakshak_active_plan');
      if (savedKey) {
        setActiveLicense(savedKey);
        setActiveTier(savedTier || 'Commercial Active');
        fetch(`/api/rakshak/license?key=${encodeURIComponent(savedKey)}`)
          .then(res => res.json())
          .then(data => {
            if (data.valid) {
              setActiveDaysRemaining(data.daysRemaining);
              setActiveExpiresAt(data.expiresAt);
            } else if (data.error === 'EXPIRED') {
              localStorage.removeItem('rakshak_active_license');
              localStorage.removeItem('rakshak_active_plan');
              setActiveLicense(null);
              setActiveTier(null);
            }
          })
          .catch(() => {});
      }
    } catch {}
  }, []);

  const active = osOptions[selectedOs];

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(active.cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2200);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(active.hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2200);
  };

  const handleVerifyLicense = async (e) => {
    if (e) e.preventDefault();
    if (!inputKey.trim()) {
      setKeyError('Please enter your license key.');
      return;
    }
    setVerifying(true);
    setKeyError('');
    setKeySuccess('');

    try {
      const res = await fetch(`/api/rakshak/license?key=${encodeURIComponent(inputKey.trim())}`);
      const data = await res.json();
      if (data.valid) {
        localStorage.setItem('rakshak_active_license', inputKey.trim());
        localStorage.setItem('rakshak_active_plan', data.tier || 'commercial');
        setActiveLicense(inputKey.trim());
        setActiveTier(data.tierName || 'Commercial Active');
        setActiveDaysRemaining(data.daysRemaining);
        setActiveExpiresAt(data.expiresAt);
        setKeySuccess(`License verified! Active for ${data.daysRemaining} days. All downloads unlocked.`);
        setTimeout(() => {
          setShowLicenseModal(false);
          setKeySuccess('');
        }, 1200);
      } else if (data.error === 'EXPIRED') {
        setKeyError(`License EXPIRED on ${data.expiredAt ? new Date(data.expiredAt).toLocaleDateString() : 'earlier date'} (0 days remaining). Please renew your subscription to access downloads.`);
      } else {
        setKeyError(data.error === 'INVALID_FORMAT' 
          ? 'Invalid key format. Expected RSK-<TIER>-<EXPIRY>-<SALT>-<SIGNATURE>.' 
          : 'License key verification failed. Ensure you have an active commercial subscription.');
      }
    } catch (err) {
      setKeyError('Network verification error. Please retry.');
    } finally {
      setVerifying(false);
    }
  };

  const handleDeactivate = () => {
    try {
      localStorage.removeItem('rakshak_active_license');
      localStorage.removeItem('rakshak_active_plan');
    } catch {}
    setActiveLicense(null);
    setActiveTier(null);
  };

  const handleDownloadClick = (e, url) => {
    if (!activeLicense) {
      e.preventDefault();
      setShowLicenseModal(true);
    }
  };

  return (
    <div style={{ paddingTop: '7.5rem', paddingBottom: '6rem' }}>
      <div className="container">
        <div className="section-header-deepip" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="tag_content" style={{ marginBottom: '1.25rem' }}>
            <div className="blue_tag">RELEASE v2.4.1</div>
            <span>Verified Cryptographic Releases • Commercial Enterprise Matrix</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.25rem', color: '#ffffff' }}>
            Deploy Rakshak Defense In <span className="text-color-blue">Under 60 Seconds.</span>
          </h1>
          <p style={{ maxWidth: 680, margin: '0 auto', fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.65 }}>
            Native, cryptographically verified packages and terminal installers for Windows, macOS, Linux, and Web Edge Middleware. Real physical downloads with instant execution.
          </p>
        </div>

        {activeLicense ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 14,
            padding: '1.15rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '3.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#30d158' }} />
              <div>
                <span style={{ color: '#30d158', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.02em' }}>
                  COMMERCIAL SUBSCRIPTION ACTIVE
                </span>
                <span style={{ color: '#ffffff', fontSize: '0.85rem', marginLeft: '0.75rem', fontFamily: 'var(--font-code)' }}>
                  {activeLicense}
                </span>
                <span style={{ color: '#86868b', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                  ({activeTier})
                </span>
                {activeDaysRemaining !== null && (
                  <span style={{
                    marginLeft: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 4,
                    fontFamily: 'var(--font-code)'
                  }}>
                    {activeDaysRemaining} Days Remaining
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <span style={{ background: 'rgba(48, 209, 88, 0.12)', color: '#30d158', border: '1px solid rgba(48, 209, 88, 0.25)', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: 6 }}>
                ✓ DOWNLOADS UNLOCKED
              </span>
              <button 
                onClick={handleDeactivate} 
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', borderRadius: 6, padding: '0.3rem 0.65rem', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Change License
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 12,
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '3.5rem',
            boxShadow: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '1.35rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                🔒
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#ffffff', fontSize: '1.05rem', fontWeight: 800 }}>
                  COMMERCIAL LICENSE REQUIRED TO USE STRUCTURE
                </h4>
                <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.4 }}>
                  Rakshak workstation binaries, native kernel PE engines, and RSK compilers require a paid commercial subscription. Unlicensed use is prohibited.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <button 
                onClick={() => setShowLicenseModal(true)} 
                className="btn-deepip-dark" 
                style={{ minHeight: 40, fontSize: '0.85rem', padding: '0.45rem 1.15rem', cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.15)' }}
              >
                Enter License Key
              </button>
              <Link 
                href="/pricing" 
                className="btn-deepip-blue" 
                style={{ minHeight: 40, fontSize: '0.85rem', padding: '0.45rem 1.35rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
              >
                Purchase License (From $19) →
              </Link>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.75rem', marginBottom: '4rem' }}>
          {Object.entries(osOptions).map(([key, os]) => {
            const isChosen = selectedOs === key;
            return (
              <div 
                key={key} 
                className="deepip-card" 
                onClick={() => setSelectedOs(key)}
                style={{
                  padding: '2.25rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderColor: isChosen ? 'rgba(41, 151, 255, 0.45)' : 'rgba(255, 255, 255, 0.08)',
                  background: isChosen ? 'radial-gradient(ellipse 90% 40% at 50% 0%, rgba(0, 113, 227, 0.12) 0%, transparent 70%), #121215' : '#09090b',
                  transform: isChosen ? 'translateY(-2px)' : 'none',
                  boxShadow: isChosen ? '0 12px 36px rgba(0, 0, 0, 0.7)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: isChosen ? 'linear-gradient(135deg, rgba(0, 113, 227, 0.22) 0%, rgba(41, 151, 255, 0.08) 100%)' : 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isChosen ? '1px solid rgba(41, 151, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <img src={os.logo} alt={os.name} width="24" height="24" style={{ objectFit: 'contain' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{os.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: '#86868b' }}>{os.sub}</span>
                    </div>
                  </div>
                  <span style={{ background: activeLicense ? 'rgba(48, 209, 88, 0.12)' : 'rgba(255, 69, 58, 0.12)', color: activeLicense ? '#30d158' : '#ff453a', fontSize: '0.7rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: 9999 }}>
                    {activeLicense ? os.size : 'LOCKED'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem', flex: 1 }}>
                  {os.bullets.map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: '#d2d2d7', lineHeight: 1.4 }}>
                      <svg width="14" height="14" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <path d="M4 9L7.5 12.5L14 6" stroke={activeLicense ? "#2997ff" : "#64748b"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <a 
                    href={activeLicense ? os.downloadUrl : '#'}
                    onClick={(e) => handleDownloadClick(e, os.downloadUrl)}
                    download={activeLicense ? true : false}
                    className={activeLicense ? (isChosen ? 'btn-deepip-blue' : 'btn-deepip-dark') : 'btn-deepip-dark'}
                    style={{ 
                      textAlign: 'center', 
                      textDecoration: 'none', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.5rem', 
                      minHeight: 46,
                      borderRadius: 9999,
                      background: activeLicense 
                        ? (isChosen ? '#ffffff' : 'rgba(255, 255, 255, 0.04)') 
                        : 'rgba(255, 69, 58, 0.1)',
                      borderColor: activeLicense ? (isChosen ? '#ffffff' : 'rgba(255, 255, 255, 0.12)') : 'rgba(255, 69, 58, 0.25)',
                      color: activeLicense ? (isChosen ? '#000000' : '#ffffff') : '#ff453a',
                      fontWeight: 600
                    }}
                  >
                    {activeLicense ? (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                          <path d="M12 3v13m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {os.primaryCta}
                      </>
                    ) : (
                      <>
                        <span>🔒 Unlock with Paid License</span>
                      </>
                    )}
                  </a>

                  {key === 'windows' && (
                    <a
                      href={activeLicense ? os.standaloneUrl : '#'}
                      onClick={(e) => handleDownloadClick(e, os.standaloneUrl)}
                      download={activeLicense ? true : false}
                      style={{
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        color: activeLicense ? '#ffffff' : '#86868b',
                        textDecoration: 'none',
                        padding: '0.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 6,
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3v13m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {activeLicense ? 'Download RakshakShield.exe (Standalone)' : '🔒 Standalone .exe (License Required)'}
                    </a>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#6e6e73', padding: '0 0.25rem' }}>
                    <span>{activeLicense ? os.badge : 'Commercial License Gate'}</span>
                    <Link href={key === 'sdk' ? '/developers' : '/releases/checksums.txt'} style={{ color: '#d2d2d7', textDecoration: 'underline' }}>
                      {os.secondaryCta}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="deepip-card" style={{ padding: '2.5rem', marginBottom: '4rem', background: '#09090b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ color: '#86868b', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-code)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                TERMINAL / ONE-LINE DIRECT INSTALLER
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginTop: '0.25rem' }}>
                Deploy via CLI Command ({active.name})
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.3rem', borderRadius: 9999, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {Object.entries(osOptions).map(([key, os]) => (
                <button
                  key={key}
                  onClick={() => setSelectedOs(key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 0.95rem',
                    borderRadius: 9999,
                    border: 'none',
                    background: selectedOs === key ? '#ffffff' : 'transparent',
                    color: selectedOs === key ? '#000000' : '#86868b',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img src={os.logo} alt="" width="14" height="14" style={{ objectFit: 'contain' }} />
                  {key === 'sdk' ? 'Web SDK' : key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#020408', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-code)', fontSize: '0.925rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', maxWidth: '80%' }}>
              <span style={{ color: '#64748b' }}>$</span>
              <span style={{ whiteSpace: 'nowrap' }}>{active.cmd}</span>
            </div>
            <button
              onClick={handleCopyCmd}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.15rem',
                background: copiedCmd ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 6,
                color: '#ffffff',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {copiedCmd ? (
                <>✓ Copied!</>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Copy Command
                </>
              )}
            </button>
          </div>
        </div>

        <div className="deepip-card" style={{ padding: '2rem 2.5rem', marginBottom: '4rem', background: '#09090b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#30d158" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                Verified SHA-256 Binary Integrity ({active.name})
              </h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/releases/checksums.txt" style={{ color: '#86868b', fontSize: '0.8rem', textDecoration: 'underline' }}>
                View All Checksums
              </Link>
              <button
                onClick={handleCopyHash}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copiedHash ? '#30d158' : '#ffffff',
                  fontSize: '0.825rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {copiedHash ? '✓ Hash Copied' : 'Copy Hash'}
              </button>
            </div>
          </div>

          <div style={{ background: '#000000', padding: '0.85rem 1.25rem', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.06)', fontFamily: 'var(--font-code)', fontSize: '0.825rem', color: '#d2d2d7', wordBreak: 'break-all' }}>
            {active.hash}
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <LiveChecksumVerifier />
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <div className="section-header-deepip" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="tag_content">
              <div className="blue_tag">WORKFLOW</div>
              <span>Immediate Zero-Trust Activation</span>
            </div>
            <h2>Quickstart Setup Process</h2>
            <p>From purchase &amp; license activation to active perimeter isolation in three simple steps.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="deepip-card" style={{ padding: '2rem', background: '#09090b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9999, background: 'rgba(255, 255, 255, 0.06)', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-code)' }}>
                01
              </div>
              <h4 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 600, marginBottom: '0.5rem' }}>Acquire &amp; Activate License</h4>
              <p style={{ color: '#86868b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Select a commercial plan on <Link href="/pricing" style={{ color: '#ffffff' }}>Pricing</Link>. Your cryptographic HMAC license key unlocks production binaries and terminal installers.
              </p>
            </div>

            <div className="deepip-card" style={{ padding: '2rem', background: '#09090b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9999, background: 'rgba(255, 255, 255, 0.06)', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-code)' }}>
                02
              </div>
              <h4 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 600, marginBottom: '0.5rem' }}>Download &amp; Verify</h4>
              <p style={{ color: '#86868b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Download <code style={{ color: '#d2d2d7' }}>RakshakShield.exe</code> or terminal packages. Activate locally via <code style={{ color: '#d2d2d7' }}>RakshakShield.exe activate &lt;KEY&gt;</code>.
              </p>
            </div>

            <div className="deepip-card" style={{ padding: '2rem', background: '#09090b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9999, background: 'rgba(255, 255, 255, 0.06)', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', fontFamily: 'var(--font-code)' }}>
                03
              </div>
              <h4 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 600, marginBottom: '0.5rem' }}>Enforce Zero-Trust</h4>
              <p style={{ color: '#86868b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Your endpoints and sensitive local directories are fortified. Background AI crawlers, headless scrapers, and automated indexers are deflected with &lt;0.02ms latency.
              </p>
            </div>
          </div>
        </div>

        {showLicenseModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1.5rem'
          }}>
            <div style={{
              background: '#09090b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 20,
              maxWidth: 520,
              width: '100%',
              padding: '2.5rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
              position: 'relative'
            }}>
              <button 
                onClick={() => setShowLicenseModal(false)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'none',
                  border: 'none',
                  color: '#86868b',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>

              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div style={{ width: 50, height: 50, borderRadius: 9999, background: 'rgba(255, 255, 255, 0.05)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  🔒
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Commercial License Required
                </h3>
                <p style={{ color: '#86868b', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  Rakshak workstation binaries and kernel isolation engines require an active paid subscription key to download and execute.
                </p>
              </div>

              <form onSubmit={handleVerifyLicense} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#86868b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Enter Commercial License Key:
                  </label>
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="e.g. RSK-CITAD-4F92-819A201B"
                    style={{
                      width: '100%',
                      background: '#000000',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 10,
                      padding: '0.75rem 1rem',
                      color: '#ffffff',
                      fontFamily: 'var(--font-code)',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {keyError && (
                  <div style={{ color: '#ff453a', fontSize: '0.85rem', background: 'rgba(255, 69, 58, 0.1)', padding: '0.5rem 0.75rem', borderRadius: 8 }}>
                    {keyError}
                  </div>
                )}

                {keySuccess && (
                  <div style={{ color: '#30d158', fontSize: '0.85rem', background: 'rgba(48, 209, 88, 0.1)', padding: '0.5rem 0.75rem', borderRadius: 8 }}>
                    {keySuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={verifying}
                  className="btn-deepip-blue"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: verifying ? 'wait' : 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  {verifying ? 'Verifying Key...' : 'Verify License & Unlock Downloads'}
                </button>
              </form>

              <div style={{ marginTop: '1.75rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
                <span style={{ color: '#86868b', fontSize: '0.85rem' }}>Don't have an active license?</span>
                <div style={{ marginTop: '0.5rem' }}>
                  <Link 
                    href="/pricing"
                    onClick={() => setShowLicenseModal(false)}
                    style={{
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    View Commercial Plans &amp; Acquire License Key (From $19/mo) →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
