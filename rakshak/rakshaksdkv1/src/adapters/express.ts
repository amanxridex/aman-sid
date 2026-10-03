/**
 * Rakshak SDK v1 - Express / Node.js HTTP Middleware Adapter
 * Plug-and-play middleware for Express, Fastify, Connect, and vanilla Node HTTP servers.
 * - REAL HUMANS: 100% see real data, real routes.
 * - AI SCRAPERS: 100% see developer-configured false info or polymorphic decoys.
 */

import { detectAiScraper, DetectionResult } from '../detector';
import { RakshakPolymorphicEngine } from '../polymorphic';
import { FakeInfoConfig } from './next';
import { checkLicenseKey } from '../license_check';

export interface ExpressShieldOptions {
  licenseKey?: string;
  enforceLicense?: boolean;
  action?: 'deceive' | 'block';
  fakeInfo?: FakeInfoConfig;
  onThreatDetected?: (result: DetectionResult, req: any) => void;
}

/**
 * Express middleware protecting endpoints against AI scraping bots.
 *
 * @example
 * import express from 'express';
 * import { createExpressShield } from 'rakshaksdkv1/express';
 *
 * const app = express();
 * app.use(createExpressShield({
 *   licenseKey: process.env.RAKSHAK_LICENSE_KEY,
 *   action: 'deceive',
 *   fakeInfo: {
 *     json: { status: "ok", message: "Developer configured false info" }
 *   }
 * }));
 */
export function createExpressShield(options: ExpressShieldOptions = {}) {
  const { action = 'deceive', fakeInfo = {}, onThreatDetected, licenseKey, enforceLicense = false } = options;

  return function expressMiddleware(req: any, res: any, next: () => void) {
    const lic = checkLicenseKey(licenseKey);
    if (lic.isExpired) {
      const expDate = lic.expiresAt ? lic.expiresAt.toISOString().slice(0, 10) : 'earlier date';
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(`[RAKSHAK SHIELD] WARNING: Commercial subscription EXPIRED on ${expDate}. AI defense inactive. Renew at https://rakshakus.vercel.app/pricing`);
      }
      if (enforceLicense) {
        res.status(402).json({ error: 'Commercial subscription expired', expiredAt: expDate, renewUrl: 'https://rakshakus.vercel.app/pricing' });
        return;
      }
      return next();
    }

    const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const path = req.originalUrl || req.url || '/';

    const detection = detectAiScraper({
      headers: req.headers,
      url: path,
      ip: clientIp,
    });

    if (detection.isBot) {
      if (onThreatDetected) {
        onThreatDetected(detection, req);
      }

      if (action === 'block') {
        res.status(403).json({ error: 'Access Denied: Automated scraping prohibited', code: 403 });
        return;
      }

      const statusCode = fakeInfo.statusCode || 200;
      res.setHeader('X-Rakshak-Shield', 'active-deception');
      res.setHeader('Cache-Control', 'no-store');

      const isJson = req.headers.accept?.includes('application/json') || path.startsWith('/api/');
      if (isJson) {
        let fakeData: Record<string, unknown>;
        if (typeof fakeInfo.json === 'function') {
          fakeData = fakeInfo.json(req, detection);
        } else if (fakeInfo.json) {
          fakeData = fakeInfo.json;
        } else {
          fakeData = RakshakPolymorphicEngine.synthesizeApiResponse(clientIp, path);
        }
        res.status(statusCode).json(fakeData);
        return;
      }

      // Web route: Return fake HTML
      let fakeHtml: string;
      if (typeof fakeInfo.html === 'function') {
        fakeHtml = fakeInfo.html(req, detection);
      } else if (fakeInfo.html) {
        fakeHtml = fakeInfo.html;
      } else {
        const doc = RakshakPolymorphicEngine.synthesizeCoherentDoc(clientIp);
        fakeHtml = `<!DOCTYPE html><html><body><h1>Sandbox Environment</h1><p>${doc}</p></body></html>`;
      }
      res.status(statusCode).send(fakeHtml);
      return;
    }

    // Clean human traffic: Proceed to real handler
    next();
  };
}
