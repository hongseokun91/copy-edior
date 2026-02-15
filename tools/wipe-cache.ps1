
# v1.4 Cache Buster for Windows PowerShell
Write-Host "--- v1.4 Incident Root-Cause Kill Switch: CACHE BUSTER ---" -ForegroundColor Cyan

# 1. Stop if server is running? (User handles this usually, but we clean)
Write-Host "[1/3] Removing Next.js Build Cache..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }

Write-Host "[2/3] Removing Turbo/Node Cache..." -ForegroundColor Yellow
if (Test-Path "node_modules/.cache") { Remove-Item -Recurse -Force "node_modules/.cache" }

Write-Host "[3/3] Cache Wiped. Please restart server with 'npm run dev'." -ForegroundColor Green
Write-Host "--------------------------------------------------------"
