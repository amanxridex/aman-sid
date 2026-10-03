export const metadata = {
  title: "Pricing Policy | The Cozy Theory",
  description: "Clear and transparent pricing policy for all The Cozy Theory objects.",
};

export default function PricingPolicyPage() {
  return (
    <div className="bg-[#fffdf8] min-h-screen py-12 md:py-20">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 space-y-8">
        
        <div className="space-y-2 pb-6 border-b border-[#e5e3dc]">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            Transparency
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-[#121212]">
            Pricing Policy
          </h1>
        </div>

        <div className="text-xs md:text-sm leading-relaxed space-y-6 text-neutral-800">
          <section className="space-y-2">
            <h2 className="text-base font-bold uppercase tracking-wider text-[#121212]">
              All-Inclusive Domestic Pricing
            </h2>
            <p>
              All prices displayed across The Cozy Theory website for deliveries within India are inclusive of all applicable Goods and Services Taxes (GST). What you see is what you pay.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold uppercase tracking-wider text-[#121212]">
              International Currencies
            </h2>
            <p>
              For international visitors, prices can be displayed in your local currency. Final checkout is processed transparently according to live forex rates without hidden studio surcharges.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
