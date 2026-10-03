import Link from "next/link";
import { 
  Video, 
  PackageX, 
  Clock, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck2,
  RefreshCw,
  Gift
} from "lucide-react";

export const metadata = {
  title: "Refund Policy | The Cozy Theory",
  description: "Information regarding our 50% damage refund, opening video guidelines, and missing item claims at The Cozy Theory.",
};

export default function RefundPolicyPage() {
  const steps = [
    {
      num: "01",
      title: "Record the Opening Video",
      desc: "Ensure the video clearly captures the package being opened and the full condition of the contents upon arrival. The video must be continuous and unedited to accurately represent the condition of the package and its contents.",
      icon: Video,
      badge: "Mandatory Requirement"
    },
    {
      num: "02",
      title: "Submit the Video via Email",
      desc: "Email the unedited video to our customer care team at thecozytheory.store@gmail.com within 48 hours of receiving your delivery. Please mention your Order ID in the email subject.",
      icon: Mail,
      badge: "Within 48 Hours"
    },
    {
      num: "03",
      title: "Review & Fast Payout",
      desc: "Once our support team reviews your unboxing footage, we will approve and process your 50% refund within 3 business days and send you an official payout confirmation.",
      icon: Clock,
      badge: "Processed in 3 Days"
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
            <span className="text-[#001540] font-bold">Policy</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-[#e5e3dc] bg-[#faf8f2]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center px-2.5 py-1 bg-white border border-[#e5e3dc] text-[10px] font-mono uppercase tracking-[0.2em] text-[#001540] font-semibold">
              Customer Protection & Guarantee
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#121212]">
              Refund Policy
            </h1>
            <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-neutral-500">
              Clear & Transparent Claims • 50% Damage Protection
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* Left Sticky Summary (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-6 p-6 bg-white border border-[#e5e3dc] shadow-xs">
              <div className="space-y-1 pb-4 border-b border-[#e5e3dc]">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#001540] font-bold">
                  At A Glance
                </div>
                <div className="text-sm font-bold uppercase tracking-tight text-[#121212]">
                  The Cozy Theory Promise
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-neutral-900 font-semibold">50% Damage Refund</strong>
                    <span className="text-neutral-500">Claimable with an unboxing video.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-[#001540] flex items-center justify-center shrink-0 mt-0.5">
                    <PackageX className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-neutral-900 font-semibold">No Returns Required</strong>
                    <span className="text-neutral-500">Keep or discard damaged pieces safely.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-neutral-900 font-semibold">48hr Claim Window</strong>
                    <span className="text-neutral-500">Send unboxing video within 48 hours.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-neutral-900 font-semibold">3-Day Fast Payout</strong>
                    <span className="text-neutral-500">Processed quickly post-review.</span>
                  </div>
                </div>
              </div>

              {/* Direct Help Widget */}
              <div className="pt-4 border-t border-[#e5e3dc] space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  Submit Claims To
                </div>
                <a 
                  href="mailto:thecozytheory.store@gmail.com" 
                  className="text-xs text-neutral-900 hover:text-[#001540] font-medium block truncate"
                >
                  thecozytheory.store@gmail.com
                </a>
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Introduction Card */}
            <section className="p-6 sm:p-8 bg-white border border-[#e5e3dc] shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-full bg-[#001540]/10 text-[#001540] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    Overview
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#121212]">
                    Our Refund Commitment
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                We offer the following refund options based on the submission of an opening video of your order:
              </p>

              {/* Primary 50% Refund Guarantee Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 sm:p-5 bg-[#faf8f2] border border-[#e5e3dc] space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#001540] font-bold">
                    <Video className="w-3.5 h-3.5" />
                    50% Refund with Opening Video
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    To receive a refund, please provide a video showing the complete process of opening the package. The video should clearly display the condition and contents of the package.
                  </p>
                </div>

                <div className="p-4 sm:p-5 bg-[#faf8f2] border border-[#e5e3dc] space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                    <PackageX className="w-3.5 h-3.5" />
                    Zero Return of Damaged Product
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    No return of the damaged product is expected from the customer, regardless of whether the damage occurred during transit or for any other reason.
                  </p>
                </div>
              </div>
            </section>

            {/* Steps to Request a Refund */}
            <section className="p-6 sm:p-8 bg-white border border-[#e5e3dc] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    <FileCheck2 className="w-4 h-4 text-neutral-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                      Step-by-Step Guide
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#121212]">
                      Steps to Request a Refund
                    </h2>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-100 text-neutral-600 hidden sm:inline-block">
                  3 Easy Steps
                </span>
              </div>

              <div className="space-y-4">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div 
                      key={step.num}
                      className="p-4 sm:p-5 rounded-sm border border-[#e5e3dc] bg-[#fffdf8] hover:border-[#001540] transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-mono font-bold">
                            {step.num}
                          </span>
                          <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900">
                            {step.title}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#001540] bg-blue-50 px-2 py-0.5 rounded-sm font-medium">
                          {step.badge}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed pl-8">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Missing Item Section */}
            <section className="p-6 sm:p-8 bg-white border border-[#e5e3dc] shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    Special Case
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#121212]">
                    Missing Item Policy
                  </h2>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                <p>
                  In case of a missing item from your order, you have two flexible resolution options:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 bg-[#faf8f2] border border-[#e5e3dc] space-y-1.5">
                    <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#001540]"></span>
                      Option A: Standard Refund
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Claim a refund using the exact same procedure as for a damaged product by providing your unboxing video.
                    </p>
                  </div>

                  <div className="p-4 bg-[#faf8f2] border border-[#e5e3dc] space-y-1.5">
                    <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Option B: With Next Order
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Alternatively, choose to receive the missing item dispatched complimentary alongside your next order.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Questions & Contact Banner */}
            <div className="p-6 sm:p-8 bg-[#121212] text-[#fffdf8] border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
                Customer Care & Queries
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight">
                Have Any Questions About Our Refund Policy?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl font-normal">
                If you have any questions about our refund policy or need assistance with an unboxing video submission, please reach out directly to our dedicated customer support desk:
              </p>
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a 
                  href="mailto:thecozytheory.store@gmail.com"
                  className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#001540] text-white hover:bg-[#002266] transition-colors uppercase font-bold text-xs tracking-wider"
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
