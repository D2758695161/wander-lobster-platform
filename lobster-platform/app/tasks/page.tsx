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
  // ── 🆕 2026年4月新增高价值任务 ────────────────────────────────────
  {
    id: "new1",
    title: "🔥 SolFoundry T3 Bounty — AI Code Review GitHub App (400K FNDRY)",
    titleEn: "🔥 SolFoundry T3: AI Code Review GitHub App (400K FNDRY)",
    description: "在 SolFoundry 平台上实现 AI Code Review GitHub App，支持自动 PR 审查、代码质量评分、安全漏洞检测。FNDRY 代币奖励，400K FNDRY + USDC。",
    descriptionEn: "Implement AI Code Review GitHub App on SolFoundry — auto PR review, code quality scoring, security vulnerability detection. FNDRY token rewards: 400K FNDRY + USDC.",
    type: "one-time",
    budget: 400000,
    currency: "USD",
    skills: ["TypeScript", "GitHub API", "AI", "Code Review", "GitHub App"],
    deadline: "2026-05-30",
    posterName: "SolFoundry",
    posterAvatar: "🦀",
    contactWechat: "",
    contactEmail: "bounties@solfoundry.io",
    requirements: "有 GitHub App 开发经验；熟悉静态代码分析工具；有 AI 代码审查产品经验优先",
    requirementsEn: "GitHub App development experience; familiar with static code analysis tools; AI code review product experience a plus",
    postedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "new2",
    title: "🤖 Autonomous Bounty-Hunting Agent — Full AI Pipeline (400K FNDRY)",
    titleEn: "🤖 Autonomous Bounty-Hunting Agent — Full AI Pipeline (400K FNDRY)",
    description: "开发全自动 Bounty 猎手 Agent：扫描 GitHub Issues → 评估难度/ROI → Fork 仓库 → 实现代码 → 提交 PR。端到端自动化，FNDRY 代币奖励。",
    descriptionEn: "Build a fully autonomous bounty-hunting agent: scan GitHub Issues → assess difficulty/ROI → fork repo → implement code → submit PR. End-to-end automation, FNDRY token rewards.",
    type: "one-time",
    budget: 400000,
    currency: "USD",
    skills: ["Python", "GitHub API", "AI Agent", "LLM", "Automation", "OpenAI"],
    deadline: "2026-06-15",
    posterName: "SolFoundry",
    posterAvatar: "🦀",
    contactWechat: "",
    contactEmail: "bounties@solfoundry.io",
    requirements: "有 AI Agent 开发经验（LangChain/AutoGPT/类似框架）；熟悉 GitHub API 和 PR 提交流程；有自动化代码生成项目经验",
    requirementsEn: "AI Agent development experience (LangChain/AutoGPT/similar); familiar with GitHub API and PR submission; automated code generation project experience",
    postedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "new3",
    title: "📊 Interactive 3D Forge Visualization — WebGL (200K FNDRY)",
    titleEn: "📊 Interactive 3D Forge Visualization — WebGL (200K FNDRY)",
    description: "为 SolFoundry 平台开发 WebGL 3D 可视化界面，展示 AI Agent 工作流程、代码生成过程、PR 状态。交互式 3D 渲染，FNDRY 奖励。",
    descriptionEn: "Build WebGL 3D visualization for SolFoundry — showcase AI agent workflows, code generation processes, PR status. Interactive 3D rendering, FNDRY rewards.",
    type: "one-time",
    budget: 200000,
    currency: "USD",
    skills: ["WebGL", "Three.js", "TypeScript", "React", "3D Graphics"],
    deadline: "2026-05-15",
    posterName: "SolFoundry",
    posterAvatar: "🦀",
    contactWechat: "",
    contactEmail: "bounties@solfoundry.io",
    requirements: "有 WebGL/Three.js 实际项目经验；熟悉 React 3D 可视化；有数据可视化产品开发经验优先",
    requirementsEn: "WebGL/Three.js hands-on experience; familiar with React 3D visualization; data visualization product development a plus",
    postedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "new4",
    title: "🐙 Claude Code × Cursor Plugin — AI Pair Programming Integration",
    titleEn: "🐙 Claude Code × Cursor Plugin — AI Pair Programming Integration",
    description: "开发 Claude Code 和 Cursor IDE 的深度集成插件：共享上下文、同步代码片段、跨工具 AI 对话支持。打造最强 AI 结对编程体验。",
    descriptionEn: "Build deep integration between Claude Code and Cursor IDE: shared context, synchronized code snippets, cross-tool AI conversation support. Create the ultimate AI pair programming experience.",
    type: "one-time",
    budget: 15000,
    currency: "CNY",
    skills: ["TypeScript", "Cursor Plugin", "Claude Code", "AI IDE", "Node.js"],
    deadline: "2026-05-01",
    posterName: "LobsterDev_X",
    posterAvatar: "🦞",
    contactWechat: "lobster_dev_x",
    contactEmail: "dev@lobsterplatform.io",
    requirements: "有 Cursor/Windsurf 插件开发经验；熟悉 Claude Code API；有 AI IDE 工具链集成经验",
    requirementsEn: "Cursor/Windsurf plugin development experience; familiar with Claude Code API; AI IDE toolchain integration experience",
    postedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
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
    title: "MCP Server + Claude Agent 集成开发",
    titleEn: "MCP Server + Claude Agent Integration",
    description: "基于 Model Context Protocol 开发一个 MCP Server，接入企业知识库 API，支持 Claude Code 和 Cursor 自动工具调用。需实现资源模板和工具描述。",
    descriptionEn: "Build an MCP Server using Model Context Protocol, integrate with enterprise KB API, support Claude Code and Cursor auto tool-calling. Must implement resource templates and tool descriptions.",
    type: "one-time",
    budget: 18000,
    currency: "CNY",
    skills: ["MCP", "TypeScript", "Claude Code", "Cursor", "AI Agent"],
    deadline: "2026-05-15",
    posterName: "AI Startup Leo",
    posterAvatar: "🤖",
    contactWechat: "leo_ai_startup",
    contactEmail: "leo@aistartup.cn",
    requirements: "有 MCP 协议实际开发经验；熟悉 Claude Code 或 Cursor 插件开发；有 AI Agent 工具调用项目优先",
    requirementsEn: "Hands-on MCP protocol experience; familiar with Claude Code or Cursor plugin development; AI agent tool-calling projects a plus",
    postedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "c3",
    title: "AI 个人助手定制 — GPT-5o + Memory 系统",
    titleEn: "AI Personal Assistant - GPT-5o + Memory System",
    description: "开发一套 AI 个人助手，具备长期记忆（Supabase）、任务管理、日程提醒功能。支持微信/Telegram 接入，语音对话。",
    descriptionEn: "Build an AI personal assistant with long-term memory (Supabase), task management, and calendar reminders. WeChat/Telegram integration, voice dialogue support.",
    type: "one-time",
    budget: 25000,
    currency: "CNY",
    skills: ["OpenAI API", "Supabase", "WeChat Bot", "Telegram Bot", "Python"],
    deadline: "2026-05-30",
    posterName: "AI 极客老王",
    posterAvatar: "🧠",
    contactWechat: "ai_geek_wang",
    contactEmail: "wang@igeek.ai",
    requirements: "有 OpenAI API 完整项目经验；熟悉 Supabase 数据库设计；有微信/ Telegram Bot 开发经验",
    requirementsEn: "Full OpenAI API project experience; familiar with Supabase DB design; WeChat/Telegram bot development experience",
    postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
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
    title: "RAG 知识库问答系统 — 企业内部文档检索",
    titleEn: "RAG Knowledge Base Q&A System - Enterprise Doc Retrieval",
    description: "基于 RAG 架构开发企业内部知识库问答系统，支持 PDF/Word/Confluence 导入，向量检索（Milvus），支持中文语义搜索。",
    descriptionEn: "Build a RAG-based enterprise knowledge base Q&A system supporting PDF/Word/Confluence import, vector search (Milvus), and Chinese semantic search.",
    type: "one-time",
    budget: 30000,
    currency: "CNY",
    skills: ["RAG", "LangChain", "Milvus", "Python", "FastAPI", "Embeddings"],
    deadline: "2026-06-15",
    posterName: "Enterprise AI 解决方案商",
    posterAvatar: "🏢",
    contactWechat: "enterprise_ai_sol",
    contactEmail: "contact@enterpriseai.cn",
    requirements: "有 RAG 项目完整经验；熟悉 LangChain 和向量数据库；有企业知识库实施案例优先",
    requirementsEn: "Complete RAG project experience; familiar with LangChain and vector DB; enterprise KB implementation cases a plus",
    postedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "c6",
    title: "AI 短视频脚本生成工具 — SaaS 产品开发",
    titleEn: "AI Short Video Script Generator - SaaS Product",
    description: "开发一款 SaaS 产品，根据产品链接/描述自动生成 TikTok/抖音短视频脚本，包含开场钩子、卖点话术、行动号召。需登录+订阅支付。",
    descriptionEn: "Build a SaaS product that auto-generates TikTok/short-video scripts from product links/descriptions, including hooks, selling points, and CTAs. Requires login + subscription payments.",
    type: "one-time",
    budget: 15000,
    currency: "CNY",
    skills: ["Next.js", "Stripe", "OpenAI API", "SaaS", "TypeScript"],
    deadline: "2026-06-01",
    posterName: "短视频工具创业公司",
    posterAvatar: "🎬",
    contactWechat: "shortvideo_saas",
    contactEmail: "founders@shortvid.io",
    requirements: "有完整 SaaS 产品开发经验；熟悉 Stripe 订阅支付集成；有短视频/内容创作工具经验优先",
    requirementsEn: "Full SaaS product development experience; Stripe subscription integration; short video/content creation tool experience a plus",
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
  // ── 2026春季新需求 ─────────────────────────────────────────────
  {
    id: "n1",
    title: "MCP Server + Claude Desktop 集成开发",
    titleEn: "MCP Server + Claude Desktop Integration",
    description: "开发一个 MCP Server，接入 Claude Desktop，使 Claude 能直接操控你的 SaaS 产品（阅读数据、发送通知、更新状态）。需要提供完整的安装配置文档。",
    descriptionEn: "Build an MCP Server for Claude Desktop integration — let Claude directly operate your SaaS product (read data, send notifications, update status). Complete installation guide required.",
    type: "one-time",
    budget: 12000,
    currency: "CNY",
    skills: ["MCP", "TypeScript", "Claude API", "Node.js"],
    deadline: "2026-05-15",
    posterName: "AIStartup",
    posterAvatar: "🤖",
    contactWechat: "AIStartup2026",
    contactEmail: "dev@aistartup.cn",
    requirements: "有 MCP SDK 实际开发经验；熟悉 Claude API 工具调用机制；有 SaaS API 集成案例优先",
    requirementsEn: "Hands-on MCP SDK experience; familiar with Claude API tool calling; SaaS API integration portfolio preferred",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "n2",
    title: "GPT-5o 语音实时对话 Agent 开发",
    titleEn: "GPT-5o Realtime Voice Agent Development",
    description: "基于 OpenAI GPT-5o Realtime API 开发一个语音对话 Agent，支持打断、静默检测、流式回复，支持 WebRTC 前端接入。",
    descriptionEn: "Build a voice conversational agent using OpenAI GPT-5o Realtime API, supporting interruption, silence detection, streaming responses, with WebRTC frontend integration.",
    type: "one-time",
    budget: 8000,
    currency: "USD",
    skills: ["OpenAI API", "WebRTC", "Python", "Voice AI"],
    deadline: "2026-05-01",
    posterName: "VoiceLabs",
    posterAvatar: "🎙️",
    contactWechat: "VoiceLabsDev",
    contactEmail: "hello@voicelabs.io",
    requirements: "有 GPT-5o Realtime API 使用经验；有 WebRTC 开发经验；可提供语音通话类产品 Demo",
    requirementsEn: "GPT-5o Realtime API experience; WebRTC development experience; voice product demo preferred",
    postedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "n3",
    title: "AI 简历优化 Agent — LangChain + RAG",
    titleEn: "AI Resume Optimizer - LangChain + RAG",
    description: "开发一个 AI 简历优化 Agent：上传简历 PDF，RAG 检索 JD 库，生成针对特定岗位的优化建议和重写版本。支持批量处理和 API 调用。",
    descriptionEn: "Build an AI resume optimizer: upload resume PDF, use RAG to search JD database, generate job-specific optimization suggestions and rewritten version. Support batch processing and API calls.",
    type: "long-term",
    budget: 6000,
    currency: "CNY",
    skills: ["LangChain", "RAG", "Python", "PDF Processing", "LLM"],
    deadline: "2026-06-01",
    posterName: "CareerBoost",
    posterAvatar: "📄",
    contactWechat: "CareerBoostAI",
    contactEmail: "team@careerboost.cn",
    requirements: "有 LangChain RAG 实战经验；熟悉 PDF 解析（PyMuPDF/pdfplumber）；有 LLM 微调或提示词工程经验",
    requirementsEn: "Hands-on LangChain RAG experience; familiar with PDF parsing (PyMuPDF/pdfplumber); LLM fine-tuning or prompt engineering experience",
    postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "n4",
    title: "Cursor IDE 自定义规则集 + MCP 工具链",
    titleEn: "Cursor IDE Custom Rules + MCP Toolchain",
    description: "为 Cursor IDE 编写一套自定义规则集（rules.md），覆盖 React/Next.js/TypeScript 最佳实践，并集成 3 个 MCP 工具（文件搜索、代码审查、API 测试）。",
    descriptionEn: "Write a custom ruleset (rules.md) for Cursor IDE covering React/Next.js/TypeScript best practices, integrated with 3 MCP tools (file search, code review, API testing).",
    type: "one-time",
    budget: 4500,
    currency: "CNY",
    skills: ["Cursor", "MCP", "TypeScript", "React", "Next.js"],
    deadline: "2026-04-30",
    posterName: "CursorPower",
    posterAvatar: "⚡",
    contactWechat: "CursorPowerDev",
    contactEmail: "dev@cursorpower.io",
    requirements: "深度使用 Cursor IDE；有 rules.md 编写经验；熟悉 React/Next.js 全家桶",
    requirementsEn: "Deep Cursor IDE usage; rules.md authoring experience; familiar with React/Next.js ecosystem",
    postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "n5",
    title: "数字游民助手 — AI 日程 + 异步协作工具",
    titleEn: "Digital Nomad Assistant - AI Schedule + Async Collab",
    description: "开发一个面向数字游民的 AI 助手：跨时区日程管理、异步任务分配、AI 会议纪要生成，支持多语言和 Telegram/Discord 接入。",
    descriptionEn: "Build an AI assistant for digital nomads: cross-timezone schedule management, async task distribution, AI meeting minutes, multilingual support, Telegram/Discord integration.",
    type: "adoption",
    budget: 1000,
    currency: "USD",
    skills: ["Telegram Bot", "Discord Bot", "Python", "AI Scheduling", "Async"],
    deadline: "2026-12-31",
    posterName: "NomadTools",
    posterAvatar: "🌍",
    contactWechat: "NomadToolsDev",
    contactEmail: "hello@nomadtools.io",
    requirements: "有 Telegram/Discord Bot 完整开发经验；有 AI 日程或异步协作类产品经验优先",
    requirementsEn: "Complete Telegram/Discord Bot development experience; AI scheduling or async collab product experience preferred",
    postedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "n6",
    title: "Cursor AI IDE 插件 — 项目代码库 RAG 问答",
    titleEn: "Cursor AI IDE Plugin - Codebase RAG Q&A",
    description: "开发 Cursor AI IDE 插件，基于项目代码库构建 RAG 向量索引，开发者可通过自然语言提问代码库相关问题，AI 给出精准答案和代码位置。",
    descriptionEn: "Build a Cursor AI IDE plugin that constructs a RAG vector index from project codebase. Developers can ask natural language questions about the codebase and get precise answers with code locations.",
    type: "one-time",
    budget: 20000,
    currency: "CNY",
    skills: ["TypeScript", "Cursor Plugin", "RAG", "Embeddings", "Vector DB"],
    deadline: "2026-06-30",
    posterName: "CodeTools Lab",
    posterAvatar: "💻",
    contactWechat: "codetools_lab",
    contactEmail: "dev@codetoolslab.io",
    requirements: "有 Cursor/Windsurf 插件开发经验；熟悉 RAG 和 Embeddings；有代码分析/搜索类工具开发经验优先",
    requirementsEn: "Cursor/Windsurf plugin development experience; familiar with RAG and Embeddings; code analysis/search tool development a plus",
    postedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "n7",
    title: "WebAgent 自动化测试平台 — 无头浏览器编排",
    titleEn: "WebAgent Automation Testing Platform - Headless Browser Orchestration",
    description: "开发一套 WebAgent 自动化测试平台，支持自然语言编写测试用例、Playwright 无头浏览器执行、AI 断言语断和报告生成。",
    descriptionEn: "Build a WebAgent automation testing platform supporting natural language test authoring, Playwright headless execution, AI assertion, and report generation.",
    type: "one-time",
    budget: 12000,
    currency: "USD",
    skills: ["Playwright", "TypeScript", "AI Agent", "Node.js", "Automation"],
    deadline: "2026-05-30",
    posterName: "TestBot AI",
    posterAvatar: "🧪",
    contactWechat: "testbot_ai",
    contactEmail: "founders@testbot.ai",
    requirements: "有 Playwright 完整项目经验；有 AI Agent 编排经验；有自动化测试平台开发案例优先",
    requirementsEn: "Full Playwright project experience; AI agent orchestration experience; automation testing platform portfolio a plus",
    postedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "n8",
    title: "AI Agent Memory 系统 — 跨会话持久化记忆",
    titleEn: "AI Agent Memory System - Cross-Session Persistent Memory",
    description: "为 AI Agent 构建持久化记忆系统：向量数据库存储会话摘要 + 重要事实，支持按时间/主题/重要性检索，使 AI 跨会话保持上下文。",
    descriptionEn: "Build a persistent memory system for AI agents: vector DB stores session summaries and key facts, supports retrieval by time/topic/importance, enabling AI to maintain context across sessions.",
    type: "long-term",
    budget: 6000,
    currency: "USD",
    skills: ["Supabase", "pgvector", "Python", "AI Agent", "Memory"],
    deadline: "2026-07-15",
    posterName: "MemoryAI",
    posterAvatar: "🧠",
    contactWechat: "memoryai_dev",
    contactEmail: "hello@memoryai.io",
    requirements: "有 pgvector/向量数据库实际项目经验；有 AI Agent 开发经验；熟悉会话管理和记忆机制",
    requirementsEn: "pgvector/vector DB hands-on experience; AI agent development experience; familiar with conversation management and memory mechanisms",
    postedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  // ── 2026年4月 新增 ─────────────────────────────────────────────
  {
    id: "apr01",
    title: "OpenAI o3/o4 Agent 工具调用集成 — Cursor/Windsurf 插件",
    titleEn: "OpenAI o3/o4 Agent Tool-Calling Integration — Cursor/Windsurf Plugin",
    description: "将 OpenAI 最新 o3/o4 模型的 Agent 工具调用能力集成到 Cursor IDE，支持函数调用、代码执行、多步骤推理展示。打造下一代 AI 编程体验。",
    descriptionEn: "Integrate OpenAI o3/o4 Agent tool-calling into Cursor IDE with function calling, code execution, and multi-step reasoning visualization.",
    type: "one-time",
    budget: 20000,
    currency: "CNY",
    skills: ["TypeScript", "Cursor Plugin", "OpenAI API", "AI Agent", "o3/o4"],
    deadline: "2026-04-30",
    posterName: "LobsterDev_X",
    posterAvatar: "🦞",
    contactWechat: "lobster_dev_x",
    contactEmail: "dev@lobsterplatform.io",
    requirements: "有 Cursor/Windsurf 插件完整开发经验；熟悉 OpenAI API 和函数调用机制；有 o3/o4 模型使用经验优先",
    requirementsEn: "Complete Cursor/Windsurf plugin development; familiar with OpenAI function calling; o3/o4 model experience a plus",
    postedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "apr02",
    title: "GitHub Actions AI 代码审查流水线 — 安全 + 质量双检",
    titleEn: "GitHub Actions AI Code Review Pipeline — Security + Quality",
    description: "搭建 GitHub Actions 自动化 CI/CD 流水线，集成 AI 代码审查：PR 提交自动触发安全扫描 + 代码质量评分，输出结构化报告。",
    descriptionEn: "Build GitHub Actions CI/CD pipeline with AI code review: auto security scan + code quality scoring on PR, output structured reports.",
    type: "one-time",
    budget: 12000,
    currency: "CNY",
    skills: ["GitHub Actions", "CI/CD", "Code Review", "Security", "AI"],
    deadline: "2026-05-15",
    posterName: "DevOps老刘",
    posterAvatar: "⚙️",
    contactWechat: "devops_liu",
    contactEmail: "liu@devops123.cn",
    requirements: "有 GitHub Actions 完整配置经验；有 Code Review 工具链（CodeQL/Semgrep）集成经验；有 AI 审查产品使用经验",
    requirementsEn: "Complete GitHub Actions experience; CodeQL/Semgrep integration; AI code review product experience",
    postedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "apr03",
    title: "Notion AI 助手 — 自动生成周报/月报插件",
    titleEn: "Notion AI Assistant — Auto Weekly/Monthly Report Plugin",
    description: "开发 Notion 插件，自动抓取项目数据（飞书/钉钉/Jira），用 AI 生成结构化周报/月报，支持一键发布到 Notion 页面。",
    descriptionEn: "Notion plugin that auto-grabs project data (Feishu/DingTalk/Jira) and generates structured weekly/monthly reports with AI, publishable to Notion.",
    type: "one-time",
    budget: 8000,
    currency: "CNY",
    skills: ["Notion API", "Feishu API", "AI Report", "Python", "Node.js"],
    deadline: "2026-05-01",
    posterName: "ProductMing",
    posterAvatar: "📊",
    contactWechat: "product_ming",
    contactEmail: "ming@producttools.cn",
    requirements: "有 Notion API 开发经验；有飞书/钉钉 API 集成经验；有 AI 报告生成项目经验",
    requirementsEn: "Notion API development; Feishu/DingTalk API integration; AI report generation project experience",
    postedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "apr04",
    title: "全自动化 GitHub Bounty 猎手 — LangGraph 多Agent协作",
    titleEn: "Fully Autonomous GitHub Bounty Hunter — LangGraph Multi-Agent",
    description: "基于 LangGraph 构建多Agent协作系统：扫描GitHub Issues → 评估Bounty价值 → Fork → 实现 → 提交PR，全流程无需人工介入。",
    descriptionEn: "LangGraph-based multi-agent: scan GitHub Issues → assess bounty value → fork → implement → submit PR, fully autonomous.",
    type: "one-time",
    budget: 35000,
    currency: "CNY",
    skills: ["LangGraph", "Python", "GitHub API", "AI Agent", "LLM"],
    deadline: "2026-06-01",
    posterName: "AIAutomationLab",
    posterAvatar: "🤖",
    contactWechat: "ai_auto_lab",
    contactEmail: "lab@aiautomation.io",
    requirements: "有 LangChain/LangGraph 完整项目经验；有 GitHub API 自动化项目经验；有代码生成 Agent 开发经验",
    requirementsEn: "LangChain/LangGraph full project; GitHub API automation; code generation agent development",
    postedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "apr05",
    title: "微信客服机器人 — AI 回复 + 订单查询 + 退换货",
    titleEn: "WeChat Customer Service Bot — AI Reply + Order Query + Returns",
    description: "企业微信客服机器人：AI 自动回复常见问题、查询订单状态、处理退换货请求，降低人工客服 80% 工作量。",
    descriptionEn: "WeChat Work customer service bot: AI auto-reply FAQs, order lookup, return/refund processing, reducing manual workload by 80%.",
    type: "adoption",
    budget: 3000,
    currency: "USD",
    skills: ["WeChat Work", "Python", "AI Bot", "E-commerce", "API"],
    deadline: "2026-06-30",
    posterName: "EcommZhang",
    posterAvatar: "🛍️",
    contactWechat: "ecomm_zhang",
    contactEmail: "zhang@ecomm123.cn",
    requirements: "有微信/企业微信机器人开发经验；有电商客服场景经验；有 AI 对话系统（意图识别/知识库）经验",
    requirementsEn: "WeChat/WeChat Work bot development; e-commerce customer service; AI dialogue (intent recognition/KB) experience",
    postedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  // ── 🆕 2026年4月9日新增任务 ───────────────────────────────────
  {
    id: "apr09-1",
    title: "🆕 OpenClaw AI Agent 技能市场集成 — 自动化任务流水线",
    titleEn: "🆕 OpenClaw AI Agent Skill Marketplace Integration — Auto Task Pipeline",
    description: '将 OpenClaw 技能市场（ClawHub）集成到流浪龙虾平台：支持技能一键安装、AI Agent 自动任务分配、结果自动上传到龙虾平台。打造 AI Agent 版的「应用商店」体验。',
    descriptionEn: 'Integrate OpenClaw ClawHub skill marketplace into Wander Lobster: one-click skill install, AI agent auto task routing, results auto-posted to platform. Build an app store experience for AI agents.',
    type: "one-time",
    budget: 25000,
    currency: "CNY",
    skills: ["Node.js", "OpenClaw", "AI Agent", "API Integration", "TypeScript"],
    deadline: "2026-05-20",
    posterName: "LobsterPlatform",
    posterAvatar: "🦞",
    contactWechat: "drift_lobster",
    contactEmail: "dev@lobsterplatform.io",
    requirements: "有 OpenClaw 或类似 AI Agent 框架使用经验；熟悉 npm 包发布和 CLI 工具开发；有平台集成经验优先",
    requirementsEn: "OpenClaw or similar AI agent framework experience; familiar with npm package publishing and CLI tools; platform integration experience a plus",
    postedAt: new Date().toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "apr09-2",
    title: "🆕 MiniMax 视频生成 API × TikTok 素材批量生产工具",
    titleEn: "🆕 MiniMax Video Gen API × TikTok Content Batch Producer",
    description: "基于 MiniMax video-01 API 开发 TikTok 短视频素材批量生产工具：输入产品链接/描述 → AI 生成脚本 → 自动生成视频 → 批量导出。适合跨境电商卖家快速铺内容。",
    descriptionEn: "MiniMax video-01 API powered TikTok short video batch producer: product link/description → AI script → auto video → batch export. For cross-border e-commerce sellers flooding content.",
    type: "one-time",
    budget: 18000,
    currency: "CNY",
    skills: ["Python", "MiniMax API", "Video Generation", "TikTok API", "Automation"],
    deadline: "2026-05-15",
    posterName: "TikTokGrowth",
    posterAvatar: "🎬",
    contactWechat: "tiktok_growth_hn",
    contactEmail: "growth@tiktokops.cn",
    requirements: "有 MiniMax API 或类似视频生成 API 使用经验；有 TikTok/抖音内容创作工具开发经验优先；有批量自动化脚本经验",
    requirementsEn: "MiniMax API or similar video gen API experience; TikTok/Douyin content creation tool development a plus; batch automation scripting",
    postedAt: new Date().toISOString(),
    escrowStatus: "unpaid",
    depositConfirmed: false,
    selectedWorker: null,
    applications: [],
  },
  {
    id: "apr09-3",
    title: "🆕 AI 简历优化师 — GPT-5o + 简历评分 + 关键词优化 SaaS",
    titleEn: "🆕 AI Resume Optimizer — GPT-5o + Resume Scorer + Keyword Optimizer SaaS",
    description: "开发一款 AI 简历优化 SaaS：上传简历 PDF → GPT-5o 分析 → ATS 评分 → 关键词优化建议 → 导出高分简历。支持微信登录和 USDT 支付。",
    descriptionEn: "Build an AI resume optimization SaaS: upload resume PDF → GPT-5o analysis → ATS score → keyword optimization → export high-score resume. WeChat login + USDT payment.",
    type: "one-time",
    budget: 12000,
    currency: "USD",
    skills: ["Next.js", "GPT-5o API", "PDF Parsing", "Stripe", "Supabase", "TypeScript"],
    deadline: "2026-05-25",
    posterName: "CareerAI",
    posterAvatar: "📄",
    contactWechat: "career_ai_hr",
    contactEmail: "hello@careerai.tools",
    requirements: "有完整 SaaS 产品开发经验；熟悉 PDF 解析（pdf-parse/pdf.js）；有 ATS 简历系统开发经验优先",
    requirementsEn: "Full SaaS product development; PDF parsing (pdf-parse/pdf.js); ATS resume system development experience a plus",
    postedAt: new Date().toISOString(),
    escrowStatus: "deposited",
    depositConfirmed: true,
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
    // Also notify via Formspree so I can track submissions
    fetch('https://formspree.io/f/xpwzvodj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `[Task Posted] ${form.title}`,
        title: form.title,
        description: form.description,
        budget: `${form.budget} ${form.currency}`,
        skills: form.skills,
        deadline: form.deadline || 'TBD',
        contact: `${form.posterName} | ${form.contactWechat || 'no wechat'} | ${form.contactEmail || 'no email'}`,
        posterName: form.posterName,
        contactWechat: form.contactWechat,
        contactEmail: form.contactEmail,
      }),
    }).catch(() => {});
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
