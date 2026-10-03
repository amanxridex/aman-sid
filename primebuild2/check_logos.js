const https = require('https');

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
  const sites = [
    'https://www.size-group.co.uk',
    'https://www.walterlilly.co.uk',
    'https://www.knowles.uk.com'
  ];

  for (const s of sites) {
    try {
      console.log('--- checking', s, '---');
      const html = await fetchHtml(s);
      const matches = html.match(/https?:\/\/[^"'\s>]+\.(?:png|svg|jpg)/gi) || [];
      const logos = matches.filter(u => /logo|cert|riba|ciob|chas|accred|partner|award/i.test(u));
      console.log('Found potential logos:', [...new Set(logos)]);
    } catch (e) {
      console.log('Error', s, e.message);
    }
  }
}

run();
