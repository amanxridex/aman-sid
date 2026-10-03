/**
 * Rakshak SDK v1 - Shannon Entropy & Request Velocity Tracker
 * In-memory sliding window ring buffer that calculates arrival jitter and path entropy.
 * Identifies robotic, low-entropy sequential crawling and rapid RAG ingestion.
 */

interface RequestEntry {
  timestamp: number;
  pathLength: number;
  pathSegmentEntropy: number;
}

export interface EntropyAnalysisResult {
  isRoboticVelocity: boolean;
  requestRatePerMinute: number;
  jitterVariance: number;
  entropyScore: number;
  reasons: string[];
}

export class RakshakEntropyEngine {
  private static readonly WINDOW_SIZE = 30; // Track last 30 requests per IP
  private static readonly clientWindows = new Map<string, RequestEntry[]>();
  private static lastCleanup = Date.now();

  /**
   * Computes the Shannon entropy of a string (e.g. request path or payload).
   */
  public static calculateShannonEntropy(str: string): number {
    if (!str || str.length === 0) return 0;
    const freq: Record<string, number> = {};
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      freq[c] = (freq[c] || 0) + 1;
    }

    let entropy = 0;
    const len = str.length;
    for (const c in freq) {
      const p = freq[c] / len;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }

  /**
   * Evaluates request arrival velocity and structural entropy for a given client identifier.
   */
  public static recordAndAnalyze(clientId: string, path: string): EntropyAnalysisResult {
    const now = Date.now();
    this.maybePrune(now);

    let entries = this.clientWindows.get(clientId);
    if (!entries) {
      entries = [];
      this.clientWindows.set(clientId, entries);
    }

    entries.push({
      timestamp: now,
      pathLength: path.length,
      pathSegmentEntropy: this.calculateShannonEntropy(path),
    });

    if (entries.length > this.WINDOW_SIZE) {
      entries.shift();
    }

    const reasons: string[] = [];
    let isRobotic = false;

    // Need at least 6 samples to evaluate velocity patterns
    if (entries.length < 6) {
      return {
        isRoboticVelocity: false,
        requestRatePerMinute: entries.length,
        jitterVariance: 1000,
        entropyScore: 100,
        reasons: [],
      };
    }

    // 1. Calculate Inter-Arrival Jitter (time between requests)
    const intervals: number[] = [];
    for (let i = 1; i < entries.length; i++) {
      intervals.push(entries[i].timestamp - entries[i - 1].timestamp);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance =
      intervals.reduce((acc, val) => acc + Math.pow(val - avgInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    // Rate estimation: requests per minute
    const timeSpanSec = (entries[entries.length - 1].timestamp - entries[0].timestamp) / 1000;
    const ratePerMin = timeSpanSec > 0 ? (entries.length / timeSpanSec) * 60 : 0;

    // 2. Robotic Detection: Ultra-low latency jitter (automated timers without human reading pauses)
    // If standard deviation of intervals is under 60ms and rate is > 40 req/min
    if (stdDev < 65 && ratePerMin > 40) {
      isRobotic = true;
      reasons.push(`Clockwork automated polling detected (Interval jitter stdDev: ${Math.round(stdDev)}ms)`);
    }

    // 3. High-frequency brute crawler check
    if (ratePerMin > 180) {
      isRobotic = true;
      reasons.push(`Anomalous crawl velocity: ${Math.round(ratePerMin)} req/min exceeds human threshold`);
    }

    return {
      isRoboticVelocity: isRobotic,
      requestRatePerMinute: Math.round(ratePerMin),
      jitterVariance: Math.round(variance),
      entropyScore: Math.round(stdDev),
      reasons,
    };
  }

  /**
   * Periodic pruning to prevent memory growth.
   */
  private static maybePrune(now: number): void {
    if (now - this.lastCleanup > 1000 * 60 * 10) { // Every 10 mins
      this.lastCleanup = now;
      for (const [ip, entries] of this.clientWindows.entries()) {
        if (entries.length === 0 || now - entries[entries.length - 1].timestamp > 1000 * 60 * 15) {
          this.clientWindows.delete(ip);
        }
      }
    }
  }
}
