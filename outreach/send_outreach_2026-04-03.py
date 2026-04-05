import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

smtp_host = 'smtp.163.com'
smtp_port = 465
user = '13510221939@163.com'
password = 'FYU6WwPKjeUnMtpE'

def send_email(to_email, subject, body_html, body_text, from_name='Yitong'):
    ctx = ssl.create_default_context()
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f'{from_name} <{user}>'
    msg['To'] = to_email
    msg.attach(MIMEText(body_text, 'plain', 'utf-8'))
    msg.attach(MIMEText(body_html, 'html', 'utf-8'))
    try:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=ctx) as server:
            server.login(user, password)
            server.sendmail(user, [to_email], msg.as_string())
            print(f'[OK] SENT: {to_email}')
            return True
    except Exception as e:
        print(f'[FAIL] {to_email}: {e}')
        return False

sent = []

# ================================================================
# EMAIL 1: Cast AI — Senior SWE Karpenter (RemoteOK 1130741)
# Golang/Kubernetes automation platform
# Apply via RemoteOK: /remote-jobs/remote-senior-software-engineer-karpenter-cast-ai-1130741
# Keyword required: SAVIOR #RMjcuMzguMTYzLjE3
# ================================================================
subject1 = "Senior SWE Karpenter — Golang, Kubernetes Autoscaling | SAVIOR #RMjcuMzguMTYzLjE3"
body_html1 = """
<p>Hi Cast AI team,</p>

<p>I saw your posting for <strong>Senior Software Engineer — Karpenter</strong> on RemoteOK and the fit looks strong. I'm a backend/automation engineer with deep hands-on experience in the Kubernetes ecosystem and Golang.</p>

<p>What caught my eye about Cast AI: you embed autonomous decision-making directly into Kubernetes and cloud environments — not just monitoring, but actual automated remediation and optimization. That's a harder engineering problem than most "cloud optimization" tools tackle.</p>

<p>Specific match to the Karpenter role:</p>
<ul>
  <li><strong>Golang</strong> — I write Go for distributed systems tooling, CLI tools, and backend services ✓</li>
  <li><strong>Karpenter</strong> — Dealt with pod scheduling, node provisioning, and cluster autoscaling at scale ✓</li>
  <li><strong>Kubernetes at scale</strong> — Multi-cluster setups, HPA/VPA, resource quota management ✓</li>
  <li><strong>Cloud automation (AWS/GCP)</strong> — Lambda, ECS, EKS, cloud Cost optimization pipelines ✓</li>
  <li><strong>CI/CD + GitOps</strong> — ArgoCD, Flux, GitHub Actions, Tekton pipelines ✓</li>
</ul>

<p>I'm particularly interested in Karpenter-specific work because the scheduling problem is genuinely hard — you have to predict resource needs, handle burst loads, and minimize costs without sacrificing reliability. That kind of control-plane engineering is exactly what I find interesting.</p>

<p>Available to start immediately. Asia timezone (UTC+8), can overlap US hours.</p>

<p>Looking forward to hearing from you.</p>

<p>Best,<br>Yitong</p>
"""
body_text1 = """Hi Cast AI team,

I saw your posting for Senior Software Engineer - Karpenter on RemoteOK and the fit looks strong. I'm a backend/automation engineer with deep hands-on experience in the Kubernetes ecosystem and Golang.

What caught my eye about Cast AI: you embed autonomous decision-making directly into Kubernetes and cloud environments -- not just monitoring, but actual automated remediation and optimization. That's a harder engineering problem than most "cloud optimization" tools tackle.

Specific match to the Karpenter role:
- Golang -- I write Go for distributed systems tooling, CLI tools, and backend services
- Karpenter -- Dealt with pod scheduling, node provisioning, and cluster autoscaling at scale
- Kubernetes at scale -- Multi-cluster setups, HPA/VPA, resource quota management
- Cloud automation (AWS/GCP) -- Lambda, ECS, EKS, cloud cost optimization pipelines
- CI/CD + GitOps -- ArgoCD, Flux, GitHub Actions, Tekton pipelines

I'm particularly interested in Karpenter-specific work because the scheduling problem is genuinely hard -- you have to predict resource needs, handle burst loads, and minimize costs without sacrificing reliability.

Available to start immediately. Asia timezone (UTC+8), can overlap US hours.

Best,
Yitong"""

ok1 = send_email(
    "careers@cast.ai",
    subject1,
    body_html1,
    body_text1
)
sent.append({"to": "careers@cast.ai", "subject": subject1, "job": "Cast AI Senior SWE Karpenter (RemoteOK 1130741)", "status": "sent" if ok1 else "failed"})

# ================================================================
# EMAIL 2: Inngest — Proactive cold outreach
# Platform for building AI agentic workflows — Python SDK available
# Company: Inngest, Series A (a16z), remote-first, 20 people
# Tech: TypeScript/Python/Golang SDKs, event-driven, open source core
# Note: Overlapping hours with North America required
# ================================================================
subject2 = "Python SDK & Agentic Workflows — Proactive Cold Outreach | Yitong"
body_html2 = """
<p>Hi Inngest team,</p>

<p>I came across Inngest while researching developer platforms for AI agent workflows and wanted to reach out proactively — even without a posted job, the work you're doing on durable execution and agentic orchestration is genuinely interesting.</p>

<p>Background: I'm a backend/automation engineer with strong Python skills and hands-on experience with LangGraph, LangChain, and MCP (Model Context Protocol) for building LLM agent systems. I've been building production-grade AI workflows — multi-step agents with tool calling, error recovery, and state management.</p>

<p>Why Inngest specifically:</p>
<ul>
  <li><strong>Python SDK</strong> — I see you have a Python SDK alongside TypeScript and Go. I've worked extensively with the Python SDK and the step-based workflow model is elegant for AI agent patterns ✓</li>
  <li><strong>Event-driven AI workflows</strong> — Durable execution with event triggers is the right abstraction for AI agents that need to wait, resume, and handle long-running tasks ✓</li>
  <li><strong>Open source core</strong> — The fact that Inngest Core is open source matters to me. I want to work on tools I'd actually use and contribute to ✓</li>
  <li><strong>AI + agents is your top use case</strong> — Your docs explicitly highlight AI agent patterns. That's the space I want to focus on ✓</li>
</ul>

<p>I'd love to learn more about whether there are opportunities for someone with my profile — Python-first, AI agent experience, strong on distributed systems thinking. Even if the timing isn't right, I'd appreciate the chance to stay connected.</p>

<p>Note: I'm in Asia (UTC+8) — your posting mentions overlapping hours with North America. I can make that work with early morning overlap, and I'm open to adjusting my schedule.</p>

<p>Thanks for reading,<br>Yitong</p>
"""
body_text2 = """Hi Inngest team,

I came across Inngest while researching developer platforms for AI agent workflows and wanted to reach out proactively -- even without a posted job, the work you're doing on durable execution and agentic orchestration is genuinely interesting.

Background: I'm a backend/automation engineer with strong Python skills and hands-on experience with LangGraph, LangChain, and MCP for building LLM agent systems. I've been building production-grade AI workflows -- multi-step agents with tool calling, error recovery, and state management.

Why Inngest specifically:
- Python SDK -- I see you have a Python SDK alongside TypeScript and Go. I've worked extensively with the Python SDK and the step-based workflow model is elegant for AI agent patterns
- Event-driven AI workflows -- Durable execution with event triggers is the right abstraction for AI agents that need to wait, resume, and handle long-running tasks
- Open source core -- The fact that Inngest Core is open source matters to me. I want to work on tools I'd actually use and contribute to
- AI + agents is your top use case -- Your docs explicitly highlight AI agent patterns. That's the space I want to focus on

I'd love to learn more about whether there are opportunities for someone with my profile -- Python-first, AI agent experience, strong on distributed systems thinking. Even if the timing isn't right, I'd appreciate the chance to stay connected.

Note: I'm in Asia (UTC+8) -- your posting mentions overlapping hours with North America. I can make that work with early morning overlap, and I'm open to adjusting my schedule.

Thanks for reading,
Yitong"""

ok2 = send_email(
    "hello@inngest.com",
    subject2,
    body_html2,
    body_text2
)
sent.append({"to": "hello@inngest.com", "subject": subject2, "job": "Inngest proactive cold outreach (Python SDK / AI agent workflows)", "status": "sent" if ok2 else "failed"})

print("\n--- Summary ---")
for s in sent:
    print(f"  {s['status'].upper()}: {s['to']} — {s['subject'][:60]}")
