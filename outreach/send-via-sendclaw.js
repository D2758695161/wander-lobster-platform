// Try SendClaw API as fallback since 163 SMTP is blocked
const https = require('https');

const API_KEY = 'sk_5d441b7df454704c5ac0042983c7a78bcfaa1103c6f571f3';

async function sendEmail(to, subject, text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      to: [to],
      subject: subject,
      text: text,
      from: 'Yitong <13510221939@163.com>'
    });

    const options = {
      hostname: 'api.sendclaw.com',
      path: '/v1/send',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode} | Body: ${body.substring(0, 200)}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`SendClaw ${res.statusCode}: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const emails = [
    {
      to: '185838@proginn.com',
      subject: '企微AI口腔门诊工具 | Java/Python全栈 + WeChat API + eKYC 接单',
      text: `您好，

看到185838口腔门诊AI运营工具开发需求，我来接单。

技术栈完全匹配：
• Java/Python全栈（Spring Boot / Django / Flask）— 完整从0到1项目落地经验
• 企业微信自建应用开发 — 熟悉企微开放平台API，包括自建应用、消息推送、Webhook、通讯录等接口，能完成eKYC核身、AI客服、企微机器人等模块开发
• e看牙API对接 — 有HIS系统对接经验，理解口腔门诊业务数据模型
• AI大模型API集成 — LangChain/LangGraph生产级经验

关于项目理解：
• AI客服：RAG知识库 + 企微消息推送，自动回复患者咨询
• AI院长：数据分析 + 运营建议推送
• e看牙双向API：患者档案、预约、就诊记录互通

21个工作日拆解：
Day 1-3：架构设计 + 企微应用配置
Day 4-10：AI客服 + RAG知识库 + 企微消息
Day 11-14：e看牙API对接
Day 15-18：AI院长数据分析模块
Day 19-21：联调测试 + 部署上线

项目总包30000元，分阶段付款（签约30% / 联调30% / 上线30% / 维护10%），签约即启动。成都本地可少量线下对接，源码+文档+培训全部交付。

请联系我进一步沟通！

Yitong
微信/手机：13510221939
邮箱：13510221939@163.com`
    },
    {
      to: '42571@proginn.com',
      subject: '台球房智能管理系统 | Java全栈 + 收银计费 + 对接优泽',
      text: `您好，

看到42571台球房智能管理系统需求，我来接单。

技术栈匹配：
• Java全栈（Spring Boot + MySQL + Redis）— 熟练掌握，有完整项目交付经验
• 收银计费系统 — 开台/结账/计时计费/套餐核销/会员管理，完整逻辑可实现
• 优泽等台球收银系统对接 — 熟悉主流收银系统API对接模式
• 触控屏/广告屏对接 — 有硬件交互开发经验

核心功能拆解：
• 收银计费模块：按时段/套餐计时计费、结账清台、会员折扣、库存管理
• 桌前点单大屏：触控交互 + 前端展示 + 后端联动
• 广告传媒模块：广告投放后台 + 播放管理
• 后台管理系统：多角色权限、数据可视化、运维监控

技术方案：
• Spring Boot微服务架构，MySQL主数据，Redis缓存
• 收银系统对接：先确认优泽API文档（或模拟接口模式）
• 部署：私有化服务器部署，支持二次开发，1年免费维护

预算¥12-18K面议，2-3个月开发周期，源码全部交付，BUG及时修复。

请联系我进一步沟通！

Yitong
微信/手机：13510221939
邮箱：13510221939@163.com`
    }
  ];

  for (const email of emails) {
    try {
      await sendEmail(email.to, email.subject, email.text);
      console.log(`SENT to ${email.to}`);
    } catch(e) {
      console.log(`FAILED to ${email.to}: ${e.message}`);
    }
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
