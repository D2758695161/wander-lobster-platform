/**
 * CLAW-CODE Plugin System — OpenClaw Implementation
 * Plugin lifecycle + Registry + Hook aggregation + Conflict detection
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class Plugin {
  constructor(pluginDir) {
    this.dir = pluginDir;
    this.manifest = this.loadManifest();
    this.name = this.manifest.name;
    this.version = this.manifest.version;
    this.enabled = this.manifest.defaultEnabled !== false;
  }
  
  loadManifest() {
    const manifestPath = path.join(this.dir, 'plugin.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`plugin.json not found in ${this.dir}`);
    }
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  }
  
  async initialize() {
    const initCommands = this.manifest.lifecycle?.init || [];
    for (const cmd of initCommands) {
      await this.runLifecycleCommand(cmd, 'init');
    }
  }
  
  async shutdown() {
    const shutdownCommands = this.manifest.lifecycle?.shutdown || [];
    for (const cmd of shutdownCommands) {
      await this.runLifecycleCommand(cmd, 'shutdown');
    }
  }
  
  runLifecycleCommand(cmd, phase) {
    return new Promise((resolve) => {
      const child = spawn('bash', ['-c', cmd], {
        cwd: this.dir,
        stdio: 'pipe',
        timeout: 10000
      });
      let output = '';
      child.stdout.on('data', d => output += d);
      child.stderr.on('data', d => output += d);
      child.on('close', (code) => {
        console.log(`[plugin:${this.name}] ${phase}: ${cmd} -> ${code}`);
        resolve({ cmd, exitCode: code, output });
      });
      child.on('error', (err) => {
        console.error(`[plugin:${this.name}] ${phase} error: ${err.message}`);
        resolve({ cmd, error: err.message });
      });
    });
  }
  
  getHooks(toolName) {
    return {
      pre: this.manifest.hooks?.pre?.[toolName] || [],
      post: this.manifest.hooks?.post?.[toolName] || []
    };
  }
}

class PluginRegistry {
  constructor(pluginsDir = './plugins') {
    this.pluginsDir = pluginsDir;
    this.plugins = new Map();
  }
  
  async loadAll() {
    if (!fs.existsSync(this.pluginsDir)) {
      fs.mkdirSync(this.pluginsDir, { recursive: true });
      return;
    }
    
    const entries = fs.readdirSync(this.pluginsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const plugin = new Plugin(path.join(this.pluginsDir, entry.name));
          if (plugin.enabled) {
            await plugin.initialize();
          }
          this.plugins.set(plugin.name, plugin);
          console.log(`[registry] Loaded plugin: ${plugin.name} v${plugin.version}`);
        } catch (e) {
          console.error(`[registry] Failed to load plugin ${entry.name}: ${e.message}`);
        }
      }
    }
  }
  
  getHooks(toolName) {
    const allHooks = { pre: [], post: [] };
    for (const [name, plugin] of this.plugins) {
      if (!plugin.enabled) continue;
      const hooks = plugin.getHooks(toolName);
      allHooks.pre.push(...hooks.pre.map(cmd => ({ plugin: name, cmd })));
      allHooks.post.push(...hooks.post.map(cmd => ({ plugin: name, cmd })));
    }
    return allHooks;
  }
  
  detectConflicts() {
    const conflicts = [];
    const toolHooks = new Map();
    
    for (const [name, plugin] of this.plugins) {
      const manifest = plugin.manifest;
      const tools = Object.keys({ ...manifest.hooks?.pre, ...manifest.hooks?.post });
      for (const tool of tools) {
        if (!toolHooks.has(tool)) toolHooks.set(tool, []);
        toolHooks.get(tool).push(name);
      }
    }
    
    for (const [tool, plugins] of toolHooks) {
      if (plugins.length > 1) {
        conflicts.push({ tool, plugins, message: `Multiple plugins hook ${tool}: ${plugins.join(', ')}` });
      }
    }
    return conflicts;
  }
  
  listEnabled() {
    return [...this.plugins.values()].filter(p => p.enabled).map(p => ({
      name: p.name, version: p.version, description: p.manifest.description
    }));
  }
  
  async shutdownAll() {
    for (const [name, plugin] of this.plugins) {
      try {
        await plugin.shutdown();
      } catch (e) {
        console.error(`[registry] Shutdown error for ${name}: ${e.message}`);
      }
    }
    this.plugins.clear();
  }
}

module.exports = { Plugin, PluginRegistry };
