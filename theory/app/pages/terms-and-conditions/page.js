import Link from "next/link";
import { 
  FileText, 
  CheckCircle2, 
  Globe, 
  ShoppingBag, 
  Tag, 
  CreditCard, 
  AlertTriangle, 
  Award, 
  Scale, 
  Mail, 
  Phone, 
  ArrowLeft,
  ChevronRight
} from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | Terms of Service | The Cozy Theory",
  description: "Terms and conditions and terms of service governing access, orders, and usage of thecozytheory.in.",
};

export default function TermsAndConditionsPage() {
  const sections = [
    {
      id: "general-conditions",
      number: "1",
      title: "General Conditions",
      icon: CheckCircle2,
      content: (
        <div className="space-y-3 text-neutral-700 leading-relaxed">
          <p>
            <strong className="text-neutral-900 font-semibold">thecozytheory.in</strong> reserves the right to refuse service to anyone for any reason at any time.
          </p>
          <p>
            We may modify these terms without prior notice. It is your responsibility to review this page periodically for changes.
          </p>
          <p>
            Your continued use of the website following any changes constitutes your acceptance of the new terms.
          </p>
        </div>
      )
    },
    {
      id: "use-of-website",
      number: "2",
      title: "Use of Our Website",
      icon: Globe,
      content: (
        <div className="space-y-3 text-neutral-700 leading-relaxed">
          <p>
            By using <strong className="text-neutral-900 font-semibold">thecozytheory.in</strong>, you agree to:
          </p>
          <ul className="space-y-2 list-none pl-0">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#001540] mt-2 shrink-0"></span>
              <span>Use the site for lawful purposes only.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#001540] mt-2 shrink-0"></span>
              <span>Provide accurate and truthful information when required, such as when placing orders or creating an account.</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: "product-information",
      number: "3",
      title: "Product Information",
      icon: ShoppingBag,
      content: (
        <div className="space-y-3 text-neutral-700 leading-relaxed">
          <p>
            We make every effort to display the colors and details of our products accurately. However, we cannot guarantee that your device’s display of any color will be accurate.
          </p>
          <p>
            All descriptions, pricing, and availability are subject to change without notice.
          </p>
          <p>
            We reserve the right to discontinue any product at any time.
          </p>
        </div>
      )
    },
    {
      id: "pricing",
      number: "4",
      title: "Pricing",
      icon: Tag,
      content: (
        <div className="space-y-3 text-neutral-700 leading-relaxed">
          <p>
            All prices on our website are in INR (₹) and are subject to change without prior notice.
          </p>
          <p>
            Any applicable taxes or duties will be added at checkout.
          </p>
        </div>
      )
    },
    {
      id: "payment",
      number: "5",
      title: "Payment",
      icon: CreditCard,
      content: (
        <div className="space-y-3 text-neutral-700 leading-relaxed">
          <p>
            We accept payments through secure gateways like Razorpay and PhonePe.
          </p>
          <p>
            You must provide accurate and complete payment information when making a purchase.
          </p>
          <p>
            By completing your transaction, you authorize <strong className="text-neutral-900 font-semibold">thecozytheory.in</strong> to charge the applicable amount for the product and any additional charges, such as shipping fees.
          </p>
        </div>
      )
    },
    {
      id: "limitation-of-liability",
      number: "6",
      title: "Limitation of Liability",
      icon: AlertTriangle,
      content: (
        <div className="space-y-3 text-neutral-700 leading-relaxed">
          <p>
            <strong className="text-neutral-900 font-semibold">thecozytheory.in</strong> is not liable for any direct, indirect, incidental, or consequential damages resulting from your use of the site, products purchased, or any content, including errors or omissions.
          </p>
          <p>
            Our total liability in connection with any purchase shall not exceed the price paid for the product in question.
          </p>
        </div>
      )
    },
    {
      id: "intellectual-property",
      number: "7",
      title: "Intellectual Property",
      icon: Award,
      content: (
        <div className="space-y-3 text-neutral-700 leading-relaxed">
          <p>
            All content on this website, including text, graphics, logos, and images, is the intellectual property of <strong className="text-neutral-900 font-semibold">thecozytheory.in</strong> and is protected by copyright and trademark laws.
          </p>
          <p>
            You may not use, reproduce, or distribute any content from this site without our prior written consent.
          </p>
        </div>
      )
    },
    {
      id: "governing-law",
      number: "8",
      title: "Governing Law and Dispute Resolution",
      icon: Scale,
      content: (
        <div className="space-y-3 text-neutral-700 leading-relaxed">
          <p>
            Any disputes arising from your use of this site or products purchased shall be governed by the laws of Kerala, India.
          </p>
          <p>
            All disputes shall be subject to the exclusive jurisdiction of the High Court of Kerala.
          </p>
        </div>
      )
    },
    {
      id: "contact-queries",
      number: "9",
      title: "Contact & Queries",
      icon: Mail,
      content: (
        <div className="space-y-4 text-neutral-700 leading-relaxed">
          <p>
            For any queries regarding our Terms and Conditions, please contact us:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <a 
              href="mailto:thecozytheory.store@gmail.com"
              className="flex items-center gap-3 p-3.5 rounded-sm border border-[#e5e3dc] bg-white hover:border-[#001540] hover:shadow-xs transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#001540] flex items-center justify-center shrink-0 group-hover:bg-[#001540] group-hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Email Us</div>
                <div className="text-xs sm:text-sm font-medium text-neutral-900 truncate">thecozytheory.store@gmail.com</div>
              </div>
            </a>
            <a 
              href="tel:7558085343"
              className="flex items-center gap-3 p-3.5 rounded-sm border border-[#e5e3dc] bg-white hover:border-[#001540] hover:shadow-xs transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#001540] flex items-center justify-center shrink-0 group-hover:bg-[#001540] group-hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Phone Support</div>
                <div className="text-xs sm:text-sm font-medium text-neutral-900 font-mono">7558085343</div>
              </div>
            </a>
          </div>
        </div>
      )
    },
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
            <span className="text-[#001540] font-bold">Legal</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-[#e5e3dc] bg-[#faf8f2]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center px-2.5 py-1 bg-white border border-[#e5e3dc] text-[10px] font-mono uppercase tracking-[0.2em] text-[#001540] font-semibold">
              Legal & Operating Agreement
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#121212]">
              Terms and Conditions
            </h1>
            <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-neutral-500">
              Terms of Service • Last Updated: September 2026
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Left Sidebar Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-6 p-6 bg-white border border-[#e5e3dc] shadow-xs">
              <div className="space-y-1 pb-4 border-b border-[#e5e3dc]">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#001540] font-bold">
                  Quick Navigation
                </div>
                <div className="text-sm font-bold uppercase tracking-tight text-[#121212]">
                  Document Sections
                </div>
              </div>
              <nav className="space-y-1.5 text-xs font-mono">
                <a 
                  href="#introduction" 
                  className="flex items-center justify-between p-2 text-neutral-600 hover:text-[#001540] hover:bg-neutral-50 rounded transition-colors"
                >
                  <span>Introduction</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </a>
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center justify-between p-2 text-neutral-600 hover:text-[#001540] hover:bg-neutral-50 rounded transition-colors"
                  >
                    <span className="truncate">{sec.number}. {sec.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
                  </a>
                ))}
              </nav>

              {/* Direct Help Widget */}
              <div className="pt-4 border-t border-[#e5e3dc] space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  Need Assistance?
                </div>
                <a 
                  href="mailto:thecozytheory.store@gmail.com" 
                  className="text-xs text-neutral-800 hover:text-[#001540] font-medium block truncate"
                >
                  thecozytheory.store@gmail.com
                </a>
                <div className="text-xs font-mono text-neutral-600">
                  +91 7558085343
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Introduction Card */}
            <section 
              id="introduction" 
              className="p-6 sm:p-8 bg-white border border-[#e5e3dc] shadow-xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-900 flex items-center justify-center font-mono font-bold text-xs">
                  <FileText className="w-4 h-4 text-[#001540]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    Preamble
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#121212]">
                    Introduction
                  </h2>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed pt-2 border-t border-neutral-100 space-y-3">
                <p>
                  Welcome to <strong className="text-neutral-900 font-semibold">thecozytheory.in</strong>. By accessing and using this website, you agree to the following terms and conditions. Please read them carefully before using the site or making any purchases.
                </p>
                <div className="p-3.5 bg-[#faf8f2] border-l-2 border-[#001540] text-neutral-800 text-xs sm:text-sm">
                  If you do not agree with these terms, you may not use this website.
                </div>
              </div>
            </section>

            {/* Numbered Sections 1 to 9 */}
            <div className="space-y-6">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <section 
                    key={section.id} 
                    id={section.id}
                    className="p-6 sm:p-8 bg-white border border-[#e5e3dc] shadow-xs space-y-4 scroll-mt-24 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {section.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                          Clause {section.number}
                        </span>
                        <h2 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#121212] truncate">
                          {section.title}
                        </h2>
                      </div>
                      <IconComponent className="w-4 h-4 text-neutral-400 shrink-0 hidden sm:block" />
                    </div>

                    <div className="text-xs sm:text-sm pt-1">
                      {section.content}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Bottom Guarantee Banner */}
            <div className="p-6 sm:p-8 bg-[#121212] text-[#fffdf8] border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
                The Cozy Theory Assurance
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight">
                Authentic Craftsmanship, Transparent Principles
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl font-normal">
                Every homeware and ceramic object in our collection is curated with integrity. Should you have any concerns regarding your orders, specifications, or rights, our customer care team is available to assist you promptly.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
                <Link 
                  href="/pages/contact" 
                  className="px-4 py-2.5 bg-[#001540] text-white hover:bg-[#002266] transition-colors uppercase font-bold text-[11px] tracking-wider"
                >
                  Contact Us
                </Link>
                <Link 
                  href="/pages/faq" 
                  className="px-4 py-2.5 bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700 transition-colors uppercase font-bold text-[11px] tracking-wider"
                >
                  Read FAQs
                </Link>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
