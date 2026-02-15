-- 0004_phase3_automation.sql

-- 1. Scheduler / Jobs
create table if not exists job_schedules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  
  job_name text not null, -- 'weekly_digest', 'sync_youtube'
  cron_expression text not null, -- '0 9 * * 1'
  is_active boolean default true,
  
  config jsonb, -- { "target_email": "...", "depth": 100 }
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists job_runs (
  id uuid primary key default gen_random_uuid(),
  job_schedule_id uuid references job_schedules(id),
  tenant_id uuid not null,
  
  status text not null, -- 'running', 'completed', 'failed'
  started_at timestamptz default now(),
  completed_at timestamptz,
  
  result_summary jsonb,
  error_message text
);

-- 2. Notification Preferences & Logs
create table if not exists notification_settings (
  tenant_id uuid primary key, -- One per tenant
  channels jsonb default '{"email": true, "slack": false}',
  slack_webhook_url text, -- Encrypt in app level recommended, but Schema here
  alert_thresholds jsonb -- { "virality_score": 80 }
);

create table if not exists notification_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  
  channel text not null, -- 'email', 'slack'
  recipient text,
  subject text,
  
  sent_at timestamptz default now(),
  status text -- 'sent', 'bounced'
);

-- 3. Marketplace (Shared Patterns)
create table if not exists marketplace_packs (
  id uuid primary key default gen_random_uuid(),
  publisher_tenant_id uuid not null, -- Who published this?
  
  title text not null,
  description text,
  price_model text default 'free', -- 'free', 'one-time', 'subscription'
  
  version text default '1.0.0',
  is_public boolean default false,
  is_verified boolean default false, -- Platform admin verification
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists marketplace_installs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null, -- Who installed it?
  pack_id uuid references marketplace_packs(id),
  
  installed_at timestamptz default now(),
  status text default 'active'
);

-- RLS
alter table job_schedules enable row level security;
alter table job_runs enable row level security;
alter table notification_settings enable row level security;
alter table notification_logs enable row level security;
alter table marketplace_packs enable row level security;
alter table marketplace_installs enable row level security;

-- Policies (Simplified)
create policy "Tenant Jobs" on job_schedules using (tenant_id = auth.uid());
create policy "Tenant Job Runs" on job_runs using (tenant_id = auth.uid());
create policy "Tenant Notif Settings" on notification_settings using (tenant_id = auth.uid());
-- Marketplace: Public packs are readable by everyone, restricted by publisher
create policy "Read Public Packs" on marketplace_packs 
  for select using (is_public = true or publisher_tenant_id = auth.uid());
