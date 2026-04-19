const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = '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';

function fetch(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `token ${TOKEN}`,
        'User-Agent': 'leads-researcher'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const results = {
    timestamp: new Date().toISOString(),
    leads: []
  };

  // 1. GitHub Bounty Issues (last 7 days)
  console.log('Fetching GitHub bounty issues...');
  try {
    const data = await fetch('https://api.github.com/search/issues?q=label:bounty+created:>2026-03-29&per_page=30&sort=created&order=desc');
    console.log('Found', data.total_count || 0, 'bounty issues');
    if (data.items) {
      for (const issue of data.items.slice(0, 15)) {
        const repoName = issue.repository_url?.split('/').slice(-2).join('/') || 'Unknown';
        results.leads.push({
          source: 'GitHub Bounty',
          name: repoName,
          need: issue.title,
          contact: issue.html_url,
          budget: 'Bounty (check issue for amount)',
          url: issue.html_url,
          labels: issue.labels?.filter(l => l.name !== 'bounty').map(l => l.name) || [],
          created: issue.created_at
        });
      }
    }
  } catch (e) {
    console.log('GitHub bounty error:', e.message);
  }

  // 2. GitHub Issues with "reward" label
  console.log('Fetching GitHub reward issues...');
  try {
    const data = await fetch('https://api.github.com/search/issues?q=label:reward+created:>2026-03-29&per_page=15&sort=created');
    if (data.items) {
      for (const issue of data.items.slice(0, 10)) {
        const repoName = issue.repository_url?.split('/').slice(-2).join('/') || 'Unknown';
        results.leads.push({
          source: 'GitHub Reward',
          name: repoName,
          need: issue.title,
          contact: issue.html_url,
          budget: 'Reward (check issue for amount)',
          url: issue.html_url,
          created: issue.created_at
        });
      }
    }
  } catch (e) {
    console.log('GitHub reward error:', e.message);
  }

  // 3. GitHub Issues with "hacktoberfest" label (if recent)
  console.log('Fetching Hacktoberfest issues...');
  try {
    const data = await fetch('https://api.github.com/search/issues?q=label:hacktoberfest+created:>2026-03-01&per_page=15&sort=created');
    if (data.items) {
      for (const issue of data.items.slice(0, 10)) {
        const repoName = issue.repository_url?.split('/').slice(-2).join('/') || 'Unknown';
        results.leads.push({
          source: 'Hacktoberfest',
          name: repoName,
          need: issue.title,
          contact: issue.html_url,
          budget: 'Hacktoberfest rewards',
          url: issue.html_url,
          created: issue.created_at
        });
      }
    }
  } catch (e) {
    console.log('Hacktoberfest error:', e.message);
  }

  // 4. GitHub Sponsors projects
  console.log('Fetching GitHub Sponsors...');
  try {
    const data = await fetch('https://api.github.com/search/repositories?q=sponsorable+in:login&sort=stars&order=desc&per_page=20');
    if (data.items) {
      for (const repo of data.items.slice(0, 10)) {
        results.leads.push({
          source: 'GitHub Sponsors',
          name: repo.full_name,
          need: 'Open source contribution - star count: ' + repo.stargazers_count,
          contact: repo.html_url + '/sponsor',
          budget: 'GitHub Sponsors tier',
          url: repo.html_url
        });
      }
    }
  } catch (e) {
    console.log('GitHub Sponsors error:', e.message);
  }

  // Deduplicate by URL
  const seen = new Set();
  results.leads = results.leads.filter(l => {
    if (!l.url) return true;
    if (seen.has(l.url)) return false;
    seen.add(l.url);
    return true;
  });

  // Save
  const outDir = 'C:\\Users\\Administrator\\.openclaw\\workspace\\outreach';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'deep-leads.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log('Saved', results.leads.length, 'leads to', outPath);
}

main().catch(console.error);
