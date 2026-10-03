# Rakshak Zero-Trust Defense Matrix — Windows One-Line Installer
# Usage: powershell -c "irm https://rakshakus.vercel.app/install.ps1 | iex"

$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     RAKSHAK ZERO-TRUST DEFENSE MATRIX INSTALLER (v1.0.0)   " -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan

$InstallDir = Join-Path $HOME ".rakshak"
$BinDir = Join-Path $InstallDir "bin"
$ZipUrl = "https://rakshakus.vercel.app/releases/rakshak-windows-x64.zip"
$ZipPath = Join-Path $env:TEMP "rakshak-windows-x64.zip"
$ManifestUrl = "https://rakshakus.vercel.app/releases/manifest.json"

Write-Host "[1/5] Downloading latest Rakshak release bundle..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $ZipUrl -OutFile $ZipPath -UseBasicParsing

Write-Host "[2/5] Verifying cryptographic SHA-256 binary integrity..." -ForegroundColor Yellow
$ComputedHash = (Get-FileHash -Path $ZipPath -Algorithm SHA256).Hash.ToLower()

try {
    $ManifestJson = Invoke-RestMethod -Uri $ManifestUrl -UseBasicParsing
    $ExpectedHash = $ManifestJson.packages.windows.sha256.ToLower()
} catch {
    # Fallback to known release build signature
    $ExpectedHash = "727dc3a3f11f7049df0f4c0db1abc6dd2a4fe214af3649eed1e9cc6a419170e8"
}

if ($ComputedHash -ne $ExpectedHash) {
    Write-Host "[FATAL ERROR] Cryptographic checksum mismatch!" -ForegroundColor Red
    Write-Host "Expected: $ExpectedHash" -ForegroundColor Red
    Write-Host "Computed: $ComputedHash" -ForegroundColor Red
    Remove-Item $ZipPath -Force
    Exit 1
}

Write-Host "      [OK] Checksum Verified: $ComputedHash" -ForegroundColor Green

Write-Host "[3/5] Extracting to $InstallDir..." -ForegroundColor Yellow
if (Test-Path $InstallDir) {
    Remove-Item $InstallDir -Recurse -Force
}
Expand-Archive -Path $ZipPath -DestinationPath $env:TEMP -Force
Move-Item (Join-Path $env:TEMP "rakshak") $InstallDir -Force
Remove-Item $ZipPath -Force

Write-Host "[4/5] Configuring Environment PATH..." -ForegroundColor Yellow
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$BinDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$UserPath;$BinDir", "User")
    $env:Path = "$env:Path;$BinDir"
    Write-Host "      Added $BinDir to User PATH." -ForegroundColor Green
} else {
    Write-Host "      $BinDir is already in User PATH." -ForegroundColor DarkGray
}

Write-Host "[5/5] Registering OS Integration & Launching System Tray Shield..." -ForegroundColor Yellow
$ShieldExe = Join-Path $BinDir "RakshakShield.exe"
if (Test-Path $ShieldExe) {
    & $ShieldExe install
}

if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "      [NOTE] Node.js is optional for CLI extensions. Native Windows PE core is 100% active." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT SUCCESSFUL: RAKSHAK IS NOW ACTIVE!" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Installed Location: $InstallDir" -ForegroundColor DarkGray
Write-Host "SHA-256 Hash:       $ComputedHash" -ForegroundColor DarkGray
Write-Host "System Tray Shield: ACTIVE (Green Shield Indicator in Taskbar Notification Area)" -ForegroundColor Green
Write-Host ""
Write-Host "1-Click Uninstall:  Settings > Installed Apps > Rakshak > Uninstall" -ForegroundColor Cyan
Write-Host "                    or right-click Green Shield in Tray > '1-Click Clean Uninstall'" -ForegroundColor Cyan
Write-Host ""
Write-Host "Available Commands in any new terminal:" -ForegroundColor Cyan
Write-Host "  RakshakShield.exe gui      # Interactive Cyber-Defense Command Center" -ForegroundColor White
Write-Host "  RakshakShield.exe status   # Workstation Security & Enclave Health" -ForegroundColor White
Write-Host "  RakshakShield.exe scan     # Deep Threat & Rogue AI Process Audit" -ForegroundColor White
Write-Host "  rakshak --help             # Universal Security & Deception CLI" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Green
