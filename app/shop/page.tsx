'use client';

import { useState } from 'react';

const PRODUCTS = [
  {
    id: 'prompt-mastery',
    name: 'AI Prompt Mastery 提示词大师',
    price: 99,
    desc: '87个经过验证的ChatGPT/Claude/Gemini提示词模板',
    delivery: 'PDF + 示例代码',
    cover: 'ai-prompt-mastery-cover.png',
  },
  {
    id: 'bounty-blueprint',
    name: 'GitHub Bounty 狩猎蓝图',
    price: 299,
    desc: '35个真实bounty repo + PR模板 + 邮件话术 + $500+案例',
    delivery: 'PDF + 工具包',
    cover: 'bounty-hunter-blueprint-cover.png',
  },
  {
    id: 'smart-contract-audit',
    name: '智能合约安全自查表',
    price: 499,
    desc: '20个安全检查点 + 漏洞模式 + OpenZeppelin对照表',
    delivery: 'PDF + Checklist',
    cover: 'security-checklist-cover.png',
  },
  {
    id: 'telegram-bot',
    name: 'Telegram Bot 开发模板包',
    price: 199,
    desc: 'Python Bot完整源码 + 部署教程 + 防封策略',
    delivery: '完整源代码',
    cover: 'telegram-bot-cover.png',
  },
  {
    id: 'freelancer-toolkit',
    name: 'AI 自由职业者工具包',
    price: 399,
    desc: '47个Upwork/Fiverr模板 + $10K+/月系统方法论',
    delivery: 'PDF + Notion模板',
    cover: 'ai-freelancer-toolkit-cover.png',
  },
  {
    id: 'web3-side-hustle',
    name: 'Web3 开发者副业指南',
    price: 499,
    desc: 'Solidity + DeFi + 稳定$500-$5000/月收入路径',
    delivery: 'PDF + 代码示例',
    cover: 'web3-side-hustle-cover.png',
  },
];

const WALLET_ADDRESS = 'TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN';

export default function ShopPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [contact, setContact] = useState('');

  const handleBuy = (productId: string) => {
    setSelected(productId);
  };

  const handleConfirm = () => {
    if (!contact.trim()) {
      alert('请先加微信 DriftLobster 发截图确认');
      return;
    }
    setPaid(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🦞</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#FF6B35', marginBottom: 8 }}>
          一筒数字产品商店
        </h1>
        <p style={{ color: '#888', fontSize: 16 }}>
          AI生成封面 · 微信/USDT收款 · 24小时内交付
        </p>
      </div>

      {/* USDT Notice */}
      <div style={{ maxWidth: 600, margin: '0 auto 40px', background: '#1a1a2e', borderRadius: 16, padding: '20px 24px', border: '1px solid #FF6B3533' }}>
        <p style={{ color: '#FFD93D', fontSize: 14, marginBottom: 8 }}>💰 USDT收款地址（TRC20）:</p>
        <p style={{ color: '#4ECDC4', fontSize: 12, wordBreak: 'break-all', fontFamily: 'monospace' }}>{WALLET_ADDRESS}</p>
        <p style={{ color: '#666', fontSize: 12, marginTop: 8 }}>转账后联系 DriftLobster 确认交付</p>
      </div>

      {/* Products */}
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 24 }}>📦 现货产品</h2>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {PRODUCTS.map((p) => (
            <div key={p.id} style={{ background: '#111118', borderRadius: 16, padding: 24, border: selected === p.id ? '2px solid #FF6B35' : '1px solid #222', transition: 'border 0.2s' }}>
              {p.cover && <img src={'/covers/' + p.cover} alt={p.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', flex: 1 }}>{p.name}</h3>
                <span style={{ background: '#FF6B35', color: '#fff', fontWeight: 900, fontSize: 18, padding: '4px 12px', borderRadius: 20 }}>¥{p.price}</span>
              </div>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>{p.desc}</p>
              <p style={{ color: '#4ECDC4', fontSize: 12 }}>包含: {p.delivery}</p>
              <button
                onClick={() => handleBuy(p.id)}
                style={{ marginTop: 16, width: '100%', padding: '12px', background: selected === p.id ? '#FF6B35' : '#222', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
              >
                {selected === p.id ? '✅ 已选择' : '立刻购买'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Section */}
      {selected && (
        <div style={{ maxWidth: 500, margin: '40px auto', background: '#111118', borderRadius: 20, padding: 32, border: '1px solid #FF6B3544' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 24 }}>
            微信扫码支付 ¥{PRODUCTS.find(p => p.id === selected)?.price}
          </h3>

          {/* WeChat QR Code */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <img
              src="/images/wechat-pay-qr.png"
              alt="微信收款码"
              style={{ width: 240, height: 240, borderRadius: 12, border: '4px solid #07C160' }}
            />
            <p style={{ color: '#07C160', fontSize: 13, marginTop: 12 }}>↑ 截图保存，打开微信扫一扫 ↑</p>
            <p style={{ color: '#666', fontSize: 12, marginTop: 4 }}>或保存图片 → 微信 → 我 → 支付 → 收付款 → 扫描</p>
          </div>

          <div style={{ background: '#0d0d14', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>📋 购买步骤:</p>
            <ol style={{ color: '#aaa', fontSize: 13, paddingLeft: 20, lineHeight: 2 }}>
              <li>截图或保存左边二维码</li>
              <li>打开微信扫一扫，选相册里的二维码</li>
              <li>支付 <strong style={{ color: '#FF6B35' }}>¥{PRODUCTS.find(p => p.id === selected)?.price}</strong></li>
              <li>截图支付凭证</li>
              <li>加微信 <strong style={{ color: '#07C160' }}>DriftLobster</strong> 发截图</li>
              <li>24小时内收到文件</li>
            </ol>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#888', fontSize: 13, display: 'block', marginBottom: 6 }}>你的微信号（选填，联系用）:</label>
            <input
              type="text"
              placeholder="微信号"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', background: '#0d0d14', border: '1px solid #333', borderRadius: 10, color: '#fff', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={handleConfirm}
            style={{ width: '100%', padding: '14px', background: paid ? '#27ae60' : '#FF6B35', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
          >
            {paid ? '✅ 已联系 DriftLobster' : '我已支付，联系发货'}
          </button>

          <p style={{ color: '#555', fontSize: 11, textAlign: 'center', marginTop: 12 }}>
            24小时内未收到货？联系 DriftLobster 解决
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 60, padding: '20px', color: '#444', fontSize: 12 }}>
        <p>🦀 一筒数字商店 · 诚信经营 · 退款无忧</p>
        <p style={{ marginTop: 4 }}>有问题加微信 DriftLobster</p>
      </div>
    </div>
  );
}
