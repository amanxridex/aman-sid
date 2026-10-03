"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Scale } from "lucide-react";
import { useState } from "react";
import { NOTICE_PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { calculateTieredShipping } from "@/lib/productSections";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [orderNote, setOrderNote] = useState("");
  const FREE_SHIPPING_THRESHOLD = 2999;
  const amountNeeded = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const formattedSubtotal = subtotal.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const shippingInfo = calculateTieredShipping(items, subtotal);

  const recommendations = NOTICE_PRODUCTS.slice(4, 8);

  return (
    <div className="bg-[#fffdf8] min-h-screen py-10 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#e5e3dc] gap-4 mb-8">
          <div>
            <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-neutral-500 block mb-1">
              Your Selection
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-[#121212]">
              Shopping Cart
            </h1>
          </div>
          <Link
            href="/collections/all-products"
            className="text-xs font-mono uppercase underline hover:text-neutral-500"
          >
            Continue Shopping →
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center space-y-6 bg-[#f7f5ef] border border-[#e5e3dc] p-8">
            <div className="w-16 h-16 rounded-full bg-[#e5e3dc] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-neutral-500" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold uppercase tracking-tight">
                Your cart is currently empty
              </h2>
              <p className="text-xs text-neutral-500 font-mono">
                Objects that tell a story are waiting to enter your space.
              </p>
            </div>
            <Link
              href="/collections/all-products"
              className="inline-block px-8 py-3.5 bg-[#121212] text-[#fffdf8] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800"
            >
              Explore Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Cart Line Items */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Free shipping banner */}
              <div className="p-4 bg-[#f7f5ef] border border-[#e5e3dc] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  {amountNeeded > 0 ? (
                    <span>
                      Add <strong>Rs. {amountNeeded.toLocaleString("en-IN")}</strong> more to claim <strong>FREE Standard Shipping</strong>
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold">
                      You have qualified for FREE Standard Delivery!
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-[#e5e3dc] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#121212] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Table / List of items */}
              <div className="divide-y divide-[#e5e3dc] border-t border-b border-[#e5e3dc]">
                {items.map((item) => (
                  <div key={item.id} className="py-6 flex gap-4 sm:gap-6 items-center">
                    <Link
                      href={`/products/${item.handle || "card-bar"}`}
                      className="w-24 h-28 bg-[#f7f5ef] border border-[#e5e3dc] flex-shrink-0 overflow-hidden"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 space-y-2">
                      <Link
                        href={`/products/${item.handle || "card-bar"}`}
                        className="text-sm font-bold uppercase tracking-tight text-[#121212] hover:underline line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <div className="text-xs font-mono font-bold text-neutral-800">
                        Rs. {Number(item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>

                      <div className="flex items-center gap-4 pt-1">
                        <div className="flex items-center border border-[#e5e3dc] bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-neutral-500 hover:text-black"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-neutral-500 hover:text-black"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs font-mono text-neutral-400 hover:text-rose-600 flex items-center gap-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-right font-mono font-bold text-sm hidden sm:block">
                      Rs. {(Number(item.price) * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Notes Field */}
              <div className="pt-2">
                <label className="text-xs font-mono uppercase text-neutral-500 block mb-2">
                  Special Instructions or Gifting Notes:
                </label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Leave a personalized message or delivery instruction for our team..."
                  rows={3}
                  className="w-full bg-[#f7f5ef] border border-[#e5e3dc] p-3 text-xs font-mono focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 bg-[#f7f5ef] border border-[#e5e3dc] space-y-6">
                <h3 className="text-base font-bold uppercase tracking-tight font-sans">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs font-mono text-neutral-600 divide-y divide-[#e5e3dc]">
                  <div className="flex justify-between items-center pt-2">
                    <span>Subtotal</span>
                    <span className="font-bold text-black">Rs. {formattedSubtotal}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Parcel Weight</span>
                    </span>
                    <span className="font-semibold text-neutral-800">~{shippingInfo.totalWeightKg} kg</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span>Delivery</span>
                    <span>
                      {shippingInfo.shippingFee === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase">FREE</span>
                      ) : (
                        `Rs. ${shippingInfo.shippingFee}.00 (${shippingInfo.tierLabel})`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span>Taxes</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 text-sm font-bold text-black">
                    <span>Estimated Total</span>
                    <span>
                      Rs. {(subtotal + shippingInfo.shippingFee).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/checkout"
                    className="w-full py-4 bg-[#121212] text-[#fffdf8] text-xs font-mono font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Proceed To Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <p className="text-[10px] font-mono text-neutral-500 text-center">
                  🔒 Encrypted 256-Bit SSL Checkout. All cards, Net Banking & UPI accepted.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Curated Recommendations */}
        <div className="mt-20 pt-12 border-t border-[#e5e3dc]">
          <h3 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight mb-8">
            Complete Your Living Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
