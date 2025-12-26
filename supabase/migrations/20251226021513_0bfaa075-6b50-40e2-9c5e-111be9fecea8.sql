-- Create projects table linked to profiles
CREATE TABLE public.projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    logo TEXT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    looking_for TEXT NOT NULL,
    is_hiring BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can view all projects
CREATE POLICY "Projects are publicly readable"
ON public.projects
FOR SELECT
USING (true);

-- Allow insert via service role (edge function)
CREATE POLICY "Service role can create projects"
ON public.projects
FOR INSERT
WITH CHECK (true);

-- Allow update via service role (edge function)
CREATE POLICY "Service role can update projects"
ON public.projects
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow delete via service role (edge function)
CREATE POLICY "Service role can delete projects"
ON public.projects
FOR DELETE
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-feature projects when created with is_hiring = true
CREATE OR REPLACE FUNCTION public.auto_feature_projects()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.is_hiring = true THEN
    NEW.is_featured = true;
  ELSE
    NEW.is_featured = false;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_feature_projects_trigger
BEFORE INSERT OR UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.auto_feature_projects();

-- Enable realtime for projects
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;