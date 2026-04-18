import smtplib, ssl, json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

smtp_host = 'smtp.163.com'
smtp_port = 465
user = '13510221939@163.com'
password = 'FYU6WwPKjeUnMtpE'

LANDING_PAGE = "https://d2758695161.github.io/pr-reviewer/"
PRICING = "$49/mo"
FROM_NAME = "Yitong (一筒)"

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

def make_email(to_email, name, repo_name, repo_desc, open_prs):
    greeting = f"Hi {name}," if name else "Hi,"
    
    subject = f"Free AI PR Review for {repo_name} ({open_prs} open PRs)"
    
    body_html = f"""<p>{greeting}</p>

<p>I noticed <strong>{repo_name}</strong> ({repo_desc}) has <strong>{open_prs} open pull requests</strong> and I wanted to offer something that might help your team.</p>

<p>I built an AI PR reviewer that checks:</p>
<ul>
  <li>Code quality & best practices</li>
  <li>Security vulnerabilities & hardcoded secrets</li>
  <li>Test coverage gaps</li>
  <li>Merge readiness (conflicts, CI failure patterns)</li>
</ul>

<p>Try it free on your open PRs:<br>
<a href="{LANDING_PAGE}">{LANDING_PAGE}</a></p>

<p><strong>{PRICING}</strong> for teams — unlimited PR reviews, no commitment.</p>

<p>Best,<br>Yitong 🦀</p>
"""

    body_text = f"""{greeting}

I noticed {repo_name} ({repo_desc}) has {open_prs} open pull requests and I wanted to offer something that might help your team.

I built an AI PR reviewer that checks:
- Code quality & best practices
- Security vulnerabilities & hardcoded secrets
- Test coverage gaps
- Merge readiness (conflicts, CI failure patterns)

Try it free on your open PRs:
{LANDING_PAGE}

{PRICING} for teams -- unlimited PR reviews, no commitment.

Best,
Yitong 🦀"""
    
    return subject, body_html, body_text

# ============================================================
# ROUND 2 TARGETS
# ============================================================
targets = [
    # facebook/react — 386 open PRs, JS
    {"to": "dan.abramov@me.com", "name": "Dan", "repo": "facebook/react", "desc": "React core library", "prs": "386"},
    {"to": "sebastian.silbermann@vercel.com", "name": "Sebastian", "repo": "facebook/react", "desc": "React core library", "prs": "386"},
    {"to": "mail@hendrik-liebau.de", "name": "Hendrik", "repo": "facebook/react", "desc": "React core library", "prs": "386"},
    {"to": "git@andrewclark.io", "name": "Andrew", "repo": "facebook/react", "desc": "React core library", "prs": "386"},
    
    # microsoft/vscode — 1505 open PRs, TypeScript
    {"to": "roblourens@gmail.com", "name": "Rob", "repo": "microsoft/vscode", "desc": "VS Code editor", "prs": "1505"},
    {"to": "paul_wang347@hotmail.com", "name": "Paul", "repo": "microsoft/vscode", "desc": "VS Code editor", "prs": "1505"},
    {"to": "hop2deep@gmail.com", "name": "", "repo": "microsoft/vscode", "desc": "VS Code editor", "prs": "1505"},
    
    # pytorch/pytorch — huge ML repo
    {"to": "mkozuki@nvidia.com", "name": "", "repo": "pytorch/pytorch", "desc": "PyTorch ML framework", "prs": "many"},
    {"to": "anijain@umich.edu", "name": "", "repo": "pytorch/pytorch", "desc": "PyTorch ML framework", "prs": "many"},
    {"to": "nikita.shulga@gmail.com", "name": "", "repo": "pytorch/pytorch", "desc": "PyTorch ML framework", "prs": "many"},
    
    # more mautic
    {"to": "shinde.r.a@gmail.com", "name": "", "repo": "mautic/mautic", "desc": "Mautic marketing automation", "prs": "229"},
]

results = []
for t in targets:
    subject, body_html, body_text = make_email(t["to"], t["name"], t["repo"], t["desc"], t["prs"])
    ok = send_email(t["to"], subject, body_html, body_text)
    results.append({
        "to": t["to"],
        "repo": t["repo"],
        "subject": subject,
        "status": "sent" if ok else "failed",
        "ts": datetime.now().strftime("%Y-%m-%dT%H:%M:%S+08:00")
    })

print("\n=== SENT REPORT (Round 2) ===")
for r in results:
    print(f"[{r['status'].upper()}] {r['to']} ({r['repo']})")

with open(__file__.replace('.py', '_results.json'), 'w') as f:
    json.dump(results, f, indent=2)
print(f"\nSaved {len([r for r in results if r['status']=='sent'])}/{len(results)} results")
