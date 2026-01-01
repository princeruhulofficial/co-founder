import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { closeJobListing } from "@/lib/jobs";

interface CloseJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobClosed: () => void;
}

export function CloseJobModal({ isOpen, onClose, onJobClosed }: CloseJobModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobId, setJobId] = useState("");
  const [managementCode, setManagementCode] = useState("");

  const resetForm = () => {
    setJobId("");
    setManagementCode("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!jobId.trim() || !managementCode.trim()) {
      toast({
        title: "Missing fields",
        description: "Please enter both the job ID and management code.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await closeJobListing(jobId.trim(), managementCode.trim());

      if (result.success) {
        toast({
          title: "Job closed",
          description: "The listing has been removed.",
        });
        onJobClosed();
        handleClose();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to close job.",
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Close a Job Listing
          </DialogTitle>
          <DialogDescription>
            Enter the job ID and the management code you received when posting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobId">Job ID</Label>
            <Input
              id="jobId"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              placeholder="e.g. a1b2c3d4-e5f6-..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="managementCode">Management Code</Label>
            <Input
              id="managementCode"
              value={managementCode}
              onChange={(e) => setManagementCode(e.target.value)}
              placeholder="Your 12-character code"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="destructive"
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Closing...
              </>
            ) : (
              "Close Listing"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
