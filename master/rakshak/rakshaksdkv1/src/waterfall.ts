
import { assertPaidTier } from './license';

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

  private static readonly ASSET_REGEX = /\.(css|js|mjs|woff|woff2|ttf|png|jpg|jpeg|svg|webp|ico)(\?.*)?$/i;

  public static recordAndEvaluate(clientId: string, path: string, options: { isSuspicious?: boolean; hasClientHints?: boolean } = {}): WaterfallMetrics {
    assertPaidTier('Waterfall Topology Engine');
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
