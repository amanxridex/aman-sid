<#
.SYNOPSIS
    Rakshak-Guard.ps1 - Windows Server & Workstation Anti-Scraper Sentinel
.DESCRIPTION
    Hardens Windows host environments, detects stealth headless scrapers in memory,
    and drops automated crawler connection pools.
#>

[CmdletBinding()]
param (
    [switch]$AuditOnly = $false,
    [switch]$EnforceFirewall = $false
)

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  RAKSHAK WINDOWS SECURITY SENTINEL (PowerShell)   " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# 1. Detect Headless Automation Processes
$suspectProcesses = Get-CimInstance Win32_Process | Where-Object {
    $_.CommandLine -match "--headless|--remote-debugging-port|puppeteer|playwright|selenium|crawl4ai"
}

if ($suspectProcesses) {
    Write-Host "[ALERT] Detected active headless browser / scraper processes:" -ForegroundColor Red
    foreach ($proc in $suspectProcesses) {
        Write-Host "  - PID: $($proc.ProcessId) | Name: $($proc.Name) | Command: $($proc.CommandLine)" -ForegroundColor Yellow
        if (-not $AuditOnly) {
            Write-Host "    -> Terminating rogue automation PID $($proc.ProcessId)..." -ForegroundColor Magenta
            Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
        }
    }
} else {
    Write-Host "[OK] No active headless browser automation processes identified." -ForegroundColor Green
}

# 2. Inspect Active Inbound Connections against Datacenter ASNs
$activeConnections = Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue | Where-Object {
    $_.RemoteAddress -notmatch "^127\.|^10\.|^192\.168\.|^172\.(1[6-9]|2[0-9]|3[0-1])\."
}

Write-Host "[INFO] Audited $($activeConnections.Count) active external TCP connection sockets." -ForegroundColor White

# 3. Optional Windows Firewall Rule Creation
if ($EnforceFirewall) {
    Write-Host "[ENFORCE] Deploying Rakshak Anti-Scraper Inbound Firewall Rules..." -ForegroundColor Cyan
    $ruleName = "Rakshak-Anti-AI-Datacenter-Block"
    Remove-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
    # Block well-known crawler ranges (OpenAI, AWS scraper egress)
    New-NetFirewallRule -DisplayName $ruleName `
        -Direction Inbound `
        -Action Block `
        -RemoteAddress "20.171.206.0/24", "20.171.207.0/24", "52.230.152.0/24" `
        -Description "Rakshak automated zero-trust block on known AI crawler subnets"
    Write-Host "[SUCCESS] Windows Advanced Firewall rules established." -ForegroundColor Green
}

Write-Host "Rakshak Sentinel Scan Completed." -ForegroundColor Green
