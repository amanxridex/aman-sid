import { NextRequest } from "next/server";
import { crawlUrl } from "@/lib/crawler";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { url, searchQuery, deepCrawlDocs = true, maxDocs = 4 } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid URL parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      return new Response(
        JSON.stringify({ error: "URL must start with http:// or https://" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await crawlUrl(trimmedUrl, {
      searchQuery: typeof searchQuery === "string" ? searchQuery.trim() : "",
      deepCrawlDocs: Boolean(deepCrawlDocs),
      maxDocs: typeof maxDocs === "number" ? Math.min(6, Math.max(1, maxDocs)) : 4,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Crawl API error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to crawl target URL" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
