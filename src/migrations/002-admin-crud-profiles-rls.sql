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

-- 4. DELETE Policy (Delete: Only admin can delete profiles)
-- NOTE: Self-delete disabled intentionally — profile deletion should be admin-only.
create policy "Profiles DELETE policy"
on public.profiles for delete
to authenticated
using (
  public.is_admin()
);

-- ============================================================================
-- SECURITY TRIGGERS: Prevent role privilege escalation
-- ============================================================================

-- Trigger 1: Block non-admin users from changing the 'role' column on UPDATE
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Guard: profile id is immutable (tied to auth.users.id)
  if new.id is distinct from old.id then
    raise exception 'Cannot change profile id';
  end if;

  if new.role is distinct from old.role then
    -- Non-admin users cannot change any role
    if not public.is_admin() then
      raise exception 'Only admins can change user roles';
    end if;

    -- Prevent demoting the last admin (even by another admin or self-demotion)
    -- Advisory lock serializes concurrent admin demotion to prevent race conditions
    if old.role = 'admin' and new.role <> 'admin' then
      perform pg_advisory_xact_lock(42, hashtext('admin_role_lock'));
      if (
        select count(*) from public.profiles
        where role = 'admin' and id <> old.id
      ) = 0 then
        raise exception 'Cannot demote the last admin. Promote another user first.';
      end if;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_role_escalation on public.profiles;
create trigger trg_prevent_role_escalation
before update on public.profiles
for each row execute function public.prevent_role_self_escalation();

-- Trigger 2: Force default role on INSERT for non-admin users
-- Non-admin users inserting their own profile always get role = 'cashier'
create or replace function public.enforce_default_role_on_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    new.role := 'cashier';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_default_role on public.profiles;
create trigger trg_enforce_default_role
before insert on public.profiles
for each row execute function public.enforce_default_role_on_insert();

-- Trigger 3: Prevent deleting the last admin
create or replace function public.prevent_last_admin_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'admin' then
    -- Advisory lock serializes concurrent admin deletion to prevent race conditions
    perform pg_advisory_xact_lock(42, hashtext('admin_role_lock'));
    if (
      select count(*) from public.profiles
      where role = 'admin' and id <> old.id
    ) = 0 then
      raise exception 'Cannot delete the last admin. Promote another user first.';
    end if;
  end if;
  return old;
end;
$$;

drop trigger if exists trg_prevent_last_admin_delete on public.profiles;
create trigger trg_prevent_last_admin_delete
before delete on public.profiles
for each row execute function public.prevent_last_admin_delete();
