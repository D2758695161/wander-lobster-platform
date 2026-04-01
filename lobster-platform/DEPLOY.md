# 🦞 流浪龙虾平台 — 完整部署指南

> 部署时间: ~20分钟（不含 Supabase 申请等待）

---

## 第一步: 创建 Supabase 项目

1. 访问 https://supabase.com → **New Project**
2. 取名 `wander-lobster`，选择 **Singapore** 区域（延迟最低）
3. 设置数据库密码（保存好！）
4. 等待项目创建完成（约2分钟）

---

## 第二步: 运行数据库 Schema

1. 在 Supabase Dashboard → **SQL Editor**
2. 复制 `supabase/schema.sql` 的全部内容
3. 粘贴并点击 **Run**
4. 验证：左侧边栏应出现 `profiles`, `tasks`, `applications`, `transactions`, `reviews` 表

---

## 第三步: 获取 API Keys

在 Supabase Dashboard → **Settings → API**：

| 变量 | 位置 | 格式 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role | `eyJhbGci...` ⚠️保密 |

---

## 第四步: 配置 Supabase Auth

1. Dashboard → **Authentication → Providers → Email**
2. 启用 **Email/password** 登录
3. 可选：配置 **GitHub OAuth**（用户可用 GitHub 登录）

---

## 第五步: 部署 Edge Functions

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 关联项目
supabase link --project-ref YOUR_PROJECT_REF

# 部署 Edge Functions
cd supabase/functions
supabase functions deploy create-payment-address
supabase functions deploy verify-payment
supabase functions deploy release-payment

# 设置环境变量（用于调用 Trongrid API）
supabase secrets set TRONGRID_API_KEY=your-trongrid-key
```

**备选方案**（如果没有 Supabase CLI）：
直接在 Supabase Dashboard → **Database → Functions** 手动创建每个函数，将 `supabase/functions/*/index.ts` 的代码粘贴进去。

---

## 第六步: 部署到 Vercel

### 方式 A: GitHub 自动部署（推荐）

1. 将 `lobster-platform` 推送到 GitHub:
```bash
cd lobster-platform
git init
git add .
git commit -m "Initial commit"
gh repo create wander-lobster-platform --public --push
```

2. 登录 https://vercel.com → **Import Project**
3. 选择 `wander-lobster-platform` 仓库
4. 配置环境变量（在 Vercel Dashboard → Settings → Environment Variables）：
   - `NEXT_PUBLIC_SUPABASE_URL` = 你的 Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = 你的 anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = 你的 service role key ⚠️设为 Secret
5. Framework Preset: **Next.js**
6. 点击 **Deploy**

### 方式 B: 本地构建后上传

```bash
cd lobster-platform
npm install
npm run build

# 将 out/ 或 .next/ 目录部署到任何静态托管
```

---

## 第七步: 配置自定义域名（可选）

在 Vercel Dashboard → **Domains** 添加自定义域名：
- `wander-lobster.com` 或其他

---

## 架构概览

```
┌─────────────────────────────────────────────────────┐
│                    用户浏览器                        │
│         Next.js App (Vercel / Static)              │
└──────────────────┬──────────────────────────────────┘
                   │ REST API / Auth
                   ▼
┌─────────────────────────────────────────────────────┐
│               Supabase (PostgreSQL)                  │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐             │
│  │profiles │ │  tasks   │ │applications│            │
│  │reviews  │ │transactions│ │           │             │
│  └─────────┘ └──────────┘ └──────────┘             │
│                                                     │
│  Edge Functions (Deno):                             │
│  ┌────────────────────┐                              │
│  │create-payment-addr │ → 生成托管地址              │
│  │verify-payment      │ → 验证TRX链上充值           │
│  │release-payment     │ → 释放USDT给winner          │
│  └────────────────────┘                              │
└──────────────────┬──────────────────────────────────┘
                   │ Trongrid API
                   ▼
┌─────────────────────────────────────────────────────┐
│                 TRON 区块链                          │
│         平台钱包: TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN │
└─────────────────────────────────────────────────────┘
```

---

## 支付流程

1. **发任务** → 任务创建，状态=open
2. **充值托管** → 用户转账 USDT 到平台钱包，调用 `verify-payment` 确认链上交易
3. **开始工作** → 状态 → in_progress
4. **验收通过** → 调用 `release-payment` 将 USDT 从托管转给 winner
5. **完成** → 状态 → completed，双方可互评

---

## 验证部署成功

访问你的 Vercel 域名，应该看到流浪龙虾首页。尝试注册一个账号，登录后应该能访问仪表盘。

---

## 常见问题

**Q: Supabase 函数部署失败**
A: 检查 supabase CLI 版本 `supabase --version`，更新到最新版 `npm install -g supabase`

**Q: Auth 登录失败**
A: 检查 Supabase → Authentication → URL Configuration → Site URL 是否设置为你实际域名

**Q: 数据库表不存在**
A: 确认 schema.sql 在正确的 Supabase 项目中运行了

---

## 维护

- 数据库备份: Supabase Dashboard → Database → Backups
- 日志查看: Vercel Dashboard → Functions → Logs
- Edge Function 日志: `supabase functions logs <function-name>`
