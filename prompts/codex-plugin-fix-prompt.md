# Codex Plugin CC — Quick Fix Agent

## Your Task
Fix bugs in the openai/codex-plugin-cc GitHub repository.

## Repos to Target
- **openai/codex-plugin-cc** (PRIMARY — 6 fresh bugs today)
- **claude-builders-bounty** (secondary — $50-200 bounties)
- **kcolbchain/muzix** (secondary — $250+ DeFi bounties)

## High-Priority Bugs (openai/codex-plugin-cc) — Fixed Today

### 🔴 P0: Test suite leaks broker processes (#163)
```
Severity: HIGH | Reward: $50-200 | Difficulty: Hard
```
**Bug:** Test suite leaves 158 broker processes running (orphans detected)
**Location:** Test teardown hooks / process cleanup logic
**Fix approach:**
1. Find where broker processes are spawned in test files
2. Add proper cleanup in `afterAll`/`afterEach` hooks
3. Track PIDs and ensure `process.kill(pid, 'SIGTERM')` on cleanup
4. Verify with: count orphaned processes after test run

### 🔴 P1: EAGAIN in hook scripts (#165)
```
Severity: MEDIUM | Reward: $50-200 | Difficulty: Medium
```
**Bug:** Hook scripts fail with EAGAIN when stdin is non-blocking
**Location:** Hook script execution / IPC stdin handling
**Fix approach:**
```typescript
// Instead of:
const data = read(fd, buf, 0, buf.length, null);
// Use:
let bytesRead;
while ((bytesRead = read(fd, buf, 0, buf.length, null)) === -1) {
  if (errno === 'EAGAIN') { await sleep(10); continue; }
  throw new Error(`read error: ${errno}`);
}
```

### 🟡 P2: ANSI escape sequences break JSONL parsing (#171)
```
Severity: MEDIUM | Reward: $50-200 | Difficulty: Easy
```
**Bug:** Bracketed paste mode sequences ([?2004h/l) break JSONL output parsing
**Fix approach:**
```typescript
function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
}
// Apply before JSON.parse on each JSONL line
```

### 🟡 P3: JSONL parse error — bracketed paste mode (#23)
```
Severity: MEDIUM | Reward: $50-200 | Difficulty: Easy
```
Same root cause as #171 — combine fixes.

### 🟡 P4: NLPM audit findings (#170)
```
Severity: MEDIUM | Reward: $50-200 | Difficulty: Medium
```
4 bugs found, 93/100 score. Check audit report and fix identified issues.

### 🟢 P5: Declare model in codex-rescue agent frontmatter (#169)
```
Severity: LOW | Reward: $50-200 | Difficulty: Easy
```
**Fix:** Add model declaration in YAML frontmatter config for codex-rescue agent.

## Workflow

1. **Claim:** Post `/attempt` comment on the GitHub issue
2. **Branch:** `fix/issue-NUMBER-brief-description`
3. **Fix:** Implement the fix following the approach above
4. **Test:** Run relevant tests to verify fix doesn't break anything
5. **PR:** Open PR with description:
   ```
   ## Fix: [Issue Title]
   
   ### Problem
   [1-2 sentences]
   
   ### Solution
   [What you changed and why]
   
   ### Testing
   [How to verify the fix]
   ```
6. **Comment:** Reference the bounty and your PR in the issue

## CLAUDE.md Context
When working in openai/codex-plugin-cc, remember:
- This is a Claude Code VS Code extension compatibility layer
- Written in TypeScript, test suite uses Vitest
- Hook scripts run in separate Node processes
- JSONL is used for structured Claude Code output

## Reward Collection
After PR merges, check the issue for reward instructions or post `/collect` comment.
