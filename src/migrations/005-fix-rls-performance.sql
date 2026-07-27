-- ============================================================================
-- MIGRATION 005: Fix RLS Performance (Safe Version)
-- ============================================================================
-- Root cause: is_admin() is called 3-4 times per UPDATE request via RLS
-- policies and triggers, each doing a full table scan on profiles.
--
-- This index alone makes every is_admin() call and last-admin count query
-- use an index lookup instead of a sequential scan.
-- ============================================================================

-- Index for fast role lookups used by is_admin() and last-admin count checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
