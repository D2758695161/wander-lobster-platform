"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ApplicationForm from "@/components/ApplicationForm";
import PaymentEscrow from "@/components/PaymentEscrow";
import UserAvatar from "@/components/UserAvatar";
import { supabase, DEMO_MODE, DEMO_TASKS, DEMO_REVIEWS } from "@/lib/supabase";
import { type Task, type Application, type Profile, LEVEL_EMOJI, LEVEL_COLORS, STATUS_LABELS, CURRENCY_SYMBOLS, type Level } from "@/lib/types";

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<typeof DEMO_REVIEWS>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);

    if (DEMO_MODE) {
      const demoTask = DEMO_TASKS.find((t) => t.id === taskId) || DEMO_TASKS[0];
      setTask(demoTask);
      setReviews(DEMO_REVIEWS.filter((r) => r.task_id === taskId));
      setLoading(false);
      return;
    }

    try {
      const [taskRes, appRes] = await Promise.all([
        supabase
          .from('tasks')
          .select('*, owner:profiles!owner_id(*), assignee:profiles!assignee_id(*)')
          .eq('id', taskId)
          .single(),
        supabase
          .from('applications')
          .select('*, user:profiles!user_id(*)')
          .eq('task_id', taskId)
          .order('created_at', { ascending: false }),
      ]);

      if (taskRes.error) throw taskRes.error;
      setTask(taskRes.data);
      setApplications(appRes.data || []);

      // Fetch reviews for this task
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*, from_profile:profiles!from_user(*), to_profile:profiles!to_user(*)')
        .eq('task_id', taskId);
      setReviews(reviewData || []);

    } catch (err) {
      console.error('Error fetching task:', err);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchData();
    if (!DEMO_MODE) {
      supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    }
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen lobster-bg">
        <Navbar />
        <div className="relative pt-28 px-6">
          <div className="max-w-4xl mx-auto py-20">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-lobster-deep/40 rounded w-1/2" />
              <div className="h-4 bg-lobster-deep/40 rounded w-1/3" />
              <div className="h-32 bg-lobster-deep/40 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen lobster-bg">
        <Navbar />
        <div className="relative pt-32 px-6 text-center">
          <p className="text-5xl mb-4">🦞</p>
          <p className="text-lobster-text/50 text-lg">任务不存在</p>
          <Link href="/tasks" className="btn-cta inline-block mt-6">返回任务大厅</Link>
        </div>
      </div>
    );
  }

  const budget = task.currency === 'CNY' ? task.budget_cny : task.budget_usdt;
  const symbol = CURRENCY_SYMBOLS[task.currency] || '$';
  const isOwner = currentUser?.id === task.owner_id;
  const hasApplied = applications.some((a) => a.user_id === currentUser?.id);

  const statusColors: Record<string, string> = {
    open: "bg-green-500/20 text-green-400 border-green-500/30",
    in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    closed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

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
          {/* Back button */}
          <Link href="/tasks" className="inline-flex items-center gap-2 text-sm text-lobster-text/50 hover:text-lobster-accent transition-colors mb-6">
            ← 返回任务大厅
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`text-sm px-3 py-1 rounded-full border ${statusColors[task.status] || statusColors.open}`}>
                      {STATUS_LABELS[task.status]?.zh || task.status}
                    </span>
                    {task.tags?.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-lobster-deep/50 text-lobster-text/70 border border-lobster-deep/40">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-2xl md:text-3xl font-black font-heading text-lobster-text mb-4">
                    {task.title}
                  </h1>

                  {/* Budget */}
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-lobster-accent neon-text">
                      {symbol}{budget?.toLocaleString()}
                    </span>
                    {task.currency === 'USDT' && <span className="text-lobster-secondary/60">USDT</span>}
                    {task.currency === 'CNY' && <span className="text-lobster-text/50">CNY</span>}
                    {task.currency === 'USD' && <span className="text-lobster-text/50">USD</span>}
                    {task.deadline && (
                      <span className="text-sm text-lobster-text/40 ml-4">
                        ⏰ 截止：{new Date(task.deadline).toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </div>

                  {/* Owner */}
                  {task.owner && (
                    <div className="flex items-center gap-3 pb-4 border-b border-lobster-deep/40">
                      <UserAvatar user={task.owner} size="md" showName showLevel showReputation linkToProfile />
                      <div>
                        <p className="text-xs text-lobster-text/40">发布者</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-lobster-secondary mb-4 uppercase tracking-wider">任务描述</h2>
                  <p className="text-lobster-text/80 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                </div>
              </motion.div>

              {/* Applications (visible to owner) */}
              {isOwner && applications.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-lobster-secondary mb-4 uppercase tracking-wider">
                      报名列表 ({applications.length})
                    </h2>
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div key={app.id} className="flex items-start gap-4 p-4 bg-lobster-deep/30 rounded-xl">
                          {app.user && <UserAvatar user={app.user} size="md" showName showLevel showReputation />}
                          <div className="flex-1">
                            <p className="text-sm font-bold text-lobster-text">{app.user?.username}</p>
                            <p className="text-xs text-lobster-text/60 mt-1">{app.proposal}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm font-bold text-lobster-accent">
                                {symbol}{app.price_offered?.toLocaleString()}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                                app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                app.status === 'accepted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                'bg-red-500/20 text-red-400 border-red-500/30'
                              }`}>
                                {app.status === 'pending' ? '待处理' : app.status === 'accepted' ? '已接受' : '已拒绝'}
                              </span>
                            </div>
                          </div>
                          {app.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={async () => {
                                  if (DEMO_MODE) return;
                                  await supabase.from('applications').update({ status: 'accepted' }).eq('id', app.id);
                                  await supabase.from('tasks').update({ 
                                    assignee_id: app.user_id, 
                                    status: 'in_progress' 
                                  }).eq('id', taskId);
                                  fetchData();
                                }}
                                className="text-xs px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all"
                              >
                                接受
                              </button>
                              <button
                                onClick={async () => {
                                  if (DEMO_MODE) return;
                                  await supabase.from('applications').update({ status: 'rejected' }).eq('id', app.id);
                                  fetchData();
                                }}
                                className="text-xs px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
                              >
                                拒绝
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Reviews */}
              {reviews.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-lobster-secondary mb-4 uppercase tracking-wider">评价</h2>
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="flex items-start gap-3 p-4 bg-lobster-deep/30 rounded-xl">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {review.from_profile && (
                                <UserAvatar user={review.from_profile} size="sm" showName />
                              )}
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <span key={i} className={`text-xs ${i < review.rating ? "text-yellow-400" : "text-lobster-deep/40"}`}>★</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-lobster-text/80">{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply / Action */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <div className="glass-card rounded-2xl p-6">
                  {task.status === 'open' && !isOwner && !hasApplied && (
                    <>
                      {showApplyForm ? (
                        <ApplicationForm
                          taskId={task.id}
                          taskTitle={task.title}
                          budget={budget || 0}
                          currency={task.currency}
                          ownerId={task.owner_id}
                        />
                      ) : (
                        <div className="text-center space-y-4">
                          <p className="text-4xl">🦞</p>
                          <p className="text-lobster-text/80 font-bold">{task.title}</p>
                          <button
                            onClick={() => {
                              if (DEMO_MODE || currentUser) {
                                setShowApplyForm(true);
                              } else {
                                router.push(`/login?redirect=/tasks/${task.id}`);
                              }
                            }}
                            className="btn-cta w-full"
                          >
                            📮 报名接单
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {task.status === 'open' && !isOwner && hasApplied && (
                    <div className="text-center py-4">
                      <p className="text-3xl mb-3">✅</p>
                      <p className="text-lobster-secondary font-bold">已报名</p>
                      <p className="text-lobster-text/50 text-sm mt-1">等待雇主审核</p>
                    </div>
                  )}

                  {isOwner && (
                    <div className="text-center py-4">
                      <p className="text-lobster-text/50 text-sm mb-2">这是你发布的任务</p>
                      <Link href="/dashboard" className="text-sm text-lobster-secondary hover:underline">
                        在面板中管理 →
                      </Link>
                    </div>
                  )}

                  {task.status !== 'open' && !isOwner && (
                    <div className="text-center py-4">
                      <p className="text-3xl mb-3">
                        {task.status === 'in_progress' ? '⚡' : task.status === 'completed' ? '✅' : '🔒'}
                      </p>
                      <p className="text-lobster-text/50 text-sm">
                        {task.status === 'in_progress' ? '任务进行中' : task.status === 'completed' ? '任务已完成' : '任务已关闭'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Escrow */}
              <PaymentEscrow
                taskId={task.id}
                budget={budget || 0}
                currency={task.currency}
                taskTitle={task.title}
                ownerName={task.owner?.username || '未知'}
                depositConfirmed={!!task.escrow_tx_hash}
              />

              {/* Assignee */}
              {task.assignee && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-lobster-secondary uppercase tracking-wider mb-4">当前接单者</h3>
                    <UserAvatar user={task.assignee} size="lg" showName showLevel showReputation linkToProfile />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
