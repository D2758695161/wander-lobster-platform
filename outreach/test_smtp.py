import smtplib, ssl, socket
from email.message import EmailMessage

smtp_host = "smtp.163.com"
smtp_port = 587
smtp_user = "13510221939@163.com"
smtp_pass = "GQjbwvrwcZ8HM4Ze"

# First: test basic connection + EHLO
print("Testing basic SMTP connection...")
try:
    server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
    server.set_debuglevel(1)
    print("EHLO...")
    ehlo_resp = server.ehlo()
    print(f"EHLO response: {ehlo_resp}")
    print("STARTTLS...")
    server.starttls(context=ssl.create_default_context())
    print("EHLO after TLS...")
    server.ehlo()
    print("Login...")
    login_resp = server.login(smtp_user, smtp_pass)
    print(f"Login response: {login_resp}")
    server.quit()
    print("SUCCESS")
except smtplib.SMTPAuthenticationError as e:
    print(f"AUTH ERROR: {e.smtp_code} - {e.smtp_error}")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
