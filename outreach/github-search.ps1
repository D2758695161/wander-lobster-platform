# GitHub API search for bounty issues
$headers = @{
    "Authorization" = "token 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"
    "Accept" = "application/vnd.github.v3+json"
}

$response = Invoke-RestMethod -Uri "https://api.github.com/search/issues?q=bounty+label:bounty+created:>=2026-03-24&per_page=20&sort=created&order=desc" -Headers $headers -Method Get

$response.items | ForEach-Object {
    [PSCustomObject]@{
        title = $_.title
        repo = $_.repository_url -replace "https://api.github.com/repos/", ""
        url = $_.html_url
        created = $_.created_at
        state = $_.state
    }
} | ConvertTo-Json -Depth 3
