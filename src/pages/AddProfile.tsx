import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { categories } from '@/lib/data';
import { createProfile } from '@/lib/database';
import { trackAddProfileStarted, trackAddProfileCompleted } from '@/lib/analytics';
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
import { Upload, X, Briefcase, Code, Loader2, Info, Github, Linkedin, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profileType, setProfileType] = useState<'founder' | 'developer' | null>(null);
  const [avatar, setAvatar] = useState<string>('');
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [contactType, setContactType] = useState<'email' | 'twitter' | 'linkedin'>('email');
  const [contact, setContact] = useState('');
  const [backupEmail, setBackupEmail] = useState('');
  const [category, setCategory] = useState('saas');

  // Proof links (quality gate)
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  
  // Founder specific
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [hiringType, setHiringType] = useState('Technical Co-founder');
  const [developerNeeds, setDeveloperNeeds] = useState('');
  const [isHiring, setIsHiring] = useState(true);
  
  // Developer specific
  const [skills, setSkills] = useState('');
  const [preferredProjectType, setPreferredProjectType] = useState('');

  useEffect(() => {
    trackAddProfileStarted();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const hasProofLink = () => {
    return Boolean(github.trim() || linkedin.trim() || website.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileType || !name || !tagline || !contact || !backupEmail) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields including backup email.",
        variant: "destructive",
      });
      return;
    }

    // Quality gate: at least one proof link required
    if (!hasProofLink()) {
      toast({
        title: "Proof of work required",
        description: "Add at least one of: GitHub, LinkedIn, or a live project/website link. This keeps the platform high-signal.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format for backup email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(backupEmail)) {
      toast({
        title: "Invalid backup email",
        description: "Please enter a valid email address for backup email.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const newProfile = await createProfile({
      name,
      tagline,
      avatar: avatar || undefined,
      type: profileType,
      category,
      contact,
      contactType,
      backupEmail,
      // Store proof links in tagline extension or existing fields if schema allows.
      // For now we append them into projectDescription / preferredProjectType as a simple approach
      // until the database schema is extended.
      projectName: profileType === 'founder' ? projectName : undefined,
      projectDescription: profileType === 'founder' 
        ? `${projectDescription}\n\nLinks: ${[github && `GitHub: ${github}`, linkedin && `LinkedIn: ${linkedin}`, website && `Website: ${website}`].filter(Boolean).join(' | ')}`
        : undefined,
      hiringType: profileType === 'founder' ? hiringType : undefined,
      skillsNeeded: profileType === 'founder' ? developerNeeds.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      skills: profileType === 'developer' ? skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      preferredProjectType: profileType === 'developer' 
        ? `${preferredProjectType} | Links: ${[github && `GitHub: ${github}`, linkedin && `LinkedIn: ${linkedin}`, website && `Website: ${website}`].filter(Boolean).join(' | ')}`
        : undefined,
      isHiring: profileType === 'founder' ? isHiring : false,
    });

    setIsSubmitting(false);

    if (newProfile) {
      trackAddProfileCompleted(profileType);
      toast({
        title: "Profile created!",
        description: "Your profile is now live.",
      });
      navigate(`/profile/${newProfile.id}`);
    } else {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 max-w-2xl">
        <h1 className="font-heading text-3xl text-foreground mb-2">Create your profile</h1>
        <p className="text-muted-foreground mb-8">
          High-signal only. We ask for proof of work so serious builders can find each other.
        </p>

        {/* Profile Type Selection */}
        {!profileType ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setProfileType('founder')}
              className="p-6 rounded-xl bg-card border-2 border-border/50 hover:border-primary/50 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-2">I'm a Founder</h3>
              <p className="text-sm text-muted-foreground">
                Looking for a technical co-founder or early engineer who actually ships
              </p>
            </button>

            <button
              onClick={() => setProfileType('developer')}
              className="p-6 rounded-xl bg-card border-2 border-border/50 hover:border-primary/50 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl text-foreground mb-2">I'm a Developer</h3>
              <p className="text-sm text-muted-foreground">
                Looking for an ambitious project to join as co-founder or founding engineer
              </p>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <button
              type="button"
              onClick={() => setProfileType(null)}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              ← Change profile type
            </button>

            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="flex items-center gap-4">
                {avatar ? (
                  <div className="relative">
                    <img
                      src={avatar}
                      alt="Preview"
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-20 h-20 rounded-xl bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
                <div className="text-sm text-muted-foreground">
                  <p>Upload a profile photo</p>
                  <p className="text-xs">JPG, PNG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline *</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ex-Google PM building the future of AI"
                required
              />
            </div>

            {/* Proof of Work — Quality Gate */}
            <div className="space-y-3 p-4 rounded-xl bg-secondary/40 border border-border/50">
              <div className="flex items-center gap-2">
                <Label className="text-base">Proof of Work *</Label>
                <span className="text-xs text-muted-foreground">(at least one required)</span>
              </div>
              <p className="text-xs text-muted-foreground -mt-1">
                This keeps Co Finder high-signal. Profiles without any proof are not accepted.
              </p>

              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center gap-2 text-sm">
                  <Github className="h-4 w-4" /> GitHub
                </Label>
                <Input
                  id="github"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2 text-sm">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4" /> Website / Live Project
                </Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourproject.com"
                />
              </div>
            </div>

            {/* Founder specific fields */}
            {profileType === 'founder' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="MyStartup"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project in detail..."
                    rows={4}
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
                  <Label htmlFor="developerNeeds">Skills Needed (comma separated)</Label>
                  <Input
                    id="developerNeeds"
                    value={developerNeeds}
                    onChange={(e) => setDeveloperNeeds(e.target.value)}
                    placeholder="React, Node.js, PostgreSQL, AWS"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <Label htmlFor="isHiring" className="text-base">Hiring Co-founder</Label>
                    <p className="text-sm text-muted-foreground">
                      Get featured in "Recently hiring" section
                    </p>
                  </div>
                  <Switch
                    id="isHiring"
                    checked={isHiring}
                    onCheckedChange={setIsHiring}
                  />
                </div>
              </>
            )}

            {/* Developer specific fields */}
            {profileType === 'developer' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="skills">Your Skills (comma separated) *</Label>
                  <Input
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, TypeScript, Node.js, PostgreSQL"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredProjectType">Preferred Project Types</Label>
                  <Input
                    id="preferredProjectType"
                    value={preferredProjectType}
                    onChange={(e) => setPreferredProjectType(e.target.value)}
                    placeholder="AI/ML, Fintech, Developer Tools"
                  />
                </div>
              </>
            )}

            {/* Contact Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactType">Contact Type *</Label>
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
                <Label htmlFor="contact">Public Contact *</Label>
                <Input
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={
                    contactType === 'email' ? 'you@example.com' :
                    contactType === 'twitter' ? '@username' :
                    'linkedin.com/in/username'
                  }
                  required
                />
              </div>
            </div>

            {/* Backup Email */}
            <div className="space-y-2">
              <Label htmlFor="backupEmail" className="flex items-center gap-2">
                Backup Email (Private) *
                <Info className="h-4 w-4 text-muted-foreground" />
              </Label>
              <Input
                id="backupEmail"
                type="email"
                value={backupEmail}
                onChange={(e) => setBackupEmail(e.target.value)}
                placeholder="your-backup@email.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                This email is private and never shown publicly. Use it to verify and edit your profile later.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Profile'
              )}
            </Button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AddProfile;
