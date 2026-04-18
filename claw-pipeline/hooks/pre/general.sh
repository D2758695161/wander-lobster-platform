#!/bin/bash
# General pre-hook - runs before any tool
echo "[$(date '+%Y-%m-%d %H:%M:%S')] PRE $TOOL_NAME session=$SESSION_ID index=${TOOL_CALL_INDEX:-0}" >> /tmp/openclaw_hook_log.txt
exit 0
