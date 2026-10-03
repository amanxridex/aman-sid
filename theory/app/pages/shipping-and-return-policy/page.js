import Link from "next/link";
import { 
  Truck, 
  MapPin, 
  Scale, 
  Clock, 
  Package, 
  Building2, 
  Zap, 
  Compass, 
  XCircle, 
  CornerDownLeft, 
  AlertTriangle, 
  ArrowLeft,
  MessageCircle,
  Mail,
  Phone
} from "lucide-react";

export const metadata = {
  title: "Shipping and Return Policy | The Cozy Theory",
  description: "Domestic India shipping rates, transit times, exchange policy, and RTO guidelines by The Cozy Theory.",
};

export default function ShippingAndReturnPolicyPage() {
  const deliveryZones = [
    {
      region: "South India",
      days: "Within 6 days",
      highlight: "Fastest Transit",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200"
    },
    {
      region: "North & North West India",
      days: "Within 10 days",
      highlight: "Standard Transit",
      color: "text-blue-700 bg-blue-50 border-blue-200"
    },
    {
      region: "North East India",
      days: "Within 12 days",
      highlight: "Extended Transit",
      color: "text-neutral-700 bg-neutral-100 border-neutral-200"
    }
  ];

  const policyItems = [
    {
      id: "delivery-area",
      title: "Delivery Area",
      icon: MapPin,
      desc: "We ship throughout India. International shipping is not available at this moment.",
      badge: "Domestic Only"
    },
    {
      id: "courier-charges",
      title: "Courier Charges",
      icon: Scale,
      desc: "Shipping costs are calculated automatically based on the cumulative weight of your parcel (Up to 1 kg: ₹99, 1–2.5 kg: ₹149, 2.5–5 kg: ₹199). All orders above ₹2,999 enjoy 100% FREE Standard Shipping across India.",
      badge: "Tiered Weight Rate"
    },
    {
      id: "processing-time",
      title: "Processing Time",
      icon: Clock,
      desc: "All orders will be carefully inspected, securely boxed, processed, and shipped within 2-4 working days.",
      badge: "2-4 Working Days"
    },
    {
      id: "shipping-carriers",
      title: "Shipping Carriers",
      icon: Truck,
      desc: "All shipments are managed and delivered through trusted third-party logistics and shipping agencies across India.",
      badge: "Third-Party Logistics"
    },
    {
      id: "immediate-shipments",
      title: "Immediate Shipments",
      icon: Zap,
      desc: "For expedited or emergency shipping requests, please reach out to us directly via WhatsApp or our designated contact channels so our dispatch team can prioritize your parcel.",
      badge: "Expedited Service"
    },
    {
      id: "tracking",
      title: "Live Tracking",
      icon: Compass,
      desc: "Tracking information and live parcel tracking links will be promptly provided via SMS/Email once the order has shipped.",
      badge: "Live Status"
    },
    {
      id: "exchange-policy",
      title: "Exchange Policy",
      icon: XCircle,
      desc: "Please note that we do not offer exchanges on any homeware or ceramic items. Please refer to our Refund Policy for damaged goods.",
      badge: "No Exchanges"
    },
    {
      id: "rto-policy",
      title: "Return To Office (RTO)",
      icon: CornerDownLeft,
      desc: "In case of RTO from the customer’s end, the refund can be claimed. However, this refund would be processed after deduction of shipping and packaging charges. In case the customer wants a new attempt for the parcel to be delivered, then standard shipping charges will be applicable.",
      badge: "Fee Deduction / Reship"
    }
  ];

  return (
    <div className="bg-[#fffdf8] min-h-screen text-[#121212]">
      {/* Top Breadcrumb & Badge */}
      <div className="border-b border-[#e5e3dc] bg-[#fffdf8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 hover:text-[#001540] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            <span>thecozytheory.in</span>
            <span>•</span>
            <span className="text-[#001540] font-bold">Logistics</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="border-b border-[#e5e3dc] bg-[#faf8f2]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center px-2.5 py-1 bg-white border border-[#e5e3dc] text-[10px] font-mono uppercase tracking-[0.2em] text-[#001540] font-semibold">
              Delivery Timelines & Operational Terms
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#121212]">
              Shipping & Return Policy
            </h1>
            <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-neutral-500">
              Domestic Delivery Throughout India • Processing, Estimates & RTO Guidelines
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* Left Quick Overview (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-6 p-6 bg-white border border-[#e5e3dc] shadow-xs">
              <div className="space-y-1 pb-4 border-b border-[#e5e3dc]">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#001540] font-bold">
                  Quick Summary
                </div>
                <div className="text-sm font-bold uppercase tracking-tight text-[#121212]">
                  Key Logistics Facts
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#001540] mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold">India-Wide Coverage</strong>
                    <span className="text-neutral-500">No international shipping available.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#001540] mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold">2-4 Days Dispatch</strong>
                    <span className="text-neutral-500">Packaged with break-resistant protection.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold">No Exchanges</strong>
                    <span className="text-neutral-500">50% refund offered on transit damages.</span>
                  </div>
                </div>
              </div>

              {/* Expedited WhatsApp Dispatch */}
              <div className="pt-4 border-t border-[#e5e3dc] space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  Immediate Dispatch Inquiry
                </div>
                <a 
                  href="https://wa.me/917558085343" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs text-neutral-900 hover:text-[#001540] font-medium"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp: +91 7558085343</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Main Column */}
          <main className="lg:col-span-8 space-y-8">

            {/* Estimated Delivery Times Grid */}
            <section className="p-6 sm:p-8 bg-white border border-[#e5e3dc] shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-full bg-[#001540]/10 text-[#001540] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    Transit Schedules
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#121212]">
                    Estimated Delivery Times
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                Orders are processed and dispatched within <strong>2-4 working days</strong>. Once shipped, regional transit times are as follows:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {deliveryZones.map((zone) => (
                  <div 
                    key={zone.region}
                    className={`p-4 rounded-sm border ${zone.color} space-y-1.5`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider block font-semibold opacity-75">
                      {zone.highlight}
                    </span>
                    <h3 className="text-xs font-bold uppercase text-neutral-900">
                      {zone.region}
                    </h3>
                    <div className="text-base font-extrabold text-neutral-900 font-mono">
                      {zone.days}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Core Policy Clauses Grid */}
            <section className="p-6 sm:p-8 bg-white border border-[#e5e3dc] shadow-xs space-y-6">
              <div className="pb-3 border-b border-neutral-100">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                  Detailed Clauses
                </span>
                <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#121212]">
                  Shipping Terms & Conditions
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {policyItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.id}
                      className="p-4 rounded-sm border border-[#e5e3dc] bg-[#fffdf8] hover:border-[#001540] transition-colors space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5 text-[#001540]" />
                            </div>
                            <h3 className="text-xs sm:text-sm font-bold uppercase text-neutral-900">
                              {item.title}
                            </h3>
                          </div>
                          <span className="text-[9px] font-mono text-[#001540] bg-blue-50 px-2 py-0.5 rounded-sm font-semibold uppercase">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Please Note - Critical Conditions Card */}
            <section className="p-6 sm:p-8 bg-[#fffaf0] border border-[#f0d8a8] shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#f0d8a8]">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-bold block">
                    Important Notice
                  </span>
                  <h2 className="text-base sm:text-lg font-bold uppercase tracking-tight text-neutral-900">
                    *Please Note* — Failed Deliveries & Address Accuracy
                  </h2>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-neutral-800 leading-relaxed space-y-3">
                <p>
                  We are unable to offer refunds if we’ve been given an <strong>incorrect or incomplete shipping address</strong>, or if there are <strong>three failed delivery attempts</strong> by our shipping agency, or if the recipient refuses the package.
                </p>
                <div className="p-3 bg-white border border-[#f0d8a8] rounded-xs font-medium text-xs text-neutral-900">
                  ✓ We would be happy to reship the package if the customer bears the applicable reshipment shipping fee.
                </div>
              </div>
            </section>

            {/* Immediate Shipments & Contact Banner */}
            <div className="p-6 sm:p-8 bg-[#121212] text-[#fffdf8] border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
                <Zap className="w-3.5 h-3.5" />
                Urgent & Immediate Shipments
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight">
                Need Expedited or Custom Delivery?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl font-normal">
                For urgent gifting, events, or immediate shipment requests, please contact us directly via WhatsApp or phone before placing your order so we can arrange courier priority for you.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a 
                  href="https://wa.me/917558085343"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white hover:bg-emerald-500 transition-colors uppercase font-bold text-xs tracking-wider"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Priority Desk</span>
                </a>
                <a 
                  href="mailto:thecozytheory.store@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700 transition-colors uppercase font-bold text-xs tracking-wider"
                >
                  <Mail className="w-4 h-4" />
                  <span>thecozytheory.store@gmail.com</span>
                </a>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
