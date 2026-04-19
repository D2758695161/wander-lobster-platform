const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TOKEN = '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';
const OUT = path.join(__dirname, 'deep-leads.json');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    extraHTTPHeaders: {
      'Authorization': `token ${TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  const results = {
    researchedAt: new Date().toISOString(),
    bountyRepos: [],
    productHuntTools: [],
    githubSponsors: [],
    rapidApiOpportunities: [],
    freelancePlatforms: []
  };

  // 1. GitHub bounty/reward repos
  try {
    console.log('Checking GitHub bounty labels...');
    const ghSearch = await context.newPage();
    await ghSearch.goto('https://github.com/search?q=bounty+label%3Abounty&type=repositories&sort=updated&since=2026-04-02', { timeout: 15000 });
    await ghSearch.waitForTimeout(3000);
    const bountyText = await ghSearch.content();
    
    // Extract repo names from search results
    const repoMatches = bountyText.match(/href="\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+"/g) || [];
    const uniqueRepos = [...new Set(repoMatches)].slice(0, 20);
    results.bountyRepos = uniqueRepos.map(m => {
      const match = m.match(/href="\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+)"/);
      return match ? { name: match[1], source: 'github', addedRecently: true } : null;
    }).filter(Boolean);
    await ghSearch.close();
    console.log(`Found ${results.bountyRepos.length} bounty repos`);
  } catch(e) {
    console.log('GitHub bounty search error:', e.message);
  }

  // 2. Product Hunt developer/AI tools
  try {
    console.log('Checking Product Hunt...');
    const phPage = await context.newPage();
    await phPage.goto('https://www.producthunt.com/topics/developer-tools', { timeout: 15000 });
    await phPage.waitForTimeout(3000);
    const phContent = await phPage.content();
    // Extract product names and descriptions
    const phMatches = phContent.match(/"name":"([^"]+)"/g) || [];
    const phDescriptions = phContent.match(/"tagline":"([^"]+)"/g) || [];
    results.productHuntTools = phMatches.slice(0, 15).map((m, i) => {
      const name = m.match(/"name":"([^"]+)"/)[1];
      const desc = (phDescriptions[i] || '').match(/"tagline":"([^"]+)"/)?.[1] || '';
      return { name, tagline: desc, source: 'producthunt', category: 'developer-tools' };
    });
    await phPage.close();
    console.log(`Found ${results.productHuntTools.length} Product Hunt tools`);
  } catch(e) {
    console.log('Product Hunt error:', e.message);
  }

  // 3. GitHub Sponsors
  try {
    console.log('Checking GitHub Sponsors...');
    const sponsorsPage = await context.newPage();
    await sponsorsPage.goto('https://github.com/sponsors/explore', { timeout: 15000 });
    await sponsorsPage.waitForTimeout(3000);
    const sponsorsContent = await sponsorsPage.content();
    const sponsorMatches = sponsorsContent.match(/href="\/sponsors\/([a-zA-Z0-9_-]+)"/g) || [];
    const uniqueSponsors = [...new Set(sponsorMatches)].slice(0, 20);
    results.githubSponsors = uniqueSponsors.map(m => {
      const match = m.match(/href="\/sponsors\/([a-zA-Z0-9_-]+)"/);
      return match ? { username: match[1], source: 'github-sponsors' } : null;
    }).filter(Boolean);
    await sponsorsPage.close();
    console.log(`Found ${results.githubSponsors.length} sponsors`);
  } catch(e) {
    console.log('GitHub Sponsors error:', e.message);
  }

  // 4. RapidAPI
  try {
    console.log('Checking RapidAPI...');
    const rapidPage = await context.newPage();
    await rapidPage.goto('https://rapidapi.com/discover', { timeout: 15000 });
    await rapidPage.waitForTimeout(3000);
    const rapidContent = await rapidPage.content();
    const apiMatches = rapidContent.match(/"name":"([^"]+)"/g) || [];
    results.rapidApiOpportunities = apiMatches.slice(0, 15).map(m => {
      const name = m.match(/"name":"([^"]+)"/)[1];
      return { name, source: 'rapidapi', opportunity: 'integration developer needed' };
    });
    await rapidPage.close();
    console.log(`Found ${results.rapidApiOpportunities.length} RapidAPI items`);
  } catch(e) {
    console.log('RapidAPI error:', e.message);
  }

  // 5. Freelance platforms
  const freelancePlatforms = [
    { name: 'Toptal', url: 'https://www.toptal.com', status: 'open' },
    { name: 'Gun.io', url: 'https://gun.io', status: 'check' },
    { name: 'Arc.dev', url: 'https://arc.dev', status: 'check' },
    { name: 'Stealth.sh', url: 'https://stealth.sh', status: 'check' },
    { name: 'Latium.org', url: 'https://latium.org', status: 'check' },
  ];
  results.freelancePlatforms = freelancePlatforms;

  await browser.close();

  fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
  console.log('Results saved to', OUT);
  console.log(JSON.stringify(results, null, 2));
}

run().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
