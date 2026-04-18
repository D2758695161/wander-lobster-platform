"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LEVEL_EMOJI, LEVEL_COLORS, CURRENCY_SYMBOLS, STATUS_LABELS, type Task, type Currency } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  index?: number;
  onClick?: () => void;
}

function formatPostedAt(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  return `${days}天前`;
}

const STATUS_COLORS = {
  open: "bg-green-500/20 text-green-400 border-green-500/30",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  closed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const ESCROW_COLORS = {
  deposited: "bg-green-500/20 text-green-400 border-green-500/30",
  working: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  unreleased: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function TaskCard({ task, index = 0, onClick }: TaskCardProps) {
  const budget = task.currency === 'CNY' ? task.budget_cny : task.budget_usdt;
  const symbol = CURRENCY_SYMBOLS[task.currency as Currency] || '$';
  const hasEscrow = !!task.escrow_tx_hash;
  const statusColor = STATUS_COLORS[task.status] || STATUS_COLORS.open;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl p-5 cursor-pointer flex flex-col gap-3"
      onClick={onClick}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor}`}>
            {STATUS_LABELS[task.status]?.zh || task.status}
          </span>
          {hasEscrow && (
            <span className={`text-xs px-2 py-0.5 rounded-full border ${task.status === 'in_progress' ? ESCROW_COLORS.working : ESCROW_COLORS.deposited}`}>
              🔒 已托管
            </span>
          )}
        </div>
        <span className="text-xs text-lobster-text/30 whitespace-nowrap">
          {formatPostedAt(task.created_at)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-lobster-text font-heading leading-snug line-clamp-2">
        {task.title}
      </h3>

      {/* Budget */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-lobster-accent neon-text">
          {symbol}{budget?.toLocaleString()}
        </span>
        {task.currency === 'USDT' && (
          <span className="text-xs text-lobster-secondary/60">USDT</span>
        )}
      </div>

      {/* Description preview */}
      <p className="text-lobster-text/50 text-xs line-clamp-2 leading-relaxed">
        {task.description}
      </p>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-lobster-deep/50 text-lobster-text/70 border border-lobster-deep/40"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 4 && (
            <span className="text-xs text-lobster-text/40">+{task.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-lobster-deep/40">
        <div className="flex items-center gap-2">
          {task.owner && (
            <>
              <img
                src={task.owner.avatar_url}
                alt={task.owner.username}
                className="w-6 h-6 rounded-full bg-lobster-deep"
              />
              <span className="text-xs text-lobster-text/60">
                {task.owner.username}
              </span>
              <span className="text-xs" title={task.owner.level}>
                {LEVEL_EMOJI[task.owner.level as keyof typeof LEVEL_EMOJI] || '🐚'}
              </span>
            </>
          )}
        </div>
        <span className="text-xs text-lobster-secondary hover:text-lobster-accent transition-colors">
          查看详情 →
        </span>
      </div>
    </motion.div>
  );
}
