import smtplib
from email.mime.text import MIMEText
from email.header import Header

smtp_host = 'smtp.163.com'
smtp_port = 465
smtp_user = '13510221939@163.com'
smtp_pass = 'DKpWFJySX2RjTCQc'

def send_email(to_addr, subject, body):
    msg = MIMEText(body, 'plain', 'utf-8')
    msg['From'] = smtp_user
    msg['To'] = to_addr
    msg['Subject'] = Header(subject, 'utf-8')
    try:
        server = smtplib.SMTP_SSL(smtp_host, smtp_port)
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, [to_addr], msg.as_string())
        server.quit()
        print(f"SENT: {to_addr}")
        print(f"  Subj: {subject}")
        return True
    except Exception as e:
        print(f"FAILED: {to_addr} | {e}")
        return False

body1 = """Hi Symmetry Systems team,

I saw your Associate Forward Deployed Engineer posting and I am very interested. The role sits at exactly the intersection of data security, cloud (AWS/Azure/GCP), and customer-facing technical delivery -- that is the kind of work I thrive in.

My background:
- Python and Go for integration scripting, API work, and automation
- Deploying across AWS, Azure, and GCP -- IAM, networking, production-grade service patterns
- Modern data ecosystems: warehouses, lakes, object stores, SaaS platforms
- Strong debugging and systems thinking -- isolating root cause from ambiguous symptoms
- Security tooling experience: least privilege, anomalous activity detection, DSPM-adjacent work

I am drawn to Symmetry's data-centric security posture approach -- securing data from the data out rather than perimeter in is the right mental model for how enterprises actually work today. The field-to-product feedback loop is also compelling.

I am based in Asia but can overlap US hours comfortably. Available to start immediately.

Mentioning WEALTHY as requested, and tag #RMjcuMzguMTYzLjE3.

Best,
Yitong"""

body2 = """Hi, I can develop the water dispenser control system (project 185768).

Technical approach:
- Dual payment: WeChat/Alipay scan-to-pay callback + RC522 IC card recognition
- Auto cup drop: Python + GPIO/relay control for cup dispenser motor
- 7-inch TFT display: real-time payment status, card balance, cup status, water volume
- Flow meter: pulse counting, ml conversion, auto-stop at target volume
- Offline card: local balance database, sync when network recovers
- Persistent settings: EEPROM/Flash storage for all parameters

I have embedded Python development experience and can deliver the prototype quickly. Full scope within 1 month.

Let me know if you would like to discuss further.

Best,
Yitong"""

print("Sending emails...")
send_email('careers@symmetry-systems.com', 'Associate Forward Deployed Engineer | WEALTHY #RMjcuMzguMTYzLjE3', body1)
send_email('185768@proginn.com', 'Water Dispenser Control System - Python Embedded + Payment Integration', body2)
print("Done")
