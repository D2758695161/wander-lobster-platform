import { createClient } from '@supabase/supabase-js';
import type { Currency, TaskStatus, Level, Task } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Using demo mode.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return profile;
}

export const DEMO_MODE = !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co';

const makeOwner = (id: string, username: string, level: Level, reputation: number, shellPoints: number) => ({
  id,
  username,
  email: `${username.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
  avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${id}`,
  bio: '',
  reputation,
  shell_points: shellPoints,
  level,
  created_at: '',
});

export const DEMO_TASKS: Task[] = [
  {
    id: 'demo-1',
    title: 'MCP Server 开发 - AI 工具链扩展',
    description: '基于 Model Context Protocol 开发一个 MCP Server，支持文件操作、搜索、代码生成等功能。需要对接 OpenAI 和 Claude API。',
    budget_usdt: 500,
    budget_cny: undefined,
    currency: 'USDT' as Currency,
    status: 'open' as TaskStatus,
    tags: ['Python', 'MCP', 'AI', 'API'],
    owner_id: 'demo-owner-1',
    assignee_id: undefined,
    deadline: '2026-05-15',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    owner: makeOwner('demo-owner-1', '钳神·阿强', '龙虾钳神', 95, 5200),
  },
  {
    id: 'demo-2',
    title: 'React + Web3 DeFi Dashboard',
    description: '打造一个 DeFi 数据看板，整合 Uniswap、AAVE、Curve 等协议数据，展示流动性、收益率、gas 费用等核心指标。',
    budget_usdt: undefined,
    budget_cny: 15000,
    currency: 'CNY' as Currency,
    status: 'open' as TaskStatus,
    tags: ['React', 'TypeScript', 'Web3', 'DeFi'],
    owner_id: 'demo-owner-2',
    assignee_id: undefined,
    deadline: '2026-06-30',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    owner: makeOwner('demo-owner-2', 'DeFiMaster', '钳豪', 88, 2100),
  },
  {
    id: 'demo-3',
    title: 'DevOps 月度代养 - AWS + Kubernetes',
    description: '每月固定技术支持：AWS 架构优化、Kubernetes 集群维护、CI/CD 流水线搭建、Terraform IaC 编写。',
    budget_usdt: 1500,
    budget_cny: undefined,
    currency: 'USDT' as Currency,
    status: 'in_progress' as TaskStatus,
    tags: ['AWS', 'Kubernetes', 'Terraform', 'DevOps'],
    owner_id: 'demo-owner-3',
    assignee_id: 'demo-worker-1',
    deadline: '2026-12-31',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    owner: makeOwner('demo-owner-3', 'CloudNative', '龙虾钳神', 92, 3500),
    assignee: makeOwner('demo-worker-1', 'K8sMaster', '钳豪', 85, 1800),
  },
  {
    id: 'demo-4',
    title: 'Python 数据管道 - ML 特征工程',
    description: '搭建 ML 特征工程数据管道，使用 Kafka 消息队列、Airflow 调度，从多数据源提取、转换、存储特征数据供模型训练。',
    budget_usdt: 2000,
    budget_cny: undefined,
    currency: 'USDT' as Currency,
    status: 'completed' as TaskStatus,
    tags: ['Python', 'Kafka', 'Airflow', 'ML'],
    owner_id: 'demo-owner-4',
    assignee_id: 'demo-worker-2',
    deadline: '2026-05-30',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    owner: makeOwner('demo-owner-4', 'AIdataCo', '钳士', 78, 900),
    assignee: makeOwner('demo-worker-2', 'DataFlow_Pro', '钳豪', 90, 2500),
  },
];

export const DEMO_REVIEWS = [
  {
    id: 'rev-1',
    task_id: 'demo-4',
    from_user: 'demo-owner-4',
    to_user: 'demo-worker-2',
    rating: 5,
    comment: '数据管道搭建得非常专业，准时交付，超出预期！',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    from_profile: makeOwner('demo-owner-4', 'AIdataCo', '钳士', 78, 900),
    to_profile: makeOwner('demo-worker-2', 'DataFlow_Pro', '钳豪', 90, 2500),
  },
];
