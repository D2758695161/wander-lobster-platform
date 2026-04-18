"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const services = [
  {
    icon: "🐦",
    title: "Twitter/X 智能运营",
    titleEn: "Twitter/X Automation",
    description: "自动发帖、互动、关键词监控、热点追踪，让你的账号24小时活跃吸粉",
    features: ["AI生成英文推文", "自动关注/点赞/回复", "关键词监控+自动回复", "热点自动蹭流量", "定时发布日历"],
    price: "¥999/月",
    priceEn: "$139/mo",
  },
  {
    icon: "📹",
    title: "YouTube Shorts 批量生产",
    titleEn: "YouTube Shorts Generator",
    description: "AI自动生成短视频脚本 + TTS配音 + 字幕，一键产出适合病毒传播的短视频",
    features: ["AI脚本生成", "多语音TTS配音", "自动字幕+特效", "批量上传发布", "数据追踪分析"],
    price: "¥1999/月",
    priceEn: "$279/mo",
  },
  {
    icon: "📧",
    title: "Cold Email 外推",
    titleEn: "Cold Email Outreach",
    description: "精准获客，自动发送个性化开发信，支持Gmail/163邮箱，提供邮件模板库",
    features: ["多邮箱账号轮发", "个性化模板变量", "自动追踪打开率", "Gmail/163双通道", "回复自动通知"],
    price: "¥699/月",
    priceEn: "$99/mo",
  },
  {
    icon: "🔗",
    title: "联盟营销挂链",
    titleEn: "Affiliate Link Automation",
    description: "自动抓取平台最新优惠，生成推广内容，一键分发到多个平台追踪转化",
    features: ["Amazon/AliExpress对接", "自动生成推广文案", "多平台分发", "佣金自动追踪", "数据报表生成"],
    price: "¥1499/月",
    priceEn: "$209/mo",
  },
  {
    icon: "🌐",
    title: "本地商家触达",
    titleEn: "Local Business Outreach",
    description: "抓取大众点评/美团商家信息，自动发送合作开发信，支持按行业/地区筛选",
    features: ["商家数据抓取", "行业分类筛选", "批量邮件发送", "合作模板定制", "跟进提醒系统"],
    price: "¥1299/月",
    priceEn: "$179/mo",
  },
  {
    icon: "🤖",
    title: "全流程定制开发",
    titleEn: "Custom Automation",
    description: "根据你的业务场景，定制开发专属的自动化营销系统，支持私有化部署",
    features: ["需求深度分析", "系统架构设计", "私有化部署", "API对接集成", "7×24运维支持"],
    price: "¥面议",
    priceEn: "Custom",
  },
];

const cases = [
  {
    emoji: "🦞",
    client: "某出海SaaS创业公司",
    service: "Twitter运营 + Cold Email",
    result: "3个月内从0到50k推特粉丝，月均获取50+优质销售线索，成本降低70%",
    metrics: "50k粉丝 | 50+线索/月 | -70%成本",
  },
  {
    emoji: "🏪",
    client: "某本地餐饮连锁品牌",
    service: "本地商家触达 + 联盟挂链",
    result: "2周内触达300+餐饮商家，建立100+合作渠道，平台订单增长35%",
    metrics: "300+商家 | 100+渠道 | +35%订单",
  },
  {
    emoji: "📱",
    client: "某TikTok电商玩家",
    service: "YouTube Shorts批量生产",
    result: "每天自动生成30条短剧剪辑，月均播放量500万，联盟佣金收入$8000",
    metrics: "30条/天 | 500万播放 | $8000佣金",
  },
];

export default function MarketingPage() {
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [form, setForm] = useState({ name: "", wechat: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const t = (zh: string, en: string) => lang === "zh" ? zh : en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store in localStorage for backup
    const leads = JSON.parse(localStorage.getItem("lobster_leads") || "[]");
    leads.push({ ...form, ts: new Date().toISOString() });
    localStorage.setItem("lobster_leads", JSON.stringify(leads));
    setSubmitted(true);
    // Also try to open WeChat as primary contact method
    if (form.wechat) {
      // Show WeChat as next step
    }
  };

  return (
    <div style={{ background: "var(--lobster-bg)", minHeight: "100vh", color: "var(--lobster-text)" }}>
      {/* Header */}
      <header style={{ background: "rgba(10,22,40,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(78,205,196,0.1)" }} className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            <span>🦞</span>
            <span>{t("流浪龙虾", "Wander Lobster")}</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/tasks" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
              {t("任务市场", "Task Market")}
            </Link>
            <Link href="/shop" className="text-sm px-3 py-1 rounded-full bg-lobster-accent/10 border border-lobster-accent/30 text-lobster-accent font-bold hover:bg-lobster-accent/20 transition-colors">
              🛒 {t("数字商店", "Shop")}
            </Link>
            <button
              onClick={() => setLang(l => l === "zh" ? "en" : "zh")}
              className="text-xs px-3 py-1 rounded-full border border-lobster-secondary/30 text-lobster-secondary hover:bg-lobster-secondary/10 transition-colors"
            >
              {lang === "zh" ? "EN" : "中文"}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full" style={{ background: "var(--lobster-accent)", filter: "blur(100px)" }} />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full" style={{ background: "var(--lobster-secondary)", filter: "blur(120px)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm" style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)" }}>
              <span>⚡</span>
              <span>{t("Powered by AI Automation", "AI驱动的营销自动化")}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              <span style={{ color: "var(--lobster-text)" }}>{t("让AI替你", "Let AI")}</span>
              <br />
              <span style={{ color: "var(--lobster-accent)" }}>{t("做营销、拿客户", "do Marketing & Get Clients")}</span>
            </h1>
            <p className="text-xl opacity-70 mb-10 max-w-2xl mx-auto">
              {t(
                "Twitter运营、YouTube Shorts、Cold Email、联盟营销——全部自动化。你专注成交，其他交给我们。",
                "Twitter automation, YouTube Shorts, Cold Email, Affiliate marketing — all automated. You focus on closing deals, we handle the rest."
              )}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#services" className="px-8 py-3 rounded-xl font-bold text-white transition-transform hover:-translate-y-1" style={{ background: "var(--lobster-accent)" }}>
                {t("查看服务 →", "View Services →")}
              </a>
              <a href="#contact" className="px-8 py-3 rounded-xl font-bold transition-colors border-2" style={{ borderColor: "var(--lobster-secondary)", color: "var(--lobster-secondary)" }}>
                {t("预约咨询", "Book Consultation")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6" style={{ background: "var(--lobster-primary)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["100+", t("已服务客户", "Clients Served")],
            ["50万+", t("覆盖粉丝", "Followers Reached")],
            ["24/7", t("自动运行", "Auto Running")],
            ["3x", t("效率提升", "Efficiency Boost")],
          ].map(([num, label]) => (
            <div key={label as string}>
              <p className="text-3xl font-black" style={{ color: "var(--lobster-accent)" }}>{num}</p>
              <p className="text-sm opacity-50 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--lobster-text)" }}>
              {t("AI营销自动化全家桶", "AI Marketing Automation Suite")}
            </h2>
            <p className="opacity-60">
              {t("选择你需要的服务，次日即可启动。全部基于MoneyPrinterV2开源引擎二次开发。", "Pick what you need, launch tomorrow. All powered by MoneyPrinterV2 open-source engine.")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="rounded-2xl p-6 border transition-all hover:-translate-y-1"
                style={{ background: "var(--lobster-primary)", borderColor: "rgba(78,205,196,0.15)" }}
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--lobster-secondary)" }}>
                  {lang === "zh" ? s.title : s.titleEn}
                </h3>
                <p className="text-sm opacity-60 mb-4">{s.description}</p>
                <ul className="space-y-1.5 mb-6">
                  {s.features.map(f => (
                    <li key={f} className="text-xs flex items-center gap-2">
                      <span style={{ color: "var(--lobster-accent)" }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-end justify-between pt-4 border-t" style={{ borderColor: "rgba(78,205,196,0.1)" }}>
                  <div>
                    <p className="text-xs opacity-40">{t("起步价", "From")}</p>
                    <p className="text-xl font-black" style={{ color: "var(--lobster-accent)" }}>{s.price}</p>
                    <p className="text-xs opacity-40">{s.priceEn}</p>
                  </div>
                  <Link
                    href="#contact"
                    className="text-xs px-4 py-2 rounded-lg font-bold text-white"
                    style={{ background: "var(--lobster-secondary)" }}
                  >
                    {t("咨询", "Inquire")}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="py-20 px-6" style={{ background: "var(--lobster-primary)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12" style={{ fontFamily: "var(--font-heading)" }}>
            {t("真实案例", "Real Results")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {cases.map((c, i) => (
              <motion.div
                key={c.client}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl p-6"
                style={{ background: "var(--lobster-bg)", border: "1px solid rgba(255,107,53,0.2)" }}
              >
                <div className="text-3xl mb-3">{c.emoji}</div>
                <h3 className="font-bold mb-1">{c.client}</h3>
                <p className="text-xs mb-3" style={{ color: "var(--lobster-secondary)" }}>{c.service}</p>
                <p className="text-sm opacity-70 mb-4">{c.result}</p>
                <p className="text-xs font-mono opacity-50">{c.metrics}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12" style={{ fontFamily: "var(--font-heading)" }}>
            {t("启动流程", "How It Works")}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: t("咨询需求", "Consult"), desc: t("微信聊需求，30分钟搞清楚你要什么", "Wechat call, 30min to understand your needs") },
              { step: "02", title: t("方案定制", "Customize"), desc: t("根据你的业务场景，配置AI营销流水线", "Configure pipeline for your business") },
              { step: "03", title: t("部署上线", "Deploy"), desc: t("次日启动，自动运行，你睡一觉就有线索", "Launch next day, wake up to leads") },
              { step: "04", title: t("优化迭代", "Optimize"), desc: t("数据驱动，每周优化，提升ROI", "Weekly optimization, data-driven ROI") },
            ].map((p, i) => (
              <div key={p.step} className="text-center">
                <div className="text-5xl font-black opacity-10 mb-2">{p.step}</div>
                <h3 className="font-bold mb-2" style={{ color: "var(--lobster-accent)" }}>{p.title}</h3>
                <p className="text-sm opacity-50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6" style={{ background: "var(--lobster-primary)" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            {t("预约免费咨询", "Book a Free Consultation")}
          </h2>
          <p className="text-center opacity-50 mb-10">
            {t("告诉我你的业务，我给你一套自动化方案", "Tell me about your business, I'll design an automation plan")}
          </p>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 rounded-2xl"
              style={{ background: "var(--lobster-bg)", border: "1px solid rgba(78,205,196,0.3)" }}
            >
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">{t("收到！", "Got it!")}</h3>
              <p className="opacity-60 mb-6">{t("24小时内我会联系你，微信见", "I'll reach out within 24hrs on WeChat")}</p>
              <div className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl" style={{ background: "rgba(78,205,196,0.08)", border: "1px solid rgba(78,205,196,0.2)" }}>
                <p className="text-sm font-bold" style={{ color: "var(--lobster-secondary)" }}>{t("或直接扫码联系", "or scan to contact directly")}</p>
                <div className="text-6xl">🦞</div>
                <p className="text-xs opacity-50">{t("蝌\\/X: LobsterAuto", "WeChat/X: LobsterAuto")}</p>
                <a
                  href="mailto:yitong_ai@sendclaw.com?subject=流浪龙虾平台咨询"
                  className="mt-2 text-sm px-6 py-2 rounded-xl font-bold text-white transition-all hover:opacity-90"
                  style={{ background: "var(--lobster-secondary)" }}
                >
                  📧 {t("发邮件给我", "Email Me")}
                </a>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { field: "name", label: t("你的名字", "Your Name"), type: "text", placeholder: "张三" },
                { field: "wechat", label: t("微信号", "WeChat ID"), type: "text", placeholder: t("方便联系", "For follow-up") },
                { field: "email", label: t("邮箱（选填）", "Email (optional)"), type: "email", placeholder: "zhangsan@example.com" },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-xs opacity-50 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.field as keyof typeof form]}
                    onChange={e => setForm(s => ({ ...s, [f.field]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-lobster-accent"
                    style={{ background: "var(--lobster-bg)", borderColor: "rgba(78,205,196,0.2)", color: "var(--lobster-text)" }}
                    required={f.field !== "email"}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs opacity-50 mb-1">{t("感兴趣的服务", "Services of Interest")}</label>
                <select
                  value={form.service}
                  onChange={e => setForm(s => ({ ...s, service: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-lobster-accent"
                  style={{ background: "var(--lobster-bg)", borderColor: "rgba(78,205,196,0.2)", color: "var(--lobster-text)" }}
                >
                  <option value="">{t("选择一个服务", "Select a service")}</option>
                  {services.map(s => (
                    <option key={s.title} value={s.title}>{s.icon} {s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs opacity-50 mb-1">{t("说说你的情况", "Tell us about your situation")}</label>
                <textarea
                  placeholder={t("我是做XX业务的，目前在做XX，想解决XX问题...", "I'm in XX business, currently doing XX, want to solve XX...")}
                  rows={3}
                  value={form.message}
                  onChange={e => setForm(s => ({ ...s, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-lobster-accent resize-none"
                  style={{ background: "var(--lobster-bg)", borderColor: "rgba(78,205,196,0.2)", color: "var(--lobster-text)" }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, var(--lobster-accent), #ff8c5a)" }}
              >
                {t("提交咨询 →", "Submit Inquiry →")}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs opacity-30">
        <p>
          {t("© 2026 流浪龙虾平台 · 所有服务基于AI自动化工具", "© 2026 Wander Lobster Platform · Powered by AI Automation Tools")}
        </p>
      </footer>
    </div>
  );
}
