try {
    $headers = @{'Authorization' = 'Bearer sk_5d441b7df454704c5ac0042983c7a78bcfaa1103c6f571f3'}
    $r = Invoke-RestMethod -Uri 'https://api.sendclaw.com/v1/smtp/status' -Headers $headers -TimeoutSec 10
    $r | ConvertTo-Json
    Write-Host 'SendClaw API: OK'
} catch {
    Write-Host "SendClaw API error: $($_.Exception.Message)"
}
