-- Unified Multi-App Schema for Antigravity Ecosystem
-- Purpose: Consolidate Access, Logs, and Scenarios for 3 different Apps

-- 1. App Registry
CREATE TABLE IF NOT EXISTS apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- 'Antigravity Architect', 'Sales Tracker', etc.
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Unified User Profiles (Shared across apps)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. App Access / Membership (Multi-tenant)
CREATE TABLE IF NOT EXISTS app_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'user', -- 'admin', 'editor', 'viewer'
    UNIQUE(app_id, profile_id)
);

-- 4. Unified Scenarios (The Architect's Core)
CREATE TABLE IF NOT EXISTS scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    blueprint JSONB NOT NULL, -- Extracted nodes/edges/viewport
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Global Unified Logs (Crucial for monitoring 3 apps)
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'LOGIN', 'SCENARIO_RUN', 'ERROR', 'SAVE'
    metadata JSONB, -- Context data
    level TEXT DEFAULT 'info', -- 'info', 'warn', 'error'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Simplified for dev)
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Scenarios: Only members of the app can see its scenarios
CREATE POLICY "Users can see scenarios of their apps" ON scenarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM app_memberships
            WHERE app_memberships.app_id = scenarios.app_id 
            AND app_memberships.profile_id = auth.uid()
        )
    );
