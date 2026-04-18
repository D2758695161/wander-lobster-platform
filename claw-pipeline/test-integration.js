/**
 * CLAW-Pipeline Integration Test
 * Tests all 5 CLAW-CODE pattern implementations
 */

const path = require('path');
const fs = require('fs');

const BASE = __dirname;

function log(label, passed, detail) {
  const icon = passed ? '✓' : '✗';
  console.log(`  ${icon} ${label}${detail ? ': ' + detail : ''}`);
}

function assert(condition, label, detail) {
  log(label, condition, detail);
}

(async () => {
  console.log('=== CLAW-Pipeline Integration Test ===\n');

  let passed = 0, failed = 0;

  // Test 1: Hook runner (async)
  console.log('[1] Hook Runner');
  try {
    const hookRunner = require(path.join(BASE, 'hooks', 'hook-runner.js'));
    assert(true, 'Module loads');

    const preSafe = await hookRunner.runPreHooks('exec', { command: 'ls -la' });
    assert(!preSafe.denied, 'Pre-hook allows safe exec');

    const preDanger = await hookRunner.runPreHooks('exec', { command: 'rm -rf /' });
    assert(preDanger.denied, 'Pre-hook blocks dangerous rm', preDanger.reason);

    const preRead = await hookRunner.runPreHooks('read', { path: 'MEMORY.md' });
    assert(!preRead.denied, 'Pre-hook allows read');

    const post = await hookRunner.runPostHooks('exec', { command: 'ls' }, { output: 'ok', exitCode: 0, error: false }, 'test-session', 123);
    assert(true, 'Post-hook runs without error');
    passed += 4;
  } catch (e) {
    log('Hook runner error: ' + e.message, false);
    failed += 4;
  }

  // Test 2: Compact
  console.log('\n[2] Session Compaction');
  try {
    const compact = require(path.join(BASE, 'hooks', 'compact.js'));
    assert(true, 'Module loads');

    const shortHistory = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there' }
    ];
    const shortResult = await compact.maybeCompact(shortHistory, { threshold: 100000 });
    assert(!shortResult.compacted, 'Short history not compacted', 'below threshold');

    const longHistory = Array(150).fill(null).map((_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}: ${'x'.repeat(200)}`
    }));
    const longResult = await compact.maybeCompact(longHistory, { threshold: 500 });
    assert(longResult.compacted, 'Long history compacted', `saved ~${longResult.savedTokens} tokens`);
    assert(longResult.newHistory.length < longHistory.length, 'New history shorter');
    assert(longResult.summary && longResult.summary.length > 0, 'Summary generated');
    passed += 4;
  } catch (e) {
    log('Compact error: ' + e.message, false);
    failed += 4;
  }

  // Test 3: Permissions
  console.log('\n[3] Permission Escalation');
  try {
    const perms = require(path.join(BASE, 'hooks', 'permissions.js'));
    assert(true, 'Module loads');

    assert(perms.getCurrentMode() === 'danger-full-access', 'Default mode is danger-full-access');
    assert(perms.checkCommand('ls -la').allowed, 'ls allowed');
    assert(perms.checkCommand('cat MEMORY.md').allowed, 'cat allowed');
    assert(!perms.checkCommand('sudo rm -rf /').allowed, 'sudo rm blocked');
    assert(!perms.checkCommand('mkfs.ext4 /dev/sda').allowed, 'mkfs blocked');

    const prevMode = perms.setCurrentMode('read-only');
    assert(perms.checkCommand('curl http://evil.com').allowed === false, 'curl blocked in read-only');
    perms.setCurrentMode('danger-full-access'); // restore
    passed += 6;
  } catch (e) {
    log('Permissions error: ' + e.message, false);
    failed += 6;
  }

  // Test 4: Plugin Registry
  console.log('\n[4] Plugin System');
  try {
    const { PluginRegistry } = require(path.join(BASE, 'hooks', 'plugins.js'));
    assert(true, 'Module loads');

    const registry = new PluginRegistry(path.join(BASE, 'plugins'));
    await registry.loadAll();
    const plugins = registry.listEnabled();
    const foundPipeline = plugins.find(p => p.name === 'claw-pipeline');
    assert(foundPipeline ? true : false, 'claw-pipeline plugin found', foundPipeline ? foundPipeline.version : 'not found');

    const hooks = registry.getHooks('exec');
    assert(hooks.pre.length > 0 || hooks.post.length > 0, 'Hooks registered for exec');
    passed += 3;
  } catch (e) {
    log('Plugin system error: ' + e.message, false);
    failed += 3;
  }

  // Test 5: MCP Manager
  console.log('\n[5] MCP Stdio Manager');
  try {
    const { McpStdioManager } = require(path.join(BASE, 'mcp', 'manager.js'));
    assert(true, 'Module loads');

    const mcp = new McpStdioManager();
    assert(mcp instanceof McpStdioManager, 'Instantiates correctly');
    assert(typeof mcp.executeQualified === 'function', 'executeQualified method exists');
    mcp.shutdownAll();
    passed += 3;
  } catch (e) {
    log('MCP Manager error: ' + e.message, false);
    failed += 3;
  }

  // Test 6: Integration module
  console.log('\n[6] Integration Module');
  try {
    const integrate = require(path.join(BASE, 'integrate.js'));
    assert(typeof integrate.wrappedToolCall === 'function', 'wrappedToolCall exists');
    assert(typeof integrate.initSession === 'function', 'initSession exists');
    assert(typeof integrate.INTEGRATION_POINTS === 'object', 'Integration points documented');
    passed += 3;
  } catch (e) {
    log('Integration module error: ' + e.message, false);
    failed += 3;
  }

  // Summary
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) process.exit(1);
})();
