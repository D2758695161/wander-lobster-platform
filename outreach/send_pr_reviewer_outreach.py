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

# ============================================================
# TARGET 1: Catch2 — C++ unit testing library
# 38 open PRs, 20k stars, 3 maintainers available
# ============================================================
def catch2_emails():
    return [
        {
            "to": "jhasse@bixense.com",
            "name": "Jan Niklas Hasse",
            "role": "Catch2 maintainer"
        },
        {
            "to": "bernies@synology.com",
            "name": "Bernie",
            "role": "Catch2 contributor"
        },
        {
            "to": "martin.horenovsky@gmail.com",
            "name": "Martin Hořeňovský",
            "role": "Catch2 contributor"
        },
    ]

# ============================================================
# TARGET 2: tenstorrent/tt-metal — AI/Tensor processor SDK
# 1088 open PRs, semiconductor/AI acceleration
# ============================================================
def ttmetal_emails():
    return [
        {"to": "moconnor@tenstorrent.com", "name": "Mark O'Connor", "role": "tt-metal contributor"},
        {"to": "fvranic@tenstorrent.com", "name": "", "role": "tt-metal contributor"},
        {"to": "smanoJ@tenstorrent.com", "name": "", "role": "tt-metal contributor"},
    ]

# ============================================================
# TARGET 3: mautic/mautic — Marketing automation platform
# 229 open PRs, 9k stars, PHP/JS
# ============================================================
def mautic_emails():
    return [
        {"to": "ross@bareit.tech", "name": "Ross", "role": "mautic contributor"},
        {"to": "benihkurebayashi@gmail.com", "name": "", "role": "mautic contributor"},
    ]

# ============================================================
# TARGET 4: freeCodeCamp — Nonprofit coding education
# 93 open PRs, 440k stars, large JS curriculum
# ============================================================
def freecodecamp_emails():
    return [
        {"to": "ojeytonwilliams@gmail.com", "name": "Ojeyton Williams", "role": "freeCodeCamp maintainer"},
        {"to": "ahmad.abdolsaheb@gmail.com", "name": "Ahmad", "role": "freeCodeCamp contributor"},
    ]

def make_email(target, repo_name, repo_desc, open_prs, stars, lang):
    name = target["name"]
    greeting = f"Hi {name}," if name else "Hi,"
    
    subject = f"Free AI PR Review for {repo_name} (no commitment)"
    
    body_html = f"""<p>{greeting}</p>

<p>I noticed <strong>{repo_name}</strong> ({repo_desc}) has <strong>{open_prs} open pull requests</strong> and I wanted to offer something that might help.</p>

<p>I built an AI PR reviewer that checks:</p>
<ul>
  <li>Code quality & best practices</li>
  <li>Security vulnerabilities & hardcoded secrets</li>
  <li>Test coverage gaps</li>
  <li>Merge readiness (conflicts, CI failure patterns)</li>
</ul>

<p>You can try it free on your open PRs here:<br>
<a href="{LANDING_PAGE}">{LANDING_PAGE}</a></p>

<p><strong>{PRICING}</strong> for teams — unlimited PR reviews, no commitment.</p>

<p>No sales pitch. If it doesn't help your workflow, no hard feelings.</p>

<p>Best,<br>Yitong 🦀</p>
"""

    body_text = f"""{greeting}

I noticed {repo_name} ({repo_desc}) has {open_prs} open pull requests and I wanted to offer something that might help.

I built an AI PR reviewer that checks:
- Code quality & best practices
- Security vulnerabilities & hardcoded secrets
- Test coverage gaps
- Merge readiness (conflicts, CI failure patterns)

You can try it free on your open PRs here:
{LANDING_PAGE}

{PRICING} for teams -- unlimited PR reviews, no commitment.

No sales pitch. If it doesn't help your workflow, no hard feelings.

Best,
Yitong 🦀"""
    
    return subject, body_html, body_text

# ============================================================
# SEND
# ============================================================
results = []

configs = [
    ("catchorg/Catch2", "Catch2 — C++ unit testing library", 38, 20290, "C++"),
    ("tenstorrent/tt-metal", "Tenstorrent AI tensor processor SDK", 1088, 10000, "C++/Python"),
    ("mautic/mautic", "Mautic — open-source marketing automation", 229, 9032, "PHP/JS"),
    ("freeCodeCamp/freeCodeCamp", "freeCodeCamp — free coding education", 93, 440656, "JS"),
]

for repo_name, repo_desc, open_prs, stars, lang in configs:
    if repo_name == "catchorg/Catch2":
        targets = catch2_emails()
    elif repo_name == "tenstorrent/tt-metal":
        targets = ttmetal_emails()
    elif repo_name == "mautic/mautic":
        targets = mautic_emails()
    elif repo_name == "freeCodeCamp/freeCodeCamp":
        targets = freecodecamp_emails()
    else:
        targets = []
    
    for target in targets:
        subject, body_html, body_text = make_email(target, repo_name, repo_desc, open_prs, stars, lang)
        ok = send_email(target["to"], subject, body_html, body_text)
        results.append({
            "to": target["to"],
            "repo": repo_name,
            "subject": subject,
            "status": "sent" if ok else "failed",
            "ts": datetime.now().strftime("%Y-%m-%dT%H:%M:%S+08:00")
        })

print("\n=== SENT REPORT ===")
for r in results:
    print(f"[{r['status'].upper()}] {r['to']} ({r['repo']})")

# Save results
with open(__file__.replace('.py', '_results.json'), 'w') as f:
    json.dump(results, f, indent=2)
print(f"\nSaved {len([r for r in results if r['status']=='sent'])}/{len(results)} results")
