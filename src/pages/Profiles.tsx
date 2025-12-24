import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProfileCard } from '@/components/ProfileCard';
import { getProfiles, categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Profiles = () => {
  const [searchParams] = useSearchParams();
  const profiles = useMemo(() => getProfiles(), []);
  
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'interests'>('recent');
  const [filterType, setFilterType] = useState<'all' | 'founder' | 'developer'>(
    (searchParams.get('type') as any) || 'all'
  );
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const filteredProfiles = useMemo(() => {
    let result = [...profiles];

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(p => p.type === filterType);
    }

    // Filter by category
    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
    }

    // Filter by search
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery) ||
        p.tagline.toLowerCase().includes(searchQuery) ||
        p.building.toLowerCase().includes(searchQuery) ||
        (p.skills || []).some(s => s.toLowerCase().includes(searchQuery)) ||
        (p.developerNeeds || []).some(s => s.toLowerCase().includes(searchQuery))
      );
    }

    // Sort
    if (sortBy === 'views') {
      result.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'interests') {
      result.sort((a, b) => b.interests - a.interests);
    }

    return result;
  }, [profiles, filterType, filterCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl text-foreground mb-2">
              Browse Profiles
            </h1>
            <p className="text-muted-foreground">
              {filteredProfiles.length} {filteredProfiles.length === 1 ? 'profile' : 'profiles'} found
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex rounded-lg border border-border/50 overflow-hidden">
              <Button
                variant={filterType === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilterType('all')}
                className="rounded-none"
              >
                All
              </Button>
              <Button
                variant={filterType === 'founder' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilterType('founder')}
                className="rounded-none"
              >
                Founders
              </Button>
              <Button
                variant={filterType === 'developer' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilterType('developer')}
                className="rounded-none"
              >
                Developers
              </Button>
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[140px] bg-secondary border-border/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-[130px] bg-secondary border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="interests">Most Interest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No profiles found</p>
            <p className="text-muted-foreground text-sm mt-2">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profiles;
