'use client';

import { useState } from 'react';

const PLANS = [
  {
    id: 'dev-assistant',
    name: '🛠️ 开发助手',
    price: 299,
    period: '/月',
    desc: '你的私人AI开发工程师',
    features: [
      '每天帮你完成1个代码任务',
      'Bug修复 + 功能开发',
      'GitHub PR提交',
      '代码审查',
      '24小时内响应',
    ],
    limits: '每月最多30个任务',
    color: '#4ECDC4',
  },
  {
    id: 'bounty-hunter',
    name: '🎯 Bounty猎人',
    price: 199,
    period: '/月',
    desc: '帮你找钱，每周3个PR',
    features: [
      '每周发现并提交3个GitHub PR',
      '智能合约安全审查',
      'Bug修复 + 功能实现',
      '完整PR模板 + 邮件话术',
      '每周汇报',
    ],
    limits: '每周最多3个PR',
    color: '#FFD93D',
  },
  {
    id: 'automation-agent',
    name: '⚡ 自动化Agent',
    price: 499,
    period: '/月',
    desc: '你的24/7 AI员工',
    features: [
      '业务流程自动化',
      '社交媒体运营',
      '数据收集 + 分析报告',
      '竞品监控',
      '优先响应',
    ],
    limits: '无限任务',
    color: '#FF6B35',
  },
  {
    id: 'full-stack',
    name: '🚀 全栈包',
    price: 999,
    period: '/月',
    desc: '完整AI开发团队',
    features: [
      '开发助手 + Bounty猎人 + 自动化',
      'MVP快速搭建',
      '智能合约开发/审计',
      '专属Discord频道',
      '2小时内响应',
    ],
    limits: '无限所有服务',
    color: '#A855F7',
  },
];

const USDT_ADDR = 'TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN';

export default function SubscriptionsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#FF6B35', marginBottom: 8 }}>
          AI Agent 订阅服务
        </h1>
        <p style={{ color: '#888', fontSize: 16 }}>
          你的24/7 AI员工 · 按月订阅 · 随时取消
        </p>
      </div>

      {/* Payment Notice */}
      <div style={{ maxWidth: 600, margin: '0 auto 40px', background: '#1a1a2e', borderRadius: 16, padding: '20px 24px', border: '1px solid #FF6B3533' }}>
        <p style={{ color: '#FFD93D', fontSize: 14, marginBottom: 8 }}>💰 USDT收款地址（TRC20）:</p>
        <p style={{ color: '#4ECDC4', fontSize: 12, wordBreak: 'break-all', fontFamily: 'monospace' }}>{USDT_ADDR}</p>
        <p style={{ color: '#666', fontSize: 12, marginTop: 8 }}>转账后联系 DriftLobster 确认订阅</p>
      </div>

      {/* Plans */}
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              style={{
                background: '#111118',
                borderRadius: 20,
                padding: 28,
                border: selected === plan.id ? `2px solid ${plan.color}` : '1px solid #222',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {plan.id === 'full-stack' && (
                <div style={{ position: 'absolute', top: 12, right: -20, background: '#A855F7', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 24px', transform: 'rotate(45deg)' }}>
                  最高价值
                </div>
              )}
              <div style={{ fontSize: 32, marginBottom: 12 }}>{plan.name}</div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: plan.color }}>¥{plan.price}</span>
                <span style={{ color: '#666', fontSize: 14 }}>{plan.period}</span>
              </div>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 16 }}>{plan.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ color: '#aaa', fontSize: 13, marginBottom: 8, paddingLeft: 20, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: plan.color }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <p style={{ color: '#555', fontSize: 11, marginBottom: 16 }}>{plan.limits}</p>
              <button
                onClick={() => setSelected(plan.id === selected ? null : plan.id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: selected === plan.id ? plan.color : '#222',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                {selected === plan.id ? '✅ 已选择' : '选择此方案'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Plan */}
      {selected && (
        <div style={{ maxWidth: 500, margin: '40px auto', background: '#111118', borderRadius: 20, padding: 32, border: '1px solid #FF6B3544' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16, textAlign: 'center' }}>
            订阅 {PLANS.find(p => p.id === selected)?.name}
          </h3>
          <div style={{ background: '#0d0d14', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>📋 订阅步骤:</p>
            <ol style={{ color: '#aaa', fontSize: 13, paddingLeft: 20, lineHeight: 2 }}>
              <li>转账 <strong style={{ color: '#FF6B35' }}>¥{PLANS.find(p => p.id === selected)?.price}/月</strong> 到TRC20地址</li>
              <li>截图支付凭证</li>
              <li>加微信 <strong style={{ color: '#07C160' }}>DriftLobster</strong> 发截图</li>
              <li>24小时内开通服务</li>
            </ol>
          </div>
          <p style={{ color: '#666', fontSize: 12, textAlign: 'center' }}>
            支持月付，随时可取消 · 联系 DriftLobster 详谈
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 60, color: '#444', fontSize: 12 }}>
        <p>🤖 一筒AI · 你的24/7开发团队</p>
      </div>
    </div>
  );
}
