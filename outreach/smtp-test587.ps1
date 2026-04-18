$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

try {
    $smtp = New-Object System.Net.Mail.SmtpClient
    $smtp.Host = "smtp.163.com"
    $smtp.Port = 587
    $smtp.EnableSsl = $true
    $smtp.Credentials = New-Object System.Net.NetworkCredential("13510221939@163.com","GQjbwvrwcZ8HM4Ze")
    $smtp.Timeout = 15000
    
    $mail = New-Object System.Net.Mail.MailMessage
    $mail.From = "13510221939@163.com"
    $mail.To.Add("13510221939@163.com")
    $mail.Subject = "SMTP 587 Test"
    $mail.Body = "Test from Outreach Agent at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    $mail.IsBodyHtml = $false
    
    $smtp.Send($mail)
    Write-Host "SMTP_SUCCESS_587"
} catch {
    Write-Host "SMTP_FAILED_587: $($_.Exception.Message)"
}
