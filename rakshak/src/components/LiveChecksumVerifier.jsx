'use client';
import { useState } from 'react';
import releaseManifest from '@/data/releaseManifest';

export default function LiveChecksumVerifier() {
  const [selectedKey, setSelectedKey] = useState('windows');
  const [computedHash, setComputedHash] = useState('');
  const [computing, setComputing] = useState(false);
  const [matchStatus, setMatchStatus] = useState(null); // 'match' | 'mismatch' | null
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const currentPkg = releaseManifest.packages[selectedKey];

  const verificationCommands = {
    windows: {
      tool: 'PowerShell',
      cmd: `(Get-FileHash "${currentPkg.file}" -Algorithm SHA256).Hash.ToLower()`
    },
    mac: {
      tool: 'macOS Terminal',
      cmd: `shasum -a 256 "${currentPkg.file}"`
    },
    linux: {
      tool: 'Linux Shell',
      cmd: `sha256sum "${currentPkg.file}"`
    },
    sdk: {
      tool: 'Node.js / Terminal',
      cmd: `node -e "console.log(crypto.createHash('sha256').update(fs.readFileSync('${currentPkg.file}')).digest('hex'))"`
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    }
  };

  // Client-side WebCrypto SHA-256 verification of local file
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setComputing(true);
    setComputedHash('');
    setMatchStatus(null);

    try {
      const buffer = await file.arrayBuffer();
      const digestBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(digestBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setComputedHash(hashHex);
      if (hashHex.toLowerCase() === currentPkg.sha256.toLowerCase()) {
        setMatchStatus('match');
      } else {
        setMatchStatus('mismatch');
      }
    } catch (err) {
      console.error('Error calculating hash:', err);
    } finally {
      setComputing(false);
    }
  };

  // Live remote verification via Fetch & WebCrypto
  const handleVerifyRemote = async () => {
    setComputing(true);
    setComputedHash('');
    setMatchStatus(null);

    try {
      const res = await fetch(`/releases/${currentPkg.file}`);
      const buffer = await res.arrayBuffer();
      const digestBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(digestBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setComputedHash(hashHex);
      if (hashHex.toLowerCase() === currentPkg.sha256.toLowerCase()) {
        setMatchStatus('match');
      } else {
        setMatchStatus('mismatch');
      }
    } catch (err) {
      console.error('Remote hash verification error:', err);
    } finally {
      setComputing(false);
    }
  };

  return (
    <div style={{
      background: '#070a12',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 12,
      padding: '2rem',
      marginTop: '2.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
            Live Cryptographic SHA-256 Verification Console
          </h3>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'var(--font-code)' }}>
          W3C WebCrypto API // Zero Cloud Upload
        </span>
      </div>

      {/* Package Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {Object.entries(releaseManifest.packages).map(([key, pkg]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedKey(key);
              setComputedHash('');
              setMatchStatus(null);
            }}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 6,
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: selectedKey === key ? '1px solid #00F5FF' : '1px solid rgba(255, 255, 255, 0.08)',
              background: selectedKey === key ? 'rgba(0, 245, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
              color: selectedKey === key ? '#00F5FF' : '#94a3b8',
              transition: 'all 0.15s ease'
            }}
          >
            {pkg.name} ({pkg.size})
          </button>
        ))}
      </div>

      {/* Manifest Data Box */}
      <div style={{
        background: '#030509',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
            Official Build SHA-256 Checksum ({currentPkg.file}):
          </span>
          <button
            onClick={() => handleCopy(currentPkg.sha256, 'hash')}
            style={{
              background: 'transparent',
              border: 'none',
              color: copiedHash ? '#34d399' : '#38bdf8',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {copiedHash ? '✓ Copied' : 'Copy Hash'}
          </button>
        </div>
        <div style={{
          fontFamily: 'var(--font-code)',
          fontSize: '0.85rem',
          color: '#38bdf8',
          wordBreak: 'break-all',
          background: 'rgba(56, 189, 248, 0.05)',
          padding: '0.65rem 0.9rem',
          borderRadius: 6,
          border: '1px solid rgba(56, 189, 248, 0.15)'
        }}>
          {currentPkg.sha256}
        </div>
      </div>

      {/* Terminal Verification Command */}
      <div style={{
        background: '#030509',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
            Verify on Your Machine ({verificationCommands[selectedKey].tool}):
          </span>
          <button
            onClick={() => handleCopy(verificationCommands[selectedKey].cmd, 'cmd')}
            style={{
              background: 'transparent',
              border: 'none',
              color: copiedCmd ? '#34d399' : '#00F5FF',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {copiedCmd ? '✓ Copied' : 'Copy Command'}
          </button>
        </div>
        <div style={{
          fontFamily: 'var(--font-code)',
          fontSize: '0.825rem',
          color: '#e2e8f0',
          wordBreak: 'break-all',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '0.65rem 0.9rem',
          borderRadius: 6
        }}>
          {verificationCommands[selectedKey].cmd}
        </div>
      </div>

      {/* Interactive Verification Section */}
      <div style={{
        border: '1px dashed rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        padding: '1.5rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.01)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={{
            background: '#1e293b',
            color: '#fff',
            padding: '0.6rem 1.25rem',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Select Downloaded File to Verify
            <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>

          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>or</span>

          <button
            onClick={handleVerifyRemote}
            disabled={computing}
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '0.6rem 1.25rem',
              borderRadius: 6,
              cursor: computing ? 'wait' : 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {computing ? (
              <>
                <div style={{ width: 14, height: 14, border: '2px solid #34d399', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Hashing in Browser...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Verify Live Server Binary
              </>
            )}
          </button>
        </div>

        {/* Verification Result Banner */}
        {computedHash && (
          <div style={{ marginTop: '1.25rem', textAlign: 'left' }}>
            <div style={{
              padding: '1rem',
              borderRadius: 6,
              background: matchStatus === 'match' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${matchStatus === 'match' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{matchStatus === 'match' ? '✓' : '✗'}</span>
                <strong style={{ color: matchStatus === 'match' ? '#34d399' : '#f87171', fontSize: '0.95rem' }}>
                  {matchStatus === 'match'
                    ? '100% CRYPTOGRAPHIC MATCH CONFIRMED (Zero Tampering)'
                    : 'CHECKSUM MISMATCH DETECTED'}
                </strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'var(--font-code)', wordBreak: 'break-all' }}>
                Computed: {computedHash}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
