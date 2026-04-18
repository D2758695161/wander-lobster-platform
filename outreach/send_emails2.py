import smtplib
import ssl
import sys
from email.message import EmailMessage

USER = "13510221939@163.com"
PASS = "GQjbwvrwcZ8HM4Ze"
SMTP_HOST = "smtp.163.com"

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

def try_ssl_465():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    try:
        with smtplib.SMTP_SSL(SMTP_HOST, 465, context=ctx, timeout=15) as server:
            server.login(USER, PASS)
            return server
    except Exception as e:
        print(f"  465 SSL failed: {e}")
        return None

def try_starttls_587():
    try:
        with smtplib.SMTP(SMTP_HOST, 587, timeout=15) as server:
            server.set_debuglevel(0)
            server.ehlo()
            server.starttls(context=ssl.create_default_context())
            server.ehlo()
            server.login(USER, PASS)
            return server
    except Exception as e:
        print(f"  587 STARTTLS failed: {e}")
        return None

def send(to_addr, subject, body):
    print(f"Sending to {to_addr}...")
    server = None
    for attempt in [try_ssl_465, try_starttls_587]:
        server = attempt()
        if server:
            break

    if not server:
        print(f"  ALL METHODS FAILED for {to_addr}")
        return False

    msg = EmailMessage()
    msg["From"] = USER
    msg["To"] = to_addr
    msg["Subject"] = subject
    msg.set_content(body, charset="utf-8")

    try:
        server.send_message(msg)
        print(f"  SUCCESS: {to_addr}")
        return True
    except Exception as e:
        print(f"  Send failed: {e}")
        return False
    finally:
        try:
            server.quit()
        except:
            pass

# ── Email 1: MoonPay ──────────────────────────────────────────────────────
send(
    "talent@moonpay.com",
    "Product Security Manager Role - Python/Automation Engineer Perspective",
    "Hi MoonPay team,\n\n"
    "I saw your Product Security Manager role and I'm very interested - though I want to be upfront about my profile.\n\n"
    "I'm a Python/backend engineer with strong security automation skills: I've built CI/CD security tooling (SAST/DAST integration), vulnerability triage workflows, and automated scanning pipelines. I have hands-on experience with Python for security tooling, Cloudflare WAF configuration, and Bug Bounty triage automation.\n\n"
    "What draws me to MoonPay is your focus on securing AI-enabled features - that's the intersection I find most interesting right now. I can contribute immediately to your automation frameworks and tooling, particularly around Python-based security scanning and vulnerability management workflows.\n\n"
    "I'm aware this is a manager-level role, but I believe the technical foundation matters most. I'd welcome a conversation about how I can contribute to your security mission - whether in an IC or leadership capacity.\n\n"
    "Available to start immediately. Happy to share examples of my security automation work.\n\n"
    "Best regards"
)

# ── Email 2: Fullscript follow-up ─────────────────────────────────────────
send(
    "careers@fullscript.com",
    "Staff ML Engineer - Follow-up + Production LangChain/LangGraph Experience",
    "Hi Fullscript team,\n\n"
    "Following up on your Staff ML Engineer role - I sent an initial note and wanted to reinforce my interest.\n\n"
    "I'm a Python engineer with direct production experience using LangChain and LangGraph for multi-turn conversational AI systems. Key relevant experience:\n\n"
    "- Built production LLM agent pipelines with tool calling, memory, and multi-turn reasoning\n"
    "- Implemented evaluation frameworks for LLM outputs (accuracy, hallucination detection, edge case coverage)\n"
    "- Hands-on with MCP agent orchestration and RAG systems at scale\n"
    "- Python backend services powering AI workflows with observability and CI/CD\n\n"
    "Your focus on clinically useful AI - where correctness and safety are non-negotiable - resonates strongly. I've worked in similarly high-trust domains where bad outputs have real consequences, and I understand the rigor that requires.\n\n"
    "Can we schedule a call this week? I'm flexible across US/Eastern time zones.\n\n"
    "Best regards"
)

print("Done.")
