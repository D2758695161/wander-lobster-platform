#!/usr/bin/env node
/**
 * bounty-session-tracker.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Track your bounty hunting session: log PRs, wins, losses, earnings.
 * Output a session report + update a persistent JSON ledger.
 *
 * Usage:
 *   node scripts/bounty-session-tracker.js new <repo> <title> [--amount $N]
 *   node scripts/bounty-session-tracker.js log <pr-url> <status> [--amount $N]
 *   node scripts/bounty-session-tracker.js report [--days N]
 *   node scripts/bounty-session-tracker.js leaderboard [--limit 10]
 *
 * Status: submitted | merged | closed | rejected | expired
 *
 * Examples:
 *   node scripts/bounty-session-tracker.js new openai/codex-plugin-cc "Add --full-access flag" --amount bounty
 *   node scripts/bounty-session-tracker.js log https://github.com/openai/codex-plugin-cc/pull/218 merged --amount bounty
 *   node scripts/bounty-session-tracker.js report --days 7
 *   node scripts/bounty-session-tracker.js leaderboard --limit 5
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs = require("fs");
const path = require("path");

const LEDGER_FILE = path.join(__dirname, "..", "data", "bounty-ledger.json");
const DATA_DIR = path.join(__dirname, "..", "data");

// ── Init ───────────────────────────────────────────────────────────────────
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LEDGER_FILE)) {
    fs.writeFileSync(LEDGER_FILE, JSON.stringify({ sessions: [], updated: new Date().toISOString() }, null, 2));
  }
}

function loadLedger() {
  ensureDataDir();
  return JSON.parse(fs.readFileSync(LEDGER_FILE, "utf8"));
}

function saveLedger(ledger) {
  ledger.updated = new Date().toISOString();
  fs.writeFileSync(LEDGER_FILE, JSON.stringify(ledger, null, 2));
}

// ── Commands ────────────────────────────────────────────────────────────────
async function cmdNew(repo, title, opts) {
  const ledger = loadLedger();
  const id = `${Date.now()}`;
  const session = {
    id,
    repo,
    title,
    amount: opts.amount || "TBD",
    status: "submitted",
    submittedAt: new Date().toISOString(),
    prUrl: null,
    mergedAt: null,
    earnings: 0,
    hoursSpent: 0,
    notes: [],
  };
  ledger.sessions.push(session);
  saveLedger(ledger);
  console.log(`\n✅ New bounty session logged!`);
  console.log(`   ID:     ${id}`);
  console.log(`   Repo:   ${repo}`);
  console.log(`   Title:  ${title}`);
  console.log(`   Amount: ${session.amount}`);
  console.log(`\n   To log a PR: node scripts/bounty-session-tracker.js log <pr-url> <status> --amount $N`);
}

async function cmdLog(prUrl, status, opts) {
  if (!["submitted", "merged", "closed", "rejected", "expired"].includes(status)) {
    console.error(`❌ Unknown status: ${status}. Use: submitted | merged | closed | rejected | expired`);
    process.exit(1);
  }

  const ledger = loadLedger();
  const session = ledger.sessions.find((s) => s.prUrl === prUrl) || ledger.sessions[ledger.sessions.length - 1];

  if (!session) {
    console.error("❌ No session found. Run `new` command first.");
    process.exit(1);
  }

  session.prUrl = prUrl;
  session.status = status;
  session.mergedAt = status === "merged" ? new Date().toISOString() : null;

  if (opts.amount) {
    const num = parseFloat(opts.amount.replace(/[^0-9.]/g, ""));
    session.earnings = isNaN(num) ? 0 : num;
  }

  if (opts.hours) {
    session.hoursSpent = parseFloat(opts.hours);
  }

  if (opts.note) {
    session.notes.push({ text: opts.note, at: new Date().toISOString() });
  }

  saveLedger(ledger);

  const emoji = status === "merged" ? "🎉" : status === "rejected" ? "😔" : "📝";
  console.log(`\n${emoji} Session updated!`);
  console.log(`   Status:   ${status}`);
  console.log(`   Earnings: ${session.earnings > 0 ? `$${session.earnings}` : session.amount}`);
  console.log(`   PR:       ${prUrl}`);
}

async function cmdReport(opts) {
  const ledger = loadLedger();
  const days = opts.days || 30;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  const sessions = ledger.sessions.filter((s) => new Date(s.submittedAt).getTime() >= cutoff);

  const total = sessions.length;
  const merged = sessions.filter((s) => s.status === "merged");
  const pending = sessions.filter((s) => s.status === "submitted");
  const rejected = sessions.filter((s) => s.status === "rejected");
  const earnings = merged.reduce((sum, s) => sum + (s.earnings || 0), 0);
  const hours = sessions.reduce((sum, s) => sum + (s.hoursSpent || 0), 0);
  const winRate = total > 0 ? ((merged.length / total) * 100).toFixed(1) : "0";
  const hourly = hours > 0 ? (earnings / hours).toFixed(2) : "N/A";

  const repoStats = {};
  sessions.forEach((s) => {
    if (!repoStats[s.repo]) repoStats[s.repo] = { total: 0, merged: 0, earnings: 0 };
    repoStats[s.repo].total++;
    if (s.status === "merged") repoStats[s.repo].merged++;
    repoStats[s.repo].earnings += s.earnings || 0;
  });

  const topRepos = Object.entries(repoStats)
    .sort((a, b) => b[1].earnings - a[1].earnings)
    .slice(0, 5);

  console.log(`
╔══════════════════════════════════════════════════════╗
║         🦞 Bounty Hunter Session Report              ║
║         ${new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).padEnd(42)}║
╠══════════════════════════════════════════════════════╣
║  Period: Last ${String(days).padEnd(40)}║
╠══════════════════════════════════════════════════════╣
║  📊 Session Stats                                     ║
║  ─────────────────────────────────────────────────── ║
║    Total Sessions   : ${String(total).padEnd(40)}║
║    ✅ Merged        : ${String(merged.length).padEnd(40)}║
║    ⏳ Pending       : ${String(pending.length).padEnd(40)}║
║    ❌ Rejected      : ${String(rejected.length).padEnd(40)}║
║    Win Rate         : ${String(winRate + "%").padEnd(40)}║
╠══════════════════════════════════════════════════════╣
║  💰 Earnings Stats                                    ║
║  ─────────────────────────────────────────────────── ║
║    Total Earned     : ${String(earnings > 0 ? `$${earnings.toFixed(2)}` : "$0").padEnd(40)}║
║    Hours Logged     : ${String(hours.toFixed(1) + " hrs").padEnd(40)}║
║    Effective Rate   : ${String(hourly !== "N/A" ? `$${hourly}/hr` : hourly).padEnd(40)}║
╠══════════════════════════════════════════════════════╣
║  🏆 Top Repos by Earnings                            ║`);
  if (topRepos.length === 0) {
    console.log(`║    (no data yet)                                     ║`);
  } else {
    topRepos.forEach(([repo, stats]) => {
      console.log(`║    ${repo.substring(0, 42).padEnd(42)}║`);
      console.log(`║      → ${String(`${stats.merged}/${stats.total} merged | $${stats.earnings.toFixed(2)}`).padEnd(47)}║`);
    });
  }
  console.log(`╠══════════════════════════════════════════════════════╣
║  📋 Recent Activity                                   ║`);
  sessions
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5)
    .forEach((s) => {
      const icon = s.status === "merged" ? "✅" : s.status === "rejected" ? "❌" : "⏳";
      const title = s.title.substring(0, 38);
      console.log(`║  ${icon} ${title.padEnd(47)}║`);
    });
  console.log(`╚══════════════════════════════════════════════════════╝`);
}

async function cmdLeaderboard(opts) {
  const ledger = loadLedger();
  const limit = opts.limit || 10;

  const repoStats = {};
  ledger.sessions
    .filter((s) => s.status === "merged")
    .forEach((s) => {
      if (!repoStats[s.repo]) repoStats[s.repo] = { repo: s.repo, merged: 0, earnings: 0 };
      repoStats[s.repo].merged++;
      repoStats[s.repo].earnings += s.earnings || 0;
    });

  const sorted = Object.values(repoStats)
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, limit);

  console.log(`
🦞 Bounty Hunter Leaderboard — Top Repos by Earnings
─────────────────────────────────────────────────────`);
  sorted.forEach((r, i) => {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : ` #${i + 1} `;
    console.log(`  ${medal}  ${r.repo.padEnd(40)} $${r.earnings.toFixed(2)} (${r.merged} PRs)`);
  });
  console.log(`─────────────────────────────────────────────────────`);

  const totalEarned = sorted.reduce((sum, r) => sum + r.earnings, 0);
  console.log(`  💰 Total (top ${sorted.length} repos): $${totalEarned.toFixed(2)}`);
}

// ── CLI ─────────────────────────────────────────────────────────────────────
const [, , cmd, ...rawArgs] = process.argv;
const opts = {};
const positional = [];

rawArgs.forEach((arg, i) => {
  if (arg.startsWith("--")) {
    const key = arg.replace(/^--/, "");
    const next = rawArgs[i + 1];
    if (!next || next.startsWith("--")) {
      opts[key] = true;
    } else {
      opts[key] = next;
      rawArgs.splice(i + 1, 1);
    }
  } else {
    positional.push(arg);
  }
});

async function main() {
  switch (cmd) {
    case "new":
      if (!positional[0] || !positional[1]) {
        console.error("Usage: node bounty-session-tracker.js new <repo> <title> [--amount $N]");
        process.exit(1);
      }
      await cmdNew(positional[0], positional[1], opts);
      break;
    case "log":
      if (!positional[0] || !positional[1]) {
        console.error("Usage: node bounty-session-tracker.js log <pr-url> <status> [--amount $N] [--hours N]");
        process.exit(1);
      }
      await cmdLog(positional[0], positional[1], opts);
      break;
    case "report":
      await cmdReport(opts);
      break;
    case "leaderboard":
      await cmdLeaderboard(opts);
      break;
    default:
      console.log(`
🦞 Bounty Session Tracker — Commands:
  node bounty-session-tracker.js new <repo> <title> [--amount $N]
    → Log a new bounty hunting session

  node bounty-session-tracker.js log <pr-url> <status> [--amount $N] [--hours N] [--note "text"]
    → Update session status (submitted|merged|closed|rejected|expired)

  node bounty-session-tracker.js report [--days N]
    → Show earnings & activity report (default: last 30 days)

  node bounty-session-tracker.js leaderboard [--limit N]
    → Show top repos by earnings
`);
  }
}

main().catch(console.error);
