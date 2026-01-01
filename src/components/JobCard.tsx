import { Briefcase, Mail, MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { JobListing, getRelativeTime } from "@/lib/jobs";
import { useToast } from "@/hooks/use-toast";

interface JobCardProps {
  job: JobListing;
}

export function JobCard({ job }: JobCardProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState(false);

  const copyJobId = () => {
    navigator.clipboard.writeText(job.id);
    setCopiedId(true);
    toast({
      title: "Job ID copied",
      description: "Use this with your management code to close the listing.",
    });
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleEmailContact = () => {
    if (job.contactEmail) {
      window.open(`mailto:${job.contactEmail}?subject=Re: ${encodeURIComponent(job.roleTitle)} at ${encodeURIComponent(job.companyName)}`);
    }
  };

  return (
    <div className="group p-5 rounded-xl border border-border bg-card hover:bg-card/80 transition-all hover:shadow-lg hover:border-primary/20">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {job.roleTitle}
            </h3>
            <p className="text-sm text-muted-foreground">{job.companyName}</p>
          </div>
        </div>
        <button
          onClick={copyJobId}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-secondary"
          title="Copy Job ID"
        >
          {copiedId ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      <p className="text-sm text-foreground/80 mb-3 line-clamp-2">
        {job.description}
      </p>

      <div className="mb-4 p-3 rounded-lg bg-secondary/50">
        <p className="text-xs text-muted-foreground mb-1">Looking for:</p>
        <p className="text-sm text-foreground line-clamp-2">{job.lookingFor}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {getRelativeTime(job.createdAt)}
        </span>

        <div className="flex items-center gap-2">
          {job.contactEmail && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleEmailContact}
              className="gap-1.5"
            >
              <Mail className="h-3.5 w-3.5" />
              Email
            </Button>
          )}
          {job.contactOther && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-sm">
              <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground">{job.contactOther}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
