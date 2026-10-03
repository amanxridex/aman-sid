"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, Package } from "lucide-react";
import { getCustomerByPhone, getOrdersByPhone } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const clean = phone.trim().replace(/\D/g, "");
    if (clean.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch customer and orders linked to this phone
      const [customer, orders] = await Promise.all([
        getCustomerByPhone(clean),
        getOrdersByPhone(clean),
      ]);

      if ((!customer && (!orders || orders.length === 0))) {
        setErrorMsg(
          `No orders or account found for mobile number +91 ${clean}. Accounts are automatically created when placing your first order. Please check the number or place an order at checkout.`
        );
        setLoading(false);
        return;
      }

      // Customer or orders found! Set session in localStorage
      const sessionUser = customer || {
        id: "cust-" + clean,
        name: orders[0]?.customer_name || "Collector",
        email: orders[0]?.customer_email || "",
        phone: clean,
        city: orders[0]?.shipping_address?.city || "India",
        orders_count: orders.length,
        total_spent: orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0),
      };

      localStorage.setItem("cozy_user", JSON.stringify(sessionUser));
      setLoading(false);
      router.push("/account");
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Unable to access account. Please verify your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fffdf8] min-h-[85vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white border border-[#e5e3dc] p-8 md:p-10 shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#f7f5ef] flex items-center justify-center mx-auto border border-[#e5e3dc] text-neutral-800">
            <Phone className="w-6 h-6 text-[#001540]" />
          </div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#001540] uppercase font-bold block">
            Collector Verification
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#121212]">
            Account Login
          </h1>
          <p className="text-xs font-mono text-neutral-500 leading-relaxed max-w-xs mx-auto">
            Enter your mobile number used during checkout to view your order history and live dispatch status.
          </p>
        </div>

        {/* Informative Auto-Account Banner */}
        <div className="p-3.5 bg-[#f7f5ef] border border-[#e5e3dc] text-[11px] font-mono text-neutral-600 space-y-1">
          <div className="font-bold text-neutral-800 uppercase tracking-wider">
            Seamless Instant Access
          </div>
          <p>
            No password needed. Your account was automatically created when you placed your order.
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handlePhoneLogin} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase text-neutral-700 block mb-1.5 font-bold">
              Mobile Phone Number *
            </label>
            <div className="flex items-center border border-[#e5e3dc] bg-white focus-within:border-black transition-colors">
              <span className="px-3 py-3 bg-[#f7f5ef] text-xs font-mono text-neutral-600 border-r border-[#e5e3dc] select-none font-bold">
                +91
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98200 12345"
                className="w-full p-3 text-xs font-mono focus:outline-none bg-transparent"
                autoFocus
              />
            </div>
            <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
              Enter the 10-digit mobile number from your order
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || phone.trim().length === 0}
            className="w-full py-4 bg-[#121212] text-[#fffdf8] text-xs font-mono font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Fetching Orders from Database...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>View My Orders & Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </button>
        </form>

        {/* Footnote */}
        <div className="pt-4 border-t border-[#e5e3dc] flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <Link href="/" className="underline hover:text-black">
            ← Return to Store
          </Link>
          <Link href="/collections/all-products" className="underline hover:text-black">
            Explore Objects
          </Link>
        </div>

      </div>
    </div>
  );
}
