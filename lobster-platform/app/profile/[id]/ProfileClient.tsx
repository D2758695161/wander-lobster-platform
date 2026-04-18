"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import UserAvatar from "@/components/UserAvatar";
import { supabase, DEMO_MODE, DEMO_TASKS, DEMO_REVIEWS } from "@/lib/supabase";
import { type Profile, type Task, type Review, LEVEL_EMOJI, LEVEL_COLORS, STATUS_LABELS, type Level } from "@/lib/types";

const BUDGET: Record<string, string> = { USD: '$', CNY: '¥', USDT: '$' };

export default function ProfileClient({ profileId }: { profileId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tasks" | "reviews">("tasks");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (DEMO_MODE || profileId === 'demo-user') {
        const demoProfile: Profile = {
          id: 'demo-user',
          username: 'LobsterHunter',
          display_name: '🐙 龙虾猎手',
          avatar_url: '',
          bio: '专精 GitHub Bounty 的 AI 开发者 | 累计完成 50+ PRs',
          level: 'advanced' as Level,
          total_earnings: 3847,
          completed_tasks: 52,
          success_rate: 94,
          member_since: '2025-06-15',
          skills: ['TypeScript', 'Rust', 'Solidity', 'Next.js'],
          country: '🌏',
          is_verified: true,
          reputation: 94,
          shell_points: 5200,
          created_at: '2025-06-15',
        };
        setProfile(demoProfile);
        setTasks(DEMO_TASKS.slice(0, 6));
        setReviews(DEMO_REVIEWS);
        setLoading(false);
        return;
      }

      try {
        const [profileRes, tasksRes, reviewsRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", profileId).single(),
          supabase.from("tasks").select("*").eq("client_id", profileId).order("created_at", { ascending: false }).limit(20),
          supabase.from("reviews").select("*").eq("reviewee_id", profileId).order("created_at", { ascending: false }),
        ]);

        if (profileRes.data) setProfile(profileRes.data as Profile);
        if (tasksRes.data) setTasks(tasksRes.data as Task[]);
        if (reviewsRes.data) setReviews(reviewsRes.data as Review[]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    fetchData();
  }, [profileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile not found</h1>
          <Link href="/dashboard" className="text-blue-400 hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-6">
              <UserAvatar user={profile} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-white">{profile.display_name || profile.username}</h1>
                  {profile.is_verified && <span className="text-blue-400">✓</span>}
                  {profile.country && <span>{profile.country}</span>}
                </div>
                <p className="text-gray-400 mb-2">@{profile.username}</p>
                <p className="text-gray-300 text-sm mb-4">{profile.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skills?.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">{skill}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-white">${profile.total_earnings?.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Total Earnings</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-white">{profile.completed_tasks}</div>
                    <div className="text-xs text-gray-400">Tasks Done</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-white">{profile.success_rate}%</div>
                    <div className="text-xs text-gray-400">Success Rate</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-3 text-center">
                    <div className="text-xl">{LEVEL_EMOJI[profile.level || 'beginner']}</div>
                    <div className="text-xs text-gray-400">{profile.level}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button onClick={() => setActiveTab("tasks")} className={`px-4 py-2 rounded-lg font-medium ${activeTab === "tasks" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400"}`}>
              Tasks ({tasks.length})
            </button>
            <button onClick={() => setActiveTab("reviews")} className={`px-4 py-2 rounded-lg font-medium ${activeTab === "reviews" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400"}`}>
              Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === "tasks" && (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{task.title}</h3>
                    <span className="px-2 py-1 bg-gray-600 rounded text-xs font-medium text-gray-200">
                      {STATUS_LABELS[task.status]?.zh || task.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>${task.budget_usdt || 0}</span>
                    <span>{new Date(task.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-gray-400 text-center py-8">No tasks yet</p>}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="grid gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400">{"★".repeat(review.rating)}</span>
                    <span className="text-gray-400 text-sm">Anonymous</span>
                  </div>
                  <p className="text-gray-300 text-sm">{review.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && <p className="text-gray-400 text-center py-8">No reviews yet</p>}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
