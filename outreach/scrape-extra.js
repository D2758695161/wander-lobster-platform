const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Product Hunt new tools
  console.log('=== PRODUCT HUNT ===');
  try {
    await page.goto('https://www.producthunt.com/', { timeout: 20000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const html = await page.content();
    const titleMatches = [];
    const regex = /href="\/posts\/([^"]+)"[^>]*>([^<]+)/g;
    let m;
    while ((m = regex.exec(html)) !== null && titleMatches.length < 10) {
      titleMatches.push(m);
    }
    const seen = new Set();
    titleMatches.forEach(m => {
      if (!seen.has(m[1])) {
        seen.add(m[1]);
        console.log(m[2].trim().slice(0,100));
      }
    });
  } catch(e) { console.log('PH error:', e.message); }

  // RapidAPI
  console.log('\n=== RAPIDAPI ===');
  try {
    await page.goto('https://rapidapi.com/discover', { timeout: 20000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const rapidHtml = await page.content();
    const apiMatches = [];
    const regex2 = /href="(\/[^\/]+\/[^\/]+\/[^\/"]+)"[^>]*>([^<]+)<\/a>/g;
    let m2;
    while ((m2 = regex2.exec(rapidHtml)) !== null && apiMatches.length < 20) {
      apiMatches.push(m2);
    }
    const seen2 = new Set();
    apiMatches.forEach(m => {
      const title = m[2].trim();
      if (!seen2.has(title) && title.length > 3 && title.length < 80) {
        seen2.add(title);
        console.log(title + ' | https://rapidapi.com' + m[1]);
      }
    });
  } catch(e) { console.log('Rapid error:', e.message); }
  
  // Freelance platforms status
  console.log('\n=== FREELANCE PLATFORMS ===');
  const platforms = [
    { name: 'Gun.io', url: 'https://gun.io' },
    { name: 'Toptal', url: 'https://toptal.com' },
    { name: 'Arc.dev', url: 'https://arc.dev' },
    { name: 'Upwork', url: 'https://upwork.com' },
    { name: 'Freelancer.com', url: 'https://freelancer.com' }
  ];
  for (const p of platforms) {
    try {
      const resp = await page.goto(p.url, { timeout: 10000, waitUntil: 'domcontentloaded' });
      console.log(p.name + ': ' + (resp ? resp.status() : 'unknown') + ' - ' + p.url);
    } catch(e) {
      console.log(p.name + ': BLOCKED - ' + p.url);
    }
  }
  
  await browser.close();
})().catch(console.error);
