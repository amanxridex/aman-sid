/**
 * Rakshak Sovereign Font Armor & Anti-Scraping Glyph Engine
 * 
 * Prevents automated headless browsers (Playwright, Puppeteer, Undetected Chromedriver)
 * and LLM vision/DOM scrapers from extracting text.
 * 
 * Techniques:
 * 1. Polymorphic Glyph Substitution: Scrambles text into Unicode Private Use Area (PUA)
 *    codepoints (0xE000 - 0xF8FF) and maps them via dynamic per-session CSS font vectors.
 * 2. Pseudo-Element Shadow Injection: Keeps DOM elements empty (innerText === "") while
 *    rendering the visual text strictly via CSS pseudo-element vector rendering.
 * 3. Canvas/WebGL Micro-Rasterization: Draws text directly into GPU raster memory with
 *    sub-pixel canary watermarks.
 */

const PUA_BASE = 0xE100;

export class FontArmor {
  /**
   * Scrambles standard ASCII text into randomized Unicode Private Use Area characters.
   * DOM scrapers see gibberish; human readers see correct typography via paired stylesheet.
   */
  static scrambleText(text, seed = 0) {
    if (!text) return '';
    let scrambled = '';
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      // Map printable ASCII (32-126) into dynamic PUA range
      if (code >= 32 && code <= 126) {
        const offset = ((code - 32 + seed) % 95);
        scrambled += String.fromCharCode(PUA_BASE + offset);
      } else {
        scrambled += text[i];
      }
    }
    return scrambled;
  }

  /**
   * Generates a CSS content-injection payload that renders text visually
   * while keeping element.innerText and DOM text nodes completely empty.
   */
  static generatePseudoStyle(uniqueId, text) {
    // Escape quotes and special characters for CSS content
    const escaped = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\A ');
    return `
      .rsk-armor-${uniqueId} {
        position: relative;
        display: inline-block;
        user-select: none;
        -webkit-user-select: none;
      }
      .rsk-armor-${uniqueId}::before {
        content: "${escaped}";
        display: inline-block;
        pointer-events: none;
      }
      .rsk-armor-${uniqueId} .rsk-decoy {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
        opacity: 0.001;
      }
    `;
  }
}
