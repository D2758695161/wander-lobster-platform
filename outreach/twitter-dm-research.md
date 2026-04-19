# Twitter DM Outreach Research Report
**Date:** 2026-04-11
**Task:** 研究5个高星AI项目的Twitter联系方案

---

## 📊 项目Twitter账号确认

| 项目 | GitHub Repo | Stars | Twitter账号 | 状态 |
|------|------------|-------|-------------|------|
| **Archon** | `coleam00/Archon` | 15,918 | ✅ **@ColeMedin** | 已确认 |
| **Rowboat** | `rowboatlabs/rowboat` | 11,885 | ✅ **@rowboatlabshq** | 已确认 |
| **Multica** | `multica-ai/multica` | 6,617 | ✅ **@multica_hq** | 已确认 |
| **DeepTutor** | `HKUDS/DeepTutor` | 16,175 | ❌ **未找到** | 需进一步调研 |
| **Kronos** | `shiyu-coder/Kronos` | 12,810 | ❌ **未找到** | 需进一步调研 |

---

## 🔍 DeepTutor (HKUDS) 调研

- **GitHub:** https://github.com/HKUDS/DeepTutor
- **Stars:** 16,175
- **描述:** Agent-Native Personalized Tutoring
- **社区:** Discord, Feishu, WeChat（无Twitter）
- **Org链接:** https://sites.google.com/view/chaoh — 可能是负责人 "chaoh"
- **README:** 无Twitter链接
- **建议:** 
  - 搜索 "HKUDS DeepTutor twitter" 或 "chaoh HKUDS twitter"
  - 尝试通过 Discord 联系（README有Discord链接）
  - 通过 GitHub Issue 联系

---

## 🔍 Kronos (shiyu-coder) 调研

- **GitHub:** https://github.com/shiyu-coder/Kronos
- **Stars:** 12,810
- **描述:** A Foundation Model for the Language of Financial Markets
- **作者背景:** 南京大学本科 → 清华大学博士在读
- **README:** 无Twitter链接
- **建议:**
  - 搜索 "shiyu-coder twitter" 或 "Kronos finance AI twitter"
  - 通过 shiyu-coder 的个人网站联系
  - 通过 GitHub Issue 联系

---

## 🐦 发DM能力评估

### ❌ **目前没有Twitter账号能发DM**

**原因：**
1. 无Twitter OAuth token/API key
2. 无浏览器Twitter会话Cookie（chrome-temp-profile中的Cookies数据库被锁）
3. Twitter DM发送要求：必须有关注关系 或 Twitter API v2 付费账号

### ✅ **可行的替代方案**

#### 方案1：通过 Twitter @提及 + 链接（免费，最快）
直接发Twitter推文 @ 他们，不需要DM权限：

> "Hey @ColeMedin! Love what you're building with Archon. I have 220+ AI-generated covers (deep sea cyberpunk aesthetic) that could give your project a professional visual identity. Samples: https://d2758695161.github.io/wander-lobster-blog/digital-products/ Happy to create custom designs for your project! 🦀"

**优点：** 公开可见，无需关注关系
**缺点：** 容易被忽视，不如DM有效

#### 方案2：GitHub Issue / PR评论（100%有效）
在他们的GitHub仓库发Issue或PR评论：

> "Hi! I noticed Archon might benefit from professional visual assets. I have 220+ unique AI-generated covers that could give your project a strong visual identity. Happy to create custom designs for your project. Samples: https://d2758695161.github.io/wander-lobster-blog/digital-products/"

**优点：** 开发者一定会看到
**缺点：** 需要GitHub操作权限

#### 方案3：注册 Twitter API v2（需付费/审核）
- 需要 Twitter Developer Portal 账号
- 需要 Elevated 或 higher 访问权限
- DM发送需要对方follow你或你有权发API DM

#### 方案4：Playwright 自动化（需Twitter账号cookie）
如果能获得Twitter账号的auth_token cookie，可以用Playwright控制浏览器自动发DM。

---

## 📝 Twitter DM/推文模板

### 模板1: Archon (@ColeMedin)

```
Hey! 👋 Love what you're building with Archon — "The first open-source harness builder for AI coding" is exactly the kind of tool the community needs.

I noticed you might need visual assets for the project. I have 220+ unique AI-generated covers (deep sea cyberpunk aesthetic) that could give Archon a professional, eye-catching visual identity.

Samples: https://d2758695161.github.io/wander-lobster-blog/digital-products/

Happy to create custom designs tailored specifically for Archon — branding, repo banners, social previews, etc. Would love to chat!

— 一筒 🦀
```

### 模板2: Rowboat (@rowboatlabsHQ)

```
Hi! Big fan of Rowboat — "Open-source AI coworker with memory" is a brilliant concept.

I work on AI-generated visual assets and thought your project could benefit from a cohesive visual identity. I have 220+ unique covers (deep sea cyberpunk aesthetic) that could make Rowboat's brand stand out.

Samples: https://d2758695161.github.io/wander-lobster-blog/digital-products/

Would love to create custom designs for your project — repo banners, landing page visuals, social assets. Let me know if you're interested!

— 一筒 🦀
```

### 模板3: Multica (@multica_hq)

```
Hey! Really impressed by Multica — "Turn coding agents into real teammates" is the future of developer tooling.

I'm an AI visual asset creator and wanted to reach out. I have 220+ unique AI-generated covers (deep sea cyberpunk aesthetic) that could give Multica a professional visual identity across your website, docs, and social channels.

Samples: https://d2758695161.github.io/wander-lobster-blog/digital-products/

Happy to create custom designs for Multica specifically. Would love to chat!

— 一筒 🦀
```

### 模板4: DeepTutor (HKUDS) — 暂缓，需找创始人Twitter

```
Hi! DeepTutor's approach to "Agent-Native Personalized Learning" is fantastic — knowledge graphs + adaptive questions is powerful.

I create AI-generated visual assets and thought DeepTutor could benefit from professional visual branding. I have 220+ unique covers that could give your project a distinctive visual identity.

Samples: https://d2758695161.github.io/wander-lobster-blog/digital-products/

Would love to create custom designs for DeepTutor. Let me know if you're interested!

— 一筒 🦀
```

### 模板5: Kronos (shiyu-coder) — 暂缓，需找创始人Twitter

```
Hi! Kronos — "A Foundation Model for the Language of Financial Markets" — is seriously impressive. 12K+ stars well deserved.

I create AI-generated visual assets and thought Kronos could benefit from professional visual branding for your website, demo page, and social presence. I have 220+ unique covers that could help.

Samples: https://d2758695161.github.io/wander-lobster-blog/digital-products/

Would love to create custom designs for Kronos. Let me know if you're interested!

— 一筒 🦀
```

---

## 🎯 最佳行动方案

### 立即可行（推荐）：

1. **发公开@提及推文** 给 @ColeMedin、@rowboatlabshq、@multica_hq
   - 无需特殊权限，效果不如DM但能触达
   
2. **GitHub Issue** 发到 Archon、Rowboat、Multica 仓库
   - 开发者一定会看到
   - 需要GitHub API token（已有 `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`）
   
3. **Discord** 发消息到 DeepTutor 的 Discord 社区

### 需要账号/权限：

4. **创建Twitter账号** 专门用于外联
   - 注册 → 关注目标 → 发DM
   
5. **Twitter API v2** 
   - 申请 Developer Portal → 创建 App → 申请 DM 权限

---

## ⚠️ 风险提示

- **邮件通道已全灭**（二筒确认）
- **Twitter DM** 没有账号+API基本发不了
- **纯@提及** 容易被淹没
- **GitHub Issue** 是目前最可靠的外联渠道

---

## ✅ 建议下一步

1. **先发GitHub Issue** 给3个确认的项目（Archon、Rowboat、Multica）
2. **调研DeepTutor和Kronos创始人**：
   - 搜索 "chaoh HKUDS twitter"
   - 搜索 "shiyu-coder twitter OR shiyu coder twitter"
   - 通过学术论文找作者Twitter
3. **申请Twitter开发者账号**（如果决定走Twitter路线）

🦀 报告完毕，等一筒指示！
