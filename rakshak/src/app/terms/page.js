import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Rakshak Apparels® — Independent Streetwear & Sports Brand',
  description:
    'Terms of purchase, limited studio drop fulfillment, and 30-day return policies for Rakshak Apparel & Footwear Co.',
};

export default function TermsPage() {
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
            <span>Customer Terms & Studio Policies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Terms of Service & Sale
          </h1>
          <p className="text-sm text-[#94a3b8]">
            Effective Date: September 13, 2026 • Rakshak Apparel & Footwear Co.
          </p>
        </div>

        <div className="bg-[#0e121c] border border-[#1e293b] rounded-2xl p-6 sm:p-10 space-y-8 text-sm text-[#94a3b8] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Scope of Agreement</h2>
            <p>
              By accessing, browsing, or purchasing from Rakshak Apparel & Footwear Co. (&quot;Rakshak Apparels&quot;) via{' '}
              <span className="text-[#38bdf8] font-mono">rakshakus.vercel.app</span>, you agree to comply with and be bound by these Terms of Service. These terms govern all orders for our heavyweight tees, hoodies, and ergonomic Vibram footwear.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Product Availability & Limited Drops</h2>
            <p>
              To maintain textile excellence and prevent deadstock waste, our apparel is produced in limited micro-batches. Items placed in your shopping bag are reserved once checkout is initiated. We reserve the right to limit quantities per customer to prevent unauthorized resale.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Pricing & International Currencies</h2>
            <p>
              All prices are listed in United States Dollars (USD). We accept major international credit cards, Apple Pay, Google Pay, and PayPal. Applicable sales taxes and customs duties are computed transparently during checkout based on your destination country.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. Worldwide Shipping & Fulfillment</h2>
            <p>
              Orders are prepared and dispatched from our logistics centers within 24–48 business hours. We provide complimentary insured courier transit via DHL Express on all orders. Tracking numbers are transmitted via email immediately upon courier handoff.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. 30-Day Returns & Size Exchanges</h2>
            <p>
              We want you to be completely satisfied with your Rakshak garments. Unworn, unwashed merchandise with all original studio tags intact may be returned or exchanged within 30 days of delivery. Return shipping labels can be generated via concierge support at{' '}
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

