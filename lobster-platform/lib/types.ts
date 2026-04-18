// ============================================================
// TypeScript Types - 流浪龙虾平台
// ============================================================

export type Level = '软壳' | '硬壳' | '钳士' | '钳豪' | '龙虾钳神';
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'closed';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';
export type Currency = 'USD' | 'CNY' | 'USDT';
export type TransactionType = 'escrow_deposit' | 'escrow_release' | 'application_fee' | 'refund';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

// ─── Database Models ───────────────────────────────────────────────────────

export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  email?: string;
  avatar_url: string;
  bio: string;
  usdt_address_trc20?: string;
  reputation: number;
  total_earnings?: number;
  completed_tasks?: number;
  success_rate?: number;
  member_since?: string;
  skills?: string[];
  country?: string;
  is_verified?: boolean;
  shell_points: number;
  level: Level;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  budget_usdt?: number;
  budget_cny?: number | null;
  currency: Currency;
  status: TaskStatus;
  tags: string[];
  owner_id: string;
  assignee_id?: string | null;
  escrow_tx_hash?: string;
  escrow_amount?: number;
  deadline?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  owner?: Profile;
  assignee?: Profile;
  applications?: Application[];
}

export interface Application {
  id: string;
  task_id: string;
  user_id: string;
  proposal: string;
  price_offered: number;
  status: ApplicationStatus;
  created_at: string;
  // Joined data
  user?: Profile;
  task?: Task;
}

export interface Transaction {
  id: string;
  task_id?: string;
  from_user?: string;
  to_user?: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  status: TransactionStatus;
  tx_hash?: string;
  created_at: string;
}

export interface Review {
  id: string;
  task_id: string;
  from_user: string;
  to_user: string;
  rating: number;
  comment: string;
  created_at: string;
  // Joined
  from_profile?: Profile;
  to_profile?: Profile;
}

// ─── API Response Types ─────────────────────────────────────────────────────

export interface PaymentAddressResponse {
  success: boolean;
  address: string;
  platform_address: string;
  task_id: string;
  instructions?: {
    network: string;
    currency: string;
    warning: string;
    amount_note: string;
  };
}

export interface VerifyPaymentResponse {
  success: boolean;
  confirmed: boolean;
  tx_hash?: string;
  amount?: number;
  from_address?: string;
  block_timestamp?: number;
  message?: string;
  check_address?: string;
}

export interface ReleasePaymentResponse {
  success: boolean;
  message: string;
  task_id: string;
  winner_id: string;
  amount: number;
  to_address: string;
  tx_hash?: string | null;
}

// ─── Form Types ─────────────────────────────────────────────────────────────

export interface RegisterForm {
  email: string;
  password: string;
  username: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface CreateTaskForm {
  title: string;
  description: string;
  budget: string;
  currency: Currency;
  tags: string;
  deadline: string;
  requirements: string;
}

export interface ApplyForm {
  proposal: string;
  price_offered: string;
}

// ─── UI State Types ─────────────────────────────────────────────────────────

export interface TaskFilters {
  status: TaskStatus | 'all';
  currency: Currency | 'all';
  tags: string;
  budgetMin: string;
  budgetMax: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// ─── Level Helpers ─────────────────────────────────────────────────────────

export const LEVEL_ORDER: Level[] = ['软壳', '硬壳', '钳士', '钳豪', '龙虾钳神'];
export const LEVEL_EMOJI: Record<Level, string> = {
  '软壳': '🐚',
  '硬壳': '🦐',
  '钳士': '🦀',
  '钳豪': '🦞',
  '龙虾钳神': '🦞👑',
};
export const LEVEL_COLORS: Record<Level, string> = {
  '软壳': '#6B7280',
  '硬壳': '#4ECDC4',
  '钳士': '#FF6B35',
  '钳豪': '#FFD93D',
  '龙虾钳神': '#FF6B35',
};

export const STATUS_LABELS: Record<TaskStatus, { zh: string; en: string }> = {
  open: { zh: '开放', en: 'Open' },
  in_progress: { zh: '进行中', en: 'In Progress' },
  completed: { zh: '已完成', en: 'Completed' },
  closed: { zh: '已关闭', en: 'Closed' },
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  CNY: '¥',
  USDT: '₮',
};

export const PLATFORM_WALLET = 'TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN';
