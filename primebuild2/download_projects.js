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
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Let's crawl Size Group projects page
  const html = await fetchHtml('https://www.size-group.co.uk/projects');
  
  // Find high-res image URLs (prefer -p-1600.jpg, -p-2000.jpg, or original)
  const matches = html.match(/https:\/\/cdn\.prod\.website-files\.com\/[^\s"'>]+\.(?:jpg|jpeg|png|webp)/gi) || [];
  
  // Filter for large project images (1600 or 2000 or clean resized)
  const highRes = matches.filter(url => 
    !url.includes('Favicon') && 
    !url.includes('Web%20Clip') && 
    (url.includes('-p-1600') || url.includes('-p-1080') || (!url.includes('-p-') && url.includes('resized')))
  );

  const unique = [...new Set(highRes)];
  console.log(`Found ${unique.length} high-res project images`);

  let count = 0;
  for (let i = 0; i < Math.min(unique.length, 12); i++) {
    const imgUrl = unique[i];
    const ext = path.extname(imgUrl.split('?')[0]) || '.jpg';
    const filename = `project_${i + 1}${ext}`;
    const dest = path.join(targetDir, filename);
    console.log(`Downloading ${imgUrl} -> ${filename}`);
    try {
      await downloadFile(imgUrl, dest);
      console.log(`Saved ${filename}`);
      count++;
    } catch (e) {
      console.error(`Failed ${imgUrl}:`, e.message);
    }
  }

  console.log(`Downloaded ${count} project images successfully!`);
}

run();
