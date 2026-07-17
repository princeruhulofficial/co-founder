import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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

  const quickLinks = ['Founders', 'Developers', 'AI Startups', 'New'];

  return (
    <section className="pt-12 pb-8 text-center">
      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-3 leading-tight">
        The highest-signal place to find your co-founder
      </h1>
      <p className="text-muted-foreground/70 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
        Built for serious founders and technical co-founders who actually want to ship — not just network.
      </p>

      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search founders, developers, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 h-12 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
          />
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
