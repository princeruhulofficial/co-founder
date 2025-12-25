import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Lock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Profile, verifyEditAccess, updateProfileSecure } from '@/lib/database';
import { categories } from '@/lib/data';

interface EditProfileModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (profile: Profile) => void;
}

type Step = 'verify' | 'edit';

export function EditProfileModal({ profile, isOpen, onClose, onProfileUpdated }: EditProfileModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('verify');
  const [backupEmail, setBackupEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');

  // Form state
  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);
  const [contact, setContact] = useState(profile.contact);
  const [contactType, setContactType] = useState(profile.contactType);
  const [projectName, setProjectName] = useState(profile.projectName || '');
  const [projectDescription, setProjectDescription] = useState(profile.projectDescription || '');
  const [hiringType, setHiringType] = useState(profile.hiringType || 'Technical Co-founder');
  const [skillsNeeded, setSkillsNeeded] = useState((profile.developerNeeds || []).join(', '));
  const [skills, setSkills] = useState((profile.skills || []).join(', '));
  const [preferredProjectType, setPreferredProjectType] = useState(profile.preferredProjectType || '');
  const [isHiring, setIsHiring] = useState(profile.isHiring || false);

  const handleVerify = async () => {
    if (!backupEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your backup email to verify ownership.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    const result = await verifyEditAccess(profile.id, backupEmail.trim());
    setIsVerifying(false);

    if (result.verified) {
      setVerifiedEmail(backupEmail.trim());
      setStep('edit');
      toast({
        title: "Access verified",
        description: "You can now edit your profile.",
      });
    } else {
      toast({
        title: "Verification failed",
        description: result.error || "The backup email does not match our records.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!verifiedEmail) return;

    setIsUpdating(true);

    const updates: Record<string, unknown> = {
      name,
      tagline,
      contact,
      contact_type: contactType,
      is_hiring: isHiring,
    };

    if (profile.type === 'founder') {
      updates.project_name = projectName;
      updates.project_description = projectDescription;
      updates.hiring_type = hiringType;
      updates.skills_needed = skillsNeeded.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      updates.skills = skills.split(',').map(s => s.trim()).filter(Boolean);
      updates.preferred_project_type = preferredProjectType;
    }

    const result = await updateProfileSecure(profile.id, verifiedEmail, updates);
    setIsUpdating(false);

    if (result.success && result.profile) {
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
      onProfileUpdated(result.profile);
      handleClose();
    } else {
      toast({
        title: "Update failed",
        description: result.error || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setStep('verify');
    setBackupEmail('');
    setVerifiedEmail('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'verify' ? (
              <>
                <Lock className="h-5 w-5" />
                Verify ownership
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                Edit profile
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === 'verify' ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the backup email you used when creating this profile to verify ownership.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="backupEmail">Backup Email</Label>
              <Input
                id="backupEmail"
                type="email"
                value={backupEmail}
                onChange={(e) => setBackupEmail(e.target.value)}
                placeholder="your-backup@email.com"
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
            </div>

            <Button 
              onClick={handleVerify} 
              disabled={isVerifying} 
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Continue'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactType">Contact Type</Label>
                <Select value={contactType} onValueChange={(v) => setContactType(v as 'email' | 'twitter' | 'linkedin')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>

            {profile.type === 'founder' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hiringType">Hiring Type</Label>
                  <Select value={hiringType} onValueChange={setHiringType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical Co-founder">Technical Co-founder</SelectItem>
                      <SelectItem value="CTO">CTO</SelectItem>
                      <SelectItem value="Founding Engineer">Founding Engineer</SelectItem>
                      <SelectItem value="Senior Developer">Senior Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skillsNeeded">Skills Needed (comma separated)</Label>
                  <Input
                    id="skillsNeeded"
                    value={skillsNeeded}
                    onChange={(e) => setSkillsNeeded(e.target.value)}
                    placeholder="React, Node.js, PostgreSQL"
                  />
                </div>
              </>
            )}

            {profile.type === 'developer' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredProjectType">Preferred Project Types</Label>
                  <Input
                    id="preferredProjectType"
                    value={preferredProjectType}
                    onChange={(e) => setPreferredProjectType(e.target.value)}
                    placeholder="AI/ML, Fintech, DevTools"
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <Label htmlFor="isHiring" className="text-base">Hiring Co-founder</Label>
                <p className="text-sm text-muted-foreground">
                  Mark as actively hiring to get featured
                </p>
              </div>
              <Switch
                id="isHiring"
                checked={isHiring}
                onCheckedChange={setIsHiring}
              />
            </div>

            <Button 
              onClick={handleUpdate} 
              disabled={isUpdating} 
              className="w-full"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
