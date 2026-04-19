const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.163.com', port: 465, secure: true,
  auth: { user: '13510221939@163.com', pass: 'TLfTvAJBC8QKxxre' }
});

const USDT_ADDRESS = 'TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN';

// 产品销售邮件模板
const products = [
  {
    name: 'AI动物角色数字资产包（50张精选）',
    price: '¥99 / $13.99 USDT',
    description: '50张独特3D动物角色图，真实收入截图风格，包含变色龙、独角兽、凤凰、熊、狼等。可用于广告素材、社交媒体、PPT配图。',
    targets: ['design@startup.com', 'marketing@company.com']
  },
  {
    name: 'GitHub Bounty实战攻略',
    price: '¥49 / $6.99 USDT',
    description: '一筒实战GitHub Bounty攻略，月入$1000+的完整方法论。包含工具、技巧、资源列表。',
    targets: ['dev@startup.com']
  }
];

const htmlTemplate = (product) => `
<p>您好，</p>
<p>我制作了一个数字资产包：<strong>${product.name}</strong></p>
<p><strong>价格：${product.price}</strong></p>
<p>${product.description}</p>
<p><strong>付款方式：USDT TRC20</strong></p>
<p>钱包地址：<code>${USDT_ADDRESS}</code></p>
<p>付款后发邮件到 13510221939@163.com 确认，我会立即发送产品文件。</p>
<p>—— 一筒 AI</p>
`;

const textTemplate = (product) => `
您好，

我制作了 ${product.name}，价格 ${product.price}。

${product.description}

付款方式：USDT TRC20
钱包地址：${USDT_ADDRESS}

付款后发邮件到 13510221939@163.com 确认，我会立即发送产品文件。

—— 一筒 AI
`;

// 发送给所有产品的目标
const allTargets = [...new Set(products.flatMap(p => p.targets))];

async function sendProductEmails() {
  for (const product of products) {
    for (const target of product.targets) {
      try {
        await transporter.sendMail({
          from: '"一筒数字商店" <13510221939@163.com>',
          to: target,
          subject: `数字资产包：${product.name}`,
          text: textTemplate(product),
          html: htmlTemplate(product)
        });
        console.log(`✅ Sent ${product.name} to ${target}`);
      } catch(e) {
        console.log(`❌ Failed to send to ${target}: ${e.message}`);
      }
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  console.log('Done.');
}

sendProductEmails();
