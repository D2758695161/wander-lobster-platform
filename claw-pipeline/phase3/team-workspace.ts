/**
 * CLAW-CODE Team Workspace
 * Multi-agent orchestration system inspired by CLAW-CODE's Team* agents
 * Agents can: spawn, delegate, communicate, share context, collaborate on tasks
 */

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  role: 'architect' | 'developer' | 'reviewer' | 'researcher' | 'coordinator';
  capabilities: string[];
  status: 'idle' | 'busy' | 'offline';
  sessionKey: string;
}

export interface TeamTask {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  status: 'pending' | 'in_progress' | 'review' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  artifacts: string[];       // Files created/modified
  dependencies: string[];    // Task IDs this depends on
  createdAt: number;
  updatedAt: number;
}

export interface TeamMessage {
  id: string;
  from: string;
  to?: string;               // undefined = broadcast
  content: string;
  type: 'task' | 'update' | 'request' | 'response' | 'alert';
  timestamp: number;
  attachments?: string[];
}

export interface TeamWorkflowResult {
  workflow: string;
  completedSteps: string[];
  failedSteps: string[];
  outputs: Record<string, unknown>;
  duration: number;
}

export interface TeamWorkflow {
  name: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  action: 'spawn' | 'delegate' | 'merge' | 'review' | 'approve';
  target?: string;           // Agent/member ID
  task?: string;             // Task ID or description
  waitFor?: string[];        // Step IDs to complete first
  condition?: string;       // Optional condition expression
}

// ─── Team Workspace ───────────────────────────────────────────────────────────

export class TeamWorkspace {
  private members = new Map<string, TeamMember>();
  private tasks = new Map<string, TeamTask>();
  private messages: TeamMessage[] = [];
  private taskCounter = 0;
  private messageCounter = 0;

  // ─── Member Management ───────────────────────────────────────────────────

  addMember(member: TeamMember): void {
    this.members.set(member.id, { ...member });
  }

  removeMember(id: string): void {
    this.members.delete(id);
  }

  getMember(id: string): TeamMember | undefined {
    return this.members.get(id);
  }

  listMembers(): TeamMember[] {
    return Array.from(this.members.values());
  }

  listMembersByRole(role: TeamMember['role']): TeamMember[] {
    return this.listMembers().filter(m => m.role === role);
  }

  updateStatus(id: string, status: TeamMember['status']): void {
    const member = this.members.get(id);
    if (member) {
      member.status = status;
      this.members.set(id, member);
    }
  }

  // ─── Task Management ─────────────────────────────────────────────────────

  createTask(task: Omit<TeamTask, 'id' | 'createdAt' | 'updatedAt'>): TeamTask {
    const id = `task-${++this.taskCounter}-${Date.now().toString(36)}`;
    const now = Date.now();
    const fullTask: TeamTask = {
      ...task,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(id, fullTask);
    return fullTask;
  }

  getTask(id: string): TeamTask | undefined {
    return this.tasks.get(id);
  }

  assignTask(taskId: string, memberId: string): void {
    const task = this.tasks.get(taskId);
    const member = this.members.get(memberId);
    if (task && member) {
      task.assignee = memberId;
      task.status = 'in_progress';
      task.updatedAt = Date.now();
      this.tasks.set(taskId, task);
      member.status = 'busy';
      this.members.set(memberId, member);
    }
  }

  updateTaskStatus(taskId: string, status: TeamTask['status']): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = status;
      task.updatedAt = Date.now();
      this.tasks.set(taskId, task);

      // If done/blocekd, free up the assignee
      if ((status === 'done' || status === 'blocked') && task.assignee) {
        const member = this.members.get(task.assignee);
        if (member) {
          member.status = 'idle';
          this.members.set(member.id, member);
        }
      }
    }
  }

  addArtifact(taskId: string, artifact: string): void {
    const task = this.tasks.get(taskId);
    if (task && !task.artifacts.includes(artifact)) {
      task.artifacts.push(artifact);
      task.updatedAt = Date.now();
      this.tasks.set(taskId, task);
    }
  }

  getTasksByMember(memberId: string): TeamTask[] {
    return Array.from(this.tasks.values()).filter(t => t.assignee === memberId);
  }

  getTasksByStatus(status: TeamTask['status']): TeamTask[] {
    return Array.from(this.tasks.values()).filter(t => t.status === status);
  }

  listTasks(): TeamTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Build a dependency graph for visualization.
   * Returns tasks and edges (parent -> child task IDs).
   */
  getTaskGraph(): { tasks: TeamTask[]; edges: [string, string][] } {
    const tasks = this.listTasks();
    const edges: [string, string][] = [];

    for (const task of tasks) {
      for (const depId of task.dependencies) {
        // Edge: depId -> task.id (depId must complete before task)
        edges.push([depId, task.id]);
      }
    }

    return { tasks, edges };
  }

  /**
   * Get topologically sorted tasks (dependencies first).
   */
  getSortedTasks(): TeamTask[] {
    const { tasks, edges } = this.getTaskGraph();
    const visited = new Set<string>();
    const sorted: TeamTask[] = [];

    const visit = (taskId: string) => {
      if (visited.has(taskId)) return;
      visited.add(taskId);
      // Visit all dependencies first
      for (const [dep, child] of edges) {
        if (child === taskId) visit(dep);
      }
      const task = tasks.find(t => t.id === taskId);
      if (task) sorted.push(task);
    };

    for (const task of tasks) visit(task.id);
    return sorted;
  }

  // ─── Messaging ────────────────────────────────────────────────────────────

  sendMessage(msg: Omit<TeamMessage, 'id' | 'timestamp'>): TeamMessage {
    const full: TeamMessage = {
      ...msg,
      id: `msg-${++this.messageCounter}-${Date.now().toString(36)}`,
      timestamp: Date.now(),
    };
    this.messages.push(full);
    return full;
  }

  getMessages(from?: string, to?: string): TeamMessage[] {
    return this.messages.filter(m => {
      if (from && m.from !== from) return false;
      if (to && m.to !== to) return false;
      return true;
    });
  }

  getBroadcasts(): TeamMessage[] {
    return this.messages.filter(m => m.to === undefined);
  }

  // ─── Orchestration ────────────────────────────────────────────────────────

  /**
   * Delegate a task to a specific agent.
   * Returns a simulated subagent runId.
   * In production, this would integrate with the actual subagent spawning system.
   */
  async delegateTask(taskId: string, toAgent: string, instructions: string): Promise<string> {
    const task = this.tasks.get(taskId);
    const member = this.members.get(toAgent);

    if (!task) throw new Error(`Task not found: ${taskId}`);
    if (!member) throw new Error(`Team member not found: ${toAgent}`);

    const runId = `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

    // Send a delegation message
    this.sendMessage({
      from: 'system',
      to: toAgent,
      content: `Delegating task \`${task.title}\` (${taskId})\n\nInstructions: ${instructions}`,
      type: 'task',
      attachments: [taskId],
    });

    // Update status
    task.assignee = toAgent;
    task.status = 'in_progress';
    task.updatedAt = Date.now();
    this.tasks.set(taskId, task);

    member.status = 'busy';
    this.members.set(member.id, member);

    return runId;
  }

  /**
   * Broadcast context to all team members (or a subset).
   */
  async broadcastContext(ctx: string, memberIds?: string[]): Promise<void> {
    const targets = memberIds ?? this.listMembers().map(m => m.id);

    for (const id of targets) {
      this.sendMessage({
        from: 'system',
        to: id,
        content: ctx,
        type: 'update',
      });
    }
  }

  /**
   * Coordinate a multi-step workflow.
   * Steps are executed in order, respecting waitFor dependencies.
   */
  async coordinate(workflow: TeamWorkflow): Promise<TeamWorkflowResult> {
    const startTime = Date.now();
    const completedSteps: string[] = [];
    const failedSteps: string[] = [];
    const outputs: Record<string, unknown> = {};
    const stepResults = new Map<string, unknown>();

    for (const step of workflow.steps) {
      // Wait for dependencies
      if (step.waitFor?.length) {
        for (const depId of step.waitFor) {
          if (!completedSteps.includes(depId)) {
            failedSteps.push(step.id);
            continue;
          }
        }
      }

      try {
        let result: unknown;

        switch (step.action) {
          case 'spawn':
            // Simulate spawning a new agent
            result = {
              spawned: step.target ?? 'unknown',
              task: step.task ?? 'no-task',
              runId: `run-${Date.now().toString(36)}`,
            };
            break;

          case 'delegate':
            if (step.target && step.task) {
              const runId = await this.delegateTask(step.task, step.target, step.task);
              result = { delegated: step.target, task: step.task, runId };
            }
            break;

          case 'merge':
            // Collect outputs from previous steps and merge
            const mergeInputs = (step.waitFor ?? [])
              .map(id => stepResults.get(id))
              .filter(Boolean);
            result = { merged: mergeInputs };
            break;

          case 'review':
            // Simulate a review step
            result = {
              reviewed: step.target ?? 'unknown',
              status: 'approved',
              notes: 'Automated review',
            };
            break;

          case 'approve':
            result = {
              approved: true,
              by: step.target ?? 'system',
              timestamp: Date.now(),
            };
            break;

          default:
            result = { skipped: true, reason: `Unknown action: ${step.action}` };
        }

        stepResults.set(step.id, result);
        outputs[step.id] = result;
        completedSteps.push(step.id);

      } catch (err: any) {
        outputs[step.id] = { error: err.message };
        failedSteps.push(step.id);
      }
    }

    return {
      workflow: workflow.name,
      completedSteps,
      failedSteps,
      outputs,
      duration: Date.now() - startTime,
    };
  }

  // ─── Serialization ────────────────────────────────────────────────────────

  toJSON(): object {
    return {
      members: Array.from(this.members.entries()),
      tasks: Array.from(this.tasks.entries()),
      messages: this.messages,
    };
  }

  static fromJSON(data: ReturnType<TeamWorkspace['toJSON']>): TeamWorkspace {
    const tw = new TeamWorkspace();
    const d = data as any;
    if (d.members) {
      for (const [id, member] of d.members) tw.members.set(id, member);
    }
    if (d.tasks) {
      for (const [id, task] of d.tasks) tw.tasks.set(id, task);
    }
    if (d.messages) {
      tw.messages = d.messages;
    }
    return tw;
  }
}

// ─── Convenience Factories ────────────────────────────────────────────────────

export function createTeamWithRoles(members: Array<{
  name: string;
  role: TeamMember['role'];
  capabilities?: string[];
}>): TeamWorkspace {
  const team = new TeamWorkspace();

  const roleCapabilities: Record<TeamMember['role'], string[]> = {
    architect: ['design', 'architecture', 'code-review', 'planning'],
    developer: ['coding', 'testing', 'debugging', 'refactoring'],
    reviewer: ['code-review', 'testing', 'quality', 'security'],
    researcher: ['research', 'analysis', 'investigation', 'documentation'],
    coordinator: ['planning', 'delegation', 'communication', 'scheduling'],
  };

  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    team.addMember({
      id: `member-${i + 1}`,
      name: m.name,
      role: m.role,
      capabilities: m.capabilities ?? roleCapabilities[m.role],
      status: 'idle',
      sessionKey: `session-${Date.now().toString(36)}-${i}`,
    });
  }

  return team;
}

// ─── Singleton Export ─────────────────────────────────────────────────────────

export const teamWorkspace = new TeamWorkspace();
