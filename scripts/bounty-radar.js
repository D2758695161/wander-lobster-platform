/**
 * Bounty Radar - GitHub Bounty Scanner
 * Scans GitHub for open bounties and opportunities
 */

const https = require('https');

const TOKEN = process.env.GH_TOKEN || 'YOUR_GITHUB_TOKEN';
const PAYMENT_ADDRESS = process.env.PAYMENT_ADDRESS || 'YOUR_WALLET_ADDRESS';
const OWNER = 'D2758695161';

const BOUNTY_QUERIES = [
    'is:issue is:open "$" in:title bounty',
    'is:issue is:open "bounty" label:"bounty" no:assignee',
    'is:issue is:open "paid" in:title "good first issue"'
];

function api(method, path, body) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : undefined;
        const opts = {
            hostname: 'api.github.com',
            path,
            method,
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'bounty-radar'
            }
        };
        if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
        
        const req = https.request(opts, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try { resolve(JSON.parse(d)); }
                catch { resolve(d); }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function searchBounties(query) {
    try {
        const results = await api('GET', `/search/issues?q=${encodeURIComponent(query)}&per_page=20&sort=created&order=desc`);
        return results.items || [];
    } catch(e) {
        console.error('Search error:', e.message);
        return [];
    }
}

async function checkExistingPRs(repo, issueNumber) {
    try {
        const prs = await api('GET', `/repos/${repo}/pulls?state=open&per_page=5`);
        return prs.length || 0;
    } catch {
        return 0;
    }
}

async function main() {
    console.log('🔍 Bounty Radar scanning...\n');
    
    const allBounties = [];
    
    for (const query of BOUNTY_QUERIES) {
        console.log(`Searching: ${query}`);
        const results = await searchBounties(query);
        
        for (const issue of results) {
            // Extract dollar amount
            const match = issue.title.match(/\$[\d,]+/);
            const amount = match ? match[0] : 'Unspecified';
            
            // Check competition
            const prCount = await checkExistingPRs(issue.repository_url.split('/').slice(-2).join('/'), issue.number);
            
            console.log(`  [${amount}] ${issue.title.substring(0, 60)}... (${prCount} existing PRs)`);
            
            if (prCount < 3) {
                allBounties.push({
                    title: issue.title,
                    url: issue.html_url,
                    amount,
                    competition: prCount,
                    repo: issue.repository_url
                });
            }
        }
        
        await new Promise(r => setTimeout(r, 1000)); // Rate limit
    }
    
    console.log(`\n✅ Found ${allBounties.length} low-competition bounties`);
    
    // Save results
    const fs = require('fs');
    fs.writeFileSync('bounties-found.json', JSON.stringify(allBounties, null, 2));
    console.log('Saved to bounties-found.json');
}

main().catch(console.error);
