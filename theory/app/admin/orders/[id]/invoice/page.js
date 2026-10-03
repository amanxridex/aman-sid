"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Download, CheckCircle, Package } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { getOrders } from "@/lib/supabase";

export default function OrderInvoicePage({ params }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams?.id;
  const { orders } = useStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      // 1. Check in StoreContext
      const foundInStore = orders.find((o) => String(o.id) === String(orderId));
      if (foundInStore) {
        setOrder(foundInStore);
        setLoading(false);
        return;
      }

      // 2. Fetch directly from Supabase
      try {
        const allOrders = await getOrders();
        const found = allOrders.find((o) => String(o.id) === String(orderId));
        if (found) {
          // Normalize to common structure
          setOrder({
            id: found.id,
            date: new Date(found.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            created_at: found.created_at,
            total: found.total,
            subtotal: found.subtotal || found.total,
            shipping_cost: found.shipping_cost || 0,
            discount: found.discount || 0,
            financialStatus: found.payment_status || "Paid",
            paymentMethod: found.payment_method || "COD",
            fulfillmentStatus: found.fulfillment_status || "Unfulfilled",
            customer: {
              name: found.customer_name || "Valued Collector",
              email: found.customer_email || "collector@thecozytheory.com",
              phone: found.customer_phone || "+91 98200 00000",
              address: found.shipping_address?.address || "Studio Gallery Address",
              city: found.shipping_address?.city || "Mumbai",
              postalCode: found.shipping_address?.postalCode || "400013",
              state: found.shipping_address?.state || "Maharashtra",
            },
            items: Array.isArray(found.items) && found.items.length > 0 ? found.items : [
              {
                title: "Artisanal Studio Object",
                quantity: 1,
                price: found.total,
              }
            ],
          });
        }
      } catch (err) {
        console.error("Error loading invoice order:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId, orders]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center font-mono text-sm text-neutral-600">
        Generating Invoice Slip #{orderId}...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#faf8f5] p-8 text-center space-y-4 font-mono">
        <h1 className="text-xl font-bold text-[#121212]">Order Not Found</h1>
        <p className="text-neutral-500 text-xs">Could not find record for order #{orderId}.</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#121212] text-white text-xs uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>
      </div>
    );
  }

  const invoiceNumber = `INV-${order.id.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`;
  const totalAmount = parseFloat(order.total) || 0;
  const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [
    { title: "Artisanal Monolith Ceramic Piece", quantity: 1, price: totalAmount }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] py-8 px-4 sm:px-6 print:p-0 print:bg-white text-[#121212]">
      
      {/* Top Action Bar (Hidden during Print) */}
      <div className="max-w-[850px] mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice Slip</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div
        id="printable-slip"
        className="max-w-[850px] mx-auto bg-white border border-[#e5e3dc] print:border-none p-8 sm:p-12 shadow-sm rounded-none text-xs font-mono space-y-8"
      >
        
        {/* Header: Company & Tax Invoice Identity */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-black pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#121212]">
                THE COZY THEORY
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed max-w-sm">
              Registered Office: Building No. 3/435, KARIKODE<br />
              MULANTHURUTHY, Kanayannur, Ernakulam, Kerala - 682314, India<br />
              Customer Support: +91-7558085343 | thecozytheory.store@gmail.com
            </p>
          </div>

          <div className="text-right sm:text-right space-y-1 sm:min-w-[220px]">
            <span className="inline-block px-3 py-1 bg-black text-white font-bold text-xs uppercase tracking-widest">
              TAX INVOICE / PACKING SLIP
            </span>
            <div className="pt-2 text-[11px] space-y-1">
              <div>Invoice No: <strong className="text-black">{invoiceNumber}</strong></div>
              <div>Order Ref: <strong className="text-black">#{order.id}</strong></div>
              <div>Date: <strong className="text-black">{order.date || new Date().toLocaleDateString("en-IN")}</strong></div>
              <div>Place of Supply: <strong className="text-black">{order.customer?.state || "Maharashtra"} (27)</strong></div>
            </div>
          </div>
        </div>

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-[#e5e3dc] pb-8">
          
          {/* Bill To & Ship To */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
              BILLED &amp; DELIVERED TO:
            </span>
            <div className="text-sm font-bold text-[#121212] uppercase">
              {order.customer?.name}
            </div>
            <div className="text-[11px] text-neutral-700 leading-relaxed">
              {order.customer?.address || "Address Provided At Checkout"}<br />
              {order.customer?.city}, {order.customer?.state || "India"} - {order.customer?.postalCode}<br />
              <strong>Contact:</strong> {order.customer?.phone}<br />
              <strong>Email:</strong> {order.customer?.email}
            </div>
          </div>

          {/* Payment & Logistics Verification */}
          <div className="space-y-3 bg-[#faf8f5] border border-[#e5e3dc] p-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block">
              PAYMENT &amp; LOGISTICS INSTRUCTIONS
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment Terms:</span>
                <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 border border-amber-300">
                  CASH ON DELIVERY (COD)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Courier Service:</span>
                <span className="font-semibold text-black">Standard Domestic Courier (Insured)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Dispatch Check:</span>
                <span className="text-emerald-700 font-bold">Passed Quality Inspection</span>
              </div>
              <div className="pt-2 border-t border-[#e5e3dc] text-amber-900 font-bold text-xs">
                ⚠️ COLLECT CASH AT DOORSTEP: ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

        </div>

        {/* Itemized Table */}
        <div className="space-y-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-black text-[10px] uppercase text-neutral-500">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-2">Item Description</th>
                <th className="py-2.5 px-2 text-center">HSN</th>
                <th className="py-2.5 px-2 text-center">Qty</th>
                <th className="py-2.5 px-2 text-right">Unit Price (₹)</th>
                <th className="py-2.5 px-2 text-right">Net Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e3dc] text-[11px]">
              {items.map((item, idx) => {
                const qty = item.quantity || 1;
                const unitPrice = parseFloat(item.price) || 0;
                const lineTotal = qty * unitPrice;
                return (
                  <tr key={idx} className="hover:bg-[#faf8f5]/50">
                    <td className="py-3 px-2 text-neutral-400">{idx + 1}</td>
                    <td className="py-3 px-2 font-bold text-[#121212]">
                      <div>{item.title}</div>
                      {item.variant && (
                        <div className="text-[10px] text-neutral-500 font-normal">
                          Variant: {item.variant}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center text-neutral-500">9703</td>
                    <td className="py-3 px-2 text-center font-bold">{qty}</td>
                    <td className="py-3 px-2 text-right text-neutral-700">
                      {unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-black">
                      {lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation & Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 border-t border-[#e5e3dc]">
          
          {/* Notes & Bank Details */}
          <div className="space-y-2 text-[10px] text-neutral-500 max-w-sm">
            <span className="font-bold text-black uppercase">Declaration &amp; Policy:</span>
            <p className="leading-relaxed">
              We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Handcrafted ceramics and homeware pieces should be unboxed with care.
            </p>
            <p className="font-bold text-neutral-700">
              Dispatched with love from The Cozy Theory.
            </p>
          </div>

          {/* Amount Calculation Box */}
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600 pb-1.5 border-b border-[#e5e3dc]">
              <span>Subtotal:</span>
              <span className="font-bold text-black">
                Rs. {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600 pb-1.5 border-b border-[#e5e3dc]">
              <span>Insured Courier Shipping:</span>
              <span className="text-emerald-700 font-bold uppercase">FREE</span>
            </div>
            <div className="flex justify-between text-neutral-600 pb-1.5 border-b border-[#e5e3dc]">
              <span>Estimated GST (18% Included):</span>
              <span className="text-neutral-700">
                Rs. {(totalAmount * 0.18 / 1.18).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-[#121212] pt-2 border-t-2 border-black">
              <span>TOTAL (INR):</span>
              <span>Rs. {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

        </div>

        {/* Authorized Signatory Footer */}
        <div className="pt-8 border-t border-[#e5e3dc] flex flex-col sm:flex-row justify-between items-end gap-6 text-[10px]">
          <div>
            <span className="text-neutral-400">Customer Support:</span>
            <div className="text-neutral-800 font-bold">concierge@thecozytheory.com</div>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <div className="font-serif italic text-base text-neutral-800 tracking-wider">Derick Martin</div>
            <div className="h-0.5 w-36 bg-black ml-auto"></div>
            <div className="font-bold text-black uppercase">Derick Martin</div>
            <div className="text-neutral-500 uppercase tracking-widest text-[9px]">Founder &amp; Owner // The Cozy Theory</div>
          </div>
        </div>

      </div>

    </div>
  );
}
