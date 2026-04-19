const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  // Try GitHub bounty search
  try {
    await page.goto('https://github.com/search?q=label%3Abounty+created%3A%3E%3D2026-04-09+is%3Aissue+state%3Aopen&type=issues&s=created&order=desc', {timeout: 20000, waitUntil: 'domcontentloaded'});
    await page.waitForTimeout(2000);
    const items = await page.evaluate(() => {
      const repos = document.querySelectorAll('.issue-list-item');
      return Array.from(repos).slice(0, 15).map(el => {
        const title = el.querySelector('.f4')?.textContent?.trim() || '';
        const meta = el.querySelector('.mt-1')?.textContent?.trim() || '';
        const link = el.querySelector('a')?.getAttribute('href') || '';
        return {title, meta, link};
      });
    });
    console.log('GH_BOUNTY:' + JSON.stringify(items));
  } catch(e) {
    console.log('GH_BOUNTY_ERR:' + e.message);
  }
  
  // Try bountydotnew
  try {
    await page.goto('https://bounty.new/', {timeout: 20000, waitUntil: 'domcontentloaded'});
    await page.waitForTimeout(2000);
    const bdn = await page.evaluate(() => {
      const items = document.querySelectorAll('a[href*="/issue/"]');
      return Array.from(items).slice(0, 10).map(el => ({
        text: el.textContent.trim().substring(0, 100),
        href: el.href
      }));
    });
    console.log('BDN_ITEMS:' + JSON.stringify(bdn));
  } catch(e) {
    console.log('BDN_ERR:' + e.message);
  }
  
  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
