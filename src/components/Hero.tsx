import { Search, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/profiles?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickLinks = ['New', 'Founders', 'Developers', 'AI Startups'];

  return (
    <section className="pt-12 pb-8 text-center">
      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-6 leading-tight">
        Find your technical co-founder
      </h1>

      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search founders, developers, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 h-12 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
            />
          </div>
          <Link to="/add-profile">
            <Button className="h-12 px-5 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Profile</span>
            </Button>
          </Link>
        </div>
      </form>

      <div className="flex items-center justify-center gap-2 flex-wrap text-sm">
        {quickLinks.map((link, i) => (
          <span key={link} className="flex items-center gap-2">
            <Link
              to={`/profiles?filter=${link.toLowerCase()}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </Link>
            {i < quickLinks.length - 1 && (
              <span className="text-border">·</span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
