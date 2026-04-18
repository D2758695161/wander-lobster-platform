$ErrorActionPreference = 'SilentlyContinue'
$token = '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'
$owner = 'D2758695161'
$repo = 'wander-lobster-platform'
$headers = @{
    Authorization = "token $token"
    Accept = "application/vnd.github.v3+json"
    'Content-Type' = 'application/json'
}

$outDir = 'C:\Users\Administrator\.openclaw\workspace\lobster-platform\out'
$files = Get-ChildItem -Path $outDir -Recurse -File

$count = 0
foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($outDir.Length + 1)
    $content = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($file.FullName))
    
    # Get existing file SHA if exists
    $sha = $null
    try {
        $existing = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/contents/$relativePath" -Headers @{Authorization="token $token"; Accept="application/vnd.github.v3+json"} 
        if ($existing.sha) { $sha = $existing.sha }
    } catch {}
    
    $body = @{
        message = "Update $relativePath"
        content = $content
    }
    if ($sha) { $body.sha = $sha }
    
    $json = $body | ConvertTo-Json -Depth 5
    try {
        Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/contents/$relativePath" -Method PUT -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($json)) | Out-Null
        $count++
        Write-Host "[$count] $relativePath"
    } catch {
        Write-Host "[FAIL] $relativePath : $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done! $count files uploaded."
Write-Host "Site: https://d2758695161.github.io/wander-lobster-platform/"
