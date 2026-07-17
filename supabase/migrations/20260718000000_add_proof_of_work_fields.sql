-- Add proof-of-work and verification fields to profiles
-- Run this migration in your Supabase SQL editor or via supabase db push

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS github text,
ADD COLUMN IF NOT EXISTS linkedin text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS reputation_score integer DEFAULT 0;

-- Optional: backfill is_verified for existing profiles that already have links in description
-- UPDATE profiles
-- SET is_verified = true
-- WHERE project_description ILIKE '%github%' OR project_description ILIKE '%linkedin%' OR preferred_project_type ILIKE '%github%';

COMMENT ON COLUMN profiles.github IS 'GitHub profile URL';
COMMENT ON COLUMN profiles.linkedin IS 'LinkedIn profile URL';
COMMENT ON COLUMN profiles.website IS 'Personal or project website URL';
COMMENT ON COLUMN profiles.is_verified IS 'True when user provided at least one proof-of-work link';
COMMENT ON COLUMN profiles.reputation_score IS 'Simple reputation score (views + interests + completeness)';
