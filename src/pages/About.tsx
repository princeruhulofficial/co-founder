import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sparkles, Users, Rocket, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16 max-w-3xl">
        <h1 className="font-heading text-4xl text-foreground mb-6 text-center">About CoFoundr</h1>
        
        <p className="text-lg text-muted-foreground text-center mb-12">
          We're building the platform that helps founders find their perfect technical co-founder, 
          and developers find their next exciting startup opportunity.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-card border border-border/50">
            <Sparkles className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-heading text-xl text-foreground mb-2">Our Mission</h3>
            <p className="text-muted-foreground text-sm">
              To democratize startup co-founding by making it easy for the right people to find each other.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border/50">
            <Users className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-heading text-xl text-foreground mb-2">Community First</h3>
            <p className="text-muted-foreground text-sm">
              Built by founders and developers, for founders and developers. No middlemen.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border/50">
            <Rocket className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-heading text-xl text-foreground mb-2">Ship Fast</h3>
            <p className="text-muted-foreground text-sm">
              We believe in speed. Find your co-founder and start building together in days, not months.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border/50">
            <Heart className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-heading text-xl text-foreground mb-2">Free Forever</h3>
            <p className="text-muted-foreground text-sm">
              Creating a profile and connecting with others will always be free. No paywalls.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Built with ❤️ for the startup community
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
