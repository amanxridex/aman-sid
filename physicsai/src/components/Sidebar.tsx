"use client";

import React, { useState } from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  Cpu,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
} from "lucide-react";
import { Conversation, TokenUsage } from "@/lib/types";
import { LightningLogo } from "./LightningLogo";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  isOpen: boolean;
  tokenUsage: TokenUsage;
  activeTokens?: TokenUsage;
  onResetTokens?: () => void;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onClearAll: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  isOpen,
  tokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
  activeTokens,
  onResetTokens,
  onToggle,
  onSelect,
  onNewChat,
  onDelete,
  onRename,
  onClearAll,
}: SidebarProps) {
  const safeUsage = {
    promptTokens: tokenUsage?.promptTokens ?? 0,
    completionTokens: tokenUsage?.completionTokens ?? 0,
    totalTokens: tokenUsage?.totalTokens ?? 0,
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveEditing = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editTitle.trim()) {
      onRename(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingId(null);
  };

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group conversations by date
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const sevenDays = 7 * oneDay;

  const todayChats = filtered.filter((c) => now - c.updatedAt < oneDay);
  const weekChats = filtered.filter(
    (c) => now - c.updatedAt >= oneDay && now - c.updatedAt < sevenDays
  );
  const olderChats = filtered.filter((c) => now - c.updatedAt >= sevenDays);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col w-72 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out select-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:-ml-72"
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <LightningLogo size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-base tracking-tight">Divya AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200">
                  Speed
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">Next-Gen Intelligence</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: New Chat */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-xs transition-all duration-150 active:scale-[0.99] group cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New chat</span>
            </span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-blue-700/60 text-blue-100 group-hover:bg-blue-800/80 transition-colors">
              Ctrl+K
            </span>
          </button>

          {/* Search box if more than 3 conversations */}
          {conversations.length > 3 && (
            <div className="relative mt-2.5">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Conversations Scrollable List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-300" />
              <p className="text-xs">No conversations yet</p>
              <p className="text-[11px] text-slate-400 mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            <>
              {todayChats.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Today
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {todayChats.map((conv) => renderChatItem(conv))}
                  </div>
                </div>
              )}

              {weekChats.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Previous 7 Days
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {weekChats.map((conv) => renderChatItem(conv))}
                  </div>
                </div>
              )}

              {olderChats.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Older
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {olderChats.map((conv) => renderChatItem(conv))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Area with Token Usage Tracking */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2.5">
          {/* Token Usage Widget */}
          <div className="p-2.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                <span>Tokens Used</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-100">
                  {safeUsage.totalTokens.toLocaleString()}
                </span>
                {onResetTokens && safeUsage.totalTokens > 0 && (
                  <button
                    onClick={onResetTokens}
                    title="Reset Token Counter"
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Input & Output Token Counters */}
            <div className="grid grid-cols-2 gap-1.5">
              {/* Input Tokens */}
              <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
                  <ArrowUpRight className="w-3 h-3 text-blue-600" />
                  <span>Input</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 font-mono mt-0.5">
                  {safeUsage.promptTokens.toLocaleString()}
                </div>
              </div>

              {/* Output Tokens */}
              <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-700 uppercase tracking-wider">
                  <ArrowDownLeft className="w-3 h-3 text-indigo-600" />
                  <span>Output</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 font-mono mt-0.5">
                  {safeUsage.completionTokens.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Active conversation tokens breakdown if available */}
            {activeTokens && activeTokens.totalTokens > 0 && (
              <div className="flex items-center justify-between px-1 pt-0.5 text-[10px] text-slate-400 font-mono">
                <span>Active chat:</span>
                <span>
                  {activeTokens.promptTokens.toLocaleString()} in / {activeTokens.completionTokens.toLocaleString()} out
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg">
            <span className="flex items-center gap-1.5 font-medium text-blue-700">
              <Zap className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
              <span>Instant Stream</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">&lt;1s latency</span>
          </div>

          {conversations.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all conversations?")) {
                  onClearAll();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all chats</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );

  function renderChatItem(conv: Conversation) {
    const isActive = conv.id === activeId;
    const isEditing = conv.id === editingId;

    if (isEditing) {
      return (
        <form
          key={conv.id}
          onSubmit={(e) => saveEditing(conv.id, e)}
          className="flex items-center gap-1 p-1 bg-blue-50 border border-blue-300 rounded-lg"
        >
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 px-2 py-1 text-xs bg-white border border-blue-200 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
            title="Save"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={cancelEditing}
            className="p-1 text-slate-400 hover:bg-slate-200 rounded"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      );
    }

    return (
      <div
        key={conv.id}
        onClick={() => onSelect(conv.id)}
        className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer ${
          isActive
            ? "bg-blue-50 text-blue-900 font-medium border border-blue-200 shadow-xs"
            : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-1">
          <MessageSquare
            className={`w-4 h-4 shrink-0 transition-colors ${
              isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
            }`}
          />
          <span className="truncate text-xs tracking-tight">{conv.title || "New Chat"}</span>
        </div>

        {/* Action icons on hover or active */}
        <div
          className={`flex items-center gap-1 shrink-0 ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          } transition-opacity`}
        >
          <button
            onClick={(e) => startEditing(conv, e)}
            className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-white transition-colors"
            title="Rename"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(conv.id);
            }}
            className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-white transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }
}
