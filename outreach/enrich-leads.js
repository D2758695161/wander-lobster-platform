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
        catch(e) { resolve(data); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const outDir = 'C:\\Users\\Administrator\\.openclaw\\workspace\\outreach';
  let results;
  
  // Read existing leads
  const existingPath = path.join(outDir, 'deep-leads.json');
  if (fs.existsSync(existingPath)) {
    results = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  } else {
    results = { timestamp: new Date().toISOString(), leads: [] };
  }

  const existingCount = results.leads.length;

  // 1. Search for more bounty/reward labels
  const bountyLabels = ['bounty', 'reward', 'paid', ' MonetaryReward', 'hacktoberfest', 'good-first-issue'];
  
  for (const label of bountyLabels) {
    try {
      console.log(`Searching GitHub for label:${label}...`);
      const data = await fetch(`https://api.github.com/search/issues?q=label:${encodeURIComponent(label)}+created:>2026-03-29&per_page=10&sort=created`);
      if (data.items) {
        console.log(`  Found ${data.items.length} issues with label:${label}`);
        for (const issue of data.items) {
          const repoName = issue.repository_url?.split('/').slice(-2).join('/') || 'Unknown';
          const url = issue.html_url;
          
          // Skip if already have this URL
          if (results.leads.some(l => l.url === url)) continue;
          
          results.leads.push({
            source: 'GitHub ' + label.charAt(0).toUpperCase() + label.slice(1),
            name: repoName,
            need: issue.title,
            contact: url,
            budget: label === 'hacktoberfest' ? 'Hacktoberfest rewards' : 'Bounty (check issue)',
            url: url,
            created: issue.created_at
          });
        }
      }
    } catch (e) {
      console.log(`Error with label ${label}:`, e.message);
    }
  }

  // 2. Search for repos with recent releases that might need help
  try {
    console.log('Searching for popular repos needing contributions...');
    const data = await fetch('https://api.github.com/search/repositories?q=pushed:>2026-04-01+stars:>100&sort=updated&per_page=20');
    if (data.items) {
      for (const repo of data.items.slice(0, 10)) {
        const url = repo.html_url;
        if (results.leads.some(l => l.url === url)) continue;
        
        results.leads.push({
          source: 'Active GitHub Repo',
          name: repo.full_name,
          need: `Open source contribution needed - ${repo.stargazers_count} stars, pushed ${repo.pushed_at}`,
          contact: url + '/issues',
          budget: 'Volunteer / negotiate',
          url: url
        });
      }
    }
  } catch (e) {
    console.log('Error searching repos:', e.message);
  }

  // 3. Search for AI/ML projects that might need help
  try {
    console.log('Searching for AI/ML projects...');
    const data = await fetch('https://api.github.com/search/repositories?q=AI+OR+ML+OR+GPT+OR+LLM+created:>2026-01-01+stars:>50&sort=stars&per_page=15');
    if (data.items) {
      for (const repo of data.items.slice(0, 8)) {
        const url = repo.html_url;
        if (results.leads.some(l => l.url === url)) continue;
        
        results.leads.push({
          source: 'AI/ML Project',
          name: repo.full_name,
          need: `AI tool development - ${repo.description || 'No description'}`,
          contact: url + '/issues',
          budget: 'Volunteer / equity / negotiate',
          url: url
        });
      }
    }
  } catch (e) {
    console.log('Error searching AI repos:', e.message);
  }

  // Deduplicate by URL
  const seen = new Set();
  results.leads = results.leads.filter(l => {
    if (!l.url) return true;
    if (seen.has(l.url)) return false;
    seen.add(l.url);
    return true;
  });

  results.timestamp = new Date().toISOString();
  results.summary = {
    total_leads: results.leads.length,
    new_leads: results.leads.length - existingCount,
    sources: [...new Set(results.leads.map(l => l.source))],
    top_sources: Object.entries(
      results.leads.reduce((acc, l) => {
        acc[l.source] = (acc[l.source] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }))
  };

  fs.writeFileSync(existingPath, JSON.stringify(results, null, 2));
  console.log('\\n=== Summary ===');
  console.log(`Total leads: ${results.leads.length} (${results.leads.length - existingCount} new)`);
  console.log('Top sources:', results.summary.top_sources.map(s => `${s.name} (${s.count})`).join(', '));
  console.log('Saved to', existingPath);
}

main().catch(console.error);
