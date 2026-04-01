---
name: claw-pipeline
description: CLAW-CODE inspired hook pipeline and session compaction for OpenClaw. Registers before_tool_call/after_tool_call hooks, blocks dangerous commands, logs all tool execution, monitors compaction. Activate when doing tool-intensive work or when you need to audit AI agent behavior.
---

# 🦞 CLAW-Pipeline — CLAW-CODE Architecture for OpenClaw

## Overview

CLAW-Pipeline brings 5 core CLAW-CODE patterns to OpenClaw via a native plugin:

1. **Hook Pipeline** — `before_tool_call` / `after_tool_call` hooks on every tool
2. **Session Compaction Observer** — monitors compaction cycles via `before_compaction` / `after_compaction`
3. **Permission Escalation** — blocks dangerous exec commands before execution
4. **Tool Audit Logging** — logs every tool call to `/tmp/openclaw_hook_log.txt`
5. **Session Lifecycle Tracking** — via `session_start` / `agent_end` hooks

## Installation

```bash
openclaw plugins install ./claw-pipeline-plugin
openclaw gateway restart
```

Then add to `openclaw.json`:
```json
{
  "plugins": {
    "entries": {
      "claw-pipeline": {
        "enabled": true,
        "config": {
          "compactThreshold": 50000,
          "compactPreserve": 20,
          "dangerousPatterns": ["rm -rf /", "mkfs", "wipefs"]
        }
      }
    }
  }
}
```

## What Gets Logged

Every tool call produces entries in `/tmp/openclaw_hook_log.txt`:

```
[2026-04-02T00:47:00.000Z] [CLAW-PIPELINE] before_tool_call exec session=agent:main:... params={"command":"ls -la"}
[2026-04-02T00:47:00.050Z] [CLAW-PIPELINE] after_tool_call exec session=agent:main:... calls=5
[2026-04-02T00:47:01.000Z] [CLAW-PIPELINE] BLOCKED exec: rm -rf / (session=agent:main:...)
```

## Dangerous Command Blocking

The plugin intercepts `exec` tool calls and blocks commands matching these patterns:
- `rm -rf /` (and variants with no /tmp exception)
- `mkfs` — filesystem formatting
- `wipefs` — filesystem wipe
- `/dev/sd*` — direct block device access
- `dd of=/dev` — direct device writing

Additional patterns can be configured via `dangerousPatterns` in the plugin config.

## Hook Pipeline (Non-Plugin Version)

If you want hook pipeline behavior WITHOUT a plugin (for custom integrations), the standalone modules are at:

```
claw-pipeline/
├── hooks/hook-runner.js  — Pre/Post tool hooks (async)
├── hooks/compact.js      — Session compaction (async)
├── hooks/plugins.js      — Plugin registry + lifecycle
├── hooks/permissions.js — Tiered permission model
└── mcp/manager.js       — MCP stdio manager
```

Usage:
```javascript
const { runPreHooks, runPostHooks } = require('./claw-pipeline/hooks/hook-runner.js');

const pre = await runPreHooks('exec', { command: 'ls -la' });
if (pre.denied) return 'Tool blocked: ' + pre.reason;

const result = await executeTool('exec', { command: 'ls -la' });

await runPostHooks('exec', { command: 'ls -la' }, { output: result, exitCode: 0 });
```

## Compaction

The plugin observes but does NOT trigger compaction (OpenClaw handles this internally). To observe compaction:

```
[CLAW-PIPELINE] before_compaction session=agent:main:... reason=token_limit
[CLAW-PIPELINE] after_compaction session=agent:main:... — tokens reset
```

## Files in This Skill

- `claw-pipeline-plugin/` — Native OpenClaw plugin (TypeScript)
  - `openclaw.plugin.json` — Plugin manifest
  - `index.ts` — Hook registrations
  - `package.json` — Package metadata
  - `INSTALL.md` — Installation guide
- `claw-pipeline/` — Standalone modules (Node.js, no plugin required)
  - `hooks/hook-runner.js` — Core hook execution engine
  - `hooks/compact.js` — Session compaction
  - `hooks/plugins.js` — Plugin system
  - `hooks/permissions.js` — Permission escalation
  - `mcp/manager.js` — MCP stdio manager
- `OPENCLAW-EVOLUTION.md` — Full evolution roadmap
