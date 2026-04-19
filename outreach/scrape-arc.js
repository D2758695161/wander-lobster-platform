const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  // Arc.dev remote jobs for AI/ML engineers
  try {
    await page.goto('https://arc.dev/remote-jobs?search=AI+engineer', {timeout: 20000, waitUntil: 'domcontentloaded'});
    await page.waitForTimeout(3000);
    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href*="/jobs/"]')).slice(0, 15).map(el => ({
        text: el.textContent.trim().substring(0, 100),
        href: el.href
      }));
    });
    console.log('ARC_AI:' + JSON.stringify(jobs));
  } catch(e) {
    console.log('ARC_AI_ERR:' + e.message);
  }
  
  // GitHub API without auth
  try {
    await page.goto('https://api.github.com/search/issues?q=label:bounty+created:>=2026-04-09+is:issue+state:open&per_page=10&sort=created&order=desc', {timeout: 15000, waitUntil: 'domcontentloaded'});
    await page.waitForTimeout(2000);
    const content = await page.content();
    console.log('GH_API:' + content.substring(0, 3000));
  } catch(e) {
    console.log('GH_API_ERR:' + e.message);
  }
  
  // Try Toptal
  try {
    await page.goto('https://www.toptal.com/', {timeout: 15000, waitUntil: 'domcontentloaded'});
    await page.waitForTimeout(2000);
    const title = await page.title();
    console.log('TOPTAL_TITLE:' + title);
  } catch(e) {
    console.log('TOPTAL_ERR:' + e.message);
  }
  
  // Try gun.io
  try {
    await page.goto('https://gun.io/', {timeout: 15000, waitUntil: 'domcontentloaded'});
    await page.waitForTimeout(2000);
    const title = await page.title();
    console.log('GUNIO_TITLE:' + title);
  } catch(e) {
    console.log('GUNIO_ERR:' + e.message);
  }
  
  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
