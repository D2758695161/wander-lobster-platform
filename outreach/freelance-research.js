const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function addMoreLeads() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  // 1. Try RapidAPI marketplace
  console.log('Checking RapidAPI...');
  try {
    const page = await context.newPage();
    await page.goto('https://rapidapi.com/category/marketplace', { timeout: 25000 });
    await page.waitForTimeout(3000);
    const apiCount = await page.evaluate(() => {
      const count = document.querySelector('[data-testid=api-count]')?.textContent;
      return count || 'many';
    });
    
    // Try to find APIs that need integrations
    const categories = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-testid=category-card]');
      return Array.from(items).slice(0, 8).map(i => ({
        name: i.querySelector('h3')?.textContent?.trim() || '',
        url: i.querySelector('a')?.href || ''
      }));
    });
    
    console.log('Found categories:', categories.length);
    for (const cat of categories) {
      console.log('-', cat.name);
    }
    
    await page.close();
  } catch (e) {
    console.log('RapidAPI error:', e.message);
  }

  // 2. Try Arc.dev remote jobs
  console.log('Checking Arc.dev...');
  try {
    const page = await context.newPage();
    await page.goto('https://arc.dev/remote-jobs?skills=typescript,javascript,python&page=1', { timeout: 25000 });
    await page.waitForTimeout(3000);
    
    const jobs = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-testid=job-card]') || document.querySelectorAll('.job-card');
      return Array.from(items).slice(0, 10).map(item => ({
        title: item.querySelector('[data-testid=job-title]')?.textContent?.trim() || item.querySelector('h3')?.textContent?.trim() || '',
        company: item.querySelector('[data-testid=company-name]')?.textContent?.trim() || '',
        url: item.querySelector('a')?.href || ''
      }));
    });
    
    console.log('Found Arc jobs:', jobs.length);
    await page.close();
  } catch (e) {
    console.log('Arc.dev error:', e.message);
  }

  // 3. Try Wellfound (formerly AngelList)
  console.log('Checking Wellfound...');
  try {
    const page = await context.newPage();
    await page.goto('https://wellfound.com/jobs?ref=homepage&roles=1%2C2&types=0&s=1', { timeout: 25000 });
    await page.waitForTimeout(3000);
    
    const jobs = await page.evaluate(() => {
      const items = document.querySelectorAll('.job-card') || document.querySelectorAll('[data-testid=job-card]');
      return Array.from(items).slice(0, 10).map(item => ({
        title: item.querySelector('h3, .title')?.textContent?.trim() || '',
        company: item.querySelector('.company, .employer')?.textContent?.trim() || '',
        url: item.querySelector('a')?.href || ''
      }));
    });
    
    console.log('Found Wellfound jobs:', jobs.length);
    await page.close();
  } catch (e) {
    console.log('Wellfound error:', e.message);
  }

  // 4. Try RemoteOK directly
  console.log('Checking RemoteOK...');
  try {
    const page = await context.newPage();
    await page.goto('https://remoteok.com/remote-dev-jobs', { timeout: 25000 });
    await page.waitForTimeout(3000);
    
    const jobs = await page.evaluate(() => {
      const items = document.querySelectorAll('td.company');
      return Array.from(items).slice(0, 10).map(item => ({
        company: item.querySelector('h3')?.textContent?.trim() || '',
        position: item.closest('tr')?.dataset?.position || '',
        url: item.querySelector('a')?.href || ''
      }));
    });
    
    console.log('Found RemoteOK jobs:', jobs.length);
    await page.close();
  } catch (e) {
    console.log('RemoteOK error:', e.message);
  }

  // 5. Check if LinkedIn is accessible
  console.log('Checking LinkedIn Jobs...');
  try {
    const page = await context.newPage();
    await page.goto('https://www.linkedin.com/jobs/search/?keywords=AI%20developer&location=Remote', { timeout: 25000 });
    await page.waitForTimeout(3000);
    
    const jobs = await page.evaluate(() => {
      const items = document.querySelectorAll('.job-card-container') || document.querySelectorAll('.base-card');
      return Array.from(items).slice(0, 5).map(item => ({
        title: item.querySelector('.job-card-list__title')?.textContent?.trim() || '',
        company: item.querySelector('.job-card-container__company-name')?.textContent?.trim() || '',
        url: item.querySelector('a')?.href || ''
      }));
    });
    
    console.log('Found LinkedIn jobs:', jobs.length);
    await page.close();
  } catch (e) {
    console.log('LinkedIn error:', e.message);
  }

  // 6. Check Toptal
  console.log('Checking Toptal...');
  try {
    const page = await context.newPage();
    await page.goto('https://www.toptal.com/careers', { timeout: 25000 });
    await page.waitForTimeout(3000);
    console.log('Toptal careers page loaded');
    await page.close();
  } catch (e) {
    console.log('Toptal error:', e.message);
  }

  await browser.close();
  console.log('Done checking additional platforms');
}

addMoreLeads().catch(console.error);
