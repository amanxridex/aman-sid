"use client";

import React, { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  PanelLeft,
  Plus,
  Copy,
  Check,
  RotateCcw,
  ArrowDown,
  Clock,
  Zap,
  Compass,
  Code2,
  FileText,
  Play,
  Brain,
  BookOpen,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Message, ResearchMode } from "@/lib/types";
import { LightningLogo } from "./LightningLogo";
import { CodeBlock } from "./CodeBlock";

interface ChatAreaProps {
  messages: Message[];
  title: string;
  isStreaming: boolean;
  activeSeconds: number;
  sidebarOpen: boolean;
  researchMode: ResearchMode;
  contextTokens: number;
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onRegenerate: () => void;
  onContinueWriting: (messageId: string) => void;
  onChangeResearchMode: (mode: ResearchMode) => void;
  onStarterClick: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  {
    icon: Globe,
    title: "Web & Paper Crawl",
    description: "Crawl https://arxiv.org/abs/2301.07067 and search inside the PDF for in-context learning theorems",
  },
  {
    icon: Compass,
    title: "Quantum Mechanics & Physics",
    description: "Derive Schrödinger equation solutions for a quantum harmonic oscillator with Hermite polynomials and energy eigenvalues",
  },
  {
    icon: BookOpen,
    title: "Deep Literature Synthesis",
    description: "Compare Transformer attention mechanisms with state space models (Mamba) in time complexity, memory scaling, and long context",
  },
  {
    icon: Code2,
    title: "Scientific Simulation",
    description: "Implement a 2D Navier-Stokes fluid dynamics solver using finite differences with pressure Poisson projection",
  },
];

export function ChatArea({
  messages,
  title,
  isStreaming,
  activeSeconds,
  sidebarOpen,
  researchMode = "deep",
  contextTokens = 0,
  onToggleSidebar,
  onNewChat,
  onRegenerate,
  onContinueWriting,
  onChangeResearchMode,
  onStarterClick,
}: ChatAreaProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const userScrolledUpRef = useRef(false);

  const safeTokens = contextTokens || 0;

  // Auto-scroll when messages update, unless user deliberately scrolled up
  useEffect(() => {
    if (!userScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming, activeSeconds]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isUp = distanceFromBottom > 150;
    userScrolledUpRef.current = isUp;
    setShowScrollBottom(isUp);
  };

  const scrollToBottom = () => {
    userScrolledUpRef.current = false;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error("Failed to copy message", e);
    }
  };

  const formatContextTokens = (tokens: number) => {
    const t = tokens || 0;
    if (t < 1000) return `${t}`;
    if (t < 1000000) return `${(t / 1000).toFixed(1)}k`;
    return `${(t / 1000000).toFixed(2)}M`;
  };

  return (
    <div className="relative flex flex-col flex-1 h-full min-w-0 bg-white overflow-hidden">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between h-14 px-4 border-b border-slate-100 bg-white/95 shrink-0 z-20 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {!sidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Open sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <LightningLogo size="sm" />
            <h1 className="text-sm font-semibold text-slate-800 truncate max-w-[120px] sm:max-w-[200px]">
              {title || "Divya AI"}
            </h1>
          </div>
        </div>

        {/* Center: Research Mode Selector */}
        <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => onChangeResearchMode("fast")}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
              researchMode === "fast"
                ? "bg-white text-blue-600 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Fast Mode (<1s latency, direct responses)"
          >
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">Fast</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeResearchMode("deep")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              researchMode === "deep"
                ? "bg-white text-blue-600 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Deep Research Mode: Exhaustive academic rigor, step-by-step derivations & LaTeX math"
          >
            <BookOpen className="w-3 h-3" />
            <span>Deep Research</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeResearchMode("code")}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
              researchMode === "code"
                ? "bg-white text-blue-600 shadow-2xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Computational Mode: Scientific computing & verified algorithms"
          >
            <Code2 className="w-3 h-3" />
            <span className="hidden sm:inline">Code</span>
          </button>
        </div>

        {/* Right: 1M Context Capacity & New Chat */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="hidden lg:flex items-center gap-2 px-2.5 py-1 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg"
            title={`Context: ${safeTokens.toLocaleString()} tokens utilized of 1,000,000 maximum capacity`}
          >
            <Brain className="w-3.5 h-3.5 text-blue-600" />
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <span className="font-semibold text-slate-900">{formatContextTokens(safeTokens)}</span>
              <span className="text-slate-400">/ 1M Context</span>
            </div>
            <div className="w-10 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(3, (safeTokens / 1000000) * 100))}%` }}
              />
            </div>
          </div>

          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </header>

      {/* Messages Scroll Viewport */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            /* Welcome / Empty State */
            <div className="py-12 sm:py-16 text-center">
              <div className="inline-flex p-3 rounded-2xl bg-blue-50 border border-blue-200/80 mb-5 shadow-xs animate-in fade-in zoom-in duration-300">
                <LightningLogo size="xl" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                What would you like to explore?
              </h2>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Divya AI provides lightning-fast reasoning and instant token streaming. Ask any
                technical, analytical, or creative question.
              </p>

              {/* Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 text-left max-w-2xl mx-auto">
                {STARTER_PROMPTS.map((prompt, idx) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => onStarterClick(prompt.description)}
                      className="group flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-150 shadow-2xs hover:shadow-xs text-left cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {prompt.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {prompt.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Message List */
            messages.map((message, index) => {
              const isUser = message.role === "user";
              const isLastAssistant =
                !isUser && index === messages.length - 1;

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="shrink-0 mt-0.5">
                      <LightningLogo size="sm" />
                    </div>
                  )}

                  <div
                    className={`min-w-0 max-w-[90%] sm:max-w-[85%] ${
                      isUser
                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs"
                        : "bg-white text-slate-900 rounded-2xl border border-slate-200/80 px-5 py-4 shadow-2xs"
                    }`}
                  >
                    {/* Header for Assistant with Seconds & Status */}
                    {!isUser && (
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
                        <span className="font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
                          <span>Divya AI</span>
                        </span>

                        {/* Live or Final Seconds Badge */}
                        <div className="flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          <Clock className="w-3 h-3 text-blue-600" />
                          {message.isStreaming ? (
                            <span className="text-blue-600 font-semibold animate-pulse">
                              Fetching • {activeSeconds.toFixed(1)}s
                            </span>
                          ) : message.elapsedSeconds ? (
                            <span>Responded in {message.elapsedSeconds.toFixed(2)}s</span>
                          ) : (
                            <span>Completed</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Message Body */}
                    {isUser ? (
                      <div className="space-y-2">
                        {/* Attached Images and Document Badges */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="space-y-2 mb-2">
                            {/* Image Previews */}
                            {message.attachments
                              .filter((d) => d.type === "image" && d.dataUrl)
                              .map((doc) => (
                                <div
                                  key={doc.id}
                                  className="overflow-hidden rounded-xl border border-blue-400/40 bg-black/10 max-w-sm shadow-xs"
                                >
                                  <img
                                    src={doc.dataUrl}
                                    alt={doc.name}
                                    className="max-h-64 w-auto rounded-xl object-contain cursor-pointer hover:opacity-95 transition-opacity"
                                    onClick={() => {
                                      if (doc.dataUrl) {
                                        const w = window.open("");
                                        w?.document.write(`<img src="${doc.dataUrl}" style="max-width:100%; height:auto; margin:auto; display:block;" />`);
                                      }
                                    }}
                                  />
                                </div>
                              ))}

                            {/* Document Badges */}
                            {message.attachments.filter((d) => d.type !== "image").length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {message.attachments
                                  .filter((d) => d.type !== "image")
                                  .map((doc) => (
                                    <div
                                      key={doc.id}
                                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-700/80 border border-blue-400/40 text-xs text-white"
                                    >
                                      {doc.type === "crawl" ? (
                                        <Globe className="w-3.5 h-3.5 text-blue-200" />
                                      ) : (
                                        <FileText className="w-3.5 h-3.5 text-blue-200" />
                                      )}
                                      <span className="font-semibold text-[9px] uppercase bg-blue-800 px-1 py-0.5 rounded text-blue-100">
                                        {doc.type === "crawl" ? "web/doc" : doc.type}
                                      </span>
                                      <span className="font-medium max-w-[170px] truncate" title={doc.name}>
                                        {doc.name}
                                      </span>
                                      {doc.linkedDocsCount ? (
                                        <span className="text-[10px] text-blue-200 font-mono">
                                          ({doc.linkedDocsCount} doc{doc.linkedDocsCount > 1 ? "s" : ""})
                                        </span>
                                      ) : doc.pageCount ? (
                                        <span className="text-[10px] text-blue-200 font-mono">({doc.pageCount}p)</span>
                                      ) : null}
                                      {doc.url && (
                                        <a
                                          href={doc.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-blue-200 hover:text-white p-0.5 rounded hover:bg-blue-600/50 transition-colors"
                                          title="Open original website or document"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap leading-relaxed select-text font-normal">
                          {message.content}
                        </p>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed space-y-3 select-text">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            code({ inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || "");
                              const codeString = String(children).replace(/\n$/, "");
                              if (!inline && match) {
                                return (
                                  <CodeBlock
                                    language={match[1]}
                                    value={codeString}
                                  />
                                );
                              }
                              if (!inline && codeString.includes("\n")) {
                                return (
                                  <CodeBlock
                                    language="text"
                                    value={codeString}
                                  />
                                );
                              }
                              return (
                                <code
                                  className="px-1.5 py-0.5 rounded bg-slate-100 text-blue-700 font-mono text-xs font-medium"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                            p({ children }) {
                              return <p className="mb-2 leading-relaxed">{children}</p>;
                            },
                            ul({ children }) {
                              return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>;
                            },
                            ol({ children }) {
                              return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>;
                            },
                            li({ children }) {
                              return <li className="leading-relaxed">{children}</li>;
                            },
                            table({ children }) {
                              return (
                                <div className="my-4 overflow-x-auto rounded-lg border border-slate-200">
                                  <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                                    {children}
                                  </table>
                                </div>
                              );
                            },
                            th({ children }) {
                              return (
                                <th className="bg-slate-50 px-3 py-2 font-semibold text-slate-700">
                                  {children}
                                </th>
                              );
                            },
                            td({ children }) {
                              return (
                                <td className="px-3 py-2 border-t border-slate-100 text-slate-700">
                                  {children}
                                </td>
                              );
                            },
                            blockquote({ children }) {
                              return (
                                <blockquote className="border-l-4 border-blue-500 pl-4 py-1 italic text-slate-600 bg-blue-50/30 rounded-r">
                                  {children}
                                </blockquote>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>

                        {/* Streaming cursor indicator */}
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 ml-1 bg-blue-600 animate-pulse rounded-xs align-middle" />
                        )}

                        {/* Length limit continuation banner */}
                        {message.finishReason === "length" && !message.isStreaming && (
                          <div className="flex items-center justify-between p-2.5 mt-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Length limit reached.</span>
                              <span className="text-amber-700 hidden sm:inline">Continue seamlessly without breaking context.</span>
                            </div>
                            <button
                              onClick={() => onContinueWriting(message.id)}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors cursor-pointer shrink-0"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              Continue writing
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions on finished Assistant message */}
                    {!isUser && !message.isStreaming && message.content && (
                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-100 text-slate-400">
                        <button
                          onClick={() => handleCopy(message.id, message.content)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === message.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-600 text-xs">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {isLastAssistant && (
                          <>
                            <button
                              onClick={() => onContinueWriting(message.id)}
                              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer border border-blue-200/60"
                              title="Continue writing seamlessly from the exact end of this response"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Continue writing</span>
                            </button>

                            <button
                              onClick={onRegenerate}
                              className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Regenerate response"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Regenerate</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Floating Scroll to Bottom button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 p-2 rounded-full bg-white border border-slate-300 shadow-md text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all active:scale-95 z-20 cursor-pointer"
          title="Scroll to bottom"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
