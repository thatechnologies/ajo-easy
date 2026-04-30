
-- Enums
CREATE TYPE public.contribution_status AS ENUM ('pending', 'confirmed', 'rejected');
CREATE TYPE public.group_frequency AS ENUM ('Weekly', 'Monthly');

-- Profiles table (created automatically on signup via trigger)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'phone');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Groups
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  frequency public.group_frequency NOT NULL,
  total_members INTEGER NOT NULL CHECK (total_members > 1),
  invite_code TEXT NOT NULL UNIQUE,
  current_cycle INTEGER NOT NULL DEFAULT 1,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  -- Group bank account (where members send contributions)
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Group members
CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payout_position INTEGER NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id),
  UNIQUE(group_id, payout_position)
);
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Helper functions (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_group_member(_group_id UUID, _user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.group_members WHERE group_id = _group_id AND user_id = _user_id);
$$;

CREATE OR REPLACE FUNCTION public.is_group_admin(_group_id UUID, _user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.group_members WHERE group_id = _group_id AND user_id = _user_id AND is_admin = true);
$$;

-- Group policies
CREATE POLICY "Members view their groups" ON public.groups FOR SELECT
  USING (public.is_group_member(id, auth.uid()));
CREATE POLICY "Authenticated users create groups" ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins update their groups" ON public.groups FOR UPDATE
  USING (public.is_group_admin(id, auth.uid()));
CREATE POLICY "Admins delete their groups" ON public.groups FOR DELETE
  USING (public.is_group_admin(id, auth.uid()));

-- Group member policies
CREATE POLICY "Members view co-members" ON public.group_members FOR SELECT
  USING (public.is_group_member(group_id, auth.uid()));
CREATE POLICY "Users join groups" ON public.group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage members" ON public.group_members FOR UPDATE
  USING (public.is_group_admin(group_id, auth.uid()));
CREATE POLICY "Admins remove members" ON public.group_members FOR DELETE
  USING (public.is_group_admin(group_id, auth.uid()) OR auth.uid() = user_id);

-- Contributions (each payment submission)
CREATE TABLE public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_number INTEGER NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  transaction_reference TEXT NOT NULL,
  receipt_url TEXT,
  status public.contribution_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members view own contributions" ON public.contributions FOR SELECT
  USING (auth.uid() = member_id OR public.is_group_admin(group_id, auth.uid()));
CREATE POLICY "Members submit own contributions" ON public.contributions FOR INSERT
  WITH CHECK (auth.uid() = member_id AND public.is_group_member(group_id, auth.uid()));
CREATE POLICY "Admins review contributions" ON public.contributions FOR UPDATE
  USING (public.is_group_admin(group_id, auth.uid()));

-- Payouts
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_number INTEGER NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  recorded_by UUID NOT NULL REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE(group_id, cycle_number)
);
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members view group payouts" ON public.payouts FOR SELECT
  USING (public.is_group_member(group_id, auth.uid()));
CREATE POLICY "Admins record payouts" ON public.payouts FOR INSERT
  WITH CHECK (public.is_group_admin(group_id, auth.uid()) AND auth.uid() = recorded_by);

-- Storage bucket for receipts (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);

-- Receipts storage policies
-- Path convention: {group_id}/{user_id}/{filename}
CREATE POLICY "Members upload own receipts" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[2]
    AND public.is_group_member(((storage.foldername(name))[1])::uuid, auth.uid())
  );

CREATE POLICY "Members view own receipts" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts'
    AND (
      auth.uid()::text = (storage.foldername(name))[2]
      OR public.is_group_admin(((storage.foldername(name))[1])::uuid, auth.uid())
    )
  );

CREATE POLICY "Members delete own pending receipts" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'receipts'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );
