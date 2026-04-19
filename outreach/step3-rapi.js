const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // RapidAPI - try the API directly
  console.log('=== RapidAPI Hub ===');
  try {
    await page.goto('https://rapidapi.com/hub', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(4000);
    const content = await page.evaluate(() => ({
      title: document.title,
      text: document.body?.innerText?.slice(0, 1000),
      links: Array.from(document.querySelectorAll('a[href*="/api/"]')).slice(0,10).map(a => ({
        text: a.textContent?.trim(),
        href: a.href
      }))
    }));
    console.log(JSON.stringify(content, null, 2));
  } catch(e) { console.log('ERR:', e.message); }

  // RapidAPI AI APIs
  console.log('\n=== RapidAPI AI ===');
  try {
    await page.goto('https://rapidapi.com/category/ai', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(4000);
    const apis = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.api-container, .card, .listing-item')).slice(0,10).map(el => ({
        name: el.querySelector('h3, .title, a')?.textContent?.trim()?.slice(0,60),
        desc: el.querySelector('p, .desc')?.textContent?.trim()?.slice(0,100),
        url: el.querySelector('a')?.href
      })).filter(r => r.name);
    });
    console.log(JSON.stringify(apis));
  } catch(e) { console.log('ERR:', e.message); }

  // AngelList
  console.log('\n=== Wellfound (AngelList) ===');
  try {
    await page.goto('https://wellfound.com/remote-startups/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const startups = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.startup-card, .org-card, .col-4')).slice(0,10).map(el => ({
        name: el.querySelector('h3, .name, a')?.textContent?.trim(),
        desc: el.querySelector('p, .tagline, .description')?.textContent?.trim()?.slice(0,100),
        url: el.querySelector('a')?.href
      })).filter(r => r.name);
    });
    console.log(JSON.stringify(startups));
  } catch(e) { console.log('ERR Wellfound:', e.message); }

  // GitHub GraphQL - recently updated repos with "bounty" in description
  console.log('\n=== GitHub search: bounty in description ===');
  try {
    await page.goto('https://github.com/search?q=bounty+in%3Adescription&type=repositories&sort=stars&per_page=15', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(4000);
    const repos = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.repo-list-item, .Box-row')).slice(0,10).map(el => ({
        name: el.querySelector('h3 a')?.textContent?.trim(),
        desc: el.querySelector('.col-9')?.textContent?.trim()?.slice(0,120),
        stars: el.querySelector('.pr-2, [data-testid="stars"]')?.textContent?.trim(),
        url: el.querySelector('h3 a')?.href
      })).filter(r => r.name);
    });
    console.log(JSON.stringify(repos));
  } catch(e) { console.log('ERR:', e.message); }

  await browser.close();
  console.log('\nDONE');
})();
