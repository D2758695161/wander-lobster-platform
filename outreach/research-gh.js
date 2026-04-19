const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = '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';
const OUT = 'C:\\Users\\Administrator\\.openclaw\\workspace\\outreach';

function ghGet(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'leads-researcher-bot'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  // 1. Repos created in last 7 days with bounty/reward keywords
  const bountyRepos = await ghGet('/search/repositories?q=bounty+created:>2026-03-29&sort=updated&per_page=15');
  fs.writeFileSync(path.join(OUT, 'gh-bounty-repos.json'), JSON.stringify(bountyRepos, null, 2));
  console.log('Bounty repos:', bountyRepos.total_count, 'found');
  if (bountyRepos.items) bountyRepos.items.slice(0,5).forEach(r => console.log(' -', r.full_name, '|', r.stargazers_count, 'stars |', r.language));

  // 2. Issues with bounty label created in last 7 days
  const bountyIssues = await ghGet('/search/issues?q=label:bounty+created:>2026-03-29+is:issue+is:open&sort=updated&per_page=15');
  fs.writeFileSync(path.join(OUT, 'gh-bounty-issues.json'), JSON.stringify(bountyIssues, null, 2));
  console.log('\nBounty issues:', bountyIssues.total_count, 'found');
  if (bountyIssues.items) bountyIssues.items.slice(0,5).forEach(i => console.log(' -', i.repository_url, '|', i.title));

  // 3. Reward program repos
  const rewardRepos = await ghGet('/search/repositories?q=reward+program+created:>2026-03-29&sort=updated&per_page=15');
  fs.writeFileSync(path.join(OUT, 'gh-reward-repos.json'), JSON.stringify(rewardRepos, null, 2));
  console.log('\nReward repos:', rewardRepos.total_count, 'found');

  // 4. Algora bounties (popular bounty platform)
  const algora = await ghGet('/repos/algora-io/algora/issues?state=open&per_page=20');
  fs.writeFileSync(path.join(OUT, 'algora-issues.json'), JSON.stringify(algora, null, 2));
  console.log('\nAlgora issues:', algora.length);

  // 5. GitHub Sponsors repos accepting contributors (recently active)
  const sponsors = await ghGet('/search/repositories?q=github+sponsors+created:>2026-01-01&sort=stars&per_page=15');
  fs.writeFileSync(path.join(OUT, 'gh-sponsors-repos.json'), JSON.stringify(sponsors, null, 2));
  console.log('\nGitHub Sponsors repos:', sponsors.total_count, 'found');
  if (sponsors.items) sponsors.items.slice(0,5).forEach(r => console.log(' -', r.full_name, '|', r.stargazers_count, 'stars'));

  // 6. Check if any repos recently added FUNDING.yml
  const fundingRepos = await ghGet('/search/code?q=FUNDING.yml+created:>2026-03-29&per_page=15');
  fs.writeFileSync(path.join(OUT, 'gh-funding-files.json'), JSON.stringify(fundingRepos, null, 2));
  console.log('\nRepos with FUNDING.yml (last 7d):', fundingRepos.total_count);

  // 7. Trending repos this week
  const trending = await ghGet('/search/repositories?q=created:>2026-03-01+AI+OR+agent+OR+MCP&sort=stars&per_page=20');
  fs.writeFileSync(path.join(OUT, 'gh-ai-repos-april.json'), JSON.stringify(trending, null, 2));
  console.log('\nAI/Agent repos (March+):', trending.total_count, 'found');
  if (trending.items) trending.items.slice(0,8).forEach(r => console.log(' -', r.full_name, '|', r.stargazers_count, 'stars |', r.language));

  console.log('\n✅ All data saved to', OUT);
}

main().catch(console.error);
