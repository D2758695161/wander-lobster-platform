/**
 * codex-plugin-scout.js
 * Targeted bounty scanner for openai/codex-plugin-cc
 * Focus: Fresh bug reports from 2026-04-07
 * 
 * Usage: node codex-plugin-scout.js
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const REPO = 'openai/codex-plugin-cc';

const bounties = [
  {
    number: 163,
    title: 'Test suite leaks broker processes — 158 orphans found',
    reward: '$50-200',
    difficulty: 'Hard',
    tags: ['TypeScript', 'Node.js', 'Testing', 'Process Management', 'Debugging'],
    body: `## Bug Description
The test suite leaves broker processes running. 158 orphan broker processes detected after test run.

## Reproduction
1. Run the test suite
2. Check for leftover broker processes
3. Count orphans: 158 detected

## Suggested Fix
Find and fix the process cleanup logic in test teardown hooks. Ensure child processes are properly terminated.`,
    claimUrl: 'https://github.com/openai/codex-plugin-cc/issues/163'
  },
  {
    number: 165,
    title: 'fix: handle EAGAIN in hook scripts when stdin is non-blocking',
    reward: '$50-200',
    difficulty: 'Medium',
    tags: ['TypeScript', 'Node.js', 'IPC', 'Unix', 'Error Handling'],
    body: `## Bug Description
Hook scripts fail with EAGAIN when stdin is set to non-blocking mode.

## Reproduction
Set stdin to non-blocking mode in hook script execution environment.

## Root Cause
The error handling doesn't account for EAGAIN errno when reading from non-blocking stdin.

## Suggested Fix
Handle EAGAIN in the stdin read loop — retry on EAGAIN, fail on actual read errors.`,
    claimUrl: 'https://github.com/openai/codex-plugin-cc/issues/165'
  },
  {
    number: 171,
    title: 'fix: strip ANSI escape sequences from JSONL parsing',
    reward: '$50-200',
    difficulty: 'Easy',
    tags: ['TypeScript', 'Regex', 'CLI', 'Parsing', 'String'],
    body: `## Bug Description
JSONL output parser breaks on ANSI escape sequences (e.g., bracketed paste mode: [?2004)

## Reproduction
Run Claude Code in bracketed paste mode, parse JSONL output — parser fails.

## Suggested Fix
Strip terminal control codes (ANSI escape sequences) before parsing JSONL lines:
\\x1b\\[[0-9;]*[a-zA-Z] pattern match and remove before JSON.parse()`,
    claimUrl: 'https://github.com/openai/codex-plugin-cc/issues/171'
  },
  {
    number: 23,
    title: 'Review fails with JSONL parse error: bracketed paste mode escape sequence',
    reward: '$50-200',
    difficulty: 'Easy',
    tags: ['TypeScript', 'JSONL', 'CLI', 'Parsing', 'Regex'],
    body: `## Bug Description
Claude Code output includes bracketed paste mode escape sequences ([?2004) that break JSONL parsing.

## Reproduction
Enable bracketed paste mode in terminal, run code review, JSONL parsing fails.

## Suggested Fix
Filter bracketed paste mode escape sequences ([?NNNh, [?NNNl) from output before parsing.`,
    claimUrl: 'https://github.com/openai/codex-plugin-cc/issues/23'
  },
  {
    number: 170,
    title: 'NLPM audit findings: 4 bugs found (score 93/100)',
    reward: '$50-200',
    difficulty: 'Medium',
    tags: ['TypeScript', 'Security', 'Audit', 'Bug Fix', 'NLPM'],
    body: `## Audit Summary
NLPM audit found 4 bugs with security/compatibility implications. Current score: 93/100.

## Scope
Review the audit report and fix the identified issues in the codebase.

## Key Areas
- Input validation edge cases
- Error handling consistency
- Compatibility with newer Node.js versions`,
    claimUrl: 'https://github.com/openai/codex-plugin-cc/issues/170'
  },
  {
    number: 169,
    title: 'fix: declare model in codex-rescue agent frontmatter',
    reward: '$50-200',
    difficulty: 'Easy',
    tags: ['TypeScript', 'Claude Code', 'Agent', 'Config', 'Frontmatter'],
    body: `## Bug Description
The codex-rescue agent is missing model declaration in frontmatter.

## Reproduction
Run codex-rescue without explicit model declaration.

## Suggested Fix
Add model declaration in agent frontmatter YAML config.`,
    claimUrl: 'https://github.com/openai/codex-plugin-cc/issues/169'
  }
];

async function fetchIssueComments(issueNumber) {
  const url = `https://api.github.com/repos/${REPO}/issues/${issueNumber}/comments`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'bounty-hunter-kit'
    }
  });
  if (!res.ok) return [];
  return res.json();
}

async function checkClaimStatus(number) {
  const url = `https://api.github.com/repos/${REPO}/issues/${number}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'bounty-hunter-kit'
    }
  });
  if (!res.ok) return { claimed: false, comments: 0 };
  const issue = await res.json();
  const comments = await fetchIssueComments(number);
  const hasAttempt = comments.some(c => c.body && c.body.includes('/attempt'));
  return { claimed: hasAttempt, comments: comments.length, assignees: issue.assignees.length };
}

async function main() {
  console.log('🦞 Codex Plugin Bounty Scout');
  console.log('='.repeat(50));
  console.log(`\nScanning: ${REPO}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  let available = 0;
  for (const b of bounties) {
    const status = await checkClaimStatus(b.number);
    const claimLink = `https://github.com/${REPO}/issues/${b.number}`;
    
    if (!status.claimed) {
      available++;
      console.log(`🟢 [UNCLAIMED] #${b.number}`);
      console.log(`   Title: ${b.title}`);
      console.log(`   Reward: ${b.reward} | Difficulty: ${b.difficulty}`);
      console.log(`   Tags: ${b.tags.join(', ')}`);
      console.log(`   Link: ${claimLink}`);
      console.log(`   Quick fix template:\n   ${b.body.split('\n').slice(0,4).join('\n')}...`);
      console.log('');
    } else {
      console.log(`🔴 [CLAIMED] #${b.number} — ${status.comments} comments, ${status.assignees} assignees`);
      console.log(`   Title: ${b.title}`);
      console.log('');
    }
  }

  console.log('='.repeat(50));
  console.log(`\nResult: ${available}/${bounties.length} unclaimed`);
  if (available > 0) {
    console.log('\n🎯 Top picks for today:');
    const easy = bounties.filter(b => b.difficulty === 'Easy').slice(0, 2);
    for (const b of easy) {
      console.log(`   ✅ #${b.number} (Easy) — ${b.title} — ${b.reward}`);
    }
  }
}

main().catch(console.error);
