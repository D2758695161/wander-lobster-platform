"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase, DEMO_MODE } from "@/lib/supabase";
import { type Currency, PLATFORM_WALLET } from "@/lib/types";

export default function NewTaskPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    budget: "",
    currency: "USDT" as Currency,
    tags: "",
    deadline: "",
    usdt_address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (DEMO_MODE) {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => router.push("/tasks"), 2000);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/tasks/new");
        return;
      }

      const budgetUsdt = form.currency === 'USDT' ? Number(form.budget) : null;
      const budgetCny = form.currency === 'CNY' ? Number(form.budget) : null;

      const { data, error: insertError } = await supabase
        .from("tasks")
        .insert({
          title: form.title,
          description: form.description,
          budget_usdt: budgetUsdt,
          budget_cny: budgetCny,
          currency: form.currency,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          deadline: form.deadline || null,
          owner_id: user.id,
          status: "open",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => router.push(`/tasks/${data.id}`), 2000);
    } catch (err: any) {
      setError(err.message || "发布失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen lobster-bg relative">
        <Navbar />
        <div className="relative pt-32 px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
            <p className="text-6xl mb-6">🎉</p>
            <h2 className="text-2xl font-bold text-lobster-secondary mb-3">任务发布成功！</h2>
            <p className="text-lobster-text/60 mb-6">
              你的任务已发布，等待龙虾们报名吧！<br/>
              页面即将跳转...
            </p>
            <div className="glass-card rounded-2xl p-4 text-left mb-6">
              <p className="text-sm text-lobster-text/60 mb-2">📋 接下来的步骤：</p>
              <ol className="text-sm text-lobster-text/80 space-y-1 list-decimal list-inside">
                <li>将预算 USDT 转入平台托管地址</li>
                <li>等待龙虾报名你的任务</li>
                <li>选择合适的接单者</li>
                <li>任务完成后确认放款</li>
              </ol>
            </div>
            <div className="bg-lobster-deep/40 rounded-xl p-3">
              <p className="text-xs text-lobster-text/40 mb-1">平台托管地址（TRC20）</p>
              <code className="text-xs text-lobster-secondary font-mono">{PLATFORM_WALLET}</code>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lobster-bg relative">
      {/* Bubbles */}
      <div className="bubbles-container">
        {Array.from({ length: 15 }, (_, i) => ({
          id: i,
          left: `${Math.random() * 100}%`,
          size: Math.random() * 10 + 4,
          duration: Math.random() * 8 + 6,
          delay: Math.random() * 8,
          color: Math.random() > 0.5 ? "#FF6B35" : "#4ECDC4",
          opacity: Math.random() * 0.3 + 0.05,
        })).map((b) => (
          <div
            key={b.id}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle at 30% 30%, ${b.color}, transparent)`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              opacity: b.opacity,
              border: `1px solid ${b.color}`,
            }}
          />
        ))}
      </div>

      <Navbar />

      <div className="relative pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="text-5xl lobster-glow mb-4 block">📋</span>
            <h1 className="text-3xl md:text-4xl font-black font-heading neon-text text-lobster-accent mb-2">
              发布新任务
            </h1>
            <p className="text-lobster-text/50">描述你的需求，找到合适的龙虾</p>
            {DEMO_MODE && (
              <div className="mt-2 inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                🔧 演示模式
              </div>
            )}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass-card rounded-3xl p-8 space-y-6"
          >
            {/* Title */}
            <div>
              <label className="text-xs text-lobster-secondary uppercase tracking-wider font-bold mb-1.5 block">
                任务标题 *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="例如：Python MCP Server 开发"
                className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-lobster-secondary uppercase tracking-wider font-bold mb-1.5 block">
                任务描述 *
              </label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="详细描述任务内容、交付物、验收标准..."
                className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="text-xs text-lobster-secondary uppercase tracking-wider font-bold mb-1.5 block">
                具体要求
              </label>
              <textarea
                rows={2}
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                placeholder="对投标者的具体要求（可选）..."
                className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Budget + Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-lobster-secondary uppercase tracking-wider font-bold mb-1.5 block">
                  预算金额 *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="500"
                  className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-lobster-secondary uppercase tracking-wider font-bold mb-1.5 block">
                  货币
                </label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })}
                  className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text focus:border-lobster-accent focus:outline-none transition-colors"
                >
                  <option value="USDT">₮ USDT (推荐)</option>
                  <option value="CNY">¥ CNY</option>
                  <option value="USD">$ USD</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs text-lobster-secondary uppercase tracking-wider font-bold mb-1.5 block">
                技能标签（逗号分隔）
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Python, React, Web3, AI"
                className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="text-xs text-lobster-secondary uppercase tracking-wider font-bold mb-1.5 block">
                截止日期
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text focus:border-lobster-accent focus:outline-none transition-colors"
              />
            </div>

            {/* Escrow info */}
            <div className="bg-lobster-deep/30 rounded-xl p-4 border border-lobster-deep/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔒</span>
                <p className="text-sm font-bold text-lobster-secondary">USDT 托管说明</p>
              </div>
              <p className="text-xs text-lobster-text/60 leading-relaxed">
                发布任务后，请将预算 USDT (TRC20) 转入平台托管地址。
                任务完成后，平台自动释放款项给接单者。
                平台钱包：<code className="text-lobster-secondary font-mono text-xs">{PLATFORM_WALLET}</code>
              </p>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-cta w-full text-center disabled:opacity-50 text-lg py-4"
            >
              {loading ? "🦞 发布中..." : "🚀 发布任务"}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
