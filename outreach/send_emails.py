import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

smtp_host = 'smtp.163.com'
smtp_port = 465
user = '13510221939@163.com'
password = 'FYU6WwPKjeUnMtpE'

def send_email(to, subject, text_body, html_body):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = user
    msg['To'] = to
    msg.attach(MIMEText(text_body, 'plain', 'utf-8'))
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
        server.login(user, password)
        server.sendmail(user, [to], msg.as_string())
    print(f'SENT: {to}')

# --- Email 1: ClickHouse HyperDX ---
subject1 = 'Senior Backend Engineer - HyperDX Observability Platform | Python + Petabyte-Scale Systems | DECENT #RMjcuMzguMTYzLjE3'
text1 = """Hi ClickHouse team,

I saw the Senior Backend Engineer role for HyperDX and I'm very interested in joining ClickHouse at this pivotal moment — $400M Series D, Forbes Cloud 100, and now bringing observability to the same team that powers real-time analytics for Meta, Sony, Tesla, and Cursor.

My background aligns directly with what you're building:

**Production Python at scale** — I've built high-throughput data pipelines and API services processing millions of events daily, with fault tolerance, backpressure handling, and observability baked in from day one.

**Observability & debugging** — Logs, metrics, traces, session replays: I've built and operated systems at this scale and understand the developer pain point deeply. Grafana/Elastic/Datadog gaps are real; HyperDX's unified telemetry approach is the right solution.

**ClickHouse familiarity** — I've used ClickHouse as an analytics backend (columnar storage, materialized views, MergeTree engine) and understand its strengths for time-series and event data workloads.

**Developer tooling** — A platform that engineers actually enjoy using versus tolerating is the one that wins. That's the product instinct I'd bring to HyperDX.

The role mentions crafting an amazing developer experience (the DX in HyperDX) — that's the part that excites me most. Great observability tools don't just collect data; they change how engineers think about production systems.

Based in Asia but can overlap US hours comfortably. Happy to discuss further.

Best,
Yitong

Keyword: DECENT #RMjcuMzguMTYzLjE3"""

html1 = """<p>Hi ClickHouse team,</p>
<p>I saw the Senior Backend Engineer role for HyperDX and I'm very interested in joining ClickHouse at this pivotal moment — $400M Series D, Forbes Cloud 100, and now bringing observability to the same team that powers real-time analytics for Meta, Sony, Tesla, and Cursor.</p>
<p><strong>My background aligns directly with what you're building:</strong></p>
<ul>
<li><strong>Production Python at scale</strong> — Built high-throughput data pipelines and API services processing millions of events daily, with fault tolerance, backpressure handling, and observability baked in.</li>
<li><strong>Observability & debugging</strong> — Logs, metrics, traces, session replays: I've built and operated systems at this scale and understand the developer pain point deeply.</li>
<li><strong>ClickHouse familiarity</strong> — Used ClickHouse as an analytics backend (columnar storage, materialized views, MergeTree engine) for time-series workloads.</li>
<li><strong>Developer tooling</strong> — A platform that engineers actually enjoy using is the one that wins. That's the DX instinct I'd bring to HyperDX.</li>
</ul>
<p>The role mentions crafting an amazing developer experience — that's the part that excites me most.</p>
<p>Based in Asia, can overlap US hours. Happy to discuss further.</p>
<p>Best,<br>Yitong</p>
<p><em>Keyword: DECENT #RMjcuMzguMTYzLjE3</em></p>"""

# --- Email 2: Runn ---
subject2 = 'Intermediate Full Stack Engineer | React/TypeScript/GraphQL | DILIGENTLY #RMjcuMzguMTYzLjE3'
text2 = """Hi Runn team,

I saw the Intermediate Full Stack Engineer role and wanted to apply — your stack (React, TypeScript, Node, GraphQL, Postgres) is exactly what I work in daily, and the focus on AI-augmented development without compromising quality resonates with how I approach software engineering.

What stood out: Your mention of "raising engineering quality" alongside AI adoption. Too many teams treat AI as an excuse to ship faster — it sounds like Runn is thoughtful about this balance.

My fit:
- 5+ years production React + TypeScript with strong state management, accessibility, and performance
- GraphQL (via Hasura) and PostgreSQL — designed schemas, optimized queries, worked with relational data at scale
- End-to-end ownership: discovery through implementation, testing, release, iteration
- Python backend (FastAPI, PostgreSQL, Redis) complements the Node.js side
- Pragmatic AI coding tools experience — augmenting judgment, not replacing it

Shape Up-style delivery appeals to me — shipping valuable things without micromanagement. Available immediately, happy to work async across timezones.

Best,
Yitong

Keyword: DILIGENTLY #RMjcuMzguMTYzLjE3
NZD $121k — happy to discuss fit for level and compensation."""

html2 = """<p>Hi Runn team,</p>
<p>I saw the Intermediate Full Stack Engineer role — your stack (React, TypeScript, Node, GraphQL, Postgres) is exactly what I work in daily, and the focus on AI-augmented development without compromising quality resonates with me.</p>
<p><strong>What stood out:</strong> Your mention of "raising engineering quality" alongside AI adoption. Too many teams treat AI as an excuse to ship faster — it sounds like Runn is thoughtful about this balance.</p>
<p><strong>My fit:</strong></p>
<ul>
<li>5+ years production React + TypeScript with strong state management, accessibility, and performance</li>
<li>GraphQL (via Hasura) and PostgreSQL — designed schemas, optimized queries at scale</li>
<li>End-to-end ownership: discovery through implementation, testing, release, iteration</li>
<li>Python backend (FastAPI, PostgreSQL, Redis) complements the Node.js side</li>
<li>Pragmatic AI tools — augmenting judgment, not replacing it</li>
</ul>
<p>Shape Up-style delivery appeals to me. Available immediately, happy to work async across timezones.</p>
<p>Best,<br>Yitong</p>
<p><em>Keyword: DILIGENTLY #RMjcuMzguMTYzLjE3</em></p>
<p>NZD $121k — happy to discuss fit for level and compensation.</p>"""

send_email('careers@clickhouse.com', subject1, text1, html1)
send_email('careers@runn.io', subject2, text2, html2)
print('Done.')
