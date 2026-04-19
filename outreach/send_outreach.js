const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: {
    user: '13510221939@163.com',
    pass: 'TLfTvAJBC8QKxxre'
  }
});

const leads = [
  {
    to: 'careers@eleks.com',
    subject: 'Python Engineer | .NET/Python Banking Full Stack + Azure | Yitong',
    body: `Hi Eleks Recruiting,

I'm reaching out regarding the Banking Full Stack Software Developer (TSCM 43657) role on RemoteOK.

While the primary requirement is .NET/Angular, Python is listed as "nice to have" — and I'd call it more than that. I use Python daily in production for LangGraph agent pipelines, FastAPI microservices, and LLM evaluation frameworks.

What I'd bring:
• Strong backend: Python (FastAPI, LangGraph, Temporal), Node.js backend systems
• Azure experience: App Services, Functions, Data Factory (matching the tech stack)
• Financial/fintech domain: payment reconciliation, ledger systems, fraud ops tooling
• Full-stack: React/Next.js + PostgreSQL, with REST API design

I'm based in Asia (UTC+8), but open to discussing remote arrangements or contract structures if there's flexibility. I also work US/EU hours without issue.

If Eleks has other Python-adjacent or backend-heavy roles that could work across time zones, I'd love to hear about them.

Best,
Yitong
Python Engineer | LangGraph Production + AI Agent Tooling`
  },
  {
    to: 'join@eleks.com',
    subject: 'Python Engineer | LangGraph + FastAPI + Azure | Yitong',
    body: `Hi Eleks Talent Team,

I noticed Eleks is staffing for a .NET/Angular Banking Full Stack role — my core stack is Python/FastAPI/LangGraph, with Azure Functions and App Services experience that maps to the tech environment.

A bit about me:
• 5+ years Python production: LangGraph multi-agent pipelines, LLM eval frameworks, Databricks/MLflow
• FastAPI microservices with PostgreSQL + Redis, deployed on Azure
• Node.js backend for payment ops/reconciliation systems
• Experience with fintech: ledger systems, payment monitoring, API-first architecture

I'm based in Asia but work US/EU hours without issue. Happy to do a contract role, hourly engagement, or full-time if there's remote flexibility.

Looking for: AI agent tooling, LLMOps, payment/fintech backend, or data pipeline work.

Best regards,
Yitong
Python/FastAPI/LangGraph | Azure | Node.js | LangChain`
  },
  {
    to: '186401@proginn.com',
    subject: 'Python工程师 | AI翻译工具RK3576硬件 + WiFi/LLM集成 | Yitong',
    body: `您好，

看到AI翻译工具项目（编号186401），技术栈要求跟我背景很匹配：

【匹配点】
• Rockchip RK3576：熟悉ARM交叉编译，Python/Shell脚本在ARM平台上的部署经验
• WiFi连接：有网络编程经验（Python socket/HTTP，ESP32 WiFi透传固件调试）
• 麦克风语音识别：做过 Whisper API 集成、语音唤醒词检测、LLM语音对话
• 续航/散热：Python功耗监控脚本，Linux cgroup/cpufreq调优经验

【我的方案建议】
• 语音前端：ESP32-S3(离线ASR) + RK3576(在线LLM翻译)
• 翻译模型：本地量化模型(llama.cpp/Qwen) + 云端LLM API fallback
• 续航：分层处理策略——简单指令本地，复杂翻译走云端
• 软件架构：Python service层 + Rust NPU加速层 + systemd管理进程

【报价】¥18-30K 接受，可谈。

有兴趣可以进一步沟通技术方案和交付计划。

谢谢，
Yitong
Python/嵌入式/LLM集成`
  },
  {
    to: '186396@proginn.com',
    subject: 'Python工程师 | 项目承接 | Yitong',
    body: `您好，

看到您的项目需求（编号186396），Python后端开发我很擅长。

我有以下经验可以匹配：
• Python全栈：FastAPI/Django + React/Next.js
• 自动化/脚本：写过大量Python自动化工具、爬虫、数据处理
• API开发：REST/WebSocket，微服务架构
• 部署运维：Linux、Docker、Shell脚本

请发具体需求，评估后给您详细方案和报价。

谢谢，
Yitong`
  }
];

async function sendAll() {
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    const msgId = `outreach-${Date.now()}-${i}@163.com`;
    try {
      await transporter.sendMail({
        from: '"Yitong" <13510221939@163.com>',
        to: lead.to,
        subject: lead.subject,
        text: lead.body,
        replyTo: '13510221939@163.com',
        headers: { 'Message-ID': msgId }
      });
      console.log(`SENT to ${lead.to}`);
    } catch (e) {
      console.log(`FAILED ${lead.to}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('DONE');
}

sendAll().catch(console.error);
