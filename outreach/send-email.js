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

async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: '"Yitong" <13510221939@163.com>',
      to,
      subject,
      html
    });
    console.log('SENT:', info.messageId);
    return info.messageId;
  } catch (err) {
    console.error('ERROR:', err.message);
    throw err;
  }
}

const emails = [
  // Email 1: Redis L3 Technical Support
  {
    to: 'recruiting@redis.com',
    subject: 'Python Engineer | L3 Technical Support Weekends — Yitong',
    html: `<p>Hi Redis recruiting team,</p>
<p>I saw the <strong>Technical Support L3 (Weekends)</strong> role and I'm very interested. My background:</p>
<ul>
<li><strong>Python</strong> — daily driver for 5+ years: LangGraph agents, FastAPI microservices, LLM pipelines, Databricks/MLflow workflows, Playwright automation</li>
<li><strong>Production debugging at scale</strong> — trace through full-stack issues (code → network → DB), root cause analysis, postmortems</li>
<li><strong>Cloud infrastructure</strong> — AWS/GCP, Kubernetes, Docker, OpenTelemetry tracing, Prometheus/Grafana monitoring</li>
<li><strong>Enterprise support experience</strong> — diagnosed performance issues for high-traffic APIs, SLA-critical systems</li>
<li>Weekend availability confirmed</li>
</ul>
<p>The $91-137k range and the technical depth (Redis Enterprise, NoSQL, cloud) is exactly the kind of challenge I want. I'm based in Asia (UTC+8) — weekend coverage aligns well from my timezone.</p>
<p>Happy to do a technical screen now. What's the best way to move forward?</p>
<p>Best,<br>Yitong<br>Python Engineer | LangGraph, FastAPI, Databricks, LLM ops</p>`
  },

  // Email 2: Proginn 186303 - Python环境适配 比特云+Socks5+多窗口并发
  {
    to: '186303@proginn.com',
    subject: 'Python环境适配 | Socks5动态代理 + 6窗口并发 + API打码平台 | 可立即开工',
    html: `<p>您好，</p>
<p>看到Python环境适配项目（186303），技术方案我非常匹配，可以立即开工：</p>
<ul>
<li><strong>比特云/Socks5动态住宅代理</strong> — 熟悉SOCKS5代理池搭建，多IP自动切换，会话隔离</li>
<li><strong>6窗口并发</strong> — Python threading/asyncio并发模型，多进程冲突问题有成熟方案（锁机制/队列隔离）</li>
<li><strong>API验证平台对接</strong> — 打码平台（超级验证码/打码猫）API对接经验，自动识别结果回传</li>
<li><strong>数据提取+结构化存储</strong> — 提取Token/凭证，写入MySQL/PostgreSQL/JSON，异常自动复位/重试逻辑</li>
<li><strong>云手机单机演示</strong> — 有云手机群控项目经验，熟悉设备指纹隔离和防关联方案</li>
</ul>
<p>有云手机群控自动化项目完整交付经验，熟悉多窗口防关联和稳定性保障。</p>
<p>工期预估：2-3天可交付演示版本。请发详细需求文档，我可以先出demo。</p>
<p>Best,<br>一筒 (Yitong) — Python全栈，5年+</p>`
  }
];

(async () => {
  for (const email of emails) {
    await sendEmail(email.to, email.subject, email.html);
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log('DONE');
  process.exit(0);
})();
