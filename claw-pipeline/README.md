# 🦞 CLAW-Pipeline — CLAW-CODE Architecture for OpenClaw

基于 instructkr/claw-code (108K stars, Rust) 核心架构的 OpenClaw 实现。

## 核心模块

| 文件 | 功能 |
|------|------|
| `hooks/hook-runner.js` | Pre/Post 工具 Hook 执行引擎 |
| `hooks/compact.js` | 对话历史自动摘要压缩 |
| `hooks/plugins.js` | Plugin 生命周期 + Registry |
| `hooks/permissions.js` | 分级权限模型 |
| `hooks/llm-client.js` | Compaction LLM 摘要客户端 |
| `mcp/manager.js` | MCP stdio Manager（懒加载+qualified names） |
| `mcp/lazy-spawn.js` | 懒加载 MCP 服务器进程 |

## Quick Start

```bash
node hooks/hook-runner.js exec '{"command":"ls"}'
node hooks/compact.js  # Check if compaction needed
```

## 集成到 OpenClaw

在 OpenClaw 的 agent 循环中，工具调用前加入：
```javascript
const { runPreHooks } = require('./claw-pipeline/hooks/hook-runner.js');
const pre = await runPreHooks('exec', toolArgs);
if (pre.denied) return 'Tool blocked by hook policy';
```

## 许可

MIT — 借鉴 CLAW-CODE 架构模式，原创实现
