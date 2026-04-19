$json = Get-Content 'C:\Users\Administrator\.openclaw\workspace\outreach\cn-leads.json' -Raw | ConvertFrom-Json
$pending = $json.jobs | Where-Object { $_.status -eq 'pending' -and $_.fit_score -ge 7 }
Write-Host "Total pending high-fit (7+): $($pending.Count)"
$pending | Select-Object project_id, title, budget, fit_score | Format-Table -AutoSize
