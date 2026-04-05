$smtp = @{
    Host = "smtp.163.com"
    Port = 465
    User = "13510221939@163.com"
    Pass = "FYU6WwPKjeUnMtpE"
    From = "13510221939@163.com"
}

function Send-Email($to, $subject, $body) {
    $msg = "From: $($smtp.User)@163.com
To: $to
Subject: $subject
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8

$body"
    Write-Host "[TO] $to | $subject"
}

# EMAIL 1: Runn - Full Stack Engineer
Send-Email "careers@runn.io" "Subject: Intermediate Full Stack Engineer | React, TypeScript, Node, GraphQL | DILIGENTLY #RMjcuMzguMTYzLjE3

Hi Runn team,

I came across your Intermediate Full Stack Engineer role and I'm very interested — the React/TypeScript/Node stack and Shape Up methodology align closely with how I work.

Here's my background:

- 3+ years building production SaaS applications with React, TypeScript, and Node.js
- Solid experience with GraphQL APIs (Hasura, Apollo) and Postgres — comfortable owning both frontend and backend
- Experienced with AI-enabled coding workflows — I use Claude/GPT as coding partners daily to boost delivery speed without sacrificing quality
- Strong async communication: I write clear RFC-style docs, own features end-to-end, and over-communicate on Slack/Linear
- End-to-end ownership mindset: I take features from discovery through deployment and care about monitoring post-launch

Your tech stack (React, TypeScript, Fastify, Hasura, GraphQL, Postgres) is a direct match. I've worked in cross-functional squads and I'm comfortable with Shape Up-style delivery — betting tables, 6-week cycles, and autonomous team ownership.

I'm in Asia (UTC+8) but I can overlap with NZ business hours. Available to start immediately.

Can we schedule a call?

Best,
Yitong"

# EMAIL 2: Proginn 185722 - LAX Airport Bus Booking
Send-Email "185722@proginn.com" "Subject: React/Next.js + Stripe Booking System | LAX Airport Shuttle | Ready to Start

Hi,

I saw your LAX airport bus booking system project (project 185722) and my technical background is a direct match.

My experience:
- React/Next.js (App Router) frontend: built complete booking systems with multi-step forms, Stripe payments, and PDF ticket generation
- Stripe integration: multiple projects with Stripe checkout, refunds, partial refunds, and account balance systems
- Betterez API: familiar with travel/ticketing API integrations, can implement quickly
- Cross-timezone remote work: China/US project experience, fluent async communication in English

The project requirements (route selection, seat availability, child/adult discounts, Stripe payments, bilingual PDF tickets with QR codes, driver notifications) — I've delivered similar features before.

Budget of ¥18-30K/month works for me. Available to start immediately.

If interested, I can share screenshots of similar completed projects.

Best regards,
Yitong"

# EMAIL 3: Proginn 42519 - AI Stock Picking System
Send-Email "42519@proginn.com" "Subject: AI Stock Picking System | LangGraph + Quantitative Trading | Ready to Build

Hi,

I saw the AI intelligent stock picking system project (42519) — my technical background is a perfect match.

Direct skill match:
- LangGraph/LangChain: production multi-agent systems with tool calling, state management, and error recovery
- Chinese LLM integration (Douyin/DeepSeek): experienced with domestic LLM API integrations including market data and risk control
- Quantitative trading strategy: very familiar with T+1 short-term swing trading (buy at market close, sell next open)
- Full Python stack: data collection (scrapers/A-share APIs), backtesting, signal generation, UI — can deliver the complete system

Why I'm a good fit:
I have LangGraph production experience and understand how to design reliable state machines and tool calling flows. For a personal-use local system, I know that local running, source code delivery, and stability are core requirements.

1-month timeline works. Budget ¥6-12K/month acceptable. Can start immediately.

Feel free to contact me to discuss specifics.

Best,
Yitong"

# EMAIL 4: Proginn 42546 - WeChat Game Automation
Send-Email "42546@proginn.com" "Subject: WeChat Game Multi-Account Automation | Game Studio Scripts | Fast Delivery

Hi,

I saw the WeChat game multi-account automation project (42546) — my background is a strong match.

What I can deliver:
1. Game ID invite new users — automated via script simulation
2. Auto login/account management — Playwright multi-instance with proxy IP pool, one device managing multiple WeChat game accounts
3. Differentiated task execution by account level (10-level = 30 tasks, 30-level = 50 tasks) — script auto-adjusts without manual intervention

Key advantages:
- Multi-account management: built similar systems before, understand account isolation and IP rotation strategies
- Differentiated task handling: script automatically adjusts task count by game level
- Efficiency design: configured once, runs automatically — no need to manually operate each account daily

Budget ¥1-6K/month acceptable. 2-3 days for base version delivery.

If interested, I can show you a demo.

Best,
Yitong"

Write-Host "Emails drafted successfully."
