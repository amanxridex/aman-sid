import { NextRequest } from "next/server";
import { crawlUrl } from "@/lib/crawler";

export const runtime = "nodejs";

const NVIDIA_API_KEY = "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";
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const TEXT_MODEL = "nvidia/nemotron-3-ultra-550b-a55b";
const VISION_MODEL = "meta/llama-3.2-11b-vision-instruct";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const {
      messages,
      researchMode = "fast",
      isContinuation = false,
    } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Dynamic system prompt layer calibrated for advanced research work
    let systemPrompt =
      "You are Divya AI, a brilliant, fast, and rigorous AI research assistant. Provide clear, well-structured, insightful, and nicely formatted responses. Use GitHub-flavored Markdown with code blocks, tables, lists, and LaTeX math formulas ($...$ for inline, $$...$$ for display equations) whenever relevant. Never mention underlying model identifiers unless asked; your identity is Divya AI.";

    if (researchMode === "deep") {
      systemPrompt = `You are Divya AI in Deep Research Mode. You operate as an elite theoretical scientist, principal researcher, and academic author.
- Formulate comprehensive, publication-grade academic and technical syntheses.
- When analyzing physics, mathematics, theoretical computer science, or engineering, provide complete step-by-step mathematical derivations using LaTeX notation ($...$ for inline math and $$...$$ on separate lines for display equations).
- Provide exhaustive depth: theoretical foundations, exact governing equations, physical interpretations, boundary conditions, edge cases, comparative literature insights, and critical limitations.
- Never truncate or provide shallow summaries when exhaustive scientific depth is warranted. Structure long tasks logically with numbered academic sections, equations, and tables.
- Your identity is strictly Divya AI.`;
    } else if (researchMode === "code") {
      systemPrompt = `You are Divya AI in Computational Research Mode. You specialize in scientific computing, numerical simulations, algorithms, and production systems.
- Provide complete, verified, and runnable implementations with thorough documentation (NumPy, SciPy, PyTorch, JAX, CUDA concepts, SymPy, or high-performance languages).
- Include mathematical complexity analysis, numerical stability considerations, and profiling/optimization insights.
- Format all code with explicit language tags and rigorous structure.
- Your identity is strictly Divya AI.`;
    }

    // Strict mandate: Deliver final answers only, never internal thinking or monologue
    systemPrompt += `\n\nCRITICAL RESPONSE MANDATE:
- Deliver only the authoritative, publication-ready final answer.
- NEVER output your internal thinking process, reasoning steps, inner monologue, "Thinking Process", "Let me think", or meta-commentary about what you are planning to do.
- Jump straight into the title, definitions, equations, or explanation. We want the final answers, not what the brain is thinking.`;

    if (isContinuation) {
      systemPrompt +=
        "\n\nCRITICAL CONTINUATION INSTRUCTION: You are continuing an existing response that was paused due to length limits. Pick up seamlessly and immediately from the exact end of the last assistant message. DO NOT repeat earlier text, DO NOT say 'Certainly, here is the continuation' or similar filler. Jump straight into the next token, equation, or sentence.";
    }

    const systemMessage = {
      role: "system",
      content: systemPrompt,
    };

    // Auto-Crawl: If user prompt contains web URLs that haven't been attached yet, crawl them & linked PDFs
    let enrichedMessages = [...messages];
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");

    if (lastUserMsg && typeof lastUserMsg.content === "string") {
      const urlRegex = /(https?:\/\/[^\s\)\"\'<>]+)/gi;
      const detectedUrls = lastUserMsg.content.match(urlRegex);

      if (detectedUrls && detectedUrls.length > 0) {
        const targetUrl = detectedUrls[0];
        const alreadyAttached = messages.some((m: any) =>
          typeof m.content === "string" && m.content.includes(targetUrl) && m.content.includes("ATTACHED")
        );

        if (!alreadyAttached) {
          try {
            const crawlResult = await crawlUrl(targetUrl, { maxDocs: 3, deepCrawlDocs: true });
            if (crawlResult && (crawlResult.content || crawlResult.linkedDocs?.length > 0)) {
              let docsSection = "";
              if (crawlResult.linkedDocs && crawlResult.linkedDocs.length > 0) {
                docsSection = crawlResult.linkedDocs
                  .map(
                    (d) =>
                      `\n[LINKED ${d.type.toUpperCase()}: ${d.name} (${d.pageCount ? d.pageCount + " pages, " : ""}${d.wordCount} words)]:\n${d.content.slice(0, 15000)}`
                  )
                  .join("\n");
              }

              const crawlInjection = `\n\n--- [LIVE WEB CRAWL & DOC SEARCH: ${crawlResult.url} ("${crawlResult.title}")] ---\n${crawlResult.content.slice(0, 25000)}${docsSection}\n--- [END OF CRAWLED CONTENT] ---\n`;

              enrichedMessages = messages.map((m: any) =>
                m === lastUserMsg
                  ? { ...m, content: `${m.content}${crawlInjection}` }
                  : m
              );
            }
          } catch (crawlErr: any) {
            console.warn("Auto-crawl note:", crawlErr.message);
          }
        }
      }
    }

    const conversation = [systemMessage, ...enrichedMessages];

    // Check if any message contains image_url
    const hasImage = enrichedMessages.some((m: any) =>
      Array.isArray(m.content)
        ? m.content.some((part: any) => part.type === "image_url")
        : false
    );

    const chosenModel = hasImage ? VISION_MODEL : TEXT_MODEL;

    // Up to 16,384 tokens per generation for long research tasks without breaking!
    const requestPayload: any = {
      model: chosenModel,
      messages: conversation,
      temperature: researchMode === "deep" ? 0.6 : 0.7,
      top_p: 0.95,
      max_tokens: hasImage ? 4096 : 16384,
      stream_options: {
        include_usage: true,
      },
      stream: true,
    };

    if (!hasImage) {
      requestPayload.chat_template_kwargs = {
        enable_thinking: false, // Strict: deliver only final answers, no brain thinking output
      };
    }

    const response = await fetch(NVIDIA_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Upstream error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!response.body) {
      return new Response(JSON.stringify({ error: "No response body from upstream" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const reader = response.body.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        let accumulatedLength = 0;
        let finalUsage: { promptTokens: number; completionTokens: number; totalTokens: number } | null = null;
        let finalFinishReason = "stop";

        let isDone = false;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith(":")) continue;

              if (trimmed === "data: [DONE]") {
                isDone = true;
                break;
              }

              if (trimmed.startsWith("data: ")) {
                const jsonStr = trimmed.slice(6);
                try {
                  const parsed = JSON.parse(jsonStr);

                  if (parsed.usage) {
                    finalUsage = {
                      promptTokens: parsed.usage.prompt_tokens ?? 0,
                      completionTokens: parsed.usage.completion_tokens ?? 0,
                      totalTokens: parsed.usage.total_tokens ?? 0,
                    };
                  }

                  const choice = parsed.choices?.[0];
                  if (!choice) continue;

                  if (choice.finish_reason) {
                    finalFinishReason = choice.finish_reason;
                  }

                  let deltaContent = choice.delta?.content || "";
                  if (
                    deltaContent.includes("<think>") ||
                    deltaContent.includes("</think>") ||
                    deltaContent.includes("<thought>") ||
                    deltaContent.includes("</thought>")
                  ) {
                    deltaContent = deltaContent
                      .replace(/<think>[\s\S]*?<\/think>/gi, "")
                      .replace(/<thought>[\s\S]*?<\/thought>/gi, "")
                      .replace(/<\/?(think|thought)>/gi, "");
                  }

                  const currentElapsed = ((Date.now() - startTime) / 1000).toFixed(2);

                  if (deltaContent) {
                    accumulatedLength += deltaContent.length;
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({
                          delta: deltaContent,
                          elapsed: parseFloat(currentElapsed),
                          usage: finalUsage,
                          finishReason: choice.finish_reason || finalFinishReason,
                        })}\n\n`
                      )
                    );
                  }
                } catch {
                  // Ignore JSON parse errors for incomplete chunks
                }
              }
            }

            if (isDone) break;
          }

          // Fallback if upstream didn't send usage
          if (!finalUsage) {
            const promptChars = conversation.reduce((acc, m) => acc + (m.content?.length || 0), 0);
            const estPrompt = Math.max(1, Math.round(promptChars / 4));
            const estCompletion = Math.max(1, Math.round(accumulatedLength / 4));
            finalUsage = {
              promptTokens: estPrompt,
              completionTokens: estCompletion,
              totalTokens: estPrompt + estCompletion,
            };
          }

          const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                elapsed: parseFloat(totalElapsed),
                usage: finalUsage,
                finishReason: finalFinishReason,
              })}\n\n`
            )
          );
        } catch (err) {
          console.error("Stream reader error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Chat API error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
