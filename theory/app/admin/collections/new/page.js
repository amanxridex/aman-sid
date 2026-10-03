"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  ArrowLeft,
  Layers,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

export default function NewCollectionPage() {
  const router = useRouter();
  const { addCollection } = useStore();

  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    description: "",
    image: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/Product_79-01.png?v=1784392136",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCollection, setCreatedCollection] = useState(null);

  const handleTitleChange = (val) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setFormData((prev) => ({
      ...prev,
      title: val,
      handle: prev.handle === "" || prev.handle === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") ? autoSlug : prev.handle,
    }));
  };

  const handleSaveCollection = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a category title.");
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await addCollection(formData);
      setIsSubmitting(false);
      setCreatedCollection(saved);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5e3dc]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/collections"
            className="p-2 bg-[#f5f2eb] hover:bg-[#ede9e0] text-neutral-700 hover:text-black rounded transition-colors border border-[#e5e3dc]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#001540] font-bold">
              Category Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#121212] mt-0.5">
              Create New Category
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/collections"
            className="px-4 py-2 bg-[#f5f2eb] hover:bg-[#ede9e0] text-neutral-700 text-xs font-mono rounded border border-[#e5e3dc] transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSaveCollection}
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#121212] hover:bg-neutral-800 text-white text-xs font-bold font-mono uppercase tracking-wider rounded transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Save Category"}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {createdCollection && (
        <div className="p-6 bg-emerald-50 border border-emerald-300 rounded space-y-4 animate-in fade-in">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  Category &ldquo;{createdCollection.title}&rdquo; Successfully Created!
                </h3>
                <p className="text-xs font-mono text-emerald-800 mt-0.5">
                  Available in the product editor dropdown and live at /collections/{createdCollection.handle}.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCreatedCollection(null)}
              className="text-xs font-mono text-neutral-500 hover:text-black"
            >
              Dismiss
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/collections/${createdCollection.handle}`}
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono font-bold uppercase rounded transition-colors shadow"
            >
              <span>View Live Category Page ↗</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/products/new"
              className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-mono rounded border border-[#e5e3dc] transition-colors"
            >
              Add Product to this Category
            </Link>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSaveCollection} className="space-y-6">
        
        {/* Title, Slug & Description */}
        <div className="p-6 bg-white border border-[#e5e3dc] rounded space-y-4 shadow-xs">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-1.5 font-semibold">
              Category Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="E.g. Ambient Lighting & Sconces"
              className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-1.5 font-semibold">
              Category Handle / URL Slug
            </label>
            <div className="flex items-center bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 text-xs font-mono text-neutral-500">
              <span>/collections/</span>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder="ambient-lighting-sconces"
                className="w-full bg-transparent py-2.5 text-black focus:outline-none pl-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-1.5 font-semibold">
              Category Description (Editorial Manifesto)
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the aesthetic theme and curate what living spaces this collection complements..."
              className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded p-4 text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors leading-relaxed"
            />
          </div>
        </div>

        {/* Banner Image */}
        <div className="p-6 bg-white border border-[#e5e3dc] rounded space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
              Category Banner Image
            </h2>
            <span className="text-xs font-mono text-neutral-500">Preview Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 aspect-[16/9] bg-neutral-100 rounded overflow-hidden border border-[#e5e3dc]">
              <img
                src={formData.image}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-7 space-y-3">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-1 font-semibold">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Paste banner image URL here..."
                  className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 py-2 text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <span className="text-[10px] font-mono text-neutral-500 block mb-1 font-semibold">
                  Or pick preset studio banner:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {[
                    { label: "Stoneware Dining", url: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/IMG_0517_ab4b2575-73cd-44f0-bef6-e22d87b409e1.jpg?v=1726212864" },
                    { label: "Ceramic Pitcher", url: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/Product_79-01.png?v=1784392136" },
                    { label: "Washed Cotton", url: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/DSC00422_eee0df88-82cb-49a4-818d-182c056960b2.jpg?v=1740976529" },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: p.url })}
                      className="px-2.5 py-1 bg-[#f5f2eb] hover:bg-[#ede9e0] border border-[#e5e3dc] rounded text-[11px] text-neutral-800"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#121212] hover:bg-neutral-800 text-white text-xs font-bold font-mono uppercase tracking-widest rounded transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Save Category & Publish"}
          </button>
        </div>

      </form>

    </div>
  );
}
