import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, Image as ImageIcon, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createProject, updateProject, Project } from '@/lib/database';

interface ListProjectModalProps {
  profileId: string;
  verifiedEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
  existingProject?: Project | null;
}

export function ListProjectModal({ 
  profileId, 
  verifiedEmail, 
  isOpen, 
  onClose, 
  onProjectCreated,
  existingProject 
}: ListProjectModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [logo, setLogo] = useState<string>(existingProject?.logo || '');
  const [name, setName] = useState(existingProject?.name || '');
  const [description, setDescription] = useState(existingProject?.description || '');
  const [lookingFor, setLookingFor] = useState(existingProject?.lookingFor || '');
  const [isHiring, setIsHiring] = useState(existingProject?.isHiring ?? true);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 2MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !lookingFor.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      
      if (existingProject) {
        result = await updateProject(existingProject.id, verifiedEmail, {
          logo: logo || null,
          name: name.trim(),
          description: description.trim(),
          looking_for: lookingFor.trim(),
          is_hiring: isHiring,
        });
      } else {
        result = await createProject({
          profileId,
          verifiedEmail,
          logo: logo || undefined,
          name: name.trim(),
          description: description.trim(),
          lookingFor: lookingFor.trim(),
          isHiring,
        });
      }

      if (result.success && result.project) {
        toast({
          title: existingProject ? "Project updated" : "Project listed!",
          description: existingProject 
            ? "Your project has been updated." 
            : "Your project is now live and featured.",
        });
        onProjectCreated(result.project);
        handleClose();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save project.",
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

  const handleClose = () => {
    if (!existingProject) {
      setLogo('');
      setName('');
      setDescription('');
      setLookingFor('');
      setIsHiring(true);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            {existingProject ? 'Edit Project' : 'List Your Project'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Project Logo</Label>
            <div className="flex items-center gap-4">
              {logo ? (
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Project logo" 
                    className="w-16 h-16 rounded-lg object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 2MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Startup"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">What are you building? *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project in a few sentences..."
              rows={3}
            />
          </div>

          {/* Looking For */}
          <div className="space-y-2">
            <Label htmlFor="lookingFor">What kind of co-founder/developer are you looking for? *</Label>
            <Textarea
              id="lookingFor"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              placeholder="Technical co-founder with experience in AI/ML..."
              rows={2}
            />
          </div>

          {/* Hiring Status */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
            <div>
              <Label htmlFor="isHiring" className="text-base">Actively Hiring</Label>
              <p className="text-sm text-muted-foreground">
                {isHiring ? 'Your project will be featured' : 'Turn on to get featured'}
              </p>
            </div>
            <Switch
              id="isHiring"
              checked={isHiring}
              onCheckedChange={setIsHiring}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {existingProject ? 'Updating...' : 'Publishing...'}
              </>
            ) : (
              existingProject ? 'Save Changes' : 'Publish Project'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
