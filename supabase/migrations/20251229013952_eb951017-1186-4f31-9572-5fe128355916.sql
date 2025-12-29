-- Create feedback_posts table with 24h auto-expiry logic
CREATE TABLE public.feedback_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  title TEXT NOT NULL,
  context TEXT NOT NULL,
  question TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours')
);

-- Create feedback_reactions table
CREATE TABLE public.feedback_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.feedback_posts(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('helpful', 'clear', 'confusing')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, session_id)
);

-- Create feedback_comments table (one per user per post)
CREATE TABLE public.feedback_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.feedback_posts(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, session_id)
);

-- Enable RLS on all tables
ALTER TABLE public.feedback_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_comments ENABLE ROW LEVEL SECURITY;

-- Policies for feedback_posts
CREATE POLICY "Anyone can read non-expired posts" ON public.feedback_posts
  FOR SELECT USING (expires_at > now());

CREATE POLICY "Anyone can create posts" ON public.feedback_posts
  FOR INSERT WITH CHECK (true);

-- Policies for feedback_reactions
CREATE POLICY "Anyone can read reactions" ON public.feedback_reactions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create reactions" ON public.feedback_reactions
  FOR INSERT WITH CHECK (true);

-- Policies for feedback_comments
CREATE POLICY "Anyone can read comments" ON public.feedback_comments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create comments" ON public.feedback_comments
  FOR INSERT WITH CHECK (true);

-- Create index for efficient querying of non-expired posts
CREATE INDEX idx_feedback_posts_expires_at ON public.feedback_posts(expires_at);
CREATE INDEX idx_feedback_posts_session_id ON public.feedback_posts(session_id);
CREATE INDEX idx_feedback_reactions_session_id ON public.feedback_reactions(session_id);
CREATE INDEX idx_feedback_comments_session_id ON public.feedback_comments(session_id);