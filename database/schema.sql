-- /database/schema.sql
-- PLM SaaS MVP schema for Supabase PostgreSQL

create extension if not exists "pgcrypto";

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  industry text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  organization_id uuid not null references organizations(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'member',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists permissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  resource text not null,
  action text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id, resource, action)
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  sku text,
  description text,
  lifecycle_stage text not null default 'concept',
  status text not null default 'active',
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name text not null,
  description text,
  owner_id uuid references users(id) on delete set null,
  status text not null default 'planning',
  start_date date,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  name text not null,
  description text,
  due_date date,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  milestone_id uuid references milestones(id) on delete set null,
  title text not null,
  description text,
  assignee_id uuid references users(id) on delete set null,
  status text not null default 'todo',
  priority text not null default 'medium',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  version_number integer not null,
  changelog text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, entity_type, entity_id, version_number)
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  file_name text not null,
  file_path text not null,
  file_url text,
  mime_type text,
  size_bytes bigint,
  version_id uuid references versions(id) on delete set null,
  uploaded_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cad_files (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  title text not null,
  file_name text not null,
  file_path text not null,
  file_url text,
  preview_url text,
  version_id uuid references versions(id) on delete set null,
  uploaded_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists boms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  bom_number text,
  revision text not null default 'A',
  status text not null default 'draft',
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  contact_name text,
  email text,
  phone text,
  certifications text,
  rating numeric(3,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists components (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  bom_id uuid not null references boms(id) on delete cascade,
  parent_component_id uuid references components(id) on delete cascade,
  supplier_id uuid references suppliers(id) on delete set null,
  part_number text not null,
  name text not null,
  quantity numeric(12,2) not null default 1,
  unit text,
  unit_cost numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists change_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  order_number text,
  title text not null,
  description text,
  status text not null default 'open',
  priority text not null default 'medium',
  requested_by uuid references users(id) on delete set null,
  approved_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  entity_type text not null,
  status text not null default 'active',
  definition jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  workflow_id uuid references workflows(id) on delete set null,
  change_order_id uuid references change_orders(id) on delete cascade,
  approver_id uuid references users(id) on delete set null,
  status text not null default 'pending',
  comments text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  user_id uuid references users(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists costs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  component_id uuid references components(id) on delete set null,
  cost_type text not null,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  effective_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  template_type text not null,
  data jsonb not null default '{}'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists custom_fields (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  entity_type text not null,
  field_key text not null,
  label text not null,
  data_type text not null,
  required boolean not null default false,
  options jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, entity_type, field_key)
);

create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  provider text not null,
  name text not null,
  config jsonb not null default '{}'::jsonb,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Attach update trigger to all tables with updated_at
DO $$
DECLARE
  t record;
BEGIN
  FOR t IN
    SELECT table_name
    FROM information_schema.columns
    WHERE column_name = 'updated_at' AND table_schema = 'public'
  LOOP
    EXECUTE format('drop trigger if exists trg_%I_updated_at on %I;', t.table_name, t.table_name);
    EXECUTE format('create trigger trg_%I_updated_at before update on %I for each row execute function set_updated_at();', t.table_name, t.table_name);
  END LOOP;
END $$;

create index if not exists idx_users_org on users(organization_id);
create index if not exists idx_products_org on products(organization_id);
create index if not exists idx_projects_org on projects(organization_id);
create index if not exists idx_documents_org on documents(organization_id);
create index if not exists idx_boms_org on boms(organization_id);
create index if not exists idx_components_bom on components(bom_id);
create index if not exists idx_change_orders_org on change_orders(organization_id);
create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_audit_logs_org on audit_logs(organization_id);

-- Added multi-tenant team and invitation support
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  role text not null,
  invited_by uuid references users(id) on delete set null,
  status text not null default 'pending',
  token text not null unique,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Additional indexes for new tables
create index if not exists idx_team_members_org on team_members(organization_id);
create index if not exists idx_invitations_org on invitations(organization_id);
-- Product metadata extensions
alter table if exists products add column if not exists version text default 'v1';
alter table if exists products add column if not exists owner_id uuid references users(id) on delete set null;
alter table if exists products add column if not exists weight numeric(12,3);
alter table if exists products add column if not exists dimensions text;
alter table if exists products add column if not exists category text;
alter table if exists products add column if not exists compliance_status text;
-- Document metadata & lifecycle fields
alter table if exists documents add column if not exists document_number text;
alter table if exists documents add column if not exists version text default 'v1';
alter table if exists documents add column if not exists file_type text;
alter table if exists documents add column if not exists owner_id uuid references users(id) on delete set null;
alter table if exists documents add column if not exists status text default 'draft';
create index if not exists idx_documents_org_status on documents(organization_id, status);
