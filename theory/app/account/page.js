"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  LogOut,
  Phone,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { getOrdersByPhone, getCustomerByPhone } from "@/lib/supabase";

export default function AccountDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Phone login form state (if not logged in)
  const [loginPhone, setLoginPhone] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const loadCustomerData = useCallback(async (phoneUser) => {
    setLoadingOrders(true);
    try {
      const cleanPhone = String(phoneUser.phone || "").replace(/\D/g, "");
      const [dbOrders, dbCust] = await Promise.all([
        getOrdersByPhone(cleanPhone),
        getCustomerByPhone(cleanPhone),
      ]);

      setOrders(dbOrders || []);
      if (dbCust) {
        setUser((prev) => ({ ...prev, ...dbCust }));
      }
    } catch (err) {
      console.error("Error loading customer data:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cozy_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        loadCustomerData(parsed);
      } else {
        setLoadingOrders(false);
      }
    } catch (e) {
      console.error(e);
      setLoadingOrders(false);
    }
  }, [loadCustomerData]);

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    const clean = loginPhone.trim().replace(/\D/g, "");
    if (clean.length < 10) {
      setLoginError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoginLoading(true);

    try {
      const [customer, fetchedOrders] = await Promise.all([
        getCustomerByPhone(clean),
        getOrdersByPhone(clean),
      ]);

      if (!customer && (!fetchedOrders || fetchedOrders.length === 0)) {
        setLoginError(
          `No orders or account found for +91 ${clean}. Please check the number used during checkout.`
        );
        setLoginLoading(false);
        return;
      }

      const sessionUser = customer || {
        id: "cust-" + clean,
        name: fetchedOrders[0]?.customer_name || "Collector",
        email: fetchedOrders[0]?.customer_email || "",
        phone: clean,
        city: fetchedOrders[0]?.shipping_address?.city || "India",
        orders_count: fetchedOrders.length,
        total_spent: fetchedOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0),
      };

      localStorage.setItem("cozy_user", JSON.stringify(sessionUser));
      setUser(sessionUser);
      setOrders(fetchedOrders || []);
      setLoginLoading(false);
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Failed to fetch account. Please try again.");
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cozy_user");
    setUser(null);
    setOrders([]);
  };

  // If user is not logged in, show the phone number login view
  if (!user) {
    return (
      <div className="bg-[#fffdf8] min-h-[85vh] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white border border-[#e5e3dc] p-8 md:p-10 shadow-lg space-y-8">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#f7f5ef] flex items-center justify-center mx-auto border border-[#e5e3dc] text-neutral-800">
              <Phone className="w-6 h-6 text-[#001540]" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#001540] uppercase font-bold block">
              Collector Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#121212]">
              View Order History
            </h1>
            <p className="text-xs font-mono text-neutral-500 leading-relaxed max-w-xs mx-auto">
              Enter your mobile phone number to retrieve your orders and delivery status.
            </p>
          </div>

          <div className="p-3.5 bg-[#f7f5ef] border border-[#e5e3dc] text-[11px] font-mono text-neutral-600 space-y-1">
            <div className="font-bold text-neutral-800 uppercase tracking-wider">
              Instant Order Access
            </div>
            <p>
              Your account was created automatically on your first order. No password required.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono leading-relaxed">
              {loginError}
            </div>
          )}

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
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="98200 12345"
                  className="w-full p-3 text-xs font-mono focus:outline-none bg-transparent"
                  autoFocus
                />
              </div>
              <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                Enter the mobile number provided during checkout
              </span>
            </div>

            <button
              type="submit"
              disabled={loginLoading || loginPhone.trim().length === 0}
              className="w-full py-4 bg-[#121212] text-[#fffdf8] text-xs font-mono font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Fetching Orders from Database...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Fetch My Account & Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#e5e3dc] flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <Link href="/" className="underline hover:text-black">
              ← Return to Store
            </Link>
            <Link href="/collections/all-products" className="underline hover:text-black">
              Browse Collection
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // User is logged in: show their dashboard and orders
  const totalSpend = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

  return (
    <div className="bg-[#fffdf8] min-h-screen py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-10">
        
        {/* Account Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#e5e3dc] gap-4">
          <div>
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#001540] font-bold block mb-1">
              Collector Portal // Verified Member
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#121212]">
              Welcome, {user.name || "Collector"}
            </h1>
            <p className="text-xs font-mono text-neutral-600 mt-1 flex flex-wrap items-center gap-2">
              <span>+91 {user.phone}</span>
              {user.email && (
                <>
                  <span>•</span>
                  <span>{user.email}</span>
                </>
              )}
              {user.city && (
                <>
                  <span>•</span>
                  <span className="text-neutral-500">{user.city}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-rose-600 transition-colors border border-[#e5e3dc] px-3.5 py-2 bg-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Collector Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-[#e5e3dc] space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Total Orders</span>
            <p className="text-2xl font-bold font-mono text-black">{orders.length}</p>
          </div>
          <div className="p-4 bg-white border border-[#e5e3dc] space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Total Spent</span>
            <p className="text-2xl font-bold font-mono text-black">
              Rs. {totalSpend.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
            </p>
          </div>
          <div className="p-4 bg-white border border-[#e5e3dc] space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Payment Preference</span>
            <p className="text-sm font-bold font-mono text-black uppercase mt-1">UPI / Razorpay / PhonePe</p>
          </div>
          <div className="p-4 bg-white border border-[#e5e3dc] space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Account Status</span>
            <p className="text-sm font-bold font-mono text-emerald-700 uppercase mt-1">Active Collector</p>
          </div>
        </div>

        {/* Main Section: Order History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold uppercase tracking-tight font-sans flex items-center gap-2">
              <Package className="w-5 h-5 text-neutral-700" />
              <span>Order History ({orders.length})</span>
            </h2>
            <Link
              href="/collections/all-products"
              className="text-xs font-mono uppercase underline text-neutral-600 hover:text-black flex items-center gap-1"
            >
              <span>Explore More Objects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingOrders ? (
            <div className="p-12 text-center border border-[#e5e3dc] bg-white font-mono text-xs text-neutral-500">
              <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></span>
              Fetching live orders from database...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center border border-[#e5e3dc] bg-white space-y-4">
              <ShoppingBag className="w-8 h-8 text-neutral-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase">No Orders Found</h3>
                <p className="text-xs font-mono text-neutral-500 max-w-sm mx-auto">
                  We could not locate past orders for mobile number +91 {user.phone}.
                </p>
              </div>
              <Link
                href="/collections/all-products"
                className="inline-block px-6 py-3 bg-[#121212] text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800"
              >
                Start Curating
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const fulfillment = order.fulfillment_status || order.fulfillmentStatus || "Unfulfilled";
                const isDelivered = fulfillment.toLowerCase() === "delivered";
                const isDispatched = fulfillment.toLowerCase() === "dispatched";

                const dateFormatted = order.created_at
                  ? new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Recent Order";

                const items = Array.isArray(order.items) ? order.items : [];

                return (
                  <div
                    key={order.id}
                    className="border border-[#e5e3dc] bg-white divide-y divide-[#e5e3dc] shadow-sm"
                  >
                    {/* Order Top Bar */}
                    <div className="p-5 bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-black text-sm">#{order.id}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 uppercase font-bold border ${
                              isDelivered
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : isDispatched
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : "bg-amber-100 text-amber-900 border-amber-300"
                            }`}
                          >
                            {fulfillment}
                          </span>
                        </div>
                        <p className="text-neutral-500 text-[11px]">Placed on {dateFormatted}</p>
                      </div>

                      <div className="flex sm:flex-col items-start sm:items-end justify-between gap-1">
                        <span className="text-neutral-500 text-[11px]">Order Total:</span>
                        <span className="font-bold text-black text-sm">
                          Rs. {parseFloat(order.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="p-5 divide-y divide-neutral-100">
                      {items.map((item, idx) => (
                        <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-14 h-16 object-cover border border-[#e5e3dc] bg-neutral-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-16 bg-neutral-100 border border-[#e5e3dc] flex items-center justify-center text-neutral-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold uppercase text-[#121212] line-clamp-1">
                              {item.title}
                            </h4>
                            <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                              Quantity: {item.quantity || 1} • Rs. {Number(item.price || 0).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="text-xs font-mono font-bold text-right">
                            Rs. {((item.quantity || 1) * Number(item.price || 0)).toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Actions */}
                    <div className="p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-2 text-neutral-600 text-[11px]">
                        <span>Payment Method:</span>
                        <strong className="text-black">
                          {order.payment_method || "Cash on Delivery (COD)"}
                        </strong>
                        <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 border border-amber-200">
                          {order.payment_status === "paid" ? "Paid" : "Pay on Delivery"}
                        </span>
                      </div>

                      <Link
                        href={`/order-confirmation?order_id=${order.id}&amount=${order.total}&payment=cod`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#001540] hover:underline"
                      >
                        <span>View Order Receipt</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
