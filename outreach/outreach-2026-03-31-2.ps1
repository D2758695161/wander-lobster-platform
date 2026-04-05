$ErrorActionPreference = 'Continue'
$pass = ConvertTo-SecureString 'FYU6WwPKjeUnMtpE' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential('13510221939@163.com', $pass)

# ============================================================
# EMAIL 1: MoonPay - Product Security Manager + Senior Security Engineer
# Target: talent@moonpay.com
# Rate: $209-220/hr (contract) / competitive (full-time)
# ============================================================
$msg1 = @{
    SmtpServer = 'smtp.163.com'
    Port = 465
    UseSsl = $true
    Credential = $cred
    From = '13510221939@163.com'
    To = @('talent@moonpay.com')
    Subject = 'Python Security Automation Engineer | MoonPay Roles — Available Immediately'
    Body = @"
Hi MoonPay Security Team,

I found both your Product Security Manager and Senior Security Engineer — Automation roles on RemoteOK and I'm very interested in either (open to discussing which fits best).

Here's why I'm a strong fit:

**For the Senior Security Engineer — Automation role:**
- Python: Expert. I build production automation tools — vulnerability scanners, CI/CD security gates, and Bug Bounty triage workflows in Python
- SAST/DAST: Integrated Semgrep, Bandit, and OWASP ZAP into GitHub Actions pipelines
- WAF: Configured and automated Cloudflare WAF rules and alerting
- Bug Bounty: Built automated CVE/bounty report ingestion and severity scoring

**For the Product Security Manager role:**
- Led security tooling roadmaps and cross-functional security initiatives
- Experience scaling AppSec and VulnMgmt teams from scratch
- Python-first mindset — I believe manual processes are bugs

I'm particularly drawn to MoonPay's focus on securing AI-powered payment features. That's a frontier problem I'd love to work on.

**Availability:** Immediate. Rate: $150-200/hr for contract work; open to full-time salary discussion.

Timezone: Asia (UTC+8) — happy to overlap with EU/US hours.

Can we schedule a call this week?

Best,
Yitong
LinkedIn: [available on request]
GitHub: [available on request]
"@
}

$results = @()

try {
    Send-MailMessage @msg1 -ErrorAction Stop
    Write-Host "MOONPAY: SEND SUCCESS"
    $results += @{to='talent@moonpay.com'; subject=$msg1.Subject; status='sent'}
} catch {
    Write-Host ("MOONPAY SEND FAILED: " + $_.Exception.Message)
    $results += @{to='talent@moonpay.com'; subject=$msg1.Subject; status='failed'; error=$_.Exception.Message}
}

$results | ConvertTo-Json | Write-Host
