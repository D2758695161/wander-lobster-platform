"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, DEMO_MODE } from "@/lib/supabase";

function LoginContent() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (DEMO_MODE) {
      router.push(redirect);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "登录失败，请检查邮箱和密码");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    if (DEMO_MODE) {
      router.push(redirect);
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}${redirect}`,
      },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-4xl lobster-glow">🦞</span>
          <span className="font-heading font-bold text-2xl text-lobster-text">流浪龙虾</span>
        </Link>
        <p className="text-lobster-text/50 text-sm mt-2">欢迎回来，龙虾！</p>
        {DEMO_MODE && (
          <div className="mt-2 inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
            🔧 演示模式（未配置 Supabase）
          </div>
        )}
      </div>

      <div className="glass-card rounded-3xl p-8">
        {/* GitHub OAuth */}
        <button
          onClick={handleGitHubLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-lobster-deep/60 text-lobster-text hover:border-lobster-secondary/60 hover:text-lobster-secondary transition-all mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span className="font-medium text-sm">用 GitHub 登录</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-lobster-deep/40" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-lobster-primary px-3 text-lobster-text/30">或</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-lobster-secondary uppercase tracking-wider font-bold mb-1.5 block">
              邮箱
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="lobster@example.com"
              className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-lobster-secondary uppercase tracking-wider font-bold mb-1.5 block">
              密码
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-lobster-deep/40 border border-lobster-deep/60 rounded-xl px-4 py-3 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors text-sm"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-cta w-full text-center disabled:opacity-50"
          >
            {loading ? "🦞 登录中..." : "🦞 登录"}
          </button>
        </form>

        <div className="flex items-center justify-between mt-4">
          <Link href="/register" className="text-sm text-lobster-secondary hover:text-lobster-accent transition-colors">
            没有账号？注册 →
          </Link>
          <a href="#" className="text-sm text-lobster-text/40 hover:text-lobster-text/60 transition-colors">
            忘记密码？
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen lobster-bg relative flex items-center justify-center px-4">
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Suspense fallback={
          <div className="min-h-screen lobster-bg flex items-center justify-center">
            <div className="text-lobster-text/50 animate-pulse">加载中...</div>
          </div>
        }>
          <LoginContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
