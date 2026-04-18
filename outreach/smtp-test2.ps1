$code = $args[0]
try {
    $smtp = New-Object System.Net.Mail.SmtpClient('smtp.163.com', 587)
    $smtp.EnableSsl = $true
    $smtp.Credentials = New-Object System.Net.NetworkCredential('13510221939@163.com', $code)
    $smtp.Send('13510221939@163.com', 'test@example.com', 'SMTP Test', 'test body')
    Write-Host 'OK'
} catch {
    Write-Host ('ERROR: ' + $_.Exception.Message)
}
