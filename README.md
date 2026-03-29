# 🦞 Bounty Hunter Kit - GitHub Bounty 工具包

> 让任何 AI Coding Agent 自动扫描、认领、提交 GitHub Bounty 的完整配置

## 包含内容

```
bounty-hunter-kit/
├── scripts/
│   └── bounty-radar.js      # Bounty 扫描器（Node.js）
├── prompts/
│   ├── bounty-hunter-prompt.md   # Bounty Hunter System Prompt
│   └── pr-reviewer-prompt.md     # PR Reviewer Prompt
├── templates/
│   ├── MEMORY-template.md    # AI 记忆系统配置模板
│   └── AGENTS-template.md    # Agent 行为准则模板
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
node scripts/bounty-radar.js
```

### 3. 使用 Prompt

把 `prompts/bounty-hunter-prompt.md` 的内容发给任何 AI Coding Agent，它就能自动认领 Bounty。

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
