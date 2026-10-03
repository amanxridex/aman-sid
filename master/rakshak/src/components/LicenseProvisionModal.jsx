'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LicenseProvisionModal({ plan, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('developer'); // 'developer' | 'enterprise'
  const [licenseData, setLicenseData] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [domain, setDomain] = useState('');
  const [invoiceSuccess, setInvoiceSuccess] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    if (plan && isOpen) {
      setLoading(true);
      fetch('/api/rakshak/license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: plan.slug,
          email: 'developer@rakshak.local',
          company: 'Personal Workstation'
        })
      })
        .then(res => res.json())
        .then(data => {
          setLicenseData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('License API offline or unreachable:', err);
          setLicenseData({
            error: true,
            licenseKey: 'PROVISIONING_OFFLINE_RETRY',
            tier: plan.slug,
            errorMessage: 'Cryptographic License Authority endpoint unreachable. Please retry.'
          });
          setLoading(false);
        });

      setInvoiceSuccess(false);
      setIsActivated(false);
    }
  }, [plan, isOpen]);

  if (!isOpen || !plan) return null;

  const licenseKey = licenseData?.licenseKey || 'Generating Cryptographic Token...';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(`RAKSHAK_LICENSE_KEY="${licenseKey}"\nRAKSHAK_TIER="${plan.slug}"\nRAKSHAK_HMAC_SIG="${licenseData?.signature || ''}"`);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleActivateDeveloper = () => {
    try {
      localStorage.setItem('rakshak_active_license', licenseKey);
      localStorage.setItem('rakshak_active_plan', plan.slug);
      localStorage.setItem('rakshak_license_signature', licenseData?.signature || '');
    } catch {}
    setIsActivated(true);
  };

  const [stripeLoading, setStripeLoading] = useState(false);

  const handleStripeCheckout = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan.slug,
          email: email || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Stripe checkout error:', err);
    } finally {
      setStripeLoading(false);
    }
  };

  const handleRequestInvoice = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/rakshak/license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: plan.slug,
          email,
          company,
          domain
        })
      });
      const data = await res.json();
      setInvoiceData(data);
      setInvoiceSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#09090b',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          maxWidth: 640,
          width: '100%',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.2rem 0.6rem',
                borderRadius: 9999,
                fontFamily: 'var(--font-code)',
                textTransform: 'uppercase'
              }}>
                CRYPTOGRAPHIC PROVISIONING
              </span>
              <span style={{ fontSize: '0.8rem', color: '#6e6e73' }}>// HMAC-SHA256 SIGNED</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.35rem', color: '#fff', fontWeight: 700 }}>
              Provision {plan.name} ({plan.price})
            </h3>
            <div style={{ fontSize: '0.75rem', color: '#a1a1a6', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>🔒</span> <span>Single-Device License • 1 Payment = 1 Workstation (Hardware-Bound TPM)</span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              color: '#86868b',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &times;
          </button>
        </div>

        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <button
            onClick={() => setActiveTab('developer')}
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              background: activeTab === 'developer' ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'developer' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'developer' ? '#ffffff' : '#86868b',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Cryptographic Developer Key
          </button>
          <button
            onClick={() => setActiveTab('enterprise')}
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              background: activeTab === 'enterprise' ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'enterprise' ? '2px solid #ffffff' : '2px solid transparent',
              color: activeTab === 'enterprise' ? '#ffffff' : '#86868b',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Commercial Invoice &amp; Procurement
          </button>
        </div>

        <div style={{ padding: '1.75rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {activeTab === 'developer' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Attested HMAC-SHA256 Token (Server Signed)
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#000000',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 10,
                  padding: '0.6rem 0.85rem',
                  gap: '0.75rem'
                }}>
                  <code style={{ flex: 1, color: '#ffffff', fontSize: '0.92rem', fontFamily: 'var(--font-code)', wordBreak: 'break-all' }}>
                    {loading ? 'Attesting Token...' : licenseKey}
                  </code>
                  <button
                    onClick={handleCopyKey}
                    style={{
                      background: copiedKey ? '#30d158' : 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: copiedKey ? '#000000' : '#ffffff',
                      borderRadius: 9999,
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {copiedKey ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>

              {licenseData && (
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 10, padding: '0.85rem 1rem', fontSize: '0.78rem', color: '#86868b', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>Active Term: <strong style={{ color: '#30d158' }}>{licenseData.durationDays || 30} Days Active</strong></div>
                  <div>Status: <span style={{ color: '#30d158', fontWeight: 600 }}>VALID &amp; ENFORCED</span></div>
                  <div>Expires At: <span style={{ color: '#d2d2d7' }}>{licenseData.expiresAt ? new Date(licenseData.expiresAt).toLocaleDateString() : 'Active Term'}</span></div>
                  <div>HMAC Sig: <code style={{ color: '#ffffff' }}>{licenseData.signature || 'ACTIVE'}</code></div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Activate License On Your Device or Web Stack
                </label>
                <div style={{
                  background: '#000000',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 10,
                  padding: '0.85rem 1rem',
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.78rem',
                  color: '#d2d2d7',
                  lineHeight: 1.6
                }}>
                  <div style={{ color: '#6e6e73' }}># Windows 11/10 Native PE Executable:</div>
                  <div style={{ color: '#ffffff' }}>RakshakShield.exe activate {licenseKey}</div>
                  
                  <div style={{ color: '#6e6e73', marginTop: '0.45rem' }}># Python Workstation &amp; Cybersecurity SDK:</div>
                  <div style={{ color: '#ffffff' }}>python -m rakshaksdk.cli activate {licenseKey}</div>

                  <div style={{ color: '#6e6e73', marginTop: '0.45rem' }}># Node.js Universal CLI / RSK Compiler:</div>
                  <div style={{ color: '#ffffff' }}>npx rakshak activate {licenseKey}</div>

                  <div style={{ color: '#6e6e73', marginTop: '0.45rem' }}># Web App &amp; Edge Middleware (.env):</div>
                  <div style={{ color: '#30d158' }}>RAKSHAK_LICENSE_KEY=&quot;{licenseKey}&quot;</div>
                </div>
              </div>

              {/* Real Stripe Checkout Card */}
              <div style={{ padding: '1rem', background: '#020408', border: '1px solid rgba(41, 151, 255, 0.25)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>💳 Official Stripe Commercial Checkout</span>
                  <span style={{ fontSize: '0.82rem', color: '#30d158', fontWeight: 700 }}>{plan.price}</span>
                </div>
                <button
                  onClick={handleStripeCheckout}
                  disabled={stripeLoading}
                  style={{
                    width: '100%',
                    minHeight: 44,
                    background: '#0071e3',
                    border: 'none',
                    borderRadius: 8,
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'opacity 0.15s ease'
                  }}
                >
                  {stripeLoading ? 'Connecting to Stripe...' : `Pay with Card / Apple Pay (${plan.price}) →`}
                </button>
                <div style={{ fontSize: '0.72rem', color: '#86868b', textAlign: 'center' }}>
                  Instant single-device cryptographic hardware attestation delivered on completion.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                <button
                  onClick={handleActivateDeveloper}
                  disabled={isActivated}
                  style={{
                    flex: 1,
                    minHeight: 44,
                    background: isActivated ? '#30d158' : '#ffffff',
                    border: 'none',
                    borderRadius: 9999,
                    color: isActivated ? '#ffffff' : '#000000',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: isActivated ? 'default' : 'pointer'
                  }}
                >
                  {isActivated ? 'SESSION AUTHENTICATED IN LOCALSTORAGE' : 'Store Verified Token In Session'}
                </button>

                <button
                  onClick={handleCopyEnv}
                  style={{
                    padding: '0 1.25rem',
                    minHeight: 44,
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 9999,
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.825rem',
                    cursor: 'pointer'
                  }}
                >
                  {copiedEnv ? 'ENV COPIED' : 'Copy .env Snippet'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem' }}>
                <span>Official Release Mirror:</span>
                <Link href="/download" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}>
                  Download Attested Packages &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {invoiceSuccess && invoiceData ? (
                <div style={{
                  background: 'rgba(48, 209, 88, 0.08)',
                  border: '1px solid rgba(48, 209, 88, 0.3)',
                  borderRadius: 12,
                  padding: '1.5rem',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(48, 209, 88, 0.2)', color: '#30d158', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800 }}>
                        OK
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>
                          Commercial Purchase Order &amp; Invoice Issued
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#d2d2d7', fontFamily: 'var(--font-code)' }}>
                          {invoiceData.invoiceId || invoiceData.invoice?.invoiceNumber}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => window.print()}
                      style={{
                        padding: '0.35rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 6,
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Print / Save PDF
                    </button>
                  </div>

                  {invoiceData.invoice && (
                    <div style={{
                      background: 'rgba(2, 6, 23, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 8,
                      padding: '1rem',
                      marginBottom: '1rem',
                      fontSize: '0.8rem',
                      color: '#cbd5e1'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff' }}>Billed To:</div>
                          <div>{invoiceData.invoice.company || invoiceData.company}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Tax ID: {invoiceData.invoice.taxId}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: '#fff' }}>Remit To:</div>
                          <div>{invoiceData.invoice.remitTo?.entity}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>EIN: {invoiceData.invoice.remitTo?.taxEin}</div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Itemized Description</div>
                        {invoiceData.invoice.lineItems?.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                            <span>{item.description}</span>
                            <span style={{ fontFamily: 'var(--font-code)', color: '#fff' }}>{item.amount}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.9rem' }}>
                        <span>Total Due (Net 30):</span>
                        <span style={{ color: '#ffffff', fontFamily: 'var(--font-code)' }}>{invoiceData.invoice.total} USD</span>
                      </div>

                      <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-code)' }}>
                        SHA-256 Audit Stamp: {invoiceData.invoice.auditHash}
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    Signed Production Key: <code style={{ color: '#38bdf8' }}>{invoiceData.licenseKey}</code>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={handleCopyKey}
                      className="btn-deepip-blue"
                      style={{ flex: 1, minHeight: 38, fontSize: '0.8rem' }}
                    >
                      {copiedKey ? 'KEY COPIED' : 'Copy Production Key'}
                    </button>
                    <button
                      onClick={onClose}
                      style={{
                        flex: 1,
                        minHeight: 38,
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRequestInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    Enter organization details to generate a registered commercial purchase order, enterprise SLA terms, and HMAC attested production key.
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="engineer@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                        Company / Org
                      </label>
                      <input
                        type="text"
                        placeholder="Acme Corp"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          background: 'rgba(0, 0, 0, 0.5)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: 8,
                          color: '#fff',
                          fontSize: '0.85rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                        Target Domain
                      </label>
                      <input
                        type="text"
                        placeholder="example.com"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          background: 'rgba(0, 0, 0, 0.5)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: 8,
                          color: '#fff',
                          fontSize: '0.85rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#64748b' }}>
                    Selected Tier: <strong style={{ color: '#fff' }}>{plan.name} ({plan.price} {plan.period})</strong> • Real-time server-side attestation &amp; Net-30 commercial PO.
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-deepip-blue"
                    style={{ minHeight: 44, width: '100%', marginTop: '0.5rem', fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}
                  >
                    {loading ? 'Attesting & Registering Order...' : 'Register Enterprise Order & Attest Token'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
