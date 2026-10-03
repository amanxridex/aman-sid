'use client';
import { useState } from 'react';
import Link from 'next/link';
import releaseManifest from '@/data/releaseManifest';

const installData = {
  windows: {
    cmd: 'powershell -c "irm https://rakshakus.vercel.app/install.ps1 | iex"',
    downloadUrl: '/releases/rakshak-windows-x64.zip',
    ext: '.zip',
    size: releaseManifest.packages.windows.size,
    hash: releaseManifest.packages.windows.sha256,
    label: 'Direct Download (.zip)'
  },
  mac: {
    cmd: 'curl -fsSL https://rakshakus.vercel.app/install.sh | bash',
    downloadUrl: '/releases/rakshak-macos-universal.zip',
    ext: '.zip',
    size: releaseManifest.packages.mac.size,
    hash: releaseManifest.packages.mac.sha256,
    label: 'macOS Bundle (.zip)'
  },
  linux: {
    cmd: 'curl -fsSL https://rakshakus.vercel.app/install.sh | bash',
    downloadUrl: '/releases/rakshak-linux-x64.tar.gz',
    ext: '.tar.gz',
    size: releaseManifest.packages.linux.size,
    hash: releaseManifest.packages.linux.sha256,
    label: 'Linux Tarball (.tar.gz)'
  },
  sdk: {
    cmd: 'npm install https://rakshakus.vercel.app/releases/rakshaksdkv1-1.0.0.tgz',
    downloadUrl: '/releases/rakshaksdkv1-1.0.0.tgz',
    ext: '.tgz',
    size: releaseManifest.packages.sdk.size,
    hash: releaseManifest.packages.sdk.sha256,
    label: 'NPM SDK Package (.tgz)'
  }
};

export default function DownloadMatrix() {
  const [activeOs, setActiveOs] = useState('windows');
  const [copied, setCopied] = useState(false);

  const current = installData[activeOs];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="download" className="download-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <img src="/assets/tech/git.svg" alt="" width="14" height="14" /> Get Started
          </div>
          <h2>Install Rakshak in Under 60 Seconds</h2>
          <p>Commercial Anti-AI Perimeter for workstations &amp; web developers. Lightweight, production core, verified cryptographic integrity.</p>
        </div>

        <div className="os-tabs">
          <button 
            className={`os-tab ${activeOs === 'windows' ? 'active' : ''}`}
            onClick={() => setActiveOs('windows')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <img src="/assets/tech/windows.svg" alt="Windows" width="16" height="16" style={{ objectFit: 'contain' }} /> Windows
          </button>
          <button 
            className={`os-tab ${activeOs === 'mac' ? 'active' : ''}`}
            onClick={() => setActiveOs('mac')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <img src="/assets/tech/apple-white.svg" alt="macOS" width="15" height="15" style={{ objectFit: 'contain' }} /> macOS
          </button>
          <button 
            className={`os-tab ${activeOs === 'linux' ? 'active' : ''}`}
            onClick={() => setActiveOs('linux')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <img src="/assets/tech/linux.svg" alt="Linux" width="16" height="16" style={{ objectFit: 'contain' }} /> Linux
          </button>
          <button 
            className={`os-tab ${activeOs === 'sdk' ? 'active' : ''}`}
            onClick={() => setActiveOs('sdk')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <img src="/globe.svg" alt="Web SDK" width="15" height="15" style={{ objectFit: 'contain' }} /> Web SDK
          </button>
        </div>

        <div className="installer-card">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>Run in Terminal / CLI:</p>
          <div className="terminal-box">
            <span className="cmd-text">{current.cmd}</span>
            <button onClick={handleCopy} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>Rakshak v1.0.0 (Production Core Release)</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-dim)', margin: '0.25rem 0 0', fontFamily: 'monospace' }}>
                SHA-256: {current.hash.slice(0, 24)}... • Size: {current.size}
              </p>
            </div>
            <a 
              href={current.downloadUrl} 
              download
              className="btn btn-primary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v13m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {current.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
