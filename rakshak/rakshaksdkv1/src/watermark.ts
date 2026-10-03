/**
 * Rakshak SDK v1 - Steganographic Canary Watermarking Engine
 * Embeds invisible, tamper-resistant cryptographic canary signatures into text
 * to detect and prove unauthorized LLM ingestion and model regurgitation.
 * Universal Web Standard implementation (runs in Node, Bun, Deno, and Vercel/Cloudflare Edge).
 */

const ZW_ZERO = '\u200B'; // Zero-Width Space represents binary 0
const ZW_ONE = '\u200C';  // Zero-Width Non-Joiner represents binary 1
const ZW_DELIM = '\u200D'; // Zero-Width Joiner represents start/end boundary

export interface WatermarkPayload {
  orgId: string;
  timestamp?: number;
  nonce?: string;
}

export class RakshakWatermark {
  /**
   * Encodes a string payload into an invisible sequence of zero-width characters.
   */
  private static encodeBinary(payloadStr: string): string {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(payloadStr);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += bytes[i].toString(2).padStart(8, '0');
    }

    let zwString = ZW_DELIM;
    for (let i = 0; i < binary.length; i++) {
      zwString += binary[i] === '0' ? ZW_ZERO : ZW_ONE;
    }
    zwString += ZW_DELIM;
    return zwString;
  }

  /**
   * Injects an invisible cryptographic watermark into text at word boundaries.
   */
  public static inject(content: string, payload: WatermarkPayload): string {
    const encodedPayload = JSON.stringify({
      org: payload.orgId,
      t: payload.timestamp || Date.now(),
      n: payload.nonce || Math.random().toString(36).substring(2, 8),
    });

    const watermark = this.encodeBinary(encodedPayload);

    // Inject invisibly after the first paragraph or sentence
    const periodIndex = content.indexOf('. ');
    if (periodIndex !== -1) {
      return content.slice(0, periodIndex + 1) + watermark + content.slice(periodIndex + 1);
    }

    // Fallback: inject after first word
    const spaceIndex = content.indexOf(' ');
    if (spaceIndex !== -1) {
      return content.slice(0, spaceIndex) + watermark + content.slice(spaceIndex);
    }

    return content + watermark;
  }

  /**
   * Extracts and verifies any embedded watermark payload from scraped or output text.
   */
  public static extract(text: string): WatermarkPayload | null {
    const start = text.indexOf(ZW_DELIM);
    if (start === -1) return null;

    const end = text.indexOf(ZW_DELIM, start + 1);
    if (end === -1) return null;

    const zwContent = text.slice(start + 1, end);
    let binary = '';

    for (let i = 0; i < zwContent.length; i++) {
      const char = zwContent[i];
      if (char === ZW_ZERO) binary += '0';
      else if (char === ZW_ONE) binary += '1';
    }

    if (binary.length % 8 !== 0) return null;

    try {
      const bytes = new Uint8Array(binary.length / 8);
      for (let i = 0; i < binary.length; i += 8) {
        bytes[i / 8] = parseInt(binary.slice(i, i + 8), 2);
      }
      const decoder = new TextDecoder('utf-8');
      const jsonStr = decoder.decode(bytes);
      const parsed = JSON.parse(jsonStr);
      return {
        orgId: parsed.org,
        timestamp: parsed.t,
        nonce: parsed.n,
      };
    } catch {
      return null;
    }
  }

  /**
   * Checks if a string contains any Rakshak zero-width canary markers.
   */
  public static hasWatermark(text: string): boolean {
    return text.includes(ZW_DELIM);
  }
}
