"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  MessageSquare,
  Search,
  Mail,
  Phone,
  Calendar,
  Trash2,
  ExternalLink,
  RefreshCw,
  Send,
  CheckCircle2,
  Clock,
  ArrowLeft,
  User,
  HelpCircle,
  Copy,
  Check,
  Filter,
} from "lucide-react";

export default function AdminInquiriesPage() {
  const { inquiries = [], deleteInquiry, refreshData, loading } = useStore();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'whatsapp' | 'email'
  const [selectedId, setSelectedId] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Filter inquiries
  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const q = search.toLowerCase();
      const matchesSearch =
        (inq.name || "").toLowerCase().includes(q) ||
        (inq.email || "").toLowerCase().includes(q) ||
        (inq.phone || "").toLowerCase().includes(q) ||
        (inq.subject || "").toLowerCase().includes(q) ||
        (inq.message || "").toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (activeTab === "whatsapp") return !!inq.phone;
      if (activeTab === "email") return !inq.phone;
      return true;
    });
  }, [inquiries, search, activeTab]);

  // Set default selected inquiry
  const selectedInquiry = useMemo(() => {
    if (selectedId) {
      const found = inquiries.find((i) => i.id === selectedId);
      if (found) return found;
    }
    return filtered.length > 0 ? filtered[0] : null;
  }, [selectedId, inquiries, filtered]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this inquiry? It will be removed from your active admin desk and synced with Supabase.")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteInquiry(id);
      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (err) {
      alert("Failed to delete inquiry. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text, field) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Quick reply helpers
  const getWhatsAppLink = (inquiry, customMsg = "") => {
    if (!inquiry?.phone) return "#";
    const cleanPhone = inquiry.phone.replace(/[^0-9]/g, "");
    const baseText = customMsg.trim() || `Hi ${inquiry.name || "there"}, thank you for contacting The Cozy Theory regarding "${inquiry.subject || "your inquiry"}". We're happy to assist you!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(baseText)}`;
  };

  const getEmailLink = (inquiry, customMsg = "") => {
    if (!inquiry?.email) return "#";
    const subject = encodeURIComponent(`Re: ${inquiry.subject || "Your Inquiry - The Cozy Theory"}`);
    const body = encodeURIComponent(customMsg.trim() || `Hi ${inquiry.name || "there"},\n\nThank you for reaching out to The Cozy Theory.\n\nBest regards,\nCustomer Care Team\nThe Cozy Theory\n+91-7558085343\nthecozytheory.store@gmail.com`);
    return `mailto:${inquiry.email}?subject=${subject}&body=${body}`;
  };

  const insertQuickTemplate = (text) => {
    setReplyMessage(text);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[#e5e3dc]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Link href="/admin" className="hover:text-black">Admin</Link>
            <span>/</span>
            <span className="text-black font-semibold">Support Desk</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#121212]">
              Customer Inquiries &amp; Chat ({inquiries.length})
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Supabase Sync
            </span>
          </div>
          <p className="text-xs font-mono text-neutral-500 mt-1">
            Inquiries transmitted via the contact page. Direct WhatsApp and Email chat integration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-[#e5e3dc] rounded text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#001540]" : ""}`} />
            <span>{refreshing ? "Syncing..." : "Refresh"}</span>
          </button>

          <Link
            href="/pages/contact"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors shadow-xs"
          >
            <span>View Contact Page</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </Link>
        </div>
      </div>

      {/* Main Workspace Layout (2 Panes: List + Conversation View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        
        {/* Left Pane: Inquiries List & Filters (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          
          {/* Search & Tabs */}
          <div className="p-3 bg-white border border-[#e5e3dc] rounded space-y-3 shadow-xs">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, email, query..."
                className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded pl-9 pr-3 py-2 text-xs font-mono text-black placeholder:text-neutral-500 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] font-medium ${
                  activeTab === "all"
                    ? "bg-[#121212] text-white"
                    : "bg-[#f5f2eb] text-neutral-600 hover:text-black"
                }`}
              >
                All ({inquiries.length})
              </button>
              <button
                onClick={() => setActiveTab("whatsapp")}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] font-medium flex items-center gap-1 ${
                  activeTab === "whatsapp"
                    ? "bg-[#25D366] text-white"
                    : "bg-[#f5f2eb] text-neutral-600 hover:text-black"
                }`}
              >
                <span>WhatsApp</span>
                <span className="text-[10px] opacity-80">({inquiries.filter((i) => !!i.phone).length})</span>
              </button>
              <button
                onClick={() => setActiveTab("email")}
                className={`px-2.5 py-1 rounded transition-colors text-[11px] font-medium ${
                  activeTab === "email"
                    ? "bg-[#001540] text-white"
                    : "bg-[#f5f2eb] text-neutral-600 hover:text-black"
                }`}
              >
                Email Only ({inquiries.filter((i) => !i.phone).length})
              </button>
            </div>
          </div>

          {/* Inquiry Cards List */}
          <div className="flex-1 overflow-y-auto max-h-[620px] space-y-2 pr-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center bg-white border border-[#e5e3dc] rounded space-y-3">
                <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto" />
                <div className="text-xs font-mono font-bold uppercase text-neutral-600">
                  No inquiries found
                </div>
                <p className="text-[11px] font-mono text-neutral-400">
                  {search ? "No inquiries match your search filter." : "Inquiries submitted via the store contact form will appear here in real time."}
                </p>
              </div>
            ) : (
              filtered.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                const initials = (inq.name || "Visitor")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedId(inq.id)}
                    className={`p-3.5 rounded border transition-all cursor-pointer relative group ${
                      isSelected
                        ? "bg-white border-[#121212] shadow-sm ring-1 ring-black/5"
                        : "bg-white border-[#e5e3dc] hover:border-neutral-400 hover:bg-[#faf9f5]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-[#121212] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#121212] truncate">
                            {inq.name || "Store Visitor"}
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-400 block truncate">
                            {inq.email}
                          </span>
                        </div>
                      </div>

                      {/* Date/Time badge */}
                      <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {inq.dateFormatted || "Recent"}
                      </span>
                    </div>

                    {/* Subject badge */}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 bg-[#f5f2eb] text-neutral-700 rounded border border-[#e5e3dc] truncate max-w-[200px]">
                        {inq.subject || "General Inquiry"}
                      </span>

                      {inq.phone && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          WhatsApp
                        </span>
                      )}
                    </div>

                    {/* Message Preview */}
                    <p className="mt-2 text-xs text-neutral-600 line-clamp-2 font-mono leading-relaxed">
                      {inq.message || inq.cleanMessage}
                    </p>

                    {/* Delete Shortcut */}
                    <button
                      onClick={(e) => handleDelete(inq.id, e)}
                      disabled={deletingId === inq.id}
                      title="Delete inquiry"
                      className="absolute right-3 bottom-3 p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Selected Conversation View & Quick Reply (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white border border-[#e5e3dc] rounded shadow-xs overflow-hidden">
          {selectedInquiry ? (
            <div className="flex flex-col h-full">
              
              {/* Header: Customer Profile & Action Toolbar */}
              <div className="p-4 sm:p-5 border-b border-[#e5e3dc] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#121212] text-white flex items-center justify-center font-extrabold text-sm shadow-xs flex-shrink-0">
                    {(selectedInquiry.name || "V")
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-extrabold uppercase text-[#121212] tracking-tight">
                        {selectedInquiry.name || "Store Visitor"}
                      </h2>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-200 text-neutral-800 rounded font-semibold">
                        Inquiry #{selectedInquiry.id}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-500 mt-0.5">
                      <span className="flex items-center gap-1 text-neutral-700">
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        <a href={`mailto:${selectedInquiry.email}`} className="hover:underline hover:text-[#001540]">
                          {selectedInquiry.email}
                        </a>
                      </span>
                      {selectedInquiry.phone && (
                        <span className="flex items-center gap-1 text-neutral-700">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <a href={`tel:${selectedInquiry.phone}`} className="hover:underline font-bold">
                            {selectedInquiry.phone}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {selectedInquiry.phone && (
                    <a
                      href={getWhatsAppLink(selectedInquiry, replyMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#1fb355] text-white rounded text-xs font-mono font-bold uppercase transition-colors shadow-xs"
                      title="Open WhatsApp Chat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Chat</span>
                    </a>
                  )}

                  <a
                    href={getEmailLink(selectedInquiry, replyMessage)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono font-bold uppercase transition-colors shadow-xs"
                    title="Send Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Reply</span>
                  </a>

                  <button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    disabled={deletingId === selectedInquiry.id}
                    className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded border border-[#e5e3dc] transition-colors"
                    title="Delete Inquiry from DB"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat & Message Stream Area */}
              <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 bg-[#fffdf8]">
                
                {/* Meta details bar */}
                <div className="p-3 bg-white border border-[#e5e3dc] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-neutral-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black uppercase">Subject:</span>
                    <span className="text-neutral-800 font-semibold">{selectedInquiry.subject || "General Inquiry"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      {selectedInquiry.dateFormatted || "Recent"}
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedInquiry.message || selectedInquiry.cleanMessage, "msg")}
                      className="text-neutral-400 hover:text-black flex items-center gap-1 text-[11px]"
                      title="Copy query text"
                    >
                      {copiedField === "msg" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === "msg" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Customer Message Bubble */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#001540]"></span>
                    <span>Incoming Customer Message</span>
                  </div>

                  <div className="bg-white border-2 border-neutral-900 rounded-lg p-5 shadow-xs relative">
                    <p className="text-sm text-[#121212] leading-relaxed whitespace-pre-line font-mono font-medium">
                      {selectedInquiry.message || selectedInquiry.cleanMessage}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#e5e3dc] flex items-center justify-between text-[11px] font-mono text-neutral-500">
                      <span>Sender: <strong>{selectedInquiry.name}</strong></span>
                      <span>Verified Webhook Contact Form</span>
                    </div>
                  </div>
                </div>

                {/* Quick Info Box (Address & Support info) */}
                <div className="p-4 bg-[#faf8f5] border border-[#e5e3dc] rounded text-xs font-mono space-y-2 text-neutral-600">
                  <div className="flex items-center gap-2 text-black font-bold uppercase text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Store Response Credentials</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-neutral-400">Official Helpline:</span>{" "}
                      <strong className="text-black">+91-7558085343</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400">Support Mail:</span>{" "}
                      <strong className="text-black">thecozytheory.store@gmail.com</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-neutral-400">Registered Office:</span>{" "}
                      <span>Building No. 3/435, KARIKODE, MULANTHURUTHY, Kanayannur, Ernakulam, Kerala - 682314</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Quick Reply Workspace */}
              <div className="p-4 sm:p-5 border-t border-[#e5e3dc] bg-white space-y-3">
                
                {/* One-click Reply Templates */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-semibold mr-1">
                    Templates:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      insertQuickTemplate(
                        `Hi ${selectedInquiry.name || "there"}, thank you for reaching out to The Cozy Theory! We have received your query regarding "${selectedInquiry.subject || "our products"}" and would love to assist you.`
                      )
                    }
                    className="px-2.5 py-1 bg-[#f5f2eb] hover:bg-[#ede9e0] text-neutral-800 rounded text-[11px] font-mono transition-colors"
                  >
                    Greeting &amp; Acknowledgment
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertQuickTemplate(
                        `Hello ${selectedInquiry.name || "there"}, regarding your order inquiry: all pieces are carefully packed and dispatched with real-time tracking updates sent straight to your phone and email.`
                      )
                    }
                    className="px-2.5 py-1 bg-[#f5f2eb] hover:bg-[#ede9e0] text-neutral-800 rounded text-[11px] font-mono transition-colors"
                  >
                    Order Status
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertQuickTemplate(
                        `Hi ${selectedInquiry.name || "there"}, thank you for considering The Cozy Theory for bulk gifting! We offer specialized bespoke curation for interior spaces and events. Let us know your estimated quantity.`
                      )
                    }
                    className="px-2.5 py-1 bg-[#f5f2eb] hover:bg-[#ede9e0] text-neutral-800 rounded text-[11px] font-mono transition-colors"
                  >
                    Bulk / Custom Gifting
                  </button>
                </div>

                {/* Reply Input Draft */}
                <div className="relative">
                  <textarea
                    rows={3}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Draft your reply here to send directly via WhatsApp or Email..."
                    className="w-full bg-[#f8f6f0] border border-[#e5e3dc] rounded p-3 text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>

                {/* Send Actions */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] font-mono text-neutral-400">
                    {selectedInquiry.phone ? "Direct WhatsApp Web/App & Email dispatch enabled" : "Email reply dispatch enabled"}
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedInquiry.phone && (
                      <a
                        href={getWhatsAppLink(selectedInquiry, replyMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#1fb355] text-white rounded text-xs font-mono font-bold uppercase transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send WhatsApp</span>
                      </a>
                    )}

                    <a
                      href={getEmailLink(selectedInquiry, replyMessage)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono font-bold uppercase transition-colors shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Email</span>
                    </a>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3 bg-[#faf8f5]">
              <div className="w-12 h-12 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase text-[#121212] font-mono">
                Select an Inquiry
              </h3>
              <p className="text-xs font-mono text-neutral-500 max-w-sm">
                Choose an inquiry from the left list to review customer message details, view contact information, and respond via WhatsApp or Email.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
