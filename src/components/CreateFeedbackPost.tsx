import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Send } from 'lucide-react';
import { createFeedbackPost } from '@/lib/feedback';
import { useToast } from '@/hooks/use-toast';

interface CreateFeedbackPostProps {
  sessionId: string;
  canPost: boolean;
  reactionsNeeded: number;
  onPostCreated: () => void;
}

export function CreateFeedbackPost({
  sessionId,
  canPost,
  reactionsNeeded,
  onPostCreated
}: CreateFeedbackPostProps) {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !context.trim() || !question.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    const result = await createFeedbackPost(sessionId, title, context, question);
    setIsSubmitting(false);

    if (result.success) {
      setTitle('');
      setContext('');
      setQuestion('');
      onPostCreated();
      toast({
        title: 'Post created',
        description: 'Your question is now live for 24 hours'
      });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  if (!canPost) {
    return (
      <Card className="bg-secondary/30 border-border/50">
        <CardContent className="py-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Contribute first to unlock posting</h4>
              <p className="text-sm text-muted-foreground">
                React to {reactionsNeeded} more post{reactionsNeeded !== 1 ? 's' : ''} or leave 1 meaningful comment to create your own post.
                This keeps the community helpful and spam-free.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-heading">Ask for Feedback</CardTitle>
        <CardDescription>
          Share what you're building and ask one clear question. Post expires in 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Is this landing page clear enough?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="context">Context</Label>
            <Textarea
              id="context"
              placeholder="Briefly describe what you're building or thinking about..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="question">Your Question</Label>
            <Textarea
              id="question"
              placeholder="What specific feedback are you looking for?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[60px] resize-none"
              maxLength={300}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              No links or promotional content allowed
            </p>
            <Button type="submit" disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Posting...' : 'Post Question'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
