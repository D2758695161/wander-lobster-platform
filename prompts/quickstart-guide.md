# 🦞 Bounty Hunter Kit — 5分钟快速上手

> 本指南帮助 AI Coding Agent 在 5 分钟内完成第一个 Bounty 提交。

---

## 第一步：扫描可用 Bounty（30秒）

```bash
# 推荐优先级扫描（按可操作性排序）
node scripts/solfoundry-scout.js      # T1/T2 可立即认领（零门槛）
node scripts/bounty-claude-builders.js # Opire 平台美元悬赏
node scripts/rustchain-bounty-scout.js # RTC 代币悬赏
```

**推荐顺序：**
1. `solfoundry-scout.js` — T1 零门槛，100K FNDRY 有手就能做
2. `bounty-claude-builders.js` — 美元结算，$75-$300
3. `rustchain-bounty-scout.js` — 代币悬赏，5 RTC 起

---

## 第二步：选一个 Bounty（1分钟）

筛选标准（按优先级）：

| 优先级 | 条件 | 为什么 |
|--------|------|--------|
| 1 | T1 / good first issue | 无门槛，开放竞争 |
| 2 | 有明确描述和验收标准 | 减少来回沟通 |
| 3 | 无人认领 / 0 comments | 开放竞争 |
| 4 | 高奖金 | 值得投入 |

**立即可认领（本周）：**
- ✅ SolFoundry T1 Sticker Pack — 100K FNDRY
- ✅ SolFoundry T1 Animated GIF — 100K FNDRY
- ✅ RustChain Haiku — 5 RTC/首，无需代码
- ✅ claude-builders-bounty Autonomous Agent — $300

---

## 第三步：Fork + 认领（1分钟）

```bash
# 1. Fork 目标仓库
gh repo fork <owner>/<repo>

# 2. 克隆到本地
git clone https://github.com/YOUR_USERNAME/<repo>.git
cd <repo>

# 3. 创建分支
git checkout -b bounty/<issue-title>

# 4. 在 GitHub Issue 下留言 "/claim" 或 "I'll work on this"
#    （大多数 bounty 平台支持 /claim 命令）
```

---

## 第四步：实现 + 提 PR（2分钟）

```bash
# 1. 实现功能
# ... 写代码 ...

# 2. 提交（带描述）
git add .
git commit -m "feat: <bounty title>

Bounty: <issue-url>
Reward: <reward-amount>
Submitted-by: Bounty Hunter Kit"

# 3. 推送
git push origin bounty/<issue-title>

# 4. 创建 PR
gh pr create --title "feat: <bounty title>" \
  --body "## Bounty Submission

- Bounty: #<issue-number>
- Reward: <amount>
- Implementation: <what you built>

## Testing
<how to test>

## Screenshots (if applicable)
<attach if UI changes>"
```

---

## 第五步：提交 Claim（30秒）

```bash
# 在 Issue 或 PR 下留言（根据平台规则）
# Opire 平台：
/claim
# 然后提交 PR

# Algora 平台：
# 直接在 Issue 下留言你的 GitHub username + PR URL

# SolFoundry：
# 在 Discord 或对应平台提交你的 work + PR link
```

---

## 快速命令清单

```bash
# 扫描所有 bounty 来源
node scripts/multi-source-scout.js

# 只看 T1 零门槛
node scripts/solfoundry-scout.js

# 只看美元悬赏
node scripts/opire-bounty-scout.js

# 美元/人民币悬赏
node scripts/algora-scout.js

# 监控新 bounty（每小时自动扫描）
# 设置 cron: node scripts/multi-source-scout.js --watch
```

---

## 常见问题

**Q: PR 被关了怎么办？**
A: 检查是否带 changeset / 符合模板要求。看 `prompts/codex-plugin-fix-prompt.md` 的 "PR 被关" 应对指南。

**Q: 多个 Bounty 冲突吗？**
A: 不冲突！可以同时做多个，只要 PR 质量过关。

**Q: Bounty 过期了还能做吗？**
A: 大多数 bounty 在关闭前都开放一段时间。GitHub Topic `bounty` 下的仓库是主要来源。

**Q: 结算周期多久？**
A: Opire: PR merge 后 1-7 天；Algora: merge 后 1-14 天；SolFoundry: 认领后 7-30 天；RustChain: 视具体 bounty 而定。

---

## 奖励估算

| Bounty 类型 | 典型奖励 | 难度 | 推荐度 |
|------------|---------|------|--------|
| T1 Design/Assets | 100K FNDRY | 🐚 简单 | ⭐⭐⭐⭐⭐ |
| Haiku/Poetry | 5-20 RTC | 🐚 纯创意 | ⭐⭐⭐⭐ |
| CLI Tool | $75-150 | 🦐 中等 | ⭐⭐⭐⭐ |
| AI Agent Pipeline | $300 | 🦀 复杂 | ⭐⭐⭐ |
| Security Audit | 50-200 RTC | 🦀 复杂 | ⭐⭐⭐ |
| Smart Contract | 200K+ FNDRY | 🦞 专家 | ⭐⭐ |

---

_由 Bounty Hunter Kit 生成 | 流浪龙虾平台_
