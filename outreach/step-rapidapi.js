const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = {};

  // RapidAPI discover
  console.log('=== RapidAPI ===');
  try {
    await page.goto('https://rapidapi.com/discover', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(4000);
    const apis = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.listing-card, .api-card, .col-3, .EndpointCard')).slice(0,12).map(el => ({
        name: el.querySelector('a, .name, h3')?.textContent?.trim(),
        desc: el.querySelector('p, .description, .card-text')?.textContent?.trim()?.slice(0,100),
        url: el.querySelector('a')?.href
      })).filter(r => r.name);
    });
    results.rapidapi = apis;
    console.log(JSON.stringify(apis));
  } catch(e) { console.log('ERR RapidAPI:', e.message); }

  // We Work Remotely
  console.log('\n=== We Work Remotely ===');
  try {
    await page.goto('https://weworkremotely.com/categories/remote-programming-jobs', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.job-brief, .job-card, .company-card')).slice(0,10).map(el => ({
        title: el.querySelector('h3, .title, a span')?.textContent?.trim(),
        company: el.querySelector('.company, .company-name, .company span')?.textContent?.trim(),
        url: el.querySelector('a')?.href
      })).filter(r => r.title);
    });
    results.weWorkRemotely = jobs;
    console.log(JSON.stringify(jobs));
  } catch(e) { console.log('ERR WWR:', e.message); }

  // Freelancer.com
  console.log('\n=== Freelancer.com ===');
  try {
    await page.goto('https://www.freelancer.com/freelance-software-development-jobs', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const fl = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.JobSearchCard, .freelancer-hover')).slice(0,10).map(el => ({
        title: el.querySelector('h3, .job-title')?.textContent?.trim(),
        budget: el.querySelector('.budget, .price')?.textContent?.trim(),
        url: el.querySelector('a')?.href
      })).filter(r => r.title);
    });
    results.freelancer = fl;
    console.log(JSON.stringify(fl));
  } catch(e) { console.log('ERR FL:', e.message); }

  // Upwork
  console.log('\n=== Upwork ===');
  try {
    await page.goto('https://www.upwork.com/freelance-jobs/software-Development/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const upwork = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.job-card, .upskill-section, .job-tile')).slice(0,10).map(el => ({
        title: el.querySelector('h3, .job-title, .job-path')?.textContent?.trim(),
        budget: el.querySelector('.budget, .rate')?.textContent?.trim(),
        url: el.querySelector('a')?.href
      })).filter(r => r.title);
    });
    results.upwork = upwork;
    console.log(JSON.stringify(upwork));
  } catch(e) { console.log('ERR Upwork:', e.message); }

  // GitHub trending (check for new popular repos that might need contributors)
  console.log('\n=== GitHub Trending ===');
  try {
    await page.goto('https://github.com/trending?since=weekly', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const trending = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.repo-list-item, .Box-row')).slice(0,10).map(el => ({
        name: el.querySelector('h3 a')?.textContent?.trim(),
        desc: el.querySelector('.col-9')?.textContent?.trim()?.slice(0,100),
        stars: el.querySelector('.pr-2')?.textContent?.trim(),
        url: 'https://github.com' + el.querySelector('h3 a')?.pathname
      })).filter(r => r.name);
    });
    results.githubTrending = trending;
    console.log(JSON.stringify(trending));
  } catch(e) { console.log('ERR trending:', e.message); }

  await browser.close();
  console.log('\n=== STEP-RAPIDAPI DONE ===');
})();
