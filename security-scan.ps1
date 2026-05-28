$ErrorActionPreference = 'Continue'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPath = Join-Path $root 'makeup-store'
$apiPath = Join-Path $root 'makeup-store-api'
$hasFailures = $false

Write-Host "== Security scan: frontend production dependencies =="
Push-Location $frontendPath
npm run security:audit:prod
if ($LASTEXITCODE -ne 0) {
  $hasFailures = $true
}
Pop-Location

Write-Host ""
Write-Host "== Security scan: API production dependencies =="
Push-Location $apiPath
npm run security:audit:prod
if ($LASTEXITCODE -ne 0) {
  $hasFailures = $true
}
Pop-Location

Write-Host ""
if (Get-Command semgrep -ErrorAction SilentlyContinue) {
  Write-Host "== Security scan: Semgrep static analysis =="
  semgrep --config auto $root
  if ($LASTEXITCODE -ne 0) {
    $hasFailures = $true
  }
} else {
  Write-Host "== Semgrep not found, skipping SAST check =="
}

if ($hasFailures) {
  Write-Host ""
  Write-Host "Security scan completed with findings."
  exit 1
}

Write-Host ""
Write-Host "Security scan completed without findings."