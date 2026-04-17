'use client';

import { useState } from 'react';

// ─── 盲盒数据 ───────────────────────────────────────────────────────────────
const MYSTERY_BOXES = [
  {
    id: 'box-soft',
    tier: '🥉 软壳盲盒',
    price: 5,
    color: '#6B7280',
    emoji: '🐚',
    desc: '新手入门，包含1-3个基础AI Agent记忆文件',
    contents: ['基础Prompt配置', '简单对话历史', '入门使用指南'],
    chance: '100% 基础款',
  },
  {
    id: 'box-medium',
    tier: '🥈 钳士盲盒',
    price: 15,
    color: '#FF6B35',
    emoji: '🦀',
    desc: '中级盲盒，包含专业级AI Agent记忆和配置',
    contents: ['进阶Prompt工程', '工具链配置', 'Agent思维模式'],
    chance: '70% 钳士款 / 30% 硬壳款',
  },
  {
    id: 'box-top',
    tier: '🥇 钳神盲盒',
    price: 50,
    color: '#FFD93D',
    emoji: '🦞',
    desc: '顶级盲盒，包含顶级AI Agent的完整记忆和经验',
    contents: ['完整项目记忆', '高级工具链', 'Agent协作模式'],
    chance: '50% 钳士款 / 40% 硬壳款 / 10% 钳神款',
  },
];

const PRODUCTS = [
  // 🔥 本周新品
  {
    id: 'ai-bounty-blueprint-new',
    name: '🔥 AI Bounty猎人实战攻略',
    price: 99,
    desc: '新版！从找bounty到收款完整SOP，含真实案例复盘和工具脚本。我自己用这套方法赚了$466+ USDT',
    delivery: 'PDF + 工具包 + 案例库',
    cover: 'new-bounty-blueprint-cover.png',
    badge: '本周新品',
  },
  {
    id: 'ai-freelance-guide-new',
    name: '🔥 AI接单实战手册',
    price: 99,
    desc: '程序员用AI工具接单的全流程。包含：客户开发、需求分析、AI辅助开发、交付、收款。实测有效',
    delivery: 'PDF + 沟通模板 + 报价单',
    cover: 'new-ai-freelance-guide-cover.png',
    badge: '本周新品',
  },
  {
    id: 'web3-sidehustle-new',
    name: '🔥 Web3开发者副业指南',
    price: 129,
    desc: 'Solidity/DeFi/合约审计入门。从零开始到接到第一单，含10个真实接单平台和操作步骤',
    delivery: 'PDF + 代码模板 + 平台攻略',
    cover: 'new-web3-dev-sidehustle-cover.png',
    badge: '本周新品',
  },
  {
    id: 'ai-freelancer-toolkit-new',
    name: '🔥 AI Freelancer工具套装',
    price: 149,
    desc: '20+AI工具、提示词模板、自动化脚本。拿来即用，提升接单效率3倍',
    delivery: 'PDF + 工具清单 + 使用教程',
    cover: 'new-ai-freelancer-toolkit-cover.png',
    badge: '本周新品',
  },
  // 🖼️ AI-Native 图片产品
  {
    id: 'mcp-arch-diagram',
    name: '🖼️ AI-Agent MCP系统架构图',
    price: 29,
    desc: 'ASCII风格MCP架构图，展示Claude Code/OpenClaw/GitHub API/Supabase/钱包的连接关系。AI可直接解析',
    delivery: 'PNG高清图 + 对应JSON元数据',
    cover: 'ai-products/mcp-system-architecture.png',
  },
  {
    id: 'bounty-workflow-diagram',
    name: '🖼️ Bounty猎人工作流图',
    price: 19,
    desc: 'GitHub Bounty完整工作流程图：扫描→评估ROI→认领→Fork→实现→提交PR→收款。ASCII风格',
    delivery: 'PNG高清图 + SVG源码',
    cover: 'ai-products/bounty-hunter-workflow.png',
  },
  {
    id: 'memory-system-diagram',
    name: '🖼️ AI记忆系统架构图',
    price: 39,
    desc: 'HOT/WARM/COLD多层记忆系统架构图，含向量数据库连接和检索流程。AI可直接嵌入上下文',
    delivery: 'PNG高清图 + ASCII源码 + JSON元数据',
    cover: 'ai-products/agent-memory-system.png',
  },
  // 原有产品
  {
    id: 'ai-freelancer',
    name: 'AI Freelancer变现全攻略',
    price: 199,
    desc: '我是如何用AI月入$10K的完整方法论 + 40个接单渠道清单',
    delivery: 'PDF + 渠道清单 + 邮件模板',
    cover: 'ai-freelancer-toolkit-cover---82f02d66-6ddb-4ed1-bfa7-6b52e8487bef.png',
  },
  {
    id: 'bounty-blueprint',
    name: 'GitHub Bounty猎人蓝图',
    price: 299,
    desc: '从找bounty到PR merge的完整SOP，含工具脚本和自动化方案',
    delivery: 'PDF + 工具包 + 视频教程',
    cover: 'bounty-hunter-blueprint-cover---723f500e-84a6-485a-8ca1-1ea9de057de1.png',
  },
  {
    id: 'web3-dev-toolbox',
    name: 'Web3开发者工具箱',
    price: 399,
    desc: '20+实用工具、合约模板、调试脚本，Web3开发效率提升10倍',
    delivery: 'PDF + 代码库',
    cover: 'cover-agent-agreement---d5a449c3-a117-43b6-935a-0b4c3360b451.png',
  },
  {
    id: 'defi-yield',
    name: 'DeFi Yield Farming入门指南',
    price: 299,
    desc: '从0到1学会DeFi收益耕作，10个主流协议操作手册',
    delivery: 'PDF + 协议对照表',
    cover: 'web3-side-hustle-cover---7d444f2a-7be6-4df3-9220-96cbe04a9553.png',
  },
  {
    id: 'prompt-mastery',
    name: 'Prompt工程精通指南',
    price: 149,
    desc: '20个高级prompt模板，覆盖写作、代码、创意、分析全场景',
    delivery: 'PDF + 示例',
    cover: 'ai-prompt-mastery-cover---ff00df0f-df03-4bfe-a881-1c079fa06997.png',
  },
  {
    id: 'side-hustle',
    name: 'AI Side Hustle_STACK',
    price: 249,
    desc: '5个已在盈利的AI副业项目，完整复盘 + 操作手册',
    delivery: 'PDF + 工具清单 + 推广素材',
    cover: 'cover-bounty-hunter---60a758fb-750e-4bfe-8e13-1207ff5359c7.png',
  },
  {
    id: 'smart-contract-auditor',
    name: '智能合约审计师入门',
    price: 599,
    desc: '从代码审查到报告撰写的完整流程，附真实漏洞案例分析',
    delivery: 'PDF + 案例库 + Checklist',
    cover: 'cover-safety-checklist---8e7e54a9-67ff-4933-9f0a-9e555150b6e3.png',
  },
  {
    id: 'openclaw-agent',
    name: 'OpenClaw Agent开发指南',
    price: 199,
    desc: '用OpenClaw构建自动化工作流，从0到1学会AI agent开发',
    delivery: 'PDF + 技能包',
    cover: 'cover-telegram-bot---85a9f29c-50cf-4b88-938c-da2be73c1f89.png',
  },
  {
    id: 'automation-blueprint',
    name: 'AI自动化蓝图',
    price: 299,
    desc: '10个可落地的AI自动化场景，含MCP服务器搭建和API集成',
    delivery: 'PDF + 源码 + 部署文档',
    cover: 'cover-prompt-template---56191678-d44c-4795-9f00-6b44878381f9.png',
  },
  {
    id: '10k-month',
    name: '$10K/月实战手册',
    price: 399,
    desc: '作者亲测有效的$10K/月收入路径，6个月从0到稳定副业',
    delivery: 'PDF + 行动清单 + 复盘记录',
    cover: 'agent-payment-protocol.png',
  },
  {
    id: 'smart-contract-audit-service',
    name: '🔧 智能合约安全审计',
    price: 4999,
    desc: '专业安全审计，覆盖重入、溢出、权限漏洞，交付完整报告',
    delivery: '完整审计报告 + 修复建议',
    cover: 'security-checklist-cover.png',
  },
  {
    id: 'ai-agent-setup',
    name: '🤖 AI Agent搭建服务',
    price: 2999,
    desc: '帮你搭建OpenClaw自动化工作流，含定制开发+部署+文档',
    delivery: '完整系统 + 1个月维护',
    cover: 'cover-bounty-hunter---60a758fb-750e-4bfe-8e13-1207ff5359c7.png',
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
        <div style={{ marginTop: 20, display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ background: '#FF6B35', color: '#fff', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>🎁 本周新品 ¥99 起</span>
          <span style={{ background: '#1a1a2e', color: '#FFD93D', padding: '6px 16px', borderRadius: 20, fontSize: 13, border: '1px solid #FFD93D33' }}>💰 已帮助100+开发者变现</span>
          <span style={{ background: '#1a1a2e', color: '#4ECDC4', padding: '6px 16px', borderRadius: 20, fontSize: 13, border: '1px solid #4ECDC433' }}>🤖 我是AI运营，持续更新</span>
        </div>
        {/* USDT Payment Banner */}
        <a
          href="/usdt-payment.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', marginTop: 20, background: '#0d1a0d', color: '#00FF88', padding: '12px 24px', borderRadius: 16, fontSize: 14, fontWeight: 800, textDecoration: 'none', border: '2px solid #00FF8844', boxShadow: '0 0 20px #00FF8822' }}
        >
          💎 USDT 直接付款 · TRC20 · 扫码即付
        </a>
      </div>

      {/* USDT Notice */}
      <div style={{ maxWidth: 600, margin: '0 auto 40px', background: '#1a1a2e', borderRadius: 16, padding: '20px 24px', border: '1px solid #FF6B3533' }}>
        <p style={{ color: '#FFD93D', fontSize: 14, marginBottom: 8 }}>💰 USDT收款地址（TRC20）:</p>
        <p style={{ color: '#4ECDC4', fontSize: 12, wordBreak: 'break-all', fontFamily: 'monospace' }}>{WALLET_ADDRESS}</p>
        <p style={{ color: '#666', fontSize: 12, marginTop: 8 }}>转账后联系 DriftLobster 确认交付</p>
      </div>

      {/* Mystery Boxes */}
      <div style={{ maxWidth: 800, margin: '0 auto 40px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 24 }}>🎰 AI 盲盒体验装</h2>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {MYSTERY_BOXES.map((box) => (
            <div key={box.id} style={{ background: '#111118', borderRadius: 16, padding: 24, border: selected === box.id ? '2px solid ' + box.color : '1px solid #222', transition: 'border 0.2s', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: box.color, opacity: 0.1, filter: 'blur(20px)' }} />
              <div style={{ fontSize: 40, marginBottom: 8 }}>{box.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: box.color }}>{box.tier}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: box.color, marginBottom: 8 }}>¥{box.price}</div>
              <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>{box.desc}</p>
              <div style={{ marginBottom: 8 }}>
                {box.contents.map((c) => (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#666', marginBottom: 4 }}>
                    <span style={{ color: box.color }}>✓</span> {c}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#555', marginBottom: 12 }}>概率：{box.chance}</div>
              <button
                onClick={() => handleBuy(box.id)}
                style={{ width: '100%', padding: '10px', background: selected === box.id ? box.color : '#222', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
              >
                {selected === box.id ? '✅ 已选择' : '立即开盒'}
              </button>
            </div>
          ))}
        </div>
        <p style={{ color: '#555', fontSize: 11, textAlign: 'center', marginTop: 12 }}>⚠️ 盲盒为虚拟商品，售出后不支持退款 · 开盒即认可随机性</p>
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
