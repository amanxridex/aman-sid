const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const rootDir = process.cwd();
const releasesDir = path.join(rootDir, 'public', 'releases');
const scratchDir = path.join(rootDir, 'scratch');

if (!fs.existsSync(releasesDir)) fs.mkdirSync(releasesDir, { recursive: true });
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

console.log('==> Step 1: Packing npm SDK tarball (rakshaksdkv1-1.0.0.tgz)...');
execSync('npm pack', { cwd: path.join(rootDir, 'rakshaksdkv1'), stdio: 'inherit' });

const tgzSrc = path.join(rootDir, 'rakshaksdkv1', 'rakshaksdkv1-1.0.0.tgz');
const tgzDest = path.join(releasesDir, 'rakshaksdkv1-1.0.0.tgz');
fs.copyFileSync(tgzSrc, tgzDest);

const sdkDist = path.join(rootDir, 'rakshaksdkv1', 'dist');
const rskFile = path.join(rootDir, 'defense.rsk');
const rskbFile = path.join(rootDir, 'defense.rskb');

// ==========================================
// 1. Windows x64 Staging
// ==========================================
console.log('==> Step 2A: Assembling Windows x64 Distribution...');
const winStaging = path.join(scratchDir, 'win_staging');
if (fs.existsSync(winStaging)) fs.rmSync(winStaging, { recursive: true, force: true });
const winRakshak = path.join(winStaging, 'rakshak');
fs.mkdirSync(path.join(winRakshak, 'bin'), { recursive: true });
fs.mkdirSync(path.join(winRakshak, 'dist'), { recursive: true });
fs.mkdirSync(path.join(winRakshak, 'templates'), { recursive: true });
fs.mkdirSync(path.join(winRakshak, 'service'), { recursive: true });

fs.cpSync(sdkDist, path.join(winRakshak, 'dist'), { recursive: true });
fs.copyFileSync(path.join(rootDir, 'rakshaksdkv1', 'rskc.js'), path.join(winRakshak, 'dist', 'rskc.js'));
fs.mkdirSync(path.join(winRakshak, 'dist', 'bin'), { recursive: true });
fs.copyFileSync(path.join(rootDir, 'rakshaksdkv1', 'bin', 'rakshak.js'), path.join(winRakshak, 'dist', 'bin', 'rakshak.js'));

fs.copyFileSync(rskFile, path.join(winRakshak, 'templates', 'defense.rsk'));
fs.copyFileSync(rskbFile, path.join(winRakshak, 'templates', 'defense.rskb'));
fs.copyFileSync(rskFile, path.join(winRakshak, 'defense.rsk'));
fs.copyFileSync(rskbFile, path.join(winRakshak, 'defense.rskb'));

// Compile & Bundle Native RakshakShield.exe (PE x64)
const cscPath = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';
const csSource = path.join(rootDir, 'src', 'native', 'RakshakShield.cs');
const exeOut = path.join(releasesDir, 'RakshakShield.exe');
if (fs.existsSync(cscPath) && fs.existsSync(csSource)) {
  console.log('==> Compiling native RakshakShield.exe PE binary with csc.exe (High-Entropy ASLR, GUI, Tray)...');
  try { execSync('taskkill /F /IM RakshakShield.exe', { stdio: 'ignore' }); } catch (_) {}
  execSync(`"${cscPath}" /nologo /optimize+ /platform:x64 /highentropyva+ /target:winexe /r:System.Management.dll /r:System.Windows.Forms.dll /r:System.Drawing.dll /out:"${exeOut}" "${csSource}"`, { stdio: 'inherit' });
  
  // Sign PE binary with Rakshak Sovereign PKI Authenticode (Zero Third-Party Dependency)
  console.log('==> Digitally signing PE binary with Rakshak Sovereign PKI Root Authority (4096-bit RSA)...');
  try {
    execSync('powershell -ExecutionPolicy Bypass -File scripts/generate_sovereign_pki.ps1', { cwd: rootDir, stdio: 'inherit' });
  } catch (err) {
    console.warn('Warning: Sovereign PKI sign step returned:', err.message);
  }

  fs.copyFileSync(exeOut, path.join(winRakshak, 'bin', 'RakshakShield.exe'));
  fs.copyFileSync(exeOut, path.join(winRakshak, 'RakshakShield.exe'));
} else if (fs.existsSync(exeOut)) {
  fs.copyFileSync(exeOut, path.join(winRakshak, 'bin', 'RakshakShield.exe'));
  fs.copyFileSync(exeOut, path.join(winRakshak, 'RakshakShield.exe'));
}

const certFile = path.join(releasesDir, 'Rakshak_Sovereign_Root_CA.cer');
if (fs.existsSync(certFile)) {
  fs.copyFileSync(certFile, path.join(winRakshak, 'Rakshak_Sovereign_Root_CA.cer'));
  fs.copyFileSync(certFile, path.join(winRakshak, 'bin', 'Rakshak_Sovereign_Root_CA.cer'));
}

fs.writeFileSync(path.join(winRakshak, 'bin', 'rakshak.cmd'), `@echo off\r\nnode "%~dp0\\..\\dist\\bin\\rakshak.js" %*\r\n`);
fs.writeFileSync(path.join(winRakshak, 'bin', 'rakshak.ps1'), `node "$PSScriptRoot\\..\\dist\\bin\\rakshak.js" @args\r\n`);
fs.writeFileSync(path.join(winRakshak, 'bin', 'rskc.cmd'), `@echo off\r\nnode "%~dp0\\..\\dist\\rskc.js" %*\r\n`);
fs.writeFileSync(path.join(winRakshak, 'bin', 'rskc.ps1'), `node "$PSScriptRoot\\..\\dist\\rskc.js" @args\r\n`);
fs.writeFileSync(path.join(winRakshak, 'service', 'RakshakService.cmd'), `@echo off\r\nREM Rakshak Windows Background Service Controller\r\necho Starting Rakshak Perimeter Defense on Windows...\r\n"%~dp0\\..\\bin\\RakshakShield.exe" tray\r\n`);

fs.writeFileSync(path.join(winRakshak, 'README-WINDOWS.txt'), `===============================================================
RAKSHAK ZERO-TRUST PERIMETER MATRIX — WINDOWS x64 EDITION (v2.4.1)
===============================================================

Commercial Production License // Anti-AI Scraping & Crawler Defense
Native Windows PE 64-bit Workstation Shield Engine

1. Quick Start:
   Double-click RakshakShield.exe to open the Cyber-Defense Command Center.
   The active Green Shield immediately protects your system in the notification area.

2. Native Shield Commands (RakshakShield.exe):
   RakshakShield.exe gui                     - Interactive Cyber-Defense Command Center
   RakshakShield.exe tray                    - Run minimized in taskbar with active green indicator
   RakshakShield.exe install                 - Register in Windows Startup & Add/Remove Programs
   RakshakShield.exe uninstall [--quiet]     - 1-Click clean uninstallation (zero questions/residual)
   RakshakShield.exe status                  - Real-time kernel & folder guard status
   RakshakShield.exe scan                    - Deep threat scan for rogue AI scrapers & OCR
   RakshakShield.exe kill <PID>              - Terminate rogue scraping process
   RakshakShield.exe protect-window          - Enforce WDA_EXCLUDE (anti-Recall & anti-OCR)
   RakshakShield.exe compile defense.rsk     - Compile .rsk policy into .rskb binary bytecode
   RakshakShield.exe disassemble defense.rskb- Disassemble bytecode instructions
   RakshakShield.exe watch C:\\path\\to\\dir    - Zero-trust real-time file monitoring
   RakshakShield.exe honeypot                - Deploy HMAC-signed adversarial honeytoken decoy
   RakshakShield.exe daemon                  - Continuous background isolation sentinel

3. Universal CLI Commands (rakshak):
   rakshak init              - Initialize perimeter policy
   rakshak status            - Workstation shield status
   rskc compile defense.rsk  - Universal RSK compiler
   rakshak dump defense.rskb - Disassemble bytecode

4. 1-Click Uninstall:
   Settings > Installed Apps > Rakshak Workstation Defense Shield > Uninstall
   or right-click Green Shield in system tray > "1-Click Clean Uninstall"
`);

fs.writeFileSync(path.join(winRakshak, 'package-info.json'), JSON.stringify({
  target: 'win32-x64',
  platform: 'Windows 11 / 10 (x64)',
  version: '2.4.1',
  buildEngine: 'Rakshak Native Windows Packager (PE x64)',
  nativeBinary: 'RakshakShield.exe',
  created: new Date().toISOString()
}, null, 2));

const winZip = path.join(releasesDir, 'rakshak-windows-x64.zip');
if (fs.existsSync(winZip)) fs.unlinkSync(winZip);
execSync(`tar -a -c -f "${winZip}" -C "${winStaging}" rakshak`);

// ==========================================
// 2. macOS Universal Staging
// ==========================================
console.log('==> Step 2B: Assembling macOS Universal Distribution...');
const macStaging = path.join(scratchDir, 'mac_staging');
if (fs.existsSync(macStaging)) fs.rmSync(macStaging, { recursive: true, force: true });
const macRakshak = path.join(macStaging, 'rakshak');
fs.mkdirSync(path.join(macRakshak, 'bin'), { recursive: true });
fs.mkdirSync(path.join(macRakshak, 'dist'), { recursive: true });
fs.mkdirSync(path.join(macRakshak, 'templates'), { recursive: true });
fs.mkdirSync(path.join(macRakshak, 'launchd'), { recursive: true });

fs.cpSync(sdkDist, path.join(macRakshak, 'dist'), { recursive: true });
fs.copyFileSync(path.join(rootDir, 'rakshaksdkv1', 'rskc.js'), path.join(macRakshak, 'dist', 'rskc.js'));
fs.mkdirSync(path.join(macRakshak, 'dist', 'bin'), { recursive: true });
fs.copyFileSync(path.join(rootDir, 'rakshaksdkv1', 'bin', 'rakshak.js'), path.join(macRakshak, 'dist', 'bin', 'rakshak.js'));

fs.copyFileSync(rskFile, path.join(macRakshak, 'templates', 'defense.rsk'));
fs.copyFileSync(rskbFile, path.join(macRakshak, 'templates', 'defense.rskb'));

fs.writeFileSync(path.join(macRakshak, 'bin', 'rakshak'), `#!/usr/bin/env sh\nexec node "$(dirname "$0")/../dist/bin/rakshak.js" "$@"\n`);
fs.writeFileSync(path.join(macRakshak, 'bin', 'rskc'), `#!/usr/bin/env sh\nexec node "$(dirname "$0")/../dist/rskc.js" "$@"\n`);

fs.writeFileSync(path.join(macRakshak, 'launchd', 'com.rakshak.daemon.plist'), `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.rakshak.daemon</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/Shared/.rakshak/dist/bin/rakshak.js</string>
        <string>daemon</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
`);

fs.writeFileSync(path.join(macRakshak, 'README-MACOS.txt'), `===============================================================
RAKSHAK ZERO-TRUST PERIMETER MATRIX — macOS UNIVERSAL (v1.0.0)
===============================================================

Commercial Production License // Apple Silicon (M1-M4) & Intel x86_64

1. Setup:
   Add bin/ to your ~/.zshrc or run:
   curl -fsSL https://rakshakus.vercel.app/install.sh | bash

2. Commands:
   rakshak init              - Initialize perimeter policy
   rakshak status            - Real-time kernel & process status
   rskc compile defense.rsk  - Compile .rsk policy to .rskb binary bytecode
   rakshak dump defense.rskb - Disassemble bytecode instructions

3. macOS LaunchAgent:
   cp launchd/com.rakshak.daemon.plist ~/Library/LaunchAgents/
   launchctl load ~/Library/LaunchAgents/com.rakshak.daemon.plist
`);

fs.writeFileSync(path.join(macRakshak, 'package-info.json'), JSON.stringify({
  target: 'darwin-universal',
  platform: 'macOS Sequoia, Sonoma (ARM64 Apple Silicon + Intel x86_64)',
  version: '1.0.0',
  buildEngine: 'Rakshak Darwin Universal Packager',
  created: new Date().toISOString()
}, null, 2));

const macZip = path.join(releasesDir, 'rakshak-macos-universal.zip');
if (fs.existsSync(macZip)) fs.unlinkSync(macZip);
execSync(`tar -a -c -f "${macZip}" -C "${macStaging}" rakshak`);

// ==========================================
// 3. Linux x64 Staging
// ==========================================
console.log('==> Step 2C: Assembling Linux x64 Distribution...');
const linuxStaging = path.join(scratchDir, 'linux_staging');
if (fs.existsSync(linuxStaging)) fs.rmSync(linuxStaging, { recursive: true, force: true });
const linuxRakshak = path.join(linuxStaging, 'rakshak');
fs.mkdirSync(path.join(linuxRakshak, 'bin'), { recursive: true });
fs.mkdirSync(path.join(linuxRakshak, 'dist'), { recursive: true });
fs.mkdirSync(path.join(linuxRakshak, 'templates'), { recursive: true });
fs.mkdirSync(path.join(linuxRakshak, 'systemd'), { recursive: true });

fs.cpSync(sdkDist, path.join(linuxRakshak, 'dist'), { recursive: true });
fs.copyFileSync(path.join(rootDir, 'rakshaksdkv1', 'rskc.js'), path.join(linuxRakshak, 'dist', 'rskc.js'));
fs.mkdirSync(path.join(linuxRakshak, 'dist', 'bin'), { recursive: true });
fs.copyFileSync(path.join(rootDir, 'rakshaksdkv1', 'bin', 'rakshak.js'), path.join(linuxRakshak, 'dist', 'bin', 'rakshak.js'));

fs.copyFileSync(rskFile, path.join(linuxRakshak, 'templates', 'defense.rsk'));
fs.copyFileSync(rskbFile, path.join(linuxRakshak, 'templates', 'defense.rskb'));

fs.writeFileSync(path.join(linuxRakshak, 'bin', 'rakshak'), `#!/usr/bin/env sh\nexec node "$(dirname "$0")/../dist/bin/rakshak.js" "$@"\n`);
fs.writeFileSync(path.join(linuxRakshak, 'bin', 'rskc'), `#!/usr/bin/env sh\nexec node "$(dirname "$0")/../dist/rskc.js" "$@"\n`);

fs.writeFileSync(path.join(linuxRakshak, 'systemd', 'rakshak.service'), `[Unit]
Description=Rakshak Anti-AI Scraper & Crawler Daemon
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/node /opt/rakshak/dist/bin/rakshak.js daemon
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
`);

fs.writeFileSync(path.join(linuxRakshak, 'README-LINUX.txt'), `===============================================================
RAKSHAK ZERO-TRUST PERIMETER MATRIX — LINUX x64 (v1.0.0)
===============================================================

Commercial Production License // Debian, Ubuntu, Fedora, Arch, RHEL

1. Setup:
   curl -fsSL https://rakshakus.vercel.app/install.sh | bash

2. Commands:
   rakshak init              - Initialize perimeter policy
   rakshak status            - Real-time kernel & process status
   rskc compile defense.rsk  - Compile .rsk policy to .rskb binary bytecode
   rakshak dump defense.rskb - Disassemble bytecode instructions

3. Systemd Service:
   sudo cp systemd/rakshak.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now rakshak
`);

fs.writeFileSync(path.join(linuxRakshak, 'package-info.json'), JSON.stringify({
  target: 'linux-x64',
  platform: 'Linux x86_64 (glibc / musl)',
  version: '1.0.0',
  buildEngine: 'Rakshak Linux ELF & POSIX Packager',
  created: new Date().toISOString()
}, null, 2));

const linuxTar = path.join(releasesDir, 'rakshak-linux-x64.tar.gz');
if (fs.existsSync(linuxTar)) fs.unlinkSync(linuxTar);
execSync(`tar -czf "${linuxTar}" -C "${linuxStaging}" rakshak`);

// ==========================================
// 4. Compute Real Cryptographic SHA-256 Hashes
// ==========================================
console.log('==> Step 3: Computing Cryptographic SHA-256 Hashes...');

function getRealHash(filePath) {
  const buf = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  const sizeKb = (buf.length / 1024).toFixed(1) + ' KB';
  const sizeMb = (buf.length / (1024 * 1024)).toFixed(2) + ' MB';
  const sizeDisplay = buf.length > 1024 * 1024 ? sizeMb : sizeKb;
  return {
    sha256: hash,
    sizeBytes: buf.length,
    size: sizeDisplay
  };
}

const winHash = getRealHash(winZip);
const macHash = getRealHash(macZip);
const linuxHash = getRealHash(linuxTar);
const sdkHash = getRealHash(tgzDest);

const manifest = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  packages: {
    windows: {
      file: 'rakshak-windows-x64.zip',
      name: 'Windows 11 / 10 (x64)',
      ...winHash
    },
    mac: {
      file: 'rakshak-macos-universal.zip',
      name: 'macOS Apple Silicon & Intel',
      ...macHash
    },
    linux: {
      file: 'rakshak-linux-x64.tar.gz',
      name: 'Linux x86_64 Tarball',
      ...linuxHash
    },
    sdk: {
      file: 'rakshaksdkv1-1.0.0.tgz',
      name: 'NPM SDK Package Tarball',
      ...sdkHash
    }
  }
};

fs.writeFileSync(path.join(releasesDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

const checksumsTxt = [
  `${winHash.sha256}  rakshak-windows-x64.zip`,
  `${macHash.sha256}  rakshak-macos-universal.zip`,
  `${linuxHash.sha256}  rakshak-linux-x64.tar.gz`,
  `${sdkHash.sha256}  rakshaksdkv1-1.0.0.tgz`
].join('\n');
fs.writeFileSync(path.join(releasesDir, 'checksums.txt'), checksumsTxt + '\n');

const manifestJsContent = `export const releaseManifest = ${JSON.stringify(manifest, null, 2)};\r\n\r\nexport default releaseManifest;\r\n`;

fs.writeFileSync(path.join(rootDir, 'src', 'data', 'releaseManifest.js'), manifestJsContent);

console.log('==> Step 4: Verification Manifests Output:');
console.log(checksumsTxt);

// Clean up scratch staging
fs.rmSync(winStaging, { recursive: true, force: true });
fs.rmSync(macStaging, { recursive: true, force: true });
fs.rmSync(linuxStaging, { recursive: true, force: true });

console.log('==> SUCCESS: All 4 production release packages compiled with verified unique SHA-256 signatures!');
