const fs = require('fs');
const path = require('path');
const https = require('https');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const targetDir = path.join(__dirname, 'public', 'images', 'projects');

  // Let's crawl Walter Lilly
  try {
    const html = await fetchHtml('https://www.walterlilly.co.uk/projects/');
    const matches = html.match(/https:\/\/www\.walterlilly\.co\.uk\/wp-content\/uploads\/[^\s"'>]+\.(?:jpg|jpeg|png|webp)/gi) || [];
    
    // Filter for large images (1536x or 2048x or 1110x)
    const highRes = matches.filter(url => 
      !url.includes('favicon') && 
      (url.includes('1536x') || url.includes('2048x') || url.includes('1110x'))
    );

    const unique = [...new Set(highRes)];
    console.log(`Found ${unique.length} Walter Lilly high-res images`);

    for (let i = 0; i < Math.min(unique.length, 8); i++) {
      const imgUrl = unique[i];
      const ext = path.extname(imgUrl.split('?')[0]) || '.jpg';
      const filename = `london_residence_${i + 1}${ext}`;
      const dest = path.join(targetDir, filename);
      console.log(`Downloading ${imgUrl} -> ${filename}`);
      try {
        await downloadFile(imgUrl, dest);
        console.log(`Saved ${filename}`);
      } catch (e) {
        console.error(`Failed ${imgUrl}:`, e.message);
      }
    }
  } catch (err) {
    console.error('Walter Lilly crawl error:', err.message);
  }
}

run();
