// ============================================================
// AI Animal Character Pack — Sales Email Script
// Use: node sales-email.js <recipient_email>
// ============================================================

const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// ---- CONFIG ----
const CONFIG = {
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  user: '13510221939@163.com',
  pass: 'TLfTvAJBC8QKxxre',
  from: '"PixAR Animals" <13510221939@163.com>',
  packName: 'PixAR Animals Vol.1 — 20 Premium AI Characters',
  packPrice: '$149 USDT',
  contactEmail: '13510221939@163.com',
  imagesDir: 'C:/Users/Administrator/.openclaw/media/tool-image-generation/',
};

// ---- PRODUCT LIST ----
const PRODUCTS = [
  { name: 'Neon King — Cyberpunk Lion', price: '$18' },
  { name: 'Shard Drake — Crystal Dragon', price: '$18' },
  { name: 'Frost Howl — Aurora Wolf', price: '$16' },
  { name: 'Solarius — Light Eagle', price: '$16' },
  { name: 'River Rich — Gold Coin Otter', price: '$12' },
  { name: 'Mr. Bite$ — Shark CEO', price: '$14' },
  { name: 'Sir Waddle — Penguin CEO', price: '$14' },
  { name: 'Coin King — Rich Hamster', price: '$12' },
  { name: 'Aurelius — Golden Phoenix', price: '$18' },
  { name: 'Prism — Crystal Unicorn', price: '$16' },
  { name: 'Archmage — Wizard Owl', price: '$14' },
  { name: 'Fortuna — Gold Tiger', price: '$18' },
  { name: 'Byte — Robot Panda', price: '$16' },
  { name: 'Glitch — Cyber Fox', price: '$16' },
  { name: 'Steeljaw — Mech Wolf', price: '$16' },
  { name: 'Spectrum — Holographic Chameleon', price: '$14' },
  { name: 'Gilded — Treasure Dragon', price: '$18' },
  { name: "Ra's Pride — Egyptian Lion", price: '$18' },
  { name: 'Onyx — Obsidian Gorilla', price: '$16' },
  { name: 'Imperial — Jade Serpent', price: '$18' },
];

// ---- EMAIL TEMPLATE ----
function buildHtmlEmail(recipientName = 'there') {
  const productRows = PRODUCTS.map(p => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${p.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:bold;color:#f59e0b;">${p.price}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PixAR Animals — AI Character Pack</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;max-width:600px;">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#f59e0b);padding:40px 40px 30px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:32px;letter-spacing:1px;">
                🦁 PixAR Animals Vol.1
              </h1>
              <p style="margin:12px 0 0;color:#fde68a;font-size:16px;">
                20 Premium AI-Generated 3D Characters — Pixar Quality
              </p>
            </td>
          </tr>

          <!-- INTRO -->
          <tr>
            <td style="padding:30px 40px 10px;background:#1e293b;">
              <p style="color:#e2e8f0;font-size:15px;line-height:1.7;margin:0;">
                Hi ${recipientName},
              </p>
              <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:12px 0 0;">
                I just released <strong style="color:#a78bfa;">PixAR Animals Vol.1</strong> — a collection of <strong style="color:#e2e8f0;">20 unique, Pixar-quality AI animal characters</strong> spanning cyberpunk, fantasy, luxury, and cute mascots. Every image is 2K resolution and commercially licensed.
              </p>
            </td>
          </tr>

          <!-- PRODUCT TABLE -->
          <tr>
            <td style="padding:10px 40px 10px;background:#1e293b;">
              <h2 style="color:#e2e8f0;font-size:18px;margin:0 0 10px;">Character Roster</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:8px;overflow:hidden;">
                <thead>
                  <tr style="background:#334155;">
                    <th style="padding:10px 12px;text-align:left;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Character</th>
                    <th style="padding:10px 12px;text-align:right;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Price</th>
                  </tr>
                </thead>
                <tbody style="color:#e2e8f0;font-size:14px;">
                  ${productRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- PACK DEAL -->
          <tr>
            <td style="padding:20px 40px;background:#1e293b;text-align:center;">
              <div style="background:linear-gradient(135deg,#7c3aed22,#f59e0b22);border:2px solid #7c3aed;border-radius:12px;padding:24px;">
                <p style="margin:0;color:#94a3b8;font-size:14px;">Full Pack — All 20 Characters</p>
                <p style="margin:8px 0 0;color:#f59e0b;font-size:36px;font-weight:bold;">$149 USDT</p>
                <p style="margin:8px 0 0;color:#64748b;font-size:13px;"><s>$320</s> &nbsp; Save $171 — Limited offer</p>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 30px;background:#1e293b;text-align:center;">
              <a href="mailto:${CONFIG.contactEmail}?subject=Interested+in+PixAR+Animals+Vol1" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:16px;font-weight:bold;letter-spacing:0.5px;">
                Reply to Buy — Email Us Now
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#0f172a;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
              <p style="margin:0;color:#475569;font-size:12px;">
                Payment: USDT (TRC-20) &nbsp;|&nbsp; Delivery: Google Drive within 24hrs<br>
                Contact: ${CONFIG.contactEmail}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---- SEND EMAIL ----
async function sendSalesEmail(recipientEmail, recipientName = 'there') {
  const transporter = nodemailer.createTransport({
    host: CONFIG.host,
    port: CONFIG.port,
    secure: CONFIG.secure,
    auth: {
      user: CONFIG.user,
      pass: CONFIG.pass,
    },
  });

  const html = buildHtmlEmail(recipientName);

  const mailOptions = {
    from: CONFIG.from,
    to: recipientEmail,
    subject: `🦁 PixAR Animals Vol.1 — 20 Pixar-Quality AI Characters ($149 Full Pack)`,
    html: html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${recipientEmail}`);
  console.log(`   Message ID: ${info.messageId}`);
  return info;
}

// ---- CLI ----
const recipient = process.argv[2];
if (!recipient) {
  console.error('Usage: node sales-email.js <recipient_email> [recipient_name]');
  process.exit(1);
}

const recipientName = process.argv[3] || 'there';

sendSalesEmail(recipient, recipientName)
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  });
