/**
 * Bounty Scout - Advanced GitHub Bounty Scanner v2
 * Features: ROI scoring, language filter, automatic categorization, Telegram/Discord webhook alerts
 * Usage: node scripts/bounty-scout.js [--lang javascript,rust,python] [--min 50] [--max 2000]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const PAYMENT_ADDRESS = process.env.PAYMENT_ADDRESS || process.env.WALLET_ADDRESS || '';
const TELEGRAM_BOT = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID || '';
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || '';
const OWNER = process.env.BOUNTY_OWNER || 'D2758695161';

// CLI args
const args = process.argv.slice(2).reduce((acc, arg, i, arr) => {
  if (arg.startsWith('--')) {
    const key = arg.slice(2);
    const next = arr[i + 1];
    acc[key] = (!next || next.startsWith('--')) ? true : next;
  }
  return acc;
}, {});

const MIN_AMOUNT = parseInt(args.min) || 25;
const MAX_AMOUNT = parseInt(args.max) || 5000;
const LANGUAGES = args.lang ? args.lang.split(',') : ['javascript', 'typescript', 'python', 'rust', 'go', 'solidity'];
const OUTPUT_FILE = path.join(__dirname, '..', 'bounties-scouted.json');

// ─── GitHub API ───────────────────────────────────────────────────────────────
function api(method, path, body, retries = 2) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : undefined;
    const url = new URL(`https://api.github.com${path}`);
    const opts = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'bounty-scout-v2',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    };
    if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);

    const req = https.request(opts, res => {
      // Rate limit handling
      const remaining = parseInt(res.headers['x-ratelimit-remaining'] || '0');
      const reset = parseInt(res.headers['x-ratelimit-reset'] || '0');
      if (res.statusCode === 403 && remaining === 0) {
        const wait = Math.max(0, reset * 1000 - Date.now()) + 1000;
        console.log(`⏳ Rate limited. Waiting ${Math.round(wait/1000)}s...`);
        setTimeout(() => resolve(api(method, path, body, retries)), wait);
        return;
      }
      if (res.statusCode === 202) {
        // Async - wait and retry
        setTimeout(() => resolve(api(method, path, body, retries)), 3000);
        return;
      }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 400 && retries > 0) {
          console.warn(`API ${res.statusCode}, retrying...`);
          setTimeout(() => resolve(api(method, path, body, retries - 1)), 1000);
          return;
        }
        try { resolve(JSON.parse(d)); }
        catch { resolve({ raw: d, status: res.statusCode }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// ─── Extract bounty amount ─────────────────────────────────────────────────────
function extractAmount(title, body) {
  const text = `${title} ${body}`.replace(/,/g, '');
  const matches = [...text.matchAll(/\$?\s*(\d+(?:\.\d+)?)\s*(?:USD|usd|\$|K|k|万)?/g)];
  if (!matches.length) return null;
  
  let amount = 0;
  for (const m of matches) {
    let val = parseFloat(m[1]);
    if (text.includes('K') || text.includes('k') || text.includes('万')) val *= 1000;
    if (val >= MIN_AMOUNT && val <= MAX_AMOUNT) amount = Math.max(amount, val);
  }
  return amount || null;
}

// ─── ROI Score ─────────────────────────────────────────────────────────────────
function roiScore(issue, amount) {
  let score = amount; // Base: dollar amount
  score += (10 - Math.min(10, issue.comments || 0)) * 10; // Fewer comments = easier
  score += (10 - Math.min(10, (issue.labels || []).length)) * 5; // Fewer labels = faster
  const age = (Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(0, (14 - age) * 5); // Newer = hotter
  return Math.round(score);
}

// ─── Fetch issue details with labels ─────────────────────────────────────────
async function enrichIssue(issue) {
  try {
    const parts = issue.repository_url.split('/').slice(-2);
    const repo = parts.join('/');
    const detail = await api('GET', `/repos/${repo}/issues/${issue.number}`);
    return {
      ...issue,
      labels: (detail.labels || []).map(l => l.name),
      body: detail.body || '',
      comments: detail.comments || 0,
      assignees: (detail.assignees || []).length,
    };
  } catch {
    return { ...issue, labels: [], body: '', comments: 0, assignees: 0 };
  }
}

// ─── Fetch open PR count for competition ───────────────────────────────────────
async function getPRCount(repo) {
  try {
    const prs = await api('GET', `/repos/${repo}/pulls?state=open&per_page=100`);
    return prs.length || 0;
  } catch { return 0; }
}

// ─── Send Telegram alert ─────────────────────────────────────────────────────
async function sendTelegram(text) {
  if (!TELEGRAM_BOT || !TELEGRAM_CHAT) return;
  try {
    await api('POST', `/bot${TELEGRAM_BOT}/sendMessage`, {
      chat_id: TELEGRAM_CHAT,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
  } catch(e) { console.warn('Telegram error:', e.message); }
}

// ─── Send Discord webhook ─────────────────────────────────────────────────────
async function sendDiscord(bounties) {
  if (!DISCORD_WEBHOOK) return;
  const embeds = bounties.slice(0, 5).map(b => ({
    title: `$${b.amount} - ${b.title.substring(0, 60)}`,
    url: b.url,
    description: `${b.labels.filter(l => !['bounty', 'bounty-hunt'].includes(l)).join(', ') || 'No tags'}\n💰 $${b.amount} | 🏆 ROI: ${b.roi} | 📁 ${b.repo}`,
    color: 5814783,
    footer: { text: `竞争: ${b.prCount} PR | 语言: ${b.language}` }
  }));
  try {
    await api('POST', DISCORD_WEBHOOK.replace('https://discord.com/api/webhooks/', ''), {
      username: '🦞 Bounty Scout',
      avatar_url: 'https://d2758695161.github.io/bounty-hunter-kit/icon.png',
      embeds
    });
  } catch { /* ignore */ }
}

// ─── Main scan ───────────────────────────────────────────────────────────────
async function main() {
  console.log('🔍 Bounty Scout v2 — Advanced GitHub Bounty Scanner');
  console.log(`   Languages: ${LANGUAGES.join(', ')}`);
  console.log(`   Budget range: $${MIN_AMOUNT}-${MAX_AMOUNT}\n`);

  if (!TOKEN) {
    console.error('❌ GH_TOKEN not set. Run: export GH_TOKEN=ghp_...');
    process.exit(1);
  }

  const queries = [
    `is:issue is:open no:assignee "$" in:title`,
    `is:issue is:open no:assignee "bounty" in:title`,
    `is:issue is:open no:assignee label:bounty`,
    `is:issue is:open no:assignee "paid" in:title "good first issue"`,
    `is:issue is:open no:assignee "reward" in:title "$" in:body`,
  ];

  const allBounties = [];
  const seen = new Set();

  for (const query of queries) {
    console.log(`\n📡 Query: ${query}`);
    try {
      const results = await api('GET', `/search/issues?q=${encodeURIComponent(query)}&per_page=50&sort=created&order=desc`);
      const items = results.items || [];
      console.log(`   Found ${items.length} issues`);

      for (const rawIssue of items) {
        if (seen.has(rawIssue.id)) continue;
        seen.add(rawIssue.id);

        // Rate limit protection
        await new Promise(r => setTimeout(r, 200));

        const issue = await enrichIssue(rawIssue);
        const amount = extractAmount(issue.title, issue.body);
        
        // Filter: has valid amount, no assignees, recent enough
        const ageDays = (Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (!amount || issue.assignees > 0 || ageDays > 30) continue;

        const repo = rawIssue.repository_url.split('/').slice(-2).join('/');
        const prCount = await getPRCount(repo);
        
        // Filter: low competition
        if (prCount >= 5) {
          console.log(`   ⏭ ${issue.title.substring(0, 50)}... (${prCount} PRs, skipping)`);
          continue;
        }

        const language = issue.labels.find(l => ['javascript', 'typescript', 'python', 'rust', 'go', 'solidity', 'java', 'c++'].includes(l.toLowerCase())) || 'unknown';
        const roi = roiScore(issue, amount);

        const bounty = {
          title: issue.title,
          url: issue.html_url,
          repo,
          amount,
          roi,
          competition: prCount,
          language,
          labels: issue.labels,
          created: issue.created_at,
          age: `${Math.round(ageDays)}d`,
          comments: issue.comments,
          body_excerpt: (issue.body || '').substring(0, 200),
        };

        console.log(`   ✅ [$${amount}] [ROI:${roi}] [${prCount}PR] ${issue.title.substring(0, 50)}`);
        allBounties.push(bounty);
      }
    } catch(e) {
      console.error(`   ❌ Error: ${e.message}`);
    }

    await new Promise(r => setTimeout(r, 1500)); // Between queries
  }

  // Sort by ROI
  allBounties.sort((a, b) => b.roi - a.roi);

  // Summary
  console.log('\n─────────────── SUMMARY ───────────────');
  console.log(`✅ Total hot bounties: ${allBounties.length}`);
  const totalValue = allBounties.reduce((s, b) => s + b.amount, 0);
  console.log(`💰 Total potential value: $${totalValue.toFixed(0)}`);
  
  // Top 5
  console.log('\n🏆 TOP 5 by ROI:');
  allBounties.slice(0, 5).forEach((b, i) => {
    console.log(`  ${i+1}. $${b.amount} [ROI:${b.roi}] ${b.title.substring(0, 50)}`);
  });

  // Save
  const report = {
    scanned_at: new Date().toISOString(),
    languages: LANGUAGES,
    budget_range: [MIN_AMOUNT, MAX_AMOUNT],
    total_found: allBounties.length,
    total_value: totalValue,
    top5_roi: allBounties.slice(0, 5),
    all: allBounties,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  console.log(`\n💾 Saved to ${OUTPUT_FILE}`);

  // Alerts
  if (allBounties.length > 0) {
    const top5 = allBounties.slice(0, 5);
    const tgText = top5.map(b => 
      `💰 $${b.amount} | ${b.language}\n` +
      `${b.title.substring(0, 50)}\n` +
      `🔗 ${b.url}\n`
    ).join('\n────────────────────\n');

    await sendTelegram(`🦞 <b>Bounty Scout Report</b>\n${new Date().toLocaleString('zh-CN')}\n\n${tgText}`);
    await sendDiscord(top5);
  }

  return allBounties;
}

main().catch(e => { console.error(e); process.exit(1); });
