import { supabase } from '@/integrations/supabase/client';

export interface FeedbackPost {
  id: string;
  session_id: string;
  title: string;
  context: string;
  question: string;
  created_at: string;
  expires_at: string;
  reactions?: FeedbackReaction[];
  comments?: FeedbackComment[];
}

export interface FeedbackReaction {
  id: string;
  post_id: string;
  session_id: string;
  reaction_type: 'helpful' | 'clear' | 'confusing';
  created_at: string;
}

export interface FeedbackComment {
  id: string;
  post_id: string;
  session_id: string;
  content: string;
  created_at: string;
}

// Fetch all active posts (non-expired)
export async function fetchFeedbackPosts(): Promise<FeedbackPost[]> {
  const { data, error } = await supabase
    .from('feedback_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching feedback posts:', error);
    return [];
  }

  return data || [];
}

// Shuffle posts for fair exposure (called periodically)
export function shufflePosts(posts: FeedbackPost[]): FeedbackPost[] {
  const shuffled = [...posts];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create a new post
export async function createFeedbackPost(
  sessionId: string,
  title: string,
  context: string,
  question: string
): Promise<{ success: boolean; error?: string }> {
  // Validate: no links allowed
  const linkRegex = /(https?:\/\/|www\.)/i;
  if (linkRegex.test(title) || linkRegex.test(context) || linkRegex.test(question)) {
    return { success: false, error: 'Links are not allowed in posts' };
  }

  // Check if user already posted today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: existingPosts } = await supabase
    .from('feedback_posts')
    .select('id')
    .eq('session_id', sessionId)
    .gte('created_at', today.toISOString());

  if (existingPosts && existingPosts.length > 0) {
    return { success: false, error: 'You can only post once per day' };
  }

  const { error } = await supabase
    .from('feedback_posts')
    .insert({
      session_id: sessionId,
      title,
      context,
      question
    });

  if (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Failed to create post' };
  }

  return { success: true };
}

// Add a reaction to a post
export async function addReaction(
  postId: string,
  sessionId: string,
  reactionType: 'helpful' | 'clear' | 'confusing'
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('feedback_reactions')
    .insert({
      post_id: postId,
      session_id: sessionId,
      reaction_type: reactionType
    });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'You already reacted to this post' };
    }
    console.error('Error adding reaction:', error);
    return { success: false, error: 'Failed to add reaction' };
  }

  return { success: true };
}

// Add a comment to a post
export async function addComment(
  postId: string,
  sessionId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  if (content.trim().length < 10) {
    return { success: false, error: 'Comment must be at least 10 characters' };
  }

  const { error } = await supabase
    .from('feedback_comments')
    .insert({
      post_id: postId,
      session_id: sessionId,
      content: content.trim()
    });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'You already commented on this post' };
    }
    console.error('Error adding comment:', error);
    return { success: false, error: 'Failed to add comment' };
  }

  return { success: true };
}

// Check if user has contributed enough to unlock posting
export async function checkContributionGate(sessionId: string): Promise<{
  canPost: boolean;
  reactionsCount: number;
  commentsCount: number;
}> {
  const [reactionsResult, commentsResult] = await Promise.all([
    supabase
      .from('feedback_reactions')
      .select('id', { count: 'exact' })
      .eq('session_id', sessionId),
    supabase
      .from('feedback_comments')
      .select('id', { count: 'exact' })
      .eq('session_id', sessionId)
  ]);

  const reactionsCount = reactionsResult.count || 0;
  const commentsCount = commentsResult.count || 0;

  // Can post if: 3+ reactions OR 1+ comments
  const canPost = reactionsCount >= 3 || commentsCount >= 1;

  return { canPost, reactionsCount, commentsCount };
}

// Fetch reactions for posts
export async function fetchReactionsForPosts(postIds: string[]): Promise<FeedbackReaction[]> {
  if (postIds.length === 0) return [];

  const { data, error } = await supabase
    .from('feedback_reactions')
    .select('*')
    .in('post_id', postIds);

  if (error) {
    console.error('Error fetching reactions:', error);
    return [];
  }

  return (data || []).map(r => ({
    ...r,
    reaction_type: r.reaction_type as 'helpful' | 'clear' | 'confusing'
  }));
}

// Fetch comments for posts
export async function fetchCommentsForPosts(postIds: string[]): Promise<FeedbackComment[]> {
  if (postIds.length === 0) return [];

  const { data, error } = await supabase
    .from('feedback_comments')
    .select('*')
    .in('post_id', postIds);

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
}

// Check if user has already posted today
export async function hasPostedToday(sessionId: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from('feedback_posts')
    .select('id')
    .eq('session_id', sessionId)
    .gte('created_at', today.toISOString());

  return (data && data.length > 0) || false;
}
