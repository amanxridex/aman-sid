/**
 * Rakshak SDK v1 - Asset Waterfall & Zero-Signature Behavioral Analyzer
 * Detects stealth scrapers that spoof genuine desktop Chrome User-Agents
 * by analyzing their failure to execute genuine browser asset request waterfalls
 * (CSS, JS chunks, fonts, favicon, and image preloads).
 */

export interface WaterfallMetrics {
  documentRequests: number;
  subresourceRequests: number;
  ratio: number;
  isHeadlessExtractor: boolean;
  confidence: number;
  reasons: string[];
}

interface ClientWaterfallState {
  docs: number;
  assets: number;
  lastSeen: number;
}

export class RakshakWaterfallEngine {
  private static clientSessions: Map<string, ClientWaterfallState> = new Map();
  private static readonly TTL_MS = 120_000; // 2-minute sliding window

  // Extensions that a genuine browser engine automatically requests when rendering a page
  private static readonly ASSET_REGEX = /\.(css|js|mjs|woff|woff2|ttf|png|jpg|jpeg|svg|webp|ico)(\?.*)?$/i;

  /**
   * Records a request and evaluates whether the client exhibits genuine browser rendering cascades.
   * 
   * Human browser reality:
   * When a human loads a webpage in Chrome/Safari/Firefox, the browser parses the HTML and immediately
   * initiates a burst of 15-60 parallel subresource requests (CSS, JS bundles, fonts, images, favicon).
   * 
   * Stealth AI scraper reality:
   * Scrapers (Crawl4AI, Firecrawl, Python scripts, Puppeteer with request interception) abort or ignore
   * static subresources to save bandwidth and scrape faster. They fetch ONLY HTML or API routes.
   */
  public static recordAndEvaluate(clientId: string, path: string, options: { isSuspicious?: boolean; hasClientHints?: boolean } = {}): WaterfallMetrics {
    const now = Date.now();
    this.pruneOldSessions(now);

    let state = this.clientSessions.get(clientId);
    if (!state) {
      state = { docs: 0, assets: 0, lastSeen: now };
      this.clientSessions.set(clientId, state);
    }

    state.lastSeen = now;

    const isAsset = this.ASSET_REGEX.test(path);
    if (isAsset) {
      state.assets++;
    } else {
      state.docs++;
    }

    const reasons: string[] = [];
    let isHeadlessExtractor = false;
    let confidence = 0;

    // Genuine desktop/mobile browsers cache assets or CDNs bypass middleware.
    // Therefore, waterfall enforcement only flags zero subresources if the client is ALREADY suspicious
    // (e.g. missing client hints, datacenter origin, or non-browser fetch topology).
    const canEvaluate = options.isSuspicious || !options.hasClientHints;

    if (canEvaluate) {
      if (state.docs >= 4 && state.assets === 0) {
        isHeadlessExtractor = true;
        confidence = 95;
        reasons.push(
          `ZERO_SUBRESOURCE_WATERFALL: Client requested ${state.docs} documents/endpoints without initiating a single CSS/JS/image render cascade.`
        );
      } else if (state.docs >= 8 && (state.assets / state.docs) < 0.25) {
        isHeadlessExtractor = true;
        confidence = 85;
        reasons.push(
          `ABNORMAL_ASSET_RATIO: Subresource ratio (${(state.assets / state.docs).toFixed(2)}) is mathematically inconsistent with desktop browser rendering.`
        );
      }
    }

    const ratio = state.docs > 0 ? state.assets / state.docs : 1.0;

    return {
      documentRequests: state.docs,
      subresourceRequests: state.assets,
      ratio,
      isHeadlessExtractor,
      confidence,
      reasons
    };
  }

  private static pruneOldSessions(now: number): void {
    if (this.clientSessions.size > 10_000) {
      for (const [key, val] of this.clientSessions.entries()) {
        if (now - val.lastSeen > this.TTL_MS) {
          this.clientSessions.delete(key);
        }
      }
    }
  }

  public static reset(): void {
    this.clientSessions.clear();
  }
}
