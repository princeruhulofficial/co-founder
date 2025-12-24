import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Profile } from '@/lib/data';
import { ProfileCard } from './ProfileCard';

interface HorizontalScrollerProps {
  title: string;
  profiles: Profile[];
  linkTo?: string;
}

export function HorizontalScroller({ title, profiles, linkTo = '/profiles' }: HorizontalScrollerProps) {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="font-heading text-lg text-foreground">{title}</h2>
        <Link
          to={linkTo}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative -mx-4 px-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
