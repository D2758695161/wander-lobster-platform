const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  // 1. GitHub search for bounty labeled repos
  console.log('GitHub bounty repos...');
  try {
    await page.goto('https://github.com/search?q=bounty+label%3Abounty&type=repositories&sort=updated&per_page=15', {
      waitUntil: 'domcontentloaded', timeout: 20000
    });
    await page.waitForTimeout(4000);
    const repos = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.repo-list-item, .Box-row')).slice(0,10).map(el => ({
        name: el.querySelector('h3 a, .qa-entity-name a')?.textContent?.trim(),
        desc: el.querySelector('.col-9, .pr-4')?.textContent?.trim()?.slice(0,120),
        stars: el.querySelector('[data-testid="stars"], .pr-2 a')?.textContent?.trim(),
        url: el.querySelector('h3 a, .qa-entity-name a')?.href
      })).filter(r => r.name);
    });
    console.log(JSON.stringify(repos));
  } catch(e) { console.log('ERR:', e.message); }

  // 2. GitHub issues with bounty labels
  console.log('\nGitHub bounty issues...');
  try {
    await page.goto('https://github.com/search?q=label%3Abounty+type%3Aissue&type=issues&sort=updated&per_page=10', {
      waitUntil: 'domcontentloaded', timeout: 20000
    });
    await page.waitForTimeout(3000);
    const issues = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.issue-list-item, .Box-row')).slice(0,8).map(el => ({
        title: el.querySelector('h3 a, .issue-title')?.textContent?.trim()?.slice(0,80),
        repo: el.querySelector('.text-small, .f1-light')?.textContent?.trim(),
        url: el.querySelector('h3 a')?.href,
        labels: el.querySelectorAll('[href*="label"]').length
      })).filter(r => r.title);
    });
    console.log(JSON.stringify(issues));
  } catch(e) { console.log('ERR:', e.message); }

  await browser.close();
  console.log('DONE');
})();
