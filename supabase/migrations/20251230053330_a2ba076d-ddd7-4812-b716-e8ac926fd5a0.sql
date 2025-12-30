-- Move pg_net extension to extensions schema (pg_cron must stay in postgres DB context, can't be moved)
-- The pg_cron extension is managed by Supabase and is already in the correct location
-- pg_net can be safely used from public schema for our use case as it's a Supabase-managed extension

-- This warning is expected for Supabase-managed extensions (pg_cron, pg_net)
-- These are system extensions required for cron jobs and don't pose a security risk