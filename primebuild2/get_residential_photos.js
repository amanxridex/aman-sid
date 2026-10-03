const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public', 'images', 'residential');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

try {
  console.log('Fetching plusrooms page...');
  const html = execSync('curl -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "https://plusrooms.co.uk/kitchen-extensions/"', { maxBuffer: 10 * 1024 * 1024 }).toString();
  
  const regex = /https:\/\/plusrooms\.co\.uk\/wp-content\/uploads\/[^\s"'>)]+\.(?:jpg|jpeg|png|webp)/gi;
  const matches = [...new Set(html.match(regex) || [])];
  
  // Filter for medium/large resolution photos (skip icons, logos, small thumbs)
  const photos = matches.filter(u => 
    !u.includes('logo') && 
    !u.includes('icon') && 
    (u.includes('-scaled') || u.includes('-1024x') || u.includes('-768x') || u.includes('-1536x') || !u.includes('-150x'))
  );

  console.log(`Found ${photos.length} real residential photos!`);
  
  photos.slice(0, 10).forEach((imgUrl, i) => {
    const ext = path.extname(imgUrl.split('?')[0]) || '.jpg';
    const filename = `res_${i + 1}${ext}`;
    const dest = path.join(targetDir, filename);
    console.log(`Downloading ${filename} from ${imgUrl}`);
    try {
      execSync(`curl -s -L -A "Mozilla/5.0" "${imgUrl}" -o "${dest}"`);
      console.log(`Saved ${filename}`);
    } catch (e) {
      console.error('Failed', filename);
    }
  });

} catch (err) {
  console.error('Error:', err.message);
}
