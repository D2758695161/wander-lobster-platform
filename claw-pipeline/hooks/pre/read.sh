#!/bin/bash
# Pre-hook for read tool - log file access
echo "[$(date '+%Y-%m-%d %H:%M:%S')] PRE read: $TOOL_INPUT" >> /tmp/openclaw_hook_log.txt
exit 0
