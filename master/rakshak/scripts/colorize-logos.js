const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'public', 'assets', 'tech');

const brandColors = {
  'openai.svg': '#10a37f',
  'anthropic.svg': '#d97757',
  'googledocs.svg': '#4285f4',
  'github.svg': '#ffffff',
  'x.svg': '#ffffff',
  'discord.svg': '#5865f2',
  'wireguard.svg': '#88171a',
  'wireshark.svg': '#1679a7',
  'cloudflare.svg': '#f38020',
  'virustotal.svg': '#3949ab',
  'bitwarden.svg': '#175ddc',
  'linuxfoundation.svg': '#00adef',
  'securityscorecard.svg': '#00b4d8'
};

for (const [file, color] of Object.entries(brandColors)) {
  const p = path.join(dir, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    if (!content.includes('fill=')) {
      content = content.replace('<svg ', `<svg fill="${color}" `);
      fs.writeFileSync(p, content, 'utf-8');
      console.log('Added fill to:', file);
    }
  }
}
console.log('Brand colors successfully applied!');
