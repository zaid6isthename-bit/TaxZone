-- TaxZone Supabase Schema

-- Extensions
create extension if not exists "uuid-ossp";

-- USERS TABLE (Linked to auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  phone text unique,
  email text unique,
  role text not null check (role in ('client', 'employee', 'ca_reviewer', 'manager', 'org_admin', 'super_admin')),
  business_name text,
  gstin text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.users for select using (
  exists (select 1 from public.users where id = auth.uid() and role in ('org_admin', 'super_admin'))
);

-- FILINGS TABLE
create table public.filings (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.users on delete cascade not null,
  assigned_ca_id uuid references public.users,
  type text not null,
  period text not null,
  current_status text not null,
  completion_percentage integer default 0,
  days_until_due integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.filings enable row level security;
create policy "Clients can view own filings" on public.filings for select using (client_id = auth.uid());
create policy "Employees can view assigned filings" on public.filings for select using (assigned_ca_id = auth.uid());
create policy "Admins can view all filings" on public.filings for select using (
  exists (select 1 from public.users where id = auth.uid() and role in ('org_admin', 'super_admin'))
);

-- DOCUMENTS TABLE
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.users on delete cascade not null,
  filing_id uuid references public.filings on delete cascade,
  name text not null,
  url text not null,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.documents enable row level security;
create policy "Clients can view own documents" on public.documents for select using (client_id = auth.uid());
create policy "Clients can insert own documents" on public.documents for insert with check (client_id = auth.uid());
create policy "Employees can view assigned documents" on public.documents for select using (
  exists (select 1 from public.filings f where f.id = filing_id and f.assigned_ca_id = auth.uid())
);
create policy "Admins can view all documents" on public.documents for select using (
  exists (select 1 from public.users where id = auth.uid() and role in ('org_admin', 'super_admin'))
);

-- NOTIFICATIONS TABLE
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  message text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (user_id = auth.uid());
create policy "Users can update own notifications" on public.notifications for update using (user_id = auth.uid());

-- Triggers for automatic user creation (Optional but recommended)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, name, phone, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'New User'), new.phone, new.email, coalesce(new.raw_user_meta_data->>'role', 'client'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- STORAGE SETUP
insert into storage.buckets (id, name, public) values ('documents', 'documents', true) on conflict do nothing;
create policy "Clients can upload documents" on storage.objects for insert with check (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Clients can view own documents" on storage.objects for select using (bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]);
