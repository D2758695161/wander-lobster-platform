#!/bin/bash
# Pre-hook for write tool - log write operations
echo "[$(date '+%Y-%m-%d %H:%M:%S')] PRE write: $TOOL_INPUT" >> /tmp/openclaw_hook_log.txt
exit 0
