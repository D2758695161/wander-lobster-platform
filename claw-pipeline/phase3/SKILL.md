# CLAW-Pipeline Phase 3: Platformization Features

> Extensible slash commands, instruction file discovery, LSP integration, and multi-agent team orchestration.

**Phase:** 3 — Platformization  
**Files:** `slash-commands.ts`, `instruction-discovery.ts`, `lsp-client.ts`, `lsp-servers.ts`, `team-workspace.ts`  
**Language:** TypeScript

---

## Overview

Phase 3 adds four core platform capabilities to CLAW-Pipeline:

| Module | Purpose |
|--------|---------|
| `slash-commands.ts` | Extensible slash command registry with 30+ built-in commands |
| `instruction-discovery.ts` | Auto-discover instruction files walking up the directory tree |
| `lsp-client.ts` + `lsp-servers.ts` | JSON-RPC LSP client for 20+ languages |
| `team-workspace.ts` | Multi-agent orchestration with tasks, messaging, and workflows |

---

## Quick Start

```typescript
import { slashCommandRegistry } from './slash-commands';
import { instructionDiscoverer } from './instruction-discovery';
import { createLSPClient, listAvailableServers } from './lsp-servers';
import { teamWorkspace, createTeamWithRoles } from './team-workspace';

// ─── Slash Commands ────────────────────────────────────────────────────────

// Parse and execute a slash command
const ctx = {
  sessionId: 's1',
  sessionKey: 'main',
  agentDir: process.cwd(),
  workspaceDir: process.cwd(),
  runId: 'r1',
};

const result = await slashCommandRegistry.execute('/help exec', ctx);
console.log(result.content);

// List all commands
const cmds = slashCommandRegistry.list('memory');

// Get help for a specific command
const help = slashCommandRegistry.getHelp('exec');

// ─── Instruction Discovery ────────────────────────────────────────────────

// Discover instruction files from current directory
const files = await instructionDiscoverer.discover({ maxTotalChars: 12000 });

// Build a prompt section
const section = instructionDiscoverer.buildPromptSection(files);

// Quick 4K inject
const quick = instructionDiscoverer.buildQuickSection(files);

// Deduplicate by content hash
const unique = instructionDiscoverer.deduplicateByHash(files);

// ─── LSP Client ──────────────────────────────────────────────────────────

// Create a TypeScript LSP client
const lsp = createLSPClient('typescript');
if (lsp) {
  await lsp.initialize();
  
  const def = await lsp.gotoDefinition('file:///src/main.ts', 10, 5);
  const refs = await lsp.findReferences('file:///src/main.ts', 10, 5);
  const completions = await lsp.getCompletions('file:///src/main.ts', 10, 5);
  const hover = await lsp.hover('file:///src/main.ts', 10, 5);
  const symbols = await lsp.documentSymbols('file:///src/main.ts');
  
  await lsp.shutdown();
}

// List all available servers
console.log(listAvailableServers());

// ─── Team Workspace ──────────────────────────────────────────────────────

// Create a team with specific roles
const team = createTeamWithRoles([
  { name: 'Alice', role: 'architect' },
  { name: 'Bob', role: 'developer' },
  { name: 'Carol', role: 'reviewer' },
]);

// Create tasks
const task1 = team.createTask({
  title: 'Design API',
  description: 'Design the REST API schema',
  status: 'pending',
  priority: 'high',
  artifacts: [],
  dependencies: [],
});

const task2 = team.createTask({
  title: 'Implement API',
  description: 'Implement the REST API',
  status: 'pending',
  priority: 'high',
  artifacts: [],
  dependencies: [task1.id],
});

// Assign and delegate
team.assignTask(task1.id, 'member-1');
const runId = await team.delegateTask(task1.id, 'member-1', 'Design the API schema');

// Send messages
team.sendMessage({
  from: 'member-1',
  to: 'member-2',
  content: 'Design complete, starting implementation',
  type: 'update',
});

// Broadcast to all
team.sendMessage({
  from: 'member-1',
  content: 'All agents: new design document available',
  type: 'update',
});

// Coordinate a workflow
const result = await team.coordinate({
  name: 'Code → Review → Approve',
  steps: [
    { id: 's1', action: 'delegate', target: 'member-1', task: task2.id },
    { id: 's2', action: 'delegate', target: 'member-2', task: task2.id, waitFor: [task1.id] },
    { id: 's3', action: 'review', target: 'member-3', waitFor: ['s2'] },
    { id: 's4', action: 'approve', target: 'member-1', waitFor: ['s3'] },
  ],
});

console.log(result);
// { workflow: 'Code → Review → Approve', completedSteps: [...], failedSteps: [], outputs: {...}, duration: ms }
```

---

## Slash Commands (`slash-commands.ts`)

### Architecture

- **Registry pattern** — commands registered with metadata + handler
- **Alias support** — each command can have multiple aliases
- **Argument parsing** — handles positional args, named args (`-key value`), and quoted strings
- **Pattern validation** — optional RegExp validation on arguments
- **Markdown help generation** — per-command help with examples

### Built-in Commands (30+)

#### Agent Commands
| Command | Description | Aliases |
|---------|-------------|---------|
| `/agent [id]` | Get info about an agent | `/whoami` |
| `/agents` | List all active agents | — |
| `/team <action>` | Interact with team workspace | — |
| `/spawn <task>` | Spawn a new sub-agent | `/run`, `/bg` |
| `/delegate <task-id> <to>` | Delegate task to team member | — |

#### Tools Commands
| Command | Description | Aliases |
|---------|-------------|---------|
| `/tools` | List all available tools | `/list-tools` |
| `/tool <name>` | Get details about a tool | `/tool-info` |
| `/hook [name] [script]` | Show or set a tool hook | — |
| `/hooks` | List all registered hooks | — |
| `/mcp <action> [server]` | Interact with MCP servers | — |
| `/lsp <action> [lang]` | Start/interact with LSP servers | — |

#### Memory Commands
| Command | Description | Aliases |
|---------|-------------|---------|
| `/memory [query] [tier]` | Search memory stores | `/mem`, `/remember` |
| `/compact [level]` | Compact context (quick/normal/aggressive) | `/condense` |
| `/summarize [target]` | Summarize session or artifact | `/sum` |
| `/forget <pattern>` | Forget memory entries | `/delete-memory` |

#### Config Commands
| Command | Description | Aliases |
|---------|-------------|---------|
| `/model [name]` | Show or change current model | — |
| `/permission [action]` | Manage permission levels | `/perms` |
| `/config [key] [value]` | View or set config | `/cfg` |
| `/mode <mode>` | Set agent mode | — |

#### System Commands
| Command | Description | Aliases |
|---------|-------------|---------|
| `/exec <command>` | Execute shell command | `/$` |
| `/bash <command>` | Execute shell command | `/sh` |
| `/eval <expr>` | Evaluate JS expression | `/js` |
| `/status` | Show session status | `/stats` |
| `/health [component]` | Run health check | `/check` |

#### File Commands
| Command | Description | Aliases |
|---------|-------------|---------|
| `/read <file> [offset] [limit]` | Read file contents | `/cat`, `/open` |
| `/write <file> <content>` | Write file | `/save`, `/create` |
| `/edit <file> <old> <new>` | Edit file by replacement | `/patch` |
| `/glob <pattern> [dir]` | Find files matching glob | `/find`, `/ls` |
| `/grep <pattern> [files]` | Search for text in files | `/search`, `/rg` |

#### Session Commands
| Command | Description | Aliases |
|---------|-------------|---------|
| `/new [type]` | Start new session | `/session-new` |
| `/reset [confirm]` | Reset current context | `/clear` |
| `/resume <session-id>` | Resume a previous session | — |
| `/export [format] [path]` | Export session/artifacts | — |
| `/import <source>` | Import session/artifacts | — |

#### Help Commands
| Command | Description | Aliases |
|---------|-------------|---------|
| `/help [command]` | Show help | `/?` |
| `/commands [category]` | List all commands | `/cmds` |
| `/skills [search]` | List installed skills | `/skill-list` |

### Custom Commands

Register your own command:

```typescript
registry.register({
  name: 'hello',
  description: 'Say hello',
  args: [
    { name: 'name', description: 'Name to greet', required: false, default: 'world' },
  ],
  aliases: ['hi'],
  examples: ['Alice'],
  category: 'agent',
}, async (args, ctx) => {
  return { content: `Hello, ${args.name}! (from ${ctx.sessionId})` };
});
```

### Argument Parsing

```
/command positional1 positional2 -flag value --option another
```

- **Positional args** — matched in order of definition
- **Named args** — `-key value` or `--key value`
- **Quoted strings** — `"multi word value"` or `'multi word value'`
- **Defaults** — filled automatically if not provided

---

## Instruction Discovery (`instruction-discovery.ts`)

### Discovery Priority

Files are searched in this order (lower number = higher priority):

| Priority | File | Purpose |
|----------|------|---------|
| 0 | `CLAW.md` | Primary project instructions |
| 1 | `CLAW.local.md` | Local overrides (git-ignored) |
| 2 | `.claw/CLAW.md` | Project subdirectory instructions |
| 3 | `.claw/instructions.md` | Legacy instructions path |
| 4 | `SOUL.md` | Agent persona definition |
| 5 | `AGENTS.md` | Workspace conventions |
| 6 | `MEMORY.md` | Long-term memory |
| 7 | `IDENTITY.md` | Agent identity |

### Size Budgets

- **Quick mode** (`buildQuickSection`): 4K characters max
- **Normal mode** (`buildPromptSection`): 12K characters default
- **Configurable** via `maxTotalChars` option

### Deduplication

Files with identical content (hashed via SHA-256 prefix) are deduplicated automatically, keeping the highest-priority occurrence.

### Directory Walking

Discovery starts from `anchorPath` and walks up the directory tree until:
- Root is reached (`/` on Unix, drive root on Windows)
- `maxFiles` limit reached
- A filesystem boundary is encountered

---

## LSP Client (`lsp-client.ts`)

### JSON-RPC 3.0 over stdio

The `LSPClient` class manages:
- **Process lifecycle** — spawn/kill LSP server process
- **Request/response multiplexing** — concurrent requests with timeout
- **Notification handling** — server-initiated notifications (e.g., `textDocument/publishDiagnostics`)
- **Text document sync** — open/change/close notifications

### Supported Operations

| Method | Description |
|--------|-------------|
| `gotoDefinition(uri, line, char)` | Find symbol definition |
| `findReferences(uri, line, char)` | Find all references |
| `getCompletions(uri, line, char, trigger?)` | Get completion list |
| `hover(uri, line, char)` | Get hover info |
| `documentSymbols(uri)` | Get document outline |
| `getDiagnostics(uri)` | Pull diagnostics |
| `openDocument(uri, content, lang)` | Open a file |
| `changeDocument(uri, content, version)` | Update file content |
| `closeDocument(uri)` | Close a file |

### Event Hooks

```typescript
lsp.on('notification:textDocument/publishDiagnostics', (params) => {
  console.log('Diagnostics:', params);
});

lsp.on('stderr', (data) => {
  console.error('LSP stderr:', data);
});

lsp.on('exit', (code) => {
  console.log('LSP exited with code:', code);
});
```

## Pre-configured LSP Servers (`lsp-servers.ts`)

20+ language servers pre-configured:

| Language | Command | Install Hint |
|----------|---------|--------------|
| TypeScript | `typescript-language-server --stdio` | `npm i -g typescript-language-server` |
| Python | `pylsp` | `pip install python-lsp-server` |
| Rust | `rust-analyzer` | `rustup component add rust-analyzer` |
| Go | `gopls` | `go install golang.org/x/tools/gopls@latest` |
| JavaScript | `typescript-language-server --stdio` | (same as TS) |
| Java | `jdtls` | Platform-specific install |
| C/C++ | `clangd --background-index` | LLVM distribution |
| JSON | `vscode-json-languageserver --stdio` | `npm i -g vscode-json-languageserver` |
| HTML | `vscode-html-languageserver-bin --stdio` | `npm i -g vscode-html-languageserver-bin` |
| CSS | `vscode-css-languageserver-bin --stdio` | `npm i -g vscode-css-languageserver-bin` |
| YAML | `yaml-language-server --stdio` | `npm i -g yaml-language-server` |
| Markdown | `markdown-language-server --stdio` | `npm i -g markdown-language-server` |
| Vue | `vue-language-server --stdio` | `npm i -g @vue/language-server` |
| Svelte | `svelte-language-server --stdio` | `npm i -g svelte-language-server` |
| GraphQL | `graphql-lsp-server --stdio` | `npm i -g graphql-language-service-cli` |
| Terraform | `terraform-ls serve` | GitHub releases |
| Lua | `lua-language-server` | GitHub releases |
| Ruby | `solargraph stdio` | `gem install solargraph` |
| PHP | `intelephense --stdio` | `npm i -g intelephense` |

---

## Team Workspace (`team-workspace.ts`)

### Concepts

**Members** — Agents with roles and capabilities (architect, developer, reviewer, researcher, coordinator)  
**Tasks** — Units of work with dependencies, priorities, and artifact tracking  
**Messages** — Inter-agent communication (direct or broadcast)  
**Workflows** — Multi-step orchestration with dependency management

### Task Lifecycle

```
pending → in_progress → review → done
           ↓               ↓
        blocked ←───── (reviewer rejects)
```

### Dependency Graph

Tasks can depend on other tasks. `getTaskGraph()` returns tasks + edges for topological sorting or visualization:

```typescript
const { tasks, edges } = team.getTaskGraph();
// edges: [['task-1', 'task-2'], ...] — task-1 must complete before task-2
```

### Workflow Coordination

The `coordinate()` method executes a workflow with steps:

- **`spawn`** — Launch a new agent
- **`delegate`** — Assign a task to a team member
- **`merge`** — Aggregate outputs from previous steps
- **`review`** — Trigger a review step
- **`approve`** — Final approval

Steps can have `waitFor` dependencies. The coordinator waits for dependencies to complete before executing each step.

### Example: Full Team Workflow

```typescript
const team = createTeamWithRoles([
  { name: 'Architect', role: 'architect' },
  { name: 'Developer', role: 'developer' },
  { name: 'Reviewer', role: 'reviewer' },
]);

// Create tasks
const specTask = team.createTask({
  title: 'Write SPEC.md',
  description: 'Write the specification document',
  priority: 'critical',
  status: 'pending',
  artifacts: [],
  dependencies: [],
});

const implTask = team.createTask({
  title: 'Implement feature',
  description: 'Implement the feature per spec',
  priority: 'high',
  status: 'pending',
  dependencies: [specTask.id],
});

const reviewTask = team.createTask({
  title: 'Code review',
  description: 'Review the implementation',
  priority: 'medium',
  status: 'pending',
  dependencies: [implTask.id],
});

// Coordinate
const result = await team.coordinate({
  name: 'Spec → Implement → Review',
  steps: [
    { id: 's1', action: 'delegate', target: 'member-1', task: specTask.id },
    { id: 's2', action: 'delegate', target: 'member-2', task: implTask.id, waitFor: ['s1'] },
    { id: 's3', action: 'delegate', target: 'member-3', task: reviewTask.id, waitFor: ['s2'] },
    { id: 's4', action: 'approve', target: 'member-1', waitFor: ['s3'] },
  ],
});

console.log(result.duration, 'ms');
console.log(result.completedSteps);
```

---

## Integration Points

### With Phase 1 & 2

- **CLAW File**: `instruction-discovery.ts` implements CLAW.md loading
- **Tool System**: `slash-commands.ts` extends tool registration pattern
- **Agent Sessions**: `team-workspace.ts` manages multi-agent session coordination

### Environment Variables

| Variable | Used By | Description |
|----------|---------|-------------|
| `OPENCLAW_MODEL` | `slash-commands.ts` (`/model`) | Current model name |
| `OPENCLAW_LSP_PATH` | `lsp-servers.ts` | Additional LSP server paths |

### Extending

**Add a custom LSP server:**
```typescript
LSPServerConfigs['custom'] = {
  name: 'My Custom Server',
  languages: ['mylang'],
  filePatterns: ['*.ml'],
  command: 'my-lang-server',
  args: ['--stdio'],
};
```

**Add a custom team role:**
```typescript
team.addMember({
  id: 'devops-1',
  name: 'DevOps',
  role: 'developer', // extend existing roles
  capabilities: ['ci-cd', 'deployment', 'docker', 'kubernetes'],
  status: 'idle',
  sessionKey: '...',
});
```

---

## Files

| File | Lines | Purpose |
|------|-------|---------|
| `slash-commands.ts` | ~700 | Slash command registry + 30+ built-in commands |
| `instruction-discovery.ts` | ~220 | Instruction file discovery + deduplication |
| `lsp-client.ts` | ~380 | JSON-RPC LSP client implementation |
| `lsp-servers.ts` | ~250 | Pre-configured server definitions |
| `team-workspace.ts` | ~430 | Multi-agent orchestration |
| `SKILL.md` | (this file) | Documentation |

**Total:** ~1,980 lines of TypeScript

---

_Last updated: Phase 3 — Platformization_
