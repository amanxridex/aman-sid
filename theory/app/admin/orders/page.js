"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Package,
  Printer,
  ChevronRight,
  User,
  MapPin,
  Calendar,
} from "lucide-react";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      search.trim() === "" ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(search.toLowerCase())) ||
      (order.customer?.email && order.customer.email.toLowerCase().includes(search.toLowerCase())) ||
      (order.customer?.city && order.customer.city.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === "unfulfilled" && order.fulfillmentStatus !== "Unfulfilled") return false;
    if (filter === "dispatched" && order.fulfillmentStatus !== "Dispatched") return false;
    if (filter === "delivered" && order.fulfillmentStatus !== "Delivered") return false;

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[#e5e3dc]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Link href="/admin" className="hover:text-black">Admin</Link>
            <span>/</span>
            <span className="text-black font-semibold">Orders &amp; Invoices</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#121212] mt-1">
            Orders ({orders.length})
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded text-amber-900 font-bold">
            {orders.filter((o) => o.fulfillmentStatus === "Unfulfilled").length} Pending
          </span>
          <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded text-blue-900 font-bold">
            {orders.filter((o) => o.fulfillmentStatus === "Dispatched").length} In Transit
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 bg-white border border-[#e5e3dc] rounded flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer, city..."
            className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded pl-9 pr-4 py-2 text-xs font-mono text-black placeholder:text-neutral-500 focus:outline-none focus:border-black focus:bg-white"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto text-xs font-mono no-scrollbar py-0.5">
          {["all", "unfulfilled", "dispatched", "delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded uppercase transition-colors whitespace-nowrap text-[11px] sm:text-xs ${
                filter === status
                  ? "bg-[#121212] text-white font-bold"
                  : "bg-[#f5f2eb] text-neutral-600 hover:text-black border border-[#e5e3dc]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE CARD VIEW (Optimized for Phones & Touch screens) */}
      <div className="block md:hidden space-y-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-[#e5e3dc] rounded p-4 shadow-xs space-y-3 font-mono text-xs"
          >
            {/* Top row: Order ID, Date, and Status Badge */}
            <div className="flex items-center justify-between border-b border-[#e5e3dc] pb-2.5">
              <div>
                <span className="font-extrabold text-sm text-[#121212]">
                  #{order.id}
                </span>
                <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  <span>{order.date}</span>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  order.fulfillmentStatus === "Delivered"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : order.fulfillmentStatus === "Dispatched"
                    ? "bg-blue-50 text-blue-800 border border-blue-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                {order.fulfillmentStatus}
              </span>
            </div>

            {/* Middle: Customer details & Items */}
            <div className="space-y-1 text-neutral-600">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-black text-xs flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  {order.customer?.name}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {order.itemsCount || (order.items ? order.items.length : 1)} items
                </span>
              </div>

              <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span>{order.customer?.city || "India"}</span>
                {order.customer?.phone && (
                  <span className="ml-2">• {order.customer.phone}</span>
                )}
              </div>
            </div>

            {/* Bottom Row: Price & Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#e5e3dc]">
              <div>
                <div className="text-[10px] text-neutral-400 uppercase">Total (COD)</div>
                <div className="font-bold text-sm text-[#121212]">
                  Rs. {Number(order.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {order.fulfillmentStatus === "Unfulfilled" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "Dispatched")}
                    className="px-3 py-1.5 bg-[#121212] hover:bg-neutral-800 text-white rounded text-[11px] font-bold transition-colors shadow-xs"
                  >
                    Dispatch
                  </button>
                )}
                {order.fulfillmentStatus === "Dispatched" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "Delivered")}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold transition-colors shadow-xs"
                  >
                    Deliver
                  </button>
                )}

                <Link
                  href={`/admin/orders/${order.id}/invoice`}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#f5f2eb] hover:bg-[#eae6dd] border border-[#e5e3dc] text-black font-semibold rounded text-[11px] transition-colors"
                  title="Print Invoice / Packing Slip"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Slip</span>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="py-12 bg-white border border-[#e5e3dc] rounded text-center text-neutral-500 font-mono text-xs">
            No orders found matching your filters.
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Clean and Spacious on Screens >= md) */}
      <div className="hidden md:block bg-white border border-[#e5e3dc] rounded overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#e5e3dc] bg-[#faf8f5] text-neutral-600 uppercase text-[10px]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Collector</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total (INR)</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4 text-right">Actions / Slips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e3dc]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#faf8f5] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#121212]">
                    #{order.id}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-[#121212] font-semibold">{order.customer?.name}</div>
                    <div className="text-[10px] text-neutral-500">{order.customer?.city}</div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">
                    {order.itemsCount || (order.items ? order.items.length : 1)} items
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#121212] whitespace-nowrap">
                    Rs. {Number(order.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                      COD
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.fulfillmentStatus === "Delivered"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : order.fulfillmentStatus === "Dispatched"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                    {order.fulfillmentStatus === "Unfulfilled" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "Dispatched")}
                        className="px-2.5 py-1 bg-[#121212] hover:bg-neutral-800 text-white rounded text-[11px] font-bold transition-colors"
                      >
                        Dispatch
                      </button>
                    )}
                    {order.fulfillmentStatus === "Dispatched" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "Delivered")}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold transition-colors"
                      >
                        Deliver
                      </button>
                    )}

                    <Link
                      href={`/admin/orders/${order.id}/invoice`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#f5f2eb] hover:bg-[#eae6dd] border border-[#e5e3dc] text-black font-semibold rounded text-[11px] transition-colors"
                      title="Print Invoice / Packing Slip"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Slip</span>
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-neutral-500 font-mono">
                    No orders found matching your filters.
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
