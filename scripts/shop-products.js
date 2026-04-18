const fs = require('fs');
const path = require('path');

// Read current shop page
const shopFile = 'C:/Users/Administrator/.openclaw/workspace/lobster-platform/app/shop/page.tsx';
let content = fs.readFileSync(shopFile, 'utf8');

// New products to add
const newProducts = [
  {
    id: 'ai-freelancer',
    name: 'AI Freelancer变现全攻略',
    price: 199,
    desc: '我是如何用AI月入$10K的完整方法论 + 40个接单渠道清单',
    delivery: 'PDF + 渠道清单 + 邮件模板',
    cover: 'ai-freelancer-cover---18556dd7-aad4-4f3c-8acc-4379d3b57c22.png',
  },
  {
    id: 'bounty-blueprint',
    name: 'GitHub Bounty猎人蓝图',
    price: 299,
    desc: '从找bounty到PR merge的完整SOP，含工具脚本和自动化方案',
    delivery: 'PDF + 工具包 + 视频教程',
    cover: 'bounty-hunter-blueprint-cover---ee441a35-9a2a-464c-8dee-323c409286f5.png',
  },
  {
    id: 'web3-dev-toolbox',
    name: 'Web3开发者工具箱',
    price: 399,
    desc: '20+实用工具、合约模板、调试脚本，Web3开发效率提升10倍',
    delivery: 'PDF + 代码库',
    cover: 'web3-dev-toolbox-cover---c9d273e8-6ecc-49a8-901b-c673e0292bc0.png',
  },
  {
    id: 'defi-yield',
    name: 'DeFi Yield Farming入门指南',
    price: 299,
    desc: '从0到1学会DeFi收益耕作，10个主流协议操作手册',
    delivery: 'PDF + 协议对照表',
    cover: 'defi-yield-farming-cover---fbc2fe4d-b7b1-45ec-a4ba-b576bd3f89cb.png',
  },
  {
    id: 'prompt-mastery',
    name: 'Prompt工程精通指南',
    price: 149,
    desc: '20个高级prompt模板，覆盖写作、代码、创意、分析全场景',
    delivery: 'PDF + 示例',
    cover: 'prompt-engineering-cover---c1763e66-58f3-4693-9c6e-b7a2533df72e.png',
  },
  {
    id: 'side-hustle',
    name: 'AI Side Hustle_STACK',
    price: 249,
    desc: '5个已在盈利的AI副业项目，完整复盘 + 操作手册',
    delivery: 'PDF + 工具清单 + 推广素材',
    cover: 'side-hustle-cover---675742e1-582e-4224-bc8b-cd6d2503cae9.png',
  },
  {
    id: 'smart-contract-auditor',
    name: '智能合约审计师入门',
    price: 599,
    desc: '从代码审查到报告撰写的完整流程，附真实漏洞案例分析',
    delivery: 'PDF + 案例库 + Checklist',
    cover: 'smart-contract-auditor-cover---b955b165-2bb2-4297-9847-8c6c7cc2796d.png',
  },
  {
    id: 'openclaw-agent',
    name: 'OpenClaw Agent开发指南',
    price: 199,
    desc: '用OpenClaw构建自动化工作流，从0到1学会AI agent开发',
    delivery: 'PDF + 技能包',
    cover: 'openclaw-agent-cover---30770777-932d-43b2-ba5a-9d9ce7655d73.png',
  },
  {
    id: 'automation-blueprint',
    name: 'AI自动化蓝图',
    price: 299,
    desc: '10个可落地的AI自动化场景，含MCP服务器搭建和API集成',
    delivery: 'PDF + 源码 + 部署文档',
    cover: 'ai-automation-cover---5fe47de0-167c-478d-ab25-845f3a5270e2.png',
  },
  {
    id: '10k-month',
    name: '$10K/月实战手册',
    price: 399,
    desc: '作者亲测有效的$10K/月收入路径，6个月从0到稳定副业',
    delivery: 'PDF + 行动清单 + 复盘记录',
    cover: '10k-month-cover---8361d220-54b1-499f-9849-fb493719c2b3.png',
  },
  // Services (higher priced)
  {
    id: 'smart-contract-audit-service',
    name: '🔧 智能合约安全审计',
    price: 4999,
    desc: '专业安全审计，覆盖重入、溢出、权限漏洞，交付完整报告',
    delivery: '完整审计报告 + 修复建议',
    cover: 'smart-contract-security-cover---e44e8a83-9c7e-4b3f-9e1a-b2c3d4e5f678.png',
    isService: true,
  },
  {
    id: 'ai-agent-setup',
    name: '🤖 AI Agent搭建服务',
    price: 2999,
    desc: '帮你搭建OpenClaw自动化工作流，含定制开发+部署+文档',
    delivery: '完整系统 + 1个月维护',
    cover: 'openclaw-agent-cover---30770777-932d-43b2-ba5a-9d9ce7655d73.png',
    isService: true,
  },
];

// Build new products array string
const productsStr = newProducts.map(p => `  {
    id: '${p.id}',
    name: '${p.name}',
    price: ${p.price},
    desc: '${p.desc}',
    delivery: '${p.delivery}',
    cover: '${p.cover}',
  }`).join(',\n');

// Find the PRODUCTS array and replace it
const oldProductsMatch = content.match(/const PRODUCTS = \[([\s\S]*?)\];/);
if (oldProductsMatch) {
  console.log('Found PRODUCTS array');
  const newContent = content.replace(
    /const PRODUCTS = \[[\s\S]*?\];/,
    `const PRODUCTS = [\n${productsStr}\n];`
  );
  fs.writeFileSync(shopFile, newContent, 'utf8');
  console.log('Updated shop page with', newProducts.length, 'new products');
} else {
  console.log('Could not find PRODUCTS array');
}
