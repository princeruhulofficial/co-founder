-- Enable required extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule cleanup to run every hour
SELECT cron.schedule(
  'cleanup-expired-feedback-posts',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT net.http_post(
    url := 'https://nmodpjhzxiqrwqqeetyd.supabase.co/functions/v1/cleanup-feedback',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tb2Rwamh6eGlxcndxcWVldHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NDAxMzcsImV4cCI6MjA4MjExNjEzN30.genxicBRCYyBBvSqCS0He7rj5QxloD6yOjpl9zK7fO0"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);