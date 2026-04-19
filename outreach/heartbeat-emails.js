const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: {
    user: '13510221939@163.com',
    pass: 'ANVJFYRw74diDt3S'
  },
  connectionTimeout: 10000,
  socketTimeout: 10000
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function sendEmail(to, subject, body) {
  try {
    await transporter.sendMail({
      from: '13510221939@163.com',
      to,
      subject,
      text: body
    });
    console.log(`SENT: ${to}`);
    return true;
  } catch (e) {
    console.log(`FAILED: ${to} - ${e.message}`);
    return false;
  }
}

async function main() {
  const emails = [
    {
      to: '185838@proginn.com',
      subject: '企微AI口腔工具 | Java/Python全栈+LangGraph AI',
      body: `您好，

看到企微AI口腔工具项目（#185838），技术栈和我高度匹配。

我的背景：
- Java/Python全栈：多年生产级项目，后端Spring Boot/Django，前端React/Vue
- 企微API：企业微信机器人、审批流、通讯录同步等集成经验
- LangChain/LangGraph：AI工作流编排，RAG系统，LLM应用开发
- AI能力：OCR识别、智能客服对话、口腔影像分析

口腔工具方向，AI部分我可以独立完成。18-30K预算，沟通后可以灵活。

有案例可以展示，欢迎了解。

Yitong`
    },
    {
      to: '185849@proginn.com',
      subject: 'PS UXP配色插件 | Python配色+K-Means+PS UXP',
      body: `您好，

PS UXP配色插件项目（#185849）感兴趣。

我有以下相关经验：
- Python图像处理：Pillow/OpenCV，色彩空间转换，K-Means聚类配色
- Photoshop脚本：Adobe ExtendScript/UXP开发，熟悉PS DOM API
- 配色算法：基于颜色的感知差异计算，配色方案自动生成
- Win本地开发：独立Windows应用

¥12-18K范围，拿到需求文档后可以快速评估。

Yitong`
    },
    {
      to: '42567@proginn.com',
      subject: 'K8S/Linux/Jenkins运维 | OpenClaw部署经验',
      body: `您好，

K8S/Linux/Jenkins运维项目（#42567）有直接经验。

我有：
- OpenClaw AI助手部署：Gateway/Kong Ingress，长驻服务维护
- K8S集群管理：GKE/EKS自建，Deployment/Service/Ingress配置
- Jenkins CI/CD：流水线编写，Docker镜像构建，自动部署
- Linux运维：Nginx/Docker/systemd，生产环境运维

¥1-6K范围可以灵活，可先聊需求再定价。

Yitong`
    },
    {
      to: 'research@kcolbchain.com',
      subject: 'ChainlinkPoRAdapter follow-up | kcolbchain stablecoin toolkit',
      body: `Hi,

Following up on the ChainlinkPoRAdapter submission for the kcolbchain stablecoin toolkit (#2 bounty).

I've implemented a full Chainlink Automation compatible adapter with checkUpkeep/performUpkeep, manualCheck, and setAlertThreshold for risk management.

Code was submitted as an issue comment since the fork push was returning 422 errors.

Is there anything you'd like me to adjust? Happy to help.

Best,
Yitong`
    },
    {
      to: 'wangshun@tomo.inc',
      subject: 'PR merge状态跟进 | labmain & kcolbchain',
      body: `您好，

跟进 labmain PRs (#33/#34/#51) 和 kcolbchain PRs (#8/#9/#10) 的 merge 状态。

所有 PR 已保持 mergeable 状态，随时可以合并。如果有任何需要调整的地方，请告知。

期待您的反馈！

Yitong`
    },
    {
      to: 'hello@superteam.fun',
      subject: 'Web3 Developer | Solidity + React + Bounty Ready',
      body: `Hi,

I'm a full-stack Web3 developer interested in SuperteamDAO bounty opportunities. 

Background:
- Solidity smart contracts: ERC20, DeFi protocols, Chainlink integrations
- Web3 frontends: React + wagmi/viem, wallet integrations
- GitHub bounty completion with multiple successful PR submissions

Are there any active bounties in the $500-5K range that need development help?

Best,
Yitong`
    },
    {
      to: 'jobs@web3career.io',
      subject: '全栈开发 | Web3+AI+DeFi',
      body: `您好，

我对Web3/DeFi开发有丰富经验：

- Web3开发：Solidity合约、DeFi协议、Chainlink预言机集成
- AI工作流：LangChain/LangGraph、RAG系统、LLM应用
- 前后端全栈：React/Vue + Node.js/Django

如果您有需要开发人员，欢迎联系。我可以提供案例展示。

期待合作！

Yitong`
    },
    {
      to: '2758695161@qq.com',
      subject: 'Yitong | Web3+AI开发寻求合作机会',
      body: `您好，

我是全栈开发工程师，专注于Web3和AI方向：

- Solidity智能合约：ERC20、DeFi协议、Chainlink预言机
- AI应用：LangChain/LangGraph、RAG系统、LLM集成
- 前端：React/Vue + Web3.js/Ethers.js
- 后端：Node.js/Python + PostgreSQL/Redis

有多个GitHub bounty完成经验，GitHub认证开发者。

期待合作机会！

Yitong`
    }
  ];

  let sent = 0;
  for (const email of emails) {
    const ok = await sendEmail(email.to, email.subject, email.body);
    if (ok) sent++;
    await delay(3000); // 3 second delay between emails
  }

  console.log(`\nDone: ${sent}/${emails.length} sent`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
