-- ============================================================================
-- FIX: Trust role from auth.users metadata when inserted via the
-- trusted system trigger (handler_new_user), avoiding auth.role() / auth.uid()
-- NULL context issues during GoTrue's internal trigger execution.
--
-- Includes defense-in-depth whitelist validation for allowed roles:
-- 'admin', 'cashier', 'kitchen' (falls back to 'cashier' for unknown values).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handler_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  requested_role text := new.raw_user_meta_data ->> 'role';
BEGIN
  -- Defense-in-depth: whitelist allowed roles in database layer
  IF requested_role NOT IN ('admin', 'cashier', 'kitchen') THEN
    requested_role := 'cashier';
  END IF;

  -- Mark this insert as trusted within this transaction
  PERFORM set_config('app.trusted_profile_insert', 'true', true);

  INSERT INTO public.profiles (id, name, role, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'name',
    requested_role,
    new.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN new;
END;
$$;

-- Update guard trigger on profiles to trust this transaction-local flag
CREATE OR REPLACE FUNCTION public.enforce_default_role_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Trust inserts originating from handler_new_user()
  IF coalesce(current_setting('app.trusted_profile_insert', true), '') = 'true' THEN
    RETURN new;
  END IF;

  -- Fallback for direct client inserts via PostgREST
  IF NOT public.is_admin() THEN
    new.role := 'cashier';
  END IF;
  RETURN new;
END;
$$;
