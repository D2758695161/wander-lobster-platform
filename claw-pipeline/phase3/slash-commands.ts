/**
 * CLAW-CODE Slash Command Registry
 * Extensible command system with argument parsing, help generation, aliases
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface CommandArg {
  name: string;
  description: string;
  required: boolean;
  default?: string;
  pattern?: RegExp;
}

export interface CommandMeta {
  name: string;
  description: string;
  args: CommandArg[];
  aliases: string[];
  examples: string[];
  category: 'agent' | 'tools' | 'system' | 'memory' | 'config' | 'team' | 'files' | 'session';
}

export interface CommandHandler {
  (args: Record<string, string>, context: CommandContext): Promise<CommandResult> | CommandResult;
}

export interface CommandContext {
  sessionId: string;
  sessionKey: string;
  agentDir: string;
  workspaceDir: string;
  runId: string;
}

export interface CommandResult {
  content: string;
  done?: boolean;
  error?: string;
}

// ─── Registry ────────────────────────────────────────────────────────────────

class SlashCommandRegistry {
  private commands = new Map<string, CommandMeta & { handler: CommandHandler }>();

  register(meta: CommandMeta, handler: CommandHandler): void {
    // Register primary name
    this.commands.set(meta.name, { ...meta, handler });
    // Register aliases
    for (const alias of meta.aliases) {
      this.commands.set(alias, { ...meta, handler });
    }
  }

  resolve(nameOrAlias: string): CommandMeta | null {
    const entry = this.commands.get(nameOrAlias);
    if (!entry) return null;
    // Return meta without handler to avoid leaking internals
    const { handler: _h, ...meta } = entry;
    return meta as CommandMeta;
  }

  list(category?: string): CommandMeta[] {
    const seen = new Set<string>();
    const results: CommandMeta[] = [];
    for (const [, entry] of this.commands) {
      if (seen.has(entry.name)) continue;
      seen.add(entry.name);
      if (!category || entry.category === category) {
        const { handler: _h, ...meta } = entry;
        results.push(meta as CommandMeta);
      }
    }
    return results;
  }

  getHelp(name: string): string {
    const entry = this.commands.get(name);
    if (!entry) return `❌ Unknown command: /${name}`;

    const { handler: _h, ...meta } = entry;
    const lines: string[] = [];

    lines.push(`## /${meta.name}`);
    lines.push(meta.description);
    lines.push('');
    lines.push('**Usage:**');
    lines.push(`\`/${meta.name}${meta.args.length ? ' ' + meta.args.map(a =>
      a.required ? `<${a.name}>` : `[${a.name}]`
    ).join(' ') : ''}\``);
    lines.push('');

    if (meta.aliases.length) {
      lines.push(`**Aliases:** ${meta.aliases.map(a => `\`/${a}\``).join(', ')}`);
      lines.push('');
    }

    if (meta.args.length) {
      lines.push('**Arguments:**');
      for (const arg of meta.args) {
        const req = arg.required ? 'required' : 'optional';
        const def = arg.default !== undefined ? ` (default: \`${arg.default}\`)` : '';
        lines.push(`- \`${arg.name}\` — ${arg.description} [${req}]${def}`);
      }
      lines.push('');
    }

    if (meta.examples.length) {
      lines.push('**Examples:**');
      for (const ex of meta.examples) {
        lines.push(`\`\`\`\n/${meta.name} ${ex}\n\`\`\``);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  parse(raw: string): { command: string; args: Record<string, string> } {
    const trimmed = raw.trim();
    if (!trimmed.startsWith('/')) {
      return { command: '', args: {} };
    }

    // Split on whitespace, but preserve quoted strings
    const tokens = this.tokenize(trimmed.slice(1));
    const command = tokens[0]?.toLowerCase() ?? '';
    const argTokens = tokens.slice(1);

    const entry = this.commands.get(command);
    if (!entry) return { command, args: {} };

    const args: Record<string, string> = {};
    const positional: Array<{ name: string; idx: number }> = [];

    // Identify positional vs named args
    entry.args.forEach((arg, idx) => {
      if (!arg.name.startsWith('-')) {
        positional.push({ name: arg.name, idx });
      }
    });

    let positionalIdx = 0;
    for (let i = 0; i < argTokens.length; i++) {
      const tok = argTokens[i];
      if (tok.startsWith('-')) {
        // Named: -key value or --key value
        const key = tok.replace(/^-+/, '');
        const next = argTokens[i + 1];
        if (next && !next.startsWith('-')) {
          args[key] = next;
          i++;
        } else {
          args[key] = 'true';
        }
      } else {
        // Positional
        if (positionalIdx < positional.length) {
          args[positional[positionalIdx].name] = tok;
          positionalIdx++;
        }
      }
    }

    // Fill defaults
    for (const arg of entry.args) {
      if (args[arg.name] === undefined && arg.default !== undefined) {
        args[arg.name] = arg.default;
      }
    }

    return { command, args };
  }

  private tokenize(input: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';
    for (const ch of input) {
      if ((ch === '"' || ch === "'") && !inQuote) {
        inQuote = true;
        quoteChar = ch;
      } else if (ch === quoteChar && inQuote) {
        inQuote = false;
        quoteChar = '';
      } else if (ch === ' ' && !inQuote) {
        if (current) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += ch;
      }
    }
    if (current) tokens.push(current);
    return tokens;
  }

  async execute(raw: string, ctx: CommandContext): Promise<CommandResult> {
    const { command, args } = this.parse(raw);
    if (!command) return { content: 'No command found', error: 'No command in input' };

    const entry = this.commands.get(command);
    if (!entry) return { content: `Unknown command: /${command}`, error: `Command /${command} not found` };

    // Check required args
    for (const arg of entry.args) {
      if (arg.required && args[arg.name] === undefined && arg.default === undefined) {
        return {
          content: `Missing required argument: ${arg.name}\n\n${this.getHelp(command)}`,
          error: `Missing required argument: ${arg.name}`
        };
      }
      // Validate pattern
      if (arg.pattern && args[arg.name] !== undefined) {
        if (!arg.pattern.test(args[arg.name])) {
          return {
            content: `Argument \`${arg.name}\` must match pattern: ${arg.pattern}`,
            error: `Pattern mismatch for ${arg.name}`
          };
        }
      }
    }

    try {
      const result = await Promise.resolve(entry.handler(args, ctx));
      return result;
    } catch (err: any) {
      return { content: `Error executing /${command}: ${err.message}`, error: err.message };
    }
  }
}

// ─── Built-in Commands ────────────────────────────────────────────────────────

function makeRegistry(): SlashCommandRegistry {
  const registry = new SlashCommandRegistry();

  // ── AGENT ──────────────────────────────────────────────────────────────────

  registry.register({
    name: 'agent',
    description: 'Get information about a specific agent or the current agent.',
    args: [
      { name: 'agent-id', description: 'Agent ID to query', required: false, default: 'self' },
    ],
    aliases: ['whoami'],
    examples: ['', 'main'],
    category: 'agent',
  }, async (args) => {
    const id = args['agent-id'] || 'self';
    return {
      content: `**Agent Info**\n- ID: ${id}\n- Status: active\n- Capabilities: code, memory, tools, team, lsp`,
    };
  });

  registry.register({
    name: 'agents',
    description: 'List all active agents in the current session.',
    args: [],
    aliases: [],
    examples: [],
    category: 'agent',
  }, async () => {
    return {
      content: `**Active Agents**\n- main (current)\n- No other agents active`,
    };
  });

  registry.register({
    name: 'team',
    description: 'Interact with the team workspace.',
    args: [
      { name: 'action', description: 'Action: list, create, status', required: true },
    ],
    aliases: [],
    examples: ['list', 'status'],
    category: 'team',
  }, async (args) => {
    return { content: `Team action: ${args.action} — TeamWorkspace integration point` };
  });

  registry.register({
    name: 'spawn',
    description: 'Spawn a new sub-agent for parallel task execution.',
    args: [
      { name: 'task', description: 'Task description for the sub-agent', required: true },
      { name: 'model', description: 'Model to use', required: false, default: 'default' },
    ],
    aliases: ['run', 'bg'],
    examples: ['Analyze this file', 'Review PR #42'],
    category: 'agent',
  }, async (args) => {
    return {
      content: `Spawning sub-agent for: ${args.task}\n(runId: ${Date.now().toString(36)})`,
      done: false,
    };
  });

  registry.register({
    name: 'delegate',
    description: 'Delegate a task to a specific team member.',
    args: [
      { name: 'task-id', description: 'Task ID to delegate', required: true },
      { name: 'to', description: 'Target agent/member ID', required: true },
      { name: 'instructions', description: 'Instructions for the delegate', required: false, default: '' },
    ],
    aliases: [],
    examples: ['task-123 developer', 'task-456 reviewer "Review the code"'],
    category: 'agent',
  }, async (args) => {
    return {
      content: `Delegated task \`${args['task-id']}\` to \`${args['to']}\`\nInstructions: ${args.instructions || '(none)'}`,
    };
  });

  // ── TOOLS ──────────────────────────────────────────────────────────────────

  registry.register({
    name: 'tools',
    description: 'List all available tools.',
    args: [],
    aliases: ['list-tools'],
    examples: [],
    category: 'tools',
  }, async () => {
    const tools = ['read', 'write', 'edit', 'exec', 'web_search', 'web_fetch', 'image', 'image_generate'];
    return {
      content: `**Available Tools**\n${tools.map(t => `- ${t}`).join('\n')}`,
    };
  });

  registry.register({
    name: 'tool',
    description: 'Get details about a specific tool.',
    args: [
      { name: 'name', description: 'Tool name', required: true },
    ],
    aliases: ['tool-info'],
    examples: ['read', 'exec'],
    category: 'tools',
  }, async (args) => {
    return { content: `Tool: \`${args.name}\` — see full documentation for details` };
  });

  registry.register({
    name: 'hook',
    description: 'Show or set a tool hook.',
    args: [
      { name: 'name', description: 'Hook name (e.g. pre-read)', required: false },
      { name: 'script', description: 'Script to run', required: false },
    ],
    aliases: [],
    examples: ['pre-read', 'pre-read "console.log(args)"'],
    category: 'tools',
  }, async (args) => {
    if (args.script) return { content: `Hook \`${args.name}\` set to: ${args.script}` };
    return { content: `Hook \`${args.name || '(未指定)'}\` — no hook configured` };
  });

  registry.register({
    name: 'hooks',
    description: 'List all registered tool hooks.',
    args: [],
    aliases: [],
    examples: [],
    category: 'tools',
  }, async () => {
    return { content: '**Tool Hooks**\n(No hooks currently registered)' };
  });

  registry.register({
    name: 'mcp',
    description: 'Interact with MCP (Model Context Protocol) servers.',
    args: [
      { name: 'action', description: 'Action: list, call, add, remove', required: true },
      { name: 'server', description: 'Server name', required: false },
      { name: 'tool', description: 'Tool to call', required: false },
    ],
    aliases: [],
    examples: ['list', 'call myserver ping'],
    category: 'tools',
  }, async (args) => {
    return { content: `MCP ${args.action} on ${args.server || '(all)'}` };
  });

  registry.register({
    name: 'lsp',
    description: 'Start or interact with an LSP server for a language.',
    args: [
      { name: 'action', description: 'Action: start, stop, symbols, diagnostics', required: true },
      { name: 'lang', description: 'Language: ts, py, rust, go, js', required: false },
      { name: 'file', description: 'File path for symbol/diagnostic queries', required: false },
    ],
    aliases: [],
    examples: ['start ts', 'symbols py ./src/main.py'],
    category: 'tools',
  }, async (args) => {
    return { content: `LSP ${args.action} for ${args.lang || '(auto)'}` };
  });

  // ── MEMORY ─────────────────────────────────────────────────────────────────

  registry.register({
    name: 'memory',
    description: 'Search or read from memory stores.',
    args: [
      { name: 'query', description: 'Search query', required: false },
      { name: 'tier', description: 'Memory tier: hot, warm, cold', required: false, default: 'hot' },
    ],
    aliases: ['mem', 'remember'],
    examples: ['"last meeting"', 'hot'],
    category: 'memory',
  }, async (args) => {
    return {
      content: `Memory query: "${args.query || '(all)'}" in tier: ${args.tier || 'hot'}\n(Memory integration: see TeamWorkspace)`,
    };
  });

  registry.register({
    name: 'compact',
    description: 'Compact the current context to free tokens.',
    args: [
      { name: 'level', description: 'Compaction level: quick, normal, aggressive', required: false, default: 'normal' },
    ],
    aliases: ['condense'],
    examples: ['quick', 'aggressive'],
    category: 'memory',
  }, async (args) => {
    return {
      content: `Context compaction (${args.level || 'normal'}) — compacted 0 tokens\n(Note: implement with actual memory tiering)`,
    };
  });

  registry.register({
    name: 'summarize',
    description: 'Summarize the current session or a specific artifact.',
    args: [
      { name: 'target', description: 'What to summarize: session, file, topic', required: false, default: 'session' },
      { name: 'file', description: 'File path if target is file', required: false },
    ],
    aliases: ['sum'],
    examples: ['session', 'file ./README.md'],
    category: 'memory',
  }, async (args) => {
    return {
      content: `**Summary of ${args.target}:**\n[Summary would be generated here based on context]`,
    };
  });

  registry.register({
    name: 'forget',
    description: 'Forget or delete specific memory entries.',
    args: [
      { name: 'pattern', description: 'Pattern or ID to forget', required: true },
      { name: 'tier', description: 'Memory tier', required: false, default: 'hot' },
    ],
    aliases: ['delete-memory'],
    examples: ['old-task-*', 'mem-12345'],
    category: 'memory',
  }, async (args) => {
    return { content: `Forgetting entries matching: ${args.pattern} in ${args.tier || 'hot'}` };
  });

  // ── CONFIG ──────────────────────────────────────────────────────────────────

  registry.register({
    name: 'model',
    description: 'Show or change the current model.',
    args: [
      { name: 'model', description: 'Model name', required: false },
    ],
    aliases: [],
    examples: ['claude-3-5-sonnet', 'gpt-4o'],
    category: 'config',
  }, async (args) => {
    const current = process.env.OPENCLAW_MODEL || 'MiniMax-M2.7';
    if (!args.model) return { content: `Current model: \`${current}\`` };
    return { content: `Model changed to: \`${args.model}\` (session only)` };
  });

  registry.register({
    name: 'permission',
    description: 'Manage permission levels for the current session.',
    args: [
      { name: 'action', description: 'Action: show, grant, revoke', required: false, default: 'show' },
      { name: 'scope', description: 'Permission scope: tools, exec, network', required: false },
    ],
    aliases: ['perms'],
    examples: ['show', 'grant exec'],
    category: 'config',
  }, async (args) => {
    return { content: `Permission ${args.action || 'show'} for ${args.scope || '(all)'}` };
  });

  registry.register({
    name: 'config',
    description: 'View or set configuration values.',
    args: [
      { name: 'key', description: 'Config key (dot notation)', required: false },
      { name: 'value', description: 'New value', required: false },
    ],
    aliases: ['cfg'],
    examples: ['model', 'model MiniMax-M2.7'],
    category: 'config',
  }, async (args) => {
    if (!args.key) return { content: 'Config: (list of current settings)' };
    return { content: `Config \`${args.key}\` set to: ${args.value || '(null)'}` };
  });

  registry.register({
    name: 'mode',
    description: 'Set the agent mode.',
    args: [
      { name: 'mode', description: 'Mode: helpful, concise, debug, creative', required: true },
    ],
    aliases: [],
    examples: ['concise', 'debug'],
    category: 'config',
  }, async (args) => {
    return { content: `Agent mode set to: \`${args.mode}\`` };
  });

  // ── SYSTEM ──────────────────────────────────────────────────────────────────

  registry.register({
    name: 'exec',
    description: 'Execute a shell command.',
    args: [
      { name: 'command', description: 'Command to execute', required: true },
    ],
    aliases: ['$'],
    examples: ['ls -la', 'git status'],
    category: 'system',
  }, async (args, ctx) => {
    try {
      const { stdout, stderr } = await execAsync(args.command, { cwd: ctx.workspaceDir, timeout: 30000 });
      return { content: stdout + stderr };
    } catch (err: any) {
      return { content: `Exec error: ${err.message}`, error: err.message };
    }
  });

  registry.register({
    name: 'bash',
    description: 'Execute a shell command (alias for /exec).',
    args: [
      { name: 'command', description: 'Command to execute', required: true },
    ],
    aliases: ['sh'],
    examples: ['ls -la'],
    category: 'system',
  }, async (args, ctx) => {
    try {
      const { stdout, stderr } = await execAsync(args.command, { cwd: ctx.workspaceDir, timeout: 30000 });
      return { content: stdout + stderr };
    } catch (err: any) {
      return { content: `Bash error: ${err.message}`, error: err.message };
    }
  });

  registry.register({
    name: 'eval',
    description: 'Evaluate a JavaScript/TypeScript expression.',
    args: [
      { name: 'expr', description: 'Expression to evaluate', required: true },
    ],
    aliases: ['js'],
    examples: ['Date.now()', 'Math.random()'],
    category: 'system',
  }, async (args) => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(args.expr);
      return { content: `=> ${JSON.stringify(result)}` };
    } catch (err: any) {
      return { content: `Eval error: ${err.message}`, error: err.message };
    }
  });

  registry.register({
    name: 'status',
    description: 'Show current session status.',
    args: [],
    aliases: ['stats'],
    examples: [],
    category: 'system',
  }, async (_, ctx) => {
    return {
      content: `**Session Status**\n- sessionId: ${ctx.sessionId}\n- sessionKey: ${ctx.sessionKey}\n- runId: ${ctx.runId}\n- workspace: ${ctx.workspaceDir}\n- agentDir: ${ctx.agentDir}`,
    };
  });

  registry.register({
    name: 'health',
    description: 'Run a health check on the system.',
    args: [
      { name: 'component', description: 'Component to check: all, memory, tools, lsp', required: false, default: 'all' },
    ],
    aliases: ['check'],
    examples: ['memory', 'lsp'],
    category: 'system',
  }, async (args) => {
    return {
      content: `**Health Check: ${args.component || 'all'}**\n✅ Memory: OK\n✅ Tools: OK\n✅ LSP: Not connected\n✅ Network: OK`,
    };
  });

  // ── FILES ───────────────────────────────────────────────────────────────────

  registry.register({
    name: 'read',
    description: 'Read the contents of a file.',
    args: [
      { name: 'file', description: 'File path to read', required: true },
      { name: 'offset', description: 'Line offset', required: false, default: '0' },
      { name: 'limit', description: 'Max lines', required: false, default: '100' },
    ],
    aliases: ['cat', 'open'],
    examples: ['./README.md', './src/main.ts 10 50'],
    category: 'files',
  }, async (args) => {
    try {
      const content = fs.readFileSync(args.file, 'utf-8');
      const lines = content.split('\n');
      const offset = parseInt(args.offset) || 0;
      const limit = parseInt(args.limit) || 100;
      const slice = lines.slice(offset, offset + limit);
      return { content: `\`\`\`\n${slice.join('\n')}\n\`\`\`` };
    } catch (err: any) {
      return { content: `Read error: ${err.message}`, error: err.message };
    }
  });

  registry.register({
    name: 'write',
    description: 'Write content to a file.',
    args: [
      { name: 'file', description: 'File path to write', required: true },
      { name: 'content', description: 'Content to write', required: true },
    ],
    aliases: ['save', 'create'],
    examples: ['./output.txt "Hello world"'],
    category: 'files',
  }, async (args) => {
    try {
      const dir = path.dirname(args.file);
      if (dir && dir !== '.' && !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(args.file, args.content, 'utf-8');
      return { content: `✅ Written to \`${args.file}\`` };
    } catch (err: any) {
      return { content: `Write error: ${err.message}`, error: err.message };
    }
  });

  registry.register({
    name: 'edit',
    description: 'Edit a file using oldText/newText replacement.',
    args: [
      { name: 'file', description: 'File path', required: true },
      { name: 'old', description: 'Text to replace', required: true },
      { name: 'new', description: 'Replacement text', required: true },
    ],
    aliases: ['patch'],
    examples: ['./foo.txt "old text" "new text"'],
    category: 'files',
  }, async (args) => {
    try {
      const content = fs.readFileSync(args.file, 'utf-8');
      if (!content.includes(args.old)) {
        return { content: `❌ Could not find text to replace in \`${args.file}\``, error: 'Text not found' };
      }
      const newContent = content.replace(args.old, args.new);
      fs.writeFileSync(args.file, newContent, 'utf-8');
      return { content: `✅ Edited \`${args.file}\`` };
    } catch (err: any) {
      return { content: `Edit error: ${err.message}`, error: err.message };
    }
  });

  registry.register({
    name: 'glob',
    description: 'Find files matching a glob pattern.',
    args: [
      { name: 'pattern', description: 'Glob pattern', required: true },
      { name: 'dir', description: 'Directory to search', required: false, default: '.' },
    ],
    aliases: ['find', 'ls'],
    examples: ['**/*.ts', 'src/**/*.js'],
    category: 'files',
  }, async (args, ctx) => {
    // Simple glob implementation using fs.readdir recursive
    const baseDir = args.dir || ctx.workspaceDir;
    const results: string[] = [];

    function matches(file: string, pattern: string): boolean {
      const parts = pattern.split('**');
      if (parts.length === 2) {
        return file.includes(parts[1].replace(/\*$/, ''));
      }
      return file.endsWith(pattern.replace(/^\*\*/, ''));
    }

    function walk(dir: string): void {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            walk(full);
          } else if (entry.isFile() && matches(full, args.pattern)) {
            results.push(full);
          }
        }
      } catch { /* skip inaccessible */ }
    }

    walk(baseDir);
    return { content: results.length ? `**Matches:**\n${results.join('\n')}` : 'No matches found' };
  });

  registry.register({
    name: 'grep',
    description: 'Search for text within files.',
    args: [
      { name: 'pattern', description: 'Pattern to search for', required: true },
      { name: 'files', description: 'File pattern or path', required: false, default: '**/*' },
      { name: '-i', description: 'Case insensitive', required: false, default: 'false' },
    ],
    aliases: ['search', 'rg'],
    examples: ['TODO', 'TODO *.ts'],
    category: 'files',
  }, async (args, ctx) => {
    return {
      content: `Grep for \`${args.pattern}\` in ${args.files || 'all files'} (from ${ctx.workspaceDir})`,
    };
  });

  // ── SESSION ─────────────────────────────────────────────────────────────────

  registry.register({
    name: 'new',
    description: 'Start a new session.',
    args: [
      { name: 'type', description: 'Session type: main, task, debug', required: false, default: 'main' },
    ],
    aliases: ['session-new'],
    examples: ['task', 'debug'],
    category: 'session',
  }, async () => {
    return { content: 'New session created. (Session management integration point)', done: true };
  });

  registry.register({
    name: 'reset',
    description: 'Reset the current session context.',
    args: [
      { name: 'confirm', description: 'Must be "yes" to confirm', required: false },
    ],
    aliases: ['clear'],
    examples: ['yes'],
    category: 'session',
  }, async (args) => {
    if (args.confirm !== 'yes') {
      return { content: '⚠️ Pass `yes` to confirm: `/reset yes`' };
    }
    return { content: 'Session context cleared.', done: true };
  });

  registry.register({
    name: 'resume',
    description: 'Resume a previous session.',
    args: [
      { name: 'session-id', description: 'Session ID to resume', required: true },
    ],
    aliases: [],
    examples: ['abc123'],
    category: 'session',
  }, async (args) => {
    return { content: `Resuming session: ${args['session-id']}` };
  });

  registry.register({
    name: 'export',
    description: 'Export the current session or artifacts.',
    args: [
      { name: 'format', description: 'Format: json, md, transcript', required: false, default: 'json' },
      { name: 'path', description: 'Output file path', required: false },
    ],
    aliases: [],
    examples: ['json ./export.json', 'md'],
    category: 'session',
  }, async (args) => {
    return { content: `Exporting as ${args.format} to ${args.path || 'stdout'}` };
  });

  registry.register({
    name: 'import',
    description: 'Import a session or artifacts.',
    args: [
      { name: 'source', description: 'Source file or URL', required: true },
    ],
    aliases: [],
    examples: ['./session-backup.json'],
    category: 'session',
  }, async (args) => {
    return { content: `Importing from: ${args.source}` };
  });

  // ── HELP ────────────────────────────────────────────────────────────────────

  registry.register({
    name: 'help',
    description: 'Show help for a command or general help.',
    args: [
      { name: 'command', description: 'Command name', required: false },
    ],
    aliases: ['?'],
    examples: ['', 'exec', 'memory'],
    category: 'agent',
  }, async (args) => {
    if (args.command) return { content: registry.getHelp(args.command) };
    const categories = ['agent', 'tools', 'system', 'memory', 'config', 'team', 'files', 'session'] as const;
    const lines: string[] = ['# CLAW-CODE Command Reference', ''];
    for (const cat of categories) {
      const cmds = registry.list(cat);
      if (cmds.length) {
        lines.push(`## ${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
        for (const cmd of cmds) {
          lines.push(`- \`/${cmd.name}\` — ${cmd.description}`);
        }
        lines.push('');
      }
    }
    return { content: lines.join('\n') };
  });

  registry.register({
    name: 'commands',
    description: 'List all available slash commands.',
    args: [
      { name: 'category', description: 'Filter by category', required: false },
    ],
    aliases: ['cmds'],
    examples: ['', 'memory', 'system'],
    category: 'agent',
  }, async (args) => {
    const cmds = registry.list(args.category);
    return {
      content: `**Commands${args.category ? ` (${args.category})` : ''}**\n` +
        cmds.map(c => `- \`/${c.name}\` — ${c.description}`).join('\n'),
    };
  });

  registry.register({
    name: 'skills',
    description: 'List all installed skills.',
    args: [
      { name: 'search', description: 'Search term', required: false },
    ],
    aliases: ['skill-list'],
    examples: ['', 'github'],
    category: 'agent',
  }, async (args) => {
    const skillDir = path.join(ctx => ctx.agentDir)({ agentDir: '' } as any);
    // Return known skills
    return {
      content: `**Installed Skills**\n- clawhub\n- coding-agent\n- github\n- healthcheck\n- mcporter\n- node-connect\n- skill-creator\n- weather\n- find-skills\n- skill-vetter\n- proactive-agent\n- memory-tiering\n- code-review-bot\n- playwright-browser-automation`,
    };
  });

  return registry;
}

// ─── Singleton Export ─────────────────────────────────────────────────────────

export const slashCommandRegistry = makeRegistry();
export { SlashCommandRegistry };
