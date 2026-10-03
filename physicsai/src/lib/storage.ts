import { Conversation } from "./types";

const STORAGE_KEY = "divya_ai_conversations_v1";
const ACTIVE_CONV_KEY = "divya_ai_active_conv_id";

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load conversations from storage", e);
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error("Failed to save conversations to storage", e);
  }
}

export function loadActiveConversationId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_CONV_KEY);
}

export function saveActiveConversationId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id) {
    localStorage.setItem(ACTIVE_CONV_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_CONV_KEY);
  }
}

const TOKEN_USAGE_KEY = "divya_ai_global_token_usage_v1";

export function loadGlobalTokenUsage(): { promptTokens: number; completionTokens: number; totalTokens: number } {
  if (typeof window === "undefined") return { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  try {
    const raw = localStorage.getItem(TOKEN_USAGE_KEY);
    if (!raw) return { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
    return JSON.parse(raw);
  } catch (e) {
    return { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  }
}

export function saveGlobalTokenUsage(usage: { promptTokens: number; completionTokens: number; totalTokens: number }): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOKEN_USAGE_KEY, JSON.stringify(usage));
  } catch (e) {
    console.error("Failed to save token usage", e);
  }
}

