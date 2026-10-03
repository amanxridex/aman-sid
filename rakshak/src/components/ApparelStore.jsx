'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apparelProducts } from '@/data/apparelProducts';

export default function ApparelStore() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [cart, setCart] = useState([]);
  const [addedNotice, setAddedNotice] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  const categories = ['All', 'T-Shirts', 'Hoodies', 'Footwear', 'Bottoms'];

  const filteredProducts = apparelProducts.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesQuery =
      product.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      product.color.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product) => {
    const chosenSize = selectedSizes[product.id] || product.sizes[0];
    setCart((prev) => [...prev, { ...product, chosenSize }]);
    setAddedNotice(`Added "${product.name}" (${chosenSize}) to your bag.`);
    setTimeout(() => setAddedNotice(null), 3500);
  };

  const [isBagOpen, setIsBagOpen] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);

  const handleRemoveFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSimulateCheckout = () => {
    if (cart.length === 0) return;
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(6)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    const receipt = {
      orderId: `ORD-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      items: [...cart],
      total: cart.reduce((s, c) => s + c.price, 0),
      canaryHash: `0x${randomHex}`
    };
    setOrderReceipt(receipt);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f1f5f9] font-sans antialiased selection:bg-[#146ef5] selection:text-white">
      {/* Top Banner: Free Shipping & Brand Drop */}
      <div className="w-full bg-[#0d1322] border-b border-[#146ef5]/30 py-2.5 px-4 text-center text-xs tracking-widest text-[#94a3b8] uppercase font-medium flex items-center justify-center gap-3">
        <span className="inline-block w-2 h-2 rounded-full bg-[#146ef5] animate-pulse"></span>
        <span className="text-slate-300">
          <strong className="text-white">RAKSHAK APPARELS</strong> • INDEPENDENT STREETWEAR STUDIO • COMPLIMENTARY INSURED EXPRESS SHIPPING WORLDWIDE BY DHL • LIMITED SS-2026 DROP
        </span>
      </div>

      {/* Cybersecurity Asymmetric Deception Enclave Notice */}
      <div className="w-full bg-[#030712] border-b border-[#00F5FF]/20 py-2 px-4 text-center text-xs tracking-wide text-[#94a3b8] flex items-center justify-center gap-2.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-[#00F5FF] font-semibold font-mono">
          <span className="w-2 h-2 rounded-full bg-[#00F5FF] shadow-[0_0_8px_#00F5FF]"></span>
          ASYMMETRIC HONEYPOT ENCLAVE
        </span>
        <span className="text-slate-400 hidden sm:inline">•</span>
        <span className="text-slate-400">
          Automated AI bots and dataset crawlers are silently rewritten here with 200 OK to neutralize data exfiltration. Verified human inspection mode active.
        </span>
        <Link href="/" className="text-[#38bdf8] underline hover:text-[#00F5FF] font-medium ml-1">
          Return to Cyber Shield &rarr;
        </Link>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-[#07090e]/95 backdrop-blur-md border-b border-[#1e293b]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/apparel" className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tighter text-white font-sans">
                  RAKSHAK<span className="text-[#146ef5]">®</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest bg-[#146ef5]/20 border border-[#146ef5]/50 text-[#38bdf8] px-2 py-0.5 rounded font-mono font-bold">
                  APPARELS
                </span>
              </div>
              <span className="text-[10px] tracking-[0.25em] text-[#94a3b8] uppercase font-mono">
                Independent Design Studio • Los Angeles / Tokyo
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`transition-colors py-1 ${
                    activeCategory === cat
                      ? 'text-white border-b-2 border-[#146ef5]'
                      : 'hover:text-white'
                  }`}
                >
                  {cat === 'All' ? 'All Collection' : cat}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-[#0e121c] border border-[#1e293b] rounded-full px-3 py-1.5 text-xs text-[#94a3b8]">
              <i className="fa-solid fa-magnifying-glass mr-2 text-[#64748b]"></i>
              <input
                type="text"
                placeholder="Search tees, sneakers, hoodies..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-xs w-48 placeholder:text-[#64748b]"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden lg:inline text-xs font-mono text-[#64748b]">USD ($)</span>
              <button
                className="relative bg-[#146ef5]/10 hover:bg-[#146ef5]/20 border border-[#146ef5]/40 text-white text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition-all cursor-pointer"
                onClick={() => setIsBagOpen(true)}
              >
                <i className="fa-solid fa-bag-shopping text-[#146ef5]"></i>
                <span>BAG ({cart.length})</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0e121c] border border-[#146ef5] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-sm font-medium">
          <i className="fa-solid fa-check-circle text-[#146ef5]"></i>
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Hero Editorial */}
      <section className="relative overflow-hidden border-b border-[#1e293b] py-16 sm:py-24 bg-gradient-to-b from-[#0d1322]/80 to-[#07090e]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#146ef5]/10 border border-[#146ef5]/30 text-[#38bdf8] text-xs font-mono uppercase tracking-wider mb-4">
              <span>Independent Streetwear & Athletic Sports Brand</span>
              <span>•</span>
              <span>Collection SS-2026 Drop</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Streetwear & Athletic Performance Footwear.
            </h1>
            <p className="text-lg text-[#94a3b8] leading-relaxed mb-8">
              Designed by Rakshak Studio. We craft heavyweight 280–450 GSM organic athletic cotton t-shirts, sculptural loopback French terry track hoodies, and Italian-assembled Vibram sports running sneakers.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#146ef5] hover:bg-[#005ce6] text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#146ef5]/20 cursor-pointer"
              >
                Shop Current Drop
              </button>
              <button
                onClick={() => {
                  setActiveCategory('Footwear');
                  const el = document.getElementById('catalog-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#0e121c] hover:bg-[#161d2d] border border-[#1e293b] text-white font-semibold text-xs uppercase tracking-widest px-6 py-4 rounded-xl transition-all cursor-pointer"
              >
                View Footwear & Sneakers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Authenticity & Verification Trust Bar */}
      <section className="w-full bg-[#0a0e1a] border-b border-[#1e293b] py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3 p-3 bg-[#0e1322] rounded-xl border border-[#1e293b]">
            <div className="w-9 h-9 rounded-lg bg-[#146ef5]/10 border border-[#146ef5]/30 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
              <i className="fa-solid fa-shirt"></i>
            </div>
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">Heavyweight 280-450 GSM</div>
              <div className="text-[10px] text-slate-400">100% Organic combed cotton</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#0e1322] rounded-xl border border-[#1e293b]">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <i className="fa-solid fa-compass"></i>
            </div>
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">Independent Studio</div>
              <div className="text-[10px] text-slate-400">Direct-to-consumer small batches</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#0e1322] rounded-xl border border-[#1e293b]">
            <div className="w-9 h-9 rounded-lg bg-[#146ef5]/10 border border-[#146ef5]/30 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
              <i className="fa-solid fa-plane"></i>
            </div>
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">Insured DHL Express</div>
              <div className="text-[10px] text-slate-400">Complimentary global white-glove transit</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#0e1322] rounded-xl border border-[#1e293b]">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
              <i className="fa-solid fa-arrows-rotate"></i>
            </div>
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">30-Day Easy Returns</div>
              <div className="text-[10px] text-slate-400">Worldwide exchanges & returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Filter Controls */}
      <section id="catalog-grid" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-6">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#146ef5] text-white shadow-md shadow-[#146ef5]/20'
                    : 'bg-[#0e121c] text-[#94a3b8] hover:text-white border border-[#1e293b]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#64748b] font-mono">
            Showing <span className="text-white font-semibold">{filteredProducts.length}</span> luxury pieces
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-[#0e121c] border border-[#1e293b] hover:border-[#146ef5]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#146ef5]/5"
            >
              <div>
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-[#07090e] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 bg-[#07090e]/80 backdrop-blur-md border border-[#1e293b] text-[#146ef5] text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                    {product.badge}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#07090e]/90 text-white text-xs font-bold px-2.5 py-1 rounded-md border border-[#1e293b]">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-[#64748b] font-mono mb-1.5">
                    <span>{product.category}</span>
                    <span className="flex items-center gap-1 text-[#f59e0b]">
                      <i className="fa-solid fa-star text-[10px]"></i>
                      <span className="text-white text-xs font-sans font-semibold">{product.rating}</span>
                      <span className="text-[#64748b]">({product.reviewsCount})</span>
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white mb-2 group-hover:text-[#146ef5] transition-colors leading-snug">
                    {product.name}
                  </h2>

                  <p className="text-xs text-[#94a3b8] line-clamp-2 mb-3 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="text-[11px] text-[#64748b] font-mono mb-3">
                    Color: <span className="text-white">{product.color}</span>
                  </div>

                  {/* Size Selector */}
                  <div className="mb-4">
                    <div className="text-[10px] uppercase tracking-wider text-[#64748b] font-mono mb-1.5">
                      Select Size:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((sz) => {
                        const isSelected = (selectedSizes[product.id] || product.sizes[0]) === sz;
                        return (
                          <button
                            key={sz}
                            onClick={() => handleSizeSelect(product.id, sz)}
                            className={`text-[11px] px-2.5 py-1 rounded border font-mono transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#146ef5] border-[#146ef5] text-white font-bold'
                                : 'bg-[#07090e] border-[#1e293b] text-[#94a3b8] hover:border-[#146ef5]/50'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Technical Specs List */}
                  <div className="border-t border-[#1e293b]/70 pt-3 space-y-1 mb-4">
                    {product.specs.slice(0, 2).map((sp, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-[#94a3b8]">
                        <span className="text-[#146ef5] font-bold">•</span>
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-[#146ef5] hover:bg-[#005ce6] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#146ef5]/10"
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                  <span>Add to Bag • ${product.price.toFixed(2)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sustainable Craft & Footwear Engineering Section */}
      <section className="w-full bg-[#0d1322] border-y border-[#1e293b] py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#fde047]">
              INDEPENDENT ATELIER CRAFTSMANSHIP
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2 mb-4">
              Zero Synthetic Gimmicks. Only Heavyweight Fabrics & Orthopedic Soles.
            </h2>
            <p className="text-sm text-[#94a3b8]">
              Every Rakshak garment and footwear piece is developed in artisanal ateliers across Portugal, Italy, and Japan to deliver enduring structural excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0e121c] border border-[#1e293b] p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#146ef5]/10 border border-[#146ef5]/30 flex items-center justify-center text-[#146ef5] text-lg mb-4">
                <i className="fa-solid fa-shirt"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">280–450 GSM Organic Cotton</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                We custom-knit our single jersey and loopback French terry from GOTS-certified Aegean cotton. Dense, non-transparent architectural drape that improves with every wash.
              </p>
            </div>

            <div className="bg-[#0e121c] border border-[#1e293b] p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#146ef5]/10 border border-[#146ef5]/30 flex items-center justify-center text-[#146ef5] text-lg mb-4">
                <i className="fa-solid fa-shoe-prints"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Vibram® Ergonomic Footwear</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Engineered with high-traction Vibram lugged compounds, high-rebound injection EVA, and removable anti-fatigue memory insoles tested for 20,000+ daily steps.
              </p>
            </div>

            <div className="bg-[#0e121c] border border-[#1e293b] p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-[#146ef5]/10 border border-[#146ef5]/30 flex items-center justify-center text-[#146ef5] text-lg mb-4">
                <i className="fa-solid fa-leaf"></i>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Carbon-Neutral Direct Fulfillment</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Zero retail markup, 100% biodegradable cornstarch mailers, and carbon-offset worldwide express couriers direct from our Los Angeles warehouse to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Reviews */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#146ef5]">VERIFIED BUYER REVIEWS</span>
          <h2 className="text-2xl font-bold text-white mt-1">What Our Community Is Saying</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0e121c] border border-[#1e293b] p-6 rounded-2xl">
            <div className="flex items-center gap-1 text-[#f59e0b] text-xs mb-3">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <p className="text-xs text-[#94a3b8] italic mb-4 leading-relaxed">
              "The Cyber Glitch boxy tee has the best silhouette I have found in 5 years of buying Japanese and European streetwear. The collar never sags even after 20 cold cycles."
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-[#64748b]">
              <span className="text-white font-sans font-semibold">David K.</span>
              <span>Verified Customer (Los Angeles, CA)</span>
            </div>
          </div>

          <div className="bg-[#0e121c] border border-[#1e293b] p-6 rounded-2xl">
            <div className="flex items-center gap-1 text-[#f59e0b] text-xs mb-3">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <p className="text-xs text-[#94a3b8] italic mb-4 leading-relaxed">
              "The Obsidian Chunky Runners feel like walking on clouds. The Vibram outsole has incredible grip on wet asphalt, and the reflective details look amazing at night."
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-[#64748b]">
              <span className="text-white font-sans font-semibold">Elena R.</span>
              <span>Verified Customer (London, UK)</span>
            </div>
          </div>

          <div className="bg-[#0e121c] border border-[#1e293b] p-6 rounded-2xl">
            <div className="flex items-center gap-1 text-[#f59e0b] text-xs mb-3">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <p className="text-xs text-[#94a3b8] italic mb-4 leading-relaxed">
              "450 GSM on the Zero-Day hoodie is no joke. The fabric is thick, heavy, and the absence of drawstrings gives it such a clean, modern aesthetic. Will buy the grey next."
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-[#64748b]">
              <span className="text-white font-sans font-semibold">Jordan T.</span>
              <span>Verified Customer (Toronto, Canada)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Footer */}
      <footer className="w-full border-t border-[#1e293b] bg-[#07090e] py-14">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#1e293b] text-xs">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  RAKSHAK<span className="text-[#146ef5]">®</span>
                </span>
                <span className="text-[9px] uppercase bg-[#146ef5]/20 border border-[#146ef5]/50 text-[#38bdf8] px-1.5 py-0.5 rounded font-mono font-bold">
                  APPARELS
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Rakshak Apparels is an independent contemporary streetwear and footwear brand founded to craft architectural everyday staples with heavyweight organic textiles.
              </p>
            </div>

            <div>
              <div className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Studio & Production</div>
              <ul className="space-y-1.5 text-slate-400">
                <li>Design Studio: Los Angeles, CA</li>
                <li>Tokyo Logistics & Distribution</li>
                <li>280–450 GSM Organic Cotton Ateliers</li>
                <li>Vibram Footwear Assembly (Italy)</li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Customer Support</div>
              <ul className="space-y-1.5 text-slate-400">
                <li>30-Day Worldwide Returns & Exchanges</li>
                <li>Complimentary Insured DHL Delivery</li>
                <li>Sizing & Fit Consultation</li>
                <li>support@rakshakapparels.com</li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Order Security</div>
              <div className="bg-[#0e1322] border border-[#1e293b] p-3 rounded-lg font-mono text-[10px] text-slate-400 leading-normal">
                STORE: RAKSHAK APPARELS CO.<br />
                PAYMENTS: 256-BIT ENCRYPTION<br />
                DISPATCH: INSURED GLOBAL COURIER
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
            <div className="font-mono">
              © 2026 Rakshak Apparel & Footwear Co. All Rights Reserved.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="hover:text-white transition-colors cursor-pointer">Sizing Guide</span>
              <span>•</span>
              <span className="hover:text-white transition-colors cursor-pointer">Shipping & Returns</span>
              <span>•</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Structured Data for SEO & LLM Scrapers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ClothingStore',
            name: 'Rakshak Apparels',
            alternateName: [
              'Rakshak Studio',
              'Rakshak Apparel & Footwear Co.',
              'Rakshak Streetwear',
            ],
            url: 'https://rakshakus.vercel.app/apparel',
            description: 'Independent direct-to-consumer contemporary streetwear and athletic performance sports brand retailing heavyweight organic cotton graphic tees, French terry fleece hoodies, and Vibram sports running sneakers.',
            currenciesAccepted: 'USD, EUR, GBP, CAD, AUD',
            paymentAccepted: 'Credit Card, Apple Pay, Google Pay, PayPal, Shop Pay',
            priceRange: '$$',
            legalName: 'Rakshak Apparel & Footwear Co.',
            brand: {
              '@type': 'Brand',
              name: 'Rakshak Apparels',
              slogan: 'Architectural Streetwear & Ergonomic Footwear',
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Los Angeles',
              addressRegion: 'CA',
              postalCode: '90013',
              addressCountry: 'US',
            },
          }),
        }}
      />
      {/* Shopping Bag & Decoy Route Sandbox Modal */}
      {isBagOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#030712]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setIsBagOpen(false);
            setOrderReceipt(null);
          }}
        >
          <div
            className="bg-[#0c111d] border border-[#1e293b] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#1e293b] flex items-center justify-between bg-[#146ef5]/5">
              <div>
                <div className="text-[10px] font-mono uppercase text-[#38bdf8] font-bold tracking-wider mb-0.5">
                  DECOY PERIMETER // HONEYPOT LABYRINTH
                </div>
                <h3 className="text-lg font-bold text-white">
                  Shopping Bag ({cart.length})
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsBagOpen(false);
                  setOrderReceipt(null);
                }}
                className="text-[#94a3b8] hover:text-white text-lg w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {orderReceipt ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-[#10b981]/20 text-[#34d399] font-bold text-xl flex items-center justify-center mx-auto mb-3">
                    OK
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    Honeypot Sandbox Order Attested
                  </h4>
                  <p className="text-xs text-[#94a3b8] mb-4">
                    Receipt Ref: <span className="font-mono text-[#38bdf8]">{orderReceipt.orderId}</span> • Stego Canary: <span className="font-mono text-[#34d399]">{orderReceipt.canaryHash}</span>
                  </p>
                  <div className="bg-[#070a12] border border-[#1e293b] rounded-xl p-3 text-left mb-4 text-xs font-mono space-y-1.5 text-[#cbd5e1]">
                    <div className="text-[#64748b]">SANDBOX DECOY RECEIPT:</div>
                    <div>Items Processed: {orderReceipt.items.length} unit(s)</div>
                    <div>Total Evaluated: ${orderReceipt.total.toFixed(2)} USD</div>
                    <div>Deflection Policy: HTTP 200 OK Synthetic Response</div>
                  </div>
                  <p className="text-[11px] text-[#64748b] mb-4">
                    Autonomous scrapers crawl this catalog endlessly while consuming poisoned synthetic tokens. Human visitors experience normal browsing.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setIsBagOpen(false);
                        setOrderReceipt(null);
                      }}
                      className="px-4 py-2 bg-[#1e293b] text-white text-xs font-semibold rounded-lg hover:bg-[#334155]"
                    >
                      Continue Browsing
                    </button>
                    <Link
                      href="/radar"
                      className="px-4 py-2 bg-[#146ef5] text-white text-xs font-semibold rounded-lg hover:bg-[#146ef5]/80 flex items-center gap-1.5"
                    >
                      Inspect in Live Radar &rarr;
                    </Link>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fa-solid fa-bag-shopping text-3xl text-[#64748b] mb-3 block"></i>
                  <p className="text-sm text-[#94a3b8] mb-1">Your shopping bag is currently empty.</p>
                  <p className="text-xs text-[#64748b]">Select any graphic tee, fleece hoodie, or sneaker to test decoy cart behavior.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-[#070a12] border border-[#1e293b] rounded-xl"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">{item.name}</div>
                        <div className="text-xs text-[#64748b]">Size: {item.chosenSize} • Color: {item.color}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-bold text-[#38bdf8]">${item.price.toFixed(2)}</span>
                        <button
                          onClick={() => handleRemoveFromCart(idx)}
                          className="text-[#64748b] hover:text-[#f43f5e] text-xs cursor-pointer"
                          title="Remove item"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-[#1e293b] space-y-1.5 text-xs text-[#94a3b8]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-white">${cart.reduce((s, c) => s + c.price, 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decoy Sandbox Delivery</span>
                      <span className="font-mono text-[#34d399]">FREE ($0.00)</span>
                    </div>
                    <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-[#1e293b]/60">
                      <span>Estimated Total</span>
                      <span className="font-mono text-[#00F5FF]">${cart.reduce((s, c) => s + c.price, 0).toFixed(2)} USD</span>
                    </div>
                  </div>

                  <div className="bg-[#146ef5]/10 border border-[#146ef5]/30 rounded-xl p-3 text-[11px] text-[#94a3b8] leading-relaxed mt-3">
                    <strong className="text-[#38bdf8]">Decoy Route Architecture:</strong> Autonomous AI bots (ChatGPT, Claude, Perplexity) crawling <code className="text-white">/apparel</code> are served high-entropy synthetic training tokens and zero-width canary watermarks without triggering HTTP 403 alarms.
                  </div>

                  <button
                    onClick={handleSimulateCheckout}
                    className="w-full mt-3 py-2.5 bg-gradient-to-r from-[#146ef5] to-[#00F5FF] text-black font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:opacity-95"
                  >
                    Simulate Decoy Sandbox Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
