const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

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
    'https://www.walterlilly.co.uk/projects/',
    'https://www.size-group.co.uk/projects'
  ];

  for (const site of sites) {
    try {
      console.log('Fetching', site);
      const html = await fetchHtml(site);
      const imgRegex = /https?:\/\/[^"'\s)]+\.(?:jpg|jpeg|png|webp)/gi;
      const matches = [...new Set(html.match(imgRegex) || [])];
      console.log(`Found ${matches.length} image URLs on ${site}`);
      matches.slice(0, 15).forEach(m => console.log(' - ', m));
    } catch (e) {
      console.error('Error fetching', site, e.message);
    }
  }
}

run();
