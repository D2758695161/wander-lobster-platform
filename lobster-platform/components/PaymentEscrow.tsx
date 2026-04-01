"use client";

import { motion } from "framer-motion";
import { PLATFORM_WALLET } from "@/lib/types";

interface PaymentEscrowProps {
  taskId: string;
  budget: number;
  currency: string;
  taskTitle: string;
  ownerName: string;
  depositConfirmed?: boolean;
}

export default function PaymentEscrow({
  taskId,
  budget,
  currency,
  taskTitle,
  ownerName,
  depositConfirmed = false,
}: PaymentEscrowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔒</span>
        <h3 className="text-lg font-bold text-lobster-text font-heading">资金托管</h3>
        {depositConfirmed && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
            已托管 ✓
          </span>
        )}
      </div>

      <p className="text-lobster-text/60 text-sm mb-6">
        任务「{taskTitle}」的预算已由雇主 <strong className="text-lobster-text">{ownerName}</strong> 托管到平台，
        任务完成后自动释放给接单者。
      </p>

      {/* Amount */}
      <div className="bg-lobster-deep/40 rounded-xl p-4 mb-4">
        <p className="text-xs text-lobster-text/40 mb-1">托管金额</p>
        <p className="text-2xl font-black text-lobster-accent neon-text">
          {currency === 'USDT' || currency === 'USD' ? '$' : '¥'}
          {budget.toLocaleString()} {currency === 'USDT' ? 'USDT' : ''}
        </p>
      </div>

      {/* How it works */}
      <div className="space-y-3 mb-6">
        <p className="text-sm font-bold text-lobster-secondary uppercase tracking-wider">托管流程</p>
        {[
          { step: "1", text: "雇主将预算转入平台托管地址", icon: "💰", done: true },
          { step: "2", text: "接单者完成任务并提交", icon: "✅", done: false },
          { step: "3", text: "雇主确认完成，平台放款", icon: "🎉", done: false },
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              item.done ? "bg-green-500/20 text-green-400" : "bg-lobster-deep/60 text-lobster-text/50"
            }`}>
              {item.icon}
            </div>
            <p className={`text-sm ${item.done ? "text-lobster-text/80" : "text-lobster-text/50"}`}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Platform wallet */}
      <div className="bg-lobster-deep/20 rounded-xl p-3 border border-lobster-deep/40">
        <p className="text-xs text-lobster-text/40 mb-1">平台托管地址（TRC20）</p>
        <div className="flex items-center gap-2">
          <code className="text-xs text-lobster-secondary font-mono flex-1 truncate">
            {PLATFORM_WALLET}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(PLATFORM_WALLET)}
            className="text-xs text-lobster-accent hover:text-lobster-secondary transition-colors"
          >
            复制
          </button>
        </div>
      </div>

      {/* Trust badge */}
      <div className="mt-4 flex items-center gap-2 text-xs text-lobster-text/40">
        <span>🛡️</span>
        <span>资金由平台托管，防止白嫖，保障双方权益</span>
      </div>
    </motion.div>
  );
}
