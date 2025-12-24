import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { saveProfile, categories, Profile } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X, User, Briefcase, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profileType, setProfileType] = useState<'founder' | 'developer' | null>(null);
  const [avatar, setAvatar] = useState<string>('');
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [building, setBuilding] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [contactType, setContactType] = useState<'email' | 'twitter' | 'linkedin'>('email');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('saas');
  
  // Founder specific
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [hiringType, setHiringType] = useState('Technical Co-founder');
  const [developerNeeds, setDeveloperNeeds] = useState('');
  
  // Developer specific
  const [skills, setSkills] = useState('');
  const [preferredProjectType, setPreferredProjectType] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileType || !name || !tagline || !building || !lookingFor || !contact) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newProfile: Profile = {
      id: Date.now().toString(),
      type: profileType,
      name,
      avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      tagline,
      building,
      lookingFor,
      contactType,
      contact,
      category,
      views: 0,
      interests: 0,
      joinedAt: 'Today',
      lastActive: 'Just now',
      ...(profileType === 'founder' && {
        projectName,
        projectDescription,
        hiringType,
        developerNeeds: developerNeeds.split(',').map(s => s.trim()).filter(Boolean),
      }),
      ...(profileType === 'developer' && {
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        preferredProjectType,
      }),
    };

    saveProfile(newProfile);
    
    toast({
      title: "Profile created!",
      description: "Your profile is now live.",
    });
    
    navigate(`/profile/${newProfile.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 max-w-2xl">
        <h1 className="font-heading text-3xl text-foreground mb-2">Create your profile</h1>
        <p className="text-muted-foreground mb-8">
          Join CoFoundr and connect with founders or developers
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
                Looking for a technical co-founder or developer to join my startup
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
                Looking for an exciting startup opportunity as a co-founder or early engineer
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

            <div className="space-y-2">
              <Label htmlFor="building">What are you building/working on? *</Label>
              <Textarea
                id="building"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="Describe what you're currently working on..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lookingFor">What are you looking for? *</Label>
              <Textarea
                id="lookingFor"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                placeholder="Describe your ideal co-founder or opportunity..."
                rows={3}
                required
              />
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
                <Select value={contactType} onValueChange={(v) => setContactType(v as any)}>
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
                <Label htmlFor="contact">Contact *</Label>
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

            <Button type="submit" size="lg" className="w-full">
              Create Profile
            </Button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AddProfile;
