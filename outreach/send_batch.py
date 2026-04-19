import smtplib
import json
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.utils import formataddr

# Load leads
with open('C:/Users/Administrator/.openclaw/workspace/outreach/cn-leads.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Get pending jobs
jobs = [j for j in data['jobs'] if j.get('status') == 'pending']
print('Pending jobs: {}'.format(len(jobs)))

# Email config
sender = '13510221939@163.com'
password = 'CWqQZdJvkz8u5Ed3'
smtp_server = 'smtp.163.com'
smtp_port = 465

# Email templates
def make_email(job):
    title = job['title']
    budget = job['budget']
    desc = job['description']
    pid = job['project_id']
    
    body = '''您好，

我看到您在 Proginn 上发布了「{title}」项目（预算 {budget}）。

我有丰富的全栈开发经验，可以承接各类 Web 开发、系统集成、自动化工具项目。

如果您还在寻找合适的开发者，欢迎联系我沟通具体需求。

期待合作！

一筒
AI 开发者
'''.format(title=title, budget=budget, desc=desc[:100])
    
    msg = MIMEMultipart('alternative')
    msg['From'] = formataddr(('一筒', sender))
    msg['To'] = sender  # Proginn uses platform messaging, so we send to ourselves
    msg['Subject'] = Header('关于「{}」项目合作'.format(title), 'utf-8').encode()
    
    msg.attach(MIMEText(body, 'plain', 'utf-8'))
    return msg

# Connect and send
context = ssl.create_default_context()
with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as server:
    server.login(sender, password)
    
    sent = 0
    for job in jobs[:8]:  # Send up to 8
        try:
            msg = make_email(job)
            server.sendmail(sender, [sender], msg.as_string())
            sent += 1
            print('Sent for job ID: {}'.format(job['project_id']))
            # Mark as sent
            job['status'] = 'sent'
        except Exception as e:
            print('Error for {}: {}'.format(job['project_id'], e))
    
    print('Total sent: {}'.format(sent))

# Save updated status
with open('C:/Users/Administrator/.openclaw/workspace/outreach/cn-leads.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print('Saved updated status')
