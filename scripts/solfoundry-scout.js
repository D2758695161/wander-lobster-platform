#!/usr/bin/env node
/**
 * SolFoundry Bounty Scout
 * Scans SolFoundry repositories for open bounties with T-level difficulty ratings
 * 
 * Usage:
 *   node scripts/solfoundry-scout.js
 *   node scripts/solfoundry-scout.js --min 100 --max 500
 *   node scripts/solfoundry-scout.js --tier T1
 *   node scripts/solfoundry-scout.js --json
 *
 * Environment:
 *   GH_TOKEN - GitHub Personal Access Token
 *   DISCORD_WEBHOOK - Optional Discord webhook for notifications
 *   TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID - Optional Telegram notifications
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || '';
const TELEGRAM_BOT = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID || '';

// SolFoundry repos known to have bounties
const SOLFOUNDRY_REPOS = [
  'SolFoundry/solfoundry',
  'SolFoundry/agent-bounties', 
  'SolFoundry/founder-bounties',
];

const DEFAULT_MIN = 50;
const DEFAULT_MAX = 5000;

// ─── CLI Args ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const showJson = args.includes('--json');
const tierFilter = args.find(a => a.startsWith('--tier='))?.split('=')[1]?.toUpperCase();
const minReward = parseInt(args.find(a => a.startsWith('--min='))?.split('=')[1] || String(DEFAULT_MIN));
const maxReward = parseInt(args.find(a => a.startsWith('--max='))?.split('=')[1] || String(DEFAULT_MAX));

// ─── Helpers ──────────────────────────────────────────────────────────────
function log(...args) {
  const prefix = new Date().toISOString().split('T')[1].slice(0, 8) + ' [solfoundry-scout]';
  console.log(prefix, ...args.map(a => typeof a === 'object' ? JSON.stringify(a) : a));
}

function api(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    if (!TOKEN) {
      // Unauthenticated - limited to 60 req/hr
      log('⚠️  No GH_TOKEN set, using unauthenticated requests (60 req/hr limit)');
    }
    const opts = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'solfoundry-scout/1.0',
        ...(TOKEN ? { 'Authorization': `token ${TOKEN}` } : {}),
      },
    };
    const req = https.request(opts, res => {
      if (res.headers['x-ratelimit-remaining'] === '0') {
        log('❌ Rate limited! Set GH_TOKEN for 5000 req/hr');
      }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch { resolve(d); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Parse reward amount from text
function parseReward(text) {
  if (!text) return null;
  const patterns = [
    /(\d+[\d,]*)\s*FNDRY/i,
    /\$?\s*(\d+[\d,]*)/,
    /(\d+)\s*USD/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return parseInt(m[1].replace(/,/g, ''));
  }
  return null;
}

// Determine T-level from labels/title
function getTier(issue) {
  const text = JSON.stringify(issue).toUpperCase();
  if (text.includes('T3') || text.includes('TIER 3')) return 'T3';
  if (text.includes('T2') || text.includes('TIER 2')) return 'T2';
  if (text.includes('T1') || text.includes('TIER 1')) return 'T1';
  return null;
}

// Format reward for display
function formatReward(reward) {
  if (!reward) return 'Unspecified';
  if (reward >= 1000) return `$${(reward/1000).toFixed(0)}K`;
  return `$${reward}`;
}

// ─── Discord Notification ──────────────────────────────────────────────────
async function notifyDiscord(bounties) {
  if (!DISCORD_WEBHOOK || bounties.length === 0) return;
  
  const body = {
    content: `🦞 **SolFoundry 新 Bounty 扫描** — 找到 ${bounties.length} 个悬赏任务`,
    embeds: bounties.slice(0, 5).map(b => ({
      title: b.title.slice(0, 200),
      url: b.url,
      color: b.tier === 'T3' ? 0xFF6B35 : b.tier === 'T2' ? 0xFFD93D : 0x4ECDC4,
      fields: [
        { name: '💰 Reward', value: b.reward, inline: true },
        { name: '📊 Tier', value: b.tier || 'Any', inline: true },
        { name: '🏷️ Repo', value: b.repo, inline: true },
      ],
      footer: { text: 'SolFoundry Bounty Scout' },
    })),
  };

  const data = JSON.stringify(body);
  return new Promise((resolve) => {
    const u = new URL(DISCORD_WEBHOOK);
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, res => { res.on('data', () => {}); res.on('end', resolve); });
    req.on('error', resolve);
    req.write(data);
    req.end();
  });
}

// ─── Telegram Notification ─────────────────────────────────────────────────
async function notifyTelegram(bounties) {
  if (!TELEGRAM_BOT || !TELEGRAM_CHAT || bounties.length === 0) return;
  
  const text = `🦞 *SolFoundry 新 Bounty*\\n找到 ${bounties.length} 个悬赏\\n\\n` +
    bounties.slice(0, 3).map(b => 
      `*${b.title.slice(0, 80)}*\\n💰 ${b.reward} | ${b.tier || 'T-any'}\\n🔗 ${b.url}`
    ).join('\\n\\n');

  const data = JSON.stringify({ chat_id: TELEGRAM_CHAT, text, parse_mode: 'Markdown' });
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_BOT}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, res => { res.on('data', () => {}); res.on('end', resolve); });
    req.on('error', resolve);
    req.write(data);
    req.end();
  });
}

// ─── Main Scan ─────────────────────────────────────────────────────────────
async function scanRepo(repo) {
  log(`🔍 Scanning ${repo}...`);
  
  const issues = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 5) {
    try {
      const data = await api(`/repos/${repo}/issues?state=open&per_page=100&page=${page}&sort=created&direction=desc`);
      
      if (Array.isArray(data) && data.length > 0) {
        for (const issue of data) {
          // Skip PRs
          if (issue.pull_request) continue;
          
          const tier = getTier(issue);
          if (tierFilter && tier !== tierFilter) continue;

          // Parse reward
          const rewardText = issue.title + ' ' + (issue.body || '');
          const reward = parseReward(rewardText);
          
          if (reward !== null && (reward < minReward || reward > maxReward)) continue;

          // Get labels
          const labels = issue.labels.map(l => l.name);
          
          issues.push({
            id: issue.id,
            number: issue.number,
            title: issue.title,
            url: issue.html_url,
            repo,
            body: (issue.body || '').slice(0, 300),
            labels,
            tier: tier || labels.find(l => l.match(/^T[1-3]$/i)) || null,
            reward: reward ? formatReward(reward) : null,
            rawReward: reward,
            comments: issue.comments,
            created: issue.created_at,
            updated: issue.updated_at,
          });
        }
        
        hasMore = data.length === 100;
        page++;
        await sleep(TOKEN ? 100 : 1100); // Respect rate limits
      } else {
        hasMore = false;
      }
    } catch (e) {
      log(`❌ Error scanning ${repo} page ${page}:`, e.message);
      hasMore = false;
    }
  }

  return issues;
}

async function main() {
  log('🚀 SolFoundry Bounty Scout starting...');
  log(`   Tiers: ${tierFilter || 'ALL'}  |  Range: $${minReward}-$${maxReward}`);

  const allBounties = [];

  for (const repo of SOLFOUNDRY_REPOS) {
    try {
      const bounties = await scanRepo(repo);
      allBounties.push(...bounties);
      log(`   ✅ ${repo}: ${bounties.length} bounties found`);
    } catch (e) {
      log(`❌ Failed to scan ${repo}:`, e.message);
    }
  }

  // Sort by reward (highest first)
  allBounties.sort((a, b) => (b.rawReward || 0) - (a.rawReward || 0));

  log(`\\n✅ Total: ${allBounties.length} bounties found`);

  // ─── Display ───────────────────────────────────────────────────────────
  if (showJson) {
    console.log(JSON.stringify(allBounties, null, 2));
  } else {
    console.log('\n══════════════════════════════════════════════');
    console.log('  🦞 SolFoundry Bounty Scout Results');
    console.log('══════════════════════════════════════════════\n');

    const tierGroups = { T3: [], T2: [], T1: [], OTHER: [] };
    for (const b of allBounties) {
      (tierGroups[b.tier || 'OTHER'] || tierGroups.OTHER).push(b);
    }

    for (const [tier, bounties] of Object.entries(tierGroups)) {
      if (bounties.length === 0) continue;
      const tierColor = tier === 'T3' ? '🔥' : tier === 'T2' ? '⚡' : tier === 'T1' ? '🎯' : '📋';
      const tierLabel = tier === 'T3' ? '🔥 T3 (最高)' : tier === 'T2' ? '⚡ T2 (高)' : tier === 'T1' ? '🎯 T1 (中)' : '📋 Other';
      console.log(`\\n${tierLabel} — ${bounties.length} 个悬赏\\n`);
      
      for (const b of bounties) {
        const age = Math.floor((Date.now() - new Date(b.created).getTime()) / 86400000);
        const ageStr = age === 0 ? '今天' : age === 1 ? '昨天' : `${age}天前`;
        console.log(`  ${b.reward || '???'}  ${b.title.slice(0, 70)}`);
        console.log(`          → ${b.url}`);
        console.log(`          🏷️ ${b.labels.slice(0, 4).join(', ') || 'none'} | ${ageStr}\\n`);
      }
    }

    console.log('══════════════════════════════════════════════');
    console.log(`  总计: ${allBounties.length} 个悬赏`);
    if (!TOKEN) console.log('  ⚠️  Set GH_TOKEN for higher rate limits');
    console.log('══════════════════════════════════════════════\\n');
  }

  // Save results
  const outPath = path.join(__dirname, '..', 'reports', `solfoundry-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(allBounties, null, 2));
  log(`📁 Results saved to ${outPath}`);

  // ─── Notifications ─────────────────────────────────────────────────────
  await Promise.all([
    notifyDiscord(allBounties),
    notifyTelegram(allBounties),
  ]);

  // Exit with count for scripting
  process.exit(allBounties.length > 0 ? 0 : 1);
}

main().catch(e => { log('Fatal error:', e); process.exit(1); });
