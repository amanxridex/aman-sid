import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import mammoth from "mammoth";
import { extractText } from "unpdf";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name || "document";
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";
    let pageCount: number | undefined = undefined;

    if (extension === "pdf") {
      try {
        const result = await extractText(new Uint8Array(arrayBuffer));
        extractedText = Array.isArray(result.text) ? result.text.join("\n\n") : String(result.text || "");
        pageCount = result.totalPages;
      } catch (pdfErr: any) {
        console.error("PDF parse error:", pdfErr);
        return NextResponse.json(
          { error: `Could not parse PDF: ${pdfErr.message || "Invalid or encrypted PDF"}` },
          { status: 422 }
        );
      }
    } else if (extension === "docx" || extension === "doc") {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || "";
      } catch (docErr: any) {
        console.error("DOCX parse error:", docErr);
        // Fallback: try raw text decoding
        extractedText = buffer.toString("utf-8").replace(/[^\x20-\x7E\t\r\n]/g, " ");
      }
    } else if (["png", "jpg", "jpeg", "webp", "gif", "bmp"].includes(extension)) {
      const mime = file.type || `image/${extension === "jpg" ? "jpeg" : extension}`;
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${mime};base64,${base64Data}`;
      return NextResponse.json({
        name: fileName,
        type: "image",
        size: file.size,
        text: `[Image Attached: ${fileName}]`,
        dataUrl,
        wordCount: 0,
      });
    } else if (["txt", "md", "csv", "json", "log", "xml"].includes(extension)) {
      extractedText = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: `Unsupported file type: .${extension}. Please upload a PDF, DOCX, image, or TXT file.` },
        { status: 400 }
      );
    }

    // Clean up excessive whitespace
    extractedText = extractedText.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

    if (!extractedText) {
      return NextResponse.json(
        { error: "No readable text could be extracted from this document." },
        { status: 422 }
      );
    }

    const words = extractedText.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({
      name: fileName,
      type: extension === "pdf" ? "pdf" : extension === "docx" || extension === "doc" ? "doc" : "text",
      size: file.size,
      text: extractedText,
      wordCount: words,
      pageCount,
    });
  } catch (error: any) {
    console.error("Document parse error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process document" },
      { status: 500 }
    );
  }
}
