const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  try {
    await page.goto('https://www.producthunt.com/', {timeout: 20000, waitUntil: 'domcontentloaded'});
    await page.waitForTimeout(3000);
    const items = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="/posts/"]');
      return Array.from(links).slice(0, 15).map(el => ({
        text: el.textContent.trim().substring(0, 100),
        href: el.href
      })).filter(i => i.text && i.href.includes('/posts/'));
    });
    console.log('PH_ITEMS:' + JSON.stringify(items.slice(0,10)));
  } catch(e) {
    console.log('PH_ERROR:' + e.message);
  }
  
  try {
    await page.goto('https://www.producthunt.com/topics/developer-tools', {timeout: 20000, waitUntil: 'domcontentloaded'});
    await page.waitForTimeout(3000);
    const items = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="/posts/"]');
      return Array.from(links).slice(0, 15).map(el => ({
        text: el.textContent.trim().substring(0, 100),
        href: el.href
      })).filter(i => i.text && i.href.includes('/posts/'));
    });
    console.log('PH_DEV:' + JSON.stringify(items.slice(0,10)));
  } catch(e) {
    console.log('PH_DEV_ERR:' + e.message);
  }
  
  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
