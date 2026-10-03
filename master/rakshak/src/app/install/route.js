import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const osParam = searchParams.get('os');
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  // If requested by powershell, irm, or windows
  const isWindows = osParam === 'win' || osParam === 'windows' || userAgent.includes('powershell') || userAgent.includes('pwsh');
  const isUnix = osParam === 'mac' || osParam === 'linux' || osParam === 'sh' || userAgent.includes('curl') || userAgent.includes('wget');

  const rootDir = process.cwd();

  if (isWindows) {
    const ps1Path = path.join(rootDir, 'public', 'install.ps1');
    if (fs.existsSync(ps1Path)) {
      const content = fs.readFileSync(ps1Path, 'utf8');
      return new Response(content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
  }

  if (isUnix || (!isWindows && (userAgent.includes('curl') || userAgent.includes('wget')))) {
    const shPath = path.join(rootDir, 'public', 'install.sh');
    if (fs.existsSync(shPath)) {
      const content = fs.readFileSync(shPath, 'utf8');
      return new Response(content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
  }

  // If a browser visits /install, redirect to /download
  return Response.redirect(new URL('/download', request.url));
}
