const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  // RemoteOK engineer jobs
  try {
    await page.goto('https://remoteok.com/remote-engineer-jobs', {timeout: 20000, waitUntil: 'domcontentloaded'});
    await page.waitForTimeout(2000);
    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tr')).slice(0, 20).map(el => {
        const company = el.querySelector('.company')?.textContent?.trim() || '';
        const position = el.querySelector('.position')?.textContent?.trim() || '';
        const tags = Array.from(el.querySelectorAll('.tag')).map(t => t.textContent?.trim()).join(',');
        const link = el.querySelector('a')?.href || '';
        return {company, position, tags, link};
      }).filter(j => j.company);
    });
    console.log('REMOTEOK:' + JSON.stringify(jobs));
  } catch(e) {
    console.log('REMOTEOK_ERR:' + e.message);
  }
  
  // Arc.dev
  try {
    await page.goto('https://arc.dev/remote-jobs', {timeout: 20000, waitUntil: 'domcontentloaded'});
    await page.waitForTimeout(2000);
    const title = await page.title();
    console.log('ARC_TITLE:' + title);
    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href*="/jobs/"]')).slice(0, 10).map(el => ({
        text: el.textContent.trim().substring(0, 80),
        href: el.href
      }));
    });
    console.log('ARC_JOBS:' + JSON.stringify(jobs));
  } catch(e) {
    console.log('ARC_ERR:' + e.message);
  }
  
  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
