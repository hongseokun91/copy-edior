$headers = @{ "Content-Type" = "application/json" }
$bodyHappy = '{"type":"flyer","tone":"friendly","styleId":"default","inputs":{"category":"식당/카페","goal":"오픈","name":"HappyShop","offer":"Free Coffee","period":"Today","contactType":"phone","contactValue":"010-1234-5678"}}'
$bodyUnsafe = '{"type":"flyer","tone":"friendly","styleId":"default","inputs":{"category":"식당/카페","goal":"오픈","name":"BadShop","offer":"100% 보장","period":"Today","contactType":"phone","contactValue":"010-1234-5678"}}'

Write-Host "--- Test 1: Happy Path ---"
try {
    $res = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/generate" -Headers $headers -Body $bodyHappy
    if ($res.variants) {
        Write-Host "Success: Got Variants"
    } else {
        Write-Host "Failed: No Variants"
    }
} catch {
    Write-Host "Failed: $_"
}

Write-Host "--- Test 2: Cooldown (Immediate Retry) ---"
try {
    $res = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/generate" -Headers $headers -Body $bodyHappy
    Write-Host "Unexpected Success"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 429) {
        Write-Host "Success: Got 429 Too Many Requests"
    } else {
        Write-Host "Failed: Got $statusCode"
    }
}

Write-Host "--- Test 3: Safety Check ---"
try {
    $res = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/generate" -Headers $headers -Body $bodyUnsafe
    Write-Host "Unexpected Success"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "Success: Got 400 Bad Request (Safety)"
    } else {
        Write-Host "Failed: Got $statusCode"
    }
}
