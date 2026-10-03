export const metadata = {
  title: "Privacy Policy | The Cozy Theory",
  description: "How The Cozy Theory collects, protects, and handles personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#fffdf8] min-h-screen py-12 md:py-20">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 space-y-8">
        
        <div className="space-y-2 pb-6 border-b border-[#e5e3dc]">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            Privacy & Trust
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-[#121212]">
            Privacy Policy
          </h1>
        </div>

        <div className="text-xs md:text-sm leading-relaxed space-y-6 text-neutral-800">
          <section className="space-y-2">
            <h2 className="text-base font-bold uppercase tracking-wider text-[#121212]">
              1. Information Collection
            </h2>
            <p>
              When you browse our catalog or place an order, we collect personal information you provide such as your name, delivery address, phone number, and email address to fulfill your shipments and notify you of order milestones.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold uppercase tracking-wider text-[#121212]">
              2. Payment Security
            </h2>
            <p>
              Payment data is encrypted using industry-standard 256-bit SSL protocols. We do not store raw card numbers or confidential banking PINs on our servers. All transactions are securely routed through PCI-DSS compliant payment gateways.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold uppercase tracking-wider text-[#121212]">
              3. Consent & Communications
            </h2>
            <p>
              If you opt into our Drop List, we will occasionally send you notifications of new drops and archival releases. You may unsubscribe at any time using the link in the footer of any email.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
