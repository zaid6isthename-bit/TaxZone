create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  name text not null,
  scope text not null default 'organization',
  created_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists permissions (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  action text not null,
  resource text not null,
  unique (module, action, resource)
);

create table if not exists role_permissions (
  role_id uuid not null references roles(id),
  permission_id uuid not null references permissions(id),
  primary key (role_id, permission_id)
);

create table if not exists user_roles (
  user_id uuid not null references users(id),
  role_id uuid not null references roles(id),
  primary key (user_id, role_id)
);

create table if not exists employee_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  user_id uuid not null references users(id),
  department text,
  workload_limit int not null default 50,
  skills text[] not null default '{}',
  active_case_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  client_id uuid references clients(id),
  filing_id uuid references filings(id),
  title text not null,
  description text,
  assigned_to_id uuid not null references users(id),
  created_by_id uuid references users(id),
  priority text not null default 'normal',
  status text not null default 'open',
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_org_assigned_status on tasks (organization_id, assigned_to_id, status);

create table if not exists internal_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  client_id uuid references clients(id),
  filing_id uuid references filings(id),
  author_id uuid not null references users(id),
  parent_note_id uuid references internal_notes(id),
  body text not null,
  priority text not null default 'normal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table roles enable row level security;
alter table permissions enable row level security;
alter table role_permissions enable row level security;
alter table user_roles enable row level security;
alter table employee_profiles enable row level security;
alter table tasks enable row level security;
alter table internal_notes enable row level security;
