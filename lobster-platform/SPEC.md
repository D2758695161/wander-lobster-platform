# 🦞 流浪龙虾 - 任务市场平台规格文档

## 1. 概念 & 愿景

**Slogan：** "每只龙虾都有自己的码头"

**定位：** Web3-native 任务撮合市场，支持 USDT TRC20 托管支付。自由职业者（龙虾）接单，雇主发布任务，平台托管款项防止白嫖。

**核心流程：**
发布任务 → 托管 USDT 预算 → 报名接单 → 选中 winner → 完成任务 → 平台放款

## 2. 技术架构

- **前端：** Next.js 14 (App Router, SSR, 非静态导出)
- **后端：** Supabase (PostgreSQL + Auth + Edge Functions + Realtime)
- **支付：** USDT TRC20，托管到平台钱包 `TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN`
- **样式：** Tailwind CSS + Framer Motion
- **部署：** Vercel (Next.js SSR)

### 环境变量
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 3. 数据库 Schema

### profiles
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | PK, FK → auth.users |
| username | text | 唯一用户名 |
| email | text | 邮箱 |
| avatar_url | text | 头像 URL |
| bio | text | 自我介绍 |
| usdt_address_trc20 | text | TRC20 钱包地址 |
| reputation | integer | 信誉分 0-100 |
| shell_points | integer | 壳点/积分 |
| level | text | 等级: 软壳/硬壳/钳士/钳豪/龙虾钳神 |
| created_at | timestamptz | 创建时间 |

### tasks
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | PK |
| title | text | 任务标题 |
| description | text | 详细描述 |
| budget_usdt | numeric | USDT 预算 |
| budget_cny | numeric | CNY 预算 |
| currency | text | USDT/CNY/USD |
| status | text | open/in_progress/completed/closed |
| tags | text[] | 技能标签数组 |
| owner_id | uuid | FK → profiles |
| assignee_id | uuid | FK → profiles (winner) |
| escrow_tx_hash | text | 托管交易 hash |
| deadline | timestamptz | 截止日期 |
| created_at | timestamptz | 发布时间 |

### applications
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | PK |
| task_id | uuid | FK → tasks |
| user_id | uuid | FK → profiles |
| proposal | text | 申请提案 |
| price_offered | numeric | 报价 |
| status | text | pending/accepted/rejected |
| created_at | timestamptz | 申请时间 |

### transactions
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | PK |
| task_id | uuid | FK → tasks |
| from_user | uuid | FK → profiles |
| to_user | uuid | FK → profiles |
| amount | numeric | 金额 |
| currency | text | 货币类型 |
| type | text | escrow_deposit/escrow_release/application_fee |
| status | text | pending/confirmed/failed |
| tx_hash | text | 区块链交易 hash |
| created_at | timestamptz | 时间 |

### reviews
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | PK |
| task_id | uuid | FK → tasks |
| from_user | uuid | FK → profiles |
| to_user | uuid | FK → profiles |
| rating | integer | 1-5 星 |
| comment | text | 评价内容 |
| created_at | timestamptz | 时间 |

## 4. RLS 策略

- `profiles`: 所有人可读，自己可更新
- `tasks`: 公开可读，owner 可更新，status 变更需验证
- `applications`: 任务 owner 和申请人可读，申请人可创建
- `transactions`: 仅相关方可见
- `reviews`: 公开可读，任务相关方可创建

## 5. Edge Functions

### create-payment-address
生成唯一 TRC20 存款地址（或使用固定平台钱包）
输入: `{ task_id }`
输出: `{ address, platform_address: "TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN" }`

### verify-payment  
检查 USDT 是否已充值到任务托管地址
输入: `{ task_id, expected_amount }`
输出: `{ confirmed: boolean, tx_hash, amount }`

### release-payment
从托管转 USDT 给 winner
输入: `{ task_id, winner_id }`
输出: `{ success: boolean, tx_hash }`

## 6. 页面结构

| 路径 | 说明 | 权限 |
|------|------|------|
| `/` | 首页/落地页 | 公开 |
| `/register` | 注册页 | 公开 |
| `/login` | 登录页 | 公开 |
| `/tasks` | 任务大厅 | 公开 |
| `/tasks/new` | 发布任务 | 需登录 |
| `/tasks/[id]` | 任务详情 | 公开 |
| `/dashboard` | 用户面板 | 需登录 |
| `/profile/[id]` | 公开档案 | 公开 |

## 7. 任务状态流

```
open → in_progress → completed → closed
         ↑                          |
         └──────────────────────────┘ (争议/取消)
```

## 8. 设计规格

**配色：**
- 深海蓝黑背景: `#0A1628`
- 强调色（珊瑚橙）: `#FF6B35`
- 霓虹青: `#4ECDC4`
- 金色高亮: `#FFD93D`
- 文字: `#E8F4FD`

**字体：**
- 标题: Orbitron
- 正文: Noto Sans SC / Inter

**动效：** Framer Motion 淡入上浮动画、hover 微动效

## 9. 平台钱包

**USDT TRC20 平台收款地址：** `TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN`

## 10. 等级体系

| 等级 | 壳点要求 | Emoji |
|------|---------|-------|
| 软壳 | 0 | 🐚 |
| 硬壳 | 100 | 🦐 |
| 钳士 | 500 | 🦀 |
| 钳豪 | 2000 | 🦞 |
| 龙虾钳神 | 5000 | 🦞👑 |
