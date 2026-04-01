#!/bin/bash
# Post-hook for exec tool - log results
echo "[$(date '+%Y-%m-%d %H:%M:%S')] POST exec exit=$TOOL_EXIT_CODE duration=${TOOL_DURATION_MS:-0}ms error=$TOOL_ERROR" >> /tmp/openclaw_hook_log.txt
exit 0
