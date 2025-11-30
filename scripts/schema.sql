-- Supabase-compatible schema.sql
-- Uses UUID PKs, RLS enabled, auth integration, and recommended Supabase patterns.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==========================
-- USERS (linked to Supabase auth.users)
-- ==========================
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id uuid NOT NULL UNIQUE, -- references auth.users.id
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Foreign key to Supabase Auth
ALTER TABLE public.users
  ADD CONSTRAINT fk_auth_user FOREIGN KEY (auth_user_id)
  REFERENCES auth.users(id) ON DELETE CASCADE;

-- Timestamp update trigger
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- ==========================
-- TOKEN SALE TRANSACTIONS
-- ==========================
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  wallet_address TEXT NOT NULL,
  token_amount NUMERIC(30,10) NOT NULL,
  sol_amount NUMERIC(30,10) NOT NULL,
  tx_signature TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.transactions
  ADD CONSTRAINT fk_transactions_user FOREIGN KEY (user_id)
  REFERENCES public.users(id) ON DELETE SET NULL;

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_wallet ON public.transactions(wallet_address);

-- ==========================
-- SALE METRICS
-- ==========================
CREATE TABLE public.sale_metrics (
  id INT PRIMARY KEY DEFAULT 1,
  total_tokens_sold NUMERIC(30,10) NOT NULL DEFAULT 0,
  total_sol_raised NUMERIC(30,10) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one row allowed
INSERT INTO public.sale_metrics (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER trg_sale_metrics_updated
BEFORE UPDATE ON public.sale_metrics
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- ==========================
-- NEWSLETTER SUBSCRIPTIONS
-- ==========================
CREATE TABLE public.newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================
-- ENABLE ROW LEVEL SECURITY (Supabase best practice)
-- ==========================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_metrics ENABLE ROW LEVEL SECURITY;

-- ==========================
-- RLS POLICIES
-- ==========================
-- USERS: user can read/update their own profile
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- TRANSACTIONS: user can insert & read only their own txs
CREATE POLICY "Users insert own tx" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own tx" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- NEWSLETTER: public can add, no read
CREATE POLICY "Public subscribe" ON public.newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

-- SALE METRICS: read allowed for everyone, cannot modify
CREATE POLICY "Public read metrics" ON public.sale_metrics
  FOR SELECT USING (true);

-- End of Supabase schema
