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
  const targetPages = [
    'https://www.plusrooms.co.uk/case-studies/',
    'https://www.plusrooms.co.uk/kitchen-extensions-london/',
    'https://www.plusrooms.co.uk/loft-conversions-london/',
    'https://www.simplyextend.co.uk/case-studies/',
    'https://www.simplyloft.co.uk/case-studies/'
  ];

  const foundImages = new Set();

  for (const pageUrl of targetPages) {
    try {
      console.log('Scraping', pageUrl);
      const html = await fetchUrl(pageUrl);
      const regex = /https?:\/\/[^"'\s\)]+\.(?:jpg|jpeg|png|webp)/gi;
      const matches = html.match(regex) || [];
      for (const m of matches) {
        if (!m.includes('logo') && !m.includes('icon') && !m.includes('avatar') && !m.includes('150x150') && !m.includes('gravatar')) {
          foundImages.add(m);
        }
      }
      console.log(`Current unique found images: ${foundImages.size}`);
    } catch (e) {
      console.log('Error on', pageUrl, e.message);
    }
  }

  const outDir = path.join(__dirname, 'public', 'images', 'residential');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Found ${foundImages.size} potential images`);
  let count = 0;
  for (const imgUrl of foundImages) {
    if (count >= 15) break;
    const ext = path.extname(imgUrl.split('?')[0]) || '.jpg';
    const filename = `real_london_${count + 1}${ext}`;
    const dest = path.join(outDir, filename);

    try {
      console.log(`Downloading (${count + 1}) ${imgUrl} -> ${filename}`);
      await downloadFile(imgUrl, dest);
      const stat = fs.statSync(dest);
      if (stat.size > 20000) { // filter out tiny icons
        console.log(`  Saved ${filename} (${Math.round(stat.size / 1024)} KB)`);
        count++;
      } else {
        fs.unlinkSync(dest);
        console.log(`  Skipped small file (${stat.size} bytes)`);
      }
    } catch (err) {
      console.log(`  Failed: ${err.message}`);
    }
  }

  console.log(`Done! Downloaded ${count} distinct residential images.`);
}

main();
