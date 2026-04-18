/**
 * CLAW-CODE MCP stdio Manager — OpenClaw Implementation
 * Lazy process spawning, JSON-RPC handshake, qualified tool names
 */

const { spawn, ChildProcess } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const PROTOCOL_VERSION = '2024-11-05';

class McpStdioManager {
  constructor() {
    this.processes = new Map(); // serverName -> { process, lastUsed, initialized }
    this.config = null;
  }
  
  configure(config) {
    this.config = config;
    // Load from config file if path provided
    if (typeof config === 'string') {
      const configPath = path.isAbsolute(config) ? config 
        : path.join(process.cwd(), config);
      if (fs.existsSync(configPath)) {
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
    }
  }
  
  async getServer(serverName) {
    if (!this.config?.servers?.[serverName]) {
      throw new Error(`MCP server not configured: ${serverName}`);
    }
    
    if (this.processes.has(serverName)) {
      const entry = this.processes.get(serverName);
      entry.lastUsed = Date.now();
      return entry;
    }
    
    // Lazy spawn
    const serverConfig = this.config.servers[serverName];
    const proc = this.spawnServer(serverName, serverConfig);
    
    const entry = { process: proc, lastUsed: Date.now(), initialized: false };
    this.processes.set(serverName, entry);
    
    // Initialize handshake
    await this.handshake(serverName, proc);
    entry.initialized = true;
    
    // Start idle cleanup
    this.scheduleCleanup(serverName);
    
    return entry;
  }
  
  spawnServer(serverName, config) {
    const { command, args = [], env = {} } = config;
    const child = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ...env },
      detached: false
    });
    
    child.on('error', (err) => {
      console.error(`[mcp:${serverName}] Process error: ${err.message}`);
      this.processes.delete(serverName);
    });
    
    child.on('exit', (code, signal) => {
      console.log(`[mcp:${serverName}] Exited: code=${code} signal=${signal}`);
      this.processes.delete(serverName);
    });
    
    return child;
  }
  
  async handshake(serverName, process) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`MCP handshake timeout for ${serverName}`));
      }, 10000);
      
      const responseHandler = (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.jsonrpc === '2.0' && msg.id === 0) {
            clearTimeout(timeout);
            process.stdout.off('data', responseHandler);
            resolve(msg.result);
          }
        } catch (e) {}
      };
      
      process.stdout.on('data', responseHandler);
      
      // Send initialize request
      this.sendMessage(process, {
        jsonrpc: '2.0',
        id: 0,
        method: 'initialize',
        params: {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: {} },
          clientInfo: { name: 'openclaw-claw-pipeline', version: '1.0.0' }
        }
      });
      
      // Send initialized notification
      setTimeout(() => {
        this.sendMessage(process, { jsonrpc: '2.0', method: 'notifications/initialized' });
      }, 100);
    });
  }
  
  sendMessage(process, msg) {
    const json = JSON.stringify(msg);
    const length = Buffer.byteLength(json, 'utf8');
    const frame = Buffer.alloc(4 + length);
    frame.writeUInt32BE(length, 0);
    frame.write(json, 4, length, 'utf8');
    process.stdin.write(frame);
  }
  
  readResponse(process) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Response timeout'));
      }, 30000);
      
      let length = null;
      let buffer = Buffer.alloc(0);
      
      const handler = (data) => {
        buffer = Buffer.concat([buffer, data]);
        
        if (length === null && buffer.length >= 4) {
          length = buffer.readUInt32BE(0);
        }
        
        if (length !== null && buffer.length >= 4 + length) {
          clearTimeout(timeout);
          process.stdout.off('data', handler);
          try {
            resolve(JSON.parse(buffer.slice(4, 4 + length).toString('utf8')));
          } catch (e) {
            reject(e);
          }
        }
      };
      
      process.stdout.on('data', handler);
    });
  }
  
  async listTools(serverName) {
    const server = await this.getServer(serverName);
    this.sendMessage(server.process, {
      jsonrpc: '2.0',
      id: this.nextId(),
      method: 'tools/list',
      params: {}
    });
    const response = await this.readResponse(server.process);
    return response.result?.tools || [];
  }
  
  async executeTool(serverName, toolName, args) {
    const server = await this.getServer(serverName);
    this.sendMessage(server.process, {
      jsonrpc: '2.0',
      id: this.nextId(),
      method: 'tools/call',
      params: { name: toolName, arguments: args }
    });
    const response = await this.readResponse(server.process);
    return response.result;
  }
  
  /**
   * Execute with qualified name: "servername_toolname"
   */
  async executeQualified(qualifiedName, args) {
    const [server, tool] = qualifiedName.split('_', 2);
    if (!server || !tool) {
      throw new Error(`Invalid qualified name: ${qualifiedName}. Expected: servername_toolname`);
    }
    return this.executeTool(server, tool, args);
  }
  
  shutdown(serverName) {
    if (this.processes.has(serverName)) {
      const entry = this.processes.get(serverName);
      entry.process.kill();
      this.processes.delete(serverName);
      console.log(`[mcp:${serverName}] Shutdown`);
    }
  }
  
  shutdownAll() {
    for (const [name] of this.processes) {
      this.shutdown(name);
    }
  }
  
  scheduleCleanup(serverName) {
    setTimeout(() => {
      const entry = this.processes.get(serverName);
      if (entry && Date.now() - entry.lastUsed > IDLE_TIMEOUT_MS) {
        console.log(`[mcp:${serverName}] Idle timeout, shutting down`);
        this.shutdown(serverName);
      }
    }, IDLE_TIMEOUT_MS + 1000);
  }
  
  nextId() {
    return ++McpStdioManager._id;
  }
}
McpStdioManager._id = 0;

module.exports = { McpStdioManager };
