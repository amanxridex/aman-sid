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

async function checkSite(name, url, pattern) {
  try {
    const html = await fetchHtml(url);
    const matches = html.match(pattern) || [];
    console.log(`${name}: found`, [...new Set(matches)]);
    return matches[0];
  } catch (e) {
    console.error(`Error ${name}:`, e.message);
  }
}

async function run() {
  await checkSite('RIBA', 'https://www.architecture.com', /https?:\/\/[^"'\s>]+\.(?:svg|png)/gi);
  await checkSite('CIOB', 'https://www.ciob.org', /https?:\/\/[^"'\s>]+\.(?:svg|png)/gi);
  await checkSite('CHAS', 'https://www.chas.co.uk', /https?:\/\/[^"'\s>]+\.(?:svg|png)/gi);
  await checkSite('FMB', 'https://www.fmb.org.uk', /https?:\/\/[^"'\s>]+\.(?:svg|png)/gi);
  await checkSite('Constructionline', 'https://www.constructionline.co.uk', /https?:\/\/[^"'\s>]+\.(?:svg|png)/gi);
}

run();
