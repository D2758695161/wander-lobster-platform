# 🏹 Bounty Active Hunt Report

**扫描时间:** 2026-04-18 12:50 GMT+8  
**扫描方法:** GitHub API (web_fetch) — gh CLI token 401，绕道成功  
**扫描范围:** label:bounty + no:assignee + created:>2026-04-10

---

## 📊 总览

| Bounty | 价值 | 难度 | 竞争 | 推荐度 |
|--------|------|------|------|--------|
| Midnight Node Tutorial (#323) | $700-$1000 NIGHT | 🟡 中 | 低 | ⭐⭐⭐⭐ |
| Midnight Proof Server Tutorial (#308) | $500-$700 NIGHT | 🟠 中高 | 低 | ⭐⭐⭐⭐ |
| Midnight Unshielded Token dApp (#328) | $300-$500 NIGHT | 🟡 中 | 低 | ⭐⭐⭐ |
| Claude Pre-tool-use Hook (#3) | $100 USD | 🟢 低 | 中 | ⭐⭐⭐ |
| Claude CLAUDE.md Template (#2) | $75 USD | 🟢 低 | 高(130+评论) | ⭐⭐ |

---

## 🏆 Top 优先 - Midnight Contributor Hub (Eclipse Bounties)

> ⚠️ **重要:** Midnight 是 **Eclipse bounty**（最优方案获奖，不是先到先得）。意味着多个人可以同时提交，评审后最优的拿奖金。适合认真做高质量内容的。

### 1️⃣ [$700-$1000] Running a Midnight Node Tutorial
**Issue:** https://github.com/midnightntwrk/contributor-hub/issues/323  
**标签:** bounty | medium-priority | content-proposal  
**评论:** 6 | **更新时间:** 2026-04-18 04:15 UTC

**要求:**
- 3000-4000 words tutorial
- Full node setup from scratch
- Initial sync process
- Block height monitoring
- Peer connectivity troubleshooting (stuck on block 1, peers disconnecting)
- Resource requirements: CPU, RAM, storage
- Verifying node synced and healthy

**分析:**
- 💰 价值最高 ($700-$1000)
- 🔧 难度中等，需要有 Midnight 测试环境
- ⚔️ 竞争低，只有6条评论
- 📝 需要写技术文章 + 实测代码
- ❌ AI生成会被拒（反AI检测）

**行动建议:** 如果有 Midnight 测试环境，这个最值得冲

---

### 2️⃣ [$500-$700] Proof Server and Indexer Tutorial
**Issue:** https://github.com/midnightntwrk/contributor-hub/issues/308  
**标签:** bounty | medium-priority | content-proposal  
**评论:** 15 | **更新时间:** 2026-04-18 02:34 UTC

**要求:**
- 2500-3500 words tutorial
- Proof server role (ZK proofs from circuit inputs)
- Docker setup for local dev
- Docker tag versioning (must match ledger version)
- Indexer GraphQL queries
- WebSocket subscriptions for real-time updates
- `indexerPublicDataProvider` vs direct indexer access

**分析:**
- 💰 高价值 ($500-$700)
- 🔧 需要懂 ZK proofs、Docker、GraphQL
- ⚔️ 竞争低（15条评论）
- 📝 需要深度技术写作

**行动建议:** ZK/区块链经验加分，这个可以认真做

---

### 3️⃣ [$300-$500] Building an Unshielded Token dApp with UI
**Issue:** https://github.com/midnightntwrk/contributor-hub/issues/328  
**标签:** bounty | medium-priority | content-proposal  
**评论:** 16 | **更新时间:** 2026-04-18 03:40 UTC

**要求:**
- Written tutorial (1,500-2,500 words)
- Compact contract for unshielded token operations
- TypeScript integration
- React frontend with wallet connection
- Dev.to / Medium / Hashnode 发布
- X/LinkedIn 推广 + #MidnightforDevs

**分析:**
- 💰 价值较高 ($300-$500)
- 🔧 难度中等
- ⚔️ 竞争中等（16条评论）
- 📝 适合有过 React + 区块链经验的

---

## 💵 USD Bounties - Claude Builders Bounty (Opire)

### 4️⃣ [$100 USD] Pre-tool-use Hook - Blocks Destructive Bash
**Issue:** https://github.com/claude-builders-bounty/claude-builders-bounty/issues/3  
**标签:** bounty | hook  
**评论:** 大量（130+ on #2，#3类似量级）| **更新时间:** 2026-04-18

**要求:**
- Create a pre-tool-use hook for Claude Code
- Blocks destructive bash commands (rm -rf, etc.)
- Must actually work with Claude Code

**分析:**
- ✅ 真 USD $100
- 🟢 难度低，工具类 hook
- ⚠️ 竞争可能较高（Claude Code 开发者受众广）
- 📝 Opire 平台支付，merge 后自动打款

**行动建议:** 这个适合快速完成，但要有心理准备竞争激烈

---

### 5️⃣ [$75 USD] CLAUDE.md Template - Next.js + SQLite SaaS
**Issue:** https://github.com/claude-builders-bounty/claude-builders-bounty/issues/2  
**标签:** bounty | template  
**评论:** 130+ | **更新时间:** 2026-04-18

**要求:**
- Opinionated CLAUDE.md for Next.js 15 + SQLite
- Stack & versions, folder structure
- DB migration rules, component patterns
- Must be usable without modification

**分析:**
- ❌ 竞争太高（130+ 评论）
- 🟢 难度低
- 💰 $75 USD 吸引力有限
- ⏸️ **不推荐优先做** — 除非特别闲

---

## ⚠️ 忽略项

| 项目 | 原因 |
|------|------|
| Dasharo banana bread recipe | 钓鱼 issue（"If you are a human being, do not attempt"），假 bounty |
| plurigrid/nash-portal | NASH token 价值不明，冷门小币 |
| priyanshudumps/fuel-agent-kit USDC | 仓库质量差 (owner 自称"missing readme")，不值得 |
| RustChain (RTC) | 1 RTC ≈ $0.10，crypto 奖金太低 |

---

## 🎯 行动建议

**第一优先:** Midnight #323 或 #308 — Eclipse bounty 竞争少，价值高 ($500-$1000 NIGHT)

**快速变现:** Claude #3 — $100 USD，工具 hook 不难

**搜索关键词（未来扫描）:**
```
is:open is:issue label:bounty no:assignee created:>2026-04-10
is:open is:issue label:"bounty" label:"help wanted" no:assignee
```

---

*下次扫描建议: 2026-04-25 — 重点关注 Midnight 是否有新增 tutorial bounty*
