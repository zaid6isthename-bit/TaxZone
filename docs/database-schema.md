# Database Schema

PostgreSQL is the source of truth. All IDs are UUIDs. Tenant-owned tables include `organization_id`, timestamps, soft-delete metadata, and useful composite indexes.

## Tenant Isolation

- Required column: `organization_id UUID NOT NULL`.
- Every repository method receives a tenant context.
- Composite indexes begin with `organization_id` for tenant-scoped queries.
- Optional RLS policy:

```sql
CREATE POLICY tenant_isolation ON clients
USING (organization_id = current_setting('app.organization_id')::uuid);
```

## Core Tables

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('trial','active','suspended','cancelled')),
  plan_code TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  email CITEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('super_admin','org_admin','manager','employee','ca_reviewer','client')),
  status TEXT NOT NULL CHECK (status IN ('invited','active','locked','disabled')),
  first_login_required BOOLEAN NOT NULL DEFAULT true,
  email_verified_at TIMESTAMPTZ,
  phone_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE roles (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('platform','organization')),
  created_at TIMESTAMPTZ NOT NULL,
  UNIQUE (organization_id, name)
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  UNIQUE (module, action, resource)
);

CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id),
  permission_id UUID NOT NULL REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);
```

## Clients And Employees

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  display_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  filing_category TEXT NOT NULL,
  pan TEXT,
  gstin TEXT,
  assigned_employee_id UUID REFERENCES users(id),
  assigned_manager_id UUID REFERENCES users(id),
  onboarding_status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ,
  UNIQUE (organization_id, pan),
  UNIQUE (organization_id, gstin)
);

CREATE TABLE employee_profiles (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES users(id),
  department TEXT,
  workload_limit INT NOT NULL DEFAULT 50,
  skills TEXT[] NOT NULL DEFAULT '{}',
  active_case_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  UNIQUE (organization_id, user_id)
);
```

## Filings, Workflows, Documents

```sql
CREATE TABLE filings (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  client_id UUID NOT NULL REFERENCES clients(id),
  category TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  due_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started','awaiting_documents','documents_under_review','in_progress','filed','completed','rejected','needs_correction','on_hold')),
  reviewer_id UUID REFERENCES users(id),
  assigned_employee_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE document_requests (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  client_id UUID NOT NULL REFERENCES clients(id),
  filing_id UUID REFERENCES filings(id),
  requested_by_id UUID NOT NULL REFERENCES users(id),
  document_type TEXT NOT NULL,
  due_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('requested','uploaded','pending_verification','approved','rejected','archived')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE documents (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  client_id UUID NOT NULL REFERENCES clients(id),
  request_id UUID REFERENCES document_requests(id),
  filing_id UUID REFERENCES filings(id),
  uploaded_by_id UUID NOT NULL REFERENCES users(id),
  storage_key TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  version_number INT NOT NULL DEFAULT 1,
  verification_status TEXT NOT NULL CHECK (verification_status IN ('uploaded','pending_verification','approved','rejected','archived')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ
);
```

## Operational Tables

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  client_id UUID REFERENCES clients(id),
  filing_id UUID REFERENCES filings(id),
  assigned_to_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low','normal','high','urgent')),
  status TEXT NOT NULL CHECK (status IN ('open','in_progress','blocked','done','cancelled')),
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE internal_notes (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  client_id UUID REFERENCES clients(id),
  filing_id UUID REFERENCES filings(id),
  author_id UUID NOT NULL REFERENCES users(id),
  parent_note_id UUID REFERENCES internal_notes(id),
  body TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  recipient_id UUID NOT NULL REFERENCES users(id),
  channel TEXT NOT NULL CHECK (channel IN ('push','email','sms','whatsapp','in_app')),
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued','sent','failed','read')),
  provider_message_id TEXT,
  retry_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  organization_id UUID,
  actor_user_id UUID REFERENCES users(id),
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL
);
```

## Indexing

```sql
CREATE INDEX idx_clients_org_assigned ON clients (organization_id, assigned_employee_id);
CREATE INDEX idx_filings_org_status_due ON filings (organization_id, status, due_at);
CREATE INDEX idx_doc_requests_org_status_due ON document_requests (organization_id, status, due_at);
CREATE INDEX idx_documents_org_client ON documents (organization_id, client_id);
CREATE INDEX idx_tasks_org_assignee_status ON tasks (organization_id, assigned_to_id, status);
CREATE INDEX idx_notifications_recipient_status ON notifications (organization_id, recipient_id, status);
CREATE INDEX idx_audit_org_created ON audit_logs (organization_id, created_at DESC);
```

