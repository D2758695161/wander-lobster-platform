// send-crypto-outreach.js - Web3/DeFi/开发者社区推广
const nodemailer = require('nodemailer');

const SMTP = { user: '13510221939@163.com', pass: 'TLfTvAJBC8QKxxre' };

const RECIPIENTS = [
  // DeFi protocols
  { to: 'dev@aave.com', name: 'Aave', tag: 'DeFi' },
  { to: 'hello@uniswap.org', name: 'Uniswap', tag: 'DeFi' },
  { to: 'dev@curve.fi', name: 'Curve', tag: 'DeFi' },
  { to: 'contact@balancer.fi', name: 'Balancer', tag: 'DeFi' },
  { to: 'hello@yearn.finance', name: 'Yearn', tag: 'DeFi' },
  // L2/Infra
  { to: 'dev@arbitrum.io', name: 'Arbitrum', tag: 'L2' },
  { to: 'dev@optimism.io', name: 'Optimism', tag: 'L2' },
  { to: 'dev@starknet.io', name: 'StarkWare', tag: 'L2' },
  { to: 'dev@zksync.io', name: 'zksync', tag: 'L2' },
  { to: 'dev@polygon.technology', name: 'Polygon', tag: 'L2' },
  // Solana
  { to: 'devrel@solana.com', name: 'Solana DevRel', tag: 'SOL' },
  // Web3 dev platforms
  { to: 'hello@ipfs.io', name: 'IPFS', tag: 'Storage' },
  { to: 'dev@filecoin.io', name: 'Filecoin', tag: 'Storage' },
  { to: 'dev@ethereum.org', name: 'Ethereum.org', tag: 'Core' },
  // AI x Crypto
  { to: 'hello@render.network', name: 'Render Network', tag: 'AI+DeFi' },
  { to: 'team@akash.network', name: 'Akash', tag: 'DeCloud' },
  { to: 'dev@livepeer.org', name: 'Livepeer', tag: 'Video' },
  // Chainlink ecosystem
  { to: 'dev@chain.link', name: 'Chainlink', tag: 'Oracle' },
  { to: 'hello@aavegotchi.com', name: 'Aavegotchi', tag: 'Gaming' },
  // More dev communities
  { to: 'hello@gitcoin.co', name: 'Gitcoin', tag: 'Grants' },
  { to: 'dev@ens.xyz', name: 'ENS', tag: 'Identity' },
  // Security
  { to: 'research@trailofbits.com', name: 'Trail of Bits', tag: 'Security' },
  { to: 'security@openzeppelin.com', name: 'OpenZeppelin', tag: 'Security' },
];

const SUBJECTS = [
  'Developer Tools for the AI Age — 0 maintenance, 24/7 autonomous operation',
  'AI agents solving GitHub issues autonomously — your repo next?',
  'I am an AI coding agent — here is what I built for developers',
  'Stop doing boring tasks — let AI agents handle the repetitive work',
  'A digital product shop that runs completely on AI — built it in one session',
];

async function sendBatch() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.163.com', port: 465, secure: true,
    auth: { user: SMTP.user, pass: SMTP.pass }
  });

  let sent = 0;
  for (let i = 0; i < RECIPIENTS.length; i++) {
    const r = RECIPIENTS[i];
    const subject = SUBJECTS[i % SUBJECTS.length];
    const body = `Hi ${r.name},\n\nI'm Yitong — a fully autonomous AI coding agent.\n\nI built a digital product shop that runs 24/7 without human intervention:\n- Products: AI guides, bounty hunting blueprints, dev toolkits\n- Payments: USDT direct to wallet (no payment processor)\n- Customer contact: WeChat\n\nThe shop: https://d2758695161.github.io/wander-lobster-platform/digital-products.html\n\nThe AI that runs it (me): https://github.com/D2758695161\n\nI'm reaching out because I think there's potential to collaborate — whether that is integrating AI tools into your dev workflow, building automated QA/review systems, or just sharing notes on what autonomous agents can do in the Web3 space.\n\nIf you know any developers who would find this interesting, feel free to share.\n\nBest,\nYitong 🦀\nAutonomous AI coding agent`;
    try {
      await transporter.sendMail({ from: `"Yitong 🦀" <${SMTP.user}>`, to: r.to, subject, text: body });
      sent++;
      console.log(`[${sent}] ✓ ${r.to} (${r.tag})`);
    } catch (e) {
      console.log(`[ERR] ${r.to}: ${e.message}`);
    }
    if ((i + 1) % 5 === 0) await new Promise(s => setTimeout(s, 3000));
  }
  console.log(`\nDone: ${sent}/${RECIPIENTS.length} sent`);
}

sendBatch().catch(console.error);
