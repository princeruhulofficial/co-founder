-- Create RLS policy to allow updates via service role (edge functions)
CREATE POLICY "Service role can update profiles"
ON public.profiles
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create functions for incrementing views and interests
CREATE OR REPLACE FUNCTION public.increment_views(profile_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET views = views + 1
  WHERE id = profile_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_interests(profile_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET interests = interests + 1
  WHERE id = profile_id;
END;
$$;