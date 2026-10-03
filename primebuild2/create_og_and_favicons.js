const fs = require('fs');
const sharp = require('sharp');

async function main() {
  console.log('Generating Favicons and Open Graph image...');

  // 1. Generate Favicons and App Icons from public/logo.png
  await sharp('public/logo.png')
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('app/icon.png');
  console.log('Created app/icon.png (32x32)');

  await sharp('public/logo.png')
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/favicon.ico');
  console.log('Created public/favicon.ico (32x32)');

  await sharp('public/logo.png')
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/favicon.png');
  console.log('Created public/favicon.png (48x48)');

  await sharp('public/logo.png')
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('app/apple-icon.png');
  console.log('Created app/apple-icon.png (180x180)');

  await sharp('public/logo.png')
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Created public/apple-touch-icon.png (180x180)');

  // 2. Generate Cool 1200x630 Open Graph Image using Hero Photo proj_1.jpg
  // Read and resize logo for watermark/header
  const logoResizedBuf = await sharp('public/logo.png')
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const logoB64 = `data:image/png;base64,${logoResizedBuf.toString('base64')}`;

  // Crop & Resize hero image to 1200x630
  const heroResized = await sharp('public/images/projects_unique/proj_1.jpg')
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .toBuffer();

  // SVG Overlay with architectural typography, gradients, badges
  const overlaySvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="topVignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.85" />
        <stop offset="50%" stop-color="#000000" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="bottomVignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0" />
        <stop offset="45%" stop-color="#000000" stop-opacity="0.65" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95" />
      </linearGradient>
      <linearGradient id="badgeGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#dc2626" />
        <stop offset="100%" stop-color="#b91c1c" />
      </linearGradient>
    </defs>

    <!-- Top & Bottom Gradient Shadows for Ultra High Contrast -->
    <rect x="0" y="0" width="1200" height="240" fill="url(#topVignette)" />
    <rect x="0" y="240" width="1200" height="390" fill="url(#bottomVignette)" />

    <!-- Top Left Brand Bar -->
    <g transform="translate(60, 50)">
      <image href="${logoB64}" x="0" y="0" width="56" height="56" />
      <text x="70" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="22" font-weight="900" letter-spacing="0.05em" fill="#ffffff">PRIME BUILDS LONDON</text>
      <text x="70" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="0.18em" fill="#dc2626">FIXED-PRICE RESIDENTIAL CONTRACTS</text>
    </g>

    <!-- Top Right Verified Trust Pill -->
    <g transform="translate(860, 50)">
      <rect x="0" y="4" width="280" height="42" rx="6" fill="#18181b" stroke="rgba(255,255,255,0.2)" stroke-width="1.2" />
      <circle cx="24" cy="25" r="5" fill="#22c55e" />
      <text x="38" y="30" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="800" letter-spacing="0.12em" fill="#ffffff">JCT CONTRACT · 10YR WARRANTY</text>
    </g>

    <!-- Bottom Left Architectural Headline -->
    <g transform="translate(60, 440)">
      <!-- Micro-kicker -->
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="0.22em" fill="#f87171">PRIME RESIDENTIAL BUILDERS</text>
      
      <!-- Headline -->
      <text x="0" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="44" font-weight="800" letter-spacing="-0.03em" fill="#ffffff">Modern Home Extensions &amp; Renovations</text>
      
      <!-- Subtitle -->
      <text x="0" y="86" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="500" fill="rgba(255, 255, 255, 0.88)">Fixed-Price Schedule of Works · Dedicated Site Foreman · London &amp; Suburbs</text>

      <!-- URL footer -->
      <text x="0" y="126" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="0.08em" fill="#ffffff">primebuilds.playstax.xyz</text>
    </g>

    <!-- Bottom Right Rating Badge -->
    <g transform="translate(930, 490)">
      <rect x="0" y="0" width="210" height="74" rx="8" fill="rgba(0, 0, 0, 0.55)" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.2" />
      <text x="24" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="22" font-weight="900" fill="#ffffff">4.9 / 5.0</text>
      <text x="24" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="600" fill="rgba(255, 255, 255, 0.8)">140+ London Projects</text>
    </g>
  </svg>
  `;

  // Combine hero photo with SVG overlay and write public/og-image.jpg
  await sharp(heroResized)
    .composite([
      { input: Buffer.from(overlaySvg), top: 0, left: 0 }
    ])
    .jpeg({ quality: 88, progressive: true })
    .toFile('public/og-image.jpg');

  console.log('Created public/og-image.jpg (1200x630)');

  // Also create app/opengraph-image.jpg for Next.js automatic OG routing
  fs.copyFileSync('public/og-image.jpg', 'app/opengraph-image.jpg');
  console.log('Created app/opengraph-image.jpg');

  const ogStat = fs.statSync('public/og-image.jpg');
  console.log('OG Image file size:', ogStat.size, 'bytes (perfect for WhatsApp & Telegram < 300KB)');
}

main().catch(console.error);
