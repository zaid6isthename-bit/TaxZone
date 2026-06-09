-- Seed organization
insert into organizations (id, name, slug, status, plan_code)
values ('00000000-0000-0000-0000-000000000001', 'TaxZone Demo Corp', 'taxzone-demo', 'active', 'professional')
on conflict (id) do nothing;

-- Seed admin user (org_admin)
insert into users (id, organization_id, email, password_hash, user_type, status, name, first_login_required)
values (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'admin@taxzone.com',
  '$2b$12$yy6mZPm4h/tUyMR1PDWjZOCE6zhHFT1LnSswjzM90/I1amK0mDrkm',
  'org_admin',
  'active',
  'Rajesh Kumar',
  false
)
on conflict (id) do nothing;

-- Seed employee user
insert into users (id, organization_id, email, password_hash, user_type, status, name, first_login_required)
values (
  '00000000-0000-0000-0000-000000000020',
  '00000000-0000-0000-0000-000000000001',
  'employee@taxzone.com',
  '$2b$12$Y1kOt8WbbvVsTLcf.DdLUeje.VUJF2ckp/oPVlLh0/prTjc3fpeb6',
  'employee',
  'active',
  'Priya Sharma',
  false
)
on conflict (id) do nothing;

-- Seed employee profile
insert into employee_profiles (id, organization_id, user_id, department, workload_limit, active_case_count)
values (
  '00000000-0000-0000-0000-000000000021',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000020',
  'Tax Compliance',
  50,
  3
)
on conflict (id) do nothing;

-- Seed client user
insert into users (id, organization_id, email, password_hash, user_type, status, name, first_login_required)
values (
  '00000000-0000-0000-0000-000000000030',
  '00000000-0000-0000-0000-000000000001',
  'client@taxzone.com',
  '$2b$12$rO2n1mt71ZrRJj5ucc.fcOvPefyY4YMF3pIsuV3hFu13DemgCz6.S',
  'client',
  'active',
  'Amit Patel',
  false
)
on conflict (id) do nothing;

-- Seed client profile
insert into clients (id, organization_id, user_id, display_name, business_type, filing_category, pan, gstin, assigned_employee_id, assigned_manager_id)
values (
  '00000000-0000-0000-0000-000000000031',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000030',
  'Patel Trading Co.',
  'proprietorship',
  'gst',
  'ABCDE1234F',
  '27ABCDE1234F1Z5',
  '00000000-0000-0000-0000-000000000020',
  '00000000-0000-0000-0000-000000000010'
)
on conflict (id) do nothing;

-- Seed filings for the client
insert into filings (id, organization_id, client_id, category, period_start, period_end, due_at, status, reviewer_id, assigned_employee_id)
values
(
  '00000000-0000-0000-0000-000000000041',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000031',
  'GST Monthly',
  '2026-05-01',
  '2026-05-31',
  '2026-06-20T23:59:59Z',
  'not_started',
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000020'
)
on conflict (id) do nothing;

-- Seed document requests
insert into document_requests (id, organization_id, client_id, filing_id, requested_by_id, document_type, status)
values
(
  '00000000-0000-0000-0000-000000000051',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000031',
  '00000000-0000-0000-0000-000000000041',
  '00000000-0000-0000-0000-000000000020',
  'Bank Statement',
  'requested'
),
(
  '00000000-0000-0000-0000-000000000052',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000031',
  '00000000-0000-0000-0000-000000000041',
  '00000000-0000-0000-0000-000000000020',
  'Sales Invoice Register',
  'requested'
)
on conflict (id) do nothing;

-- Seed notifications
insert into notifications (id, organization_id, recipient_id, channel, event_type, title, body, status)
values
(
  '00000000-0000-0000-0000-000000000061',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000030',
  'in_app',
  'document_requested',
  'Document Requested',
  'Your bank statement has been requested for GST filing.',
  'sent'
),
(
  '00000000-0000-0000-0000-000000000062',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000030',
  'in_app',
  'filing_started',
  'Filing Started',
  'Your GST return filing has been initiated by Priya Sharma.',
  'sent'
)
on conflict (id) do nothing;

-- Seed roles
insert into roles (id, organization_id, name, scope)
values
('00000000-0000-0000-0000-000000000071', '00000000-0000-0000-0000-000000000001', 'Org Admin', 'organization'),
('00000000-0000-0000-0000-000000000072', '00000000-0000-0000-0000-000000000001', 'Employee', 'organization'),
('00000000-0000-0000-0000-000000000073', '00000000-0000-0000-0000-000000000001', 'Client', 'organization')
on conflict (id) do nothing;

-- Assign roles to users
insert into user_roles (user_id, role_id)
values
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000071'),
('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000072'),
('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000073')
on conflict (user_id, role_id) do nothing;
