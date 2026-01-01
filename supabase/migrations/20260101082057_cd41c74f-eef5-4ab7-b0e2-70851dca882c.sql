-- Add is_starter column to feedback_posts for permanent starter posts
ALTER TABLE public.feedback_posts 
ADD COLUMN is_starter boolean NOT NULL DEFAULT false;

-- Update RLS policy to show starter posts (they never expire)
DROP POLICY IF EXISTS "Anyone can read non-expired posts" ON public.feedback_posts;

CREATE POLICY "Anyone can read active posts" 
ON public.feedback_posts 
FOR SELECT 
USING (expires_at > now() OR is_starter = true);