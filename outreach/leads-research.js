const https = require('https');

const GITHUB_TOKEN = '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';

function githubGet(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      headers: {
        'User-Agent': 'OpenClaw-Lead-Researcher/1.0',
        'Authorization': 'Bearer ' + GITHUB_TOKEN,
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('Parse error: ' + e.message + ' | ' + data.substring(0, 200))); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const results = { sources: {}, leads: [] };

  // 1. GitHub bounty issues (last 7 days)
  try {
    console.error('Fetching GitHub bounty issues...');
    const bounties = await githubGet('/search/issues?q=bounty+created:2026-04-08..2026-04-15+in:title,body&per_page=30&sort=created&order=desc');
    if (bounties.items) {
      results.sources.githubBounties = bounties.total_count;
      bounties.items.forEach(item => {
        const amount = (item.body || '').match(/\$[0-9,]+/)?.[0] 
          || (item.body || '').match(/[0-9,]+\s*(USD|USDT|USDC|RMB|CNY|ETH|SOL)/i)?.[0]
          || 'unspecified';
        results.leads.push({
          id: `gh-bounty-${Date.now()}-${item.id}`,
          source: 'GitHub Issues API',
          company_project: item.repository_url.replace('https://api.github.com/repos/', ''),
          url: `https://github.com/${item.repository_url.replace('https://api.github.com/repos/', '')}`,
          issue_url: item.html_url,
          title: item.title,
          what_they_need: item.body?.substring(0, 300) || item.title,
          how_to_reach: `Comment on issue #${item.number} or open PR directly`,
          expected_budget: amount !== 'unspecified' ? amount : 'Bounty (negotiate)',
          labels: item.labels.map(l => l.name),
          state: item.state,
          created_at: item.created_at,
          tech_stack: []
        });
      });
      console.error(`Found ${bounties.items.length} bounty issues`);
    }
  } catch(e) { console.error('Bounty search error:', e.message); }

  // 2. GitHub sponsors projects accepting contributors
  try {
    console.error('Fetching GitHub sponsors trending...');
    const sponsors = await githubGet('/search/repositories?q=sponsor+created:>2026-04-01&sort=stars&order=desc&per_page=15');
    if (sponsors.items) {
      results.sources.githubSponsors = sponsors.total_count;
      sponsors.items.forEach(repo => {
        results.leads.push({
          id: `gh-sponsor-${repo.id}`,
          source: 'GitHub Sponsors Explore',
          company_project: repo.full_name,
          url: repo.html_url,
          homepage: repo.homepage,
          description: repo.description,
          stars: repo.stargazers_count,
          what_they_need: repo.description || 'Open-source contribution, documentation, features',
          how_to_reach: `GitHub Sponsors page or open issues/PRs at ${repo.html_url}`,
          expected_budget: 'GitHub Sponsors tier or direct sponsorship',
          labels: ['github-sponsor'],
          created_at: repo.created_at,
          tech_stack: repo.topics || []
        });
      });
      console.error(`Found ${sponsors.items.length} sponsor repos`);
    }
  } catch(e) { console.error('Sponsor search error:', e.message); }

  // 3. New repos with bounty/reward labels in last 7 days
  try {
    console.error('Fetching new repos with bounty labels...');
    const newRepos = await githubGet('/search/repositories?q=bounty+reward+created:>2026-04-08&sort=stars&order=desc&per_page=15');
    if (newRepos.items) {
      results.sources.newBountyRepos = newRepos.total_count;
      newRepos.items.forEach(repo => {
        results.leads.push({
          id: `gh-newrepo-${repo.id}`,
          source: 'GitHub Repository Search',
          company_project: repo.full_name,
          url: repo.html_url,
          homepage: repo.homepage,
          description: repo.description,
          stars: repo.stargazers_count,
          what_they_need: 'Bounty program, open issues, contributor opportunities',
          how_to_reach: `Open issue or PR at ${repo.html_url}`,
          expected_budget: 'Bounty or sponsorship',
          labels: repo.topics || ['bounty', 'reward'],
          created_at: repo.created_at,
          tech_stack: repo.topics || []
        });
      });
      console.error(`Found ${newRepos.items.length} new bounty repos`);
    }
  } catch(e) { console.error('New repos error:', e.message); }

  // 4. Search for repos with "tip" or "grant" labels created recently
  try {
    console.error('Fetching tip/grant issues...');
    const tips = await githubGet('/search/issues?q=label%3Atip+OR+label%3Agrant+created:2026-04-08..2026-04-15&per_page=20&sort=created&order=desc');
    if (tips.items) {
      results.sources.tipGrantIssues = tips.total_count;
      tips.items.forEach(item => {
        const amount = (item.body || '').match(/\$[0-9,]+/)?.[0] || 'negotiable';
        results.leads.push({
          id: `gh-tip-${item.id}`,
          source: 'GitHub Issues - tip/grant labels',
          company_project: item.repository_url.replace('https://api.github.com/repos/', ''),
          url: `https://github.com/${item.repository_url.replace('https://api.github.com/repos/', '')}`,
          issue_url: item.html_url,
          title: item.title,
          what_they_need: item.body?.substring(0, 300) || item.title,
          how_to_reach: `Comment on issue #${item.number}`,
          expected_budget: amount,
          labels: item.labels.map(l => l.name),
          state: item.state,
          created_at: item.created_at,
          tech_stack: []
        });
      });
      console.error(`Found ${tips.items.length} tip/grant issues`);
    }
  } catch(e) { console.error('Tip/grant error:', e.message); }

  console.log(JSON.stringify(results, null, 2));
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
