"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────────────────
type TaskType = "one-time" | "long-term" | "adoption";
type Currency = "USD" | "CNY" | "USDT";
type EscrowStatus = "unpaid" | "deposited" | "working" | "completed" | "released" | "disputed";

interface Task {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  type: TaskType;
  budget: number;
  currency: Currency;
  skills: string[];
  deadline: string;
  posterName: string;
  posterAvatar: string;
  contactWechat: string;
  contactEmail: string;
  requirements: string;
  requirementsEn: string;
  postedAt: string;
  // Escrow / anti-free-riding
  escrowStatus: EscrowStatus;
  depositConfirmed: boolean; // poster deposited = task is live
  selectedWorker: { name: string; quote: number } | null;
  applications: Application[];
}

interface Application {
  id: string;
  taskId: string;
  name: string;
  email: string;
  pitch: string;
  quote: number;
  currency: Currency;
  appliedAt: string;
  status: "pending" | "accepted" | "rejected";
}

// ─── i18n ────────────────────────────────────────────────────────────────────
const i18n = {
  header: { zh: "任务大厅", en: "Task Board" },
  postTask: { zh: "发布任务", en: "Post a Task" },
  viewDetails: { zh: "查看详情", en: "View Details" },
  applyNow: { zh: "立即报名", en: "Apply Now" },
  filterType: { zh: "任务类型", en: "Task Type" },
  filterCurrency: { zh: "预算货币", en: "Budget Currency" },
  filterSkill: { zh: "技能标签", en: "Skill Tags" },
  allTypes: { zh: "全部类型", en: "All Types" },
  oneTime: { zh: "一次性", en: "One-time" },
  longTerm: { zh: "长期", en: "Long-term" },
  adoption: { zh: "代养", en: "Adoption" },
  budget: { zh: "预算", en: "Budget" },
  deadline: { zh: "截止日期", en: "Deadline" },
  skills: { zh: "技能需求", en: "Skills Needed" },
  description: { zh: "项目描述", en: "Description" },
  requirements: { zh: "具体要求", en: "Requirements" },
  contact: { zh: "联系方式", en: "Contact" },
  poster: { zh: "发布者", en: "Posted by" },
  applyFormTitle: { zh: "报名申请", en: "Application Form" },
  yourName: { zh: "你的名字", en: "Your Name" },
  yourEmail: { zh: "邮箱地址", en: "Email Address" },
  yourPitch: { zh: "自我介绍 / 优势", en: "Your Pitch / Strengths" },
  yourQuote: { zh: "你的报价", en: "Your Quote" },
  submit: { zh: "提交申请", en: "Submit Application" },
  cancel: { zh: "取消", en: "Cancel" },
  postFormTitle: { zh: "发布新任务", en: "Post New Task" },
  taskTitle: { zh: "任务标题", en: "Task Title" },
  taskDescription: { zh: "任务描述", en: "Task Description" },
  taskRequirements: { zh: "具体要求", en: "Requirements" },
  taskDeadline: { zh: "截止日期", en: "Deadline" },
  wechatId: { zh: "微信号", en: "WeChat ID" },
  emailAddress: { zh: "邮箱地址", en: "Email Address" },
  publish: { zh: "发布任务", en: "Publish Task" },
  ago: { zh: "前", en: "ago" },
  justNow: { zh: "刚刚", en: "Just now" },
  noTasks: { zh: "暂无任务", en: "No tasks found" },
  noTasksHint: { zh: "成为第一个发布者吧！", en: "Be the first to post!" },
  perMonth: { zh: "/月", en: "/month" },
  typeLabel: { zh: "类型", en: "Type" },
  currencyUsd: { zh: "美元 (USD)", en: "US Dollar (USD)" },
  currencyCny: { zh: "人民币 (CNY)", en: "Chinese Yuan (CNY)" },
  currencyUsdt: { zh: "USDT", en: "USDT" },
  success: { zh: "提交成功！", en: "Submitted successfully!" },
  taskPosted: { zh: "任务已发布！", en: "Task posted!" },
  posted: { zh: "发布于", en: "Posted" },
  clearFilters: { zh: "清除筛选", en: "Clear Filters" },
};

function t(obj: Record<string, string>, lang: "zh" | "en") {
  return obj[lang];
}

// ─── Seed Data ───────────────────────────────────────────────────────────────
const SEED_TASKS: Task[] = [
  // ── C端日常生活任务 ─────────────────────────────────────────────
  {
    id: "c1",
    title: "帮忙遛狗 — 每天下午 4-6点",
    titleEn: "Dog Walking - Daily 4-6pm",
    description: "家里柯基每天需要遛，固定下午4点到小区花园，帮忙遛30-45分钟，要求喜欢狗狗、有耐心。",
    descriptionEn: "My corgi needs daily walks, 4-6pm at the community garden. Walk for 30-45 minutes. Must love dogs and be patient.",
    type: "long-term",
    budget: 80,
    currency: "CNY",
    skills: ["遛狗", "宠物照顾", "耐心"],
    deadline: "2026-06-30",
    posterName: "柯基主人阿丹",
    posterAvatar: "🐕",
    contactWechat: "korgi_dan",
    contactEmail: "",
    requirements: "喜欢中大型犬；固定时间可配合；有养狗经验优先",
    requirementsEn: "Comfortable with medium-large dogs; available at fixed time; dog-sitting experience preferred",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "c2",
    title: "陪同就医 — 儿童医院代挂号+陪诊",
    titleEn: "Hospital Visit Companion - Registration & Escort",
    description: "需要一位有陪诊经验的朋友帮忙：工作日早上帮忙在北京儿童医院代挂号（用我的账号），然后陪诊半天（8点-12点）。",
    descriptionEn: "Need someone with escort experience to help: register at Beijing Children's Hospital (using my account) and accompany for half-day (8am-12pm) on a weekday.",
    type: "one-time",
    budget: 350,
    currency: "CNY",
    skills: ["陪诊", "普通话", "细心"],
    deadline: "2026-04-10",
    posterName: "双职工妈妈小林",
    posterAvatar: "👩‍👧",
    contactWechat: "xiaolin_mom",
    contactEmail: "",
    requirements: "有陪诊或医疗相关经验；普通话标准；细心负责",
    requirementsEn: "Medical escort or healthcare experience preferred; fluent Mandarin; careful and responsible",
    postedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: { name: "阿华", quote: 350 },
    applications: [],
  },
  {
    id: "c3",
    title: "搬家打包 — 2室1厅物品整理+打包",
    titleEn: "Moving Help - 2BR Apartment Packing",
    description: "4月5日搬家，需要帮忙整理+打包2室1厅的物品（书、衣物、厨房用品），早9点到晚6点，中间休息2小时。提供打包材料。",
    descriptionEn: "Moving on April 5th, need help packing a 2BR apartment (books, clothes, kitchen). 9am-6pm with 2hr break. Packing materials provided.",
    type: "one-time",
    budget: 400,
    currency: "CNY",
    skills: ["整理收纳", "体力劳动", "细心"],
    deadline: "2026-04-05",
    posterName: "搬家小白领",
    posterAvatar: "📦",
    contactWechat: "moving_2026",
    contactEmail: "",
    requirements: "有收纳整理经验优先；能搬重物（书很重！）；准时",
    requirementsEn: "Organization experience preferred; able to carry heavy items (books are heavy!); punctual",
    postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "working",
    depositConfirmed: true,
    selectedWorker: { name: "大力", quote: 400 },
    applications: [],
  },
  {
    id: "c4",
    title: "法语零基础陪练 — 每周2次视频课",
    titleEn: "French Beginner Tutor - 2 Video Sessions/Week",
    description: "零基础法语学习，需要一位法语母语或B2以上水平的陪练，通过腾讯会议每周2次口语练习，每次45分钟，帮助纠正发音和表达。",
    descriptionEn: "Beginner French learner, need a native or B2+ speaker for 2x weekly Tencent Meeting speaking practice, 45min each. Help with pronunciation and expressions.",
    type: "adoption",
    budget: 2000,
    currency: "CNY",
    skills: ["法语", "在线教学", "口语陪练"],
    deadline: "2026-06-30",
    posterName: "法语梦想家小王",
    posterAvatar: "🇫🇷",
    contactWechat: "france_dreamer",
    contactEmail: "wang@example.com",
    requirements: "法语B2以上；有时间固定的2小时/周；有教学或陪练经验优先",
    requirementsEn: "French B2+; available at fixed times, 2hrs/week; teaching/tutoring experience preferred",
    postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "c5",
    title: "同城急送 — 文件/钥匙送到指定地点",
    titleEn: "Same-Day Delivery - Documents or Keys",
    description: "需要紧急同城送一份文件，从朝阳区国贸到海淀区中关村，要求2小时内送达。当面交付，拍照确认。",
    descriptionEn: "Urgent same-city delivery: documents from Guomao (Chaoyang) to Zhongguancun (Haidian), must arrive within 2 hours. Hand-deliver with photo confirmation.",
    type: "one-time",
    budget: 120,
    currency: "CNY",
    skills: ["跑腿", "北京交通", "准时"],
    deadline: "2026-04-01",
    posterName: "紧急求助Micheal",
    posterAvatar: "📮",
    contactWechat: "micheal_urg",
    contactEmail: "",
    requirements: "熟悉北京交通；电动车或公共交通优先；2小时内必达",
    requirementsEn: "Familiar with Beijing transport; bike or public transit preferred; must arrive within 2 hours",
    postedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    escrowStatus: "released",
    depositConfirmed: true,
    selectedWorker: { name: "小张跑腿", quote: 120 },
    applications: [],
  },
  {
    id: "c6",
    title: "小红书图文笔记代写 — 美妆品牌合作",
    titleEn: "Xiaohongshu Post Writing - Beauty Brand Collaboration",
    description: "某国产美妆品牌寻找小红书博主合作，需要代写2篇图文笔记（植入品牌软广），风格自然真实，粉丝真实优先。",
    descriptionEn: "A domestic beauty brand looking for Xiaohongshu collaboration. Need 2 posts written (soft brand integration), natural and authentic style, real followers preferred.",
    type: "one-time",
    budget: 600,
    currency: "CNY",
    skills: ["小红书", "文案写作", "美妆", "社交媒体"],
    deadline: "2026-04-15",
    posterName: "美妆商务Lily",
    posterAvatar: "💄",
    contactWechat: "beauty_lily2026",
    contactEmail: "lily@bebopro.com",
    requirements: "有小红书运营经验；有真实粉丝基础（1000+）；文笔自然不生硬",
    requirementsEn: "Xiaohongshu experience; real followers (1000+); natural writing style",
    postedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "c7",
    title: "周末摄影助理 — 活动拍摄打下手",
    titleEn: "Weekend Photography Assistant - Event Shooting Support",
    description: "4月每个周末有活动拍摄（婚礼/生日/团建），需要一位摄影助理帮忙：拿设备、引导客户、递道具。工作4-6小时/天，包午饭。",
    descriptionEn: "Event photography every weekend in April (weddings/birthdays/corporate). Need assistant: hold equipment, direct clients, hand over props. 4-6hrs/day + lunch provided.",
    type: "long-term",
    budget: 600,
    currency: "CNY",
    skills: ["摄影", "活动现场", "引导能力"],
    deadline: "2026-04-30",
    posterName: "独立摄影师阿海",
    posterAvatar: "📷",
    contactWechat: "photographer_ahai",
    contactEmail: "",
    requirements: "有摄影或活动现场经验；体力好；每周六或日至少有一天可配合",
    requirementsEn: "Photography or event experience; good physical condition; available at least one of Sat/Sun per week",
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  // ── 开发者/技术任务 ─────────────────────────────────────────────
  {
    id: "1",
    title: "AI Coding Agent - GitHub Bounty 自动化工具",
    titleEn: "AI Coding Agent - GitHub Bounty Automation Tool",
    description: "开发一款基于 AI 的 GitHub Bounty 任务自动化工具，能够自动抓取 bounty issues、评估难度、生成代码方案并提交 PR。",
    descriptionEn: "Build an AI-powered GitHub Bounty automation tool that can automatically fetch bounty issues, assess difficulty, generate code solutions and submit PRs.",
    type: "one-time",
    budget: 500,
    currency: "USD",
    skills: ["Python", "GitHub API", "AI", "Automation"],
    deadline: "2026-05-15",
    posterName: "LobsterDev_Crypto",
    posterAvatar: "🦀",
    contactWechat: "LobsterDev_Crypto",
    contactEmail: "dev@lobsterplatform.io",
    requirements: "有 GitHub API 实际项目经验优先；熟悉 OpenAI / Claude API；有自动化脚本作品展示",
    requirementsEn: "Prior experience with GitHub API preferred; familiar with OpenAI/Claude API; portfolio showing automation work",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "2",
    title: "DeFi Dashboard - React + Web3 数据面板",
    titleEn: "DeFi Dashboard - React + Web3 Integration",
    description: "打造一个 DeFi 数据看板，整合 Uniswap、AAVE、Curve 等协议数据，展示流动性、收益率、gas 费用等核心指标。",
    descriptionEn: "Build a DeFi data dashboard integrating Uniswap, AAVE, Curve protocols, displaying liquidity, yield, gas fees and other key metrics.",
    type: "long-term",
    budget: 15000,
    currency: "CNY",
    skills: ["React", "TypeScript", "Web3", "DeFi"],
    deadline: "2026-06-30",
    posterName: "DeFiMaster",
    posterAvatar: "🧪",
    contactWechat: "DeFiMaster2026",
    contactEmail: "defi@master.io",
    requirements: "有 Web3.js / ethers.js 使用经验；熟悉 DeFi 协议 API；可提供过往 Web3 项目案例",
    requirementsEn: "Experience with Web3.js/ethers.js; familiar with DeFi protocol APIs; portfolio of Web3 projects required",
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "3",
    title: "智能合约安全审计",
    titleEn: "Smart Contract Security Audit",
    description: "对一套 Solidity 智能合约（含 ERC-20 代币、质押合约）进行完整安全审计，出具书面报告并标注所有已知漏洞。",
    descriptionEn: "Complete security audit of a Solidity smart contract suite (ERC-20 token + staking contract), provide written report with all identified vulnerabilities.",
    type: "one-time",
    budget: 2000,
    currency: "USDT",
    skills: ["Solidity", "Security", "Ethereum", "Smart Contract"],
    deadline: "2026-04-20",
    posterName: "SecureLabs",
    posterAvatar: "🔐",
    contactWechat: "SecureLabs",
    contactEmail: "audit@securelabs.io",
    requirements: "持有区块链安全相关认证优先；审计过大型 DeFi 协议；有公开审计报告可查",
    requirementsEn: "Blockchain security certification preferred; audited major DeFi protocols; verifiable public audit reports",
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "released",
    depositConfirmed: true,
    selectedWorker: { name: "ChainGuard", quote: 2000 },
    applications: [],
  },
  {
    id: "4",
    title: "全栈 SaaS - 开票平台",
    titleEn: "Full-stack SaaS - Invoicing Platform",
    description: "从零开发一套 B2B 开票 SaaS 平台，包含发票开具、抬头管理、PDF 导出、邮件发送、数据分析等功能。",
    descriptionEn: "Develop a B2B invoicing SaaS platform from scratch, including invoice generation, company profile management, PDF export, email delivery, data analytics.",
    type: "one-time",
    budget: 8000,
    currency: "CNY",
    skills: ["Node.js", "PostgreSQL", "React", "SaaS"],
    deadline: "2026-07-01",
    posterName: "StartupXYZ",
    posterAvatar: "🚀",
    contactWechat: "StartupXYZ2026",
    contactEmail: "hello@startupxyz.cn",
    requirements: "有 SaaS 产品完整开发经验；熟悉后端 API 设计规范；有发票/财务系统经验优先",
    requirementsEn: "Full SaaS product development experience; familiar with RESTful API design; invoicing/fintech experience a plus",
    postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "5",
    title: "长期代养 - DevOps & 云基础设施",
    titleEn: "Monthly Retainer - DevOps & Cloud Infrastructure",
    description: "每月固定技术支持：AWS 架构优化、Kubernetes 集群维护、CI/CD 流水线搭建、Terraform IaC 编写。",
    descriptionEn: "Monthly retainer: AWS architecture optimization, Kubernetes cluster maintenance, CI/CD pipeline setup, Terraform IaC authoring.",
    type: "adoption",
    budget: 1500,
    currency: "USD",
    skills: ["AWS", "Kubernetes", "Terraform", "DevOps"],
    deadline: "2026-12-31",
    posterName: "CloudNative",
    posterAvatar: "☁️",
    contactWechat: "CloudNativeOps",
    contactEmail: "ops@cloudnative.io",
    requirements: "AWS 架构师认证优先；3年以上 K8s 生产环境经验；有 IaC 实施案例",
    requirementsEn: "AWS Solutions Architect certification preferred; 3+ years K8s production experience; IaC implementation portfolio",
    postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "6",
    title: "移动应用 - 外卖配送 App",
    titleEn: "Mobile App - Food Delivery App",
    description: "开发一款跨平台外卖配送应用，支持用户下单、骑手接单、实时定位、评价系统、优惠券模块。",
    descriptionEn: "Develop a cross-platform food delivery app with user ordering, rider acceptance, real-time tracking, rating system, and coupon module.",
    type: "one-time",
    budget: 20000,
    currency: "CNY",
    skills: ["React Native", "iOS", "Android", "Maps API"],
    deadline: "2026-08-15",
    posterName: "MobileFirst",
    posterAvatar: "📱",
    contactWechat: "MobileFirstDev",
    contactEmail: "dev@mobilefirst.cn",
    requirements: "有 React Native 完整项目经验；熟悉地图 SDK 集成；有外卖/配送类应用作品优先",
    requirementsEn: "Full React Native project experience; familiar with Maps SDK integration; food delivery app portfolio a plus",
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "7",
    title: "数据管道 - ML 特征工程",
    titleEn: "Data Pipeline - ML Feature Engineering",
    description: "搭建 ML 特征工程数据管道，使用 Kafka 消息队列、Airflow 调度，从多数据源提取、转换、存储特征数据供模型训练。",
    descriptionEn: "Build ML feature engineering data pipeline using Kafka message queue and Airflow scheduling, extracting, transforming and storing feature data from multiple sources for model training.",
    type: "one-time",
    budget: 2000,
    currency: "USD",
    skills: ["Python", "Kafka", "Airflow", "ML"],
    deadline: "2026-05-30",
    posterName: "AIdataCo",
    posterAvatar: "🧠",
    contactWechat: "AIdataCo",
    contactEmail: "data@aidataco.io",
    requirements: "有 Kafka + Airflow 生产环境经验；熟悉 Python 数据处理生态；有 ML 特征工程实践经验",
    requirementsEn: "Kafka + Airflow production experience; familiar with Python data processing ecosystem; ML feature engineering practice",
    postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "working",
    depositConfirmed: true,
    selectedWorker: { name: "DataFlow_Pro", quote: 2000 },
    applications: [],
  },
  {
    id: "8",
    title: "技术写作 - API 文档撰写",
    titleEn: "Technical Writer - API Documentation",
    description: "为一套 RESTful API 产品撰写完整技术文档，包含 API 参考、集成指南、代码示例（Python/JavaScript/Go）、错误码说明。",
    descriptionEn: "Write complete technical documentation for a RESTful API product, including API reference, integration guide, code examples (Python/JavaScript/Go), and error code descriptions.",
    type: "long-term",
    budget: 5000,
    currency: "CNY",
    skills: ["Markdown", "API Docs", "English", "Technical Writing"],
    deadline: "2026-06-01",
    posterName: "DocuPro",
    posterAvatar: "📝",
    contactWechat: "DocuProCN",
    contactEmail: "docs@docupro.cn",
    requirements: "英文写作流畅（雅思 7+ 或同等水平）；有 API 文档撰写经验；懂技术概念，可与工程师有效沟通",
    requirementsEn: "Fluent English writing (IELTS 7+ or equivalent); API documentation experience; understand technical concepts, can communicate effectively with engineers",
    postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "9",
    title: "Rust/WASM 运行时开发",
    titleEn: "Rust/WASM Runtime Development",
    description: "为 WebAssembly 边缘计算平台开发高性能 Rust 运行时，支持 WASI 标准接口，具备沙箱隔离与冷启动优化能力。",
    descriptionEn: "Develop a high-performance Rust runtime for WebAssembly edge computing platform, supporting WASI standard interfaces with sandbox isolation and cold-start optimization.",
    type: "one-time",
    budget: 22000,
    currency: "CNY",
    skills: ["Rust", "WebAssembly", "WASI", "Edge Computing"],
    deadline: "2026-05-15",
    posterName: "EdgeLabs",
    posterAvatar: "⚡",
    contactWechat: "EdgeLabs2026",
    contactEmail: "dev@edgelabs.io",
    requirements: "有 Rust 正式项目经验；熟悉 WASM 字节码格式；有 WASI 标准实现经验优先",
    requirementsEn: "Professional Rust project experience; familiar with WASM bytecode format; WASI standard implementation experience a plus",
    postedAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "10",
    title: "Python AI 数据管道开发",
    titleEn: "Python AI Data Pipeline Development",
    description: "搭建企业级 AI 数据管道：数据采集、清洗、特征提取、向量化存储，支持多源异构数据对接主流 LLM API。",
    descriptionEn: "Build enterprise-grade AI data pipeline: data ingestion, cleaning, feature extraction, vector storage, supporting multi-source heterogeneous data integration with mainstream LLM APIs.",
    type: "long-term",
    budget: 15000,
    currency: "CNY",
    skills: ["Python", "Pandas", "Vector DB", "LLM API", "Data Pipeline"],
    deadline: "2026-06-01",
    posterName: "AIStream",
    posterAvatar: "🔮",
    contactWechat: "AIStreamDev",
    contactEmail: "pipeline@aistream.io",
    requirements: "熟悉 Python 数据处理生态；有向量数据库（Pinecone/Milvus/Qdrant）使用经验；有 LLM API 集成经验",
    requirementsEn: "Familiar with Python data processing ecosystem; experience with vector databases (Pinecone/Milvus/Qdrant); LLM API integration experience",
    postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = { USD: "$", CNY: "¥", USDT: "" };
  return `${symbols[currency]}${currency === "USDT" ? amount + " USDT" : amount.toLocaleString()}${currency === "USD" ? " USD" : currency === "CNY" ? " CNY" : ""}`;
}

function getCurrencySymbol(currency: Currency): string {
  const symbols: Record<Currency, string> = { USD: "$", CNY: "¥", USDT: "₮" };
  return symbols[currency];
}

function formatPostedAt(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins}分钟`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时`;
  const days = Math.floor(hours / 24);
  return `${days}天`;
}

function getTypeLabel(type: TaskType, lang: "zh" | "en"): string {
  const labels: Record<TaskType, { zh: string; en: string }> = {
    "one-time": { zh: "一次性", en: "One-time" },
    "long-term": { zh: "长期", en: "Long-term" },
    "adoption": { zh: "代养", en: "Adoption" },
  };
  return labels[type][lang];
}

function getTypeColor(type: TaskType): string {
  const colors: Record<TaskType, string> = {
    "one-time": "bg-lobster-accent/20 text-lobster-accent border-lobster-accent/30",
    "long-term": "bg-lobster-secondary/20 text-lobster-secondary border-lobster-secondary/30",
    "adoption": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
  return colors[type];
}

function getEscrowBadge(escrowStatus: EscrowStatus, depositConfirmed: boolean): { label: string; color: string; icon: string } | null {
  if (!depositConfirmed) return { label: "未托管", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: "⏳" };
  switch (escrowStatus) {
    case "deposited": return { label: "已托管√", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: "🔒" };
    case "working": return { label: "进行中", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: "⚡" };
    case "completed": return { label: "待放款", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: "🎯" };
    case "released": return { label: "已结算", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: "✅" };
    case "disputed": return { label: "争议中", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: "⚠️" };
    default: return null;
  }
}

// ─── Modal Base ─────────────────────────────────────────────────────────────
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="glass-card rounded-3xl p-8 text-left max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Task Detail Modal ───────────────────────────────────────────────────────
function TaskDetailModal({
  task,
  lang,
  onClose,
}: {
  task: Task;
  lang: "zh" | "en";
  onClose: () => void;
}) {
  const [showApply, setShowApply] = useState(false);
  const [applied, setApplied] = useState(false);
  const isLongTerm = task.type === "long-term" || task.type === "adoption";

  const [form, setForm] = useState({ name: "", email: "", pitch: "", quote: "" });

  const handleApply = () => {
    if (!form.name || !form.email || !form.pitch || !form.quote) return;
    const app: Application = {
      id: Date.now().toString(),
      taskId: task.id,
      name: form.name,
      email: form.email,
      pitch: form.pitch,
      quote: Number(form.quote),
      currency: task.currency,
      appliedAt: new Date().toISOString(),
      status: "pending",
    };
    const existing = JSON.parse(localStorage.getItem("lobster_applications") || "[]") as Application[];
    localStorage.setItem("lobster_applications", JSON.stringify([...existing, app]));
    setApplied(true);
    setShowApply(false);
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(task.type)}`}>
              {getTypeLabel(task.type, lang)}
            </span>
          </div>
          <h2 className="text-xl font-bold text-lobster-text font-heading">
            {lang === "zh" ? task.title : task.titleEn}
          </h2>
        </div>
        <button onClick={onClose} className="text-lobster-text/40 hover:text-lobster-text text-2xl leading-none ml-4">×</button>
      </div>

      {/* Budget & Meta */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="glass-card rounded-xl px-4 py-2">
          <p className="text-xs text-lobster-text/40 mb-0.5">{t({ zh: "预算", en: "Budget" }, lang)}</p>
          <p className="text-lg font-bold text-lobster-accent">
            {formatCurrency(task.budget, task.currency)}
            {(isLongTerm) && <span className="text-sm font-normal text-lobster-text/60 ml-1">{t({ zh: "/月", en: "/month" }, lang)}</span>}
          </p>
        </div>
        <div className="glass-card rounded-xl px-4 py-2">
          <p className="text-xs text-lobster-text/40 mb-0.5">{t({ zh: "截止日期", en: "Deadline" }, lang)}</p>
          <p className="text-lobster-text font-medium">{task.deadline}</p>
        </div>
        <div className="glass-card rounded-xl px-4 py-2">
          <p className="text-xs text-lobster-text/40 mb-0.5">{t({ zh: "发布者", en: "Posted by" }, lang)}</p>
          <p className="text-lobster-text font-medium flex items-center gap-1">
            <span>{task.posterAvatar}</span> {task.posterName}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-lobster-secondary mb-2 uppercase tracking-wider">
          {t({ zh: "项目描述", en: "Description" }, lang)}
        </h3>
        <p className="text-lobster-text/80 leading-relaxed">
          {lang === "zh" ? task.description : task.descriptionEn}
        </p>
      </div>

      {/* Requirements */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-lobster-secondary mb-2 uppercase tracking-wider">
          {t({ zh: "具体要求", en: "Requirements" }, lang)}
        </h3>
        <p className="text-lobster-text/80 leading-relaxed">
          {lang === "zh" ? task.requirements : task.requirementsEn}
        </p>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-lobster-secondary mb-2 uppercase tracking-wider">
          {t({ zh: "技能需求", en: "Skills Needed" }, lang)}
        </h3>
        <div className="flex flex-wrap gap-2">
          {task.skills.map((s) => (
            <span key={s} className="text-xs px-3 py-1 rounded-full bg-lobster-deep/60 text-lobster-secondary border border-lobster-secondary/20">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mb-6 glass-card rounded-xl p-4">
        <h3 className="text-sm font-bold text-lobster-secondary mb-3 uppercase tracking-wider">
          {t({ zh: "联系方式", en: "Contact" }, lang)}
        </h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-xs text-lobster-text/40 mb-1">WeChat</p>
            <p className="text-lobster-accent font-mono">{task.contactWechat}</p>
          </div>
          <div>
            <p className="text-xs text-lobster-text/40 mb-1">Email</p>
            <p className="text-lobster-accent">{task.contactEmail}</p>
          </div>
        </div>
      </div>

      {/* Apply Form */}
      <AnimatePresence mode="wait">
        {applied ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <p className="text-4xl mb-4">🎉</p>
            <p className="text-xl font-bold text-lobster-secondary">{t({ zh: "提交成功！", en: "Submitted successfully!" }, lang)}</p>
            <p className="text-lobster-text/60 mt-2">{t({ zh: "发布者会尽快联系你", en: "The poster will contact you soon" }, lang)}</p>
          </motion.div>
        ) : showApply ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-lobster-text font-heading">
              {t({ zh: "报名申请", en: "Application Form" }, lang)}
            </h3>
            <input
              type="text"
              placeholder={t({ zh: "你的名字", en: "Your Name" }, lang)}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors"
            />
            <input
              type="email"
              placeholder={t({ zh: "邮箱地址", en: "Email Address" }, lang)}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors"
            />
            <textarea
              placeholder={t({ zh: "自我介绍 / 优势", en: "Your Pitch / Strengths" }, lang)}
              value={form.pitch}
              onChange={(e) => setForm({ ...form, pitch: e.target.value })}
              rows={3}
              className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors resize-none"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder={t({ zh: "你的报价", en: "Your Quote" }, lang)}
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors"
                />
              </div>
              <span className="flex items-center text-lobster-text/40 px-3">{getCurrencySymbol(task.currency)}</span>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleApply}
                className="btn-cta flex-1 text-center"
              >
                {t({ zh: "提交申请", en: "Submit Application" }, lang)}
              </button>
              <button
                onClick={() => setShowApply(false)}
                className="px-6 py-3 rounded-full border border-lobster-deep/60 text-lobster-text/60 hover:text-lobster-text hover:border-lobster-text/30 transition-all"
              >
                {t({ zh: "取消", en: "Cancel" }, lang)}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="apply-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowApply(true)}
            className="btn-cta w-full text-center text-lg py-4"
          >
            {t({ zh: "立即报名", en: "Apply Now" }, lang)}
          </motion.button>
        )}
      </AnimatePresence>
    </Modal>
  );
}

// ─── Post Task Modal ─────────────────────────────────────────────────────────
function PostTaskModal({
  open,
  onClose,
  lang,
  onPosted,
}: {
  open: boolean;
  onClose: () => void;
  lang: "zh" | "en";
  onPosted: (task: Task) => void;
}) {
  const [form, setForm] = useState({
    title: "", description: "", requirements: "",
    type: "one-time" as TaskType,
    budget: "", currency: "USD" as Currency,
    skills: "", deadline: "",
    posterName: "", contactWechat: "", contactEmail: "",
  });

  const handlePublish = () => {
    if (!form.title || !form.description || !form.budget || !form.posterName) return;
    const task: Task = {
      id: Date.now().toString(),
      title: form.title,
      titleEn: form.title,
      description: form.description,
      descriptionEn: form.description,
      type: form.type,
      budget: Number(form.budget),
      currency: form.currency,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      deadline: form.deadline || "TBD",
      posterName: form.posterName,
      posterAvatar: "🦞",
      contactWechat: form.contactWechat || "N/A",
      contactEmail: form.contactEmail || "N/A",
      requirements: form.requirements || "N/A",
      requirementsEn: form.requirements || "N/A",
      postedAt: new Date().toISOString(),
      escrowStatus: "unpaid",
      depositConfirmed: false,
      selectedWorker: null,
      applications: [],
    };
    const existing = JSON.parse(localStorage.getItem("lobster_tasks") || "[]") as Task[];
    localStorage.setItem("lobster_tasks", JSON.stringify([task, ...existing]));
    onPosted(task);
    onClose();
  };

  const inputCls = "w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors text-sm";
  const labelCls = "text-xs text-lobster-secondary mb-1.5 block uppercase tracking-wider font-bold";

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-lobster-text font-heading">
          {t({ zh: "发布新任务", en: "Post New Task" }, lang)}
        </h2>
        <button onClick={onClose} className="text-lobster-text/40 hover:text-lobster-text text-2xl leading-none">×</button>
      </div>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>{t({ zh: "任务标题", en: "Task Title" }, lang)} *</label>
          <input className={inputCls} placeholder={lang === "zh" ? "例如：Python 爬虫开发" : "e.g. Python Crawler Development"} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>{t({ zh: "任务描述", en: "Task Description" }, lang)} *</label>
          <textarea className={inputCls + " resize-none"} rows={3} placeholder={lang === "zh" ? "详细描述任务内容..." : "Describe the task in detail..."} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{t({ zh: "任务类型", en: "Task Type" }, lang)}</label>
            <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TaskType })}>
              <option value="one-time">{t({ zh: "一次性", en: "One-time" }, lang)}</option>
              <option value="long-term">{t({ zh: "长期", en: "Long-term" }, lang)}</option>
              <option value="adoption">{t({ zh: "代养", en: "Adoption" }, lang)}</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>{t({ zh: "截止日期", en: "Deadline" }, lang)}</label>
            <input type="date" className={inputCls} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{t({ zh: "预算金额", en: "Budget Amount" }, lang)} *</label>
            <input type="number" className={inputCls} placeholder="500" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>{t({ zh: "货币", en: "Currency" }, lang)}</label>
            <select className={inputCls} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })}>
              <option value="USD">USD ($)</option>
              <option value="CNY">CNY (¥)</option>
              <option value="USDT">USDT (₮)</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>{t({ zh: "技能需求（逗号分隔）", en: "Skills (comma separated)" }, lang)}</label>
          <input className={inputCls} placeholder="Python, React, AWS" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>{t({ zh: "具体要求", en: "Requirements" }, lang)}</label>
          <textarea className={inputCls + " resize-none"} rows={2} placeholder={lang === "zh" ? "对投标者的具体要求..." : "Specific requirements for applicants..."} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>{t({ zh: "发布者名称", en: "Poster Name" }, lang)} *</label>
          <input className={inputCls} placeholder={lang === "zh" ? "你的昵称" : "Your nickname"} value={form.posterName} onChange={(e) => setForm({ ...form, posterName: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{t({ zh: "微信号", en: "WeChat ID" }, lang)}</label>
            <input className={inputCls} placeholder="WeChat ID" value={form.contactWechat} onChange={(e) => setForm({ ...form, contactWechat: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>{t({ zh: "邮箱", en: "Email" }, lang)}</label>
            <input className={inputCls} type="email" placeholder="email@example.com" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          </div>
        </div>
        <button onClick={handlePublish} className="btn-cta w-full text-center mt-2" disabled={!form.title || !form.description || !form.budget || !form.posterName}>
          {t({ zh: "发布任务", en: "Publish Task" }, lang)}
        </button>
      </div>
    </Modal>
  );
}

// ─── Task Card ───────────────────────────────────────────────────────────────
function TaskCard({
  task,
  lang,
  index,
  onClick,
}: {
  task: Task;
  lang: "zh" | "en";
  index: number;
  onClick: () => void;
}) {
  const isLongTerm = task.type === "long-term" || task.type === "adoption";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl p-5 cursor-pointer flex flex-col gap-3"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(task.type)}`}>
            {getTypeLabel(task.type, lang)}
          </span>
          {(() => {
            const badge = getEscrowBadge(task.escrowStatus, task.depositConfirmed);
            return badge ? (
              <span className={`text-xs px-2 py-0.5 rounded-full border ${badge.color}`}>
                {badge.icon} {badge.label}
              </span>
            ) : null;
          })()}
        </div>
        <span className="text-lobster-text/30 text-xs whitespace-nowrap">
          {formatPostedAt(task.postedAt)}{t({ zh: "前", en: " ago" }, lang)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-lobster-text font-heading leading-snug">
        {lang === "zh" ? task.title : task.titleEn}
      </h3>

      {/* Budget */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-lobster-accent neon-text">
          {formatCurrency(task.budget, task.currency)}
        </span>
        {isLongTerm && (
          <span className="text-xs text-lobster-text/50">{t({ zh: "/月", en: "/mo" }, lang)}</span>
        )}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {task.skills.slice(0, 4).map((s) => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-lobster-deep/50 text-lobster-text/70 border border-lobster-deep/40">
            {s}
          </span>
        ))}
        {task.skills.length > 4 && (
          <span className="text-xs text-lobster-text/40">+{task.skills.length - 4}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-lobster-deep/40">
        <div className="flex items-center gap-1.5">
          <span>{task.posterAvatar}</span>
          <span className="text-xs text-lobster-text/50">{task.posterName}</span>
        </div>
        <span className="text-xs text-lobster-secondary hover:text-lobster-accent transition-colors">
          {t({ zh: "查看详情 →", en: "View Details →" }, lang)}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Tasks Page ─────────────────────────────────────────────────────────
export default function TasksPage() {
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [filterType, setFilterType] = useState<TaskType | "all">("all");
  const [filterCurrency, setFilterCurrency] = useState<Currency | "all">("all");
  const [filterSkill, setFilterSkill] = useState("");
  const [toast, setToast] = useState("");

  // Load tasks from localStorage + seed
  useEffect(() => {
    const saved = localStorage.getItem("lobster_lang") as "zh" | "en" | null;
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("lobster_tasks");
    let loaded: Task[] = [];
    if (stored) {
      loaded = JSON.parse(stored);
    }
    // Merge seed tasks that don't exist locally
    const seedIds = new Set(SEED_TASKS.map((t) => t.id));
    const localIds = new Set(loaded.map((t) => t.id));
    const merged = [
      ...SEED_TASKS.filter((t) => !localIds.has(t.id)),
      ...loaded,
    ];
    // Only re-seed if nothing in localStorage
    if (loaded.length === 0) {
      localStorage.setItem("lobster_tasks", JSON.stringify(SEED_TASKS));
      setTasks(SEED_TASKS);
    } else {
      setTasks(loaded);
    }
  }, []);

  // Persist language preference
  useEffect(() => {
    localStorage.setItem("lobster_lang", lang);
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));

  const handlePosted = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
    setToast(lang === "zh" ? "任务已发布！" : "Task posted!");
    setTimeout(() => setToast(""), 3000);
  };

  // All unique skills for filter
  const allSkills = Array.from(new Set(tasks.flatMap((t) => t.skills))).sort();

  // Filtered tasks
  const filtered = tasks.filter((t) => {
    if (filterType !== "all" && t.type !== filterType) return false;
    if (filterCurrency !== "all" && t.currency !== filterCurrency) return false;
    if (filterSkill && !t.skills.some((s) => s.toLowerCase().includes(filterSkill.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="min-h-screen lobster-bg text-lobster-text relative">
      {/* Bubbles */}
      <div className="bubbles-container" aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => ({
          id: i,
          left: `${Math.random() * 100}%`,
          size: Math.random() * 10 + 4,
          duration: Math.random() * 8 + 6,
          delay: Math.random() * 8,
          color: Math.random() > 0.5 ? "#FF6B35" : "#4ECDC4",
          opacity: Math.random() * 0.3 + 0.05,
        })).map((b) => (
          <div
            key={b.id}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle at 30% 30%, ${b.color}, transparent)`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              opacity: b.opacity,
              border: `1px solid ${b.color}`,
            }}
          />
        ))}
      </div>

      {/* Nav (same as landing) */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦞</span>
            <Link href="/" className="font-heading font-bold text-lobster-text tracking-wide hover:text-lobster-accent transition-colors">
              流浪龙虾
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-lobster-text/70">
            <Link href="/#about" className="hover:text-lobster-accent transition-colors">什么是龙虾</Link>
            <Link href="/#features" className="hover:text-lobster-accent transition-colors">核心功能</Link>
            <Link href="/tasks" className="text-lobster-accent hover:text-lobster-secondary transition-colors font-bold">任务大厅</Link>
            <Link href="/#join" className="hover:text-lobster-accent transition-colors">加入漂流</Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="relative pt-28 pb-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl lobster-glow">🦞</span>
            <h1 className="text-4xl md:text-5xl font-black font-heading neon-text text-lobster-accent">
              {lang === "zh" ? "任务大厅" : "Task Board"}
            </h1>
          </div>
          <p className="text-lobster-text/60 text-lg max-w-xl mx-auto">
            {lang === "zh"
              ? "自由职业者的技能撮合市场，让龙虾们找到合适的码头"
              : "Freelancer skill-matching marketplace. Find your dock."}
          </p>
          {/* Lang toggle */}
          <button
            onClick={toggleLang}
            className="mt-4 inline-flex items-center gap-2 text-xs px-4 py-1.5 rounded-full border border-lobster-deep/60 text-lobster-text/60 hover:border-lobster-secondary hover:text-lobster-secondary transition-all"
          >
            <span className={lang === "zh" ? "text-lobster-accent font-bold" : ""}>中文</span>
            <span>/</span>
            <span className={lang === "en" ? "text-lobster-accent font-bold" : ""}>EN</span>
          </button>
        </motion.div>
      </div>

      {/* Filters + Post Button */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-3">
          {/* Type filters */}
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <span className="text-xs text-lobster-text/40 uppercase tracking-wider font-bold">{lang === "zh" ? "类型" : "Type"}:</span>
            {([
              { value: "all", zh: "全部", en: "All" },
              { value: "one-time", zh: "一次性", en: "One-time" },
              { value: "long-term", zh: "长期", en: "Long-term" },
              { value: "adoption", zh: "代养", en: "Adoption" },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterType(opt.value as TaskType | "all")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  filterType === opt.value
                    ? "bg-lobster-accent/20 border-lobster-accent text-lobster-accent"
                    : "border-lobster-deep/60 text-lobster-text/50 hover:border-lobster-text/30 hover:text-lobster-text"
                }`}
              >
                {lang === "zh" ? opt.zh : opt.en}
              </button>
            ))}
          </div>

          {/* Currency filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-lobster-text/40 uppercase tracking-wider font-bold">{lang === "zh" ? "货币" : "Currency"}:</span>
            {([
              { value: "all", zh: "全部", en: "All" },
              { value: "USD", zh: "$ USD", en: "$ USD" },
              { value: "CNY", zh: "¥ CNY", en: "¥ CNY" },
              { value: "USDT", zh: "₮ USDT", en: "₮ USDT" },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterCurrency(opt.value as Currency | "all")}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  filterCurrency === opt.value
                    ? "bg-lobster-secondary/20 border-lobster-secondary text-lobster-secondary"
                    : "border-lobster-deep/60 text-lobster-text/50 hover:border-lobster-text/30 hover:text-lobster-text"
                }`}
              >
                {lang === "zh" ? opt.zh : opt.en}
              </button>
            ))}
          </div>

          {/* Skill search */}
          <input
            type="text"
            placeholder={lang === "zh" ? "搜索技能..." : "Search skills..."}
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="text-xs bg-lobster-deep/40 border border-lobster-deep/60 rounded-full px-4 py-1.5 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors w-40"
          />

          {/* Clear filters */}
          {(filterType !== "all" || filterCurrency !== "all" || filterSkill) && (
            <button
              onClick={() => { setFilterType("all"); setFilterCurrency("all"); setFilterSkill(""); }}
              className="text-xs text-lobster-text/40 hover:text-lobster-accent transition-colors underline"
            >
              {lang === "zh" ? "清除筛选" : "Clear"}
            </button>
          )}

          {/* Post button */}
          <button
            onClick={() => setShowPostModal(true)}
            className="btn-cta text-sm px-5 py-2 ml-auto whitespace-nowrap"
          >
            + {lang === "zh" ? "发布任务" : "Post Task"}
          </button>
        </div>
      </div>

      {/* Task Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-5xl mb-4">🦞</p>
            <p className="text-lobster-text/50 text-lg">{lang === "zh" ? "暂无任务" : "No tasks found"}</p>
            <p className="text-lobster-text/30 text-sm mt-2">{lang === "zh" ? "成为第一个发布者吧！" : "Be the first to post!"}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                lang={lang}
                index={i}
                onClick={() => setSelectedTask(task)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          lang={lang}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Post Task Modal */}
      <PostTaskModal
        open={showPostModal}
        onClose={() => setShowPostModal(false)}
        lang={lang}
        onPosted={handlePosted}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-[200] glass-card rounded-full px-6 py-3 text-lobster-secondary font-bold text-sm"
            style={{ boxShadow: "0 0 20px rgba(78,205,196,0.3)" }}
          >
            🎉 {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
