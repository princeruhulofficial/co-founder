import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HiringBadge } from '@/components/HiringBadge';
import { EditProfileModal } from '@/components/EditProfileModal';
import { ListProjectModal } from '@/components/ListProjectModal';
import { 
  Profile, 
  Project,
  fetchProfileById, 
  fetchProjectsByProfileId,
  incrementProfileViews, 
  incrementProfileInterests,
  verifyEditAccess,
  markHiringCompleted
} from '@/lib/database';
import { Button } from '@/components/ui/button';
import { 
  Eye, Heart, ArrowLeft, Mail, Twitter, Linkedin, 
  ExternalLink, Sparkles, Calendar, Clock, Edit, Plus, CheckCircle, Briefcase
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [hasShownInterest, setHasShownInterest] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Verification state
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!id) return;
      
      setIsLoading(true);
      const [profileData, projectsData] = await Promise.all([
        fetchProfileById(id),
        fetchProjectsByProfileId(id)
      ]);
      setProfile(profileData);
      setProjects(projectsData);
      setIsLoading(false);

      if (profileData) {
        incrementProfileViews(id);
      }
    }
    
    loadProfile();
  }, [id]);

  const handleInterest = async () => {
    if (!hasShownInterest && id) {
      await incrementProfileInterests(id);
      setHasShownInterest(true);
      setShowContact(true);
      toast({
        title: "Interest registered!",
        description: "Contact information is now visible.",
      });
    } else {
      setShowContact(true);
    }
  };

  const handleProfileUpdated = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  const handleVerifyOwnership = async () => {
    if (!verifyEmail.trim() || !id) return;
    
    setIsVerifying(true);
    const result = await verifyEditAccess(id, verifyEmail.trim());
    setIsVerifying(false);

    if (result.verified) {
      setIsVerified(true);
      setVerifiedEmail(verifyEmail.trim());
      toast({
        title: "Ownership verified!",
        description: "You can now edit your profile and list projects.",
      });
    } else {
      toast({
        title: "Verification failed",
        description: result.error || "The backup email does not match.",
        variant: "destructive",
      });
    }
  };

  const handleProjectCreated = (project: Project) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    } else {
      setProjects(prev => [project, ...prev]);
    }
    setEditingProject(null);
  };

  const handleMarkHiringCompleted = async (projectId: string) => {
    const result = await markHiringCompleted(projectId, verifiedEmail);
    if (result.success) {
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, isHiring: false, isFeatured: false } : p
      ));
      toast({
        title: "Hiring completed!",
        description: "Your project has been marked as completed.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update project.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <p className="text-muted-foreground text-lg">Profile not found</p>
          <Link to="/profiles" className="text-primary hover:underline mt-4 inline-block">
            Back to profiles
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isFounder = profile.type === 'founder';

  const getContactIcon = () => {
    switch (profile.contactType) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getContactLink = () => {
    switch (profile.contactType) {
      case 'email': return `mailto:${profile.contact}`;
      case 'twitter': return `https://twitter.com/${profile.contact.replace('@', '')}`;
      case 'linkedin': return profile.contact.startsWith('http') ? profile.contact : `https://${profile.contact}`;
      default: return profile.contact;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <Link
          to="/profiles"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profiles
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="p-6 rounded-xl bg-card border border-border/50">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative shrink-0">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-xl object-cover bg-muted"
                  />
                  {(profile.lastActive === 'Just now' || profile.lastActive?.includes('minutes')) && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-badge-active rounded-full border-2 border-card" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="font-heading text-2xl text-foreground">{profile.name}</h1>
                    {profile.isHiring && <HiringBadge variant="hiring" />}
                    {profile.isFeatured && <HiringBadge variant="new" />}
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{profile.tagline}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      {profile.views.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-4 w-4" />
                      {profile.interests} interested
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Joined {profile.joinedAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {profile.lastActive}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details (Founders) */}
            {isFounder && profile.projectName && (
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="font-heading text-xl text-foreground">{profile.projectName}</h2>
                </div>
                <p className="text-muted-foreground mb-4">{profile.projectDescription}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    {profile.category.charAt(0).toUpperCase() + profile.category.slice(1)}
                  </span>
                  {profile.hiringType && (
                    <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                      {profile.hiringType}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Listed Projects Section */}
            {projects.length > 0 && (
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h2 className="font-heading text-xl text-foreground">Listed Projects</h2>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {projects.map(project => (
                    <div 
                      key={project.id} 
                      className="p-4 rounded-lg bg-secondary/30 border border-border/30"
                    >
                      <div className="flex items-start gap-4">
                        {project.logo && (
                          <img 
                            src={project.logo} 
                            alt={project.name}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground">{project.name}</h3>
                            {project.isHiring ? (
                              <HiringBadge variant="hiring" />
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Looking for:</span> {project.lookingFor}
                          </p>
                          
                          {/* Owner actions */}
                          {isVerified && (
                            <div className="flex gap-2 mt-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setEditingProject(project);
                                  setIsProjectModalOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              {project.isHiring && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleMarkHiringCompleted(project.id)}
                                  className="text-muted-foreground"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Mark Completed
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What they're building */}
            <div className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="font-heading text-xl text-foreground mb-3">What they're building</h2>
              <p className="text-muted-foreground">{profile.building}</p>
            </div>

            {/* What they're looking for */}
            <div className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="font-heading text-xl text-foreground mb-3">Looking for</h2>
              <p className="text-muted-foreground">{profile.lookingFor}</p>
            </div>

            {/* Skills/Needs */}
            <div className="p-6 rounded-xl bg-card border border-border/50">
              <h2 className="font-heading text-xl text-foreground mb-4">
                {isFounder ? 'Developer needs' : 'Skills'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {(profile.skills || profile.developerNeeds || []).map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Connect Card */}
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <h3 className="font-heading text-lg text-foreground mb-4">Connect</h3>
                
                {!showContact ? (
                  <Button
                    onClick={handleInterest}
                    className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                  >
                    <Heart className={hasShownInterest ? 'fill-current' : ''} />
                    {hasShownInterest ? 'View Contact' : 'I am interested'}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <p className="text-sm text-muted-foreground mb-2">Contact via {profile.contactType}</p>
                      <a
                        href={getContactLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        {getContactIcon()}
                        {profile.contact}
                      </a>
                    </div>
                    
                    <Button
                      asChild
                      className="w-full gap-2"
                      size="lg"
                    >
                      <a href={getContactLink()} target="_blank" rel="noopener noreferrer">
                        {getContactIcon()}
                        Contact {profile.name.split(' ')[0]}
                      </a>
                    </Button>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  {showContact
                    ? 'Please be respectful when reaching out'
                    : 'Click to reveal contact info'}
                </p>

                {!isFounder && profile.preferredProjectType && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <h4 className="text-sm font-medium text-foreground mb-2">Preferred projects</h4>
                    <p className="text-sm text-muted-foreground">{profile.preferredProjectType}</p>
                  </div>
                )}
              </div>

              {/* Profile Owner Section */}
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <h3 className="font-heading text-lg text-foreground mb-2">Your profile?</h3>
                
                {!isVerified ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Verify with your backup email to make changes
                    </p>
                    <input
                      type="email"
                      value={verifyEmail}
                      onChange={(e) => setVerifyEmail(e.target.value)}
                      placeholder="your-backup@email.com"
                      className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyOwnership()}
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleVerifyOwnership}
                      disabled={isVerifying}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Ownership'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>Verified owner</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                    
                    <Button
                      className="w-full gap-2"
                      onClick={() => {
                        setEditingProject(null);
                        setIsProjectModalOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      List Your Project
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <EditProfileModal
        profile={profile}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />

      {isVerified && (
        <ListProjectModal
          profileId={profile.id}
          verifiedEmail={verifiedEmail}
          isOpen={isProjectModalOpen}
          onClose={() => {
            setIsProjectModalOpen(false);
            setEditingProject(null);
          }}
          onProjectCreated={handleProjectCreated}
          existingProject={editingProject}
        />
      )}
    </div>
  );
};

export default ProfileView;
