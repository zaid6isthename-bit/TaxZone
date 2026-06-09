-- RLS policies for organizations
create policy "Users can view their own organization"
  on organizations for select
  using (id in (
    select organization_id from users where id = auth.uid()
  ));

-- RLS policies for users
create policy "Users can view users in their organization"
  on users for select
  using (organization_id in (
    select organization_id from users where id = auth.uid()
  ));

-- RLS policies for clients
create policy "Users can view clients in their organization"
  on clients for select
  using (organization_id in (
    select organization_id from users where id = auth.uid()
  ));

create policy "Employees can insert clients"
  on clients for insert
  with check (organization_id in (
    select organization_id from users where id = auth.uid()
      and user_type in ('org_admin', 'manager', 'employee')
  ));

-- RLS policies for filings
create policy "Users can view filings in their organization"
  on filings for select
  using (organization_id in (
    select organization_id from users where id = auth.uid()
  ));

-- RLS policies for documents
create policy "Users can view documents in their organization"
  on documents for select
  using (organization_id in (
    select organization_id from users where id = auth.uid()
  ));

-- RLS policies for document_requests
create policy "Users can view document requests in their organization"
  on document_requests for select
  using (organization_id in (
    select organization_id from users where id = auth.uid()
  ));

-- RLS policies for notifications
create policy "Users can view their own notifications"
  on notifications for select
  using (recipient_id = auth.uid());

-- RLS policies for tasks
create policy "Users can view tasks in their organization or assigned to them"
  on tasks for select
  using (
    assigned_to_id = auth.uid()
    or organization_id in (
      select organization_id from users where id = auth.uid()
    )
  );

-- RLS policies for audit_logs (admin only)
create policy "Admins can view audit logs"
  on audit_logs for select
  using (organization_id in (
    select organization_id from users where id = auth.uid()
      and user_type in ('super_admin', 'org_admin')
  ));

-- Create storage bucket for documents
insert into storage.buckets (id, name, public)
values ('taxzone-documents', 'taxzone-documents', false)
on conflict (id) do nothing;

-- Allow authenticated users to upload to their org folder
create policy "Users can upload documents"
  on storage.objects for insert
  with check (
    bucket_id = 'taxzone-documents'
    and auth.role() = 'authenticated'
  );

create policy "Users can view documents in their org folder"
  on storage.objects for select
  using (
    bucket_id = 'taxzone-documents'
    and auth.role() = 'authenticated'
  );
