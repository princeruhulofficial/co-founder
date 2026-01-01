import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Briefcase, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createJobListing, JobListingWithCode } from "@/lib/jobs";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: () => void;
}

export function PostJobModal({ isOpen, onClose, onJobCreated }: PostJobModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdJob, setCreatedJob] = useState<JobListingWithCode | null>(null);
  const [copied, setCopied] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactOther, setContactOther] = useState("");

  const resetForm = () => {
    setCompanyName("");
    setRoleTitle("");
    setDescription("");
    setLookingFor("");
    setContactEmail("");
    setContactOther("");
    setCreatedJob(null);
    setCopied(false);
  };

  const handleClose = () => {
    if (createdJob) {
      onJobCreated();
    }
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!companyName.trim() || !roleTitle.trim() || !description.trim() || !lookingFor.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!contactEmail.trim() && !contactOther.trim()) {
      toast({
        title: "Contact method required",
        description: "Please provide at least one way to contact you.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createJobListing({
        companyName: companyName.trim(),
        roleTitle: roleTitle.trim(),
        description: description.trim(),
        lookingFor: lookingFor.trim(),
        contactEmail: contactEmail.trim() || undefined,
        contactOther: contactOther.trim() || undefined,
      });

      if (result.success && result.job) {
        setCreatedJob(result.job);
        toast({
          title: "Job posted!",
          description: "Your opportunity is now live.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to post job.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyManagementCode = () => {
    if (createdJob) {
      navigator.clipboard.writeText(createdJob.managementCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Management code copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            {createdJob ? "Job Posted!" : "Post an Opportunity"}
          </DialogTitle>
        </DialogHeader>

        {createdJob ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                Your job is now live! Save this code to close the listing later:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded bg-background border border-border font-mono text-sm">
                  {createdJob.managementCode}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyManagementCode}
                  className="gap-1"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <h4 className="font-medium mb-1">{createdJob.roleTitle}</h4>
              <p className="text-sm text-muted-foreground">{createdJob.companyName}</p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Project / Company Name *</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your startup or project name"
              />
            </div>

            {/* Role Title */}
            <div className="space-y-2">
              <Label htmlFor="roleTitle">Role Title *</Label>
              <Input
                id="roleTitle"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Technical Co-founder, Full Stack Developer"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you building? What's the opportunity?"
                rows={3}
              />
            </div>

            {/* Looking For */}
            <div className="space-y-2">
              <Label htmlFor="lookingFor">What kind of person are you looking for? *</Label>
              <Textarea
                id="lookingFor"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                placeholder="Skills, experience, mindset..."
                rows={2}
              />
            </div>

            {/* Contact Methods */}
            <div className="space-y-3">
              <Label>Contact Method (at least one required)</Label>
              <div className="space-y-2">
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Email address"
                />
                <Input
                  value={contactOther}
                  onChange={(e) => setContactOther(e.target.value)}
                  placeholder="Or: @handle on X, Telegram, WhatsApp..."
                />
              </div>
              <p className="text-xs text-muted-foreground">
                People will contact you directly. We don't manage applications.
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Opportunity"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              100% free. No account needed.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
