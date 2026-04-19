const { chromium } = require('playwright');

async function searchGitHub() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];
  
  try {
    // Search 1: Bounty labeled issues in last 7 days
    console.log('Searching GitHub for bounty issues...');
    await page.goto('https://github.com/search?q=bounty+label%3Ahelp-wanted&type=issues&created=2026-04-07..2026-04-14&sort=created&order=desc', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    
    const items = await page.$$eval('.issue-list-item, .Box-row', els => els.slice(0, 15).map(el => {
      const titleEl = el.querySelector('.issue-title') || el.querySelector('a[itemprop="name"]') || el.querySelector('a') || el;
      const metaEl = el.querySelector('.f6') || el.querySelector('.text-small') || el;
      return {
        title: titleEl.innerText?.trim() || '',
        url: titleEl.href || '',
        meta: metaEl.innerText?.trim() || ''
      };
    }));
    results.push({ search: 'bounty_helpwanted_issues', count: items.length, items });
    console.log('Found bounty+help-wanted issues:', items.length);
    
    // Search 2: Grant/reward labels
    await page.goto('https://github.com/search?q=label%3Agrant+OR+label%3Areward+type%3Aissues&created=2026-04-07..2026-04-14&sort=created', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    const items2 = await page.$$eval('.issue-list-item, .Box-row', els => els.slice(0, 10).map(el => {
      const titleEl = el.querySelector('.issue-title') || el.querySelector('a[itemprop="name"]') || el.querySelector('a') || el;
      return { title: titleEl.innerText?.trim() || '', url: titleEl.href || '' };
    }));
    results.push({ search: 'grant_reward_issues', count: items2.length, items: items2 });
    console.log('Found grant/reward issues:', items2.length);
    
    // Search 3: Help wanted in AI/ML repos
    await page.goto('https://github.com/search?q=label%3Ahelp-wanted+AI+OR+ML+OR+agent&type=repositories&created=2026-04-07..2026-04-14', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    const items3 = await page.$$eval('.repo-list-item, .Box-row', els => els.slice(0, 10).map(el => {
      const nameEl = el.querySelector('.repo-list-item .h3') || el.querySelector('a[itemprop="name"]') || el.querySelector('.f3') || el;
      const descEl = el.querySelector('.col-12') || el;
      return { name: nameEl.innerText?.trim() || '', desc: descEl.innerText?.trim()?.slice(0, 100) || '', url: nameEl.href || '' };
    }));
    results.push({ search: 'ai_helpwanted_repos', count: items3.length, items: items3 });
    console.log('Found AI help-wanted repos:', items3.length);
    
  } catch(e) {
    console.error('GitHub search error:', e.message);
  }
  
  await browser.close();
  return results;
}

async function searchProductHunt() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];
  
  try {
    console.log('Searching Product Hunt...');
    await page.goto('https://www.producthunt.com/posts?sort=top&category=developer-tools', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);
    
    const items = await page.$$eval('[data-test="post-card"]', els => els.slice(0, 12).map(el => {
      const titleEl = el.querySelector('[data-test="post-title"]') || el.querySelector('h3') || el;
      const descEl = el.querySelector('[data-test="post-tagline"]') || el.querySelector('.text-lg') || el;
      const votesEl = el.querySelector('[data-test="vote-count"]') || el;
      return {
        title: titleEl.innerText?.trim() || '',
        desc: descEl.innerText?.trim() || '',
        votes: votesEl.innerText?.trim() || '',
        url: el.querySelector('a')?.href || ''
      };
    }));
    results.push({ source: 'producthunt', category: 'developer-tools', count: items.length, items });
    console.log('Product Hunt dev tools found:', items.length);
    
  } catch(e) {
    console.error('Product Hunt error:', e.message);
  }
  
  await browser.close();
  return results;
}

async function searchGitHubSponsors() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];
  
  try {
    console.log('Searching GitHub Sponsors...');
    await page.goto('https://github.com/sponsors/explore/top-maintainers?type=recent', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);
    
    const items = await page.$$eval('.d-table, .Box-row', els => els.slice(0, 12).map(el => {
      const nameEl = el.querySelector('.f4') || el.querySelector('a') || el;
      const descEl = el.querySelector('.text-small') || el;
      return {
        name: nameEl.innerText?.trim() || '',
        desc: descEl.innerText?.trim()?.slice(0, 100) || '',
        url: el.querySelector('a')?.href || ''
      };
    }));
    results.push({ source: 'github-sponsors', count: items.length, items });
    console.log('GitHub Sponsors found:', items.length);
    
  } catch(e) {
    console.error('GitHub Sponsors error:', e.message);
  }
  
  await browser.close();
  return results;
}

async function searchRapidAPI() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];
  
  try {
    console.log('Searching RapidAPI...');
    await page.goto('https://rapidapi.com/discover', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);
    
    // Search for new APIs
    const searchBtn = await page.$('input[type="search"], input[placeholder*="Search"]');
    if (searchBtn) {
      await searchBtn.fill('AI ');
      await page.waitForTimeout(2000);
    }
    
    const items = await page.$$eval('.listing-card, .api-card, [data-test="api-card"]', els => els.slice(0, 10).map(el => {
      const nameEl = el.querySelector('h3') || el.querySelector('.f4') || el;
      const priceEl = el.querySelector('.price, .text-green') || el;
      return {
        name: nameEl?.innerText?.trim() || '',
        price: priceEl?.innerText?.trim() || '',
        url: el.querySelector('a')?.href || ''
      };
    }));
    results.push({ source: 'rapidapi', count: items.length, items });
    console.log('RapidAPI results found:', items.length);
    
  } catch(e) {
    console.error('RapidAPI error:', e.message);
  }
  
  await browser.close();
  return results;
}

async function searchFreelancePlatforms() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];
  
  const platforms = [
    { name: 'gunio', url: 'https://gun.io' },
    { name: 'lanceyio', url: 'https://lancey.io' },
    { name: 'toptal', url: 'https://toptal.com' }
  ];
  
  for (const p of platforms) {
    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(1000);
      const title = await page.title();
      results.push({ platform: p.name, url: p.url, status: 'accessible', title });
      console.log(`${p.name}: accessible`);
    } catch(e) {
      results.push({ platform: p.name, url: p.url, status: 'blocked', error: e.message.slice(0, 100) });
      console.log(`${p.name}: blocked`);
    }
  }
  
  await browser.close();
  return results;
}

async function main() {
  console.log('=== Starting Lead Research ===');
  
  const githubResults = await searchGitHub();
  const phResults = await searchProductHunt();
  const sponsorsResults = await searchGitHubSponsors();
  const rapidapiResults = await searchRapidAPI();
  const freelanceResults = await searchFreelancePlatforms();
  
  const output = {
    research_date: new Date().toISOString(),
    sources: {
      github: githubResults,
      producthunt: phResults,
      github_sponsors: sponsorsResults,
      rapidapi: rapidapiResults,
      freelance_platforms: freelanceResults
    }
  };
  
  const fs = require('fs');
  fs.writeFileSync('C:/Users/Administrator/.openclaw/workspace/outreach/raw_research.json', JSON.stringify(output, null, 2));
  console.log('\n=== Research Complete ===');
  console.log('Saved to outreach/raw_research.json');
}

main().catch(console.error);
