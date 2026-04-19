// Outreach script - 2026-04-16 evening session
// SMTP: smtp.163.com:465, user: 13510221939@163.com, pass: TLfTvAJBC8QKxxre (ACTIVE)

const nodemailer = require('nodemailer');
const https = require('https');

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: { user: '13510221939@163.com', pass: 'TLfTvAJBC8QKxxre' },
  connectionTimeout: 15000,
  greetingTimeout: 15000
});

const leads = [
  {
    to: 'founder@zama.ai',
    subject: 'FHE + LangGraph Agent | Python Engineer Interested in TFHE-rs Bounty | Yitong',
    body: `Hi Zama team,

I'm Yitong — a Python/LangGraph engineer with Rust experience, writing to express interest in the TFHE-rs bounty program.

I've been building production multi-agent systems with LangGraph, including:
- Multi-agent customer service (3 sub-agents) with MCP tool calling at scale
- LLM eval framework with Databricks/MLflow + pairwise comparison scoring
- Production Python backend (FastAPI + asyncio + Redis) for AI workloads

FHE is a fascinating space — the combination of confidential computing + LLM inference is exactly the kind of hard problem I enjoy. I've been following the Concrete Stack for a while and the tfhe-rs API design is impressive.

I'm particularly interested in the Fixed-point Arithmetic API bounty and Confidential Benchmarking challenges — both feel like natural fits for someone who thinks about numerical stability in ML pipelines.

I can commit 20+ hours/week to bounty work. Are there any current Season 8 bounties you'd recommend for someone with my profile?

GitHub: looking to contribute actively starting immediately.

Best,
Yitong`,
    notes: 'Zama AI FHE bounty program - high budget (€500-€16,750+), Rust+Python, FHE niche'
  },
  {
    to: 'bounty@midnight.network',
    subject: 'LangGraph Agent Tutorial + Compact Language | Midnight Tutorial Bounty | Yitong',
    body: `Hi Midnight team,

I'm Yitong — a Python/AI agent engineer with LangGraph production experience, writing about the tutorial bounties in your contributor hub.

I run a production multi-agent system built on LangGraph with:
- Multi-agent orchestration (3+ sub-agents) with tool calling
- LLM eval pipeline + red-teaming framework
- FastAPI + asyncio backend for AI workloads

I saw several open bounties and I'm particularly interested in:
1. "Unshielded Token dApp with UI" (Tier 1, $300-500) — can build a clean React + Compact demo
2. "SDK Breaking Changes Upgrade Playbook" (Tier 1, $300-500) — documentation work I can do alongside the code

I'm also happy to contribute a "Building a LangGraph Agent on Midnight" tutorial if that's within scope — would be a strong fit given my production LangGraph experience and would attract a different developer audience to Midnight.

Budget: $300-$1,000 NIGHT per tutorial
Time available: 15-20 hours/week

Interested? Happy to start immediately.

Best,
Yitong`,
    notes: 'Midnight Network tutorial bounties - $300-$1,000 NIGHT per tutorial, Compact/TypeScript/React, LangGraph tutorial proposal'
  }
];

async function sendEmails() {
  for (const lead of leads) {
    try {
      const info = await transporter.sendMail({
        from: '"Yitong" <13510221939@163.com>',
        to: lead.to,
        subject: lead.subject,
        text: lead.body
      });
      console.log(`SENT to ${lead.to}`);
      console.log(`  MessageId: ${info.messageId}`);
      console.log(`  Notes: ${lead.notes}`);
    } catch (err) {
      console.log(`FAILED to ${lead.to}: ${err.message}`);
    }
  }
  console.log('DONE');
  process.exit(0);
}

sendEmails();
