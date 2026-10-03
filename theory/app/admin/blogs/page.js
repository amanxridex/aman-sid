"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Plus,
  Trash2,
  ExternalLink,
  FileText,
  Calendar,
  Clock,
  User,
  CheckCircle,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Edit,
  Save,
  X,
  ArrowRight,
  Globe,
  Sliders,
  Check,
} from "lucide-react";

export default function AdminBlogsPage() {
  const {
    blogPosts = [],
    storeSettings,
    updateStoreSettings,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    toggleBlogPostPublish,
    refreshData,
    loading,
  } = useStore();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'published' | 'draft'
  const [refreshing, setRefreshing] = useState(false);
  const [togglingVisibility, setTogglingVisibility] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [savingPost, setSavingPost] = useState(false);
  const [postForm, setPostForm] = useState({
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

  const handleToggleJournalVisibility = async () => {
    setTogglingVisibility(true);
    try {
      await updateStoreSettings({
        ...storeSettings,
        journal_visible: !isJournalVisible,
      });
    } catch (err) {
      alert("Failed to update journal visibility: " + err.message);
    } finally {
      setTogglingVisibility(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteBlogPost(id);
    } catch (err) {
      alert("Failed to delete post: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (post) => {
    try {
      await toggleBlogPostPublish(post.id, post.published !== false);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Open Editor for New Post
  const handleOpenNewModal = () => {
    setEditingPost(null);
    setPostForm({
      title: "",
      handle: "",
      excerpt: "",
      content: "",
      image: "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/06_f701ce34-3d80-4167-87f5-e3dd0ec7dc5f.jpg?v=1765797590&width=800",
      read_time: "4 min read",
      author: "Derick Martin",
      published: true,
    });
    setIsEditorOpen(true);
  };

  // Open Editor for Existing Post
  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title || "",
      handle: post.handle || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      image: post.image || "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/06_f701ce34-3d80-4167-87f5-e3dd0ec7dc5f.jpg?v=1765797590&width=800",
      read_time: post.read_time || post.readTime || "4 min read",
      author: post.author || "Derick Martin",
      published: post.published !== false,
    });
    setIsEditorOpen(true);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setPostForm((prev) => ({
      ...prev,
      title,
      handle: prev.handle === "" || prev.handle === generateSlug(prev.title) ? generateSlug(title) : prev.handle,
    }));
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!postForm.title.trim()) {
      alert("Please enter an article title");
      return;
    }

    setSavingPost(true);
    try {
      if (editingPost) {
        await updateBlogPost(editingPost.id, postForm);
      } else {
        await addBlogPost(postForm);
      }
      setIsEditorOpen(false);
    } catch (err) {
      alert("Error saving article: " + (err.message || "Unknown error"));
    } finally {
      setSavingPost(false);
    }
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (post.title || "").toLowerCase().includes(q) ||
        (post.excerpt || "").toLowerCase().includes(q) ||
        (post.handle || "").toLowerCase().includes(q) ||
        (post.author || "").toLowerCase().includes(q);

      if (!matchesSearch) return false;

      const isPublished = post.published !== false;
      if (filterStatus === "published") return isPublished;
      if (filterStatus === "draft") return !isPublished;
      return true;
    });
  }, [blogPosts, search, filterStatus]);

  const publishedCount = blogPosts.filter((p) => p.published !== false).length;
  const draftsCount = blogPosts.filter((p) => p.published === false).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5e3dc]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Link href="/admin" className="hover:text-black">Admin</Link>
            <span>/</span>
            <span className="text-black font-semibold">Journal &amp; Editorial</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#121212]">
              Journal Articles ({blogPosts.length})
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Supabase DB Live
            </span>
          </div>
          <p className="text-xs font-mono text-neutral-500 mt-1">
            Publish brand stories, design investigations, and living philosophy articles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="p-2 border border-[#e5e3dc] bg-white rounded text-neutral-600 hover:text-black hover:bg-[#f5f2eb] transition-colors"
            title="Refresh articles from Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#001540]" : ""}`} />
          </button>

          <button
            onClick={handleOpenNewModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* MASTER JOURNAL VISIBILITY CONTROLLER CARD */}
      <div className={`p-5 sm:p-6 rounded border transition-all shadow-xs ${
        isJournalVisible
          ? "bg-white border-emerald-300 ring-1 ring-emerald-500/10"
          : "bg-[#fffdf8] border-amber-300 ring-1 ring-amber-500/10"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isJournalVisible ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}>
                {isJournalVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-neutral-400 block">
                  Public Storefront Visibility
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold uppercase text-[#121212] tracking-tight">
                    Store Journal Page:
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                    isJournalVisible
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}>
                    {isJournalVisible ? "● Live On Store" : "○ Hidden From Customers"}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs font-mono text-neutral-600 max-w-2xl leading-relaxed">
              {isJournalVisible
                ? "The Journal is currently visible on the public store (in the header & footer navigation, and at /blogs/news). Visitors can read all published articles."
                : "The Journal is currently HIDDEN from normal visitors (hidden from header & footer, showing preparation notice on /blogs/news). All articles remain 100% active, editable, and manageable here in the admin desk."}
            </p>
          </div>

          {/* Toggle Switch & Preview */}
          <div className="flex items-center gap-3 self-start md:self-center flex-shrink-0">
            <Link
              href="/blogs/news"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#f5f2eb] hover:bg-[#eae6dd] border border-[#e5e3dc] rounded text-xs font-mono text-neutral-800 font-semibold transition-colors"
            >
              <span>Preview Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </Link>

            <button
              type="button"
              onClick={handleToggleJournalVisibility}
              disabled={togglingVisibility}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                isJournalVisible ? "bg-emerald-600" : "bg-neutral-300"
              }`}
              title="Toggle Journal Visibility"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${
                  isJournalVisible ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 sm:p-4 bg-white border border-[#e5e3dc] rounded flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search article title, excerpt, slug, author..."
            className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded pl-9 pr-4 py-2 text-xs font-mono text-black placeholder:text-neutral-500 focus:outline-none focus:border-black focus:bg-white transition-colors"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto text-xs font-mono">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded transition-colors text-xs font-medium ${
              filterStatus === "all"
                ? "bg-[#121212] text-white font-bold"
                : "bg-[#f5f2eb] text-neutral-600 hover:text-black"
            }`}
          >
            All ({blogPosts.length})
          </button>
          <button
            onClick={() => setFilterStatus("published")}
            className={`px-3 py-1.5 rounded transition-colors text-xs font-medium ${
              filterStatus === "published"
                ? "bg-emerald-700 text-white font-bold"
                : "bg-[#f5f2eb] text-neutral-600 hover:text-black"
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setFilterStatus("draft")}
            className={`px-3 py-1.5 rounded transition-colors text-xs font-medium ${
              filterStatus === "draft"
                ? "bg-amber-800 text-white font-bold"
                : "bg-[#f5f2eb] text-neutral-600 hover:text-black"
            }`}
          >
            Drafts ({draftsCount})
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white border border-[#e5e3dc] rounded shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center font-mono text-xs text-neutral-500">
            Syncing Journal articles with Supabase...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-16 text-center space-y-4 font-mono">
            <FileText className="w-10 h-10 text-neutral-300 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold uppercase text-[#121212]">
                No Journal Articles Found
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {search ? "No articles match your search filter." : "Write your first journal post to publish design dispatches directly to Supabase."}
              </p>
            </div>
            <button
              onClick={handleOpenNewModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121212] hover:bg-neutral-800 text-white text-xs uppercase font-bold tracking-wider rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Article</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#e5e3dc]">
            {filteredPosts.map((post) => {
              const isPublished = post.published !== false;

              return (
                <div
                  key={post.id || post.handle}
                  className="p-4 sm:p-6 hover:bg-[#faf8f5] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Cover Thumbnail */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded bg-neutral-100 overflow-hidden flex-shrink-0 border border-[#e5e3dc]">
                      <img
                        src={post.image || "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/06_f701ce34-3d80-4167-87f5-e3dd0ec7dc5f.jpg?v=1765797590&width=800"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 flex-wrap">
                        {/* Published / Draft Pill Button */}
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(post)}
                          className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors border ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                          }`}
                          title="Click to toggle Published / Draft status"
                        >
                          {isPublished ? "● Published" : "○ Draft"}
                        </button>

                        <span>•</span>
                        <span>
                          {post.created_at
                            ? new Date(post.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Journal Archive"}
                        </span>
                        <span>•</span>
                        <span>{post.read_time || post.readTime || "4 min read"}</span>
                        <span>•</span>
                        <span className="text-black font-semibold">{post.author || "Derick Martin"}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#121212] tracking-tight">
                        {post.title}
                      </h3>

                      <p className="text-xs text-neutral-600 line-clamp-2 font-mono leading-relaxed max-w-3xl">
                        {post.excerpt}
                      </p>

                      <div className="text-[10px] font-mono text-neutral-400">
                        URL Slug: <strong className="text-neutral-700">/blogs/news/{post.handle}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(post)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 border border-[#e5e3dc] rounded text-xs font-mono text-neutral-800 font-semibold transition-colors"
                      title="Edit Article"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <Link
                      href={`/blogs/news/${post.handle}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#f5f2eb] hover:bg-[#eae6dd] border border-[#e5e3dc] rounded text-xs font-mono text-black font-semibold transition-colors"
                      title="Open Live Post"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500" />
                    </Link>

                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deletingId === post.id}
                      className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* COMPOSER / EDIT MODAL (Syncs with Supabase in real time) */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-white border border-[#e5e3dc] rounded-lg shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#e5e3dc] bg-[#faf8f5] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold uppercase tracking-tight text-[#121212]">
                  {editingPost ? "Edit Journal Article" : "Compose New Journal Article"}
                </h2>
                <p className="text-xs font-mono text-neutral-500">
                  {editingPost ? `Updating #${editingPost.id} directly in Supabase` : "Saving new dispatch to Supabase database"}
                </p>
              </div>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded hover:bg-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePost} className="p-6 space-y-4 overflow-y-auto flex-1 font-mono text-xs">
              <div>
                <label className="block uppercase text-neutral-600 mb-1 font-semibold">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={postForm.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Raw Earth & Fire: The Philosophy Behind Monolith Vases"
                  className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded p-2.5 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-neutral-600 mb-1 font-semibold">
                    URL Slug / Handle *
                  </label>
                  <input
                    type="text"
                    required
                    value={postForm.handle}
                    onChange={(e) => setPostForm({ ...postForm, handle: e.target.value })}
                    placeholder="raw-earth-and-fire"
                    className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded p-2 text-xs text-black focus:outline-none focus:border-black focus:bg-white"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Path: /blogs/news/{postForm.handle || "slug"}
                  </span>
                </div>

                <div>
                  <label className="block uppercase text-neutral-600 mb-1 font-semibold">
                    Author
                  </label>
                  <input
                    type="text"
                    value={postForm.author}
                    onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                    placeholder="Derick Martin"
                    className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded p-2 text-xs text-black focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-neutral-600 mb-1 font-semibold">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={postForm.read_time}
                    onChange={(e) => setPostForm({ ...postForm, read_time: e.target.value })}
                    placeholder="4 min read"
                    className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded p-2 text-xs text-black focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block uppercase text-neutral-600 mb-1 font-semibold">
                    Publication Status
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setPostForm({ ...postForm, published: !postForm.published })}
                      className={`px-3 py-1.5 rounded font-bold transition-colors ${
                        postForm.published
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {postForm.published ? "✓ Published Live" : "○ Saved as Draft"}
                    </button>
                    <span className="text-[10px] text-neutral-400">
                      {postForm.published ? "Will appear in store journal" : "Only visible to admin"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block uppercase text-neutral-600 mb-1 font-semibold">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={postForm.image}
                  onChange={(e) => setPostForm({ ...postForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded p-2 text-xs text-black focus:outline-none focus:border-black focus:bg-white"
                />
                {postForm.image && (
                  <div className="mt-2 h-28 w-44 rounded overflow-hidden border border-[#e5e3dc] bg-neutral-100">
                    <img src={postForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block uppercase text-neutral-600 mb-1 font-semibold">
                  Short Excerpt / Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                  placeholder="Brief 1-2 sentence overview shown on article cards and social previews..."
                  className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded p-2.5 text-xs text-black focus:outline-none focus:border-black focus:bg-white font-sans"
                />
              </div>

              <div>
                <label className="block uppercase text-neutral-600 mb-1 font-semibold">
                  Full Article Body (Markdown / Multi-Paragraph)
                </label>
                <textarea
                  rows={8}
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  placeholder="Write the full narrative of the article here. Separate paragraphs with double newlines..."
                  className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded p-3 text-xs text-black focus:outline-none focus:border-black focus:bg-white font-mono leading-relaxed"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#e5e3dc] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-[#e5e3dc] text-neutral-600 hover:text-black hover:bg-neutral-100 rounded text-xs font-bold uppercase transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingPost}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingPost ? "Saving to Supabase..." : editingPost ? "Save Changes" : "Publish Article"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
