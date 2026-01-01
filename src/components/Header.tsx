import { Search, Sun, Moon, Plus, MessageSquarePlus, Menu, X, Users, Briefcase } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import logo from '@/assets/logo.png';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/profiles?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/profiles', label: 'Browse', icon: Users },
    { to: '/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/feedback', label: 'Feedback', icon: MessageSquarePlus },
    { to: '/add-profile', label: 'Add Profile', icon: Plus },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Co Finder" className="h-8 w-8 object-contain" />
          <span className="font-heading text-xl text-foreground hidden sm:inline">Co Finder</span>
        </Link>

        {/* Search - visible on all screens */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-2 sm:mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
        </form>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/profiles">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Browse
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Briefcase className="h-4 w-4 mr-1" />
              Jobs
            </Button>
          </Link>
          <Link to="/feedback">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <MessageSquarePlus className="h-4 w-4 mr-1" />
              Feedback
            </Button>
          </Link>
          <Link to="/add-profile">
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

        {/* Mobile Navigation */}
        <div className="flex sm:hidden items-center gap-2">
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
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background">
              <SheetHeader className="border-b border-border pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <img src={logo} alt="Co Finder" className="h-6 w-6 object-contain" />
                  <span className="font-heading text-lg">Co Finder</span>
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-2 mt-6">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(link.to)
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              
              <div className="absolute bottom-6 left-6 right-6">
                <SheetClose asChild>
                  <Link to="/add-profile" className="block">
                    <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Profile
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
