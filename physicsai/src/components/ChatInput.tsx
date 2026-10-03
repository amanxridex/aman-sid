"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowUp, Square, Zap, Paperclip, X, FileText, Loader2, Globe, Search } from "lucide-react";
import { AttachedDoc } from "@/lib/types";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  attachments: AttachedDoc[];
  onAddAttachment: (doc: AttachedDoc) => void;
  onRemoveAttachment: (id: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({
  input,
  setInput,
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  onSubmit,
  onStop,
  isStreaming,
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Web & PDF crawler states
  const [showCrawlDialog, setShowCrawlDialog] = useState(false);
  const [crawlUrlInput, setCrawlUrlInput] = useState("");
  const [crawlQueryInput, setCrawlQueryInput] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 220);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && (input.trim() || attachments.length > 0)) {
        onSubmit();
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected if removed
    e.target.value = "";
    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-document", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process document");
      }

      const doc: AttachedDoc = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        name: data.name,
        type: data.type,
        size: data.size,
        content: data.text,
        wordCount: data.wordCount,
        pageCount: data.pageCount,
      };

      onAddAttachment(doc);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to parse document");
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCrawlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = crawlUrlInput.trim();
    if (!url) return;

    setUploadError(null);
    setIsCrawling(true);

    try {
      const res = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          searchQuery: crawlQueryInput.trim(),
          deepCrawlDocs: true,
          maxDocs: 4,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to crawl target URL");
      }

      // Format combined text
      let combinedContent = `Source URL: ${data.url}\nTitle: ${data.title}\n\n${data.content}`;
      if (data.linkedDocs && data.linkedDocs.length > 0) {
        combinedContent += "\n\n--- EXTRACTED DOCUMENTS FOUND ON SITE ---\n";
        for (const ld of data.linkedDocs) {
          combinedContent += `\n[FILE: ${ld.name} (${ld.url}) • ${ld.pageCount ? ld.pageCount + " pages, " : ""}${ld.wordCount} words]\n${ld.content}\n`;
          if (ld.matchedSnippets && ld.matchedSnippets.length > 0) {
            combinedContent += `\nTop Keyword Matches for "${crawlQueryInput.trim()}":\n${ld.matchedSnippets.join("\n...\n")}\n`;
          }
        }
        combinedContent += "\n--- END OF EXTRACTED DOCUMENTS ---\n";
      }

      const docName = data.title ? `${data.title.slice(0, 35)}` : "Web Resource";
      const doc: AttachedDoc = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        name: docName,
        type: "crawl",
        url: data.url,
        size: combinedContent.length,
        content: combinedContent,
        wordCount: data.wordCount,
        linkedDocsCount: data.linkedDocs?.length || 0,
      };

      onAddAttachment(doc);
      setCrawlUrlInput("");
      setCrawlQueryInput("");
      setShowCrawlDialog(false);
    } catch (err: any) {
      console.error("Crawl error:", err);
      setUploadError(err.message || "Failed to crawl target URL");
      setTimeout(() => setUploadError(null), 6000);
    } finally {
      setIsCrawling(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const canSubmit = (input.trim().length > 0 || attachments.length > 0) && !disabled && !isUploading && !isCrawling;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* Upload or Crawl Error Banner */}
      {uploadError && (
        <div className="mb-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between animate-in fade-in duration-150">
          <span>⚠️ {uploadError}</span>
          <button onClick={() => setUploadError(null)} className="p-0.5 hover:bg-red-100 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Crawl Web & Documents Dialog Bar */}
      {showCrawlDialog && (
        <form
          onSubmit={handleCrawlSubmit}
          className="mb-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-200 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Crawl Website & Search Remote PDFs/DOCs</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCrawlDialog(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                required
                value={crawlUrlInput}
                onChange={(e) => setCrawlUrlInput(e.target.value)}
                placeholder="Paste URL (e.g. https://arxiv.org/abs/... or website/pdf link)"
                className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900"
              />
            </div>

            <div className="relative sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={crawlQueryInput}
                onChange={(e) => setCrawlQueryInput(e.target.value)}
                placeholder="Search keywords inside PDFs..."
                className="w-full text-xs pl-8 pr-2 py-2 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-blue-600 text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={isCrawling || !crawlUrlInput.trim()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isCrawling ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Crawling & Reading...</span>
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3" />
                  <span>Crawl & Ingest</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Divya AI crawls the target URL, extracts clean text, and automatically searches inside any linked PDF/DOC files.
          </p>
        </form>
      )}

      <div className="relative flex flex-col bg-white rounded-2xl border border-slate-300/80 shadow-xs focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
        {/* Attached Documents Preview Pills */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3">
            {attachments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-slate-800 shadow-2xs group"
              >
                {doc.type === "image" && doc.dataUrl ? (
                  <img
                    src={doc.dataUrl}
                    alt={doc.name}
                    className="w-7 h-7 rounded-md object-cover border border-blue-200 shrink-0"
                  />
                ) : doc.type === "crawl" ? (
                  <div className="p-1 rounded bg-blue-600 text-white font-bold text-[9px] uppercase tracking-wider shrink-0 flex items-center gap-0.5">
                    <Globe className="w-2.5 h-2.5" />
                    <span>WEB</span>
                  </div>
                ) : (
                  <div className="p-1 rounded bg-blue-600 text-white font-bold text-[9px] uppercase tracking-wider shrink-0">
                    {doc.type}
                  </div>
                )}
                <div className="max-w-[180px] truncate font-medium text-slate-900" title={doc.name}>
                  {doc.name}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {doc.type === "crawl" && doc.linkedDocsCount ? `${doc.linkedDocsCount} doc${doc.linkedDocsCount > 1 ? "s" : ""} • ` : ""}
                  {doc.pageCount ? `${doc.pageCount}p • ` : ""}
                  {formatFileSize(doc.size)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(doc.id)}
                  className="p-0.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-md transition-colors"
                  title="Remove attachment"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            attachments.length > 0
              ? "Ask a question about your uploaded or crawled source(s)..."
              : "Ask Divya AI anything, or paste a URL to crawl and analyze..."
          }
          rows={1}
          disabled={disabled || isUploading || isCrawling}
          className="w-full resize-none max-h-56 min-h-[52px] py-3.5 pl-4 pr-14 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none leading-relaxed select-text"
        />

        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          {/* Left Actions: Attach File + Crawl Web + Instant Speed Badge */}
          <div className="flex items-center gap-2">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md,.csv,.json,image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Paperclip Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading || isCrawling}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              title="Upload PDF, Word Doc, or Image (.png, .jpg, .webp, .pdf, .docx)"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span className="text-blue-600">Processing file...</span>
                </>
              ) : (
                <>
                  <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Upload File</span>
                </>
              )}
            </button>

            {/* Web & Document Crawler Button */}
            <button
              type="button"
              onClick={() => setShowCrawlDialog((prev) => !prev)}
              disabled={disabled || isUploading || isCrawling}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer disabled:opacity-50 ${
                showCrawlDialog
                  ? "bg-blue-50 text-blue-700 border-blue-300"
                  : "text-slate-600 hover:text-blue-600 hover:bg-blue-50 border-slate-200"
              }`}
              title="Crawl a website and search inside any remote PDFs or Word documents on it"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Crawl Web & Docs</span>
            </button>

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              <Zap className="w-3 h-3 fill-blue-600" />
              <span>Instant Response</span>
            </div>
          </div>

          {/* Right Actions: Stop or Send Button */}
          <div className="flex items-center gap-2">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={!canSubmit}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 ${
                  canSubmit
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95 cursor-pointer"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-slate-400 tracking-tight select-none">
        Divya AI can make mistakes. Verify critical facts and information.
      </p>
    </div>
  );
}
