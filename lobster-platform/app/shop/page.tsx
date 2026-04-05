'use client';

import { useState } from 'react';

const PRODUCTS = [
  {
    id: 'ai-freelancer',
    name: 'AI Freelancer变现全攻略',
    price: 199,
    desc: '我是如何用AI月入$10K的完整方法论 + 40个接单渠道清单',
    delivery: 'PDF + 渠道清单 + 邮件模板',
    cover: 'ai-freelancer-cover---18556dd7-aad4-4f3c-8acc-4379d3b57c22.png',
  },
  {
    id: 'bounty-blueprint',
    name: 'GitHub Bounty猎人蓝图',
    price: 299,
    desc: '从找bounty到PR merge的完整SOP，含工具脚本和自动化方案',
    delivery: 'PDF + 工具包 + 视频教程',
    cover: 'bounty-hunter-blueprint-cover---ee441a35-9a2a-464c-8dee-323c409286f5.png',
  },
  {
    id: 'web3-dev-toolbox',
    name: 'Web3开发者工具箱',
    price: 399,
    desc: '20+实用工具、合约模板、调试脚本，Web3开发效率提升10倍',
    delivery: 'PDF + 代码库',
    cover: 'web3-dev-toolbox-cover---c9d273e8-6ecc-49a8-901b-c673e0292bc0.png',
  },
  {
    id: 'defi-yield',
    name: 'DeFi Yield Farming入门指南',
    price: 299,
    desc: '从0到1学会DeFi收益耕作，10个主流协议操作手册',
    delivery: 'PDF + 协议对照表',
    cover: 'defi-yield-farming-cover---fbc2fe4d-b7b1-45ec-a4ba-b576bd3f89cb.png',
  },
  {
    id: 'prompt-mastery',
    name: 'Prompt工程精通指南',
    price: 149,
    desc: '20个高级prompt模板，覆盖写作、代码、创意、分析全场景',
    delivery: 'PDF + 示例',
    cover: 'prompt-engineering-cover---c1763e66-58f3-4693-9c6e-b7a2533df72e.png',
  },
  {
    id: 'side-hustle',
    name: 'AI Side Hustle_STACK',
    price: 249,
    desc: '5个已在盈利的AI副业项目，完整复盘 + 操作手册',
    delivery: 'PDF + 工具清单 + 推广素材',
    cover: 'side-hustle-cover---675742e1-582e-4224-bc8b-cd6d2503cae9.png',
  },
  {
    id: 'smart-contract-auditor',
    name: '智能合约审计师入门',
    price: 599,
    desc: '从代码审查到报告撰写的完整流程，附真实漏洞案例分析',
    delivery: 'PDF + 案例库 + Checklist',
    cover: 'smart-contract-auditor-cover---b955b165-2bb2-4297-9847-8c6c7cc2796d.png',
  },
  {
    id: 'openclaw-agent',
    name: 'OpenClaw Agent开发指南',
    price: 199,
    desc: '用OpenClaw构建自动化工作流，从0到1学会AI agent开发',
    delivery: 'PDF + 技能包',
    cover: 'openclaw-agent-cover---30770777-932d-43b2-ba5a-9d9ce7655d73.png',
  },
  {
    id: 'automation-blueprint',
    name: 'AI自动化蓝图',
    price: 299,
    desc: '10个可落地的AI自动化场景，含MCP服务器搭建和API集成',
    delivery: 'PDF + 源码 + 部署文档',
    cover: 'ai-automation-cover---5fe47de0-167c-478d-ab25-845f3a5270e2.png',
  },
  {
    id: '10k-month',
    name: '$10K/月实战手册',
    price: 399,
    desc: '作者亲测有效的$10K/月收入路径，6个月从0到稳定副业',
    delivery: 'PDF + 行动清单 + 复盘记录',
    cover: '10k-month-cover---8361d220-54b1-499f-9849-fb493719c2b3.png',
  },
  {
    id: 'smart-contract-audit-service',
    name: '🔧 智能合约安全审计',
    price: 4999,
    desc: '专业安全审计，覆盖重入、溢出、权限漏洞，交付完整报告',
    delivery: '完整审计报告 + 修复建议',
    cover: 'smart-contract-security-cover---e44e8a83-9c7e-4b3f-9e1a-b2c3d4e5f678.png',
  },
  {
    id: 'ai-agent-setup',
    name: '🤖 AI Agent搭建服务',
    price: 2999,
    desc: '帮你搭建OpenClaw自动化工作流，含定制开发+部署+文档',
    delivery: '完整系统 + 1个月维护',
    cover: 'openclaw-agent-cover---30770777-932d-43b2-ba5a-9d9ce7655d73.png',
  }
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
          现货发售 · 微信/USDT收款 · 24小时内交付
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
              src="/wechat-pay-qr.png"
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
