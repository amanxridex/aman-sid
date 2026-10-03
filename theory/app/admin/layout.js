"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  BarChart3,
  Tag,
  ExternalLink,
  Menu,
  X,
  Search,
  Plus,
  Home,
  Store,
  FileText,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  MoreHorizontal,
  Settings,
  MessageSquare,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { analytics, orders, inquiries } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");

  // Admin Lock & Security State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    try {
      const stored =
        sessionStorage.getItem("tct_admin_auth") ||
        localStorage.getItem("tct_admin_auth");
      if (stored === "true") {
        setIsAuthenticated(true);
      }
    } catch (e) {
      // localStorage not accessible
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");
    setUnlocking(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem("tct_admin_auth", "true");
          localStorage.setItem("tct_admin_auth", "true");
        } catch (err) {
          // ignore
        }
        setPasscode("");
      } else {
        setErrorMsg(data.error || "Access Denied: Invalid security passcode.");
      }
    } catch (err) {
      setErrorMsg("Authentication error. Please try again.");
    } finally {
      setUnlocking(false);
    }
  };

  const handleLockConsole = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem("tct_admin_auth");
      localStorage.removeItem("tct_admin_auth");
      document.cookie = "tct_admin_auth=; path=/; max-age=0";
    } catch (err) {
      // ignore
    }
  };

  const pendingOrdersCount = orders.filter((o) => o.fulfillmentStatus === "Unfulfilled").length;

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
    },
    {
      title: "Support Inquiries",
      href: "/admin/inquiries",
      icon: MessageSquare,
      badge: (inquiries && inquiries.length > 0) ? inquiries.length : null,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: Package,
      actionHref: "/admin/products/new",
    },
    {
      title: "Categories",
      href: "/admin/collections",
      icon: Layers,
      actionHref: "/admin/collections/new",
    },
    {
      title: "Blog & Journal",
      href: "/admin/blogs",
      icon: FileText,
      actionHref: "/admin/blogs/new",
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      title: "Analytics & Traffic",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Discounts",
      href: "/admin/discounts",
      icon: Tag,
    },
    {
      title: "Brand & Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  // 1. Initial auth check loader
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center font-mono text-xs text-neutral-500">
        Verifying Derick Martin authorization...
      </div>
    );
  }

  // 2. LOCKED SCREEN: Derick Martin Security Passcode Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between p-4 sm:p-8 font-sans antialiased text-[#121212]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#121212] text-white rounded flex items-center justify-center font-black text-xs">
              TCT
            </div>
            <span className="font-extrabold text-sm tracking-tight uppercase">THE COZY THEORY</span>
          </Link>

          <Link
            href="/"
            className="text-xs font-mono uppercase text-neutral-500 hover:text-black transition-colors flex items-center gap-1.5"
          >
            <span>Return to Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Lock Card Container */}
        <div className="w-full max-w-md mx-auto my-8 sm:my-12 bg-white border border-[#e5e3dc] rounded p-6 sm:p-10 shadow-sm space-y-6">
          
          {/* Avatar & Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-[#121212] text-white rounded-full flex items-center justify-center font-extrabold text-lg mx-auto shadow-sm">
              DM
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#001540] font-bold block">
                RESTRICTED ACCESS
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#121212]">
                Derick Martin Admin Lock
              </h1>
              <p className="text-xs font-mono text-neutral-500 max-w-xs mx-auto">
                Store administration console. Enter your master owner passcode to unlock.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleUnlock} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-600 mb-1.5 font-semibold">
                Owner Security Passcode
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded pl-9 pr-10 py-2.5 text-sm font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
                <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-neutral-400 hover:text-black absolute right-2 top-2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs font-mono text-rose-600 mt-2 bg-rose-50 border border-rose-200 p-2 rounded">
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={unlocking}
              className="w-full py-3 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              <span>{unlocking ? "Verifying..." : "Unlock Admin Console"}</span>
            </button>
          </form>

          {/* Security Note */}
          <div className="pt-4 border-t border-[#e5e3dc] text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-neutral-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected by The Cozy Theory Security Auth</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-xs font-mono text-neutral-400">
          The Cozy Theory &copy; {new Date().getFullYear()} • Ernakulam, Kerala
        </div>

      </div>
    );
  }

  // 3. UNLOCKED VIEW: Full White Theme Admin Console with Mobile Optimization
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#121212] flex font-sans antialiased selection:bg-neutral-200">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-[#fffdf8] border-r border-[#e5e3dc] flex flex-col justify-between transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          
          {/* Admin Header / Store Identifier */}
          <div className="px-5 py-4 border-b border-[#e5e3dc] flex items-center justify-between">
            <Link href="/admin" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#121212] flex items-center justify-center text-white font-black text-xs tracking-wider shadow-sm">
                TCT
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-sm tracking-tight uppercase text-[#121212] block truncate">
                  THE COZY THEORY
                </span>
                <span className="text-[10px] font-mono tracking-wider text-emerald-700 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Admin Console
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-neutral-500 hover:text-black lg:hidden rounded-md hover:bg-neutral-100"
              aria-label="Close Admin Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Online Store Switcher */}
          <div className="px-3 pt-4 pb-2">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3 py-2 bg-[#f5f2eb] hover:bg-[#ede9e0] text-xs font-mono rounded text-neutral-800 hover:text-black transition-colors border border-[#e5e3dc]"
            >
              <span className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-[#001540]" />
                <span className="font-medium">View Online Store</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </Link>
          </div>

          {/* Main Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
              Operations
            </div>

            {navItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;

              return (
                <div key={item.href} className="group relative flex items-center">
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded text-xs transition-all ${
                      active
                        ? "bg-[#121212] text-white font-medium shadow-sm"
                        : "text-neutral-600 hover:text-black hover:bg-[#f2efe8]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? "text-white" : "text-neutral-500 group-hover:text-black"}`} />
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-mono font-bold bg-[#001540] text-white px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>

                  {/* Direct Add shortcut icon */}
                  {item.actionHref && (
                    <Link
                      href={item.actionHref}
                      onClick={() => setSidebarOpen(false)}
                      className="p-1.5 mr-1 text-neutral-400 hover:text-black hover:bg-[#eae6dd] rounded transition-colors"
                      title={`Add ${item.title}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Live Store Pulse Box */}
          <div className="p-3.5 mx-3 my-3 bg-[#f8f6f0] border border-[#e5e3dc] rounded space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500 font-semibold text-[11px]">STORE STATUS</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                LIVE
              </span>
            </div>
            <div className="text-xl font-extrabold text-[#121212] font-mono flex items-baseline gap-1.5">
              <span>{analytics.activeVisitors || 1}</span>
              <span className="text-[11px] text-neutral-500 font-normal">active users</span>
            </div>
          </div>

        </div>

        {/* Sidebar Footer with Derick Martin as Owner & Lock Action */}
        <div className="p-4 border-t border-[#e5e3dc] flex items-center justify-between text-xs font-mono text-neutral-600 bg-[#faf8f5]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-[#121212] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm flex-shrink-0">
              DM
            </div>
            <div className="min-w-0">
              <div className="text-[#121212] font-bold truncate">Derick Martin</div>
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold truncate">Founder &amp; Owner</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={handleLockConsole}
              className="p-2 hover:text-rose-600 text-neutral-500 hover:bg-rose-50 rounded transition-colors flex-shrink-0"
              title="Lock Admin Console"
              aria-label="Lock Admin Console"
            >
              <Lock className="w-4 h-4" />
            </button>
            <Link
              href="/"
              className="p-2 hover:text-black text-neutral-500 hover:bg-[#ede9e0] rounded transition-colors flex-shrink-0"
              title="Return to Customer Storefront"
              aria-label="Return to Store"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Control Bar (Fully responsive on mobile & desktop) */}
        <header className="sticky top-0 z-30 h-14 sm:h-16 bg-[#fffdf8]/95 backdrop-blur-md border-b border-[#e5e3dc] px-3 sm:px-6 md:px-8 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Mobile hamburger & Global Admin Search */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-md">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-1 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-md lg:hidden flex-shrink-0"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Branding on small screens */}
            <span className="font-extrabold text-xs sm:text-sm uppercase tracking-tight text-[#121212] lg:hidden truncate">
              Admin
            </span>

            {/* Global Search */}
            <div className="relative w-full hidden sm:block">
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search products, orders, articles... (Ctrl + K)"
                className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded pl-9 pr-4 py-1.5 sm:py-2 text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2 sm:top-2.5" />
            </div>
          </div>

          {/* Right: Quick actions, Live visitor badge, Lock button */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            
            {/* Supabase DB Status Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded text-[11px] font-mono text-emerald-800 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Supabase Connected</span>
            </div>

            {/* Live visitors chip */}
            <Link
              href="/admin/analytics"
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#f5f2eb] border border-[#e5e3dc] rounded text-[11px] sm:text-xs font-mono text-neutral-800 hover:border-black transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span><strong>{analytics.activeVisitors || 1}</strong> <span className="hidden sm:inline">live</span></span>
            </Link>

            {/* Quick Add Product Button */}
            <Link
              href="/admin/products/new"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-medium transition-colors shadow-sm"
              title="Add Product"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Add Product</span>
            </Link>

            {/* Lock Console Button */}
            <button
              onClick={handleLockConsole}
              className="p-1.5 sm:p-2 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
              title="Lock Admin Console"
              aria-label="Lock Admin Console"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Storefront preview */}
            <Link
              href="/"
              target="_blank"
              className="p-1.5 sm:p-2 text-neutral-500 hover:text-black hover:bg-[#f0ede6] rounded transition-colors"
              title="Open Live Store in New Tab"
              aria-label="Open Live Store"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

        </header>

        {/* Dynamic Admin Subpage Viewport (with pb-20 on mobile to accommodate bottom nav) */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-[1600px] w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (Snappy Native App Feel on Mobile) */}
        <nav
          aria-label="Admin Mobile Navigation"
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#fffdf8]/95 backdrop-blur-md border-t border-[#e5e3dc] px-2 py-1.5 flex items-center justify-around text-[10px] font-mono lg:hidden shadow-lg"
        >
          <Link
            href="/admin"
            className={`flex flex-col items-center gap-1 p-1.5 rounded transition-colors ${
              pathname === "/admin"
                ? "text-black font-bold"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`flex flex-col items-center gap-1 p-1.5 rounded transition-colors relative ${
              pathname.startsWith("/admin/orders")
                ? "text-black font-bold"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#001540] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {pendingOrdersCount}
                </span>
              )}
            </div>
            <span>Orders</span>
          </Link>

          <Link
            href="/admin/products"
            className={`flex flex-col items-center gap-1 p-1.5 rounded transition-colors ${
              pathname.startsWith("/admin/products")
                ? "text-black font-bold"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products</span>
          </Link>

          <Link
            href="/admin/blogs"
            className={`flex flex-col items-center gap-1 p-1.5 rounded transition-colors ${
              pathname.startsWith("/admin/blogs")
                ? "text-black font-bold"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Blog</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-1 p-1.5 rounded text-neutral-500 hover:text-black transition-colors"
            aria-label="Open Full Admin Menu"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>More</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
