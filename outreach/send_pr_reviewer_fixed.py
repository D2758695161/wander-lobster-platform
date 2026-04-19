import smtplib, ssl, json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

smtp_host = 'smtp.163.com'
smtp_port = 465
user = '13510221939@163.com'
password = 'TLfTvAJBC8QKxxre'  # Updated 2026-04-13

LANDING_PAGE = "https://d2758695161.github.io/pr-reviewer/"
FROM_NAME = "Yitong"

def send_email(to_email, subject, body_html, body_text):
    ctx = ssl.create_default_context()
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f'{FROM_NAME} <{user}>'
    msg['To'] = to_email
    msg.attach(MIMEText(body_text, 'plain', 'utf-8'))
    msg.attach(MIMEText(body_html, 'html', 'utf-8'))
    try:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=ctx) as server:
            server.login(user, password)
            server.sendmail(user, [to_email], msg.as_string())
            print(f'[OK] {to_email}')
            return True
    except Exception as e:
        print(f'[FAIL] {to_email}: {e}')
        return False

# Round 2 targets (from pr-reviewer-pending.md)
targets = [
    ("dan.abramov@me.com", "facebook/react", "Dan Abramov", "386 open PRs"),
    ("sebastian.silbermann@vercel.com", "facebook/react", "Sebastian", "386 open PRs"),
    ("mail@hendrik-liebau.de", "facebook/react", "Hendrik", "386 open PRs"),
    ("git@andrewclark.io", "facebook/react", "Andrew", "386 open PRs"),
    ("roblourens@gmail.com", "microsoft/vscode", "Rob", "1505 open PRs"),
    ("paul_wang347@hotmail.com", "microsoft/vscode", "Paul", "1505 open PRs"),
    ("hop2deep@gmail.com", "microsoft/vscode", "Hop", "1505 open PRs"),
    ("mkozuki@nvidia.com", "pytorch/pytorch", "Masashi", "many open PRs"),
    ("anijain@umich.edu", "pytorch/pytorch", "Anijit", "many open PRs"),
    ("nikita.shulga@gmail.com", "pytorch/pytorch", "Nikita", "many open PRs"),
    ("shinde.r.a@gmail.com", "mautic/mautic", "Rohan", "229 open PRs"),
]

# Round 3 new targets
round3 = [
    ("ezhulenev@openxla.org", "tensorflow/tensorflow", "Eugene", "3140 open PRs"),
    ("mayank.kumar.raunak@intel.com", "tensorflow/tensorflow", "Mayank", "3140 open PRs"),
]

all_targets = targets + round3

html_template = """
<p>Hi {name},</p>
<p>I noticed <a href="https://github.com/{repo}">{repo}</a> has <strong>{pr_count}</strong> open PRs.</p>
<p>I built a free AI tool that reviews PRs for bugs, security issues, and code quality — <a href="{page}">live demo here</a>.</p>
<p>Would love your feedback. Happy to add any patterns specific to {repo}.</p>
<p>Best,<br>Yitong</p>
"""

text_template = """Hi {name},

I noticed {repo} has {pr_count} open PRs.

I built a free AI tool that reviews PRs for bugs, security issues, and code quality: {page}

Would love your feedback. Happy to add any patterns specific to {repo}.

Best,
Yitong
"""

results = []
for (email, repo, name, pr_count) in all_targets:
    subject = f"Free AI PR Review for {repo} ({pr_count})"
    html = html_template.format(name=name, repo=repo, pr_count=pr_count, page=LANDING_PAGE)
    text = text_template.format(name=name, repo=repo, pr_count=pr_count, page=LANDING_PAGE)
    ok = send_email(email, subject, html, text)
    results.append({"to": email, "repo": repo, "subject": subject, "status": "ok" if ok else "failed"})
    import time; time.sleep(1.5)

with open('C:/Users/Administrator/.openclaw/workspace/outreach/pr-reviewer-r2-fixed.json', 'w') as f:
    json.dump(results, f, indent=2)
print("Done. Results saved.")
