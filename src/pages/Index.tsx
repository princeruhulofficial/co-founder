import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HorizontalScroller } from '@/components/HorizontalScroller';
import { Leaderboard } from '@/components/Leaderboard';
import { CategorySection } from '@/components/CategorySection';
import { CoFounderGame } from '@/components/CoFounderGame';
import { Footer } from '@/components/Footer';
import { fetchProfiles, fetchFeaturedProfiles, Profile } from '@/lib/database';

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [featuredProfiles, setFeaturedProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    async function loadData() {
      const [allProfiles, featured] = await Promise.all([
        fetchProfiles(),
        fetchFeaturedProfiles()
      ]);
      setProfiles(allProfiles);
      setFeaturedProfiles(featured);
    }
    loadData();
  }, []);
  
  const hiringCoFounders = featuredProfiles.length > 0 
    ? featuredProfiles.filter(p => p.type === 'founder').slice(0, 6)
    : profiles.filter(p => p.type === 'founder').slice(0, 6);
  const topDevelopers = profiles.filter(p => p.type === 'developer').slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container">
        <Hero />
        
        <HorizontalScroller
          title="Recently hiring co-founders"
          profiles={hiringCoFounders}
          linkTo="/profiles?type=founder"
        />

        <HorizontalScroller
          title="Top developers this week"
          profiles={topDevelopers}
          linkTo="/profiles?type=developer"
        />

        <Leaderboard profiles={profiles} />

        <CoFounderGame />

        <CategorySection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
