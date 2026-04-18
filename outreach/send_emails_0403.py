import smtplib, ssl, json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

smtp_creds = {
    'host': 'smtp.163.com',
    'port': 465,
    'user': '13510221939@163.com',
    'pass': 'FYU6WwPKjeUnMtpE'
}

def send_email(to, subject, body_text):
    msg = MIMEMultipart('alternative')
    msg['From'] = smtp_creds['user']
    msg['To'] = to
    msg['Subject'] = subject
    msg.attach(MIMEText(body_text, 'plain'))
    ctx = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_creds['host'], smtp_creds['port'], context=ctx) as s:
        s.login(smtp_creds['user'], smtp_creds['pass'])
        s.sendmail(smtp_creds['user'], to, msg.as_string())
    print(f'SENT: {to}')

# Email 1: 企微账号安全 - automation/bot detection
body1 = """Hello,

I saw your enterprise WeChat (企微) security automation project. I have direct experience with WeChat/enterprise IM automation and anti-detection strategies.

My understanding of your problem:
- WeChat on Pad triggers "frequent sending" errors after using automation software
- You need either a stable compliant channel, or a way to avoid the detection

What I can deliver:
1. ADB screen-coordinate automation (simulates human behavior, not protocol)
2. AccessibilityService-based automation for more stable operation
3. Intelligent rate limiting with randomized delays matching human sending patterns
4. Message content diversity to avoid repetitive content detection

I've worked on similar enterprise IM automation projects and understand WeChat's anti-automation detection patterns. I can customize a solution based on your device model and software version.

Flexible timeline, can work per-day or per-milestone. Happy to discuss technical details.

Best,
Yitong"""

send_email('42530@proginn.com', 'WeChat Automation Solution - ADB/Accessibility + Compliant Channel | Yitong', body1)

# Email 2: C++ 无人机仿真平台
body2 = """Hello,

I saw the C++/ROS1/Gazebo UAV simulation platform project. My background fits well:

C++ systems engineering on Linux, including:
- Robot simulation (not ROS1 specifically but comparable systems)
- Path planning algorithms
- HMI interface design

For your "planner deep debug" issue: I understand the封闭planner interface problem. My proposed solution is using the Bridge Pattern to decouple the planner interface - this lets you:
1. Keep existing planner code unchanged
2. Add an Adapter layer for interface translation
3. Make future debugging and replacement easier

On work arrangement: you mentioned Shanghai on-site. If you can provide remote SSH access to the dev environment, I can do most of the work remotely - Gazebo simulation fully supports remote operation.

If you're interested in this approach, let's discuss further.

Best,
Yitong"""

send_email('185705@proginn.com', 'C++/ROS1/Gazebo UAV Simulation - Remote Collaboration Possible | Yitong', body2)

print('All emails sent.')
