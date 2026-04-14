#!/usr/bin/env node
/**
 * 🦞 RustChain Bounty Scout
 * 
 * Scans Scottcjn/rustchain-bounties for open RTC-denominated bounties.
 * Supports tier filtering, skill matching, and ROI scoring.
 * 
 * Usage:
 *   node rustchain-bounty-scout.js              # show all
 *   node rustchain-bounty-scout.js --tier T3     # T1/T2/T3 difficulty filter
 *   node rustchain-bounty-scout.js --min 10      # min RTC reward
 *   node rustchain-bounty-scout.js --skill rust  # filter by skill
 *   node rustchain-bounty-scout.js --easy        # good first issue only
 *   node rustchain-bounty-scout.js --critical    # critical bounties only
 * 
 * Output: sorted by reward (highest first)
 */

const https = require('https');

const REPO = 'Scottcjn/rustchain-bounties';
const GH_API = 'api.github.com';

const args = process.argv.slice(2);
const flags = {
  tier: null,      // T1/T2/T3
  min: null,       // min RTC
  max: null,       // max RTC  
  skill: null,     // skill keyword filter
  easy: args.includes('--easy'),
  critical: args.includes('--critical'),
  json: args.includes('--json'),
  quiet: args.includes('--quiet'),
};

function parseArgs() {
  args.forEach((arg, i) => {
    if (arg === '--tier' && args[i + 1]) flags.tier = args[i + 1].toUpperCase();
    if (arg === '--min' && args[i + 1]) flags.min = parseInt(args[i + 1]);
    if (arg === '--max' && args[i + 1]) flags.max = parseInt(args[i + 1]);
    if (arg === '--skill' && args[i + 1]) flags.skill = args[i + 1].toLowerCase();
  });
}
parseArgs();

function ghFetch(path) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: GH_API,
      path: path,
      headers: {
        'User-Agent': 'rustchain-bounty-scout',
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GH_TOKEN ? { 'Authorization': `Bearer ${process.env.GH_TOKEN}` } : {})
      }
    };
    https.get(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch (e) { reject(new Error(`Parse error: ${d.substring(0, 200)}`)); }
      });
    }).on('error', reject);
  });
}

function extractReward(title) {
  const match = title.match(/BOUNTY:\s*(\d+)\s*RTC/i);
  return match ? parseInt(match[1]) : 0;
}

function getTier(labels) {
  const labelNames = labels.map(l => l.name.toLowerCase());
  if (labelNames.includes('critical') || labelNames.includes('red-team')) return 'T3';
  if (labelNames.includes('major')) return 'T2';
  if (labelNames.includes('standard')) return 'T2';
  if (labelNames.includes('easy') || labelNames.includes('good first issue')) return 'T1';
  return 'T2';
}

function scoreBounty(bounty) {
  let score = 0;
  const reward = extractReward(bounty.title);
  const tier = getTier(bounty.labels);
  
  // Reward points (0-40)
  score += Math.min(reward * 0.4, 40);
  
  // Tier difficulty bonus
  if (tier === 'T3') score += 20;
  else if (tier === 'T2') score += 10;
  else score += 5;
  
  // Labels bonus
  const labelNames = bounty.labels.map(l => l.name.toLowerCase());
  if (labelNames.includes('help wanted')) score += 10;
  if (labelNames.includes('good first issue')) score += 5;
  if (labelNames.includes('multi-claim')) score += 5;
  
  // Freshness bonus (issues with no comments tend to be less contested)
  if (bounty.comments === 0) score += 5;
  else if (bounty.comments < 3) score += 2;
  
  return { score: Math.round(score), tier, reward };
}

async function main() {
  const issues = [];
  let page = 1;
  
  if (!flags.quiet) {
    console.log(`🔍 Scanning ${REPO} for RustChain bounties...\n`);
  }
  
  while (page <= 3) {
    try {
      const data = await ghFetch(`/repos/${REPO}/issues?state=open&per_page=100&page=${page}`);
      if (!data.length) break;
      issues.push(...data.filter(i => !i.pull_request));
      if (data.length < 100) break;
      page++;
    } catch (e) {
      console.error('API error:', e.message);
      break;
    }
  }
  
  if (!issues.length) {
    console.log('❌ No open issues found');
    return;
  }
  
  const scored = issues.map(issue => {
    const { score, tier, reward } = scoreBounty(issue);
    return { ...issue, _score: score, _tier: tier, _reward: reward };
  });
  
  // Apply filters
  const filtered = scored.filter(b => {
    if (flags.tier && b._tier !== flags.tier) return false;
    if (flags.min && b._reward < flags.min) return false;
    if (flags.max && b._reward > flags.max) return false;
    if (flags.easy) {
      const labels = b.labels.map(l => l.name.toLowerCase());
      if (!labels.includes('easy') && !labels.includes('good first issue') && !labels.includes('onboarding')) return false;
    }
    if (flags.critical) {
      const labels = b.labels.map(l => l.name.toLowerCase());
      if (!labels.includes('critical') && !labels.includes('red-team')) return false;
    }
    if (flags.skill) {
      const text = `${b.title} ${b.body || ''}`.toLowerCase();
      if (!text.includes(flags.skill)) return false;
    }
    return true;
  });
  
  // Sort by score descending
  filtered.sort((a, b) => b._score - a._score);
  
  if (flags.json) {
    console.log(JSON.stringify(filtered.map(b => ({
      number: b.number,
      title: b.title,
      url: b.html_url,
      reward: b._reward,
      tier: b._tier,
      score: b._score,
      labels: b.labels.map(l => l.name),
      comments: b.comments,
      created: b.created_at,
    })), null, 2));
    return;
  }
  
  if (!flags.quiet) {
    console.log(`📋 Found ${filtered.length} matching bounty${filtered.length !== 1 ? 'ies' : 'y'}\n`);
    console.log('  #      Reward   Tier  Score  Title');
    console.log('  ' + '─'.repeat(72));
  }
  
  filtered.forEach((b, i) => {
    const tierEmoji = b._tier === 'T3' ? '🔴' : b._tier === 'T2' ? '🟡' : '🟢';
    const labelList = b.labels.map(l => l.name).filter(l => 
      ['bounty', 'critical', 'major', 'standard', 'easy', 'good first issue'].includes(l.toLowerCase())
    ).slice(0, 3).join(', ') || 'standard';
    
    if (flags.quiet) {
      console.log(`${b._reward} RTC\t${b._tier}\t${b.html_url}`);
    } else {
      console.log(
        `  ${String(b.number).padStart(3)}  ` +
        `${String(b._reward + ' RTC').padStart(8)}  ` +
        `${tierEmoji} ${b._tier}  ` +
        `${String(b._score).padStart(5)}  ` +
        `${b.title.substring(0, 45)}`
      );
    }
  });
  
  if (!flags.quiet) {
    console.log('\nLegend: 🟢 T1=Easy  🟡 T2=Standard  🔴 T3=Critical/Major');
    console.log(`\nView all: https://github.com/${REPO}/issues\n`);
  }
}

main().catch(console.error);
