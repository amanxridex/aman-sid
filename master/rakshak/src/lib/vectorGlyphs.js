/**
 * Rakshak Sovereign Vector Glyph Engine
 * 
 * Renders typography via pure vector path bezier curves and line strokes.
 * COMPLETELY ELIMINATES CanvasRenderingContext2D.prototype.fillText!
 * 
 * When headless scrapers (Playwright, Puppeteer, Selenium) hook or proxy
 * CanvasRenderingContext2D.prototype.fillText to steal text from memory:
 *   -> The hook NEVER FIRES because fillText is NEVER CALLED.
 *   -> Scraper interceptors capture 0 bytes of text.
 */

const GLYPHS = {
  '0': [
    { type: 'ellipse', cx: 5, cy: 8, rx: 3.8, ry: 6.8 }
  ],
  '1': [
    { type: 'path', ops: [['M', 2.5, 4], ['L', 5, 1.5], ['L', 5, 15], ['M', 2, 15], ['L', 8, 15]] }
  ],
  '2': [
    { type: 'path', ops: [['M', 1.8, 4.5], ['C', 1.8, 1.2, 8.2, 1.2, 8.2, 5], ['C', 8.2, 8.5, 2, 11.5, 1.8, 15], ['L', 8.5, 15]] }
  ],
  '3': [
    { type: 'path', ops: [['M', 2, 2.5], ['L', 8, 2.5], ['L', 4.8, 7.5], ['C', 7.5, 7.5, 8.5, 10, 8.2, 12.5], ['C', 7.8, 15.5, 2.5, 15.5, 1.8, 13.5]] }
  ],
  '4': [
    { type: 'path', ops: [['M', 6.8, 15], ['L', 6.8, 1.5], ['L', 1.5, 10.5], ['L', 8.8, 10.5]] }
  ],
  '5': [
    { type: 'path', ops: [['M', 8, 2.5], ['L', 2.2, 2.5], ['L', 2.2, 8], ['C', 3.5, 7, 8.2, 7.2, 8.2, 11.5], ['C', 8.2, 15.5, 2.2, 15.5, 1.5, 13.2]] }
  ],
  '6': [
    { type: 'path', ops: [['M', 7.2, 2.5], ['C', 3, 2.5, 1.8, 6.5, 1.8, 11], ['C', 1.8, 15.5, 8.5, 15.5, 8.5, 10.5], ['C', 8.5, 6.8, 1.8, 7.5, 1.8, 10.5]] }
  ],
  '7': [
    { type: 'path', ops: [['M', 1.5, 2.5], ['L', 8.5, 2.5], ['L', 3.8, 15]] }
  ],
  '8': [
    { type: 'ellipse', cx: 5, cy: 4.8, rx: 3.2, ry: 3.4 },
    { type: 'ellipse', cx: 5, cy: 11.4, rx: 3.6, ry: 3.8 }
  ],
  '9': [
    { type: 'path', ops: [['M', 2.8, 13.5], ['C', 7, 13.5, 8.2, 9.5, 8.2, 5], ['C', 8.2, 1.2, 1.5, 1.2, 1.5, 5.5], ['C', 1.5, 9.2, 8.2, 8.5, 8.2, 5.5]] }
  ],
  '$': [
    { type: 'path', ops: [['M', 5, 0.2], ['L', 5, 15.8]] },
    { type: 'path', ops: [['M', 8.2, 4.2], ['C', 2, 2.2, 2, 8, 5, 8], ['C', 8, 8, 8, 13.8, 1.8, 12.5]] }
  ],
  '/': [
    { type: 'path', ops: [['M', 1.5, 15], ['L', 8.5, 1.5]] }
  ],
  '.': [
    { type: 'dot', cx: 5, cy: 14.5, r: 1.2 }
  ],
  ',': [
    { type: 'path', ops: [['M', 5, 13.5], ['L', 5, 15.5], ['L', 3.5, 17.5]] }
  ],
  'm': [
    { type: 'path', ops: [['M', 1.5, 15], ['L', 1.5, 7.5], ['C', 1.5, 5.5, 5, 5.5, 5, 7.5], ['L', 5, 15], ['M', 5, 7.5], ['C', 5, 5.5, 8.5, 5.5, 8.5, 7.5], ['L', 8.5, 15]] }
  ],
  'o': [
    { type: 'ellipse', cx: 5, cy: 10.5, rx: 3.5, ry: 4.5 }
  ],
  '+': [
    { type: 'path', ops: [['M', 5, 4], ['L', 5, 12]], ops2: [['M', 1, 8], ['L', 9, 8]] }
  ],
  '-': [
    { type: 'path', ops: [['M', 1.5, 8.5], ['L', 8.5, 8.5]] }
  ],
  '%': [
    { type: 'path', ops: [['M', 1.5, 15], ['L', 8.5, 1.5]] },
    { type: 'dot', cx: 3, cy: 4, r: 1.2 },
    { type: 'dot', cx: 7, cy: 12, r: 1.2 }
  ],
  'k': [
    { type: 'path', ops: [['M', 1.8, 1.5], ['L', 1.8, 15], ['M', 8, 6], ['L', 2, 10.5], ['L', 8.2, 15]] }
  ]
};

/**
 * Checks if prototype tampering / function hooking has been attempted on Canvas
 */
export function isCanvasHooked() {
  if (typeof window === 'undefined') return false;
  try {
    const fn = CanvasRenderingContext2D.prototype.fillText;
    const str = Function.prototype.toString.call(fn);
    return !str.includes('[native code]');
  } catch {
    return false;
  }
}

/**
 * Measures total rendered width of vector glyph text string
 */
export function measureVectorWidth(str, fontSize) {
  const scale = fontSize / 16;
  const glyphWidth = 10 * scale;
  const tracking = 2 * scale;
  return str.length * (glyphWidth + tracking);
}

/**
 * Renders text strictly using vector geometry (zero fillText invocations)
 */
export function renderVectorText(ctx, str, startX, startY, fontSize, color, options = {}) {
  const { strokeOffset = 0, chromaticChannel = null } = options;
  const scale = fontSize / 16;
  const glyphW = 10 * scale;
  const tracking = 2.5 * scale;
  const lineWidth = Math.max(1.8, fontSize * 0.115);

  ctx.save();
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (chromaticChannel === 'cyan') {
    ctx.strokeStyle = 'rgba(41, 151, 255, 0.4)';
    ctx.fillStyle = 'rgba(41, 151, 255, 0.4)';
  } else if (chromaticChannel === 'amber') {
    ctx.strokeStyle = 'rgba(255, 69, 58, 0.3)';
    ctx.fillStyle = 'rgba(255, 69, 58, 0.3)';
  } else {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
  }

  let curX = startX + strokeOffset;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i].toLowerCase();
    const glyph = GLYPHS[ch];

    if (glyph) {
      for (const part of glyph) {
        if (part.type === 'ellipse') {
          ctx.beginPath();
          ctx.ellipse(
            curX + part.cx * scale,
            startY + part.cy * scale,
            part.rx * scale,
            part.ry * scale,
            0, 0, Math.PI * 2
          );
          ctx.stroke();
        } else if (part.type === 'dot') {
          ctx.beginPath();
          ctx.arc(
            curX + part.cx * scale,
            startY + part.cy * scale,
            part.r * scale,
            0, Math.PI * 2
          );
          ctx.fill();
        } else if (part.type === 'path') {
          ctx.beginPath();
          for (const op of part.ops) {
            const cmd = op[0];
            if (cmd === 'M') ctx.moveTo(curX + op[1] * scale, startY + op[2] * scale);
            else if (cmd === 'L') ctx.lineTo(curX + op[1] * scale, startY + op[2] * scale);
            else if (cmd === 'C') ctx.bezierCurveTo(
              curX + op[1] * scale, startY + op[2] * scale,
              curX + op[3] * scale, startY + op[4] * scale,
              curX + op[5] * scale, startY + op[6] * scale
            );
          }
          ctx.stroke();

          if (part.ops2) {
            ctx.beginPath();
            for (const op of part.ops2) {
              if (op[0] === 'M') ctx.moveTo(curX + op[1] * scale, startY + op[2] * scale);
              else if (op[0] === 'L') ctx.lineTo(curX + op[1] * scale, startY + op[2] * scale);
            }
            ctx.stroke();
          }
        }
      }
    } else {
      // For any space or unrecognized character, advance cursor
    }
    curX += glyphW + tracking;
  }

  ctx.restore();
}
