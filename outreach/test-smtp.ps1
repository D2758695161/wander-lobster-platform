function Test-SMTP($code, $label) {
    try {
        $smtp = New-Object System.Net.Mail.SmtpClient
        $smtp.Host = 'smtp.163.com'
        $smtp.Port = 465
        $smtp.EnableSsl = $true
        $smtp.Credentials = New-Object System.Net.NetworkCredential('13510221939@163.com', $code)
        $msg = New-Object System.Net.Mail.MailMessage
        $msg.From = '13510221939@163.com'
        $msg.To.Add('13510221939@163.com')
        $msg.Subject = "SMTP test $label"
        $msg.Body = "Test"
        $smtp.Send($msg)
        Write-Host "[OK] $label : $code"
        return $true
    } catch {
        Write-Host "[FAIL] $label : $($_.Exception.Message)"
        return $false
    }
}

$codes = @{
    "DKpWFJySX2RjTCQc" = "last working (April 6)"
    "ANVJFYRw74diDt3S" = "IMAP code"
    "FYU6WwPKjeUnMtpE" = "was working then blocked"
    "GQjbwvrwcZ8HM4Ze" = "task specified"
    "SPseM7hrWSCABfwY" = "was tried"
}

foreach ($code in $codes.Keys) {
    $null = Test-SMTP -code $code -label $codes[$code]
    Start-Sleep 2
}
