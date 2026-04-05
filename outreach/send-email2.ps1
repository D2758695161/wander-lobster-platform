$ErrorActionPreference = 'Continue'
$pass = ConvertTo-SecureString 'GQjbwvrwcZ8HM4Ze' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential('13510221939@163.com', $pass)

# MoonPay - port 587 STARTTLS
$msg = @{
    SmtpServer = 'smtp.163.com'
    Port = 587
    UseSsl = $true
    Credential = $cred
    From = '13510221939@163.com'
    To = @('talent@moonpay.com')
    Subject = 'Senior Security Engineer - Python/Automation | Available for Contract'
    Body = @"
Hi MoonPay Security Team,

I saw your Senior Security Engineer - Automation role on RemoteOK and I'm very interested.

Your requirements (Python security tooling, SAST/DAST CI/CD integration, Bug Bounty triage, WAF automation) match my profile closely. I have strong Python skills for building security automation.

Key points:
- Python: expert-level, used for security automation, API scripting
- CI/CD Security: SAST/DAST tools integrated into GitHub Actions/GitLab CI
- Cloud Security: AWS CloudTrail/WAF configurations and alerting
- Bug Bounty: automated triage workflows for vulnerability reports

Interested in MoonPay's focus on securing AI features - that's a frontier I'd love to work on.

Rate: $150-200/hr (open to discussion)

Available immediately. Happy to do a quick intro call this week.

Best,
Yitong
"@
}

try {
    Send-MailMessage @msg -ErrorAction Stop
    Write-Host "MOONPAY: SEND SUCCESS"
} catch {
    Write-Host ("MOONPAY SEND FAILED: " + $_.Exception.Message)
}
