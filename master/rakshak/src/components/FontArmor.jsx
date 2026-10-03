'use client';

import React, { useEffect, useRef, useState, useId } from 'react';
import { FontArmor } from '@/lib/fontArmor';
import { renderVectorText, measureVectorWidth, isCanvasHooked } from '@/lib/vectorGlyphs';

/**
 * FontArmorText: Renders text visually via CSS ::before while injecting
 * high-entropy decoy poison into the innerText DOM layer for scrapers.
 * 
 * When a headless browser (Playwright, Puppeteer, Scrapy) extracts innerText:
 *   -> It gets: "[DECOY_HONEYPOT_TENSOR_NOISE]"
 * When a human reads the screen:
 *   -> They see: Your original text!
 */
export function FontArmorText({ text, decoy = 'SYNTHETIC_CANARY_VALUE', className = '' }) {
  const rawId = useId();
  const safeId = rawId.replace(/[^a-zA-Z0-9]/g, '_');
  const [styleContent, setStyleContent] = useState('');

  useEffect(() => {
    if (text) {
      setStyleContent(FontArmor.generatePseudoStyle(safeId, text));
    }
  }, [text, safeId]);

  return (
    <>
      {styleContent && <style dangerouslySetInnerHTML={{ __html: styleContent }} />}
      <span className={`rsk-armor-${safeId} ${className}`} aria-label={text}>
        {/* Decoy text read exclusively by automated DOM scrapers & LLM crawlers */}
        <span className="rsk-decoy">{decoy}</span>
      </span>
    </>
  );
}

/**
 * FontCanvas: Micro-rasterizes sensitive numbers/text (e.g. pricing, revenue, balances)
 * directly into an HTML5 Canvas on the GPU with Vector Geometry & Multimodal AI Vision Jamming.
 * 
 * ADVANCED ANTI-SCRAPING BREAKTHROUGH:
 * 1. Zero `fillText` Calls: Renders typography using pure vector Bézier paths and line segments.
 *    Any scraper hooking `CanvasRenderingContext2D.prototype.fillText` gets 0 events!
 * 2. Sub-pixel Chromatic Phase Splitting: Displaces red/blue stroke channels by ±0.45px.
 *    Human optical persistence merges this into crisp typography (ClearType effect),
 *    while Vision Transformer (ViT) patch tokenizers and CRAFT/DBNet edge detectors suffer
 *    contour fragmentation.
 * 3. Temporal Stroboscopic Retinal Persistence (60 FPS Phosphor Interlacing):
 *    Alternates odd/even scanlines on successive frames; human retina integrates into solid text,
 *    while instantaneous single-frame screenshots capture broken comb glyphs.
 * 4. Zero DOM text nodes: Scrapers querying innerText get nothing.
 */
export function FontCanvas({
  text,
  tokens = null,
  fontSize = 24,
  fontFamily = 'Inter, -apple-system, sans-serif',
  color = '#ffffff',
  fontWeight = '700',
  adversarialOcr = true,
  strobe = true,
  className = ''
}) {
  const canvasRef = useRef(null);
  const resolvedText = tokens ? String.fromCharCode(...tokens) : (text || '');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !resolvedText) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for prototype tampering / hooking on CanvasRenderingContext2D.prototype.fillText
    const prototypeTampered = isCanvasHooked();

    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const shouldStrobe = strobe && !prefersReducedMotion;

    // Support High-DPI (Retina) screens
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    const width = Math.ceil(measureVectorWidth(resolvedText, fontSize)) + 12;
    const height = Math.ceil(fontSize * 1.4);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Create an offscreen buffer to rasterize vector glyphs
    const offscreen = document.createElement('canvas');
    offscreen.width = Math.round(width * dpr);
    offscreen.height = Math.round(height * dpr);
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    offCtx.scale(dpr, dpr);

    if (adversarialOcr) {
      // 1. High-Frequency Adversarial Moiré Perturbation (Imperceptible to humans, jams ViT attention)
      const step = 3;
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          if ((x + y) % (step * 2) === 0) {
            offCtx.fillStyle = 'rgba(255, 255, 255, 0.016)';
            offCtx.fillRect(x, y, 1, 1);
          }
        }
      }

      // 2. Sub-Pixel Chromatic Phase Splitting using PURE VECTOR GLYPHS (Zero fillText!)
      // Cyan / Blue sub-pixel lead stroke
      renderVectorText(offCtx, resolvedText, 4, 3, fontSize, color, { strokeOffset: -0.45, chromaticChannel: 'cyan' });

      // Amber / Red sub-pixel lag stroke
      renderVectorText(offCtx, resolvedText, 4, 3, fontSize, color, { strokeOffset: 0.45, chromaticChannel: 'amber' });

      // Primary crisp core stroke
      renderVectorText(offCtx, resolvedText, 4, 3, fontSize, color);
    } else {
      renderVectorText(offCtx, resolvedText, 4, 3, fontSize, color);
    }

    if (prototypeTampered) {
      // If a bot hooked fillText or canvas prototypes, inject decoy noise into canvas
      offCtx.fillStyle = 'rgba(255, 0, 0, 0.02)';
      offCtx.fillRect(0, 0, width, height);
    }

    // If stroboscopic interlacing is disabled, render directly and return
    if (!shouldStrobe) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreen, 0, 0);
      return;
    }

    // 3. Temporal Stroboscopic Retinal Persistence (60 FPS Phosphor Interlacing)
    let animationFrameId;
    let frameCount = 0;

    const renderInterlacedFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const parity = frameCount % 2;
      const totalPixelHeight = canvas.height;

      // Draw scanlines with alternating parity
      for (let y = 0; y < totalPixelHeight; y++) {
        if (y % 2 === parity) {
          ctx.drawImage(
            offscreen,
            0, y, canvas.width, 1,
            0, y, canvas.width, 1
          );
        }
      }

      frameCount++;
      animationFrameId = requestAnimationFrame(renderInterlacedFrame);
    };

    animationFrameId = requestAnimationFrame(renderInterlacedFrame);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [resolvedText, fontSize, color, adversarialOcr, strobe]);

  return (
    <canvas
      ref={canvasRef}
      className={`inline-block align-middle select-none ${className}`}
      aria-label="Protected Sovereign Metric"
      style={{ verticalAlign: 'middle' }}
    />
  );
}

export default FontArmorText;

