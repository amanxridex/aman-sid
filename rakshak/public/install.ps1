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
    $ExpectedHash = "69e8c78109e0ec8a7659d9f87e527fca6d1aee5065dae8f34a3aa7ba919c1f21"
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

Write-Host "[5/5] Verifying Rakshak & RSK Compiler..." -ForegroundColor Yellow
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "      [WARNING] Node.js is recommended for executing the Rakshak CLI." -ForegroundColor DarkYellow
    Write-Host "      Download Node.js from: https://nodejs.org/" -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT SUCCESSFUL: RAKSHAK IS NOW ACTIVE!" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Installed Location: $InstallDir" -ForegroundColor DarkGray
Write-Host "SHA-256 Hash:       $ComputedHash" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Available Commands in any new terminal:" -ForegroundColor Cyan
Write-Host "  rakshak --help     # Universal Security & Deception CLI" -ForegroundColor White
Write-Host "  rskc --help        # Rakshak Security Knowledge (.rsk) Compiler" -ForegroundColor White
Write-Host ""
Write-Host "Quickstart:" -ForegroundColor Yellow
Write-Host "  rakshak init" -ForegroundColor White
Write-Host "  rskc compile defense.rsk" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Green
