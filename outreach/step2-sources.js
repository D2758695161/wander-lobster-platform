const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Product Hunt API/landing
  console.log('=== Product Hunt ===');
  try {
    await page.goto('https://www.producthunt.com/posts.atom', { waitUntil: 'domcontentloaded', timeout: 15000 });
    const text = await page.evaluate(() => document.body?.innerText || '');
    console.log('PH Atom:', text?.slice(0,500));
  } catch(e) { console.log('ERR PH:', e.message); }

  // Try PH JSON API
  try {
    await page.goto('https://api.producthunt.com/v1/posts?sort=newest&per_page=10', { waitUntil: 'domcontentloaded', timeout: 15000 });
    const text = await page.evaluate(() => document.body?.innerText || '');
    console.log('PH API:', text?.slice(0,500));
  } catch(e) { console.log('ERR PH API:', e.message); }

  // Remotive
  console.log('\n=== Remotive ===');
  try {
    await page.goto('https://remotive.com/remote-jobs/software-dev', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.job-list-card, .job-card, .category-card')).slice(0,10).map(el => ({
        title: el.querySelector('.job-title, h2, a')?.textContent?.trim(),
        company: el.querySelector('.company-name, .company, .name')?.textContent?.trim(),
        url: el.querySelector('a')?.href
      })).filter(r => r.title);
    });
    console.log(JSON.stringify(jobs));
  } catch(e) { console.log('ERR Remotive:', e.message); }

  // JS Remotely
  console.log('\n=== JS Remotely ===');
  try {
    await page.goto('https://jsremotely.com/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.job, .job-item, .job-listing')).slice(0,10).map(el => ({
        title: el.querySelector('h3, .title, a')?.textContent?.trim(),
        company: el.querySelector('.company, .name')?.textContent?.trim(),
        url: el.querySelector('a')?.href
      })).filter(r => r.title);
    });
    console.log(JSON.stringify(jobs));
  } catch(e) { console.log('ERR JSRemotely:', e.message); }

  // Stack Overflow Jobs
  console.log('\n=== Stack Overflow Jobs ===');
  try {
    await page.goto('https://stackoverflow.com/jobs?q=bounty+or+reward&l=Remote', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.job-card, .-job')).slice(0,8).map(el => ({
        title: el.querySelector('.job-title, h2 a, a.-title')?.textContent?.trim(),
        company: el.querySelector('.company, .-company')?.textContent?.trim(),
        url: el.querySelector('a')?.href
      })).filter(r => r.title);
    });
    console.log(JSON.stringify(jobs));
  } catch(e) { console.log('ERR SO:', e.message); }

  // GitHub hacktoberfest tagged
  console.log('\n=== Hacktoberfest repos ===');
  try {
    await page.goto('https://github.com/search?q=label%3Ahacktoberfest+type%3Arepository&sort=updated&per_page=10', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const repos = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.repo-list-item, .Box-row')).slice(0,8).map(el => ({
        name: el.querySelector('h3 a')?.textContent?.trim(),
        desc: el.querySelector('.col-9')?.textContent?.trim()?.slice(0,100),
        url: el.querySelector('h3 a')?.href
      })).filter(r => r.name);
    });
    console.log(JSON.stringify(repos));
  } catch(e) { console.log('ERR HF:', e.message); }

  // Working Nomads
  console.log('\n=== Working Nomads ===');
  try {
    await page.goto('https://www.workingnomads.com/jobs?category=development&search=bounty', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelector('.job-list, #job-list, .jobs-list')?.querySelectorAll?.('li, .job-item') || []).slice(0,8).map(el => ({
        title: el.querySelector('h3, .title')?.textContent?.trim(),
        company: el.querySelector('.company, .name')?.textContent?.trim(),
        url: el.querySelector('a')?.href
      }));
    });
    console.log(JSON.stringify(jobs));
  } catch(e) { console.log('ERR Nomads:', e.message); }

  await browser.close();
  console.log('\nDONE');
})();
