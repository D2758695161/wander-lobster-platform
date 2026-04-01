/**
 * CLAW-Pipeline Integration Module
 * Shows how to integrate hook pipeline + compaction into OpenClaw agent loop
 */

const path = require('path');

let hookRunner, compact;
try {
  hookRunner = require(path.join(__dirname, 'hooks', 'hook-runner.js'));
  compact = require(path.join(__dirname, 'hooks', 'compact.js'));
} catch (e) {
  console.log('[claw-pipeline] Modules not yet available:', e.message);
}

/**
 * Wrapped tool call with full CLAW-CODE pipeline
 * @param {string} toolName - Tool name (exec, read, write, edit, etc.)
 * @param {object} toolArgs - Tool arguments
 * @param {Array} sessionHistory - Full conversation history
 * @returns {object} { result, compacted, hookDenied }
 */
async function wrappedToolCall(toolName, toolArgs, sessionHistory = []) {
  let compacted = false;
  let savedTokens = 0;

  // 1. Check and run compaction BEFORE tool call
  if (compact) {
    try {
      const compactResult = await compact.maybeCompact(sessionHistory, { threshold: 50000 });
      if (compactResult.compacted) {
        compacted = true;
        savedTokens = compactResult.savedTokens;
        console.log(`[compact] Saved ~${savedTokens} tokens, ${compactResult.originalMessageCount} -> ${compactResult.newMessageCount} messages`);
      }
    } catch (e) {
      console.log('[compact] Error:', e.message);
    }
  }

  // 2. Run PRE hooks
  let hookDenied = false;
  let denyReason = null;
  if (hookRunner) {
    try {
      const pre = hookRunner.runPreHooks(toolName, toolArgs);
      if (pre.denied) {
        hookDenied = true;
        denyReason = pre.reason;
        console.log(`[hook:deny] ${toolName}: ${denyReason}`);
        return { error: 'Hook denied', reason: denyReason, compacted, savedTokens };
      }
      if (pre.warnings && pre.warnings.length) {
        console.log(`[hook:warn] ${toolName}:`, pre.warnings);
      }
    } catch (e) {
      console.log('[hook] Pre error:', e.message);
    }
  }

  // 3. Execute tool (placeholder - integrate with OpenClaw runtime)
  let result;
  try {
    result = await executeTool(toolName, toolArgs);
  } catch (e) {
    result = { error: e.message };
  }

  // 4. Run POST hooks
  if (hookRunner) {
    try {
      const durationMs = result._durationMs || 0;
      hookRunner.runPostHooks(toolName, toolArgs, result, 'default', durationMs);
    } catch (e) {
      console.log('[hook] Post error:', e.message);
    }
  }

  return { result, compacted, savedTokens, hookDenied };
}

/**
 * Placeholder - actual tool execution
 * INTEGRATE HERE: Replace with OpenClaw's actual tool executor
 */
async function executeTool(toolName, args) {
  throw new Error('Not implemented - integrate with OpenClaw runtime');
}

/**
 * COMPACT MODE: Call this at the START of each session
 * Replaces old conversation history with summarized version
 */
async function initSession(history) {
  if (!compact) return history;
  try {
    const result = await compact.maybeCompact(history, { threshold: 50000 });
    if (result.compacted) {
      console.log(`[session:compact] Saved ~${result.savedTokens} tokens`);
      return result.newHistory;
    }
  } catch (e) {
    console.log('[session:compact] Error:', e.message);
  }
  return history;
}

/**
 * Integration points in OpenClaw runtime
 * These are the files to modify for actual integration:
 */
const INTEGRATION_POINTS = {
  // In tool-executor.js or equivalent, wrap tool calls with wrappedToolCall()
  toolExecutor: 'dist/runtime-internals/tool-executor.js',
  // In conversation.js, call initSession() at session start
  sessionStart: 'dist/runtime-internals/conversation.js',
  // In mcp-stdio.js, use McpStdioManager from mcp/manager.js
  mcpRuntime: 'dist/runtime-internals/mcp-stdio.js',
  // In the main agent loop, track session history and pass to wrappedToolCall
  agentLoop: 'dist/runtime-internals/agent-loop.js'
};

module.exports = { 
  wrappedToolCall, 
  initSession, 
  INTEGRATION_POINTS,
  hookRunner,
  compact
};
