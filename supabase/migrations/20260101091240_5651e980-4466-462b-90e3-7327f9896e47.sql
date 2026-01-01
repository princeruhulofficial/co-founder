-- Create job_listings table for standalone job postings (no auth required)
CREATE TABLE public.job_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  description TEXT NOT NULL,
  looking_for TEXT NOT NULL,
  contact_email TEXT,
  contact_other TEXT,
  management_code TEXT NOT NULL DEFAULT substr(md5(random()::text), 1, 12),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

-- Anyone can create job listings
CREATE POLICY "Anyone can create job listings"
ON public.job_listings
FOR INSERT
WITH CHECK (true);

-- Only show active job listings publicly
CREATE POLICY "Active job listings are publicly readable"
ON public.job_listings
FOR SELECT
USING (status = 'active');

-- Service role can update job listings (for closing via edge function)
CREATE POLICY "Service role can update job listings"
ON public.job_listings
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_job_listings_updated_at
BEFORE UPDATE ON public.job_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();