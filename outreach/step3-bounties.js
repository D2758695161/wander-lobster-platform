const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Google search: open source bounty programs 2026
  console.log('Google: open source bounty programs...');
  try {
    await page.goto('https://www.google.com/search?q=open+source+bounty+program+github+2026&num=10', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const results = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.g')).slice(0,8).map(el => ({
        title: el.querySelector('h3')?.textContent?.trim(),
        url: el.querySelector('a')?.href,
        snippet: el.querySelector('.VwiC3b, span.st')?.textContent?.trim()?.slice(0,150)
      })).filter(r => r.title);
    });
    console.log(JSON.stringify(results));
  } catch(e) { console.log('ERR:', e.message); }

  // GitHub explore - sponsor projects
  console.log('\nGitHub Sponsors explore...');
  try {
    await page.goto('https://github.com/sponsors', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(4000);
    const sponsors = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.d-table, .col-12')).slice(0,10).map(el => ({
        name: el.querySelector('a, .f4')?.textContent?.trim(),
        url: el.querySelector('a')?.href,
        desc: el.querySelector('.text-small, .col-9')?.textContent?.trim()?.slice(0,100)
      })).filter(r => r.name);
    });
    console.log(JSON.stringify(sponsors));
  } catch(e) { console.log('ERR sponsors:', e.message); }

  // RemoteOK
  console.log('\nRemoteOK AI jobs...');
  try {
    await page.goto('https://remoteok.com/remote-ai-jobs', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(3000);
    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tr.job, td.company, .job-header')).slice(0,10).map(el => ({
        title: el.querySelector('h2, .position, a')?.textContent?.trim(),
        company: el.querySelector('.company-name, .company, td:nth-child(2)')?.textContent?.trim(),
        url: el.querySelector('a')?.href
      })).filter(r => r.title);
    });
    console.log(JSON.stringify(jobs));
  } catch(e) { console.log('ERR:', e.message); }

  await browser.close();
  console.log('DONE');
})();
