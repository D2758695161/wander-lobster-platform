import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

smtp_host = 'smtp.163.com'
smtp_port = 465
user = '13510221939@163.com'
password = 'FYU6WwPKjeUnMtpE'

# Test login
ctx = ssl.create_default_context()
with smtplib.SMTP_SSL(smtp_host, smtp_port, context=ctx) as server:
    server.login(user, password)
    print('LOGIN OK')

# Send email to best bet: project 42505 - Next.js+Supabase MVP (no direct email available)
# Try: find contact from GitHub repo mentioned
# Since project 42505 says "GitHub私有仓库已建" but no contact email visible on the SPA page,
# let's try reaching out to project 42498 (Agent集群) via another channel or 
# check if there's a direct contact for any project

# Actually, for project 42505 - Next.js+Supabase MVP - the best outreach is to 
# check if the company/project has a public presence we can find

# Since we don't have direct emails for proginn clients, let's draft cold emails
# to companies that might be hiring for similar roles

# Best new outreach target today: Fullscript (already applied, can't do more)
# Let's check if there are any other remote job boards to try

print('SMTP AUTH OK')
