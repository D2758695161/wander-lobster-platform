#!/usr/bin/env node
/**
 * Opire Bounty Scout — Find Active Crypto-Native Bounties
 * Uses the Opire API to find real-time active bounties with USDT/x402 payments
 * 
 * Usage:
 *   node scripts/opire-bounty-scout.js
 *   node scripts/opire-bounty-scout.js --network ethereum
 *   node scripts/opire-bounty-scout.js --min 50 --max 500
 */

const https = require("https");

const TOKEN = process.env.OPIRE_API_KEY || "";
const DEFAULT_MIN = parseInt(process.argv.includes("--min") 
  ? process.argv[process.argv.indexOf("--min") + 1] : "0");
const DEFAULT_MAX = parseInt(process.argv.includes("--max") 
  ? process.argv[process.argv.indexOf("--max") + 1] : "999999");
const NETWORK = process.argv.includes("--network") 
  ? process.argv[process.argv.indexOf("--network") + 1] 
  : "all";

function opire(path) {
  return new Promise((resolve, reject) => {
    const headers = {
      "Accept": "application/json",
      "User-Agent": "bounty-scout-opire",
    };
    if (TOKEN) headers["Authorization"] = `Bearer ${TOKEN}`;
    const options = {
      hostname: "api.opire.dev",
      path: "/v1" + path,
      headers,
    };
    https.get(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    }).on("error", () => {
      // Fallback: try without auth
      const fallbackOptions = { ...options, headers: { ...options.headers, Authorization: undefined } };
      https.get(fallbackOptions, (res2) => {
        let data2 = "";
        res2.on("data", (chunk) => (data2 += chunk));
        res2.on("end", () => {
          try { resolve(JSON.parse(data2)); }
          catch { resolve(null); }
        });
      }).on("error", reject);
    });
  });
}

function parseReward(rewardStr) {
  if (!rewardStr) return 0;
  const match = rewardStr.match(/[\d,]+(?:\.\d+)?/);
  if (!match) return 0;
  return parseFloat(match[0].replace(",", ""));
}

function formatReward(reward) {
  if (reward >= 1000) return "$" + (reward / 1000).toFixed(1) + "K";
  return "$" + reward;
}

function networkLabel(network) {
  const map = {
    ethereum: "Ethereum",
    optimism: "Optimism", 
    arbitrum: "Arbitrum",
    polygon: "Polygon",
    base: "Base",
    solana: "Solana",
  };
  return map[network] || network;
}

async function fetchAllBounties() {
  console.log("\n🦞 Opire Bounty Scout — Active Crypto Bounties\n");
  console.log("=".repeat(60));
  
  try {
    // Fetch from multiple sources
    const [activeRes, recentRes] = await Promise.all([
      opire("/bounties?status=active&limit=30"),
      opire("/bounties?status=active&sort=recent&limit=30"),
    ]);
    
    let bounties = [];
    
    if (activeRes && activeRes.data) {
      bounties = [...activeRes.data];
    }
    if (recentRes && recentRes.data) {
      const existingIds = new Set(bounties.map(b => b.id));
      for (const b of recentRes.data) {
        if (!existingIds.has(b.id)) bounties.push(b);
      }
    }
    
    if (bounties.length === 0) {
      console.log("📡 No bounties found via API. Showing curated list...\n");
      printCuratedBounties();
      return;
    }
    
    // Filter by network and reward
    let filtered = bounties.filter(b => {
      const reward = parseReward(b.reward || b.amount || "");
      if (NETWORK !== "all") {
        const nets = (b.networks || []).map(n => n.toLowerCase());
        if (!nets.includes(NETWORK.toLowerCase())) return false;
      }
      if (reward < DEFAULT_MIN || reward > DEFAULT_MAX) return false;
      return true;
    });
    
    // Sort by reward descending
    filtered.sort((a, b) => parseReward(b.reward || b.amount || "") - parseReward(a.reward || a.amount || ""));
    
    console.log(`Found ${filtered.length} active bounties (min=${formatReward(DEFAULT_MIN)}, max=${formatReward(DEFAULT_MAX)})\n`);
    
    for (const b of filtered.slice(0, 15)) {
      const reward = b.reward || b.amount || "TBD";
      const repo = b.repository?.full_name || b.repo || "unknown/repo";
      const title = b.title || b.summary || "Untitled bounty";
      const url = b.url || b.link || `https://github.com/${repo}`;
      const networks = (b.networks || []).map(networkLabel).join(", ") || "Multi-chain";
      const expires = b.expires_at ? new Date(b.expires_at).toLocaleDateString() : "No expiry";
      
      console.log(`🏆 ${reward}`);
      console.log(`   ${title}`);
      console.log(`   📦 ${repo}`);
      console.log(`   ⛓️  ${networks}`);
      console.log(`   ⏰ Expires: ${expires}`);
      console.log(`   🔗 ${url}`);
      console.log("");
    }
    
    // Summary by network
    const networkCounts = {};
    for (const b of bounties) {
      for (const n of (b.networks || [])) {
        networkCounts[n] = (networkCounts[n] || 0) + 1;
      }
    }
    
    console.log("=".repeat(60));
    console.log("📊 Bounty Distribution by Network:");
    for (const [net, count] of Object.entries(networkCounts)) {
      console.log(`   ${networkLabel(net)}: ${count} bounties`);
    }
    console.log("");
    
  } catch (err) {
    console.log("⚠️  API error:", err.message);
    console.log("📡 Showing curated list...\n");
    printCuratedBounties();
  }
}

function printCuratedBounties() {
  const curated = [
    {
      title: "GasRoute Oracle — DeFi Bounty #4",
      repo: "daydreamsai/agent-bounties",
      reward: "$500",
      networks: "Ethereum, Polygon",
      url: "https://github.com/daydreamsai/agent-bounties/issues",
      desc: "AI agent for DeFi gas optimization and routing"
    },
    {
      title: "Approval Risk Auditor — ERC-20 Bounty #5",
      repo: "daydreamsai/agent-bounties",
      reward: "$200+",
      networks: "Ethereum",
      url: "https://github.com/daydreamsai/agent-bounties/issues/5",
      desc: "Flag unlimited/stale ERC-20 approvals, build revoke calls"
    },
    {
      title: "LP Impermanent Loss Estimator",
      repo: "daydreamsai/agent-bounties",
      reward: "$300+",
      networks: "Ethereum, Arbitrum",
      url: "https://github.com/daydreamsai/agent-bounties/issues",
      desc: "Calculate and monitor impermanent loss for LP positions"
    },
    {
      title: "Cross DEX Arbitrage Alert Agent",
      repo: "daydreamsai/agent-bounties",
      reward: "$400+",
      networks: "Multi-chain",
      url: "https://github.com/daydreamsai/agent-bounties/issues/160",
      desc: "Monitor cross-exchange price discrepancies in real-time"
    },
    {
      title: "Lending Liquidation Sentinel v2",
      repo: "daydreamsai/agent-bounties",
      reward: "$300+",
      networks: "Ethereum",
      url: "https://github.com/daydreamsai/agent-bounties/issues/159",
      desc: "Monitor lending protocol health factors and alert on liquidation risk"
    },
  ];
  
  for (const b of curated) {
    console.log(`🏆 ${b.reward}`);
    console.log(`   ${b.title}`);
    console.log(`   📦 ${b.repo}`);
    console.log(`   ⛓️  ${b.networks}`);
    console.log(`   🔗 ${b.url}`);
    console.log("");
  }
}

fetchAllBounties().catch(console.error);
