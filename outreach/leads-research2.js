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
        catch(e) { reject(new Error('Parse: ' + e.message + ' | ' + data.substring(0, 200))); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const results = { leads: [] };

  // 1. Search for issues with explicit dollar amounts in title or body, last 7 days
  const dollarQueries = [
    '/search/issues?q=%24+created:2026-04-08..2026-04-15+in:title,body&per_page=20&sort=created&order=desc',
    '/search/issues?q=usd+created:2026-04-08..2026-04-15+in:title,body&per_page=20&sort=created&order=desc',
  ];

  for (const q of dollarQueries) {
    try {
      const res = await githubGet(q);
      if (res.items) {
        res.items.forEach(item => {
          const amount = (item.body || '').match(/\$[0-9,]+/)?.[0] 
            || (item.title || '').match(/\$[0-9,]+/)?.[0]
            || (item.body || '').match(/[0-9,]+\s*USD/i)?.[0]
            || 'negotiable';
          if (amount !== 'negotiable' || item.title.toLowerCase().includes('bounty') || item.title.toLowerCase().includes('reward')) {
            results.leads.push({
              id: `gh-dollar-${item.id}`,
              source: 'GitHub Dollar Bounty Search',
              company_project: item.repository_url.replace('https://api.github.com/repos/', ''),
              url: `https://github.com/${item.repository_url.replace('https://api.github.com/repos/', '')}`,
              issue_url: item.html_url,
              title: item.title.substring(0, 120),
              what_they_need: (item.body || '').substring(0, 400),
              how_to_reach: `Comment on issue #${item.number} at ${item.html_url}`,
              expected_budget: amount !== 'negotiable' ? amount : 'Bounty (negotiate)',
              state: item.state,
              created_at: item.created_at,
              labels: item.labels.map(l => l.name),
              tech_stack: []
            });
          }
        });
      }
    } catch(e) { console.error('Error:', e.message); }
  }

  // 2. Search for new repos (last 7 days) with "mcp" or "agent" topics
  try {
    const newAgentRepos = await githubGet('/search/repositories?q=mcp+OR+agent+created:>2026-04-08&sort=stars&order=desc&per_page=15');
    if (newAgentRepos.items) {
      newAgentRepos.items.forEach(repo => {
        if (repo.stargazers_count >= 5) { // only repos with some traction
          results.leads.push({
            id: `gh-agent-repo-${repo.id}`,
            source: 'GitHub New Agent/MCP Repos',
            company_project: repo.full_name,
            url: repo.html_url,
            homepage: repo.homepage,
            description: repo.description,
            stars: repo.stargazers_count,
            what_they_need: 'Contributor help: open issues, feature development, MCP server implementation',
            how_to_reach: `Open PR or issue at ${repo.html_url}`,
            expected_budget: 'Unpaid (portfolio/reputation building) or negotiate',
            created_at: repo.created_at,
            labels: repo.topics || [],
            tech_stack: repo.topics || []
          });
        }
      });
    }
  } catch(e) { console.error('Agent repos error:', e.message); }

  // 3. Algora.io - browse bounties page
  // 4. Layer3 bounties - check for new ones
  try {
    const layer3 = await githubGet('/search/issues?q=layer3+label:bounty+created:2026-04-08..2026-04-15&per_page=10');
    if (layer3.items) {
      layer3.items.forEach(item => {
        results.leads.push({
          id: `gh-layer3-${item.id}`,
          source: 'GitHub - Layer3 Bounties',
          company_project: item.repository_url.replace('https://api.github.com/repos/', ''),
          url: `https://github.com/${item.repository_url.replace('https://api.github.com/repos/', '')}`,
          issue_url: item.html_url,
          title: item.title,
          what_they_need: (item.body || '').substring(0, 300),
          how_to_reach: `Comment on issue at ${item.html_url}`,
          expected_budget: 'Layer3 CUBE tokens',
          state: item.state,
          created_at: item.created_at,
          labels: item.labels.map(l => l.name),
          tech_stack: []
        });
      });
    }
  } catch(e) { console.error('Layer3 error:', e.message); }

  // 5. Superteam bounties
  try {
    const superteam = await githubGet('/search/issues?q=superteam+label:bounty+created:2026-04-08..2026-04-15&per_page=10');
    if (superteam.items) {
      superteam.items.forEach(item => {
        const amount = (item.body || '').match(/\$[0-9,]+/)?.[0] || 'negotiable';
        results.leads.push({
          id: `gh-superteam-${item.id}`,
          source: 'GitHub - Superteam Bounties',
          company_project: item.repository_url.replace('https://api.github.com/repos/', ''),
          url: `https://github.com/${item.repository_url.replace('https://api.github.com/repos/', '')}`,
          issue_url: item.html_url,
          title: item.title,
          what_they_need: (item.body || '').substring(0, 300),
          how_to_reach: `Comment on issue at ${item.html_url}`,
          expected_budget: amount !== 'negotiable' ? amount : '$500-10K+ SOL/USDC',
          state: item.state,
          created_at: item.created_at,
          labels: item.labels.map(l => l.name),
          tech_stack: []
        });
      });
    }
  } catch(e) { console.error('Superteam error:', e.message); }

  console.log(JSON.stringify(results, null, 2));
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
