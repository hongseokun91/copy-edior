-- 0005_phase3_1_3_2.sql

-- Phase 3.1: Approval Workflow
create table if not exists approval_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  requester_id uuid references auth.users(id),
  
  request_type text not null, -- 'publish_pack', 'export_report'
  subject_id text not null,   -- ID of the thing being approved
  subject_snapshot jsonb,     -- Snapshot of data at time of request
  
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  
  approver_id uuid references auth.users(id),
  approval_note text,
  
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- Phase 3.2: Delivery Pipeline
-- Extending built-in tables or new ones
create table if not exists delivery_pipelines (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  
  name text not null,
  trigger_event text not null, -- 'report_generated', 'trend_alert'
  
  destinations jsonb, -- [{ "type": "slack", "channel": "#trends" }, { "type": "email", "list": "execs" }]
  
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists delivery_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  pipeline_id uuid references delivery_pipelines(id),
  
  trigger_ref text, -- e.g. report_id
  
  status text, -- 'success', 'partial', 'failed'
  logs jsonb,
  
  created_at timestamptz default now()
);

-- RLS
alter table approval_requests enable row level security;
alter table delivery_pipelines enable row level security;
alter table delivery_runs enable row level security;

create policy "Tenant Approvals" on approval_requests using (tenant_id = auth.uid());
create policy "Tenant Pipelines" on delivery_pipelines using (tenant_id = auth.uid());
create policy "Tenant Delivery Runs" on delivery_runs using (tenant_id = auth.uid());
