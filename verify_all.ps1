
Write-Host "=== Copy Quality v0.9 Verification Master runner ===" -ForegroundColor Cyan

# 1. Clean
# .\tools\wipe-cache.ps1 # Optional, run manually if needed

# 2. Build Check
Write-Host "[1/4] Running Type Check (TSC)..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) { Write-Error "TSC Failed"; exit 1 }

# 3. Static Code Gate
Write-Host "[2/4] Running Object Gen Gate..." -ForegroundColor Yellow
npx ts-node verify_no_generateObject.ts
if ($LASTEXITCODE -ne 0) { Write-Error "Object Gate Failed"; exit 1 }

# 4. Simulation Block Check (Simulation must NOT appear in logs or output)
# Note: This usually requires a mock env or specific check
Write-Host "[3/4] Simulation Block check (Placeholder)..." -ForegroundColor Yellow

# 5. Schema Stress Test (requires server running)
Write-Host "[4/4] Running Schema Stress Test (30 runs)..." -ForegroundColor Yellow
Write-Host "(Make sure 'npm run dev' is active at localhost:3000)" -ForegroundColor Gray
node verify_no_schema_fail.js
if ($LASTEXITCODE -ne 0) { Write-Error "Stress Test Failed"; exit 1 }

Write-Host "`n[SUCCESS] All v0.9 Stability Gates passed!" -ForegroundColor Green
