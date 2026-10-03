"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, PackageCheck, ArrowRight, Home } from "lucide-react";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "TCT-981245";
  const amount = searchParams.get("amount") || "2,800.00";

  return (
    <div className="bg-[#fffdf8] min-h-screen py-16 md:py-24">
      <div className="max-w-[800px] mx-auto px-4 md:px-8 text-center space-y-8">
        
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
            Order Confirmed // {orderId}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#121212]">
            Thank You For Your Order
          </h1>
          <p className="text-xs md:text-sm font-mono text-neutral-700 max-w-lg mx-auto bg-amber-50/70 border border-amber-200/80 p-3 rounded-sm leading-relaxed">
            Order placed! You&apos;ll get a dispatch message as order leaves our house to reach your house.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-6 md:p-8 bg-[#f7f5ef] border border-[#e5e3dc] text-left space-y-4 font-mono text-xs max-w-lg mx-auto">
          <div className="flex justify-between items-center pb-3 border-b border-[#e5e3dc]">
            <span className="text-neutral-500">Order Reference:</span>
            <span className="font-bold text-black">{orderId}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-[#e5e3dc]">
            <span className="text-neutral-500">Payment Mode:</span>
            <span className="font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 border border-emerald-300">
              Paid Online (Razorpay / PhonePe / UPI)
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-[#e5e3dc]">
            <span className="text-neutral-500">Total Amount Paid:</span>
            <span className="font-bold text-black">Rs. {Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-[#e5e3dc]">
            <span className="text-neutral-500">Estimated Dispatch:</span>
            <span className="font-bold text-black">Within 24-48 Hours</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Tracking:</span>
            <span className="text-emerald-700 font-bold">Standard Courier Assigned (BlueDart / Delhivery)</span>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#121212] text-[#fffdf8] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Store</span>
          </Link>
          <Link
            href="/collections/all-products"
            className="w-full sm:w-auto px-8 py-3.5 border border-[#121212] text-[#121212] text-xs font-mono uppercase tracking-widest hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Browsing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-mono">Loading Order...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
