/**
 * CLAW-Pipeline OpenClaw Plugin
 * 
 * Registers CLAW-CODE inspired hooks:
 * - before_tool_call: intercept tool execution, block dangerous commands, run pre-hooks
 * - after_tool_call: log tool results, run post-hooks
 * - before_compaction: observe compaction events
 * - agent_end: log session summary
 * 
 * Hook semantics (from OpenClaw docs):
 * - before_tool_call: { block: true } is terminal — stops lower-priority handlers
 * - before_tool_call: { block: false } is no decision — doesn't override a prior block
 */

import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { spawn } from "node:child_process";

// ─── Constants ───────────────────────────────────────────────────────────────

const LOG_FILE = "/tmp/openclaw_hook_log.txt";
const SHELL = process.platform === "win32"
  ? { cmd: "C:\\Program Files\\Git\\bin\\sh.exe", args: ["--"] }
  : { cmd: "bash", args: ["-c"] };

// ─── Helpers ────────────────────────────────────────────────────────────────

function log(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  try {
    fs.appendFileSync(LOG_FILE, line + "\n");
  } catch {
    // ignore
  }
  console.log(line);
}

function getToolCommand(params: Record<string, unknown>): string | null {
  // Extract command from exec tool params
  if (typeof params.command === "string") return params.command;
  // Also handle cmd, script, value fields
  for (const key of ["cmd", "script", "value"]) {
    if (typeof params[key] === "string") return params[key];
  }
  return null;
}

function isDangerousCommand(cmd: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    if (cmd.includes(pattern)) return true;
  }
  return false;
}

async function runShellHook(
  hookScript: string,
  toolName: string,
  toolParams: Record<string, unknown>,
  toolResult?: Record<string, unknown>,
  sessionId = "unknown"
): Promise<{ denied: boolean; allowed: boolean; reason?: string; exitCode?: number }> {
  return new Promise((resolve) => {
    const env = {
      ...process.env,
      TOOL_NAME: toolName,
      TOOL_INPUT: JSON.stringify(toolParams),
      TOOL_OUTPUT: toolResult ? JSON.stringify(toolResult) : "",
      TOOL_ERROR: String(toolResult?.["error"] ?? false),
      TOOL_EXIT_CODE: String(toolResult?.["exitCode"] ?? ""),
      SESSION_ID: sessionId,
      OPENCLAW_VERSION: "2026.3.28",
    };

    const shellArgs = [...SHELL.args, hookScript];
    const child = spawn(SHELL.cmd, shellArgs, {
      env,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    function finish(exitCode: number) {
      if (settled) return;
      settled = true;
      if (exitCode === 2) {
        resolve({ denied: true, allowed: false, reason: stderr.trim() || "Hook denied", exitCode });
      } else if (exitCode === 1) {
        resolve({ denied: false, allowed: true, reason: stderr.trim() || "Hook warning" });
      } else {
        resolve({ denied: false, allowed: true, exitCode });
      }
    }

    child.stdout.on("data", (d) => { stdout += d; });
    child.stderr.on("data", (d) => { stderr += d; });
    child.on("close", (code) => finish(code ?? 0));
    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      resolve({ denied: false, allowed: true, reason: err.message });
    });

    child.stdin.write(JSON.stringify({ tool_name: toolName, params: toolParams }));
    child.stdin.end();
  });
}

// ─── Compaction State ───────────────────────────────────────────────────────

const compactionState = {
  toolCallCount: 0,
  sessionTokens: 0,
  lastCompaction: 0,
};

// ─── Plugin Entry ───────────────────────────────────────────────────────────

export default definePluginEntry({
  id: "claw-pipeline",
  name: "CLAW-Pipeline",
  description: "CLAW-CODE inspired hook pipeline + session compaction + permission escalation for OpenClaw",

  configSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      compactThreshold: { type: "number", default: 50000 },
      compactPreserve: { type: "number", default: 20 },
      logFile: { type: "string", default: "/tmp/openclaw_hook_log.txt" },
      dangerousPatterns: {
        type: "array",
        items: { type: "string" },
        default: ["rm -rf /", "mkfs", "wipefs", "/dev/sd", "dd of=/dev"],
      },
    },
  },

  register(api) {
    // ── before_tool_call ────────────────────────────────────────────────
    api.registerHook("before_tool_call", async (event, ctx) => {
      const toolName = event.toolName;
      const params = event.params ?? {};
      const sessionId = ctx.sessionId ?? "unknown";
      const runId = event.runId ?? "unknown";
      const toolCallId = event.toolCallId ?? "unknown";

      compactionState.toolCallCount++;

      // 1. Permission/Dangerous command check for exec tool
      if (toolName === "exec") {
        const cmd = getToolCommand(params);
        const dangerousPatterns: string[] = (api.config?.["dangerousPatterns"] as string[]) ?? [
          "rm -rf /", "mkfs", "wipefs", "/dev/sd", "dd of=/dev",
        ];

        if (cmd && isDangerousCommand(cmd, dangerousPatterns)) {
          log(`[CLAW-PIPELINE] BLOCKED ${toolName}: ${cmd} (session=${sessionId})`);
          return {
            block: true,
            blockReason: `CLAW-Pipeline: Dangerous command blocked: ${cmd}`,
          };
        }
      }

      // 2. Log tool access
      log(`[CLAW-PIPELINE] before_tool_call ${toolName} session=${sessionId} runId=${runId} callId=${toolCallId} params=${JSON.stringify(params).substring(0, 200)}`);

      // 3. Check compaction threshold
      const threshold = (api.config?.["compactThreshold"] as number) ?? 50000;
      if (compactionState.sessionTokens >= threshold) {
        log(`[CLAW-PIPELINE] ⚠️ Session token count ${compactionState.sessionTokens} exceeds threshold ${threshold}. Consider compacting.`);
      }

      // 4. No block — allow the tool to execute
      return { block: false };
    });

    // ── after_tool_call ─────────────────────────────────────────────────
    api.registerHook("after_tool_call", async (event, ctx) => {
      const toolName = event.toolName;
      const sessionId = ctx.sessionId ?? "unknown";
      const toolCallId = event.toolCallId ?? "unknown";

      // Estimate tokens from tool name + params
      compactionState.sessionTokens += toolName.length * 2;

      log(`[CLAW-PIPELINE] after_tool_call ${toolName} session=${sessionId} callId=${toolCallId} calls=${compactionState.toolCallCount}`);
    });

    // ── before_compaction ───────────────────────────────────────────────
    api.registerHook("before_compaction", async (event, ctx) => {
      const sessionId = ctx.sessionId ?? "unknown";
      log(`[CLAW-PIPELINE] before_compaction session=${sessionId} reason=${event["reason"] ?? "unknown"}`);
      // Could inspect event.messages and provide annotations
    });

    // ── after_compaction ────────────────────────────────────────────────
    api.registerHook("after_compaction", async (event, ctx) => {
      const sessionId = ctx.sessionId ?? "unknown";
      compactionState.sessionTokens = 0; // Reset after compaction
      log(`[CLAW-PIPELINE] after_compaction session=${sessionId} — tokens reset`);
    });

    // ── agent_end ───────────────────────────────────────────────────────
    api.registerHook("agent_end", async (event, ctx) => {
      const sessionId = ctx.sessionId ?? "unknown";
      const runId = event["runId"] ?? "unknown";
      log(`[CLAW-PIPELINE] agent_end session=${sessionId} runId=${runId} totalCalls=${compactionState.toolCallCount}`);
      // Reset state
      compactionState.toolCallCount = 0;
      compactionState.sessionTokens = 0;
    });

    // ── session_start ───────────────────────────────────────────────────
    api.registerHook("session_start", async (event, ctx) => {
      const sessionId = ctx.sessionId ?? "unknown";
      const sessionKey = ctx.sessionKey ?? "unknown";
      log(`[CLAW-PIPELINE] session_start session=${sessionId} key=${sessionKey}`);
      compactionState.toolCallCount = 0;
      compactionState.sessionTokens = 0;
    });

    log(`[CLAW-PIPELINE] Plugin registered hooks: before_tool_call, after_tool_call, before_compaction, after_compaction, agent_end, session_start`);
  },
});
