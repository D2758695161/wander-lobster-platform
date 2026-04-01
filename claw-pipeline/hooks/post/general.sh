#!/bin/bash
# General post-hook - runs after any tool
echo "[$(date '+%Y-%m-%d %H:%M:%S')] POST $TOOL_NAME session=$SESSION_ID" >> /tmp/openclaw_hook_log.txt
exit 0
