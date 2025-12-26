import { Search, Sparkles, Sun, Moon, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useTheme } from 'next-themes';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/profiles?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-foreground" />
          <span className="font-heading text-xl text-foreground">CoFoundr</span>
        </Link>

        {/* Search - visible on all screens */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 sm:mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search founders, developers, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Add Profile Button */}
          <Link to="/add-profile" className="sm:hidden">
            <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 h-9 px-3">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
          
          <Link to="/profiles" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Browse
            </Button>
          </Link>
          <Link to="/add-profile" className="hidden sm:block">
            <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
              <Plus className="h-4 w-4 mr-1" />
              Add Profile
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-foreground"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
      
    </header>
  );
}
