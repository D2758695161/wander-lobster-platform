const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Product Hunt new AI tools
  console.log('Product Hunt...');
  try {
    await page.goto('https://www.producthunt.com', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(5000);
    const products = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-testid="post-card"], .posts&pageItem')).slice(0,12).map(el => ({
        name: el.querySelector('a:first-child, h3, .ph-ell')?.textContent?.trim()?.slice(0,60),
        tagline: el.querySelector('[data-testid="post-tagline"], .tagline, .subtitle')?.textContent?.trim()?.slice(0,100),
        url: el.querySelector('a[href*="/posts/"]')?.href || el.querySelector('a')?.href
      })).filter(r => r.name);
    });
    console.log(JSON.stringify(products));
  } catch(e) { console.log('ERR PH:', e.message); }

  // Also check PH directory for recently added
  console.log('\nProduct Hunt AI category...');
  try {
    await page.goto('https://www.producthunt.com/categories/artificial-intelligence', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(4000);
    const aiProducts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-testid="post-card"]')).slice(0,10).map(el => ({
        name: el.querySelector('a:first-child, h3')?.textContent?.trim()?.slice(0,60),
        tagline: el.querySelector('[data-testid="post-tagline"]')?.textContent?.trim()?.slice(0,100),
        url: el.querySelector('a[href*="/posts/"]')?.href
      })).filter(r => r.name);
    });
    console.log(JSON.stringify(aiProducts));
  } catch(e) { console.log('ERR PH-AI:', e.message); }

  await browser.close();
  console.log('DONE');
})();
