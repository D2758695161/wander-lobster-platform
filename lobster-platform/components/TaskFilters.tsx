"use client";

import { type TaskFilters, type TaskStatus, type Currency } from "@/lib/types";

interface TaskFiltersProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  allTags: string[];
}

export default function TaskFiltersComponent({ filters, onChange, allTags }: TaskFiltersProps) {
  const statusOptions: { value: TaskStatus | 'all'; label: string }[] = [
    { value: 'all', label: '全部状态' },
    { value: 'open', label: '🟢 开放' },
    { value: 'in_progress', label: '🟡 进行中' },
    { value: 'completed', label: '🔵 已完成' },
    { value: 'closed', label: '⚫ 已关闭' },
  ];

  const currencyOptions: { value: Currency | 'all'; label: string }[] = [
    { value: 'all', label: '全部货币' },
    { value: 'USDT', label: '₮ USDT' },
    { value: 'CNY', label: '¥ CNY' },
    { value: 'USD', label: '$ USD' },
  ];

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-3">
      {/* Status */}
      <div className="flex items-center gap-2 flex-wrap flex-1">
        <span className="text-xs text-lobster-text/40 uppercase tracking-wider font-bold">状态:</span>
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ ...filters, status: opt.value })}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              filters.status === opt.value
                ? "bg-lobster-accent/20 border-lobster-accent text-lobster-accent"
                : "border-lobster-deep/60 text-lobster-text/50 hover:border-lobster-text/30 hover:text-lobster-text"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Currency */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-lobster-text/40 uppercase tracking-wider font-bold">货币:</span>
        {currencyOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ ...filters, currency: opt.value })}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              filters.currency === opt.value
                ? "bg-lobster-secondary/20 border-lobster-secondary text-lobster-secondary"
                : "border-lobster-deep/60 text-lobster-text/50 hover:border-lobster-text/30 hover:text-lobster-text"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Budget range */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-lobster-text/40 uppercase tracking-wider font-bold">预算:</span>
        <input
          type="number"
          placeholder="最低"
          value={filters.budgetMin}
          onChange={(e) => onChange({ ...filters, budgetMin: e.target.value })}
          className="w-20 text-xs bg-lobster-deep/40 border border-lobster-deep/60 rounded-lg px-2 py-1.5 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors"
        />
        <span className="text-lobster-text/30">-</span>
        <input
          type="number"
          placeholder="最高"
          value={filters.budgetMax}
          onChange={(e) => onChange({ ...filters, budgetMax: e.target.value })}
          className="w-20 text-xs bg-lobster-deep/40 border border-lobster-deep/60 rounded-lg px-2 py-1.5 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors"
        />
      </div>

      {/* Tags search */}
      <input
        type="text"
        placeholder="搜索技能..."
        value={filters.tags}
        onChange={(e) => onChange({ ...filters, tags: e.target.value })}
        className="text-xs bg-lobster-deep/40 border border-lobster-deep/60 rounded-full px-4 py-1.5 text-lobster-text placeholder-lobster-text/30 focus:border-lobster-accent focus:outline-none transition-colors w-36"
      />

      {/* Clear */}
      {(filters.status !== 'all' || filters.currency !== 'all' || filters.tags || filters.budgetMin || filters.budgetMax) && (
        <button
          onClick={() => onChange({ status: 'all', currency: 'all', tags: '', budgetMin: '', budgetMax: '' })}
          className="text-xs text-lobster-text/40 hover:text-lobster-accent transition-colors underline"
        >
          清除
        </button>
      )}
    </div>
  );
}
