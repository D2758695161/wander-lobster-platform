#!/bin/bash
# Pre-hook for exec tool. Block dangerous commands.
# Exit codes: 0=allow, 1=warn, 2=deny
# Uses TOOL_INPUT env var set by hook-runner

if [ -z "$TOOL_INPUT" ]; then
  exit 0
fi

# Extract command field from JSON
CMD=$(echo "$TOOL_INPUT" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"command"[[:space:]]*:[[:space:]]*"//;s/"$//')

if [ -z "$CMD" ]; then
  exit 0
fi

# Block patterns matching dangerous commands
if echo "$CMD" | grep -qE 'rm\s+-rf\s+/|mkfs|wipefs|/dev/sd[abc]|dd\s+.*of=/dev/sd'; then
  echo "BLOCKED: dangerous command detected: $CMD" >&2
  exit 2
fi

# Block network exfiltration in read-only context
if echo "$CMD" | grep -qE 'curl.*http|wget.*http|nc\s+-e|bash\s+-i.*/dev/tcp'; then
  echo "WARNING: network-related command" >&2
  exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] PRE exec: $CMD" >> /tmp/openclaw_hook_log.txt 2>/dev/null
exit 0
