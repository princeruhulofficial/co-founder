import { Link } from 'react-router-dom';
import { Profile } from '@/lib/database';
import { HiringBadge } from './HiringBadge';
import { Eye, Heart, ChevronRight, ShieldCheck } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  variant?: 'default' | 'compact';
}

/** Simple heuristic: if description/tagline contains github/linkedin/http → has proof */
function hasProofOfWork(profile: Profile): boolean {
  const text = `${profile.projectDescription || ''} ${profile.preferredProjectType || ''} ${profile.tagline || ''}`.toLowerCase();
  return (
    text.includes('github.com') ||
    text.includes('linkedin.com') ||
    text.includes('http://') ||
    text.includes('https://') ||
    text.includes('github:') ||
    text.includes('linkedin:') ||
    text.includes('website:')
  );
}

export function ProfileCard({ profile, variant = 'default' }: ProfileCardProps) {
  const isFounder = profile.type === 'founder';
  const isVerified = hasProofOfWork(profile);

  if (variant === 'compact') {
    return (
      <Link
        to={`/profile/${profile.id}`}
        className="group relative flex flex-col min-w-[200px] md:min-w-[240px] p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
      >
        {isFounder && (
          <div className="absolute -top-2 -right-2">
            <HiringBadge variant="hiring" />
          </div>
        )}
        
        <div className="flex items-start gap-3 mb-3">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-12 h-12 rounded-lg object-cover bg-muted"
            />
            {isVerified && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center">
                <ShieldCheck className="h-2.5 w-2.5 text-white" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate flex items-center gap-1">
              {isFounder ? profile.projectName : profile.name}
              {isVerified && (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              )}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {profile.category.charAt(0).toUpperCase() + profile.category.slice(1)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center border-t border-border/50 pt-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Views</p>
            <p className="text-sm font-semibold text-foreground">{profile.views.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Interest</p>
            <p className="text-sm font-semibold text-foreground">{profile.interests}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Joined</p>
            <p className="text-sm font-semibold text-foreground truncate">{profile.joinedAt}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/profile/${profile.id}`}
      className="group block p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-14 h-14 rounded-xl object-cover bg-muted"
          />
          {profile.lastActive === 'Just now' || profile.lastActive === 'Active today' ? (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-badge-active rounded-full border-2 border-card" />
          ) : null}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-foreground flex items-center gap-1.5">
                {profile.name}
                {isVerified && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </h3>
              {isFounder && <HiringBadge variant="hiring" />}
              {profile.joinedAt === 'Today' && <HiringBadge variant="new" />}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>

          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{profile.tagline}</p>

          {isFounder && profile.projectName && (
            <p className="text-xs text-primary mb-2">🚀 {profile.projectName}</p>
          )}

          <div className="flex flex-wrap gap-1.5 mb-3">
            {(profile.skills || profile.developerNeeds || []).slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] rounded bg-secondary text-secondary-foreground"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {profile.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {profile.interests}
            </span>
            <span>{profile.lastActive}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
