try {
    $smtp = New-Object Net.Mail.SmtpClient('smtp.163.com', 465)
    $smtp.EnableSsl = $true
    $smtp.Credentials = New-Object Net.NetworkCredential('13510221939@163.com', 'ANVJFYRw74diDt3S')
    $msg = New-Object Net.Mail.MailMessage
    $msg.From = '13510221939@163.com'
    $msg.To.Add('13510221939@163.com')
    $msg.Subject = 'SMTP test ANVJFYRw74diDt3S'
    $msg.Body = 'test'
    $smtp.Send($msg)
    Write-Host 'ANVJFYRw74diDt3S: OK'
} catch {
    Write-Host "ANVJFYRw74diDt3S: FAIL $($_.Exception.Message)"
}

try {
    $smtp2 = New-Object Net.Mail.SmtpClient('smtp.163.com', 465)
    $smtp2.EnableSsl = $true
    $smtp2.Credentials = New-Object Net.NetworkCredential('13510221939@163.com', 'DKpWFJySX2RjTCQc')
    $msg2 = New-Object Net.Mail.MailMessage
    $msg2.From = '13510221939@163.com'
    $msg2.To.Add('13510221939@163.com')
    $msg2.Subject = 'SMTP test DKpWFJySX2RjTCQc'
    $msg2.Body = 'test'
    $smtp2.Send($msg2)
    Write-Host 'DKpWFJySX2RjTCQc: OK'
} catch {
    Write-Host "DKpWFJySX2RjTCQc: FAIL $($_.Exception.Message)"
}
