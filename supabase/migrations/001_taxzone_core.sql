create extension if not exists "pgcrypto";
create extension if not exists "citext";

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  status text not null default 'active',
  plan_code text not null default 'starter',
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  email citext unique not null,
  phone text,
  password_hash text,
  user_type text not null,
  status text not null default 'invited',
  first_login_required boolean not null default true,
  email_verified_at timestamptz,
  phone_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  user_id uuid references users(id),
  display_name text not null,
  business_type text not null default 'individual',
  filing_category text not null default 'gst',
  pan text,
  gstin text,
  assigned_employee_id uuid references users(id),
  assigned_manager_id uuid references users(id),
  onboarding_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (organization_id, pan),
  unique (organization_id, gstin)
);

create table if not exists filings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  client_id uuid not null references clients(id),
  category text not null,
  period_start date not null,
  period_end date not null,
  due_at timestamptz not null,
  status text not null default 'not_started',
  reviewer_id uuid references users(id),
  assigned_employee_id uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists document_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  client_id uuid not null references clients(id),
  filing_id uuid references filings(id),
  requested_by_id uuid references users(id),
  document_type text not null,
  due_at timestamptz,
  status text not null default 'requested',
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  client_id uuid not null references clients(id),
  request_id uuid references document_requests(id),
  filing_id uuid references filings(id),
  uploaded_by_id uuid references users(id),
  storage_key text,
  original_filename text,
  mime_type text,
  file_size_bytes bigint,
  checksum_sha256 text,
  version_number int not null default 1,
  verification_status text not null default 'uploaded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  recipient_id uuid not null references users(id),
  channel text not null default 'in_app',
  event_type text not null,
  title text not null,
  body text not null,
  status text not null default 'queued',
  provider_message_id text,
  retry_count int not null default 0,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  read_at timestamptz
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  actor_user_id uuid references users(id),
  action_type text not null,
  entity_type text not null,
  entity_id uuid,
  ip_address inet,
  user_agent text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_clients_org_assigned on clients (organization_id, assigned_employee_id);
create index if not exists idx_filings_org_status_due on filings (organization_id, status, due_at);
create index if not exists idx_doc_requests_org_status_due on document_requests (organization_id, status, due_at);
create index if not exists idx_documents_org_client on documents (organization_id, client_id);
create index if not exists idx_notifications_recipient_status on notifications (organization_id, recipient_id, status);
create index if not exists idx_audit_org_created on audit_logs (organization_id, created_at desc);

alter table organizations enable row level security;
alter table users enable row level security;
alter table clients enable row level security;
alter table filings enable row level security;
alter table document_requests enable row level security;
alter table documents enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

