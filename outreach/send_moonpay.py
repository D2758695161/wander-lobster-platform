import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# SMTP settings
SMTP_HOST = 'smtp.163.com'
SMTP_PORT = 465  # SSL
SMTP_USER = '13510221939@163.com'
SMTP_PASS = 'FYU6WwPKjeUnMtpE'

FROM = '13510221939@163.com'
TO = 'talent@moonpay.com'

msg = MIMEMultipart('alternative')
msg['Subject'] = 'Python Security Automation Engineer | MoonPay Roles — Available Immediately'
msg['From'] = FROM
msg['To'] = TO

body = """Hi MoonPay Security Team,

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
"""

msg.attach(MIMEText(body, 'plain'))

try:
    context = ssl._create_unverified_context()
    
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context) as server:
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(FROM, [TO], msg.as_string())
        print(f"SUCCESS: MoonPay email sent to {TO}")
except Exception as e:
    print(f"FAILED: {e}")

# Also try port 587 with STARTTLS as fallback
try:
    with smtplib.SMTP(SMTP_HOST, 587) as server:
        server.ehlo()
        server.starttls(context=ssl.create_default_context())
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(FROM, [TO], msg.as_string())
        print(f"SUCCESS (port 587 STARTTLS): MoonPay email sent to {TO}")
except Exception as e2:
    print(f"Port 587 also failed: {e2}")
