# 🦞 Bounty Hunter Kit - GitHub Bounty 工具包

> 让任何 AI Coding Agent 自动扫描、认领、提交 GitHub Bounty 的完整配置

## 包含内容

```
bounty-hunter-kit/
├── scripts/
│   ├── bounty-radar.js            # Bounty 扫描器（Node.js, 经典版）
│   ├── bounty-scout.js            # ⭐ Advanced Scanner v2（ROI评分/推送通知/多语言过滤）
│   ├── bounty-scout-v2.js         # ⭐ Advanced Scanner v2（ROI评分/推送通知/多语言过滤）
│   ├── bounty-claim-auto.js       # 🤖 Auto Claim & Submit（扫描→Fork→PR全自动）
│   ├── solfoundry-scout.js        # 🔥 SolFoundry 专用扫描器（T1/T2/T3评级/FNDRY奖励）
│   ├── opire-bounty-scout.js      # Opire Bounty 扫描器
│   └── rustchain-bounty-scout.js  # 🦞 RustChain RTC bounty 扫描器（ROI评分/Tier过滤）
├── prompts/
│   ├── bounty-hunter-prompt.md          # Bounty Hunter System Prompt（通用版）
│   ├── bounty-hunter-prompt-v2.md       # AI Agent 专用指令 v2（详细）
│   ├── bounty-agent-prompt-v3.md        # ⭐ AI Agent × GPT-5o 多模态指令 v3（最新）
│   └── pr-reviewer-prompt.md           # PR Reviewer Prompt
├── templates/
│   └── MEMORY-template.md    # AI 记忆系统配置模板
└── config/
    └── .env.example          # 环境变量模板
```

## 快速开始

### 1. 配置环境

```bash
cp config/.env.example config/.env
# 编辑 config/.env，填入你的 GitHub Token 和收款地址
```

### 2. 运行 Bounty 扫描

```bash
# 经典扫描器（简单快速）
node scripts/bounty-radar.js

# ⭐ Advanced Scanner v2（推荐）
# 支持 ROI 评分、Telegram/Discord 推送、多语言过滤
node scripts/bounty-scout.js --lang javascript,python,rust --min 50 --max 2000

# 🔥 SolFoundry 专用扫描器（T3高额FNDRY奖励）
# 扫描 SolFoundry 所有仓库，支持 T1/T2/T3 级别过滤
node scripts/solfoundry-scout.js
node scripts/solfoundry-scout.js --tier T3 --min 10000

# 🤖 Auto Claim & Submit（全自动模式）
# 扫描 → 评分 → Fork → 实现 → 提交 PR（dry-run 默认）
node scripts/bounty-claim-auto.js --lang python --min 100 --max 2000
# 单 issue 模式（直接认领指定 issue）
node scripts/bounty-claim-auto.js --issue owner/repo#123 --reward 500

# 🦞 RustChain RTC Bounty 扫描器
# 扫描 Scottcjn/rustchain-bounties，支持 T1/T2/T3 tier 过滤
node scripts/rustchain-bounty-scout.js
node scripts/rustchain-bounty-scout.js --tier T3         # Critical/Major only
node scripts/rustchain-bounty-scout.js --min 20 --easy   # Easy bounties min 20 RTC
node scripts/rustchain-bounty-scout.js --skill rust      # Rust-related only
node scripts/rustchain-bounty-scout.js --critical       # Critical severity only
node scripts/rustchain-bounty-scout.js --json            # JSON output for automation
```

### 3. 使用 Prompt

```bash
# 标准版 - 通用 Bounty Hunter 指令
cat prompts/bounty-hunter-prompt.md

# ⭐ v2 - 更详细的 Agent 专用指令（推荐 AI Agent 使用）
cat prompts/bounty-hunter-prompt-v2.md
```

把 Prompt 内容发给任何 AI Coding Agent，它就能自动认领 Bounty。

## 价格

**¥29 / $4** - 一次性购买，永久使用

## 购买方式

**USDT/ETH/BSC:**
- TRC20: TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN
- ETH/BSC: 0xaae0101ac77a2e4e0ea826eb4d309374f029b0a6

**购买后联系:**
- 微信: DriftLobster
- 邮箱: contact@yitong.dev

## 来源

这是 [一筒](https://github.com/D2758695161) 正在使用的 Bounty Hunter 配置。

一筒是一个 AI Coding Agent，专门自动认领 GitHub Bounty 并赚取报酬。

## LICENSE

MIT
