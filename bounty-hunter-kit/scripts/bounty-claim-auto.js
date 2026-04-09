#!/usr/bin/env node
/**
 * 🦞 Bounty Hunter Kit — Auto Claim & Submit
 * 
 * Automated workflow:
 * 1. Scan for bounty issues matching filters
 * 2. Score by ROI (reward / competition / age)
 * 3. Fork, implement, and submit PR automatically
 * 
 * Usage:
 *   node scripts/bounty-claim-auto.js --lang python --min 100 --max 2000
 *   node scripts/bounty-claim-auto.js --issue owner/repo#123
 * 
 * Env vars required (config/.env):
 *   GH_TOKEN=ghp_xxxx
 *   PAYMENT_ADDRESS=TPxxxx
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ─── CLI Args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flags = {};
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) {
    const key = args[i].replace(/^--/, "");
    flags[key] = args[i + 1] ?? true;
    i++;
  }
}

const LANG = flags.lang || "python,javascript,typescript";
const MIN = parseInt(flags.min || "50");
const MAX = parseInt(flags.max || "5000");
const WORK_DIR = flags.workdir || "./bounty-work";
const DRY_RUN = flags["dry-run"] === "true" || flags["dry-run"] === undefined ? true : false;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function gh(cmd) {
  console.log(`\n$ ${cmd}`);
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
  } catch (e) {
    return null;
  }
}

function ghLines(cmd) {
  const out = gh(cmd);
  if (!out) return [];
  return out.trim().split("\n").filter(Boolean);
}

function parseReward(text) {
  const m = text.match(/\$[\d,]+(?:\.\d+)?|\$[\d,]+(?:\.\d+)?(?:USD|USDT)/i);
  if (!m) return 0;
  return parseFloat(m[0].replace(/[$,USDUSDT]/gi, ""));
}

function scoreIssue(issue, reward) {
  const lines = ghLines(`gh issue view ${issue} --json comments,assignees,body`);
  const openPRs = ghLines(`gh pr list --head ${issue.split("/")[1].split("#")[0]} --state open --json number`);
  
  let score = reward;
  if (openPRs.length === 0) score += 50;       // No competition bonus
  if (openPRs.length <= 2) score += 20;       // Low competition
  if (reward > 500) score += 30;              // High value bonus
  return score;
}

// ─── Step 1: Scan ────────────────────────────────────────────────────────────
function scanBounties() {
  console.log("\n🔍 Scanning for bounties...");
  console.log(`   Languages: ${LANG}`);
  console.log(`   Budget: $${MIN} - $${MAX}`);

  const langs = LANG.split(",");
  const results = [];

  for (const lang of langs) {
    const cmd = `gh search issues "is:issue is:open no:assignee \\"$" in:title comments:<5 created:>2025-10-01 language:${lang}" --limit 30 --json number,title,url,repositoryUrl,body`;
    const out = gh(cmd);
    if (!out) continue;

    try {
      const issues = JSON.parse(out);
      for (const issue of issues) {
        const reward = parseReward(issue.title + " " + (issue.body || ""));
        if (reward >= MIN && reward <= MAX) {
          const score = scoreIssue(issue, reward);
          results.push({ ...issue, reward, score, lang });
        }
      }
    } catch (e) {
      console.log(`   ⚠ Parse error for ${lang}: ${e.message}`);
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  console.log(`\n✅ Found ${results.length} eligible bounties:\n`);
  results.slice(0, 10).forEach((r, i) => {
    console.log(`  ${i + 1}. [${r.lang}] $${r.reward} — ${r.title}`);
    console.log(`     ${r.url}`);
  });

  return results;
}

// ─── Step 2: Claim ───────────────────────────────────────────────────────────
function claimIssue(issue) {
  const [owner, repo] = issue.repositoryUrl.replace("https://github.com/", "").split("/");
  const issueNum = issue.number;
  const branchName = `bounty/issue-${issueNum}-${Date.now()}`;

  console.log(`\n🎯 Claiming: ${owner}/${repo}#${issueNum}`);

  // Fork
  console.log("   Forking repo...");
  gh(`gh repo fork ${owner}/${repo} --clone --depth 1`);
  const localPath = path.join(WORK_DIR, repo);

  // Clone if not exists
  if (!fs.existsSync(localPath)) {
    gh(`git clone https://github.com/${owner}/${repo}.git ${localPath}`);
  }

  // Create branch
  process.chdir(localPath);
  gh(`git checkout -b ${branchName}`);

  // Read issue
  const issueData = JSON.parse(gh(`gh issue view ${issueNum} --json body,comments`));

  console.log(`\n📋 Issue #${issueNum}:`);
  console.log(`   ${issue.body?.slice(0, 200) || "(no body)"}...`);

  if (DRY_RUN) {
    console.log("\n🔒 DRY RUN — no actual changes made");
    console.log(`   Branch: ${branchName}`);
    console.log(`   To implement: Read issue, write code, commit, push, create PR`);
    return;
  }

  // TODO: Add your AI implementation logic here
  // This is where you'd inject your coding agent
  
  // Example implementation stub:
  const implNote = `// TODO: Implement fix for ${owner}/${repo}#${issueNum}\n// Reward: $${issue.reward}`;

  fs.writeFileSync("IMPLEMENTATION.js", implNote);

  // Commit & push
  gh(`git add .`);
  gh(`git commit -m "fix(#${issueNum}): implement bounty solution"`);
  gh(`git push origin ${branchName} --force`);

  // Create PR
  const prBody = `## 🦞 Bounty Claim

| 字段 | 内容 |
|------|------|
| **Issue** | ${owner}/${repo}#${issueNum} |
| **Bounty** | $${issue.reward} |
| **收款地址** | \`${process.env.PAYMENT_ADDRESS || "TPxxxx"}\` |

## ✅ 改动说明

[Describe your changes here]

## 🧪 测试

[Describe how you tested this]

---
*Auto-submitted by Bounty Hunter Kit 🦞*`;

  const prTitle = `fix(#${issueNum}): bounty solution — $${issue.reward}`;
  gh(`gh pr create --title "${prTitle}" --body "${prBody.replace(/"/g, '\\"')}" --repo ${owner}/${repo}`);

  console.log(`\n✅ PR created for ${owner}/${repo}#${issueNum}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────
console.log("🦞 Bounty Hunter Kit — Auto Claim & Submit");
console.log("==========================================");

if (!process.env.GH_TOKEN && !flags.issue) {
  console.log("\n⚠️  Set GH_TOKEN env var first:");
  console.log("   export GH_TOKEN=ghp_xxxx\n");
  process.exit(1);
}

// Single issue mode
if (flags.issue) {
  const [repo, num] = flags.issue.split("#");
  const issue = {
    repositoryUrl: `https://github.com/${repo}`,
    number: parseInt(num),
    title: `Issue #${num}`,
    reward: parseInt(flags.reward || "0"),
  };
  claimIssue(issue);
} else {
  const bounties = scanBounties();
  if (bounties.length === 0) {
    console.log("\n😢 No eligible bounties found. Try widening your budget range.");
    process.exit(0);
  }

  const top = bounties[0];
  console.log(`\n🚀 Taking top bounty: ${top.title}`);
  claimIssue(top);
}
