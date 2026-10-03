const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public', 'images', 'residential');

const urls = [
  'https://plusrooms.co.uk/recent-projects/',
  'https://plusrooms.co.uk/loft-conversions/',
  'https://plusrooms.co.uk/side-return-extensions/'
];

for (const url of urls) {
  try {
    console.log('Fetching', url);
    const html = execSync(`curl -s -L -A "Mozilla/5.0" "${url}"`, { maxBuffer: 10 * 1024 * 1024 }).toString();
    const regex = /https:\/\/plusrooms\.co\.uk\/wp-content\/uploads\/[^\s"'>)]+\.(?:jpg|jpeg|png|webp)/gi;
    const matches = [...new Set(html.match(regex) || [])];
    const filtered = matches.filter(u => 
      !u.includes('logo') && 
      !u.includes('placeholder') && 
      !u.includes('icon') && 
      (u.includes('scaled') || u.includes('1024x') || u.includes('1536x'))
    );
    console.log(`Found ${filtered.length} images on ${url}`);
    filtered.slice(0, 4).forEach((imgUrl, i) => {
      const name = `project_res_${Date.now()}_${i}.jpg`;
      const dest = path.join(targetDir, name);
      try {
        execSync(`curl -s -L -A "Mozilla/5.0" "${imgUrl}" -o "${dest}"`);
        console.log('Downloaded', name);
      } catch (e) {}
    });
  } catch (e) {
    console.log('Error', url);
  }
}
