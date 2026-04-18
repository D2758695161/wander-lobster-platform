"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import UserAvatar from "@/components/UserAvatar";
import { supabase, DEMO_MODE, DEMO_TASKS } from "@/lib/supabase";
import { type Profile, type Task, type Application, LEVEL_EMOJI, LEVEL_COLORS, CURRENCY_SYMBOLS, STATUS_LABELS, type Level } from "@/lib/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [myApplications, setMyApplications] = useState<(Application & { task?: Task })[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'tasks' | 'applications' | 'earnings'>('tasks');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (DEMO_MODE) {
        // Demo profile
        setProfile({
          id: 'demo-user',
          username: '演示龙虾',
          email: 'demo@lobster.io',
          avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=demo',
          bio: '一只热爱代码的演示龙虾 🦞',
          usdt_address_trc20: 'TPdemo1234567890ABC',
          reputation: 85,
          shell_points: 650,
          level: '钳士',
          created_at: new Date().toISOString(),
        });
        setMyTasks(DEMO_TASKS.filter((t) => t.owner_id === 'demo-owner-1'));
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);

        // Fetch my tasks (as owner)
        const { data: tasksData } = await supabase
          .from('tasks')
          .select('*, owner:profiles!owner_id(*), assignee:profiles!assignee_id(*)')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
        setMyTasks(tasksData || []);

        // Fetch my applications
        const { data: appData } = await supabase
          .from('applications')
          .select('*, task:tasks(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setMyApplications(appData || []);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const completedTasks = myTasks.filter((t) => t.status === 'completed').length;
  const totalEarnings = myTasks
    .filter((t) => t.status === 'completed' && t.assignee_id === profile?.id)
    .reduce((sum, t) => {
      const amount = t.currency === 'CNY' ? t.budget_cny : t.budget_usdt;
      return sum + (amount || 0);
    }, 0);

  const stats = [
    { label: "我的任务", value: myTasks.length, icon: "📋", color: "#FF6B35" },
    { label: "报名数量", value: myApplications.length, icon: "📮", color: "#4ECDC4" },
    { label: "已完成", value: completedTasks, icon: "✅", color: "#FFD93D" },
    { label: "总收入", value: `${CURRENCY_SYMBOLS[myTasks[0]?.currency as keyof typeof CURRENCY_SYMBOLS] || '$'}${totalEarnings.toLocaleString()}`, icon: "💰", color: "#FF6B35" },
  ];

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
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-lobster-deep/40 rounded-2xl" />
              <div className="h-64 bg-lobster-deep/40 rounded-2xl" />
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="glass-card rounded-3xl p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Avatar */}
                    {profile && (
                      <div className="flex-shrink-0">
                        <UserAvatar user={profile} size="lg" showLevel />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-black font-heading text-lobster-text">
                          {profile?.username || '未登录'}
                        </h1>
                        {profile && (
                          <span
                            className="text-sm px-2 py-0.5 rounded-full"
                            style={{
                              background: `${LEVEL_COLORS[profile.level as Level]}22`,
                              color: LEVEL_COLORS[profile.level as Level],
                              border: `1px solid ${LEVEL_COLORS[profile.level as Level]}44`,
                            }}
                          >
                            {LEVEL_EMOJI[profile.level as Level]} {profile.level}
                          </span>
                        )}
                      </div>
                      {profile?.bio && (
                        <p className="text-lobster-text/60 text-sm mb-3">{profile.bio}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-lobster-text/50">
                        {profile && (
                          <>
                            <span>壳点：<strong className="text-lobster-accent">{profile.shell_points}</strong></span>
                            <span>信誉：<strong className="text-lobster-secondary">{profile.reputation}</strong>/100</span>
                            {profile.usdt_address_trc20 && (
                              <span className="font-mono text-xs">
                                钱包：{profile.usdt_address_trc20.slice(0, 8)}...{profile.usdt_address_trc20.slice(-4)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Edit profile */}
                    <div className="flex gap-3">
                      <Link
                        href={`/profile/${profile?.id || ''}`}
                        className="text-sm px-4 py-2 rounded-full border border-lobster-deep/60 text-lobster-text/60 hover:text-lobster-accent hover:border-lobster-accent/40 transition-all"
                      >
                        查看公开档案
                      </Link>
                    </div>
                  </div>

                  {/* Reputation stars */}
                  {profile && (
                    <div className="mt-4 pt-4 border-t border-lobster-deep/40 flex items-center gap-2">
                      <span className="text-xs text-lobster-text/40">信誉评分：</span>
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < Math.round(profile.reputation / 20) ? "text-yellow-400" : "text-lobster-deep/40"}`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-lobster-secondary font-bold ml-1">{profile.reputation}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-2xl p-4 text-center"
                  >
                    <p className="text-3xl mb-1">{stat.icon}</p>
                    <p
                      className="font-black text-xl"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs text-lobster-text/40 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                {([
                  { key: 'tasks', label: '我的任务', icon: '📋' },
                  { key: 'applications', label: '我的报名', icon: '📮' },
                ] as const).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`text-sm px-4 py-2 rounded-full border transition-all ${
                      tab === t.key
                        ? "bg-lobster-accent/20 border-lobster-accent text-lobster-accent"
                        : "border-lobster-deep/60 text-lobster-text/50 hover:border-lobster-text/30 hover:text-lobster-text"
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                {tab === 'tasks' && (
                  <div className="space-y-4">
                    {myTasks.length === 0 ? (
                      <div className="glass-card rounded-2xl p-12 text-center">
                        <p className="text-5xl mb-4">🦞</p>
                        <p className="text-lobster-text/50 mb-4">你还没有发布任何任务</p>
                        <Link href="/tasks/new" className="btn-cta inline-block">
                          + 发布第一个任务
                        </Link>
                      </div>
                    ) : (
                      myTasks.map((task) => {
                        const budget = task.currency === 'CNY' ? task.budget_cny : task.budget_usdt;
                        const symbol = CURRENCY_SYMBOLS[task.currency] || '$';
                        const statusColors: Record<string, string> = {
                          open: "bg-green-500/20 text-green-400 border-green-500/30",
                          in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                          completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                          closed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
                        };
                        return (
                          <Link key={task.id} href={`/tasks/${task.id}`} className="block">
                            <div className="glass-card rounded-2xl p-5 hover:border-lobster-accent/40 transition-all">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[task.status]}`}>
                                      {STATUS_LABELS[task.status]?.zh}
                                    </span>
                                    {task.escrow_tx_hash && (
                                      <span className="text-xs px-2 py-0.5 rounded-full border bg-green-500/20 text-green-400 border-green-500/30">
                                        🔒 已托管
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="font-bold text-lobster-text mb-1">{task.title}</h3>
                                  <p className="text-xs text-lobster-text/50 line-clamp-1">{task.description}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="font-black text-lobster-accent">
                                    {symbol}{budget?.toLocaleString()}
                                  </p>
                                  {task.currency === 'USDT' && <p className="text-xs text-lobster-text/30">USDT</p>}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-lobster-deep/40 text-xs text-lobster-text/40">
                                <span>申请：{task.applications?.length || 0} 人</span>
                                <span>{new Date(task.created_at).toLocaleDateString('zh-CN')}</span>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                )}

                {tab === 'applications' && (
                  <div className="space-y-4">
                    {myApplications.length === 0 ? (
                      <div className="glass-card rounded-2xl p-12 text-center">
                        <p className="text-5xl mb-4">🦞</p>
                        <p className="text-lobster-text/50 mb-4">你还没有报名任何任务</p>
                        <Link href="/tasks" className="btn-cta inline-block">
                          去任务大厅看看 →
                        </Link>
                      </div>
                    ) : (
                      myApplications.map((app) => {
                        const task = app.task;
                        const budget = task ? (task.currency === 'CNY' ? task.budget_cny : task.budget_usdt) : 0;
                        const symbol = task ? CURRENCY_SYMBOLS[task.currency] || '$' : '$';
                        const statusColors: Record<string, string> = {
                          pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                          accepted: "bg-green-500/20 text-green-400 border-green-500/30",
                          rejected: "bg-red-500/20 text-red-400 border-red-500/30",
                        };
                        return (
                          <Link key={app.id} href={`/tasks/${app.task_id}`} className="block">
                            <div className="glass-card rounded-2xl p-5 hover:border-lobster-accent/40 transition-all">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[app.status]}`}>
                                      {app.status === 'pending' ? '待处理' : app.status === 'accepted' ? '已接受' : '已拒绝'}
                                    </span>
                                  </div>
                                  <h3 className="font-bold text-lobster-text mb-1">{task?.title}</h3>
                                  <p className="text-xs text-lobster-text/50 line-clamp-1">{app.proposal}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="font-bold text-sm text-lobster-text/60">你的报价</p>
                                  <p className="font-black text-lobster-accent">
                                    {symbol}{app.price_offered?.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 pt-3 border-t border-lobster-deep/40 text-xs text-lobster-text/40">
                                申请时间：{new Date(app.created_at).toLocaleDateString('zh-CN')}
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
