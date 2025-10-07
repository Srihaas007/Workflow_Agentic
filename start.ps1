Param(
  [switch]$Local
)

$ErrorActionPreference = 'Stop'

function Test-Command($name) {
  try { Get-Command $name -ErrorAction Stop | Out-Null; return $true } catch { return $false }
}

function Wait-Http200($url, $timeoutSec = 60) {
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $timeoutSec) {
    try {
      $code = (Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 5).StatusCode
      if ($code -eq 200) { return $true }
    } catch { Start-Sleep -Milliseconds 500 }
  }
  return $false
}

if (-not $Local) {
  if (Test-Command 'docker') {
    if (-not $env:JWT_SECRET_KEY) { $env:JWT_SECRET_KEY = "dev-secret-THIS-IS-DEV-ONLY-12345678901234567890" }
    Write-Host "[ddev] Starting with Docker..." -ForegroundColor Cyan
    docker compose up --build -d
    Write-Host "[ddev] Waiting for services..." -ForegroundColor Cyan
    $ok1 = Wait-Http200 'http://localhost:8000/health'
    $ok2 = Wait-Http200 'http://localhost:1880/health'
    $ok3 = Wait-Http200 'http://localhost:3000'
    if ($ok1 -and $ok2 -and $ok3) {
      Write-Host "[ddev] Services ready: 8000, 1880, 3000" -ForegroundColor Green
      exit 0
    } else {
      Write-Host "[ddev] Docker services failed health checks, falling back to local..." -ForegroundColor Yellow
    }
  } else {
    Write-Host "[ddev] Docker not found, falling back to local..." -ForegroundColor Yellow
  }
}

Write-Host "[ddev] Starting locally (python/node)..." -ForegroundColor Cyan

Start-Process -FilePath python -ArgumentList 'main.py' -WindowStyle Minimized
Start-Sleep -Seconds 1
Push-Location node-red
Start-Process -FilePath node -ArgumentList 'start-nodered.js' -WindowStyle Minimized
Pop-Location
Push-Location frontend
$env:API_PROXY_TARGET = 'http://localhost:8000'
$env:BROWSER = 'none'
Start-Process -FilePath npm -ArgumentList 'start' -WindowStyle Minimized
Pop-Location

Write-Host "[ddev] Waiting for services..." -ForegroundColor Cyan
$ok1 = Wait-Http200 'http://localhost:8000/health'
$ok2 = Wait-Http200 'http://localhost:1880/health'
$ok3 = Wait-Http200 'http://localhost:3000'
if ($ok1 -and $ok2 -and $ok3) {
  Write-Host "[ddev] Services ready: 8000, 1880, 3000" -ForegroundColor Green
} else {
  Write-Host "[ddev] One or more services failed to start. Check logs." -ForegroundColor Red
}
