/**
 * MCP Lazy Spawn — Minimal implementation
 * Spawns MCP server processes on-demand with JSON-RPC 2.0 framing
 */

const { spawn } = require('child_process');

class LazyMcpSpawn {
  constructor() {
    this.servers = new Map();
  }
  
  /**
   * Spawn an MCP server and run JSON-RPC handshake
   */
  async spawn(serverName, command, args = [], env = {}) {
    if (this.servers.has(serverName)) {
      return this.servers.get(serverName);
    }
    
    const child = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ...env }
    });
    
    const server = { child, tools: [], initialized: false };
    this.servers.set(serverName, server);
    
    // Run initialize handshake
    await this.initialize(server);
    
    return server;
  }
  
  async initialize(server) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Handshake timeout')), 10000);
      
      server.child.stdout.on('data', (function handler(data) {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.jsonrpc === '2.0' && msg.id === 0) {
            clearTimeout(timeout);
            server.child.stdout.off('data', handler);
            server.initialized = true;
            if (msg.result?.tools) {
              server.tools = msg.result.tools;
            }
            resolve(msg.result);
          }
        } catch (e) {}
      }).bind(this));
      
      // Send initialize
      this._send(server.child, {
        jsonrpc: '2.0', id: 0, method: 'initialize',
        params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'openclaw', version: '1' } }
      });
      
      // Send initialized notification
      setTimeout(() => {
        this._send(server.child, { jsonrpc: '2.0', method: 'notifications/initialized' });
      }, 100);
    });
  }
  
  _send(child, msg) {
    const json = JSON.stringify(msg);
    const buf = Buffer.alloc(4 + Buffer.byteLength(json));
    buf.writeUInt32BE(Buffer.byteLength(json), 0);
    buf.write(json, 4);
    child.stdin.write(buf);
  }
  
  /**
   * Call a tool on a server
   */
  async callTool(serverName, toolName, args = {}) {
    const server = this.servers.get(serverName);
    if (!server) throw new Error(`Server not running: ${serverName}`);
    
    this._send(server.child, {
      jsonrpc: '2.0', id: 1, method: 'tools/call',
      params: { name: toolName, arguments: args }
    });
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Tool call timeout')), 30000);
      server.child.stdout.on('data', function handler(data) {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.id === 1) {
            clearTimeout(timeout);
            server.child.stdout.off('data', handler);
            resolve(msg.result);
          }
        } catch (e) {}
      });
    });
  }
  
  kill(serverName) {
    const server = this.servers.get(serverName);
    if (server) { server.child.kill(); this.servers.delete(serverName); }
  }
  
  killAll() { for (const name of this.servers.keys()) this.kill(name); }
}

module.exports = { LazyMcpSpawn };
