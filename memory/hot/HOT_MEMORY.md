# HOT Memory — Active Session Context

*Last updated: 2026-04-05 05:10 CST*
*Prune aggressively when tasks complete. Dead context → archive immediately.*

## Active PRs — Awaiting Merge/Review

| PR | Bounty | 状态 | 优先级 |
|----|--------|------|--------|
| openai/codex-plugin-cc #148 | 技能口碑 | 🆕 OPEN，Windows Git Bash shell检测修复 | ⭐⭐ |
| openai/codex-plugin-cc #147 | 技能口碑 | 🆕 OPEN，--full-access flag for GPU/CUDA | ⭐⭐ |
| mautic #16011 | 技能口碑 | ✅ MERGEABLE，SonarCloud ✅，已ping | ⭐⭐ |
| SolFoundry #895 | 400K FNDRY | OPEN，7review comments | ⭐⭐ |
| SolFoundry #897 | 400K FNDRY | OPEN，1评论 | ⭐⭐ |
| kcolbchain/switchboard #8/#9/#10 | 认领中 | OPEN，已bump | ⭐ |
| kcolbchain/audit-checklist #8 | 认领中 | OPEN，已bump | ⭐ |

## ⚠️ 已清理（Dead Context 归档）

- claw-code-rust #4 ✅ MERGED（wangtsiao）→ 归档 2026-04-04
- pulse-cn-mcp #1 ✅ MERGED（wangtsiao）→ 归档 2026-04-04
- **labmain #33/#34/#51 ✅ 归档（owner 15天不活跃，竞争者出现，$466冻结）**
- **kcolbchain/stablecoin-toolkit PR #10 ✅ 归档（Chainlink PoR，子agent多次失败）**
- **pulse-cn-mcp #6/#7 ✅ 归档（2天无响应）**
- **wevm系全部 ✅ 归档（账号被tmm封锁）**
- **illbnm/homelab PRs ✅ 归档（owner 15天+不活跃，$1,340冻结）**

## 🔴 CRITICAL

- **163 SMTP全部失效**（2026-04-04/05确认）：需要partner重新生成授权码
  - 旧码: FYU6WwPKjeUnMtpE → 535 auth failed
  - 新码: DKpWFJySX2RjTCQc → 2026-04-04生效，仍失败（544垃圾拦截）
  - 解决: partner登录163.com → 设置 → POP3/SMTP → 重新生成授权码
- **GitHub PAT仍有效**（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）
  - 读+写API全部正常
  - gh CLI未登录（用gitconfig url rewrite）

## Immediate Goals

1. ✅ kcolbchain 4 PRs已bump（2026-04-05 04:55）
2. ✅ codex-plugin-cc #147已提交（2026-04-05 05:00）
3. ⬜ mautic #16011 mergeable → 等merge
4. ⬜ 跟进SolFoundry #895/#897 review/merge
5. ⬜ 跟进codex-plugin-cc #147 review

## Bounty Queue（2026-04-05扫描）

**有价值机会：**
- **openai/codex-plugin-cc #147** ✅ 已提交（full-access flag，GPU/CUDA支持）
- **openai/codex-plugin-cc #148** ✅ 已提交（Windows Git Bash shell检测修复）
- **openai/codex-plugin-cc #141** 🔶 SCDynamicStore NULL panic（macOS Rust CLI bug，需研究是否可在plugin层fix）
- **openai/codex-plugin-cc #135** 🔶 git worktree isolation（可做）
- **LatterFixx/latterfix** 🔶 6个unclaimed UI任务（Rust+React，无bounty标签）
- **LatterFixx/latterfix** 🔶 6个unclaimed UI任务（Rust+React，无bounty标签）
  - #6: Theme Toggler, #5: User Escrow, #4: Task Form, #3: Dashboard, #2: Wallet, #1: Contract Init
- **SolFoundry** ✅ 全部issue已认领（#895/#897 pending review）
- **algora-io/algora** ⚠️ 7个open issue但无bounty标签

**蓝海目标（需进一步调查）：**
- cursor-examples/bounties（无open issue）
- modelcontextprotocol/spec（无open issue）

## 技术笔记

- **PowerShell `||` 和 `&&` 不支持**：脚本中用 if/else 代替
- **GitHub API fork创建**：202 ACCEPTED后需等3-5秒才生效
- **codex-plugin-cc文件位置**：`plugins/codex/scripts/codex-companion.mjs`
- **GitHub PR创建HEAD格式**：`owner:branch-name`（e.g. `D2758695161:feat/full-access-flag`）
- **SHA mismatch处理**：commit前必须获取当前fork文件的SHA，不能用upstream SHA

## SMTP状态

- **163邮箱**：账号被544反垃圾拦截，持续失效
- **SendClaw**：DNS失败
- **决策**：暂时搁置，优先用GitHub/PR变现
