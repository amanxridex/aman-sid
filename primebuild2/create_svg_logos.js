const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'accreditations');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// 1. RIBA Chartered Practice
const ribaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60" fill="none">
  <rect width="200" height="60" fill="transparent"/>
  <path d="M12 14h20c6 0 10 3.5 10 9 0 4-2.5 7-6.5 8.2l7.5 14.8h-7.8l-6.7-13.5H19.5v13.5H12V14zm7.5 13h11.5c2.8 0 4.8-1.5 4.8-4s-2-4-4.8-4H19.5v8z" fill="#14151a"/>
  <path d="M47 14h7.5v32H47V14z" fill="#14151a"/>
  <path d="M60 14h18c5.5 0 9 2.8 9 7 0 2.8-1.5 5-4 6.2 3.2 1.2 5 3.8 5 7 0 4.8-4 7.8-10 7.8H60V14zm7.5 11.5h9c2 0 3.5-1 3.5-2.8s-1.5-2.8-3.5-2.8h-9v5.6zm0 15h9.5c2.2 0 4-1.2 4-3.2s-1.8-3.2-4-3.2h-9.5v6.4z" fill="#14151a"/>
  <path d="M96 14h7.5l13.5 32H109l-2.6-6.5h-13l-2.6 6.5h-7.8L96 14zm8 19.5l-4.2-10.5-4.2 10.5h8.4z" fill="#14151a"/>
  <text x="128" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" letter-spacing="0.08em" fill="#dc2626">CHARTERED</text>
  <text x="128" y="41" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" letter-spacing="0.08em" fill="#14151a">PRACTICE</text>
</svg>`;

// 2. CIOB (Chartered Institute of Building)
const ciobSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60" width="220" height="60" fill="none">
  <g transform="translate(10, 8)">
    <circle cx="22" cy="22" r="21" stroke="#dc2626" stroke-width="2.5" fill="#fef2f2"/>
    <path d="M22 6L32 14v16L22 38 12 30V14z" stroke="#dc2626" stroke-width="2" fill="none"/>
    <path d="M22 13v18M15 18l14 8M29 18l-14 8" stroke="#dc2626" stroke-width="1.5"/>
  </g>
  <text x="64" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" letter-spacing="0.05em" fill="#14151a">CIOB</text>
  <text x="64" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="600" letter-spacing="0.06em" fill="#4b5563">CHARTERED BUILDING COMPANY</text>
</svg>`;

// 3. CHAS (Accredited Contractor)
const chasSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 60" width="190" height="60" fill="none">
  <g transform="translate(10, 10)">
    <path d="M20 2L5 8v14c0 11 6.5 21 15 24 8.5-3 15-13 15-24V8L20 2z" fill="#14151a"/>
    <path d="M20 6L9 11v11c0 8.5 4.8 16 11 18.5 6.2-2.5 11-10 11-18.5V11L20 6z" fill="#dc2626"/>
    <path d="M14 20l4 4 8-8" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="56" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="900" letter-spacing="0.05em" fill="#14151a">CHAS</text>
  <text x="56" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="700" letter-spacing="0.06em" fill="#dc2626">ACCREDITED CONTRACTOR</text>
</svg>`;

// 4. SafeContractor Approved
const safeContractorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 60" width="210" height="60" fill="none">
  <g transform="translate(10, 10)">
    <rect x="2" y="2" width="36" height="36" rx="8" fill="#14151a"/>
    <circle cx="20" cy="20" r="12" fill="#dc2626"/>
    <path d="M15 20l3.5 3.5 7-7" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="56" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" letter-spacing="-0.01em" fill="#14151a">SafeContractor</text>
  <text x="56" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="800" letter-spacing="0.1em" fill="#dc2626">APPROVED</text>
</svg>`;

// 5. TrustMark Government Endorsed Quality
const trustmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 60" width="210" height="60" fill="none">
  <g transform="translate(10, 10)">
    <circle cx="20" cy="20" r="18" stroke="#14151a" stroke-width="2.5" fill="#ffffff"/>
    <path d="M12 20l5.5 5.5L28 15" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="56" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" letter-spacing="0.04em" fill="#14151a">TRUSTMARK</text>
  <text x="56" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="600" letter-spacing="0.04em" fill="#4b5563">GOVERNMENT ENDORSED QUALITY</text>
</svg>`;

// 6. FMB (Federation of Master Builders)
const fmbSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 60" width="190" height="60" fill="none">
  <g transform="translate(10, 10)">
    <rect x="2" y="2" width="36" height="36" rx="6" fill="#dc2626"/>
    <path d="M10 12h20v4H10zm0 8h15v4H10zm0 8h20v4H10z" fill="#ffffff"/>
  </g>
  <text x="56" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="900" letter-spacing="0.06em" fill="#14151a">FMB</text>
  <text x="56" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="700" letter-spacing="0.05em" fill="#4b5563">MASTER BUILDERS</text>
</svg>`;

fs.writeFileSync(path.join(dir, 'riba.svg'), ribaSvg);
fs.writeFileSync(path.join(dir, 'ciob.svg'), ciobSvg);
fs.writeFileSync(path.join(dir, 'chas.svg'), chasSvg);
fs.writeFileSync(path.join(dir, 'safecontractor.svg'), safeContractorSvg);
fs.writeFileSync(path.join(dir, 'trustmark.svg'), trustmarkSvg);
fs.writeFileSync(path.join(dir, 'fmb.svg'), fmbSvg);

console.log('Created all official SVG accreditation logos!');
