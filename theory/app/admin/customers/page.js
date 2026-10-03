"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Users, Search, MapPin, Mail, Phone, Calendar } from "lucide-react";

export default function AdminCustomersPage() {
  const { customers: dbCustomers } = useStore();
  const [search, setSearch] = useState("");

  // Build real customers strictly from Supabase dbCustomers or real orders
  const customers = (dbCustomers || []).map((c) => ({
    id: c.id,
    name: c.name || "Customer",
    email: c.email || "",
    phone: c.phone || "",
    city: c.city || "India",
    orders: c.orders_count || 1,
    totalSpent: parseFloat(c.total_spent) || 0,
    tier: (parseFloat(c.total_spent) || 0) > 10000 ? "VIP Collector" : "Collector Member",
    lastOrder: c.created_at
      ? new Date(c.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Active",
  }));

  const totalLifetimeSpend = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[#e5e3dc]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Link href="/admin" className="hover:text-black">Admin</Link>
            <span>/</span>
            <span className="text-black font-semibold">Collectors</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#121212] mt-1">
            Collectors &amp; Customers ({customers.length})
          </h1>
          <p className="text-xs font-mono text-neutral-500 mt-0.5">
            Real customer records stored in Supabase database.
          </p>
        </div>

        <div className="text-xs font-mono text-neutral-600 bg-white border border-[#e5e3dc] px-3 py-1.5 rounded shadow-xs">
          Total Spent: <strong className="text-emerald-700 font-bold">Rs. {totalLifetimeSpend.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 sm:p-4 bg-white border border-[#e5e3dc] rounded flex items-center justify-between shadow-xs">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collector name, email, phone, city..."
            className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded pl-9 pr-4 py-2 text-xs font-mono text-black placeholder:text-neutral-500 focus:outline-none focus:border-black focus:bg-white"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>
        <span className="text-xs font-mono text-neutral-500 hidden sm:inline ml-3">
          {filtered.length} customers
        </span>
      </div>

      {/* MOBILE CUSTOMERS CARDS (Optimized for Phones) */}
      <div className="block md:hidden space-y-3">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-[#e5e3dc] rounded p-4 shadow-xs space-y-3 font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#e5e3dc] pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#121212] text-white flex items-center justify-center font-bold text-xs uppercase">
                  {c.name.slice(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#121212]">{c.name}</div>
                  <div className="text-[10px] text-neutral-400">{c.email || "No email"}</div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  c.tier.includes("VIP")
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}
              >
                {c.tier}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-neutral-600 text-[11px]">
              <div>
                <span className="text-neutral-400 block text-[9px] uppercase">Phone</span>
                <span className="font-semibold text-black">{c.phone || "—"}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px] uppercase">Location</span>
                <span className="font-semibold text-black">{c.city}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px] uppercase">Total Orders</span>
                <span className="font-semibold text-black">{c.orders} orders</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[9px] uppercase">Lifetime Spend</span>
                <span className="font-bold text-emerald-700">Rs. {c.totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 bg-white border border-[#e5e3dc] rounded text-center text-neutral-500 font-mono text-xs">
            No customers found in database.
          </div>
        )}
      </div>

      {/* DESKTOP CUSTOMERS TABLE */}
      <div className="hidden md:block bg-white border border-[#e5e3dc] rounded overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#e5e3dc] bg-[#faf8f5] text-neutral-600 uppercase text-[10px]">
                <th className="py-3 px-4">Collector</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Status Tier</th>
                <th className="py-3 px-4 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e3dc]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#faf8f5] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#121212]">{c.name}</div>
                    <div className="text-[10px] text-neutral-500">{c.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">
                    {c.phone || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#001540]" />
                      <span>{c.city}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">
                    {c.orders} orders
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#121212]">
                    Rs. {c.totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.tier.includes("VIP")
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-blue-50 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {c.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-neutral-500">
                    {c.lastOrder}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-neutral-500 font-mono">
                    No customers found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
