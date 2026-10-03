# ==============================================================================
# Rakshak Sovereign PKI & Authenticode Digital Code Signing Pipeline
# 100% In-House, Zero Third-Party Dependencies, Zero Paid Certificate Authorities
# ==============================================================================

$ErrorActionPreference = "Stop"

$subject = "CN=Rakshak Sovereign Security Systems, O=Rakshak Zero-Trust Defense, OU=Hardware Enclave Operations, C=US"
$releasesDir = Join-Path (Get-Location) "public\releases"
$publicDir = Join-Path (Get-Location) "public"
$certOut = Join-Path $releasesDir "Rakshak_Sovereign_Root_CA.cer"
$certOutPublic = Join-Path $publicDir "Rakshak_Sovereign_Root_CA.cer"

Write-Host "==> [PKI] Initializing Rakshak Sovereign PKI Infrastructure..." -ForegroundColor Cyan

# 1. Search for existing certificate in Cert:\CurrentUser\My
$cert = Get-ChildItem -Path "Cert:\CurrentUser\My" | Where-Object { $_.Subject -like "*CN=Rakshak Sovereign Security Systems*" } | Select-Object -First 1

if (-not $cert) {
    Write-Host "==> [PKI] Minting new 4096-bit RSA Rakshak Sovereign Code Signing Certificate..." -ForegroundColor Yellow
    $cert = New-SelfSignedCertificate `
        -Type CodeSigningCert `
        -Subject $subject `
        -KeySpec Signature `
        -KeyExportPolicy Exportable `
        -KeyUsage DigitalSignature `
        -KeyLength 4096 `
        -HashAlgorithm SHA384 `
        -CertStoreLocation "Cert:\CurrentUser\My" `
        -NotAfter (Get-Date).AddYears(10)
    
    Write-Host "==> [PKI] Certificate successfully minted! Thumbprint: $($cert.Thumbprint)" -ForegroundColor Green
} else {
    Write-Host "==> [PKI] Found active Sovereign Certificate: $($cert.Thumbprint)" -ForegroundColor Green
}

# 2. Export Public Root Certificate for 1-click user verification
Export-Certificate -Cert $cert -FilePath $certOut -Force | Out-Null
Copy-Item -Path $certOut -Destination $certOutPublic -Force
Write-Host "==> [PKI] Public Sovereign Certificate exported to public/releases/Rakshak_Sovereign_Root_CA.cer" -ForegroundColor Cyan

# 3. Sign PE Binaries
$binariesToSign = @(
    (Join-Path $releasesDir "RakshakShield.exe"),
    (Join-Path $publicDir "RakshakShield.exe")
)

foreach ($exe in $binariesToSign) {
    if (Test-Path $exe) {
        Write-Host "==> [PKI] Applying Authenticode Digital Signature to $exe..." -ForegroundColor Yellow
        $sigResult = Set-AuthenticodeSignature -FilePath $exe -Certificate $cert -HashAlgorithm SHA256
        Write-Host "==> [PKI] Signature status for $(Split-Path $exe -Leaf): $($sigResult.Status)" -ForegroundColor Green
    }
}

Write-Host "==> [PKI] Sovereign PKI Pipeline completed successfully!" -ForegroundColor Green
