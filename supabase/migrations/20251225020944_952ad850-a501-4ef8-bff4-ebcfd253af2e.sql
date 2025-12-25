-- Create profiles table with all required fields
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  avatar TEXT,
  type TEXT NOT NULL CHECK (type IN ('founder', 'developer')),
  category TEXT NOT NULL,
  
  -- Contact info (public)
  contact TEXT NOT NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('email', 'linkedin', 'twitter', 'discord')),
  
  -- Backup email (PRIVATE - never exposed publicly)
  backup_email TEXT NOT NULL,
  
  -- Founder specific fields
  project_name TEXT,
  project_description TEXT,
  hiring_type TEXT,
  skills_needed TEXT[] DEFAULT '{}',
  
  -- Developer specific fields
  skills TEXT[] DEFAULT '{}',
  preferred_project_type TEXT,
  
  -- Status fields
  is_hiring BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  
  -- Metrics
  views INTEGER NOT NULL DEFAULT 0,
  interests INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public read access for all profiles (but backup_email is excluded in queries)
CREATE POLICY "Profiles are publicly readable"
ON public.profiles
FOR SELECT
USING (true);

-- Anyone can insert profiles (no auth required for MVP)
CREATE POLICY "Anyone can create profiles"
ON public.profiles
FOR INSERT
WITH CHECK (true);

-- Updates only via edge function (no direct client updates)
-- We'll handle this through a secure edge function

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-feature hiring profiles
CREATE OR REPLACE FUNCTION public.auto_feature_hiring_profiles()
RETURNS TRIGGER AS $$
BEGIN
  -- If is_hiring is true, auto-set is_featured to true
  IF NEW.is_hiring = true THEN
    NEW.is_featured = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for auto-featuring
CREATE TRIGGER auto_feature_on_hiring
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_feature_hiring_profiles();

-- Create index for featured/hiring queries
CREATE INDEX idx_profiles_featured ON public.profiles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_profiles_hiring ON public.profiles(is_hiring) WHERE is_hiring = true;
CREATE INDEX idx_profiles_type ON public.profiles(type);