import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HiringBadge } from '@/components/HiringBadge';
import { getProfiles, incrementViews, incrementInterests, Profile } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { 
  Eye, Heart, ArrowLeft, Mail, Twitter, Linkedin, 
  ExternalLink, Sparkles, Calendar, Clock 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [showContact, setShowContact] = useState(false);
  const [hasShownInterest, setHasShownInterest] = useState(false);

  const profile = useMemo(() => {
    const profiles = getProfiles();
    return profiles.find(p => p.id === id);
  }, [id]);

  useEffect(() => {
    if (id) {
      incrementViews(id);
    }
  }, [id]);

  const handleInterest = () => {
    if (!hasShownInterest && id) {
      incrementInterests(id);
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
                  {(profile.lastActive === 'Just now' || profile.lastActive === 'Active today') && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-badge-active rounded-full border-2 border-card" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="font-heading text-2xl text-foreground">{profile.name}</h1>
                    {isFounder && <HiringBadge variant="hiring" />}
                    {profile.joinedAt === 'Today' && <HiringBadge variant="new" />}
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
                  <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                    {profile.hiringType}
                  </span>
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
            <div className="sticky top-24 p-6 rounded-xl bg-card border border-border/50">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileView;
