"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, CheckCircle } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function NewBlogPostPage() {
  const router = useRouter();
  const { addBlogPost, storeSettings } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    excerpt: "",
    content: "",
    image: "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/06_f701ce34-3d80-4167-87f5-e3dd0ec7dc5f.jpg?v=1765797590&width=800",
    read_time: "4 min read",
    author: "Derick Martin",
    published: true,
  });

  const isJournalVisible = storeSettings?.journal_visible !== false;

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      handle: prev.handle === "" || prev.handle === generateSlug(prev.title) ? generateSlug(title) : prev.handle,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter an article title");
      return;
    }

    setSubmitting(true);
    try {
      await addBlogPost(formData);
      router.push("/admin/blogs");
    } catch (err) {
      alert("Failed to publish blog post: " + (err.message || "Unknown error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#e5e3dc]">
        <div>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Journal</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#121212] mt-2">
            Compose Journal Article
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-all shadow-sm disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{submitting ? "Publishing..." : "Publish Article"}</span>
        </button>
      </div>

      {/* Journal Visibility Context Alert */}
      <div className={`p-4 rounded border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isJournalVisible ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"
      }`}>
        <div className="flex items-center gap-2">
          {isJournalVisible ? <Eye className="w-4 h-4 text-emerald-700" /> : <EyeOff className="w-4 h-4 text-amber-700" />}
          <span>
            Storefront Journal is currently <strong>{isJournalVisible ? "LIVE ON STORE (Visible to Visitors)" : "HIDDEN FROM VISITORS (Admin Preparation Mode)"}</strong>.
          </span>
        </div>
        <Link href="/admin/blogs" className="underline font-bold hover:text-black">
          Manage Visibility Settings →
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Article Details Card */}
        <div className="bg-white border border-[#e5e3dc] rounded p-6 space-y-4 shadow-xs">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-500 mb-1 font-semibold">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g., Raw Clay & Fire: The Philosophy Behind Monolith Vases"
              className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-4 py-2.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1 font-semibold">
                URL Handle / Slug
              </label>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder="raw-clay-and-fire"
                className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-4 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
              />
              <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                Live URL: /blogs/news/{formData.handle || "slug"}
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1 font-semibold">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-4 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1 font-semibold">
                Reading Time
              </label>
              <input
                type="text"
                value={formData.read_time}
                onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                placeholder="4 min read"
                className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-4 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1 font-semibold">
                Publication Status
              </label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, published: !formData.published })}
                  className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-colors ${
                    formData.published
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-600 text-white"
                  }`}
                >
                  {formData.published ? "✓ Published Live" : "○ Save as Draft"}
                </button>
                <span className="text-[10px] font-mono text-neutral-400">
                  {formData.published ? "Will appear in store journal" : "Visible only in admin"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-500 mb-1 font-semibold">
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-4 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
            />
            {formData.image && (
              <div className="mt-2 h-32 w-56 rounded overflow-hidden border border-[#e5e3dc] bg-neutral-100">
                <img src={formData.image} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-500 mb-1 font-semibold">
              Short Excerpt (Summary for Cards &amp; SEO)
            </label>
            <textarea
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A brief 1-2 sentence teaser that introduces the thought process..."
              className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded p-3 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-500 mb-1 font-semibold">
              Article Content (Paragraphs separated by blank lines)
            </label>
            <textarea
              rows={10}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write the article here. You can separate paragraphs with an empty line..."
              className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded p-4 text-xs font-mono leading-relaxed text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/blogs"
            className="px-5 py-2.5 bg-[#f5f2eb] hover:bg-[#ede9e0] border border-[#e5e3dc] text-neutral-700 rounded text-xs font-mono uppercase transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-all disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "Publish Article"}
          </button>
        </div>

      </form>

    </div>
  );
}
