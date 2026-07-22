-- Helper function to check if the authenticated user is an admin (Security Definer avoids RLS recursion)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Drop old policies on profiles table
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Profiles SELECT policy" on public.profiles;
drop policy if exists "Profiles INSERT policy" on public.profiles;
drop policy if exists "Profiles UPDATE policy" on public.profiles;
drop policy if exists "Profiles DELETE policy" on public.profiles;

-- 1. SELECT Policy (Read: User can view own profile, Admin can view ALL profiles)
create policy "Profiles SELECT policy"
on public.profiles for select
to authenticated
using (
  auth.uid() = id or public.is_admin()
);

-- 2. INSERT Policy (Create: User can insert own profile, Admin can insert ANY profile)
create policy "Profiles INSERT policy"
on public.profiles for insert
to authenticated
with check (
  auth.uid() = id or public.is_admin()
);

-- 3. UPDATE Policy (Update: User can update own profile, Admin can update ANY profile)
create policy "Profiles UPDATE policy"
on public.profiles for update
to authenticated
using (
  auth.uid() = id or public.is_admin()
)
with check (
  auth.uid() = id or public.is_admin()
);

-- 4. DELETE Policy (Delete: User can delete own profile, Admin can delete ANY profile)
create policy "Profiles DELETE policy"
on public.profiles for delete
to authenticated
using (
  auth.uid() = id or public.is_admin()
);
