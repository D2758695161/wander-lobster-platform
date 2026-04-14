# 🦀 GitHub Bounty Hunter 训练手册 v1.0

## 核心原则

**最小改动原则：** 只改必须改的，不做"顺手优化"。一个5行PR比50行更容易merge。

**收款才是终点：** 提交PR不是结束，merge并收款才是。

---

## 一、找 Bounty 的方法

### 方法1：GitHub Search（最有效）
```
is:issue is:open label:"bounty" OR label:"reward" OR label:" bounty" 
created:>2026-01-01 
comments:0..3
```

### 方法2：定向扫描高价值项目
重点扫描（按优先级）：
- `algora-io/algora` — 专门的bounty平台
- `claude-builders-bounty` — Claude Code相关
- `openai/codex-plugin-cc` — Codex插件
- `tenstorrent/tt-metal` — C++优化（$10k级别）
- `solfoundry/solfoundry` — Solana生态

### 方法3：过滤条件
- ✅ 0-comment 或少comment（竞争少）
- ✅ 有明确bounty金额标注
- ✅ 问题描述清晰、可复现
- ❌ 不要碰：已有大量PR的、owner长期不活跃的

### 方法4：关键词搜索
```
bounty in:title OR "$$$" in:title OR "$500" in:title 
is:issue is:open
```

---

## 二、Bounty 评估标准

| 维度 | 得分 | 说明 |
|------|------|------|
| 金额 | $50=1, $500=5, $1000+=10 | 越高越好 |
| 竞争 | 0 PR=10, 1-2=5, 3+=1 | 越少越好 |
| 难度 | 1h内=10, 1-3h=5, 3h+=1 | 越快越好 |
| 可落地 | 有明确复现路径=10 | 模糊问题跳过 |

**总分 >= 15分的才值得做**

---

## 三、提交 PR 的标准流程

### Step 1：Fork + Clone
```bash
# Fork目标仓库到自己的账号
# 然后clone
git clone https://github.com/YOUR_USERNAME/repo-name.git
cd repo-name
git checkout -b fix/issue-XXX
```

### Step 2：分析问题
- 仔细读issue描述
- 跑一遍问题复现
- 找到问题根因
- **只改问题代码，不动周围代码**

### Step 3：提交PR
- PR标题：`Fix: [issue号] [一句话描述]`
- PR描述模板：
```markdown
## 修复内容
[描述修复了什么]

## 复现步骤
[如果需要，写如何复现]

## 测试
[写了什么测试]

Fixes #XXX
```
- 如果目标仓库需要CHANGELOG/changeset文件，加上

### Step 4：Comment通知
在issue下发一条评论：
```
👋 I've submitted a fix for this in PR #YYY
```

---

## 四、Merge后收款

### 常见收款方式
1. **GitHub Sponsors** — 直接收款（需PayPal）
2. **USDT TRC20** — 最快， 提供钱包地址
3. **Bounty平台** — Algora/SuperteamDAO等
4. **银行转账** — 最慢

### 收款地址（我的）
- TRC20 (TRX链): `TXXXXXXX`（在 TOOLS.md 查）
- Solana: `63Ar4MqMrYwj294ERD7ygT7xrZefAzzd6GqdGEMNX4JW`

---

## 五、PR 状态跟踪

每次扫描后，更新 `BOUNTY-TRACKER.md`：

```
| Bounty | Repo | Amount | Issue | PR | Status |
|--------|------|--------|-------|-----|--------|
| #123   | xxx  | $250   | #45   | #78 | mergeable |
```

---

## 六、二筒的KPI

- 每天扫描新bounty：>= 50个
- 每天认领新bounty：>= 2个
- 每周提交PR：>= 3个
- 每月收款：目标 $500+

---

## 七、立即开始

现在就去扫以下仓库：
1. `algora-io/algora` — bounty platform本身，代码里可能有bounty
2. `claude-builders-bounty` — 每天新issue
3. `openai/codex-plugin-cc` — Windows bug优先

出发！🦀
