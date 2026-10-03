export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AttachedDoc {
  id: string;
  name: string;
  type: "pdf" | "doc" | "text" | "image" | "crawl";
  size: number;
  content: string;
  dataUrl?: string;
  url?: string;
  wordCount?: number;
  pageCount?: number;
  linkedDocsCount?: number;
}

export type ResearchMode = "fast" | "deep" | "code";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  createdAt: number;
  elapsedSeconds?: number;
  isStreaming?: boolean;
  tokens?: TokenUsage;
  attachments?: AttachedDoc[];
  finishReason?: string;
  isContinued?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  totalTokens?: TokenUsage;
  researchMode?: ResearchMode;
}

