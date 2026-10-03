const fs = require('fs');
const path = require('path');
const https = require('https');

function download(url, filename) {
  return new Promise((resolve) => {
    const dest = path.join(__dirname, 'public', 'images', 'accreditations', filename);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, filename).then(resolve);
      }
      if (res.statusCode === 200) {
        const stream = fs.createWriteStream(dest);
        res.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          console.log('Saved', filename);
          resolve(true);
        });
      } else {
        console.log('Failed', filename, res.statusCode);
        resolve(false);
      }
    }).on('error', (e) => {
      console.log('Error', filename, e.message);
      resolve(false);
    });
  });
}

async function run() {
  const dir = path.join(__dirname, 'public', 'images', 'accreditations');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Constructionline
  await download('https://b3851822.assetcdn.net/3851822/wp-content/themes/constructionline-v2/assets/img/CONSTRUCTIONLINE-LOGO-n.png', 'constructionline.png');

  // Let's check CHAS and FMB and others
  // We can fetch CHAS homepage to get exact logo URL
  https.get('https://www.chas.co.uk', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let html = '';
    res.on('data', d => html += d);
    res.on('end', async () => {
      const chasLogos = html.match(/https?:\/\/[^"'\s>]+\.(?:svg|png)/gi) || [];
      const match = chasLogos.find(u => /chas.*logo/i.test(u) || /logo.*chas/i.test(u) || (u.includes('logo') && !u.includes('veriforce')));
      console.log('CHAS potential logo:', match || chasLogos.slice(0, 5));
      if (match) await download(match, 'chas.svg');
    });
  });

  // FMB
  await download('https://www.fmb.org.uk/static/86b46ef0-ec38-4444-a9a3f2b8fc5ae2a4/fmb-logo.svg', 'fmb.svg').catch(() => {});
}

run();
