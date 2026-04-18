# CLAW-Pipeline Plugin Installation Guide

## Quick Install

```bash
# From local directory
openclaw plugins install ./claw-pipeline-plugin

# Or from ClawHub (after publishing)
openclaw plugins install clawhub:claw-pipeline-plugin
```

## Manual Configuration

Add to your `openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "claw-pipeline": {
        "enabled": true,
        "config": {
          "compactThreshold": 50000,
          "compactPreserve": 20,
          "dangerousPatterns": [
            "rm -rf /",
            "mkfs",
            "wipefs",
            "/dev/sd",
            "dd of=/dev"
          ]
        }
      }
    }
  }
}
```

## Restart Gateway

```bash
openclaw gateway restart
```

## Verify Installation

```bash
openclaw plugins list
openclaw plugins inspect claw-pipeline
```

## What It Does

Once installed and enabled, the plugin automatically:

1. **Intercepts all tool calls** via `before_tool_call` and `after_tool_call` hooks
2. **Blocks dangerous exec commands** (rm -rf /, mkfs, wipefs, etc.)
3. **Logs all tool executions** to `/tmp/openclaw_hook_log.txt`
4. **Monitors session token count** and warns when approaching compaction threshold
5. **Observes compaction cycles** via `before_compaction` and `after_compaction` hooks
6. **Tracks session lifecycle** via `session_start` and `agent_end` hooks

## Hook Log Format

```
[2026-04-02T00:47:00.000Z] [CLAW-PIPELINE] before_tool_call exec session=agent:main:... params={"command":"ls -la"}
[2026-04-02T00:47:00.050Z] [CLAW-PIPELINE] after_tool_call exec session=agent:main:... calls=5
[2026-04-02T00:47:01.000Z] [CLAW-PIPELINE] BLOCKED exec: rm -rf / (session=agent:main:...)
```

## Uninstall

```bash
openclaw plugins disable claw-pipeline
# Or remove from openclaw.json entries
openclaw gateway restart
```
