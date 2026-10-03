
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
export * from './license';
export * from './os_shield';
export * from './mirage';
export * from './font_armor';

export function isAiBot(req: RakshakRequest): boolean {
  return detectAiScraper(req).isBot;
}
