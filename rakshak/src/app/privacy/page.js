import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Rakshak Apparels® — Independent Streetwear & Sports Brand',
  description:
    'Customer privacy policy, encrypted payment processing, and order fulfillment data protection for Rakshak Apparel & Footwear Co.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-[#f1f5f9] font-sans">
      {/* Header */}
      <header className="border-b border-[#1e293b] bg-[#07090e]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-white">
              RAKSHAK<span className="text-[#146ef5]">®</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest bg-[#146ef5]/20 border border-[#146ef5]/50 text-[#38bdf8] px-2 py-0.5 rounded font-mono font-bold">
              APPARELS
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs uppercase tracking-wider font-semibold text-[#94a3b8] hover:text-white transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#146ef5]/10 border border-[#146ef5]/30 text-[#38bdf8] text-xs font-mono uppercase tracking-wider mb-4">
            <span>Customer Privacy & Order Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#94a3b8]">
            Effective Date: September 13, 2026 • Rakshak Apparel & Footwear Co.
          </p>
        </div>

        <div className="bg-[#0e121c] border border-[#1e293b] rounded-2xl p-6 sm:p-10 space-y-8 text-sm text-[#94a3b8] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Our Privacy Commitment</h2>
            <p>
              Rakshak Apparel & Footwear Co. (&quot;Rakshak Apparels&quot;, &quot;we&quot;, &quot;us&quot;) operates the direct-to-consumer storefront at{' '}
              <span className="text-[#38bdf8] font-mono">rakshakus.vercel.app</span>. We prioritize the security of your personal data and adhere strictly to global data protection standards (GDPR, CCPA). We will never sell, rent, or trade your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Information We Collect</h2>
            <p className="mb-2">
              When you browse our catalog or purchase our streetwear and athletic footwear, we collect only the information necessary to fulfill your order:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Contact & Shipping Data</strong>: Full name, delivery address, phone number, and email address for shipment tracking.</li>
              <li><strong>Payment Information</strong>: Processed securely via end-to-end encrypted payment gateways (Stripe, Apple Pay, Google Pay). We never store raw credit card numbers on our servers.</li>
              <li><strong>Order History</strong>: Garment sizing, colorways, quantities, and transaction receipts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. How We Use Your Data</h2>
            <p>
              Your data is exclusively utilized to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300 mt-2">
              <li>Process transactions and arrange white-glove DHL Express international shipping.</li>
              <li>Transmit real-time order tracking and dispatch notifications.</li>
              <li>Handle customer care inquiries, size exchanges, and returns.</li>
              <li>Maintain website performance and shopping bag persistence across sessions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. Payment Security & Data Retention</h2>
            <p>
              All online checkout transactions are fortified with 256-bit SSL encryption. Payment tokenization ensures your credentials are authenticated directly by Tier-1 PCI-DSS compliant financial partners. Shipping details are retained solely for the statutory duration required for tax, accounting, and customs fulfillment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. Your Data Rights</h2>
            <p>
              Under applicable consumer privacy regulations, you retain the right to access, rectify, or request deletion of your order history and personal information at any time by contacting our concierge at{' '}
              <a href="mailto:support@rakshakapparels.com" className="text-[#146ef5] underline">
                support@rakshakapparels.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e293b] py-8 text-center text-xs text-[#64748b]">
        <p>© 2026 Rakshak Apparel & Footwear Co. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

