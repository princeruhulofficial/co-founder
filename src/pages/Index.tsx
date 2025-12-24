import { useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HorizontalScroller } from '@/components/HorizontalScroller';
import { Leaderboard } from '@/components/Leaderboard';
import { CategorySection } from '@/components/CategorySection';
import { Footer } from '@/components/Footer';
import { getProfiles } from '@/lib/data';

const Index = () => {
  const profiles = useMemo(() => getProfiles(), []);
  
  const hiringCoFounders = profiles.filter(p => p.type === 'founder').slice(0, 6);
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

        <CategorySection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
