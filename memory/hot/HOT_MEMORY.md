# HOT Memory — Active Session Context

*Last updated: 2026-04-05 12:16 CST*
*Prune aggressively when tasks complete. Dead context → archive immediately.*

## Active PRs — Awaiting Merge/Review

| PR | Bounty | 状态 | 优先级 |
|----|--------|------|--------|
| mautic #16011 | 技能口碑 | 🟡 MERGEABLE，SonarCloud ✅，已ping | ⭐⭐ |
| SolFoundry #895 | 400K FNDRY | 🟡 OPEN，7review comments | ⭐⭐ |
| SolFoundry #897 | 400K FNDRY | 🟡 OPEN，1评论 | ⭐⭐ |
| kcolbchain/switchboard #8/#9/#10 | 认领中 | 🟡 OPEN，已bump（上次04:55） | ⭐ |
| kcolbchain/audit-checklist #8 | 认领中 | 🟡 OPEN，已bump | ⭐ |
| openai/codex-plugin-cc #147 | 技能口碑 | 🟡 OPEN，--full-access flag GPU/CUDA | ⭐⭐ |
| openai/codex-plugin-cc #148 | 技能口碑 | 🟡 OPEN，Windows Git Bash shell检测 | ⭐⭐ |
| openai/codex-plugin-cc #150 | 技能口碑 | 🟡 OPEN，EAGAIN hook crash修复 | ⭐⭐ |

## ⚠️ 已清理（Dead Context 归档）

- claw-code-rust #4 ✅ MERGED（wangtsiao）→ 归档 2026-04-04
- pulse-cn-mcp #1 ✅ MERGED（wangtsiao）→ 归档 2026-04-04
- labmain #33/#34/#51 ✅ 归档（owner 15天不活跃，竞争者出现，$466冻结）
- kcolbchain/stablecoin-toolkit PR #10 ✅ 归档（Chainlink PoR，子agent多次失败）
- wevm系全部 ✅ 归档（账号被tmm封锁）
- illbnm/homelab PRs ✅ 归档（owner 15天+不活跃，$1,340冻结）
- runveil-io/core #62/#63 ✅ 归档（被#88覆盖，关闭）
- resibocash auth提案 ✅ 归档（72h无回复）
- calebadekunle/alkebulancash PR #6 ✅ 归档（无新活动）
- tenstorrent/tt-metal #41028/#41029/#41030 ✅ 归档（fork限流/竞争激烈）

## 🔴 CRITICAL BLOCKER

- **163 SMTP全部失效**（2026-04-05确认）：
  - FYU6WwPKjeUnMtpE → 535 auth failed
  - DKpWFJySX2RjTCQc → 544垃圾拦截
  - SPseM7hrWSCABfwY → 535 auth failed
  - SendClaw API → DNS失败
  - **需要partner操作：登录163.com → 设置 → POP3/SMTP/IMAP → 重新生成授权码，告知新码**
- **GitHub PAT仍有效**（gitconfig url rewrite）

## Immediate Goals（2026-04-05）

1. ⬜ mautic #16011 mergeable → 确认是否已merge，若未merge再ping
2. ⬜ SolFoundry #895 → 处理7个review comments，推进merge
3. ⬜ codex-plugin-cc #147/#148/#150 → 跟进review
4. ⬜ kcolbchain PRs → 等待owner回复，考虑进一步bump
5. ⬜ Lobster-platform → 新Hot Bounty Repos section已部署，继续迭代

## 技术笔记

- **PowerShell `||` 和 `&&` 不支持**：脚本中用 if/else 代替
- **GitHub API fork创建**：202 ACCEPTED后需等3-5秒才生效
- **codex-plugin-cc文件位置**：`plugins/codex/scripts/codex-companion.mjs`
- **GitHub PR创建HEAD格式**：`owner:branch-name`
- **SHA mismatch处理**：commit前必须获取当前fork文件的SHA，不能用upstream SHA
- **process.env.SHELL**：Git Bash环境变量中有bash路径（`/usr/bin/bash`等）

## SMTP状态（持续失败）

- **163邮箱**：账号被544反垃圾拦截，持续失效
- **SendClaw**：DNS失败
- **决策**：暂时搁置，优先用GitHub/PR变现
