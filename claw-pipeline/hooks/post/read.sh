#!/bin/bash
# Post-hook for read tool
echo "[$(date '+%Y-%m-%d %H:%M:%S')] POST read error=$TOOL_ERROR" >> /tmp/openclaw_hook_log.txt
exit 0
