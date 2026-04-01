---
name: claw-pipeline
description: CLAW-CODE inspired hook pipeline + plugin system for OpenClaw. Implements pre/post tool hooks, session compaction, permission escalation, and MCP stdio manager. Activate for any tool-intensive work.
---

# 🦞 CLAW-Pipeline — CLAW-CODE Architecture for OpenClaw

## Overview

CLAW-Pipeline brings 5 core CLAW-CODE patterns to OpenClaw:
1. **Hook Pipeline** — PreToolUse/PostToolUse shell hooks on every tool
2. **Session Compaction** — Auto-summarize long conversations  
3. **Plugin System** — Extensible plugin lifecycle (init/shutdown hooks)
4. **Permission Escalation** — Tiered permission modes
5. **MCP stdio Manager** — Lazy-spawn MCP servers with qualified names

## Hook Pipeline

### How it works

Place shell scripts in `hooks/pre/` and `hooks/post/` directories:

```
hooks/
├── pre/
│   ├── exec.sh           # Runs before ANY exec tool call
│   ├── read.sh          # Runs before read tool
│   ├── write.sh         # Runs before write tool
│   └── [tool-name].sh    # Tool-specific pre-hook
├── post/
│   ├── exec.sh           # Runs after ANY exec completes
│   ├── read.sh           # Runs after read tool
│   └── [tool-name].sh    # Tool-specific post-hook
└── hook-runner.js        # Hook execution engine
```

### Exit Code Semantics

| Code | Meaning |
|------|---------|
| 0 | Allow / continue |
| 1 | Warning but allow |
| 2 | Deny / block |
| 3+ | Custom (handled by hook) |

### Environment Variables Passed to Hooks

```
TOOL_NAME=exec|read|write|edit|...
TOOL_INPUT=... (JSON string of tool args)
TOOL_OUTPUT=... (JSON string of result)
TOOL_ERROR=true|false
TOOL_EXIT_CODE=0|1|2
TOOL_DURATION_MS=1234
SESSION_ID=abc123
TOOL_CALL_INDEX=5
OPENCLAW_VERSION=2026.3.28
```

### Example: pre/exec.sh

```bash
#!/bin/bash
# Called before exec tool. Deny if command contains dangerous patterns.
if echo "$TOOL_INPUT" | grep -qE "rm\s+-rf\s+/|mkfs|wipe|/dev/sd"; then
  echo "BLOCKED: Dangerous command detected" >&2
  exit 2  # DENY
fi
exit 0  # ALLOW
```

### Example: post/read.sh

```bash
#!/bin/bash
# Called after read tool completes. Log access patterns.
TOOL_OUTPUT_FILE="/tmp/openclaw_hook_log.json"
HOOK_DATA="{\"tool\":\"read\",\"session\":\"$SESSION_ID\",\"index\":\"$TOOL_CALL_INDEX\"}"
echo "$HOOK_DATA" >> "$TOOL_OUTPUT_FILE"
exit 0
```

### Running the Hook Runner

The hook runner is at `hooks/hook-runner.js`. Usage:

```javascript
const { runHooks, runPreHooks, runPostHooks } = require('./hooks/hook-runner.js');

// Before tool call:
const preResult = await runPreHooks('exec', { command: 'ls', timeout: 30 });
if (preResult.denied) { console.log('Hook denied'); return; }

// After tool call:
await runPostHooks('exec', { command: 'ls', timeout: 30 }, { output: '...', exitCode: 0 });
```

## Session Compaction

### When to Compact

Trigger compaction when:
- Conversation history > 50,000 tokens
- Message count > 200 messages
- After every 50 tool calls

### How Compaction Works

1. Preserve the most recent 20 messages (configurable)
2. Summarize everything older into a "## Conversation Summary" block
3. Count total saved tokens
4. Log the compaction event

### Using the Compactor

```javascript
const { compactSession } = require('./hooks/compact.js');

// In long conversations, call:
const summary = await compactSession(conversationHistory, {
  preserveRecent: 20,
  summaryModel: 'compact',
  maxTokens: 4000
});
// Returns: { summary: "...", savedTokens: 12340, newHistory: [...] }
```

### Compaction Prompt Template

```
## Conversation Summary (auto-generated)

[Summary of earlier conversation including: user goals, key decisions, 
 completed work, current state, outstanding issues]

---
Earlier messages (summarized from N messages, ~M tokens saved):
[Detailed summary of conversation history]
```

## Plugin System

### Plugin Structure

```
plugins/
├── my-plugin/
│   ├── plugin.json       # Manifest
│   ├── hooks/
│   │   ├── pre/tool-name.sh
│   │   └── post/tool-name.sh
│   ├── lifecycle/
│   │   ├── init.sh       # Runs on plugin load
│   │   └── shutdown.sh   # Runs on plugin unload
│   └── tools/
│       └── my-tool.js
```

### plugin.json Schema

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "What this plugin does",
  "defaultEnabled": true,
  "hooks": {
    "pre": { "exec": ["echo pre-hook"] },
    "post": { "read": ["echo post-read"] }
  },
  "lifecycle": {
    "init": ["echo Initializing my-plugin"],
    "shutdown": ["echo Shutting down my-plugin"]
  },
  "tools": [
    { "name": "my-tool", "path": "tools/my-tool.js", "description": "..." }
  ],
  "permissions": ["filesystem:read", "network:outbound"]
}
```

### Plugin Registry

```javascript
const { PluginRegistry } = require('./hooks/plugins.js');

const registry = new PluginRegistry('./plugins');
await registry.loadAll();

// Get all hooks for a tool
const hooks = registry.getHooks('exec');
// Returns: { pre: [Function, ...], post: [Function, ...] }

// Detect conflicts
const conflicts = registry.detectConflicts();

// List all enabled plugins
const plugins = registry.listEnabled();
```

## Permission Escalation

### Permission Modes

```javascript
const { PermissionMode, withEscalation } = require('./hooks/permissions.js');

const modes = {
  READONLY: 'read-only',           // File reads only
  WORKSPACE_WRITE: 'workspace-write', // Read + write in workspace
  DANGER_FULL_ACCESS: 'danger-full-access', // All except destructive
  ALLOW: 'allow'                    // Everything
};

// Wrap dangerous operations
const result = await withEscalation(
  PermissionMode.DANGER_FULL_ACCESS,
  () => execTool({ command: 'sudo rm /tmp/cache' })
);
```

### Current Mode Detection

The agent can check current permission level:
```javascript
const { getCurrentMode } = require('./hooks/permissions.js');
const mode = getCurrentMode(); // Returns current PermissionMode string
```

## MCP stdio Manager

### Usage

```javascript
const { McpStdioManager } = require('./mcp/manager.js');

const mcp = new McpStdioManager();

// Configure servers (add to .openclaw/mcp-servers.json)
await mcp.configure({
  servers: {
    'filesystem': {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/']
    }
  }
});

// Get tools from a server (lazy-spawns process)
const tools = await mcp.getTools('filesystem');

// Execute a tool with qualified name
const result = await mcp.executeTool('filesystem', 'list_directory', { path: '/tmp' });

// Shutdown a server (frees resources)
mcp.shutdown('filesystem');

// Shutdown all
mcp.shutdownAll();
```

### Qualified Tool Names

MCP tools are called with server prefix to avoid conflicts:
```
mcp_servername_toolname
e.g., mcp_filesystem_list_directory
```

## Integration Guide

### For Tool Execution (exec tool)

BEFORE calling exec:
```javascript
const { runPreHooks } = require('./claw-pipeline/hooks/hook-runner.js');
const pre = await runPreHooks('exec', { command: '...', timeout: 30 });
if (pre.denied) throw new Error('Hook denied: ' + pre.reason);
```

AFTER exec completes:
```javascript
const { runPostHooks } = require('./claw-pipeline/hooks/hook-runner.js');
await runPostHooks('exec', { command: '...' }, { output: result, exitCode: 0, durationMs: 234 });
```

### For Read Operations

```javascript
const pre = await runPreHooks('read', { path: 'MEMORY.md' });
// Check permissions
const post = await runPostHooks('read', { path: 'MEMORY.md' }, { found: true, lines: 45 });
```

### Session Compaction Trigger

At the start of each session or after every 50 tool calls:
```javascript
const { maybeCompact } = require('./claw-pipeline/hooks/compact.js');
const compactResult = await maybeCompact(conversationHistory, { threshold: 50000 });
if (compactResult.compacted) {
  console.log(`Compacted ${compactResult.savedTokens} tokens`);
}
```

---

## Key Principles

1. **Hooks are additive** — They inspect and can block, but always allow by default on exit 0
2. **Compaction preserves context** — The summary must capture ALL important decisions and state
3. **Plugins are isolated** — Each plugin's lifecycle is independent
4. **Permission escalation is explicit** — Wrap dangerous operations, don't assume elevated privileges
5. **MCP servers are lazy** — Don't spawn until first tool use, shutdown after 5 min idle

## Files in This Skill

- `hooks/hook-runner.js` — Core hook execution engine
- `hooks/compact.js` — Session compaction
- `hooks/plugins.js` — Plugin registry and lifecycle
- `hooks/permissions.js` — Permission escalation
- `mcp/manager.js` — MCP stdio manager
- `mcp/lazy-spawn.js` — Lazy process spawning with JSON-RPC handshake
