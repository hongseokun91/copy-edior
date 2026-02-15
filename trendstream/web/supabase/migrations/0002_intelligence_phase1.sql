-- 0002_intelligence_phase1.sql

-- Enable pgvector if not enabled (usually requires superuser, may fail in some envs if not pre-enabled)
create extension if not exists vector with schema extensions;

-- 1. Normalized Metrics (TimeSeries-ready)
create table if not exists metrics_normalized (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  platform text not null, -- 'youtube', 'tiktok', 'instagram'
  external_id text not null,
  
  views_count bigint default 0,
  likes_count bigint default 0,
  comments_count bigint default 0,
  shares_count bigint default 0,
  
  engagement_rate numeric(10,5), -- e.g. 0.05432
  velocity_24h numeric(10,2),    -- views per hour last 24h
  
  collected_at timestamptz default now(),
  
  constraint unique_metric_point unique (tenant_id, platform, external_id, collected_at)
);

-- 2. Pattern Clusters (The "Brain")
create table if not exists pattern_clusters (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  name text, -- Auto-generated label like "Fast-paced hooks"
  
  embedding vector(1536), -- ADA-002 or similar
  centroid_vector vector(1536),
  
  pattern_type text not null, -- 'hook', 'structure', 'cta', 'visual'
  confidence_score numeric(5,2),
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Trend Signals
create table if not exists trend_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  cluster_id uuid references pattern_clusters(id),
  
  signal_type text not null, -- 'rising', 'peaking', 'cooling'
  strength numeric(5,2), -- 0-100 score
  velocity_change_7d numeric(5,2), -- % change
  
  detected_at timestamptz default now()
);

-- 4. Preflight Scores
create table if not exists preflight_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  input_hash text not null, -- hash of the content being checked
  
  final_score numeric(5,2), -- 0-100
  predicted_virality text, -- 'low', 'medium', 'high'
  
  improvement_levers jsonb, -- ["Shorten hook", "Add captions"]
  
  created_at timestamptz default now()
);

-- RLS
alter table metrics_normalized enable row level security;
alter table pattern_clusters enable row level security;
alter table trend_signals enable row level security;
alter table preflight_scores enable row level security;

-- Simple RLS Policy (Tenant Isolation)
create policy "Tenant Isolation Metrics" on metrics_normalized
  using (tenant_id = auth.uid()); -- Simplified; in real app usually auth.uid() joins to a tenant_users table

create policy "Tenant Isolation Clusters" on pattern_clusters
  using (tenant_id = auth.uid());

create policy "Tenant Isolation Trends" on trend_signals
  using (tenant_id = auth.uid());

create policy "Tenant Isolation Preflight" on preflight_scores
  using (tenant_id = auth.uid());
