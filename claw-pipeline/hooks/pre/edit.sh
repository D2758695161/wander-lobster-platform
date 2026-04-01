#!/bin/bash
# Pre-hook for edit tool - log edits to config files
echo "[$(date '+%Y-%m-%d %H:%M:%S')] PRE edit: $TOOL_INPUT" >> /tmp/openclaw_hook_log.txt
exit 0
