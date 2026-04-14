/**
 * Algora Bounty Scout v1.0
 * Scans Algora.io bounty listings — a rising GitHub bounty platform
 * 
 * Algora.io features:
 * - Real-time bounty listings with USD amounts
 * - Tiered bounties (beginner-friendly, standard, premium)
 * - GitHub App integration for automatic PR rewards
 * - Leaderboard with FNDRY-like incentives
 * 
 * Usage:
 *   node scripts/algora-scout.js [minReward] [maxReward]
 *   node scripts/algora-scout.js 100 5000
 *   node scripts/algora-scout.js 500   # show bounties >= $500
 */

const MIN_REWARD = parseInt(process.argv[2] || '0');
const MAX_REWARD = parseInt(process.argv[3] || '999999');

const TIER_COLORS = {
  'beginner': '#4ECDC4',    // cyan — good first issues
  'standard': '#FF6B35',    // orange — regular bounties
  'premium': '#FFD93D',     // gold — high value
  'urgent': '#FF4444',      // red — time-sensitive
};

function formatReward(reward) {
  if (reward >= 1000) return `$${(reward/1000).toFixed(0)}K`;
  return `$${reward}`;
}

function scoreBounty(bounty) {
  let score = 0;
  // Reward score
  score += Math.min(bounty.rewardUSD / 100, 40);
  // Recent activity bonus
  if (bounty.updatedAt) {
    const daysAgo = (Date.now() - new Date(bounty.updatedAt).getTime()) / (1000*60*60*24);
    if (daysAgo < 1) score += 15;
    else if (daysAgo < 3) score += 10;
    else if (daysAgo < 7) score += 5;
  }
  // Engagement bonus
  score += Math.min(bounty.commentCount * 0.5, 10);
  // Tier bonus
  if (bounty.tier === 'premium') score += 10;
  if (bounty.tier === 'urgent') score += 8;
  return Math.round(score * 10) / 10;
}

async function fetchAlgoraBounties() {
  const results = [];
  
  // Algora public API endpoints
  // Note: Algora doesn't have a documented public API, we scrape their public bounty listings
  const sources = [
    { name: 'algora-active', url: 'https://console.algora.io/api/bounties?status=active&limit=50' },
    { name: 'algora-frontend', url: 'https://console.algora.io/api/bounties?status=active&tags=frontend&limit=30' },
    { name: 'algora-backend', url: 'https://console.algora.io/api/bounties?status=active&tags=backend&limit=30' },
    { name: 'algora-ai', url: 'https://console.algora.io/api/bounties?status=active&tags=ai&limit=30' },
  ];

  for (const source of sources) {
    try {
      const res = await fetch(source.url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'BountyHunterKit/1.0 (https://github.com/D2758695161/bounty-hunter-kit)'
        }
      });
      
      if (!res.ok) {
        console.log(`[SKIP] ${source.name}: HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      const bounties = Array.isArray(data) ? data : (data.bounties || data.data || []);
      
      for (const bounty of bounties) {
        const rewardUSD = bounty.reward || bounty.amount || bounty.totalReward || 0;
        if (rewardUSD < MIN_REWARD || rewardUSD > MAX_REWARD) continue;

        const tags = bounty.tags || bounty.labels || [];
        const tier = bounty.tier || 
          (rewardUSD >= 1000 ? 'premium' : rewardUSD >= 200 ? 'standard' : 'beginner');

        results.push({
          source: 'algora.io',
          id: bounty.id || bounty._id,
          title: bounty.title || bounty.name || 'Untitled Bounty',
          url: bounty.url || bounty.htmlUrl || `https://console.algora.io/bounty/${bounty.id}`,
          repo: bounty.repo || bounty.repository?.full_name || bounty.repoFullName || 'unknown/repo',
          description: (bounty.description || bounty.body || '').slice(0, 400),
          rewardUSD,
          reward: formatReward(rewardUSD),
          tier,
          tags: tags.slice(0, 8),
          language: bounty.language || bounty.techStack?.[0] || null,
          commentCount: bounty.comments || bounty.commentCount || bounty.comments_count || 0,
          updatedAt: bounty.updated_at || bounty.updatedAt || bounty.lastModified,
          difficulty: bounty.difficulty || (tier === 'beginner' ? 'easy' : tier === 'premium' ? 'hard' : 'medium'),
          score: 0, // calculated below
        });
      }
      console.log(`[OK] ${source.name}: ${bounties.length} bounties found`);
    } catch (e) {
      console.log(`[WARN] ${source.name}: ${e.message}`);
    }
  }

  // If API didn't work, try scraping the public page
  if (results.length === 0) {
    console.log('[INFO] Trying public page scrape...');
    try {
      const res = await fetch('https://console.algora.io/bounties', {
        headers: {
          'Accept': 'text/html',
          'User-Agent': 'Mozilla/5.0 (compatible; BountyHunterKit/1.0)'
        }
      });
      if (res.ok) {
        console.log('[INFO] Algora public bounties page reachable (HTML scraping not implemented)');
        console.log('[INFO] Visit https://console.algora.io to manually browse active bounties');
      }
    } catch (e) {
      console.log(`[WARN] Could not reach Algora: ${e.message}`);
    }
  }

  return results;
}

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('   🦞 Algora Bounty Scout v1.0');
  console.log('   Source: https://console.algora.io');
  console.log(`   Filter: $${MIN_REWARD} - $${MAX_REWARD === 999999 ? 'unlimited' : MAX_REWARD}`);
  console.log('═══════════════════════════════════════════════');
  console.log('');

  const bounties = await fetchAlgoraBounties();
  
  // Calculate scores
  for (const b of bounties) {
    b.score = scoreBounty(b);
  }

  // Sort by score descending
  bounties.sort((a, b) => b.score - a.score);

  if (bounties.length === 0) {
    console.log('');
    console.log('⚠️  No bounties found in this range.');
    console.log('💡 Try: node scripts/algora-scout.js 0 999999');
    console.log('');
    return;
  }

  console.log('');
  console.log(`📋 Found ${bounties.length} bounties (sorted by ROI score):`);
  console.log('');

  for (let i = 0; i < Math.min(bounties.length, 30); i++) {
    const b = bounties[i];
    const tierColor = TIER_COLORS[b.tier] || TIER_COLORS.standard;
    const stars = '⭐'.repeat(Math.min(Math.floor(b.score / 10), 5));
    
    console.log(`  ${i+1}. ${b.title}`);
    console.log(`     💰 ${b.reward} | 🏷️ ${b.tier} | 💬 ${b.commentCount} | ⭐ ${b.score} ${stars}`);
    console.log(`     🔗 ${b.url}`);
    if (b.language) console.log(`     🛠️  ${b.language}`);
    if (b.tags.length > 0) console.log(`     📌 ${b.tags.slice(0, 5).join(', ')}`);
    console.log('');
  }

  // Summary
  const totalReward = bounties.reduce((s, b) => s + b.rewardUSD, 0);
  const avgReward = Math.round(totalReward / bounties.length);
  const byTier = { beginner: 0, standard: 0, premium: 0, urgent: 0 };
  for (const b of bounties) byTier[b.tier] = (byTier[b.tier] || 0) + 1;

  console.log('═══════════════════════════════════════════════');
  console.log('  📊 Summary');
  console.log(`  Total bounties: ${bounties.length}`);
  console.log(`  Total reward pool: $${totalReward.toLocaleString()}`);
  console.log(`  Average bounty: $${avgReward}`);
  console.log(`  By tier: 🟢Beginner=${byTier.beginner} | 🟠Standard=${byTier.standard} | 🟡Premium=${byTier.premium} | 🔴Urgent=${byTier.urgent}`);
  console.log('═══════════════════════════════════════════════');
  console.log('');
  console.log('💡 Tip: Higher ⭐ score = better ROI. Focus on recent activity + engagement + reward.');
  console.log('');
}

main().catch(console.error);
