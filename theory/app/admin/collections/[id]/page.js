"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getCategoryByHandle } from "@/lib/supabase";
import {
  ArrowLeft,
  Save,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Layers,
  ExternalLink,
} from "lucide-react";

const IMAGE_PRESETS = [
  { label: "Lemon Serving Platter", url: "/products/drive/3D Lemon Scalloped Serving Platter.webp" },
  { label: "Lemon Vase with Handles", url: "/products/drive/Lemon Ceramic Vase with Handles.webp" },
  { label: "Flower Plate", url: "/products/drive/Flower-Shaped Ceramic Decorative Plate.webp" },
  { label: "Lemon Planter", url: "/products/drive/Lemon Ceramic Vase  Planter.webp" },
  { label: "Ceramic Ashtray", url: "/products/drive/MARLBORO RED ASH TRAY CAMEL ASH TRAY CIGARETTE ASHTRAY.webp" },
  { label: "Tulip Garden Vase", url: "/products/drive/TT-176 Tulip Garden Ceramic Vase  Planter.webp" },
  { label: "Pomegranate Vase", url: "/products/drive/Pomegranate Ceramic Vase.webp" },
  { label: "Strawberry Pitcher", url: "/products/drive/Strawberry Ceramic Pitcher.webp" },
  { label: "Washed Linen Bedding", url: "/products/drive/ChatGPT Image Sep 17_ 2026_ 10_30_21 AM.webp" },
];

export default function EditCollectionPage({ params }) {
  const unwrappedParams = use(params);
  const collectionId = unwrappedParams?.id;
  const router = useRouter();
  const { collections, updateCollection, deleteCollection } = useStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    handle: "",
    description: "",
    image_url: "/products/drive/Lemon Ceramic Vase with Handles.webp",
    display_order: 10,
  });

  useEffect(() => {
    async function loadCollection() {
      setLoading(true);
      // 1. Try store collections
      const found = collections.find(
        (c) => String(c.id) === String(collectionId) || c.handle === collectionId
      );

      if (found) {
        setFormData({
          id: found.id || found.handle,
          title: found.title || found.label || "",
          handle: found.handle || "",
          description: found.description || "",
          image_url: found.image || found.image_url || "/products/drive/Lemon Ceramic Vase with Handles.webp",
          display_order: found.display_order ?? 10,
        });
        setLoading(false);
        return;
      }

      // 2. Fetch from DB
      try {
        const dbCol = await getCategoryByHandle(collectionId);
        if (dbCol) {
          setFormData({
            id: dbCol.id || dbCol.handle,
            title: dbCol.label || dbCol.title || "",
            handle: dbCol.handle || "",
            description: dbCol.description || "",
            image_url: dbCol.image_url || dbCol.image || "/products/drive/Lemon Ceramic Vase with Handles.webp",
            display_order: dbCol.display_order ?? 10,
          });
        } else {
          setErrorMsg("Category not found in database.");
        }
      } catch (err) {
        setErrorMsg("Failed to load category from Supabase.");
      } finally {
        setLoading(false);
      }
    }

    if (collectionId) {
      loadCollection();
    }
  }, [collectionId, collections]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a category title.");
      return;
    }

    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const updates = {
        label: formData.title.trim(),
        title: formData.title.trim(),
        handle: formData.handle.trim(),
        description: formData.description.trim(),
        image_url: formData.image_url.trim(),
        image: formData.image_url.trim(),
        display_order: parseInt(formData.display_order, 10) || 0,
      };

      await updateCollection(formData.id || collectionId, updates);
      setSuccessMsg("Category successfully saved to Supabase DB in real time!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg("Failed to save category. Please check console.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (formData.handle === "all-products") {
      alert("The 'All Objects' master category cannot be deleted.");
      return;
    }

    if (confirm(`Are you sure you want to delete "${formData.title}" from Supabase?`)) {
      try {
        await deleteCollection(formData.id || collectionId);
        router.push("/admin/collections");
      } catch (err) {
        alert("Failed to delete category.");
      }
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-neutral-500 space-y-3">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Loading category details from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 font-mono text-xs">
      
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
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Link href="/admin" className="hover:text-black">Admin</Link>
              <span>/</span>
              <Link href="/admin/collections" className="hover:text-black">Categories</Link>
              <span>/</span>
              <span className="text-black font-semibold">Edit</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#121212] mt-0.5">
              {formData.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/collections/${formData.handle}`}
            target="_blank"
            className="px-3 py-2 bg-[#f5f2eb] hover:bg-[#ede9e0] text-black rounded border border-[#e5e3dc] transition-colors inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Storefront ↗</span>
          </Link>

          {formData.handle !== "all-products" && (
            <button
              onClick={handleDelete}
              className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded transition-colors"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-[#121212] hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded transition-colors shadow-sm disabled:opacity-50 inline-flex items-center gap-2 text-xs"
          >
            {saving ? "Saving to Supabase..." : "Save Changes"}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-300 rounded text-rose-900 flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Edit Form */}
      <div className="bg-white border border-[#e5e3dc] rounded p-6 space-y-5 shadow-xs">
        
        <div className="space-y-1.5">
          <label className="text-neutral-700 font-bold block">
            Category Title / Label <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-neutral-700 font-bold block">
              URL Handle / Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-xs">/collections/</span>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                className="flex-1 bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-700 font-bold block">
              Display Order
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
              className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-neutral-700 font-bold block">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white text-xs"
            placeholder="Artisanal ceramics and living objects..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-neutral-700 font-bold block">
            Banner Image
          </label>
          <div className="flex gap-4 items-center">
            <img
              src={formData.image_url || "/og-image.jpg"}
              alt="Preview"
              className="w-24 h-16 object-cover rounded border border-[#e5e3dc] bg-neutral-100 flex-shrink-0"
            />
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="flex-1 bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white text-xs"
              placeholder="/products/drive/Lemon Ceramic Vase with Handles.webp"
            />
          </div>

          <div className="pt-2">
            <span className="text-[10px] text-neutral-400 block mb-1">
              Select from studio image presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {IMAGE_PRESETS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: p.url })}
                  className={`px-2.5 py-1 rounded text-[10px] border transition-colors ${
                    formData.image_url === p.url
                      ? "bg-[#121212] text-white border-black font-bold"
                      : "bg-[#f5f2eb] hover:bg-neutral-200 border-[#e5e3dc] text-neutral-700"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#e5e3dc] flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#121212] hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded transition-colors shadow-sm disabled:opacity-50 text-xs"
          >
            {saving ? "Saving to Supabase..." : "Save Category Changes"}
          </button>
        </div>

      </div>

    </div>
  );
}
