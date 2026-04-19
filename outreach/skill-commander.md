# 一筒团队技能配置方案
**角色：** 军师（技能配置官）
**制定日期：** 2026-04-18
**版本：** v1.0

---

## 一、技能现状盘点

### 1.1 已安装的 OpenClaw Skills（内置 + npm）

| # | Skill名称 | 来源 | 用途 | 状态 |
|---|-----------|------|------|------|
| 1 | `github` | 内置工具 | GitHub CLI/PR/Issue/API操作 | ✅ 可用 |
| 2 | `gh-issues` | 内置工具 | GitHub Issues自动化处理 | ✅ 可用 |
| 3 | `clawhub` | npm包 | 搜索/安装/发布skills | ✅ 可用 |
| 4 | `mcporter` | npm包 | MCP服务器/工具管理 | ✅ 可用 |
| 5 | `playwright` | npm包 | 浏览器自动化 | ✅ 已安装 |
| 6 | `nodemailer` | npm包 | 邮件发送(SMTP) | ✅ 已安装 |

### 1.2 workspace/skills 目录（已安装的技能）

| # | Skill目录 | 用途 | 说明 |
|---|-----------|------|------|
| 1 | `code-review-bot` | GitHub PR分析+审查清单 | ✅ 完整 |
| 2 | `email-daily-summary` | 邮箱登录+日报生成 | ⚠️ 依赖browser-use（未安装） |
| 3 | `find-skills` | ClawHub技能搜索 | ✅ 完整 |
| 4 | `github-bounty-hunter` | GitHub赏金猎取 | ✅ 完整+大量脚本 |
| 5 | `memory-tiering` | 多层记忆管理 | ✅ 完整 |
| 6 | `playwright-browser-automation` | Playwright API封装 | ✅ 完整 |
| 7 | `proactive-agent` | 主动自动化架构 | ✅ 完整 |
| 8 | `skill-gap-finder` | 技能缺口分析 | ✅ 完整 |
| 9 | `skill-vetter` | 安全审查新技能 | ✅ 完整 |

### 1.3 workspace/skills 目录（非Skill文件）

| 文件 | 用途 |
|------|------|
| `email-outreach-automation.md` | 外联自动化思路（非Skill） |
| `github-bounty-workflow.md` | Bounty工作流（非Skill） |
| `search-memory.js` | 记忆搜索脚本 |
| `TEMPLATE.md` | Skill模板 |

### 1.4 已有的外联脚本（outreach目录）

| 脚本 | 功能 |
|------|------|
| `send-email.js / send-emails.py` | 邮件发送 |
| `cold-email-template.txt` | 冷邮件模板 |
| `lead-research.py` 系列 | 线索研究 |
| `browser_search.js / browse.js` | 浏览器搜索 |
| `github-outreach.md` | GitHub外联方案 |

### 1.5 内置工具清单

| 工具 | 用途 | 状态 |
|------|------|------|
| `exec` | 运行shell/node/python脚本 | ✅ |
| `playwright__browser_*` | 浏览器自动化全套 | ✅ |
| `image_generate` | MiniMax图片生成（200张/天） | ✅ |
| `video_generate` | MiniMax视频生成（6个/天） | ✅ |
| `music_generate` | MiniMax音乐生成（7首/天） | ✅ |
| `web_search` | DuckDuckGo搜索 | ✅ |
| `web_fetch` | 网页内容抓取 | ✅ |
| `gh` CLI | GitHub操作 | ✅ |
| SMTP (nodemailer) | 邮件发送 | ✅ |

---

## 二、技能缺口分析

### 2.1 按业务需求分类的缺口

#### 🐦 Twitter/X 运营
**缺口：** 无Twitter发帖Skill
**现状：** 只能手动发或用Playwright脚本临时写
**影响：** 无法自动化批量发帖，浪费时间
**获取方式：** ClawHub安装 `twitter-post` 或 `x-twitter-poster`

#### 📧 冷邮件外联
**缺口：** 无结构化的邮件外联Skill
**现状：** 有零散脚本（`send-email.js`），但无完整序列管理
**影响：** 无法做3-5天邮件序列，无法追踪打开率/回复率
**获取方式：** ClawHub安装 `cold-email-outreach` 或 `email-outreach-ops`

#### 📱 社交媒体综合运营
**缺口：** 无统一的社交媒体管理Skill
**现状：** Twitter/Reddit/Hacker News需要分别手动操作
**影响：** 多平台运营效率低，容易漏发
**获取方式：** ClawHub安装 `social-media-scheduler` 或 `social-media-agent`

#### 🧵 Reddit 运营
**缺口：** 无Reddit Skill
**现状：** 需要用Playwright临时写脚本
**影响：** 无法自动化养号/发帖
**获取方式：** ClawHub安装 `reddit-post-lab` 或 `reddit-marketing-geo`

#### 📣 Product Hunt 发布
**缺口：** 无Product Hunt Skill
**现状：** 需要手动研究发布流程
**影响：** 错过最佳发布时间窗口
**获取方式：** ClawHub安装 `product-hunt-launch`

#### 🏆 Hacker News
**缺口：** 无HN Skill
**现状：** 需要手动找Submit入口
**影响：** Show HN曝光机会浪费
**获取方式：** ClawHub安装 `hacker-news`

#### 💰 Upwork/自由职业
**缺口：** 无Upwork Skill
**现状：** 手动投标，效率低
**影响：** 无法快速建立客户来源
**获取方式：** ClawHub安装 `upwork-freelancer-ops` 或 `upwork-proposal-generator`

#### 🛒 数字产品上架
**缺口：** 无Gumroad/Etsy Skill
**现状：** 手动上架，效率低
**影响：** 产品数量上不去，被动收入慢
**获取方式：** ClawHub安装 `gumroad-admin` + `etsy-seller-helper`

#### 📊 收入监控
**缺口：** 无收入追踪Skill
**现状：** 手动记录各平台收入
**影响：** 无法及时发现收入变化
**获取方式：** ClawHub安装 `revenue-monitor`

#### 🎯 销售文案/Lead生成
**缺口：** 无销售文案Skill
**现状：** 依赖手工写外联邮件
**影响：** 转化率低，浪费时间
**获取方式：** ClawHub安装 `cold-email-personalization` 或 `cold-email-sequence`

### 2.2 缺口技能总表

| 优先级 | 技能名称 | 用途 | 来源 | 免费/付费 |
|--------|----------|------|------|-----------|
| P0 | `cold-email-outreach` | 冷邮件外联+序列 | ClawHub | 免费 |
| P0 | `twitter-post` | Twitter自动发帖 | ClawHub | 免费 |
| P0 | `social-media-scheduler` | 社交媒体调度 | ClawHub | 免费 |
| P1 | `product-hunt-launch` | PH发布 | ClawHub | 免费 |
| P1 | `reddit-marketing-geo` | Reddit营销 | ClawHub | 免费 |
| P1 | `hacker-news` | HN自动化 | ClawHub | 免费 |
| P1 | `upwork-freelancer-ops` | Upwork接单 | ClawHub | 免费 |
| P2 | `gumroad-admin` | Gumroad管理 | ClawHub | 免费 |
| P2 | `etsy-seller-helper` | Etsy上架 | ClawHub | 免费 |
| P2 | `revenue-monitor` | 收入监控 | ClawHub | 免费 |
| P2 | `cold-email-sequence` | 邮件序列 | ClawHub | 免费 |

---

## 三、技能获取优先级与执行方案

### 🏆 P0（本周必须安装，立即影响收入）

---

#### 技能1：`cold-email-outreach`（冷邮件外联自动化）

**为什么P0：**
- outreach-master.md 的核心执行依赖于邮件外联
- 48小时启动计划需要发送40封冷邮件
- 当前只有零散的send-email.js，无法做序列和追踪

**安装步骤：**
```bash
# 1. 搜索确认
npx clawhub search "cold-email-outreach"

# 2. 安装
npx clawhub install cold-email-outreach

# 3. 或者安装更完整的版本
npx clawhub install email-outreach-ops

# 4. 验证
npx clawhub list | findstr "email"
```

**配置建议：**
- SMTP：使用163邮箱（`smtp.163.com:465`，授权码 `TLfTvAJBC8QKxxre`）
- 或使用SendClaw API（`yitong_ai@sendclaw.com`）
- 邮件签名：统一使用 `outreach/cold-email-template.txt` 格式
- 发送频率：每批≤20封，间隔≥30分钟，避免进垃圾箱

**测试方法：**
```bash
# 发一封测试邮件到自己的163邮箱
node scripts/test-email.js "test@example.com"
```

---

#### 技能2：`twitter-post`（Twitter自动发帖）

**为什么P0：**
- marketing-ops.md 的P0平台是Twitter
- 需要每天发帖3-5条，纯手动效率太低
- 有爆款推文库（20条）需要分配到7天发完

**安装步骤：**
```bash
# 1. 安装
npx clawhub install twitter-post

# 2. 或者安装功能更全的
npx clawhub install x-twitter-poster

# 3. 查看安装后的文件
Get-ChildItem "$HOME/.openclaw/workspace/skills" -Filter "*twitter*"
```

**配置建议：**
- 账号：使用 `@yitong_ai` 或类似账号
- 发帖队列：`outreach/drafts/schedule.json`（已有结构）
- 图片：使用MiniMax生成的配图
- 发帖时间：北京时间22:00-01:00（对应美国白天）
- 防封：降低发帖频率（每天≤5条），增加真实互动

**测试方法：**
```bash
# 手动发一条测试推文
node scripts/twitter-post.js "Test tweet from 一筒团队 🦀"
```

---

#### 技能3：`social-media-scheduler`（社交媒体统一调度）

**为什么P0：**
- 同时运营Twitter/Reddit/HN/Dev.to，需要统一调度
- 当前分散在多个平台，无法批量管理
- Week 1每天都有发布任务，需要调度工具

**安装步骤：**
```bash
# 1. 安装
npx clawhub install social-media-scheduler

# 2. 或者更偏Agent的版本
npx clawhub install social-media-agent

# 3. 查看技能详情
npx clawhub info social-media-scheduler
```

**配置建议：**
- 平台列表：Twitter、Reddit、Hacker News、Dev.to
- 内容日历：`outreach/drafts/schedule.json` 对接
- MiniMax图片：直接调用 `image_generate` 工具生成配图
- 发帖队列：每日任务分发到各平台

**测试方法：**
```bash
# 测试调度脚本
node scripts/social-scheduler-test.js
```

---

### 🥈 P1（第二周安装，扩大流量来源）

---

#### 技能4：`product-hunt-launch`（Product Hunt发布）

**安装步骤：**
```bash
npx clawhub install product-hunt-launch
```

**配置建议：**
- 发布时间：周二/三（美国时间早上）
- 产品信息：GitHub Pages Shop 或 独立工具
- 素材：MiniMax生成的产品截图/视频
- 关键：真实截图+数据，避免被标记

---

#### 技能5：`reddit-marketing-geo`（Reddit营销）

**安装步骤：**
```bash
npx clawhub install reddit-marketing-geo
```

**配置建议：**
- 目标板块：r/Entrepreneur、r/SideProject、r/ArtificialIntelligence
- 先养号：每天点赞/评论5个帖子，持续2周
- 帖子内容：变现故事类（"I made ¥X in 30 days..."）
- 绝对规则：每帖间隔24-48小时，不发重复内容

---

#### 技能6：`hacker-news`（Hacker News自动化）

**安装步骤：**
```bash
npx clawhub install hacker-news
```

**配置建议：**
- 账号：提前注册，积累karma
- Show HN：发布工具类小产品（如GitHub issue tracker）
- 每周：1条有价值的评论/链接

---

#### 技能7：`upwork-freelancer-ops`（Upwork接单运营）

**安装步骤：**
```bash
npx clawhub install upwork-freelancer-ops
```

**配置建议：**
- Profile：突出AI自动化、OpenClaw、多模态能力
- 投标：聚焦Web3/AI工具/内容自动化类项目
- 费率：$25-$50/小时起，逐步涨价
- 每周投标：3-5个匹配项目

---

### 🥉 P2（第三/四周安装，补充收入闭环）

---

#### 技能8：`gumroad-admin`（Gumroad数字产品管理）

**安装步骤：**
```bash
npx clawhub install gumroad-admin
```

**配置建议：**
- 产品类型：AI封面、短视频模板、提示词合集
- 定价：$9-$29（低位起步，快速积累评价）
- 自动化：产品发货完全自动化

---

#### 技能9：`etsy-seller-helper`（Etsy卖家助手）

**安装步骤：**
```bash
npx clawhub install etsy-seller-helper
```

**配置建议：**
- 产品：AI生成封面、设计素材
- SEO：使用工具自动优化tags
- 上架目标：30天30个SKU

---

#### 技能10：`revenue-monitor`（收入监控）

**安装步骤：**
```bash
npx clawhub install revenue-monitor
```

**配置建议：**
- 监控：Gumroad、Etsy、GitHub Sponsors、USDT钱包
- 频率：每日检查一次
- 告警：收入异常（<预期50%）时通知

---

#### 技能11：`cold-email-sequence`（邮件序列）

**安装步骤：**
```bash
npx clawhub install cold-email-sequence
```

**配置建议：**
- 序列长度：3-5封
- 触发：用户留邮箱/购买后
- 内容：价值输出→产品介绍→限时优惠

---

## 四、新建Skill方案（需要自己创建）

### 4.1 需要自建的Skill

以下技能在ClawHub找不到完全匹配的，需要自己创建：

#### 📋 Skill A：`outreach-campaign-manager`（外联战役管理器）

**为什么自建：**
- ClawHub没有专门针对Web3+AI双赛道的冷外联Skill
- 需要整合：lead research + email + follow-up + tracking

**创建步骤：**

Step 1: 创建目录
```bash
New-Item -ItemType Directory -Path "$HOME/.openclaw/workspace/skills/outreach-campaign-manager"
```

Step 2: 创建 `SKILL.md`
```markdown
# Outreach Campaign Manager

管理从线索研究→邮件发送→跟进→成交的全流程

## 核心功能
- 线索生成（调用lead-research.py）
- 邮件发送（使用SMTP/163邮箱）
- 跟进提醒（3天无回复发第二封）
- 结果追踪（打开率/回复率）

## 使用方法
/run outreach-campaign [target-industry]
```

Step 3: 创建脚本目录
```bash
New-Item -ItemType Directory -Path "$HOME/.openclaw/workspace/skills/outreach-campaign-manager/scripts"
```

**整合现有脚本：**
- `leads-research.js` → 线索研究
- `cold-email-templates-v2.md` → 邮件模板
- `send-emails.py` → 发送邮件
- `email-results.json` → 追踪结果

---

#### 📋 Skill B：`digital-product-factory`（数字产品工厂）

**为什么自建：**
- 整合MiniMax的多模态能力（图片/视频/音乐）
- 按照survival-strategy.md的SKU流水线自动生产

**创建步骤：**

Step 1: 创建目录
```bash
New-Item -ItemType Directory -Path "$HOME/.openclaw/workspace/skills/digital-product-factory"
```

Step 2: SKILL.md 内容：
```markdown
# Digital Product Factory

将MiniMax多模态能力（图片/视频/音乐）批量转化为数字产品SKU

## 能力矩阵
- 🖼️ 图片：200张/天 → AI封面、Etsy素材
- 🎬 视频：6个/天 → TikTok模板、视频素材包
- 🎵 音乐：7首/天 → 视频背景音乐

## 工作流
1. 确定本周产品类型（封面/视频/音乐）
2. 批量生成（调用image_generate/video_generate）
3. 保存到 `digital-products/` 目录
4. 自动上架到 Gumroad/Etsy（调用对应Skill）

## 命令
/run generate-covers [数量]
/run generate-video-templates [数量]
```

---

#### 📋 Skill C：`twitter-content-engine`（Twitter内容引擎）

**为什么自建：**
- ClawHub的Twitter Skill多为基础发帖
- 需要整合：爆款推文库 + MiniMax配图 + 调度

**创建步骤：**

Step 1: 创建目录
```bash
New-Item -ItemType Directory -Path "$HOME/.openclaw/workspace/skills/twitter-content-engine"
```

Step 2: SKILL.md 内容：
```markdown
# Twitter Content Engine

自动化Twitter内容生产+发布

## 功能
- 爆款推文库读取（20条模板）
- MiniMax配图生成（调image_generate）
- 内容编排（按marketing-ops.md的日历）
- 定时发帖队列管理

## 推文类型矩阵
| 类型 | 频率 | 示例 |
|------|------|------|
| 变现故事 | 每天1条 | "I made ¥X in 30 days..." |
| 工具推荐 | 每2天1条 | "This free AI stack saves me 10h/week" |
| Thread | 每周1条 | 完整技巧教程thread |
```

---

## 五、自动化工作流设计

### 5.1 每日自动化流水线

```
┌─────────────────────────────────────────────────────────────┐
│                    每日心跳触发                              │
├─────────────────────────────────────────────────────────────┤
│  1. 检查 outreach/drafts/schedule.json 是否有待发内容         │
│  2. 如有 → 触发 twitter-content-engine                      │
│  3. 如有 → 触发 reddit-marketing-geo（每2天一次）             │
│  4. 生成当天需要的MiniMax配图                                │
│  5. 发送当天待发的cold email（≤20封）                        │
│  6. 汇总当日数据写入 memory/YYYY-MM-DD.md                    │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 每周自动化流水线

```
周一：Dev.to文章发布（调用playwright发布）
周二：Product Hunt检查/准备
周三：Hacker News提交Show HN
周四：Reddit长帖发布
周五：本周数据复盘 + 下周计划
周末：MiniMax批量生产下周配图（50张）
```

### 5.3 被动收入自动化流水线

```
┌─────────────────────────────────────────────────────────────┐
│                  数字产品生产流水线                            │
├─────────────────────────────────────────────────────────────┤
│  触发：每周六 或 配额充足时                                   │
│  1. digital-product-factory: 生成20个AI封面                 │
│  2. digital-product-factory: 生成5个视频模板                 │
│  3. gumroad-admin: 自动上架新产品                           │
│  4. etsy-seller-helper: 自动上架到Etsy                      │
│  5. 发送新品发布推文（twitter-content-engine）              │
└─────────────────────────────────────────────────────────────┘
```

---

## 六、执行时间表

| 时间 | 动作 | 依赖 |
|------|------|------|
| **Day 1（今天）** | `clawhub install cold-email-outreach` | 立即 |
| **Day 1（今天）** | `clawhub install twitter-post` | 立即 |
| **Day 1（今天）** | `clawhub install social-media-scheduler` | 立即 |
| **Day 2** | 测试3个P0 Skill是否正常工作 | Day 1完成 |
| **Day 3** | 创建 `outreach-campaign-manager` Skill | P0 Skills |
| **Day 3** | 创建 `twitter-content-engine` Skill | twitter-post |
| **Day 7** | `clawhub install product-hunt-launch` | Day 1 |
| **Day 7** | `clawhub install reddit-marketing-geo` | Day 1 |
| **Day 7** | `clawhub install hacker-news` | Day 1 |
| **Day 10** | `clawhub install upwork-freelancer-ops` | Day 7 |
| **Day 14** | 创建 `digital-product-factory` Skill | MiniMax |
| **Day 14** | `clawhub install gumroad-admin` | Day 10 |
| **Day 14** | `clawhub install etsy-seller-helper` | Day 10 |
| **Day 21** | `clawhub install revenue-monitor` | Gumroad/Etsy |
| **Day 21** | `clawhub install cold-email-sequence` | cold-email-outreach |

---

## 七、预算与资源约束

| 资源 | 限制 | 备注 |
|------|------|------|
| 时间预算 | Max-极速版（5小时/月） | 优先自动化，减少人工时间 |
| API调用 | 4500次/5小时 | 图片200张/天，视频6个/天 |
| 成本 | **¥0** | 所有Skills从ClawHub免费安装 |
| 付费工具 | 不使用 | 全部用免费+自建 |

**核心原则：**
- 能用ClawHub免费安装的，不自己写
- 能用现有脚本组合的，不新建Skill
- 必须自己写的Skill，要极度轻量
- 优先投资在**外联**和**数字产品**两个收入引擎上

---

## 八、风险与对策

| 风险 | 对策 |
|------|------|
| Skill安装失败 | 先用 `clawhub info [skill]` 查看依赖 |
| Twitter账号被封 | 降低发帖频率，用真实互动稀释 |
| 邮件进垃圾箱 | 标题多样化，避免敏感词，测试后再发 |
| 配额耗尽 | 优先用核心功能，非核心手动执行 |
| Skill与现有脚本冲突 | 先在隔离环境测试，再合并 |

---

## 九、验收标准

| 时间节点 | 验收条件 |
|----------|----------|
| Day 3 | P0三件套（cold-email-outreach/twitter-post/social-media-scheduler）全部可用 |
| Day 7 | 每天能自动发3条Twitter + 20封冷邮件 |
| Day 14 | Reddit/HN/PH三件套可用 |
| Day 21 | 数字产品流水线能自动生成+上架 |
| Day 30 | 技能体系完整，每周自动运转 |

---

*🦀 军师出品 | 法不禁止即可为*
*下一步：立即执行 Day 1 的三个安装命令*
