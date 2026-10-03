import * as cheerio from "cheerio";
import { extractText } from "unpdf";
import mammoth from "mammoth";

export interface CrawledDoc {
  name: string;
  url: string;
  type: "pdf" | "docx" | "doc";
  pageCount?: number;
  wordCount?: number;
  content: string;
  matchedSnippets?: string[];
}

export interface CrawlResult {
  url: string;
  title: string;
  description?: string;
  isDirectDoc: boolean;
  docType?: "pdf" | "docx" | "html";
  content: string;
  wordCount: number;
  linkedDocs: CrawledDoc[];
  error?: string;
}

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/**
 * Fetch a URL with a timeout and realistic browser headers
 */
async function fetchWithTimeout(url: string, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Extract clean text and page count from a remote PDF buffer
 */
async function extractRemotePdf(buffer: ArrayBuffer): Promise<{ text: string; pageCount: number }> {
  try {
    const uint8Array = new Uint8Array(buffer);
    const result = await extractText(uint8Array);
    const fullText = Array.isArray(result.text)
      ? result.text.join("\n\n").trim()
      : String(result.text || "").trim();
    return {
      text: fullText || "No readable text extracted from this PDF.",
      pageCount: result.totalPages || 1,
    };
  } catch (err: any) {
    console.error("PDF parse error:", err.message);
    return { text: `[Error reading PDF: ${err.message}]`, pageCount: 0 };
  }
}

/**
 * Extract clean text from a remote DOCX buffer
 */
async function extractRemoteDocx(buffer: ArrayBuffer): Promise<{ text: string }> {
  try {
    const nodeBuf = Buffer.from(buffer);
    const result = await mammoth.extractRawText({ buffer: nodeBuf });
    return { text: result.value?.trim() || "No text extracted from document." };
  } catch (err: any) {
    console.error("DOCX parse error:", err.message);
    return { text: `[Error reading Word document: ${err.message}]` };
  }
}

/**
 * Search text for keywords or query terms and return matching contextual excerpts
 */
function extractMatchingExcerpts(text: string, query: string, maxExcerpts = 5): string[] {
  if (!query || !query.trim()) return [];
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  if (words.length === 0) return [];

  const paragraphs = text.split(/\n\s*\n/);
  const matched: string[] = [];

  for (const para of paragraphs) {
    const lowerPara = para.toLowerCase();
    const hasWord = words.some((w) => lowerPara.includes(w));
    if (hasWord) {
      matched.push(para.trim().slice(0, 500));
      if (matched.length >= maxExcerpts) break;
    }
  }

  return matched;
}

/**
 * Deep crawls a website URL, extracts readable content, and discovers & parses linked PDFs/DOCs
 */
export async function crawlUrl(
  targetUrl: string,
  options: {
    maxDocs?: number;
    searchQuery?: string;
    deepCrawlDocs?: boolean;
  } = {}
): Promise<CrawlResult> {
  const { maxDocs = 4, searchQuery = "", deepCrawlDocs = true } = options;

  let urlObj: URL;
  try {
    urlObj = new URL(targetUrl);
  } catch {
    throw new Error(`Invalid URL: "${targetUrl}". Please provide a full URL starting with http:// or https://`);
  }

  const response = await fetchWithTimeout(urlObj.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch ${urlObj.toString()}: HTTP ${response.status} ${response.statusText}`);
  }

  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  const pathname = urlObj.pathname.toLowerCase();

  // Case 1: The URL itself is directly a PDF file
  if (contentType.includes("application/pdf") || pathname.endsWith(".pdf")) {
    const buffer = await response.arrayBuffer();
    const { text, pageCount } = await extractRemotePdf(buffer);
    const fileName = pathname.split("/").pop() || "document.pdf";
    const snippets = searchQuery ? extractMatchingExcerpts(text, searchQuery) : [];

    return {
      url: urlObj.toString(),
      title: fileName,
      isDirectDoc: true,
      docType: "pdf",
      content: text,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      linkedDocs: [
        {
          name: fileName,
          url: urlObj.toString(),
          type: "pdf",
          pageCount,
          wordCount: text.split(/\s+/).filter(Boolean).length,
          content: text.slice(0, 30000), // generous context cap
          matchedSnippets: snippets.length > 0 ? snippets : undefined,
        },
      ],
    };
  }

  // Case 2: The URL itself is directly a DOCX file
  if (
    contentType.includes("application/vnd.openxmlformats-officedocument") ||
    pathname.endsWith(".docx")
  ) {
    const buffer = await response.arrayBuffer();
    const { text } = await extractRemoteDocx(buffer);
    const fileName = pathname.split("/").pop() || "document.docx";
    const snippets = searchQuery ? extractMatchingExcerpts(text, searchQuery) : [];

    return {
      url: urlObj.toString(),
      title: fileName,
      isDirectDoc: true,
      docType: "docx",
      content: text,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      linkedDocs: [
        {
          name: fileName,
          url: urlObj.toString(),
          type: "docx",
          wordCount: text.split(/\s+/).filter(Boolean).length,
          content: text.slice(0, 30000),
          matchedSnippets: snippets.length > 0 ? snippets : undefined,
        },
      ],
    };
  }

  // Case 3: Standard Webpage (HTML)
  const html = await response.text();
  const $ = cheerio.load(html);

  // Extract Page Title and Description
  const title = $("title").first().text().trim() || $("h1").first().text().trim() || urlObj.hostname;
  const description =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim();

  // Find all embedded / linked PDF and DOC files on this webpage
  const discoveredDocs: { name: string; url: string; type: "pdf" | "docx" | "doc" }[] = [];
  const seenUrls = new Set<string>();

  $("a[href], iframe[src], embed[src], object[data]").each((_, el) => {
    const href = $(el).attr("href") || $(el).attr("src") || $(el).attr("data");
    if (!href) return;

    try {
      const resolved = new URL(href, urlObj.origin + urlObj.pathname).toString();
      const lower = resolved.toLowerCase();

      if (seenUrls.has(resolved)) return;

      const linkText = $(el).text().trim().toLowerCase();
      const isPdf =
        lower.includes(".pdf") ||
        lower.endsWith(".pdf") ||
        lower.includes("/pdf/") ||
        lower.includes("type=pdf") ||
        lower.includes("format=pdf") ||
        linkText.includes("download pdf") ||
        linkText.includes("view pdf") ||
        $(el).attr("type") === "application/pdf";

      const isDocx =
        lower.includes(".docx") ||
        lower.endsWith(".docx") ||
        lower.includes("/docx/") ||
        $(el).attr("type")?.includes("wordprocessingml");

      const isDoc =
        !isDocx &&
        (lower.includes(".doc") ||
          lower.endsWith(".doc") ||
          lower.includes("/doc/"));

      if (isPdf) {
        seenUrls.add(resolved);
        const name = $(el).text().trim() || resolved.split("/").pop()?.split("?")[0] || "document.pdf";
        const cleanName = name.toLowerCase().endsWith(".pdf") ? name : `${name}.pdf`;
        discoveredDocs.push({ name: cleanName.slice(0, 80), url: resolved, type: "pdf" });
      } else if (isDocx) {
        seenUrls.add(resolved);
        const name = $(el).text().trim() || resolved.split("/").pop()?.split("?")[0] || "document.docx";
        const cleanName = name.toLowerCase().endsWith(".docx") ? name : `${name}.docx`;
        discoveredDocs.push({ name: cleanName.slice(0, 80), url: resolved, type: "docx" });
      } else if (isDoc) {
        seenUrls.add(resolved);
        const name = $(el).text().trim() || resolved.split("/").pop()?.split("?")[0] || "document.doc";
        const cleanName = name.toLowerCase().endsWith(".doc") ? name : `${name}.doc`;
        discoveredDocs.push({ name: cleanName.slice(0, 80), url: resolved, type: "doc" });
      }
    } catch {
      // Ignore invalid link URLs
    }
  });

  // Clean webpage HTML to extract pure content
  $(
    "script, style, noscript, nav, footer, header, aside, svg, form, iframe, embed, object, .ad, .ads, .banner, .cookie, #cookie-banner"
  ).remove();

  // Extract structured body text
  let bodyText = "";
  $("article, main, .content, .post, #content, body").first().each((_, el) => {
    // Preserve basic structural line breaks
    $(el)
      .find("h1, h2, h3, h4, h5, h6, p, li, blockquote, tr")
      .each((__, item) => {
        const text = $(item).text().replace(/\s+/g, " ").trim();
        if (text) {
          bodyText += text + "\n\n";
        }
      });
  });

  if (!bodyText.trim()) {
    bodyText = $("body").text().replace(/\s+/g, " ").trim();
  }

  // Deep Crawl: Fetch and extract content from up to maxDocs linked PDFs/DOCs
  const parsedLinkedDocs: CrawledDoc[] = [];

  if (deepCrawlDocs && discoveredDocs.length > 0) {
    const docsToFetch = discoveredDocs.slice(0, maxDocs);

    await Promise.all(
      docsToFetch.map(async (doc) => {
        try {
          const docRes = await fetchWithTimeout(doc.url, 12000);
          if (!docRes.ok) return;

          const docBuffer = await docRes.arrayBuffer();
          if (doc.type === "pdf") {
            const { text, pageCount } = await extractRemotePdf(docBuffer);
            const snippets = searchQuery ? extractMatchingExcerpts(text, searchQuery) : [];
            parsedLinkedDocs.push({
              name: doc.name,
              url: doc.url,
              type: "pdf",
              pageCount,
              wordCount: text.split(/\s+/).filter(Boolean).length,
              content: text.slice(0, 25000), // generous cap per document
              matchedSnippets: snippets.length > 0 ? snippets : undefined,
            });
          } else if (doc.type === "docx") {
            const { text } = await extractRemoteDocx(docBuffer);
            const snippets = searchQuery ? extractMatchingExcerpts(text, searchQuery) : [];
            parsedLinkedDocs.push({
              name: doc.name,
              url: doc.url,
              type: "docx",
              wordCount: text.split(/\s+/).filter(Boolean).length,
              content: text.slice(0, 25000),
              matchedSnippets: snippets.length > 0 ? snippets : undefined,
            });
          }
        } catch (err: any) {
          console.error(`Failed to deep crawl linked document: ${doc.url}`, err.message);
        }
      })
    );
  }

  return {
    url: urlObj.toString(),
    title,
    description,
    isDirectDoc: false,
    docType: "html",
    content: bodyText.trim().slice(0, 40000),
    wordCount: bodyText.split(/\s+/).filter(Boolean).length,
    linkedDocs: parsedLinkedDocs,
  };
}
