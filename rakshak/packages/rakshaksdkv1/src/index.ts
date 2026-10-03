/**
 * Rakshak SDK v1 - Main Entry Point
 * Zero-Trust Local Anti-AI Shield & Telemetry Scraping Defense
 *
 * @license Apache-2.0
 * @author Rakshak Security Systems
 */

import { detectAiScraper, RakshakRequest, DetectionResult } from './detector';

export * from './constants';
export * from './detector';
export * from './topology';
export * from './entropy';
export * from './waterfall';
export * from './polymorphic';
export * from './watermark';
export * from './poisoner';
export * from './adapters/next';
export * from './adapters/express';
export * from './rsk_compiler';
export * from './rsk_vm';
export * from './init_cli';

/**
 * Top-level convenience verification function
 */
export function isAiBot(req: RakshakRequest): boolean {
  return detectAiScraper(req).isBot;
}
