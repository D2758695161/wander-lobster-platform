"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import UserAvatar from "@/components/UserAvatar";
import { supabase, DEMO_MODE, DEMO_TASKS, DEMO_REVIEWS } from "@/lib/supabase";
import { type Profile, type Task, type Review, LEVEL_EMOJI, LEVEL_COLORS, CURRENCY_SYMBOLS, STATUS_LABELS, type Level } from "@/lib/types";

export default function ProfilePage() {
  const params = useParams();
  const profileId = params.id as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (DEMO_MODE || profileId === 'demo-user') {
        const demoProfile: Profile = {
          id: 'demo-user',
          username: '钳神·阿强',
          email: 'demo@lobster.io',
          avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=demo',
          bio: 'AI Safety 专家 · 专注 LLM Tooling 和 MCP Server 开发。已完成 50+ 项目，客户包括多家 AI Startup。',
          usdt_address_trc20: 'TPdemo1234567890ABC',
          reputation: 95,
          shell_points: 5200,
          level: '龙虾钳神',
          created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        };
        setProfile(demoProfile);
        setTasks(DEMO_TASKS.slice(0, 3));
        setReviews(DEMO_REVIEWS as Review[]);
        setLoading(false);
        return;
      }

      try {
        const [profileRes, tasksRes, reviewsRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', profileId).single(),
          supabase
            .from('tasks')
            .select('*, owner:profiles!owner_id(*)')
            .eq('assignee_id', profileId)
            .eq('status', 'completed')
            .limit(5),
          supabase
            .from('reviews')
            .select('*, from_profile:profiles!from_user(*), to_profile:profiles!to_user(*), task:tasks(*)')
            .eq('to_user', profileId)
            .order('created_at', { ascending: false })
            .limit(10),
        ]);

        setProfile(profileRes.data);
        setTasks(tasksRes.data || []);
        setReviews(reviewsRes.data || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen lobster-bg">
        <Navbar />
        <div className="relative pt-28 px-6">
          <div className="max-w-4xl mx-auto py-20 animate-pulse space-y-6">
            <div className="h-40 bg-lobster-deep/40 rounded-2xl" />
            <div className="h-60 bg-lobster-deep/40 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen lobster-bg">
        <Navbar />
        <div className="relative pt-32 px-6 text-center">
          <p className="text-5xl mb-4">🦞</p>
          <p className="text-lobster-text/50 text-lg">龙虾档案不存在</p>
          <Link href="/tasks" className="btn-cta inline-block mt-6">返回任务大厅</Link>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

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
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <UserAvatar user={profile} size="lg" showLevel />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl font-black font-heading text-lobster-text">
                    {profile.username}
                  </h1>
                  <span
                    className="text-sm px-3 py-0.5 rounded-full font-bold"
                    style={{
                      background: `${LEVEL_COLORS[profile.level as Level]}22`,
                      color: LEVEL_COLORS[profile.level as Level],
                      border: `1px solid ${LEVEL_COLORS[profile.level as Level]}44`,
                    }}
                  >
                    {LEVEL_EMOJI[profile.level as Level]} {profile.level}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`text-lg ${i < Math.round(profile.reputation / 20) ? "text-yellow-400" : "text-lobster-deep/40"}`}>
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-lobster-secondary font-bold ml-1">{profile.reputation}/100</span>
                  </div>
                  <span className="text-lobster-text/40">·</span>
                  <span className="text-sm text-lobster-text/60">
                    🐚 {profile.shell_points} 壳点
                  </span>
                  <span className="text-lobster-text/40">·</span>
                  <span className="text-sm text-lobster-text/60">
                    加入于 {new Date(profile.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
                  </span>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-lobster-text/80 text-sm leading-relaxed mb-4">
                    {profile.bio}
                  </p>
                )}

                {/* TRC20 address */}
                {profile.usdt_address_trc20 && (
                  <div className="bg-lobster-deep/30 rounded-xl px-4 py-2 inline-flex items-center gap-2">
                    <span className="text-xs text-lobster-text/40">TRC20:</span>
                    <code className="text-xs text-lobster-secondary font-mono">
                      {profile.usdt_address_trc20}
                    </code>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex-shrink-0">
                <Link
                  href="/tasks/new"
                  className="btn-cta text-sm"
                >
                  给他发任务
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats + Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Completed tasks */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold text-lobster-secondary mb-4 uppercase tracking-wider">
                  已完成任务 ({tasks.length})
                </h2>
                {tasks.length === 0 ? (
                  <p className="text-lobster-text/40 text-sm text-center py-8">暂无已完成任务</p>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => {
                      const budget = task.currency === 'CNY' ? task.budget_cny : task.budget_usdt;
                      const symbol = CURRENCY_SYMBOLS[task.currency] || '$';
                      return (
                        <Link key={task.id} href={`/tasks/${task.id}`} className="block">
                          <div className="flex items-center justify-between gap-3 p-3 bg-lobster-deep/30 rounded-xl hover:bg-lobster-deep/50 transition-colors">
                            <div className="flex-1">
                              <p className="text-sm font-bold text-lobster-text line-clamp-1">{task.title}</p>
                              {task.owner && (
                                <p className="text-xs text-lobster-text/40">雇主：{task.owner.username}</p>
                              )}
                            </div>
                            <span className="text-sm font-bold text-lobster-accent flex-shrink-0">
                              {symbol}{budget?.toLocaleString()}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold text-lobster-secondary mb-4 uppercase tracking-wider">
                  评价 ({reviews.length})
                </h2>
                {reviews.length === 0 ? (
                  <p className="text-lobster-text/40 text-sm text-center py-8">暂无评价</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-lobster-deep/30 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          {review.from_profile && (
                            <span className="text-sm font-bold text-lobster-text">
                              {review.from_profile.username}
                            </span>
                          )}
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} className={`text-xs ${i < review.rating ? "text-yellow-400" : "text-lobster-deep/40"}`}>★</span>
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-xs text-lobster-text/70 leading-relaxed">{review.comment}</p>
                        )}
                        <p className="text-xs text-lobster-text/30 mt-2">
                          {new Date(review.created_at).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
