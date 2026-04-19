const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Try Product Hunt
  console.log('=== PRODUCT HUNT ===');
  try {
    await page.goto('https://www.producthunt.com', { timeout: 15000 });
    await page.waitForTimeout(3000);
    const title = await page.title();
    console.log('Title:', title);
    // Try to find new products
    const products = await page.evaluate(() => {
      const items = document.querySelectorAll('[class*="post"]');
      return Array.from(items).slice(0, 5).map(el => el.innerText.slice(0, 100));
    });
    console.log('Products found:', products.length);
    console.log('First items:', products.slice(0, 3));
  } catch(e) {
    console.log('Product Hunt Error:', e.message.slice(0, 200));
  }

  // Try RapidAPI
  console.log('\n=== RAPIDAPI ===');
  try {
    await page.goto('https://rapidapi.com/discover', { timeout: 15000 });
    await page.waitForTimeout(2000);
    const title = await page.title();
    console.log('Title:', title);
    const apis = await page.evaluate(() => {
      const items = document.querySelectorAll('[class*="api"], [class*="endpoint"], [class*="collection"]');
      return Array.from(items).slice(0, 5).map(el => el.innerText.slice(0, 80));
    });
    console.log('APIs found:', apis.length);
  } catch(e) {
    console.log('RapidAPI Error:', e.message.slice(0, 200));
  }

  // Try Toptal
  console.log('\n=== TOPTAL ===');
  try {
    await page.goto('https://www.toptal.com/freelance', { timeout: 15000 });
    await page.waitForTimeout(2000);
    console.log('Title:', await page.title());
  } catch(e) {
    console.log('Toptal Error:', e.message.slice(0, 200));
  }

  // Try Upwork
  console.log('\n=== UPWORK ===');
  try {
    await page.goto('https://www.upwork.com', { timeout: 15000 });
    await page.waitForTimeout(2000);
    console.log('Title:', await page.title());
  } catch(e) {
    console.log('Upwork Error:', e.message.slice(0, 200));
  }

  await browser.close();
  console.log('\nDone');
})();
