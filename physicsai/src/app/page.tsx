"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { ChatInput } from "@/components/ChatInput";
import { Conversation, Message, TokenUsage, AttachedDoc, ResearchMode } from "@/lib/types";
import {
  loadConversations,
  saveConversations,
  loadActiveConversationId,
  saveActiveConversationId,
  loadGlobalTokenUsage,
  saveGlobalTokenUsage,
} from "@/lib/storage";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [researchMode, setResearchMode] = useState<ResearchMode>("deep");
  const [globalTokens, setGlobalTokens] = useState<TokenUsage>({
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
  });
  const [attachments, setAttachments] = useState<AttachedDoc[]>([]);

  const handleAddAttachment = (doc: AttachedDoc) => {
    setAttachments((prev) => [...prev, doc]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((d) => d.id !== id));
  };

  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved state on mount
  useEffect(() => {
    setGlobalTokens(loadGlobalTokenUsage());
    const saved = loadConversations();
    if (saved.length > 0) {
      setConversations(saved);
      const savedActive = loadActiveConversationId();
      if (savedActive && saved.some((c) => c.id === savedActive)) {
        setActiveId(savedActive);
      } else {
        setActiveId(saved[0].id);
      }
    } else {
      // Create initial conversation
      const initial: Conversation = {
        id: generateId(),
        title: "New Chat",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations([initial]);
      setActiveId(initial.id);
      saveConversations([initial]);
      saveActiveConversationId(initial.id);
    }
  }, []);

  // Save to storage on conversation change
  const updateConversations = (updater: (prev: Conversation[]) => Conversation[]) => {
    setConversations((prev) => {
      const next = updater(prev);
      saveConversations(next);
      return next;
    });
  };

  const handleSelectConversation = (id: string) => {
    if (isStreaming) {
      handleStopStreaming();
    }
    setActiveId(id);
    saveActiveConversationId(id);
  };

  const handleNewChat = useCallback(() => {
    if (isStreaming) {
      handleStopStreaming();
    }
    const newConv: Conversation = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    updateConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    saveActiveConversationId(newConv.id);
    setInput("");
    setAttachments([]);
  }, [isStreaming]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNewChat]);

  const handleDeleteConversation = (id: string) => {
    if (isStreaming && activeId === id) {
      handleStopStreaming();
    }
    updateConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (remaining.length === 0) {
        const fresh: Conversation = {
          id: generateId(),
          title: "New Chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setActiveId(fresh.id);
        saveActiveConversationId(fresh.id);
        return [fresh];
      }
      if (activeId === id) {
        setActiveId(remaining[0].id);
        saveActiveConversationId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    updateConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c))
    );
  };

  const handleClearAll = () => {
    if (isStreaming) {
      handleStopStreaming();
    }
    const fresh: Conversation = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations([fresh]);
    setActiveId(fresh.id);
    saveConversations([fresh]);
    saveActiveConversationId(fresh.id);
  };

  const handleResetTokens = () => {
    const reset = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
    setGlobalTokens(reset);
    saveGlobalTokenUsage(reset);
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsStreaming(false);

    // Finalize assistant message streaming state
    if (activeId) {
      updateConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          const updatedMessages = c.messages.map((m) =>
            m.isStreaming ? { ...m, isStreaming: false } : m
          );
          return { ...c, messages: updatedMessages };
        })
      );
    }
  };

  const activeConv = conversations.find((c) => c.id === activeId) || null;
  const activeMessages = activeConv?.messages || [];

  // Sync active conversation's researchMode
  useEffect(() => {
    const conv = conversations.find((c) => c.id === activeId);
    if (conv?.researchMode) {
      setResearchMode(conv.researchMode);
    }
  }, [activeId, conversations]);

  const handleChangeResearchMode = (mode: ResearchMode) => {
    setResearchMode(mode);
    if (activeId) {
      updateConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, researchMode: mode } : c))
      );
    }
  };

  // 1M Context token gauge: tracks active message history and document payload sizes
  const contextTokens = React.useMemo(() => {
    if (!activeConv) return 0;
    let totalChars = 0;
    for (const m of activeConv.messages) {
      totalChars += m.content ? m.content.length : 0;
      if (m.attachments) {
        for (const a of m.attachments) {
          totalChars += a.content ? a.content.length : 0;
        }
      }
    }
    return Math.round(totalChars / 3.8);
  }, [activeConv]);

  const handleSendMessage = async (textToSend?: string) => {
    let promptText = (textToSend ?? input).trim();
    const currentAttachments = [...attachments];

    if (!promptText && currentAttachments.length === 0) return;
    if (isStreaming || !activeId) return;

    if (!promptText && currentAttachments.length > 0) {
      promptText = `Please read and analyze the attached document (${currentAttachments.map((d) => d.name).join(", ")}). Provide a clear overview and highlight key insights.`;
    }

    setInput("");
    setAttachments([]);

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: promptText,
      createdAt: Date.now(),
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
    };

    const assistantMessageId = generateId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      isStreaming: true,
    };

    // Calculate title if it's currently "New Chat"
    const currentConv = conversations.find((c) => c.id === activeId);
    let newTitle = currentConv?.title || "New Chat";
    if (newTitle === "New Chat" && (!currentConv || currentConv.messages.length === 0)) {
      if (currentAttachments.length > 0) {
        newTitle = currentAttachments[0].name.slice(0, 26);
      } else {
        newTitle = promptText.length > 28 ? promptText.slice(0, 28) + "..." : promptText;
      }
    }

    const updatedCurrentMessages = [...activeMessages, userMessage];

    // Optimistically update conversation
    updateConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        return {
          ...c,
          title: newTitle,
          messages: [...c.messages, userMessage, assistantMessage],
          updatedAt: Date.now(),
        };
      })
    );

    setIsStreaming(true);
    setActiveSeconds(0);

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setActiveSeconds((Date.now() - startTime) / 1000);
    }, 50);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Build messages payload for API (handling multimodal images and document text)
      const apiMessages = updatedCurrentMessages.map((m) => {
        if (m.attachments && m.attachments.length > 0) {
          const imageAttachments = m.attachments.filter((d) => d.type === "image" && d.dataUrl);
          const docAttachments = m.attachments.filter((d) => d.type !== "image");

          let docSections = "";
          if (docAttachments.length > 0) {
            docSections = docAttachments
              .map(
                (doc) =>
                  `--- ATTACHED DOCUMENT: ${doc.name} (${doc.type.toUpperCase()}) ---\n${doc.content}\n--- END OF ATTACHED DOCUMENT: ${doc.name} ---`
              )
              .join("\n\n") + "\n\n";
          }

          const combinedText = `${docSections}${m.content}`;

          // If there are images, format as multimodal array content
          if (imageAttachments.length > 0) {
            const contentParts: any[] = [
              { type: "text", text: combinedText || "Please analyze this image." },
              ...imageAttachments.map((img) => ({
                type: "image_url",
                image_url: { url: img.dataUrl },
              })),
            ];
            return {
              role: m.role,
              content: contentParts,
            };
          }

          return {
            role: m.role,
            content: `${docSections}User Question/Instruction:\n${m.content}`,
          };
        }

        return {
          role: m.role,
          content: m.content,
        };
      });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          enableThinking: false,
          researchMode,
          isContinuation: false,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedText = "";
      let finalElapsed = 0;
      let finalUsage: TokenUsage | null = null;
      let finalFinishReason = "stop";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const jsonStr = trimmed.slice(6);
          try {
            const data = JSON.parse(jsonStr);

            if (data.usage) {
              finalUsage = {
                promptTokens: data.usage.promptTokens,
                completionTokens: data.usage.completionTokens,
                totalTokens: data.usage.totalTokens,
              };
            }

            if (data.finishReason) {
              finalFinishReason = data.finishReason;
            }

            if (data.done) {
              if (data.elapsed) {
                finalElapsed = data.elapsed;
              }
              if (data.finishReason) {
                finalFinishReason = data.finishReason;
              }
              if (data.usage) {
                finalUsage = {
                  promptTokens: data.usage.promptTokens,
                  completionTokens: data.usage.completionTokens,
                  totalTokens: data.usage.totalTokens,
                };
              }
              break;
            }

            if (data.delta) {
              accumulatedText += data.delta;
              if (data.elapsed) {
                finalElapsed = data.elapsed;
              }

              // Update assistant message content in real time
              setConversations((prev) =>
                prev.map((c) => {
                  if (c.id !== activeId) return c;
                  return {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMessageId
                        ? { ...m, content: accumulatedText, elapsedSeconds: data.elapsed || finalElapsed }
                        : m
                    ),
                  };
                })
              );
            }
          } catch {
            // Ignore parse errors on partial frames
          }
        }
      }

      const totalElapsedSec = finalElapsed || Number(((Date.now() - startTime) / 1000).toFixed(2));

      // Update global tokens
      if (finalUsage) {
        setGlobalTokens((prev) => {
          const updated = {
            promptTokens: prev.promptTokens + finalUsage!.promptTokens,
            completionTokens: prev.completionTokens + finalUsage!.completionTokens,
            totalTokens: prev.totalTokens + finalUsage!.totalTokens,
          };
          saveGlobalTokenUsage(updated);
          return updated;
        });
      }

      // Finalize and save to storage with token counts
      updateConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          const currentTotal = c.totalTokens || { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
          const updatedConvTotal = finalUsage
            ? {
                promptTokens: currentTotal.promptTokens + finalUsage.promptTokens,
                completionTokens: currentTotal.completionTokens + finalUsage.completionTokens,
                totalTokens: currentTotal.totalTokens + finalUsage.totalTokens,
              }
            : currentTotal;

          return {
            ...c,
            updatedAt: Date.now(),
            totalTokens: updatedConvTotal,
            messages: c.messages.map((m) =>
              m.id === assistantMessageId
                ? {
                    ...m,
                    content: accumulatedText || "No response received.",
                    isStreaming: false,
                    elapsedSeconds: totalElapsedSec,
                    tokens: finalUsage || undefined,
                    finishReason: finalFinishReason,
                  }
                : m
            ),
          };
        })
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted by user.");
      } else {
        console.error("Chat error:", err);
        const errorElapsed = Number(((Date.now() - startTime) / 1000).toFixed(2));
        updateConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMessageId
                  ? {
                      ...m,
                      content: `⚠️ Error fetching response: ${err.message || "Please check your network and try again."}`,
                      isStreaming: false,
                      elapsedSeconds: errorElapsed,
                    }
                  : m
              ),
            };
          })
        );
      }
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleRegenerate = () => {
    if (isStreaming || !activeConv || activeMessages.length === 0) return;

    // Find the last user message
    const lastUserMsg = [...activeMessages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;

    // Remove trailing assistant message if present
    const trimmed = [...activeMessages];
    if (trimmed[trimmed.length - 1].role === "assistant") {
      trimmed.pop();
    }

    updateConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        return {
          ...c,
          messages: trimmed,
        };
      })
    );

    // Re-send user prompt
    handleSendMessage(lastUserMsg.content);
  };

  // Claude-style seamless continuation for long research tasks and papers
  const handleContinueWriting = async (messageId: string) => {
    if (isStreaming || !activeId || !activeConv) return;

    const targetMsgIndex = activeMessages.findIndex((m) => m.id === messageId);
    if (targetMsgIndex === -1) return;
    const targetMsg = activeMessages[targetMsgIndex];
    const existingContent = targetMsg.content;

    // Build context history up to target message
    const historyUpToTarget = activeMessages.slice(0, targetMsgIndex + 1);

    setIsStreaming(true);
    setActiveSeconds(0);

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setActiveSeconds((Date.now() - startTime) / 1000);
    }, 50);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Set message into streaming & continued mode
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        return {
          ...c,
          messages: c.messages.map((m) =>
            m.id === messageId ? { ...m, isStreaming: true, isContinued: true } : m
          ),
        };
      })
    );

    try {
      const apiMessages = historyUpToTarget.map((m) => {
        if (m.attachments && m.attachments.length > 0) {
          const imageAttachments = m.attachments.filter((d) => d.type === "image" && d.dataUrl);
          const docAttachments = m.attachments.filter((d) => d.type !== "image");

          let docSections = "";
          if (docAttachments.length > 0) {
            docSections = docAttachments
              .map(
                (doc) =>
                  `--- ATTACHED DOCUMENT: ${doc.name} (${doc.type.toUpperCase()}) ---\n${doc.content}\n--- END OF ATTACHED DOCUMENT: ${doc.name} ---`
              )
              .join("\n\n") + "\n\n";
          }

          const combinedText = `${docSections}${m.content}`;

          if (imageAttachments.length > 0) {
            return {
              role: m.role,
              content: [
                { type: "text", text: combinedText || "Please analyze this image." },
                ...imageAttachments.map((img) => ({
                  type: "image_url",
                  image_url: { url: img.dataUrl },
                })),
              ],
            };
          }

          return {
            role: m.role,
            content: `${docSections}${m.content}`,
          };
        }

        return {
          role: m.role,
          content: m.content,
        };
      });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          enableThinking: false,
          researchMode,
          isContinuation: true,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedAppend = "";
      let finalElapsed = 0;
      let finalUsage: TokenUsage | null = null;
      let finalFinishReason = "stop";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const jsonStr = trimmed.slice(6);
          try {
            const data = JSON.parse(jsonStr);

            if (data.usage) {
              finalUsage = {
                promptTokens: data.usage.promptTokens,
                completionTokens: data.usage.completionTokens,
                totalTokens: data.usage.totalTokens,
              };
            }

            if (data.finishReason) {
              finalFinishReason = data.finishReason;
            }

            if (data.done) {
              if (data.elapsed) finalElapsed = data.elapsed;
              if (data.finishReason) finalFinishReason = data.finishReason;
              if (data.usage) {
                finalUsage = {
                  promptTokens: data.usage.promptTokens,
                  completionTokens: data.usage.completionTokens,
                  totalTokens: data.usage.totalTokens,
                };
              }
              break;
            }

            if (data.delta) {
              accumulatedAppend += data.delta;
              if (data.elapsed) finalElapsed = data.elapsed;

              setConversations((prev) =>
                prev.map((c) => {
                  if (c.id !== activeId) return c;
                  return {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === messageId
                        ? {
                            ...m,
                            content: existingContent + accumulatedAppend,
                            elapsedSeconds: (targetMsg.elapsedSeconds || 0) + (data.elapsed || finalElapsed),
                          }
                        : m
                    ),
                  };
                })
              );
            }
          } catch {
            // ignore partial JSON
          }
        }
      }

      const totalContinuationSec =
        (targetMsg.elapsedSeconds || 0) +
        (finalElapsed || Number(((Date.now() - startTime) / 1000).toFixed(2)));

      if (finalUsage) {
        setGlobalTokens((prev) => {
          const updated = {
            promptTokens: prev.promptTokens + finalUsage!.promptTokens,
            completionTokens: prev.completionTokens + finalUsage!.completionTokens,
            totalTokens: prev.totalTokens + finalUsage!.totalTokens,
          };
          saveGlobalTokenUsage(updated);
          return updated;
        });
      }

      updateConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          const currentTotal = c.totalTokens || { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
          const updatedConvTotal = finalUsage
            ? {
                promptTokens: currentTotal.promptTokens + finalUsage.promptTokens,
                completionTokens: currentTotal.completionTokens + finalUsage.completionTokens,
                totalTokens: currentTotal.totalTokens + finalUsage.totalTokens,
              }
            : currentTotal;

          return {
            ...c,
            updatedAt: Date.now(),
            totalTokens: updatedConvTotal,
            messages: c.messages.map((m) =>
              m.id === messageId
                ? {
                    ...m,
                    content: existingContent + accumulatedAppend,
                    isStreaming: false,
                    isContinued: true,
                    finishReason: finalFinishReason,
                    elapsedSeconds: totalContinuationSec,
                    tokens: finalUsage
                      ? {
                          promptTokens: (m.tokens?.promptTokens || 0) + finalUsage.promptTokens,
                          completionTokens: (m.tokens?.completionTokens || 0) + finalUsage.completionTokens,
                          totalTokens: (m.tokens?.totalTokens || 0) + finalUsage.totalTokens,
                        }
                      : m.tokens,
                  }
                : m
            ),
          };
        })
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Continuation aborted by user.");
      } else {
        console.error("Continuation error:", err);
      }
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === messageId ? { ...m, isStreaming: false } : m
            ),
          };
        })
      );
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        isOpen={sidebarOpen}
        tokenUsage={globalTokens}
        activeTokens={activeConv?.totalTokens}
        onResetTokens={handleResetTokens}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
        onRename={handleRenameConversation}
        onClearAll={handleClearAll}
      />

      {/* Main Chat Viewport */}
      <main className="flex flex-col flex-1 h-full min-w-0 bg-white">
        <ChatArea
          messages={activeMessages}
          title={activeConv?.title || "New Chat"}
          isStreaming={isStreaming}
          activeSeconds={activeSeconds}
          sidebarOpen={sidebarOpen}
          researchMode={researchMode}
          contextTokens={contextTokens}
          onToggleSidebar={() => setSidebarOpen(true)}
          onNewChat={handleNewChat}
          onRegenerate={handleRegenerate}
          onContinueWriting={handleContinueWriting}
          onChangeResearchMode={handleChangeResearchMode}
          onStarterClick={(prompt) => handleSendMessage(prompt)}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          attachments={attachments}
          onAddAttachment={handleAddAttachment}
          onRemoveAttachment={handleRemoveAttachment}
          onSubmit={() => handleSendMessage()}
          onStop={handleStopStreaming}
          isStreaming={isStreaming}
        />
      </main>
    </div>
  );
}
