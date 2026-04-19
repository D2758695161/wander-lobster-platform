Add-Type -AssemblyName System.Net.Mail
$smtp = New-Object System.Net.Mail.SmtpClient
$smtp.Host = 'smtp.163.com'
$smtp.Port = 465
$smtp.EnableSsl = $true
$smtp.Credentials = New-Object System.Net.NetworkCredential('13510221939@163.com', 'ANVJFYRw74diDt3S')
$msg = New-Object System.Net.Mail.MailMessage
$msg.From = '13510221939@163.com'
$msg.To.Add('13510221939@163.com')
$msg.Subject = 'SMTP Test'
$msg.Body = 'Test at ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
try {
    $smtp.Send($msg)
    Write-Host 'SMTP OK'
} catch {
    Write-Host ('SMTP FAILED: ' + $_.Exception.InnerException.Message)
}
$msg.Dispose()
$smtp.Dispose()
