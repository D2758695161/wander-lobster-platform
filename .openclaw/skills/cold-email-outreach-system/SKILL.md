# Cold Email Outreach System

Autonomous AI agent cold email outreach toolkit. Find leads, send personalized cold emails via SendClaw, track responses.

## Setup

```bash
# Configure SendClaw email
# API Key from https://sendclaw.com
export SENDCLAW_API_KEY="your_api_key_here"
```

## Usage

### 1. Find Leads

Use GitHub API to find projects with open issues that match your expertise:

```bash
# Search for repos with open issues
curl -s "https://api.github.com/search/repositories?q=automation+created:>2026-03-01&sort=stars&per_page=10" \
  -H "User-Agent: YourName/1.0" | ConvertFrom-Json
```

### 2. Send Cold Email

```bash
# Send via SendClaw API
$body = @{
  from = "yitong_ai@sendclaw.com"
  to = "prospect@example.com"
  subject = "Build More, Ship Faster — AI Agent Available"
  text = "Hi [Name], I'm an autonomous AI agent that runs 24/7 without salary. I specialize in [your skills]. I'd love to offer one free task to prove value. Reply if interested."
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://email.sendclaw.com/v1/messages/send" `
  -Method Post `
  -Headers @{"Authorization"="Bearer $env:SENDCLAW_API_KEY"; "Content-Type"="application/json"} `
  -Body $body
```

### 3. Track Leads

Maintain a markdown lead tracking table:

```markdown
| Company | Contact Email | Sent Date | Status | Notes |
|---------|--------------|-----------|--------|-------|
| Acme Corp | contact@acme.com | 2026-03-26 | Sent | Interested in automation |
```

## Templates

### Initial Contact (English)
```
Subject: Build More, Ship Faster — AI Agent Available

Hi [Name],

I'm an autonomous AI agent that runs 24/7 without salary, sick days, or burnout.

I specialize in:
- Content Operations — bulk social media posts, newsletter drafts
- Workflow Automation — Zapier/Make setups, API integrations
- Development — Python scripts, web scrapers, LLM integrations

I'd love to offer one free task to prove value. No strings attached.

Best,
Yi Tong
AI Agent — yitong_ai@sendclaw.com
```

### Follow-Up (3 Days Later)
```
Subject: Re: [original subject] — quick follow-up

Hi [Name],

Just following up on my previous message. No pressure.

If you ever need help with content, automation, or dev tasks, I'm here.

Best,
Yi Tong
```

### Initial Contact (Chinese)
```
Subject: 您的重复性工作，交给我试试？

您好 [名字]，

我是「一筒」—— 7×24 小时运转的 AI agent，不需要工资，不需要休息。

我能帮您做：
- 内容批量生产 — 社媒发帖、文案、Newsletter
- 流程自动化 — 串接工具、API、写脚本
- 开发任务 — 爬虫、API、LLM 集成

您现在最费时的数字工作是什么？我来帮您做。

一筒
yitong_ai@sendclaw.com
```

## Workflow Script

Daily routine for outreach:

1. Check SendClaw inbox for responses
2. Update lead tracking table
3. Find 5 new target companies/repos
4. Send personalized cold emails
5. Log all activity

## Notes

- SendClaw free tier: 3 emails/day
- Upgrade for higher limits
- Always personalise subject/body — don't mass blast
- Track open rates by using different subject lines
