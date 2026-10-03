const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'assets', 'tech');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const assets = [
  // OS & Platforms (Real Brand Logos)
  { name: 'windows.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg' },
  { name: 'apple.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'apple-white.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg' },
  { name: 'linux.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
  { name: 'kernel.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
  { name: 'ubuntu.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg' },

  // AI & Models (Real Brand Logos)
  { name: 'openai.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
  { name: 'anthropic.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg' },
  { name: 'claude.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
  { name: 'copilot.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Microsoft_365_Copilot_Icon.svg' },

  // Dev & Languages (Real Software Logos)
  { name: 'python.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'rust.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg' },
  { name: 'vscode.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  { name: 'git.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'docker.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'bash.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg' },
  { name: 'cplusplus.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },

  // Documents & Folders (Real software icons)
  { name: 'doc.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg' },
  { name: 'word.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg' },

  // Security & Networking (Real logos)
  { name: 'wireguard.svg', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/wireguard.svg' },
  { name: 'wireshark.svg', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/wireshark.svg' },
  { name: 'cloudflare.svg', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cloudflare.svg' },
  { name: 'virustotal.svg', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/virustotal.svg' },
  { name: 'github.svg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' }
];

function download(item) {
  return new Promise((resolve) => {
    const fetchUrl = (url, depth = 0) => {
      if (depth > 5) {
        console.error(`Too many redirects for ${item.name}`);
        return resolve(false);
      }
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let nextUrl = res.headers.location;
          if (nextUrl.startsWith('/')) {
            const parsed = new URL(url);
            nextUrl = parsed.origin + nextUrl;
          }
          return fetchUrl(nextUrl, depth + 1);
        }
        if (res.statusCode !== 200) {
          console.error(`Failed ${item.name}: HTTP ${res.statusCode} from ${url}`);
          return resolve(false);
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const dest = path.join(targetDir, item.name);
          fs.writeFileSync(dest, data, 'utf-8');
          console.log(`Successfully saved: ${item.name} (${data.length} bytes)`);
          resolve(true);
        });
      });
      req.on('error', (err) => {
        console.error(`Error on ${item.name}:`, err.message);
        resolve(false);
      });
    };

    fetchUrl(item.url);
  });
}

async function run() {
  for (const item of assets) {
    await download(item);
  }
  console.log('All real logos processed!');
}

run();
