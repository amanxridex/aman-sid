/**
 * Rakshak Sovereign Font Armor SDK Module
 * "Zero-DOM-Text & Polymorphic Glyph Protection"
 * 
 * Protects web applications from headless scrapers (Playwright, Puppeteer, Undetected Chromedriver)
 * by eliminating plain-text DOM nodes and replacing them with CSS pseudo-element injection
 * and Unicode Private Use Area (PUA) glyph vectors.
 */

const PUA_BASE = 0xE100;

export class RakshakFontArmor {
  /**
   * Scrambles standard ASCII text into randomized Unicode Private Use Area characters.
   */
  public static scrambleText(text: string, seed: number = 0): string {
    if (!text) return '';
    let scrambled = '';
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
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
   * Generates a protected HTML snippet with CSS pseudo-element injection
   * and decoy honeypot text for automated scrapers.
   */
  public static protectHtml(text: string, decoy: string = 'CANARY_DECOY_VALUE'): string {
    const id = 'fa_' + Math.random().toString(36).substring(2, 9);
    const escaped = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\A ');
    return `<style>.${id}::before{content:"${escaped}";pointer-events:none;}.${id} .rsk-decoy{position:absolute;width:1px;height:1px;overflow:hidden;opacity:0.001;}</style><span class="${id}"><span class="rsk-decoy">${decoy}</span></span>`;
  }

  /**
   * Generates a self-contained adversarial HTML5 Canvas script that renders text
   * with sub-pixel chromatic phase shifts and high-frequency moiré perturbations
   * to defeat Vision Transformer (ViT) and multimodal AI OCR engines (GPT-4o, Claude).
   */
  public static generateAdversarialCanvas(canvasId: string, text: string, options: { fontSize?: number; color?: string } = {}): string {
    const fontSize = options.fontSize || 24;
    const color = options.color || '#ffffff';
    const escaped = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `(function(){
      var c=document.getElementById("${canvasId}");if(!c)return;
      var ctx=c.getContext("2d"),dpr=window.devicePixelRatio||1;
      var fs="${fontSize}px -apple-system, sans-serif";
      ctx.font="bold "+fs;var m=ctx.measureText("${escaped}");
      var w=Math.ceil(m.width)+8,h=Math.ceil(${fontSize}*1.35);
      c.width=w*dpr;c.height=h*dpr;c.style.width=w+"px";c.style.height=h+"px";
      ctx.scale(dpr,dpr);ctx.font="bold "+fs;ctx.textBaseline="middle";
      for(var x=0;x<w;x+=3){for(var y=0;y<h;y+=3){if((x+y)%6===0){ctx.fillStyle="rgba(255,255,255,0.016)";ctx.fillRect(x,y,1,1);}}}
      ctx.fillStyle="rgba(41,151,255,0.35)";ctx.fillText("${escaped}",1.55,h/2);
      ctx.fillStyle="rgba(255,69,58,0.25)";ctx.fillText("${escaped}",2.45,h/2);
      ctx.fillStyle="${color}";ctx.fillText("${escaped}",2,h/2);
    })();`;
  }
}
