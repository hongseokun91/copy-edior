-- 0001_trendstream.sql

-- 1. Tenants (Isolation Root)
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- 2. Raw Inputs (Ingestion Layer)
create table if not exists raw_inputs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  
  url text not null,
  platform text not null, -- 'youtube', 'instagram', 'tiktok'
  
  metadata jsonb default '{}', -- Title, description, raw view counts
  status text default 'pending', -- 'pending', 'processing', 'completed', 'failed'
  
  created_at timestamptz default now()
);

-- 3. Users (Stub for Auth)
-- This usually mirrors auth.users but strictly for app-level data
create table if not exists user_profiles (
  id uuid primary key references auth.users(id),
  tenant_id uuid references tenants(id),
  full_name text,
  role text default 'viewer',
  created_at timestamptz default now()
);

-- RLS Enablement
alter table tenants enable row level security;
alter table raw_inputs enable row level security;
alter table user_profiles enable row level security;

-- Basic Policies (Placeholder)
-- In real prod, these rely on auth.uid() matching user_profiles.id -> tenant_id
create policy "Users can view their own tenant" on tenants
  for select using (true); -- TODO: Tighten for prod

create policy "Tenant isolation for inputs" on raw_inputs
  using (true); -- TODO: Tighten to tenant_id check

create policy "Users manage own profile" on user_profiles
  using (id = auth.uid());
