import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, HelpCircle, AlertCircle, MessageSquare, Clock } from 'lucide-react';
import { FeedbackPost, FeedbackReaction, FeedbackComment, addReaction, addComment } from '@/lib/feedback';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface FeedbackPostCardProps {
  post: FeedbackPost;
  sessionId: string;
  userReactions: FeedbackReaction[];
  postComments: FeedbackComment[];
  onReactionAdded: () => void;
  onCommentAdded: () => void;
}

export function FeedbackPostCard({
  post,
  sessionId,
  userReactions,
  postComments,
  onReactionAdded,
  onCommentAdded
}: FeedbackPostCardProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const userReaction = userReactions.find(r => r.session_id === sessionId);
  const hasCommented = postComments.some(c => c.session_id === sessionId);

  const timeLeft = formatDistanceToNow(new Date(post.expires_at), { addSuffix: false });

  const handleReaction = async (type: 'helpful' | 'clear' | 'confusing') => {
    if (userReaction) return;

    setIsSubmitting(true);
    const result = await addReaction(post.id, sessionId, type);
    setIsSubmitting(false);

    if (result.success) {
      onReactionAdded();
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const handleComment = async () => {
    if (hasCommented || commentText.trim().length < 10) return;

    setIsSubmitting(true);
    const result = await addComment(post.id, sessionId, commentText);
    setIsSubmitting(false);

    if (result.success) {
      setCommentText('');
      setShowCommentForm(false);
      onCommentAdded();
      toast({
        title: 'Feedback sent',
        description: 'Your comment has been added'
      });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const isOwnPost = post.session_id === sessionId;

  return (
    <Card className="bg-card border-border/50 hover:border-border transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">
            {post.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeLeft} left</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {post.context}
        </p>
        
        <div className="bg-secondary/50 rounded-lg p-3 border border-border/30">
          <p className="text-sm font-medium text-foreground flex items-start gap-2">
            <HelpCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            {post.question}
          </p>
        </div>

        {/* Reactions */}
        {!isOwnPost && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant={userReaction?.reaction_type === 'helpful' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleReaction('helpful')}
              disabled={!!userReaction || isSubmitting}
              className="text-xs"
            >
              <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
              Helpful
            </Button>
            <Button
              variant={userReaction?.reaction_type === 'clear' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleReaction('clear')}
              disabled={!!userReaction || isSubmitting}
              className="text-xs"
            >
              <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
              Clear
            </Button>
            <Button
              variant={userReaction?.reaction_type === 'confusing' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleReaction('confusing')}
              disabled={!!userReaction || isSubmitting}
              className="text-xs"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
              Confusing
            </Button>
            
            {!hasCommented && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="text-xs ml-auto"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Give Feedback
              </Button>
            )}
          </div>
        )}

        {/* Comment Form */}
        {showCommentForm && !hasCommented && !isOwnPost && (
          <div className="space-y-3 pt-2 border-t border-border/30">
            <Textarea
              placeholder="Share thoughtful feedback (min 10 characters)..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[80px] text-sm resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommentForm(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleComment}
                disabled={commentText.trim().length < 10 || isSubmitting}
              >
                Send Feedback
              </Button>
            </div>
          </div>
        )}

        {/* Comments Display */}
        {postComments.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-border/30">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Feedback ({postComments.length})
            </p>
            {postComments.map((comment) => (
              <div key={comment.id} className="bg-secondary/30 rounded-lg p-3">
                <p className="text-sm text-foreground leading-relaxed">
                  {comment.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
