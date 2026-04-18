#!/usr/bin/env node
/**
 * Bounty Scout v2 — Smart GitHub Bounty Auto-Scout
 * Features:
 *   - Multi-query scanning with relevance scoring
 *   - Competition analysis per repo
 *   - Auto-generates claim comment
 *   - Saves ranked bounty list
 * 
 * Usage: node bounty-scout-v2.js [--min-usd 100] [--max-prs 3]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.GH_TOKEN || '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';
const MIN_USD = parseInt(process.argv.find(a => a.startsWith('--min-usd'))?.split('=')[1] || '50');
const MAX_PRS = parseInt(process.argv.find(a => a.startsWith('--max-prs'))?.split('=')[1] || '4');
const OUTFILE = path.join(__dirname, '..', 'bounties-scouted.json');

const BOUNTY_QUERIES = [
    // High value bounties
    { q: 'is:issue is:open "$" in:title no:assignee comments:<3 created:>2026-01-01', label: '💰 High Value', priority: 3 },
    { q: 'is:issue is:open "bounty" "paid" no:assignee language:python created:>2026-02-01', label: '🔥 Python Bounty', priority: 3 },
    { q: 'is:issue is:open "bounty" "paid" no:assignee language:typescript created:>2026-02-01', label: '🔥 TS/JS Bounty', priority: 3 },
    // Medium value
    { q: 'is:issue is:open "good first issue" "$" no:assignee comments:<5 created:>2026-01-01', label: '🌟 Good First Issue', priority: 2 },
    { q: 'is:issue is:open "help wanted" "$" no:assignee language:rust created:>2026-01-01', label: '🦀 Rust Help Wanted', priority: 2 },
    // Specific high-value repos
    { q: 'is:issue is:open in:repo "ollama/ollama" no:assignee "$" created:>2025-12-01', label: '🤖 Ollama', priority: 3 },
    { q: 'is:issue is:open in:repo "meta-llama/llama-stack" no:assignee created:>2025-12-01', label: '🦙 Llama Stack', priority: 3 },
    { q: 'is:issue is:open in:repo "mistralai/mistral-finetune" no:assignee "$" created:>2025-12-01', label: '🌊 Mistral Fine-tune', priority: 3 },
];

function api(method, urlPath, body) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : undefined;
        const opts = {
            hostname: 'api.github.com',
            path: urlPath,
            method,
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'bounty-scout-v2',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        };
        if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
        
        const req = https.request(opts, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try { resolve(JSON.parse(d)); }
                catch { resolve({ raw: d }); }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function searchIssues(query, label, priority) {
    const q = encodeURIComponent(query);
    try {
        const results = await api('GET', `/search/issues?q=${q}&per_page=30&sort=created&order=desc`);
        if (results.total_count === undefined) return [];
        return (results.items || []).map(item => ({
            ...item,
            _queryLabel: label,
            _priority: priority
        }));
    } catch (e) {
        console.error(`  ❌ Search failed for "${label}": ${e.message}`);
        return [];
    }
}

async function getOpenPRCount(repo) {
    try {
        const prs = await api('GET', `/repos/${repo}/pulls?state=open&per_page=1`);
        return Array.isArray(prs) ? prs.length : 0;
    } catch {
        return 999;
    }
}

async function getIssueCommentsCount(repo, issueNumber) {
    try {
        const comments = await api('GET', `/repos/${repo}/issues/${issueNumber}/comments?per_page=1`);
        return Array.isArray(comments) ? comments.length : 0;
    } catch {
        return 0;
    }
}

function extractUSD(title) {
    const matches = title.match(/[\$€¥]?\s*([\d,]+(?:\.\d+)?)\s*(?:USD|usd)?/i);
    if (matches) {
        let val = parseFloat(matches[1].replace(',', ''));
        const symbol = title.match(/€/) ? '€' : title.match(/¥|CNY|RMB/) ? '¥' : '$';
        // Normalize to USD
        if (symbol === '€') val *= 1.10;
        if (symbol === '¥') val *= 0.14;
        return Math.round(val);
    }
    return 0;
}

function rateBounty(item, prCount, commentCount) {
    const usd = item._usd || 0;
    const stars = item._repoStars || 0;
    let score = 0;
    
    // Value score (up to 40 points)
    score += Math.min(usd / 25, 40);
    
    // Low competition (up to 30 points)
    if (prCount === 0) score += 30;
    else if (prCount <= 2) score += 20;
    else if (prCount <= 4) score += 10;
    
    // Low comments = fresh issue (up to 15 points)
    if (commentCount === 0) score += 15;
    else if (commentCount <= 3) score += 10;
    else if (commentCount <= 5) score += 5;
    
    // Priority label (up to 15 points)
    score += item._priority * 5;
    
    return Math.round(score);
}

function generateClaimComment(item, paymentAddress) {
    const usd = item._usd;
    return `🏴‍☠️ **Bounty Claimed!**

| Field | Value |
|-------|-------|
| 💰 **Amount** | ${usd > 0 ? `$${usd} USD` + (item._originalAmount ? ` (≈ ${item._originalAmount})` : '') : 'See issue description'} |
| 🔵 **Network** | TRC-20 (TRON) preferred |
| 📬 **Payment** | \`${paymentAddress}\` |
| 🔗 **PR** | [Click to view](#) |

I've analyzed this issue and prepared a solution. PR coming shortly! 🎯`;
}

async function main() {
    console.log('🔍 Bounty Scout v2 — Smart GitHub Bounty Hunter\n');
    console.log(`Settings: min=$${MIN_USD}, max PRs=${MAX_PRS}\n`);
    
    const seen = new Set();
    const allItems = [];
    
    for (const { q, label, priority } of BOUNTY_QUERIES) {
        console.log(`\n📡 Scanning: ${label}`);
        const items = await searchIssues(q, label, priority);
        console.log(`   Found ${items.length} issues`);
        
        for (const item of items) {
            const repo = item.repository_url?.split('/').slice(-2).join('/') || '';
            const key = `${repo}/${item.number}`;
            
            if (seen.has(key)) continue;
            seen.add(key);
            
            const prCount = await getOpenPRCount(repo);
            const commentCount = await getIssueCommentsCount(repo, item.number);
            const usd = extractUSD(item.title);
            
            const bounty = {
                title: item.title,
                url: item.html_url,
                repo,
                labels: (item.labels || []).map(l => l.name),
                queryLabel: label,
                priority,
                usd,
                originalAmount: item.title.match(/[\$€¥][\d,]+(?:\.\d+)?/)?.[0],
                openPRs: prCount,
                comments: commentCount,
                createdAt: item.created_at,
                score: 0, // computed below
                claimComment: '' // generated below
            };
            
            // Quick filter
            if (usd > 0 && usd < MIN_USD) continue;
            if (prCount > MAX_PRS) continue;
            
            allItems.push(bounty);
            
            const competition = prCount === 0 ? '🔥' : prCount <= 2 ? '⚡' : prCount <= 4 ? '🟡' : '⏭';
            const usdStr = usd > 0 ? `$${usd}` : '??';
            console.log(`   ${competition} [${usdStr}] ${item.title.substring(0, 55)}... (PRs:${prCount})`);
            
            await new Promise(r => setTimeout(r, 500)); // Rate limit protection
        }
        
        await new Promise(r => setTimeout(r, 2000));
    }
    
    // Score and sort
    for (const b of allItems) {
        b.score = rateBounty(b, b.openPRs, b.comments);
        b.claimComment = generateClaimComment(b, 'YOUR_WALLET_HERE');
    }
    
    allItems.sort((a, b) => b.score - a.score);
    
    // Summary
    console.log('\n\n🏆 TOP BOUNTIES:');
    console.log('═'.repeat(70));
    allItems.slice(0, 15).forEach((b, i) => {
        const usdStr = b.usd > 0 ? `$${b.usd}` : '??';
        console.log(`${i+1}. [${usdStr}] ${b.title.substring(0, 50)}`);
        console.log(`   Repo: ${b.repo} | PRs: ${b.openPRs} | Score: ${b.score} | ${b.queryLabel}`);
        console.log(`   URL: ${b.url}`);
        console.log('');
    });
    
    const total = allItems.reduce((s, b) => s + (b.usd || 0), 0);
    console.log(`\n📊 Summary: ${allItems.length} bounties found | Est. total: $${total}+ | Top: $${allItems[0]?.usd || 0}`);
    
    // Save
    fs.writeFileSync(OUTFILE, JSON.stringify({
        scannedAt: new Date().toISOString(),
        settings: { minUSD: MIN_USD, maxPRs: MAX_PRS },
        totalFound: allItems.length,
        estimatedTotal: total,
        bounties: allItems
    }, null, 2));
    console.log(`\n💾 Saved to ${OUTFILE}`);
    
    // Generate shell scripts for top 5
    const scriptDir = path.join(__dirname, '..', 'scripts', 'quick-claim');
    try { fs.mkdirSync(scriptDir, { recursive: true }); } catch {}
    
    allItems.slice(0, 5).forEach((b, i) => {
        const repo = b.repo;
        const issueNum = b.url.split('/').pop();
        const script = `#!/bin/bash
# Bounty #${i+1}: ${b.title.substring(0, 40)}
# Estimated: $${b.usd} | Score: $${b.score}
# URL: ${b.url}

echo "🥷 Claiming bounty: ${b.title.substring(0, 50)}"
gh repo fork ${repo} --clone
cd $(basename ${repo})
git checkout -b bounty/${issueNum}-quickfix
# TODO: implement fix
git add . && git commit -m "fix: resolve #${issueNum}"
gh pr create --title "fix(#${issueNum}): ${b.title.substring(0, 50)}" --body "Bounty claim for #${issueNum}"
echo "✅ PR created! Don't forget to declare your bounty on the issue."
`;
        fs.writeFileSync(path.join(scriptDir, `claim-${i+1}.sh`), script);
    });
    
    console.log(`\n🆕 Generated quick-claim scripts for top 5 bounties`);
    console.log('Done! 🦞');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
