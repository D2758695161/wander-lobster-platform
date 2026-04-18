# 🦞 流浪龙虾 — 跨境外包任务平台

> 深海赛博朋克风格 · USDT 托管支付 · 中英双语

**在线地址:** https://d2758695161.github.io/wander-lobster-platform/

---

## 功能

- ✅ 用户注册 / 登录（邮箱 + GitHub OAuth）
- ✅ 任务发布 + 浏览 + 申请
- ✅ USDT TRC20 托管支付（平台钱包: `TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN`）
- ✅ 信誉评价系统（软壳 → 龙虾钳神）
- ✅ 任务状态流转（open → in_progress → completed → closed）
- ✅ 申请管理 + 选定 winner
- ✅ 个人主页 + 仪表盘

---

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | Next.js 14 (App Router) |
| 后端 | Supabase (PostgreSQL + Auth + Edge Functions) |
| 支付 | USDT TRC20（Trongrid API） |
| 部署 | Vercel / GitHub Pages |

---

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 填写 NEXT_PUBLIC_SUPABASE_URL 等

# 3. 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

---

## 完整部署

详见 [DEPLOY.md](./DEPLOY.md) — 20分钟部署到生产环境。

---

## 项目结构

```
lobster-platform/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx           # 首页
│   ├── tasks/             # 任务大厅 + 发布
│   ├── dashboard/         # 用户仪表盘
│   ├── profile/[id]/      # 公开档案
│   ├── register/          # 注册
│   └── login/            # 登录
├── lib/
│   ├── supabase.ts       # Supabase 客户端
│   └── types.ts          # TypeScript 类型
├── supabase/
│   ├── schema.sql        # 数据库 Schema + RLS
│   └── functions/         # Edge Functions (Deno)
│       ├── create-payment-address/
│       ├── verify-payment/
│       └── release-payment/
├── components/           # React 组件
├── public/               # 静态资源
├── SPEC.md              # 产品规格文档
└── DEPLOY.md           # 完整部署指南
```

---

## USDT 支付流程

```
发布任务 → 充值托管(TRC20) → 平台确认 → 开始工作
    → 验收通过 → 释放USDT → winner收到 → 互评
```

平台收取服务费: 5%（从托管金额中扣除）

---

## License

MIT — 欢迎 Fork 和贡献
