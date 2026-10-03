"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Layers,
  Plus,
  ExternalLink,
  Search,
  Eye,
  ShoppingBag,
  Edit,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
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

export default function AdminCollectionsPage() {
  const { collections, products, updateCollection, deleteCollection, addCollection } = useStore();
  const [search, setSearch] = useState("");

  // Edit Modal State
  const [editingCol, setEditingCol] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Create Modal State
  const [isCreating, setIsCreating] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "",
    handle: "",
    description: "",
    image_url: "/products/drive/Lemon Ceramic Vase with Handles.webp",
    display_order: 10,
  });
  const [savingNew, setSavingNew] = useState(false);

  // Dynamic real item count for any collection
  const getItemCount = (col) => {
    if (col.handle === "all-products" || col.handle === "all") {
      return products.length;
    }
    const h = (col.handle || "").toLowerCase();
    const t = (col.title || col.label || "").toLowerCase();
    return products.filter((p) => {
      const type = (p.product_type || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.map((x) => x.toLowerCase()) : [];
      return (
        type.includes(t) ||
        t.includes(type) ||
        cat.includes(t) ||
        t.includes(cat) ||
        type.includes(h) ||
        cat.includes(h) ||
        tags.includes(h) ||
        tags.includes(t)
      );
    }).length;
  };

  const filtered = collections.filter((c) =>
    (c.title || c.label || "").toLowerCase().includes(search.toLowerCase()) ||
    c.handle.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || "").toLowerCase().includes(search.toLowerCase())
  );

  // Open Edit Modal
  const handleOpenEdit = (col) => {
    setEditingCol(col);
    setEditForm({
      id: col.id || col.handle,
      title: col.title || col.label || "",
      handle: col.handle || "",
      description: col.description || "",
      image_url: col.image || col.image_url || "/products/drive/Lemon Ceramic Vase with Handles.webp",
      display_order: col.display_order ?? 10,
    });
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleCloseEdit = () => {
    setEditingCol(null);
    setEditForm(null);
    setSuccessMsg("");
    setErrorMsg("");
  };

  // Save Edit directly to Supabase
  const handleSaveEdit = async (e) => {
    if (e) e.preventDefault();
    if (!editForm.title.trim()) {
      alert("Category title cannot be empty.");
      return;
    }

    setSavingEdit(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const updates = {
        label: editForm.title.trim(),
        title: editForm.title.trim(),
        handle: editForm.handle.trim(),
        description: editForm.description.trim(),
        image_url: editForm.image_url.trim(),
        image: editForm.image_url.trim(),
        display_order: parseInt(editForm.display_order, 10) || 0,
      };

      await updateCollection(editForm.id || editingCol.handle, updates);
      setSuccessMsg("Category saved & synced to Supabase DB!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Failed to update category:", err);
      setErrorMsg("Failed to save changes in Supabase. Check console.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete category from Supabase
  const handleDelete = async (col) => {
    if (col.handle === "all-products") {
      alert("The 'All Objects' archive category cannot be deleted.");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete "${col.title || col.label}" from Supabase? This will remove it from the store navigation.`
      )
    ) {
      try {
        await deleteCollection(col.id || col.handle);
      } catch (err) {
        alert("Failed to delete category from Supabase.");
      }
    }
  };

  // Create new category directly in Supabase
  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    if (!newForm.title.trim()) {
      alert("Please enter a category title.");
      return;
    }

    setSavingNew(true);
    try {
      const slug =
        newForm.handle.trim() ||
        newForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      await addCollection({
        title: newForm.title.trim(),
        label: newForm.title.trim(),
        handle: slug,
        description: newForm.description.trim(),
        image_url: newForm.image_url.trim(),
        image: newForm.image_url.trim(),
        display_order: parseInt(newForm.display_order, 10) || 10,
      });

      setIsCreating(false);
      setNewForm({
        title: "",
        handle: "",
        description: "",
        image_url: "/products/drive/Lemon Ceramic Vase with Handles.webp",
        display_order: 10,
      });
    } catch (err) {
      alert("Failed to create category in Supabase.");
    } finally {
      setSavingNew(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[#e5e3dc]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Link href="/admin" className="hover:text-black">Admin</Link>
            <span>/</span>
            <span className="text-black font-semibold">Store Collections</span>
            <span className="text-neutral-300">•</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Supabase Real-Time
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#121212] mt-1">
            Categories &amp; Collections ({collections.length})
          </h1>
          <p className="text-xs font-mono text-neutral-500 mt-0.5">
            Add, edit, or delete categories directly synced to Supabase DB and storefront navigation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Category</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 sm:p-4 bg-white border border-[#e5e3dc] rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs font-mono text-xs">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name, handle, or bio..."
            className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded pl-9 pr-4 py-2 text-xs text-black placeholder:text-neutral-500 focus:outline-none focus:border-black focus:bg-white"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>
        <span className="text-neutral-500">
          {filtered.length} categories active in database
        </span>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((collection) => {
          const count = getItemCount(collection);
          const colImage = collection.image || collection.image_url || "/products/drive/Lemon Ceramic Vase with Handles.webp";

          return (
            <div
              key={collection.id || collection.handle}
              className="bg-white border border-[#e5e3dc] hover:border-black rounded overflow-hidden group transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                {/* Banner Thumbnail */}
                <div className="aspect-[16/9] w-full bg-neutral-100 relative overflow-hidden">
                  <img
                    src={colImage}
                    alt={collection.title || collection.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md rounded text-[10px] font-mono font-bold text-white shadow">
                      {count} {count === 1 ? "Object" : "Objects"}
                    </span>
                  </div>
                  {collection.handle === "all-products" && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#001540] text-white rounded text-[9px] font-mono font-bold uppercase tracking-wider shadow">
                      Master Archive
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 space-y-2">
                  <div className="text-[10px] font-mono text-[#001540] uppercase tracking-wider font-bold">
                    /collections/{collection.handle}
                  </div>
                  <h3 className="text-base font-bold uppercase text-[#121212] group-hover:text-[#001540] transition-colors">
                    {collection.title || collection.label}
                  </h3>
                  <p className="text-xs text-neutral-600 font-mono line-clamp-2 leading-relaxed">
                    {collection.description || "Artisanal homeware collection."}
                  </p>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="px-4 sm:px-5 py-3 bg-[#faf8f5] border-t border-[#e5e3dc] flex items-center justify-between text-xs font-mono">
                <Link
                  href={`/collections/${collection.handle}`}
                  target="_blank"
                  className="flex items-center gap-1 text-black font-semibold hover:text-[#001540] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Storefront ↗</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(collection)}
                    className="px-2.5 py-1 bg-[#121212] hover:bg-neutral-800 text-white rounded text-[11px] font-semibold inline-flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                    title="Edit category"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  {collection.handle !== "all-products" && (
                    <button
                      onClick={() => handleDelete(collection)}
                      className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-neutral-500 font-mono text-xs bg-white border border-[#e5e3dc] rounded">
            No categories matching &ldquo;{search}&rdquo;
          </div>
        )}
      </div>

      {/* EDIT CATEGORY MODAL */}
      {editingCol && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white border border-[#121212] shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e3dc] bg-[#faf8f5]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-[#121212] text-white rounded">
                  <Edit className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-[#121212] font-mono">
                    Edit Category // {editingCol.title || editingCol.label}
                  </h2>
                  <div className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Direct Supabase DB Update
                  </div>
                </div>
              </div>

              <button
                onClick={handleCloseEdit}
                className="p-1.5 hover:bg-neutral-200 text-neutral-700 hover:text-black rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Banner */}
            {successMsg && (
              <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="px-5 py-2.5 bg-rose-50 border-b border-rose-200 text-rose-900 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 font-mono text-xs">
              
              <div className="space-y-1.5">
                <label className="text-neutral-700 font-bold block">
                  Category Title / Label <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white"
                  placeholder="e.g. Tableware & Dining"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold block">
                    URL Handle / Slug
                  </label>
                  <input
                    type="text"
                    value={editForm.handle}
                    onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white"
                    placeholder="tableware"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold block">
                    Display Order (Sorting)
                  </label>
                  <input
                    type="number"
                    value={editForm.display_order}
                    onChange={(e) => setEditForm({ ...editForm, display_order: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 font-bold block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white"
                  placeholder="Artisanal ceramics and tableware for everyday living..."
                />
              </div>

              {/* Image URL & Preset Selection */}
              <div className="space-y-2">
                <label className="text-neutral-700 font-bold block">
                  Banner Image URL / Asset Path
                </label>
                <div className="flex gap-3 items-center">
                  <img
                    src={editForm.image_url || "/og-image.jpg"}
                    alt="Preview"
                    className="w-16 h-12 object-cover rounded border border-[#e5e3dc] bg-neutral-100 flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={editForm.image_url}
                    onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                    className="flex-1 bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white text-xs"
                    placeholder="/products/drive/3D Lemon Scalloped Serving Platter.webp"
                  />
                </div>

                {/* Quick Presets */}
                <div className="pt-1">
                  <span className="text-[10px] text-neutral-400 block mb-1">
                    Or select from studio webp presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {IMAGE_PRESETS.map((p) => (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, image_url: p.url })}
                        className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                          editForm.image_url === p.url
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

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#e5e3dc] bg-[#faf8f5] font-mono text-xs">
              <Link
                href={`/collections/${editForm.handle}`}
                target="_blank"
                className="text-neutral-500 hover:text-black inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Storefront ↗</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="px-4 py-2 border border-[#e5e3dc] hover:bg-neutral-100 text-neutral-700 rounded transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="px-5 py-2 bg-[#121212] hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded transition-colors shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {savingEdit ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white border border-[#121212] shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[92vh]">
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e3dc] bg-[#faf8f5]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-[#121212] text-white rounded">
                  <Plus className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-[#121212] font-mono">
                    Create New Category
                  </h2>
                  <div className="text-[11px] font-mono text-neutral-500">
                    Will be added to Supabase DB and customer navigation
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 hover:bg-neutral-200 text-neutral-700 hover:text-black rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-neutral-700 font-bold block">
                  Category Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                    setNewForm((prev) => ({
                      ...prev,
                      title,
                      handle: prev.handle === "" || prev.handle === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") ? autoSlug : prev.handle,
                    }));
                  }}
                  className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white"
                  placeholder="e.g. Sculptural Planters"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold block">
                    URL Handle
                  </label>
                  <input
                    type="text"
                    value={newForm.handle}
                    onChange={(e) => setNewForm({ ...newForm, handle: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white"
                    placeholder="sculptural-planters"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold block">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={newForm.display_order}
                    onChange={(e) => setNewForm({ ...newForm, display_order: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-700 font-bold block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newForm.description}
                  onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white"
                  placeholder="Handmade sculptural planters crafted from raw clay..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-neutral-700 font-bold block">
                  Banner Image
                </label>
                <div className="flex gap-3 items-center">
                  <img
                    src={newForm.image_url || "/og-image.jpg"}
                    alt="Preview"
                    className="w-16 h-12 object-cover rounded border border-[#e5e3dc] bg-neutral-100 flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={newForm.image_url}
                    onChange={(e) => setNewForm({ ...newForm, image_url: e.target.value })}
                    className="flex-1 bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white text-xs"
                    placeholder="/products/drive/Lemon Ceramic Vase.webp"
                  />
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-neutral-400 block mb-1">
                    Or click a preset:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {IMAGE_PRESETS.map((p) => (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => setNewForm({ ...newForm, image_url: p.url })}
                        className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                          newForm.image_url === p.url
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
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-[#e5e3dc] bg-[#faf8f5] font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-[#e5e3dc] hover:bg-neutral-100 text-neutral-700 rounded transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreate}
                disabled={savingNew}
                className="px-5 py-2 bg-[#121212] hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded transition-colors shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
              >
                {savingNew ? "Creating in Supabase..." : "Create Category"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
