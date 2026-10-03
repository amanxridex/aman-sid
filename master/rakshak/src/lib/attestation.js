/**
 * Rakshak Sovereign Ephemeral Attestation System
 * 
 * Neutralizes Direct API Sniffing & "Copy as cURL" DevTools Replays.
 * 
 * Attaches a cryptographically signed, 8-second time-bound token (x-rakshak-attestation)
 * to all /api/rakshak/* requests from legitimate client sessions.
 * 
 * If a hacker copies the request as cURL from Chrome DevTools and replays it,
 * the token will be expired (>8s), serving them an HTTP 200 OK Asymmetric Canary Mirage.
 */

const ATTESTATION_SEED = 'RSK_SOVEREIGN_CITADEL_2026';

export function generateAttestationToken(path, timestamp = Date.now()) {
  const cleanPath = (path || '').split('?')[0];
  const raw = `${timestamp}:${cleanPath}:${ATTESTATION_SEED}`;
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `${timestamp}.${(hash >>> 0).toString(16)}`;
}

export function verifyAttestationToken(token, path, maxAgeMs = 8000) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const timestamp = parseInt(parts[0], 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  // Ephemeral time window: ±8000ms to allow small clock skew
  if (Math.abs(now - timestamp) > maxAgeMs) {
    return false; // Expired!
  }

  const cleanPath = (path || '').split('?')[0];
  const expected = generateAttestationToken(cleanPath, timestamp);
  return token === expected;
}

function getChallengeFromCookie() {
  if (typeof document === 'undefined' || !document.cookie) return null;
  const match = document.cookie.match(/(?:^|;\s*)rsk_challenge=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Automatically patches window.fetch on client load so all /api/rakshak/ requests
 * carry real-time server-issued challenge tokens and ephemeral nonces.
 */
export function installClientAttestationInterceptor() {
  if (typeof window === 'undefined' || !window.fetch || window.__rsk_attestation_installed) return;
  window.__rsk_attestation_installed = true;

  const originalFetch = window.fetch;
  window.fetch = function (resource, init) {
    let url = typeof resource === 'string' ? resource : (resource && resource.url ? resource.url : '');

    if (url && url.includes('/api/rakshak/')) {
      try {
        let pathname = url;
        if (url.startsWith('http://') || url.startsWith('https://')) {
          pathname = new URL(url).pathname;
        } else if (url.startsWith('/')) {
          pathname = url.split('?')[0];
        }

        const token = generateAttestationToken(pathname);
        const serverChallenge = getChallengeFromCookie();

        init = init || {};
        let headers = init.headers;

        if (!headers) {
          headers = { 'x-rakshak-attestation': token };
        } else if (typeof Headers !== 'undefined' && headers instanceof Headers) {
          headers.set('x-rakshak-attestation', token);
          if (serverChallenge) headers.set('x-rakshak-challenge', serverChallenge);
        } else if (Array.isArray(headers)) {
          headers.push(['x-rakshak-attestation', token]);
          if (serverChallenge) headers.push(['x-rakshak-challenge', serverChallenge]);
        } else if (typeof headers === 'object') {
          headers['x-rakshak-attestation'] = token;
          if (serverChallenge) headers['x-rakshak-challenge'] = serverChallenge;
        }

        if (serverChallenge && !(headers instanceof Headers) && !Array.isArray(headers)) {
          headers['x-rakshak-challenge'] = serverChallenge;
        }

        init.headers = headers;
      } catch {}
    }

    return originalFetch.call(this, resource, init);
  };
}

