/**
 * LSP Client for OpenClaw
 * Connects to Language Server Protocol servers via stdio
 * Supports: textDocument/definition, textDocument/references, textDocument/completion
 * Uses JSON-RPC 3.0 over stdio
 */

import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { EventEmitter } from 'events';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LSPClientOptions {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  rootUri?: string;
  capabilities?: LSPClientCapabilities;
}

export interface LSPClientCapabilities {
  textDocument?: {
    synchronization?: { incremental: boolean };
    completion?: { valueChanges: boolean };
    definitions?: boolean;
    references?: boolean;
    hover?: boolean;
  };
  workspace?: {
    applyEdit?: boolean;
    workspaceFolders?: boolean;
  };
}

export interface LSPInitializeResult {
  capabilities: {
    textDocumentSync?: number;
    hoverProvider?: boolean;
    definitionProvider?: boolean;
    referencesProvider?: boolean;
    completionProvider?: { resolveProvider?: boolean; triggerCharacters?: string[] };
    documentSymbolProvider?: boolean;
    [key: string]: any;
  };
  serverInfo?: { name: string; version?: string };
}

export interface LSPLocation {
  uri: string;
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
}

export interface LSPCompletionList {
  isIncomplete: boolean;
  items: LSPCompletionItem[];
}

export interface LSPCompletionItem {
  label: string;
  kind?: number;
  detail?: string;
  documentation?: string;
  insertText?: string;
  filterText?: string;
  start?: number;
  length?: number;
  textEdit?: {
    range: LSPLocation['range'];
    newText: string;
  };
  data?: Record<string, unknown>;
}

export interface LSPHover {
  contents: string | { language: string; value: string } | Array<{ language: string; value: string }>;
  range?: LSPLocation['range'];
}

export interface LSPSymbol {
  name: string;
  kind: number;  // LSP SymbolKind
  location: LSPLocation;
  children?: LSPSymbol[];
}

export interface LSPDiagnostic {
  range: LSPLocation['range'];
  severity?: number;  // LSP DiagnosticSeverity
  code?: string | number;
  source?: string;
  message: string;
}

// ─── JSON-RPC Messages ────────────────────────────────────────────────────────

interface JSONRPCRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: object;
}

interface JSONRPCResponse {
  jsonrpc: '2.0';
  id: number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

interface JSONRPCNotification {
  jsonrpc: '2.0';
  method: string;
  params?: object;
}

// ─── LSP Client ───────────────────────────────────────────────────────────────

export class LSPClient extends EventEmitter {
  private process: ChildProcessWithoutNullStreams | null = null;
  private options: LSPClientOptions;
  private requestId = 0;
  private pendingRequests = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  private notificationHandlers = new Map<string, Array<(params: object) => void>>();
  private initialized = false;
  private readonly OUTPUT_ENCODING = 'utf-8';

  constructor(options: LSPClientOptions) {
    super();
    this.options = options;
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  async initialize(): Promise<LSPInitializeResult> {
    if (this.initialized) return this.doInitialize();

    const { command, args = [], env = {} } = this.options;

    this.process = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ...env },
      windowsHide: true,
    });

    this.process.stdout?.setEncoding(this.OUTPUT_ENCODING);
    this.process.stderr?.on('data', (data: Buffer) => {
      this.emit('stderr', data.toString());
    });

    this.process.on('error', (err) => {
      this.emit('error', err);
    });

    this.process.on('exit', (code) => {
      this.emit('exit', code);
      this.initialized = false;
    });

    let buffer = '';
    this.process.stdout?.on('data', (data: Buffer) => {
      buffer += data.toString();
      this.processBuffer(buffer, (remainder) => { buffer = remainder; });
    });

    return this.doInitialize();
  }

  private async doInitialize(): Promise<LSPInitializeResult> {
    const rootUri = this.options.rootUri ?? `file://${process.cwd().replace(/\\/g, '/')}`;

    const result = await this.sendRequest<LSPInitializeResult>('initialize', {
      processId: process.pid,
      rootUri,
      capabilities: this.options.capabilities ?? {
        textDocument: {
          synchronization: { incremental: true },
          completion: { valueChanges: true },
          definitions: true,
          references: true,
          hover: true,
        },
        workspace: { applyEdit: true, workspaceFolders: true },
      },
      workspaceFolders: [{ uri: rootUri, name: 'workspace' }],
    });

    // Send initialized notification
    this.sendNotification('initialized', {});

    // Send workspace/didOpenNotification if needed
    this.initialized = true;
    return result;
  }

  async shutdown(): Promise<void> {
    if (!this.initialized) return;
    try {
      await this.sendRequest('shutdown', {});
      this.sendNotification('exit', {});
      this.process?.kill();
    } catch {
      this.process?.kill();
    }
    this.initialized = false;
  }

  // ─── Document Operations ────────────────────────────────────────────────────

  /**
   * Go to definition — find the definition of a symbol at the given position.
   */
  async gotoDefinition(uri: string, line: number, character: number): Promise<LSPLocation | null> {
    const result = await this.sendRequest<LSPLocation[] | LSPLocation | null>(
      'textDocument/definition',
      { textDocument: { uri }, position: { line, character } }
    );

    if (!result) return null;
    if (Array.isArray(result)) return result[0] ?? null;
    return result;
  }

  /**
   * Find all references to a symbol at the given position.
   */
  async findReferences(
    uri: string,
    line: number,
    character: number,
    includeDeclaration = true
  ): Promise<LSPLocation[]> {
    const result = await this.sendRequest<LSPLocation[]>(
      'textDocument/references',
      {
        textDocument: { uri },
        position: { line, character },
        context: { includeDeclaration },
      }
    );
    return result ?? [];
  }

  /**
   * Get completions at the given position.
   */
  async getCompletions(
    uri: string,
    line: number,
    character: number,
    triggerCharacter?: string
  ): Promise<LSPCompletionList> {
    const params: any = {
      textDocument: { uri },
      position: { line, character },
    };

    if (triggerCharacter) {
      params.context = { triggerKind: 2, triggerCharacter }; // Invoked = 2
    }

    const result = await this.sendRequest<LSPCompletionList | LSPCompletionItem[]>(
      'textDocument/completion',
      params
    );

    if (Array.isArray(result)) {
      return { isIncomplete: false, items: result };
    }
    return result ?? { isIncomplete: false, items: [] };
  }

  /**
   * Get hover information at the given position.
   */
  async hover(uri: string, line: number, character: number): Promise<LSPHover | null> {
    const result = await this.sendRequest<LSPHover | null>(
      'textDocument/hover',
      { textDocument: { uri }, position: { line, character } }
    );
    return result ?? null;
  }

  /**
   * Get all symbols (document outline) for a file.
   */
  async documentSymbols(uri: string): Promise<LSPSymbol[]> {
    const result = await this.sendRequest<LSPSymbol[] | Array<{ name: string; kind: number; location: LSPLocation }>>(
      'textDocument/documentSymbol',
      { textDocument: { uri } }
    );

    if (!result) return [];

    // Normalize flat list to hierarchical
    return Array.isArray(result) ? result as LSPSymbol[] : [];
  }

  // ─── Diagnostics ───────────────────────────────────────────────────────────

  /**
   * Get current diagnostics for a document.
   * Note: most servers push diagnostics via textDocument/publishDiagnostics.
   */
  async getDiagnostics(uri: string): Promise<LSPDiagnostic[]> {
    // Diagnostics are typically pushed via notifications, but we can request them
    // by sending a dummy request. For servers that support it:
    try {
      const result = await this.sendRequest<LSPDiagnostic[]>('textDocument/diagnostic', {
        textDocument: { uri },
      });
      return result ?? [];
    } catch {
      // Server doesn't support diagnostic pull — return empty, rely on push notifications
      return [];
    }
  }

  // ─── Lifecycle Helpers ──────────────────────────────────────────────────────

  /**
   * Send a JSON-RPC notification (no response expected).
   */
  sendNotification(method: string, params: object): void {
    const msg: JSONRPCNotification = { jsonrpc: '2.0', method, params };
    this.sendRaw(JSON.stringify(msg));
  }

  /**
   * Send a JSON-RPC request and wait for a response.
   */
  sendRequest<T>(method: string, params: object): Promise<T> {
    const id = ++this.requestId;
    const msg: JSONRPCRequest = { jsonrpc: '2.0', id, method, params };
    this.sendRaw(JSON.stringify(msg));

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`LSP request timeout: ${method} (id=${id})`));
      }, 30000);

      this.pendingRequests.set(id, {
        resolve: (v) => { clearTimeout(timeout); resolve(v as T); },
        reject: (e) => { clearTimeout(timeout); reject(e); },
      });
    });
  }

  /**
   * Register a handler for server-sent notifications.
   */
  onNotification(method: string, handler: (params: object) => void): void {
    const handlers = this.notificationHandlers.get(method) ?? [];
    handlers.push(handler);
    this.notificationHandlers.set(method, handlers);
  }

  // ─── Internal ───────────────────────────────────────────────────────────────

  private sendRaw(message: string): void {
    if (!this.process?.stdin) return;
    this.process.stdin.write(message + '\n');
  }

  private processBuffer(
    buffer: string,
    onComplete: (remainder: string) => void
  ): void {
    const lines = buffer.split('\n');
    // JSON-RPC messages are newline-delimited, but might span multiple lines
    // for content-length > 0 bodies. Simpler approach: try parsing each line.
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      try {
        const msg = JSON.parse(line);
        this.handleMessage(msg);
      } catch {
        // Not a JSON line — might be part of a larger message or stderr
      }
    }
    // Last line might be incomplete — pass it back
    onComplete(lines[lines.length - 1]);
  }

  private handleMessage(msg: JSONRPCResponse | JSONRPCRequest | JSONRPCNotification): void {
    if ('id' in msg && msg.method) {
      // Request from server — handle server-initiated requests
      this.emit('server-request', msg);
    } else if ('id' in msg && msg.result !== undefined) {
      // Response
      const pending = this.pendingRequests.get(msg.id as number);
      if (pending) {
        this.pendingRequests.delete(msg.id as number);
        if (msg.error) {
          pending.reject(new Error(`LSP error: ${msg.error.message}`));
        } else {
          pending.resolve(msg.result);
        }
      }
    } else if ('method' in msg && !('id' in msg)) {
      // Notification from server
      const handlers = this.notificationHandlers.get(msg.method);
      if (handlers) {
        for (const h of handlers) {
          try { h(msg.params ?? {}); } catch { /* ignore handler errors */ }
        }
      }
      this.emit(`notification:${msg.method}`, msg.params);
      this.emit('notification', msg.method, msg.params);
    }
  }

  // ─── Text Document Sync ─────────────────────────────────────────────────────

  /**
   * Open a text document (send textDocument/didOpen).
   */
  openDocument(uri: string, content: string, languageId: string = 'plaintext'): void {
    this.sendNotification('textDocument/didOpen', {
      textDocument: { uri, languageId, version: 1, text: content },
    });
  }

  /**
   * Change a text document (send textDocument/didChange).
   */
  changeDocument(uri: string, content: string, version: number): void {
    this.sendNotification('textDocument/didChange', {
      textDocument: { uri, version },
      contentChanges: [{ text: content }],
    });
  }

  /**
   * Close a text document (send textDocument/didClose).
   */
  closeDocument(uri: string): void {
    this.sendNotification('textDocument/didClose', {
      textDocument: { uri },
    });
  }
}
