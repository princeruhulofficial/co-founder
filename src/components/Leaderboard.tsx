import { Link } from 'react-router-dom';
import { Profile } from '@/lib/data';
import { HiringBadge } from './HiringBadge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface LeaderboardProps {
  profiles: Profile[];
}

export function Leaderboard({ profiles }: LeaderboardProps) {
  const [sortBy, setSortBy] = useState<'views' | 'interests'>('interests');
  const [filterTime, setFilterTime] = useState<'all' | 'week' | 'month'>('all');

  const sortedProfiles = [...profiles].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    return b.interests - a.interests;
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  };

  const getGrowthIndicator = (index: number) => {
    const rand = Math.random();
    if (rand > 0.6) {
      const value = Math.floor(Math.random() * 20) + 1;
      return { type: 'up', value };
    } else if (rand > 0.3) {
      const value = Math.floor(Math.random() * 10) + 1;
      return { type: 'down', value };
    }
    return { type: 'neutral', value: 0 };
  };

  return (
    <section className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-heading text-2xl text-foreground">Leaderboard</h2>
        
        <div className="flex gap-3">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'views' | 'interests')}>
            <SelectTrigger className="w-[130px] bg-secondary border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interests">Interest</SelectItem>
              <SelectItem value="views">Views</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterTime} onValueChange={(v) => setFilterTime(v as 'all' | 'week' | 'month')}>
            <SelectTrigger className="w-[120px] bg-secondary border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-secondary/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Profile</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2 text-right">{sortBy === 'views' ? 'Views' : 'Interest'}</div>
          <div className="col-span-2 text-right">Growth</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/30">
          {sortedProfiles.slice(0, 15).map((profile, index) => {
            const growth = getGrowthIndicator(index);
            const isFounder = profile.type === 'founder';

            return (
              <Link
                key={profile.id}
                to={`/profile/${profile.id}`}
                className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-secondary/30 transition-colors items-center group"
              >
                <div className="col-span-1 flex items-center gap-2">
                  {getRankIcon(index) || (
                    <span className="text-muted-foreground text-sm">{index + 1}</span>
                  )}
                </div>

                <div className="col-span-11 md:col-span-4 flex items-center gap-3">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-10 h-10 rounded-lg object-cover bg-muted shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">
                        {isFounder ? profile.projectName || profile.name : profile.name}
                      </span>
                      {isFounder && <HiringBadge variant="hiring" className="hidden sm:inline-flex" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {profile.tagline}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex col-span-3 items-center gap-2">
                  <img
                    src={profile.avatar}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm text-muted-foreground truncate">
                    {profile.name}
                  </span>
                </div>

                <div className="hidden md:block col-span-2 text-right">
                  <span className="text-sm font-medium text-foreground">
                    {sortBy === 'views'
                      ? profile.views.toLocaleString()
                      : profile.interests.toLocaleString()}
                  </span>
                </div>

                <div className="hidden md:flex col-span-2 items-center justify-end gap-1">
                  {growth.type === 'up' && (
                    <>
                      <TrendingUp className="h-4 w-4 text-badge-active" />
                      <span className="text-sm text-badge-active">{growth.value}%</span>
                    </>
                  )}
                  {growth.type === 'down' && (
                    <>
                      <TrendingDown className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-destructive">{growth.value}%</span>
                    </>
                  )}
                  {growth.type === 'neutral' && (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
