# OpenClaw 物种进化 — CLAW-CODE 架构吸收计划

> 基于 `instructkr/claw-code` 源码拆解，2026-04-02

---

## CLAW-CODE 核心架构（已拆解）

### 5大核心缺失模式

| 模式 | CLAW-CODE 实现 | OpenClaw 现状 | 优先级 |
|------|---------------|---------------|--------|
| **Hook Pipeline** | PreToolUse/PostToolUse shell 命令，exitcode=0允许/2拒绝/N警告 | 无，只有 HEARTBEAT.md | P0 |
| **Session Compaction** | compact_session() 自动摘要压缩历史 | 无，每次全新对话 | P0 |
| **Plugin System** | Plugin trait + 生命周期 + Registry + 冲突检测 | Skills 系统，无生命周期 | P0 |
| **Permission Escalation** | ReadOnly < WorkspaceWrite < DangerFullAccess < Allow | 无分级 | P1 |
| **MCP stdio Manager** | 懒加载进程 + JSON-RPC握手 + qualified names | 基础 MCP 支持 | P1 |

### 其他可吸收模式

- Instruction file discovery（向上搜索 CLAW.md）
- Builder pattern for SystemPromptBuilder
- Dependency injection via generics
- Process-based tool execution（子进程 + stdin/stdout）
- Slash command registry with metadata/arg schemas

---

## 进化阶段

### Phase 1 — 核心架构 ✅ DONE
- [x] **Hook Pipeline** — `hooks/hook-runner.js` + `hooks/pre/` + `hooks/post/` + 23项测试全通过
- [x] **Session Compaction** — `hooks/compact.js` 自动摘要，50K阈值，节省~6800 tokens
- [x] **Plugin System** — `hooks/plugins.js` PluginRegistry + lifecycle + 冲突检测
- [x] **Permission Escalation** — `hooks/permissions.js` 4级权限模型，正确拦截 sudo/mkfs
- [x] **MCP stdio Manager** — `mcp/manager.js` 懒加载 + JSON-RPC握手 + qualified names

### Phase 2 — OpenClaw Native Plugin ✅ DONE
- [x] **OpenClaw Plugin** — `claw-pipeline-plugin/` TypeScript原生插件
  - 注册6个钩子：before_tool_call, after_tool_call, before_compaction, after_compaction, agent_end, session_start
  - 危险命令拦截（rm -rf /, mkfs, wipefs等）
  - 工具调用审计日志 → /tmp/openclaw_hook_log.txt
  - 会话生命周期追踪
- [x] **集成测试** — 23/23项测试通过
- [x] **安装配置** — openclaw.plugin.json + INSTALL.md + SKILL.md

### Phase 3 — 平台化 🚧 IN PROGRESS
- [ ] Tool registry 重构（streaming + tool orchestration）
- [ ] Slash command registry（30+ 命令家族）
- [ ] Instruction file discovery（向上搜索 AGENTS.md/CLAW.md）
- [ ] LSP client 集成
- [ ] Skill bundling 系统（Skill as Plugin）
- [ ] Plugin marketplace（发布到ClawHub）
- [ ] Team workspace（多 Agent 协作）

---

## 核心实现规格

### Hook Pipeline 规格

```typescript
// hooks/pre/tool-name.sh — 工具执行前运行
// hooks/post/tool-name.sh — 工具执行后运行
// Exit codes: 0=allow, 2=deny, N=warn
// 环境变量: TOOL_NAME, TOOL_INPUT (JSON), TOOL_OUTPUT, TOOL_ERROR, TOOL_EXIT_CODE
// stdin JSON: { tool_name, input, output, error, exit_code, session_id }
```

### Session Compaction 规格

```typescript
// 当对话历史超过阈值时自动触发
// 保留最近 N 条消息
// 将早期消息摘要成 "Conversation Summary:" 块
// 阈值: 50k tokens 或 200 条消息
```

### Plugin System 规格

```typescript
interface Plugin {
  metadata: { name, version, description }
  hooks: { pre: Record<string, string[]>, post: Record<string, string[]> }
  lifecycle: { init: string[], shutdown: string[] }
  tools: ToolManifest[]
  commands: CommandManifest[]
  validate(): boolean
  initialize(): void
  shutdown(): void
}

class PluginRegistry {
  plugins: Map<string, Plugin>
  register(plugin: Plugin): void
  getHooks(toolName: string): { pre: Hook[], post: Hook[] }
  detectConflicts(): string[]
}
```

### Permission Escalation 规格

```typescript
enum PermissionMode {
  ReadOnly = 'read-only',
  WorkspaceWrite = 'workspace-write',
  DangerFullAccess = 'danger-full-access', 
  Allow = 'allow'
}

async function withEscalation<T>(
  mode: PermissionMode,
  action: () => Promise<T>
): Promise<T>
```

### MCP stdio Manager 规格

```typescript
class McpStdioManager {
  private processes: Map<string, ChildProcess>
  
  async getTools(serverName: string): Promise<Tool[]>
  async executeTool(server: string, tool: string, args: object): Promise<object>
  private handshake(serverName: string): Promise<void>  // JSON-RPC initialize
  private sendMessage(server: string, msg: object): void  // Content-Length framing
  private readResponse(server: string): Promise<object>
}
```
