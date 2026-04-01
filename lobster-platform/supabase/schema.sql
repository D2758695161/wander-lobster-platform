-- ============================================================
-- 流浪龙虾平台 - Supabase 数据库 Schema + RLS 策略
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/bottts/svg?seed=lobster',
    bio TEXT DEFAULT '',
    usdt_address_trc20 TEXT,
    reputation INTEGER DEFAULT 50 CHECK (reputation >= 0 AND reputation <= 100),
    shell_points INTEGER DEFAULT 0,
    level TEXT DEFAULT '软壳' CHECK (level IN ('软壳', '硬壳', '钳士', '钳豪', '龙虾钳神')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget_usdt NUMERIC(12, 2),
    budget_cny NUMERIC(12, 2),
    currency TEXT NOT NULL DEFAULT 'USDT' CHECK (currency IN ('USD', 'CNY', 'USDT')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'closed')),
    tags TEXT[] DEFAULT '{}',
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES public.profiles(id),
    escrow_tx_hash TEXT,
    escrow_amount NUMERIC(12, 2),
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    proposal TEXT NOT NULL,
    price_offered NUMERIC(12, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(task_id, user_id)
);

-- Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.tasks(id),
    from_user UUID REFERENCES public.profiles(id),
    to_user UUID REFERENCES public.profiles(id),
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL CHECK (currency IN ('USD', 'CNY', 'USDT')),
    type TEXT NOT NULL CHECK (type IN ('escrow_deposit', 'escrow_release', 'application_fee', 'refund')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    tx_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    from_user UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    to_user UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(task_id, from_user)
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, email, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'lobster_' || LEFT(NEW.id::TEXT, 8)),
        NEW.email,
        'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id::TEXT
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at on tasks
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tasks_updated_at ON public.tasks;
CREATE TRIGGER tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Update reputation on review
CREATE OR REPLACE FUNCTION public.update_reputation_on_review()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating NUMERIC;
    current_rep INTEGER;
BEGIN
    SELECT AVG(rating)::INTEGER INTO avg_rating
    FROM public.reviews
    WHERE to_user = NEW.to_user;

    current_rep := LEAST(100, GREATEST(0, (avg_rating * 20)::INTEGER));
    
    UPDATE public.profiles
    SET reputation = current_rep
    WHERE id = NEW.to_user;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
    AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_reputation_on_review();

-- Shell points on task completion
CREATE OR REPLACE FUNCTION public.add_shell_points_on_completion()
RETURNS TRIGGER AS $$
DECLARE
    current_points INTEGER;
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        SELECT shell_points INTO current_points FROM public.profiles WHERE id = NEW.assignee_id;
        UPDATE public.profiles
        SET shell_points = shell_points + 10,
            level = CASE
                WHEN shell_points + 10 >= 5000 THEN '龙虾钳神'
                WHEN shell_points + 10 >= 2000 THEN '钳豪'
                WHEN shell_points + 10 >= 500 THEN '钳士'
                WHEN shell_points + 10 >= 100 THEN '硬壳'
                ELSE '软壳'
            END
        WHERE id = NEW.assignee_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_task_completed ON public.tasks;
CREATE TRIGGER on_task_completed
    AFTER UPDATE OF status ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.add_shell_points_on_completion();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Tasks
CREATE POLICY "Tasks are viewable by everyone"
    ON public.tasks FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create tasks"
    ON public.tasks FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Task owners can update tasks"
    ON public.tasks FOR UPDATE
    USING (auth.uid() = owner_id);

-- Applications
CREATE POLICY "Applications viewable by task owner and applicant"
    ON public.applications FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = (
        SELECT owner_id FROM public.tasks WHERE id = task_id
    ));

CREATE POLICY "Authenticated users can create applications"
    ON public.applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Applicants can update their own applications"
    ON public.applications FOR UPDATE
    USING (auth.uid() = user_id);

-- Transactions (only relevant parties)
CREATE POLICY "Transactions visible to involved parties"
    ON public.transactions FOR SELECT
    USING (
        auth.uid() = from_user
        OR auth.uid() = to_user
        OR auth.uid() = (SELECT owner_id FROM public.tasks WHERE id = task_id)
    );

CREATE POLICY "Service role can insert transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (true);

-- Reviews
CREATE POLICY "Reviews are public"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Task participants can create reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (
        auth.uid() = from_user
        AND (
            auth.uid() = (SELECT owner_id FROM public.tasks WHERE id = task_id)
            OR auth.uid() = (SELECT assignee_id FROM public.tasks WHERE id = task_id)
        )
    );

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_tasks_owner ON public.tasks(owner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_applications_task ON public.applications(task_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_task ON public.transactions(task_id);
CREATE INDEX IF NOT EXISTS idx_reviews_task ON public.reviews(task_id);
CREATE INDEX IF NOT EXISTS idx_reviews_to_user ON public.reviews(to_user);

-- ============================================================
-- SEED DATA (optional demo data)
-- ============================================================

-- This would be run manually or via a separate seed script
-- Not included here to avoid conflicts with production data
