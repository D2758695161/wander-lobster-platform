# GitHub API - Search sponsors projects & freelancer opportunities
$headers = @{
    "Authorization" = "token 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"
    "Accept" = "application/vnd.github.v3+json"
}

# Search for recent sponsor-eligible repos
$sponsorsSearch = Invoke-RestMethod -Uri "https://api.github.com/search/repositories?q=sponsors+created:>=2026-01-01&sort=stars&order=desc&per_page=15" -Headers $headers -Method Get
Write-Host "=== GITHUB SPONSORS (recent) ===" 
$sponsorsSearch.items | ForEach-Object {
    [PSCustomObject]@{
        name = $_.full_name
        description = $_.description
        stars = $_.stargazers_count
        url = $_.html_url
        created = $_.created_at
    }
} | ConvertTo-Json -Depth 2

# Search for "help wanted" in high-star repos
$helpWanted = Invoke-RestMethod -Uri "https://api.github.com/search/issues?q=help+wanted+label:help+wanted+created:>=2026-03-24+type:issue&per_page=20&sort=created&order=desc" -Headers $headers -Method Get
Write-Host "=== HELP WANTED (recent 7 days) ==="
$helpWanted.items | ForEach-Object {
    [PSCustomObject]@{
        title = $_.title
        repo = $_.repository_url -replace "https://api.github.com/repos/", ""
        url = $_.html_url
        labels = ($_.labels | ForEach-Object { $_.name }) -join ", "
    }
} | ConvertTo-Json -Depth 2

# Search for reward programs
$reward = Invoke-RestMethod -Uri "https://api.github.com/search/issues?q=reward+label:reward+created:>=2026-03-24&per_page=15" -Headers $headers -Method Get
Write-Host "=== REWARD PROGRAMS ==="
$reward.items | ForEach-Object {
    [PSCustomObject]@{
        title = $_.title
        repo = $_.repository_url -replace "https://api.github.com/repos/", ""
        url = $_.html_url
    }
} | ConvertTo-Json -Depth 2
