const { chromium } = require('playwright');
const fs = require('fs');

async function research() {
  const results = {
    timestamp: new Date().toISOString(),
    sources: {},
    leads: [],
    errors: []
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    // 1. GitHub bounty search
    console.log('1. GitHub bounty search...');
    try {
      await page.goto('https://github.com/search?q=label%3Ahacktoberfest+OR+label%3Agood-first-issue+OR+label%3Areward&type=issues&s=updated&o=desc', { timeout: 30000, waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      const html = await page.content();
      // Look for issue links
      const ghMatches = html.match(/href="\/[^\/]+\/[^\/]+\/issues\/\d+"/g) || [];
      const uniqueMatches = [...new Set(ghMatches)].slice(0, 20);
      results.sources.github_issues = uniqueMatches.map(m => {
        const url = m.match(/href="([^"]+)"/)[1];
        return 'https://github.com' + url;
      });
      console.log(`  Found ${results.sources.github_issues.length} GitHub issue links`);
    } catch(e) {
      results.errors.push('GitHub: ' + e.message);
      results.sources.github_issues = [];
    }

    // 2. Product Hunt
    console.log('2. Product Hunt...');
    try {
      await page.goto('https://www.producthunt.com/', { timeout: 30000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(4000);
      const links = await page.evaluate(() => {
        const as = document.querySelectorAll('a[href*="/posts/"]');
        return [...new Set([...as].map(a => ({
          title: a.textContent.trim().slice(0, 80),
          url: 'https://producthunt.com' + a.getAttribute('href')
        })))].slice(0, 15);
      });
      results.sources.producthunt = links;
      console.log(`  Found ${links.length} Product Hunt links`);
    } catch(e) {
      results.errors.push('Product Hunt: ' + e.message);
      results.sources.producthunt = [];
    }

    // 3. GitHub Trending (new projects)
    console.log('3. GitHub Trending...');
    try {
      await page.goto('https://github.com/trending?since=daily', { timeout: 30000, waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      const trending = await page.evaluate(() => {
        const items = document.querySelectorAll('article.Box-row');
        return Array.from(items).slice(0, 15).map(el => {
          const titleEl = el.querySelector('h2 a');
          const descEl = el.querySelector('p');
          const langEl = el.querySelector('[itemprop="programmingLanguage"]');
          return {
            title: titleEl ? titleEl.textContent.trim().replace(/\s+/g, ' ').slice(0, 80) : '',
            desc: descEl ? descEl.textContent.trim().slice(0, 150) : '',
            lang: langEl ? langEl.textContent.trim() : '',
            url: titleEl ? 'https://github.com' + titleEl.getAttribute('href') : ''
          };
        }).filter(i => i.title);
      });
      results.sources.github_trending = trending;
      console.log(`  Found ${trending.length} trending repos`);
    } catch(e) {
      results.errors.push('GitHub Trending: ' + e.message);
      results.sources.github_trending = [];
    }

    // 4. HackerNews Who's Hiring
    console.log('4. HackerNews...');
    try {
      await page.goto('https://news.ycombinator.com/submitted?id=whoishiring', { timeout: 30000, waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);
      const hn = await page.evaluate(() => {
        const items = document.querySelectorAll('tr.athing');
        return Array.from(items).slice(0, 15).map(el => {
          const titleEl = el.querySelector('.titleline a');
          const subtextEl = el.querySelector('.subtext');
          return {
            title: titleEl ? titleEl.textContent.trim().slice(0, 100) : '',
            url: titleEl ? titleEl.getAttribute('href') : '',
            meta: subtextEl ? subtextEl.textContent.trim().slice(0, 80) : ''
          };
        }).filter(i => i.title);
      });
      results.sources.hackernews = hn;
      console.log(`  Found ${hn.length} HN posts`);
    } catch(e) {
      results.errors.push('HackerNews: ' + e.message);
      results.sources.hackernews = [];
    }

    // 5. RapidAPI explore
    console.log('5. RapidAPI...');
    try {
      await page.goto('https://rapidapi.com/', { timeout: 30000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      const rapidLinks = await page.evaluate(() => {
        const as = document.querySelectorAll('a[href*="/apis/"]');
        return [...new Set([...as].map(a => {
          const h = a.getAttribute('href');
          const text = a.textContent.trim();
          if (!h.includes('/apis/') || !text) return null;
          return { title: text.slice(0, 80), url: 'https://rapidapi.com' + h };
        }).filter(Boolean))].slice(0, 15);
      });
      results.sources.rapidapi = rapidLinks;
      console.log(`  Found ${rapidLinks.length} RapidAPI links`);
    } catch(e) {
      results.errors.push('RapidAPI: ' + e.message);
      results.sources.rapidapi = [];
    }

  } catch(e) {
    results.fatalError = e.message;
  }

  await browser.close();

  // Build actionable leads from raw data
  results.leads = buildLeads(results.sources);

  const outPath = 'C:\\Users\\Administrator\\.openclaw\\workspace\\outreach\\deep-leads.json';
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log('\nWritten to', outPath);
  console.log('Errors:', results.errors);
  return results;
}

function buildLeads(sources) {
  const leads = [];
  const seen = new Set();

  // From GitHub trending
  for (const repo of sources.github_trending || []) {
    const key = repo.url;
    if (seen.has(key)) continue;
    seen.add(key);
    leads.push({
      source: 'GitHub Trending',
      company: repo.title,
      description: repo.desc,
      language: repo.lang,
      contact: repo.url + '/issues/new',
      whatTheyNeed: 'Contributors, stars, feedback on new open source projects',
      expectedBudget: 'Open source - potentially negotiable for paid features/sponsor',
      action: 'Star the repo, submit PRs, open issues with feature suggestions'
    });
  }

  // From GitHub issue links
  for (const url of sources.github_issues || []) {
    if (seen.has(url)) continue;
    seen.add(url);
    leads.push({
      source: 'GitHub Issue Tracker',
      company: extractRepoName(url),
      description: '',
      contact: url,
      whatTheyNeed: 'Issue resolution, bug fixes, feature development',
      expectedBudget: 'Bounty/hacktoberfest rewards ($50-$500 typically)',
      action: 'Comment on issue, submit PR'
    });
  }

  // From HackerNews
  for (const post of sources.hackernews || []) {
    if (seen.has(post.url)) continue;
    seen.add(post.url);
    if (post.title.toLowerCase().includes('hire') || post.title.toLowerCase().includes('looking')) {
      leads.push({
        source: 'HackerNews Who is Hiring',
        company: extractCompanyHN(post.title),
        description: post.title,
        contact: post.url,
        whatTheyNeed: 'Freelance/contract development work',
        expectedBudget: 'Market rate (varies by project)',
        action: 'Reply to HN post, check comments for contact'
      });
    }
  }

  // From Product Hunt
  for (const item of sources.producthunt || []) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    leads.push({
      source: 'Product Hunt',
      company: item.title,
      description: 'New AI/developer tool seeking early users or contributors',
      contact: item.url,
      whatTheyNeed: 'Beta testers, integration partners, feedback',
      expectedBudget: 'Equity, credits, or negotiable',
      action: 'Sign up, offer integration help, provide feedback'
    });
  }

  // From RapidAPI
  for (const api of sources.rapidapi || []) {
    if (seen.has(api.url)) continue;
    seen.add(api.url);
    leads.push({
      source: 'RapidAPI',
      company: api.title,
      description: 'API provider seeking integration partners',
      contact: api.url,
      whatTheyNeed: 'No-code integration templates, documentation, wrapper code',
      expectedBudget: 'RapidAPI credits or revenue share',
      action: 'Apply to RapidAPI partner program'
    });
  }

  return leads;
}

function extractRepoName(url) {
  const parts = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
  return parts ? parts[1] : url;
}

function extractCompanyHN(title) {
  const m = title.match(/^\[.*?\]\s*(.+)/);
  return m ? m[1].trim().slice(0, 60) : title.slice(0, 60);
}

research().catch(console.error);
