'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError('Missing checkout session identifier.');
      setLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (data.success && data.license) {
          setOrderData(data);
        } else {
          setError(data.error || 'Failed to verify payment confirmation.');
        }
      } catch (err) {
        setError('Network error while verifying payment session.');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  const copyLicense = () => {
    if (orderData?.license?.licenseKey && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(orderData.license.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '120px 20px 80px' }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '16px' }}>⏳</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff' }}>
            Verifying Stripe Payment &amp; Minting License...
          </h2>
          <p style={{ color: '#86868b', fontSize: '0.9rem' }}>
            Performing cryptographic hardware attestation and generating your license key.
          </p>
        </div>
      ) : error ? (
        <div style={{ background: '#0a0a0c', border: '1px solid rgba(255, 69, 58, 0.3)', borderRadius: '14px', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</div>
          <h2 style={{ fontSize: '1.3rem', color: '#ff453a', marginBottom: '8px' }}>
            Verification Notice
          </h2>
          <p style={{ color: '#86868b', fontSize: '0.9rem', marginBottom: '24px' }}>
            {error}
          </p>
          <Link
            href="/pricing"
            style={{
              background: '#0071e3',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            Return to Pricing
          </Link>
        </div>
      ) : (
        <div style={{ background: '#07090e', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '36px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(48, 209, 88, 0.1)',
              border: '1px solid rgba(48, 209, 88, 0.3)',
              color: '#30d158',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '14px'
            }}>
              ✓ PAYMENT SUCCESSFUL &amp; HARDENED
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 700, color: '#ffffff', margin: '0 0 8px' }}>
              Your Sovereign Defense License is Ready
            </h1>
            <p style={{ color: '#86868b', fontSize: '0.95rem', margin: 0 }}>
              Order confirmation sent to <strong style={{ color: '#ffffff' }}>{orderData.customer?.email}</strong>.
            </p>
          </div>

          {/* License Key Card */}
          <div style={{ background: '#000000', border: '1px solid rgba(41, 151, 255, 0.3)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'monospace' }}>
                CRYPTOGRAPHIC HARDWARE LICENSE KEY
              </span>
              <button
                onClick={copyLicense}
                style={{
                  background: copied ? '#30d158' : 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: copied ? '#000000' : '#ffffff',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {copied ? '✓ Copied' : 'Copy Key'}
              </button>
            </div>

            <div style={{
              fontFamily: 'monospace',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#2997ff',
              background: '#0a0a0c',
              padding: '12px 16px',
              borderRadius: '8px',
              wordBreak: 'break-all',
              letterSpacing: '0.04em',
              marginBottom: '16px'
            }}>
              {orderData.license?.licenseKey}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '0.82rem', color: '#86868b' }}>
              <div>Plan: <strong style={{ color: '#ffffff' }}>{orderData.plan?.name}</strong></div>
              <div>Duration: <strong style={{ color: '#ffffff' }}>{orderData.plan?.durationDays} Days</strong></div>
              <div>Binding: <strong style={{ color: '#30d158' }}>Single Physical Device</strong></div>
              <div>Telemetry: <strong style={{ color: '#30d158' }}>0 Bytes Cloud Egress</strong></div>
            </div>
          </div>

          {/* Activation Instructions */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', marginBottom: '10px' }}>
              ⚡ Immediate Workstation &amp; Server Activation
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#020408', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '12px 16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#86868b', marginBottom: '4px' }}>Windows Native Engine (PowerShell / Command Prompt)</div>
                <code style={{ color: '#60a5fa', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  {orderData.exeActivationCommand || `RakshakShield.exe activate ${orderData.license?.licenseKey}`}
                </code>
              </div>

              <div style={{ background: '#020408', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '12px 16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#86868b', marginBottom: '4px' }}>Universal Developer SDK (Node.js / NPX)</div>
                <code style={{ color: '#30d158', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  {orderData.cliActivationCommand || `npx rakshak activate ${orderData.license?.licenseKey}`}
                </code>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/download"
              style={{
                background: '#0071e3',
                color: '#ffffff',
                padding: '10px 22px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              Download RakshakShield.exe ↓
            </Link>
            <Link
              href="/developers"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f5f5f7',
                padding: '10px 22px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              View Integration Docs ↗
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main style={{ background: '#000000', color: '#f5f5f7', minHeight: '100vh' }}>
      <Navbar />
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '140px 20px', color: '#86868b' }}>Loading checkout confirmation...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </main>
  );
}
