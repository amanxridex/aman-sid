import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const osParam = searchParams.get('os');
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  const isWindows = osParam === 'win' || osParam === 'windows' || userAgent.includes('powershell') || userAgent.includes('pwsh');
  const rootDir = process.cwd();

  const scriptFile = isWindows ? 'install.ps1' : 'install.sh';
  const scriptPath = path.join(rootDir, 'public', scriptFile);

  if (fs.existsSync(scriptPath)) {
    const content = fs.readFileSync(scriptPath, 'utf8');
    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  return Response.json({ error: 'Installer script not found' }, { status: 404 });
}
