-- 0003_enterprise_phase2.sql

-- 1. Compliance Rules Engine
create table if not exists compliance_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null, 
  
  rule_name text not null,
  severity text check (severity in ('info', 'warning', 'block')),
  category text not null, -- 'medical', 'finance', 'copyright'
  
  regex_pattern text,
  blocked_keywords text[],
  
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Compliance Checks Log
create table if not exists compliance_checks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  resource_type text not null, -- 'pattern', 'remix', 'export'
  resource_id text not null,
  
  status text not null, -- 'pass', 'warn', 'fail'
  violations jsonb, -- Details of what rules failed
  
  checked_at timestamptz default now(),
  checked_by uuid references auth.users(id)
);

-- 3. Reports & Exports
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  title text not null,
  
  report_type text not null, -- 'weekly_trend', 'monthly_strategy'
  config_snapshot jsonb, -- { "industry": "beauty", "channels": ["tiktok"] }
  
  status text default 'pending', -- 'generating', 'ready', 'failed'
  artifact_url text, -- Storage path to PDF/HTML
  
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- 4. Audit Log (Core Enterprise Feature)
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  
  actor_id uuid references auth.users(id),
  action text not null, -- 'login', 'export_report', 'change_rule', 'approve_asset'
  resource_target text,
  
  ip_address text,
  user_agent text,
  metadata jsonb, -- { "old_value": "...", "new_value": "..." }
  
  occurred_at timestamptz default now()
);

-- 5. RBAC Roles (Simplified)
-- In a real system, you might use a separate auth schema or mapping table.
-- Here we assume a simple 'tenant_roles' table exists or we create it.
create table if not exists tenant_roles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  user_id uuid not null references auth.users(id),
  role text not null check (role in ('admin', 'editor', 'viewer', 'compliance_officer')),
  created_at timestamptz default now()
);

-- RLS Policies
alter table compliance_rules enable row level security;
alter table compliance_checks enable row level security;
alter table reports enable row level security;
alter table audit_logs enable row level security;
alter table tenant_roles enable row level security;

-- Read-only for viewers, Write for admins
create policy "Admins manage rules" on compliance_rules
  using (exists (select 1 from tenant_roles where user_id = auth.uid() and role = 'admin' and tenant_id = compliance_rules.tenant_id));

create policy "Everyone reads rules" on compliance_rules
  for select using (tenant_id = auth.uid()); -- Simplified

-- Audit logs are append-only usually
create policy "View audit logs" on audit_logs
  for select using (exists (select 1 from tenant_roles where user_id = auth.uid() and role in ('admin', 'compliance_officer') and tenant_id = audit_logs.tenant_id));

create policy "Insert audit logs" on audit_logs
  for insert with check (tenant_id = auth.uid()); 
