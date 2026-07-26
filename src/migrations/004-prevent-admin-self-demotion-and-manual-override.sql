-- ============================================================================
-- MIGRATION: Prevent admin self-demotion + manual DB override capability
--
-- Changes to prevent_role_self_escalation():
-- 1. Admins can no longer change their OWN role via normal app flow
--    (auth.uid() = old.id), regardless of how many other admins exist.
--    This is stricter than the existing last-admin protection below.
-- 2. Admins CAN still change other admins' roles (subject to last-admin check).
-- ============================================================================
-- MANUAL OVERRIDE USAGE (run only via direct DB connection, not via app):
--
--   Option A: Single DO block (Recommended for SQL runners / Supabase Dashboard):
--     DO $$
--     BEGIN
--       PERFORM set_config('app.bypass_role_protection', 'true', true);
--       UPDATE public.profiles SET role = 'cashier' WHERE id = '<user_id>';
--     END $$;
--
--   Option B: Explicit Transaction:
--     BEGIN;
--       SELECT set_config('app.bypass_role_protection', 'true', true);
--       UPDATE public.profiles SET role = 'cashier' WHERE id = '<user_id>';
--     COMMIT;
--
-- The flag is transaction-local and resets automatically after execution.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF coalesce(current_setting('app.bypass_role_protection', true), '') = 'true' THEN
    RETURN new;
  END IF;

  -- Guard: profile id is immutable (tied to auth.users.id)
  IF new.id IS DISTINCT FROM old.id THEN
    RAISE EXCEPTION 'Cannot change profile id';
  END IF;

  IF new.role IS DISTINCT FROM old.role THEN

    -- Non-admin users cannot change any role
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;

    -- Admins cannot change their own role via normal app flow,
    -- even if other admins exist. Only another admin (or the manual
    -- override above) can change this admin's role.
    IF old.role = 'admin' AND auth.uid() = old.id THEN
      RAISE EXCEPTION 'Admins cannot change their own role';
    END IF;

    -- Prevent demoting the last admin (even by another admin)
    -- Advisory lock serializes concurrent admin demotion to prevent race conditions
    IF old.role = 'admin' AND new.role <> 'admin' THEN
      PERFORM pg_advisory_xact_lock(42, hashtext('admin_role_lock'));
      IF (
        SELECT count(*) FROM public.profiles
        WHERE role = 'admin' AND id <> old.id
      ) = 0 THEN
        RAISE EXCEPTION 'Cannot demote the last admin. Promote another user first.';
      END IF;
    END IF;

  END IF;
  RETURN new;
END;
$$;

-- Trigger definition unchanged, but re-create for safety/idempotency
DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_self_escalation();
