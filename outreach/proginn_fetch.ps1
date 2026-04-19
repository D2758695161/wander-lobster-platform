$ErrorActionPreference = 'SilentlyContinue'
try {
    $r = Invoke-WebRequest -Uri 'https://job.proginn.com?page=2&tab=project' -Headers @{'User-Agent'='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'} -TimeoutSec 15 -UseBasicParsing
    $content = $r.Content
    # Extract job entries with Chinese
    $pattern = '[\u4e00-\u9fff].{0,200}'
    $matches = [regex]::Matches($content, $pattern)
    $results = @()
    foreach ($m in $matches) {
        $txt = $m.Value
        if ($txt -match '\d{5,7}' -or $txt -match 'K|万|元') {
            $results += $txt
        }
    }
    $results | Select-Object -First 30
} catch {
    "Error: $($_.Exception.Message)"
}
