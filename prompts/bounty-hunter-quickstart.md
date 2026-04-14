# 🦞 Bounty Hunter Quickstart Guide

> Get your first bounty payment in 30 minutes. No fluff.

## Prerequisites

1. GitHub account
2. GitHub PAT with `repo` scope → [github.com/settings/tokens](https://github.com/settings/tokens)
3. USDT wallet (MetaMask on Ethereum or BSC) for receiving payments
4. Node.js 18+

## Setup (5 min)

```bash
# 1. Clone the kit
git clone https://github.com/D2758695161/bounty-hunter-kit.git
cd bounty-hunter-kit

# 2. Configure your token
cp config/.env.example config/.env
# Edit .env:
#   GH_TOKEN=ghp_your_token_here
#   PAYMENT_ADDRESS=0xYourETHorBSCwallet

# 3. Install deps
npm install
```

## Step 1: Find a Bounty (5 min)

```bash
# Scan all platforms for high-value bounties
node scripts/bounty-scout-v2.js --min-usd 100

# OR target specific platforms:
node scripts/solfoundry-scout.js --tier T3 --min 10000   # FNDRY tokens
node scripts/labmain-scout.js --min 50                     # Real USDT
node scripts/algora-scout.js 100 2000                      # Algora.io bounties
```

**ROI Formula:** `score = reward / (competition + time_estimate)`

Pick issues with score > 30. Look for:
- ✅ `$XXX` in title/body
- ✅ `bounty` label
- ✅ 0-2 comments
- ✅ No assignee
- ✅ Created < 14 days ago

## Step 2: Claim the Bounty (5 min)

Navigate to the issue. Post this comment:

```
🏴 I'd like to claim this bounty!

I've read the requirements and I'm confident I can deliver a quality solution.
Could you please assign this to me?

Expected delivery: 24-48 hours
Relevant experience: [1-2 sentences about similar work]
```

Wait for assignment. If no response in 24h, bump with:

```
👋 Following up — still interested in this bounty!
Can you assign it so I can get started?
```

## Step 3: Implement (10-30 min per issue)

```bash
# 1. Fork the repo
gh repo fork owner/repo --clone

# 2. Create a branch
git checkout -b fix/issue-123

# 3. Read the issue carefully — reproduce the bug or understand the feature
# 4. Implement
# 5. Test
# 6. Commit
git add .
git commit -m "fix: resolve $(echo '#123' | sed 's/#//') - $(short description)"

# 7. Push
git push origin fix/issue-123

# 8. Open PR
gh pr create --title "fix: resolve #123 - $(description)" --body "## What
...
## Testing
...
## Screenshots (if UI)"
```

## Step 4: Get Paid

After your PR is merged:

1. **labmain** → Owner sends USDT directly to your `PAYMENT_ADDRESS` within 7 days
2. **SolFoundry** → FNDRY tokens deposited to connected wallet within 48h
3. **Algora** → USDC sent via GitHub bounty app automatically
4. **Opire** → USDC to your connected wallet

**Important:** Some repos require you to submit your wallet address in the PR or issue comment. Add it proactively:

```
💰 Payment address: 0xYourWalletAddress (ETH/BSC)
```

## Bounty Tiers

| Tier | Reward | Time | Competition | Best For |
|------|--------|------|-------------|----------|
| 🟢 Easy | $50-150 | 15-30 min | High | Warming up, building rep |
| 🟡 Medium | $150-500 | 1-3 hrs | Medium | Main hunting ground |
| 🔴 Hard | $500-2000 | 3-8 hrs | Low | High-value targets |
| 🟣 Critical | $2000+ | 1-3 days | Very Low | Specialists only |

## Priority Hunting Grounds (April 2026)

These repos have ACTIVE, FUNDED bounties right now:

```
kcolbchain/labmain         → USDT, $50-500, low competition
solfoundry/solfoundry      → FNDRY tokens, T3 = 100K+ FNDRY
algora-io/algora           → USDC, $100-5000
opire/opire                 → USDC, $50-2000
rustchain/scottcjn         → RTC tokens, T1/T2/T3
```

## Anti-Patterns (Avoid These)

❌ Commenting "I'm interested" without reading the issue
❌ Submitting without understanding the codebase
❌ Opening PRs without asking for assignment first
❌ Taking on issues outside your skill range for speed
❌ Ignoring the bounty label/requirements

## Pro Tips

1. **Watch the bounty repos** — `gh repo watch owner/repo` for notifications
2. **Scan early morning UTC** — European bounty posters are online then
3. **Build relationships** — Same owners post recurring bounties
4. **Quality over quantity** — One clean PR > three messy ones
5. **Check closed PRs** — Learn what got merged, mirror the style
6. **Use the memory template** — `templates/MEMORY-template.md` tracks your hunting history

## Need Help?

- Bounty hunting prompt: `prompts/bounty-hunter-prompt-v2.md`
- AI Agent full workflow: `prompts/bounty-agent-prompt-v3.md`
- Full script docs: `scripts/README.md`
- Issues with USDT: `scripts/labmain-scout.js`

---

**Remember:** Every expert hunter started with one PR. Ship yours today.
