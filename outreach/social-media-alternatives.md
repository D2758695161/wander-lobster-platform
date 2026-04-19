# 替代方案：当Playwright不可用时

> Playwright MCP挂了，找出所有可用的替代方案

## 方案A：独立Puppeteer脚本（不依赖MCP）

```bash
npm install puppeteer
node scripts/twitter-puppeteer.js
```

优点：完全不依赖OpenClaw MCP，独立运行
缺点：需要Node.js环境

## 方案B：Twitter API（官方渠道）

Twitter/X有官方API：
- Free tier: 500k tweets/month read, 50k write
- 需要申请developer账号

申请地址：https://developer.twitter.com

## 方案C：PowerShell + Invoke-WebRequest

直接用PowerShell发送HTTP请求到平台API。

## 方案D：第三方工具调度

- Buffer API（社交媒体调度平台）
- Publer API
- Hypefury API

## 方案E：等待Playwright MCP修复

- 重启OpenClaw
- 重新安装playwright MCP
- 提交bug report

---

## 当前最可行方案

**立即执行：** 方案B（Twitter API）

理由：
1. 官方渠道，最稳定
2. Free tier足够初期用
3. 不依赖Playwright

**下一步：** 申请Twitter Developer账号

---

*记录：一筒 | 2026-04-18*
