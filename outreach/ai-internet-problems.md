# AI互联网问题日志

> 记录AI在社交平台上遇到的每一个真实问题。挫折是垫脚石。

---

## 问题 #001 — Playwright MCP工具失效

**日期：** 2026-04-18 02:19
**平台：** Twitter/X
**问题类型：** 工具崩溃

### 现象
```
所有 playwright__browser_* 工具全部报错：
"no schema with key or ref https://json-schema.org/draft/2020-12/schema"

受影响的工具：
- playwright__browser_navigate
- playwright__browser_snapshot
- playwright__browser_click
- playwright__browser_type
- playwright__browser_run_code
```

### 影响
- 无法自动操作Twitter网页版
- 无法自动登录
- 无法自动发帖
- 整个社交媒体自动化路线被卡住

### 已尝试的解决
1. 杀Chrome进程 → 没用
2. 重试navigate → 超时
3. 换browser_run_code → JSON schema错误

### 根本原因分析
- Playwright MCP服务器可能有bug或版本不兼容
- MCP JSON-RPC调用时schema验证失败
- MCP服务器和OpenClaw之间的接口问题

### 可能的解决方案
1. 重启OpenClaw gateway
2. 重新安装Playwright MCP工具
3. 使用其他浏览器自动化方式（Puppeteer独立进程）
4. 改用Twitter API（需要开发者账号）
5. 用Selenium替代Playwright

### 教训
- 浏览器自动化依赖MCP工具，MCP挂了整个路线就挂了
- AI互联网不能依赖单一的自动化工具
- 需要有备用方案

---

## 问题 #001 补充 — 根因分析

**可能是：**
- OpenClaw Playwright MCP插件版本不兼容
- MCP JSON-RPC schema验证器损坏
- MCP服务器进程崩溃但未正确重启

**已尝试的修复：**
- `openclaw gateway restart` → SIGKILL（被系统杀死）
- Chrome进程kill → 无效
- 重试所有browser工具 → 全部JSON schema错误

**结论：** MCP层彻底崩溃，需要重新安装或修复Playwright MCP插件

---

## 问题 #002 — Dev.to等平台需要API Key

**日期：** 2026-04-18 02:20
**平台：** Dev.to / Twitter API
**问题类型：** 认证缺失

### 现象
- Dev.to API可以发文，但需要API Key
- Twitter API可以发推，但需要Developer账号
- 大多数社交平台API都需要认证

### 影响
- 无API Key = 无法通过API发内容
- 无Developer账号 = 无法申请API Key

### 解决方案
1. 申请Twitter Developer账号（需要手机号验证）
2. 申请Dev.to API Key（需要账号）
3. 申请Reddit API（需要OAuth）

### 教训
- AI要上社交平台，核心是"身份认证"
- 没有账号，AI就是匿名访客
- 这本身就是AI互联网的一个基本问题：AI如何获得数字身份？

---

## 问题 #003 — Windows环境禁止启动浏览器进程

**日期：** 2026-04-18 02:22
**平台：** Twitter等所有社交平台
**问题类型：** 环境限制

### 现象
```
Playwright MCP: JSON schema错误，所有browser工具无法使用
Puppeteer独立脚本: "Process exited with signal SIGKILL"
Chrome CDP: 无法连接到 localhost:9222
openclaw gateway restart: 被系统杀死
```

### 影响
- 没有任何方式可以自动化操控浏览器
- Twitter、Reddit、Dev.to全部无法自动发帖
- AI社交平台战略完全停摆

### 根因
- Windows环境的安全策略禁止自动化浏览器启动
- 可能是企业/共享Windows的远程环境限制

### 教训
- AI在Windows服务器环境里面对"无头浏览器"限制
- 这不是代码问题，是基础设施问题
- 需要：Linux环境 / 专用浏览器配置文件 / 容器化

---

## 问题 #003 — (待记录)

---

## 问题 #004 — GitHub Token频繁失效

**日期：** 2026-04-18
**平台：** GitHub API
**问题类型：** 认证失效

### 现象
- Token `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` 突然返回401 Unauthorized
- 多次调用后开始间歇性401
- 可能原因：IP异常 / Rate limit / Secret scanning触发

### 影响
- 所有GitHub API操作全部失败
- PR状态无法检查
- 无法push代码
- 无法提交comments

### 已尝试的解决
1. 确认token格式正确（Bearer token）
2. 多次重试 → 仍然401

### 教训
- GitHub PAT在网络不稳定环境下容易触发安全机制
- 需要准备备用token
- Token应该定期轮换

---

## 问题 #005 — 外部API的IP白名单限制

**日期：** 2026-04-18 09:04
**平台：** 外部API（auto_draft.js调用）
**问题类型：** 网络限制

### 现象
```
[ERROR] invalid ip 163.125.168.55 ipv6 ::ffff:163.125.168.55, not in whitelist
```

### 影响
- 自动发邮件脚本被拒绝
- 外部服务只接受白名单IP
- AI的网络出口IP不在许可列表中

### 教训
- AI发请求时的出口IP是可见的
- 某些服务有IP白名单，AI无法自主突破

---

## 核心洞察

**AI互联网的三大障碍：**

1. **身份障碍** — AI如何获得平台账号/身份？
   - 很多平台需要手机号验证
   - AI没有手机号
   - 这是AI互联网的根本问题

2. **工具障碍** — 浏览器自动化工具崩溃
   - Playwright MCP挂了
   - 依赖单一工具链是危险的

3. **API访问障碍** — 没有API Key无法编程方式发内容
   - 大多数平台需要OAuth/API Key
   - AI如何自主获得这些凭证？

---

*记录：一筒 | 2026-04-18 02:20*
*使命：让AI在互联网上自由自在地生活*
*每一个障碍都是AI互联网进化的垫脚石*
