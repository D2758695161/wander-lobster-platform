const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = {};

  // GitHub API search for bounty labeled repos
  console.log('=== GitHub API: bounty repos ===');
  try {
    const resp = await page.goto('https://api.github.com/search/repositories?q=bounty+label:bounty&sort=updated&per_page=15&type=Repositories', {
      waitUntil: 'domcontentloaded', timeout: 20000
    });
    await page.waitForTimeout(3000);
    const text = await page.evaluate(() => document.body?.innerText || '');
    try {
      const data = JSON.parse(text);
      const repos = (data.items || []).slice(0,10).map(r => ({
        name: r.full_name,
        desc: r.description,
        stars: r.stargazers_count,
        url: r.html_url,
        language: r.language
      }));
      results.githubBounty = repos;
      console.log(JSON.stringify(repos));
    } catch(e) {
      console.log('Parse error:', e.message, text?.slice(0,200));
    }
  } catch(e) { console.log('ERR:', e.message); }

  // GitHub API: issues with bounty label
  console.log('\n=== GitHub API: bounty issues ===');
  try {
    await page.goto('https://api.github.com/search/issues?q=label:bounty+type:issue&sort=updated&per_page=10', {
      waitUntil: 'domcontentloaded', timeout: 20000
    });
    await page.waitForTimeout(3000);
    const text = await page.evaluate(() => document.body?.innerText || '');
    try {
      const data = JSON.parse(text);
      const issues = (data.items || []).slice(0,8).map(i => ({
        title: i.title?.slice(0,80),
        repo: i.repository_url?.replace('https://api.github.com/repos/',''),
        url: i.html_url,
        state: i.state,
        body: i.body?.slice(0,200)
      }));
      results.githubBountyIssues = issues;
      console.log(JSON.stringify(issues));
    } catch(e) {
      console.log('Parse error:', text?.slice(0,200));
    }
  } catch(e) { console.log('ERR:', e.message); }

  // Google search for bounty programs
  console.log('\n=== Google: bounty + reward programs ===');
  try {
    await page.goto('https://www.google.com/search?q=github+open+source+bounty+reward+program+2026&num=8', {
      waitUntil: 'domcontentloaded', timeout: 20000
    });
    await page.waitForTimeout(3000);
    const items = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.g')).slice(0,8).map(el => ({
        title: el.querySelector('h3')?.textContent?.trim(),
        link: el.querySelector('a')?.href,
        snippet: el.querySelector('.VwiC3b')?.textContent?.trim()?.slice(0,150)
      })).filter(r => r.title);
    });
    results.googleBounty = items;
    console.log(JSON.stringify(items));
  } catch(e) { console.log('ERR Google:', e.message); }

  // HackerNews who's hiring
  console.log('\n=== HackerNews Hiring ===');
  try {
    await page.goto('https://news.ycombinator.com/submitted?id=whoishiring', {
      waitUntil: 'domcontentloaded', timeout: 20000
    });
    await page.waitForTimeout(3000);
    const hn = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.titleline, .itemlist tr')).slice(0,10).map(el => ({
        title: el.querySelector('.titleline a')?.textContent?.trim(),
        url: el.querySelector('.titleline a')?.href
      })).filter(r => r.title);
    });
    results.hackerNews = hn;
    console.log(JSON.stringify(hn));
  } catch(e) { console.log('ERR HN:', e.message); }

  await browser.close();
  console.log('\n=== STEP-API DONE ===');
})();
