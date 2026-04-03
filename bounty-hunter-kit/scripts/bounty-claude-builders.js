#!/usr/bin/env node
/**
 * Bounty Scout — claude-builders-bounty Edition
 * Scans the most active bounty repo right now: claude-builders-bounty
 * 
 * Usage:
 *   node scripts/bounty-claude-builders.js
 *   node scripts/bounty-claude-builders.js --status open
 *   node scripts/bounty-claude-builders.js --min 50 --max 200
 */

const https = require("https");

const TOKEN = process.env.GITHUB_TOKEN || "";
const REPO = "claude-builders-bounty/claude-builders-bounty";
const PER_PAGE = 30;

const args = process.argv.slice(2);
const statusFilter = args.includes("--status") ? args[args.indexOf("--status") + 1] : null;
const minReward = parseInt(args.includes("--min") ? args[args.indexOf("--min") + 1] : "0");
const maxReward = parseInt(args.includes("--max") ? args[args.indexOf("--max") + 1] : "999999");

function gh(path) {
  return new Promise((resolve, reject) => {
    const headers = {
      "Accept": "application/vnd.github+json",
      "User-Agent": "bounty-scout-claude-builders",
    };
    if (TOKEN) headers["Authorization"] = `Bearer ${TOKEN}`;
    const url = new URL(`https://api.github.com${path}`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers,
    };
    https.get(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    }).on("error", reject);
  });
}

async function main() {
  console.log("🦞 claude-builders-bounty Bounty Scout\n");
  console.log("Scanning:", REPO);
  console.log("Filters: min=$" + minReward + ", max=$" + maxReward);
  if (statusFilter) console.log("Status:", statusFilter);
  console.log("\n" + "=".repeat(60) + "\n");

  // Fetch issues with bounty labels
  const issues = await gh(`/repos/${REPO}/issues?state=open&per_page=${PER_PAGE}&labels=bounty`);
  if (!issues || !Array.isArray(issues)) {
    console.log("❌ Failed to fetch issues. Check rate limits or token.");
    return;
  }

  // Fetch PRs
  const prs = await gh(`/repos/${REPO}/pulls?state=open&per_page=${PER_PAGE}`);

  console.log(`📋 Found ${issues.length} open issues, ${prs?.length || 0} open PRs\n`);

  // Score and filter issues
  const scored = issues
    .filter(i => !i.pull_request && !i.title.startsWith("[CLOSED]"))
    .map(issue => {
      // Extract reward amount from body
      const body = issue.body || "";
      const rewardMatch = body.match(/\$?\s*(\d+)/);
      const reward = rewardMatch ? parseInt(rewardMatch[1]) : 50;
      const hasPR = prs?.some(p => p.body?.includes(`#${issue.number}`) || p.title.includes(issue.title));
      
      // Simple ROI score
      const complexity = body.length;
      const roi = reward / Math.max(complexity / 500, 1);
      const score = Math.round(roi * 100);

      return {
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
        reward,
        hasPR,
        comments: issue.comments,
        labels: (issue.labels || []).map(l => l.name),
        created: new Date(issue.created_at).toLocaleDateString("zh-CN"),
        score,
      };
    })
    .filter(i => i.reward >= minReward && i.reward <= maxReward)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    console.log("No bounties match your criteria.");
    return;
  }

  console.log(`🥇 TOP BOUNTIES (${scored.length} match)\n`);
  
  scored.slice(0, 10).forEach((b, i) => {
    const prStatus = b.hasPR ? "🔴 has PR" : "✅ unclaimed";
    const rewardStr = `$${b.reward}`;
    console.log(`${i + 1}. [${rewardStr}] ${b.title}`);
    console.log(`   #${b.number} · ${b.created} · comments: ${b.comments} · ${prStatus}`);
    console.log(`   Score: ${b.score} · ${b.url}\n`);
  });

  // Summary stats
  const totalValue = scored.reduce((s, b) => s + b.reward, 0);
  const unclaimed = scored.filter(b => !b.hasPR).length;
  console.log("=".repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Total bounties: ${scored.length}`);
  console.log(`   Unclaimed: ${unclaimed}`);
  console.log(`   Total value: $${totalValue}`);
  console.log(`   Avg reward: $${Math.round(totalValue / scored.length)}`);

  console.log(`\n💡 Quick claim:`);
  const top = scored.find(b => !b.hasPR);
  if (top) {
    console.log(`   Claim #${top.number}: ${top.url}`);
  }
}

main().catch(console.error);
