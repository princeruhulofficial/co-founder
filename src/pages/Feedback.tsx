import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FeedbackPostCard } from '@/components/FeedbackPostCard';
import { CreateFeedbackPost } from '@/components/CreateFeedbackPost';
import { useSessionId } from '@/hooks/useSessionId';
import {
  FeedbackPost,
  FeedbackReaction,
  FeedbackComment,
  fetchFeedbackPosts,
  fetchReactionsForPosts,
  fetchCommentsForPosts,
  checkContributionGate,
  shufflePosts,
  hasPostedToday
} from '@/lib/feedback';
import { MessageSquarePlus, RefreshCw } from 'lucide-react';

const RESHUFFLE_INTERVAL = 15 * 60 * 1000; // 15 minutes

const Feedback = () => {
  const sessionId = useSessionId();
  const [posts, setPosts] = useState<FeedbackPost[]>([]);
  const [reactions, setReactions] = useState<FeedbackReaction[]>([]);
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [canPost, setCanPost] = useState(false);
  const [reactionsCount, setReactionsCount] = useState(0);
  const [alreadyPostedToday, setAlreadyPostedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastShuffle, setLastShuffle] = useState<Date>(new Date());

  const loadData = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);

    const [postsData, gateStatus, postedToday] = await Promise.all([
      fetchFeedbackPosts(),
      checkContributionGate(sessionId),
      hasPostedToday(sessionId)
    ]);

    // Shuffle posts for fair exposure
    const shuffledPosts = shufflePosts(postsData);
    setPosts(shuffledPosts);

    // Fetch reactions and comments for all posts
    const postIds = postsData.map(p => p.id);
    const [reactionsData, commentsData] = await Promise.all([
      fetchReactionsForPosts(postIds),
      fetchCommentsForPosts(postIds)
    ]);

    setReactions(reactionsData);
    setComments(commentsData);
    setCanPost(gateStatus.canPost);
    setReactionsCount(gateStatus.reactionsCount);
    setAlreadyPostedToday(postedToday);
    setIsLoading(false);
    setLastShuffle(new Date());
  }, [sessionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Periodic reshuffle for fair exposure
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts(prev => shufflePosts(prev));
      setLastShuffle(new Date());
    }, RESHUFFLE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const handleReactionAdded = () => {
    loadData();
  };

  const handleCommentAdded = () => {
    loadData();
  };

  const handlePostCreated = () => {
    loadData();
  };

  const reactionsNeeded = Math.max(0, 3 - reactionsCount);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 md:py-12">
        {/* Page Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquarePlus className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Ask for Feedback
            </h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            A calm space for builders to share what they're working on and get honest feedback.
            No promotion, no likes, no algorithms — just helpful conversations that expire in 24 hours.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Create Post Section */}
          {!alreadyPostedToday && (
            <CreateFeedbackPost
              sessionId={sessionId}
              canPost={canPost}
              reactionsNeeded={reactionsNeeded}
              onPostCreated={handlePostCreated}
            />
          )}

          {alreadyPostedToday && (
            <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                You've already posted today. Come back tomorrow to ask another question.
              </p>
            </div>
          )}

          {/* Fair Exposure Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
            <RefreshCw className="h-3 w-3" />
            <span>
              Posts shuffle every 15 min for fair exposure • Last: {lastShuffle.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Posts List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border/50 p-6 animate-pulse">
                  <div className="h-5 bg-secondary rounded w-2/3 mb-4" />
                  <div className="h-4 bg-secondary rounded w-full mb-2" />
                  <div className="h-4 bg-secondary rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquarePlus className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
              <p className="text-sm text-muted-foreground">
                Be the first to ask for feedback today.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <FeedbackPostCard
                  key={post.id}
                  post={post}
                  sessionId={sessionId}
                  userReactions={reactions.filter(r => r.post_id === post.id)}
                  postComments={comments.filter(c => c.post_id === post.id)}
                  onReactionAdded={handleReactionAdded}
                  onCommentAdded={handleCommentAdded}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
