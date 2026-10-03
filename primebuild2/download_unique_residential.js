const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('Timeout'));
    });
  });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadFile(res.headers.location, dest));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
      file.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('Timeout'));
    });
  });
}

async function main() {
  const sources = [
    'https://www.simplyextend.co.uk/case-studies/',
    'https://www.simplyloft.co.uk/case-studies/'
  ];

  const allUrls = [];
  for (const s of sources) {
    try {
      console.log('Fetching source:', s);
      const html = await fetchUrl(s);
      const matches = html.match(/https?:\/\/[^"'\s\)]+\.(?:jpg|jpeg|png|webp)/gi) || [];
      allUrls.push(...matches);
    } catch (e) {
      console.error(e.message);
    }
  }

  // Deduplicate by base name
  // E.g. /BNB05539-600x400.jpg -> base 'BNB05539'
  const groups = new Map();

  for (const u of allUrls) {
    if (u.includes('logo') || u.includes('icon') || u.includes('avatar') || u.includes('badge') || u.includes('gravatar') || u.includes('arrow')) continue;
    const filename = path.basename(u.split('?')[0]);
    // Strip dimension like -600x400 or -scaled
    const base = filename.replace(/-\d+x\d+/i, '').replace(/-scaled/i, '').replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
    if (!groups.has(base)) {
      groups.set(base, []);
    }
    groups.get(base).push(u);
  }

  console.log(`Found ${groups.size} completely UNIQUE base projects!`);

  const outDir = path.join(__dirname, 'public', 'images', 'projects_unique');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  let index = 1;
  for (const [base, urls] of groups.entries()) {
    if (index > 14) break;

    // Pick best quality (preferably -1024x... or -1536x... or original)
    let bestUrl = urls.find(u => u.includes('1024x') || u.includes('1536x')) || urls.find(u => !u.includes('300x') && !u.includes('150x') && !u.includes('250x')) || urls[0];

    const ext = path.extname(bestUrl.split('?')[0]) || '.jpg';
    const destName = `proj_${index}${ext}`;
    const destPath = path.join(outDir, destName);

    try {
      console.log(`Downloading unique project [${index}]: ${base} from ${bestUrl}`);
      await downloadFile(bestUrl, destPath);
      const stat = fs.statSync(destPath);
      if (stat.size > 25000) {
        console.log(` -> Saved ${destName} (${Math.round(stat.size / 1024)} KB)`);
        index++;
      } else {
        fs.unlinkSync(destPath);
        console.log(` -> Skipped (too small: ${stat.size} B)`);
      }
    } catch (e) {
      console.log(` -> Failed: ${e.message}`);
    }
  }

  console.log(`Successfully downloaded ${index - 1} totally unique residential project photos!`);
}

main();
