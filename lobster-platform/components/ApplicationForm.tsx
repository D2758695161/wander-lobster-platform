"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase, DEMO_MODE } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Application } from "@/lib/types";

interface ApplicationFormProps {
  taskId: string;
  taskTitle: string;
  budget: number;
  currency: string;
  ownerId: string;
}

export default function ApplicationForm({ taskId, taskTitle, budget, currency, ownerId }: ApplicationFormProps) {
  const [form, setForm] = useState({ proposal: "", price_offered: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (DEMO_MODE) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?redirect=/tasks/${taskId}`);
        return;
      }

      const { error } = await supabase.from("applications").insert({
        task_id: taskId,
        user_id: user.id,
        proposal: form.proposal,
        price_offered: Number(form.price_offered),
      });

      if (error) {
        if (error.code === '23505') {
          throw new Error("你已经报名过这个任务了");
        }
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "报名失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <p className="text-5xl mb-4">🎉</p>
        <p className="text-xl font-bold text-lobster-secondary mb-2">报名成功！</p>
        <p className="text-lobster-text/60 text-sm">
          雇主会尽快联系你，请保持联系方式畅通
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-lobster-text font-heading">报名申请</h3>
        <span className="text-xs text-lobster-text/40">任务：{taskTitle}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-lobster-secondary uppercase tracking-wider font-bold mb-1.5 block">
            自我介绍 / 优势 *
          </label>
          <textarea
            required
            rows={4}
            value={form.proposal}
            onChange={(e) => setForm({ ...form, proposal: e.target.value })}
            placeholder="介绍你的相关经验、技能、为什么适合这个任务..."
            className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors text-sm resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-lobster-secondary uppercase tracking-wider font-bold mb-1.5 block">
            你的报价 *
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              required
              min={1}
              value={form.price_offered}
              onChange={(e) => setForm({ ...form, price_offered: e.target.value })}
              placeholder={`例如：${budget * 0.8}`}
              className="flex-1 bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors text-sm"
            />
            <span className="text-lobster-text/40 font-medium">{currency}</span>
          </div>
          <p className="text-xs text-lobster-text/30 mt-1">
            任务预算参考：{budget} {currency}，你可以报更低的价格竞争
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !form.proposal || !form.price_offered}
          className="btn-cta w-full text-center disabled:opacity-50"
        >
          {loading ? "🦞 提交中..." : "📮 提交报名"}
        </button>

        {DEMO_MODE && (
          <p className="text-center text-xs text-lobster-text/30">
            🔧 演示模式 - 报名功能需要配置 Supabase
          </p>
        )}
      </form>
    </div>
  );
}
