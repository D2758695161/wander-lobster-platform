/**
 * CLAW-CODE Hook Pipeline — OpenClaw Implementation
 * PreToolUse/PostToolUse shell command hooks with exit-code semantics
 * Exit codes: 0=allow, 1=warn, 2=deny
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const HOOKS_DIR = path.join(__dirname);
const PRE_DIR = path.join(HOOKS_DIR, 'pre');
const POST_DIR = path.join(HOOKS_DIR, 'post');

const HOOK_ALLOW = 0;
const HOOK_WARN = 1;
const HOOK_DENY = 2;

// Detect shell on Windows
function detectShell() {
  if (process.platform === 'win32') {
    const gitSh = 'C:\\Program Files\\Git\\bin\\sh.exe';
    if (fs.existsSync(gitSh)) return { cmd: gitSh, args: ['--'] };
    const wslBash = 'C:\\Windows\\system32\\bash.exe';
    if (fs.existsSync(wslBash)) return { cmd: wslBash, args: ['-c'] };
    return { cmd: 'cmd', args: ['/c'] };
  }
  return { cmd: 'bash', args: ['-c'] };
}

const SHELL = detectShell();

/**
 * Run pre-hooks for a tool. Returns { allowed, warnings, denied, reason }
 * Must be called with await
 */
async function runPreHooks(toolName, toolInput, sessionId = 'default') {
  const hookFiles = ['general.sh', `${toolName}.sh`].filter(f => {
    return fs.existsSync(path.join(PRE_DIR, f));
  });

  for (const hookFile of hookFiles) {
    const hookPath = path.join(PRE_DIR, hookFile);
    try {
      const result = await runShellHook(hookPath, toolName, toolInput, null, sessionId);
      if (result.denied) return result;
    } catch (e) {
      // Hook error: warn but don't block
      console.log('[hook:error]', toolName, hookFile, e.message);
    }
  }

  return { allowed: true, denied: false, warnings: [] };
}

/**
 * Run post-hooks for a tool.
 * Must be called with await
 */
async function runPostHooks(toolName, toolInput, toolOutput, sessionId = 'default', durationMs = 0) {
  const hookFiles = ['general.sh', `${toolName}.sh`].filter(f => {
    return fs.existsSync(path.join(POST_DIR, f));
  });

  const hookResults = [];
  for (const hookFile of hookFiles) {
    const hookPath = path.join(POST_DIR, hookFile);
    try {
      const result = await runShellHook(hookPath, toolName, toolInput, toolOutput, sessionId, durationMs);
      hookResults.push(result);
    } catch (e) {
      hookResults.push({ error: e.message });
    }
  }
  return { hookResults };
}

/**
 * Execute a single shell hook script, returns a Promise
 */
function runShellHook(hookPath, toolName, toolInput, toolOutput, sessionId, durationMs = 0) {
  return new Promise((resolve) => {
    const inputJson = JSON.stringify({
      tool_name: toolName,
      input: toolInput,
      output: toolOutput || null,
      error: toolOutput?.error || false,
      exit_code: toolOutput?.exitCode ?? null,
      duration_ms: durationMs,
      session_id: sessionId,
      openclaw_version: '2026.3.28'
    });

    const env = {
      ...process.env,
      TOOL_NAME: toolName,
      TOOL_INPUT: JSON.stringify(toolInput),
      TOOL_OUTPUT: toolOutput ? JSON.stringify(toolOutput) : '',
      TOOL_ERROR: String(toolOutput?.error || false),
      TOOL_EXIT_CODE: String(toolOutput?.exitCode ?? ''),
      TOOL_DURATION_MS: String(durationMs),
      SESSION_ID: sessionId,
      TOOL_CALL_INDEX: String(runPreHooks._callIndex || 0),
      OPENCLAW_VERSION: '2026.3.28'
    };

    const shellArgs = [...SHELL.args, hookPath];
    const child = spawn(SHELL.cmd, shellArgs, {
      env,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';
    let settled = false;

    function resolveThis(exitCode) {
      if (settled) return;
      settled = true;
      if (exitCode === HOOK_DENY) {
        resolve({ denied: true, allowed: false, reason: stderr.trim() || 'Hook denied', exitCode, stdout: stdout.trim() });
      } else if (exitCode === HOOK_WARN) {
        resolve({ denied: false, allowed: true, warning: stderr.trim() || 'Hook warning', exitCode, stdout: stdout.trim() });
      } else {
        resolve({ denied: false, allowed: true, exitCode, stdout: stdout.trim(), stderr: stderr.trim() });
      }
    }

    child.stdout.on('data', d => { stdout += d; });
    child.stderr.on('data', d => { stderr += d; });
    child.on('close', code => resolveThis(code || 0));
    child.on('error', err => {
      if (settled) return;
      settled = true;
      resolve({ denied: false, allowed: true, error: err.message });
    });

    // Send input
    child.stdin.write(inputJson);
    child.stdin.end();
  });
}

let toolCallIndex = 0;
function nextToolCallIndex() { return ++toolCallIndex; }

module.exports = {
  runPreHooks,
  runPostHooks,
  runShellHook,
  nextToolCallIndex,
  HOOK_ALLOW,
  HOOK_WARN,
  HOOK_DENY
};
