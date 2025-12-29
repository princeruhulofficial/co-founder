import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

        <motion.section 
          className="py-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Are You Ready to Find Your Co-Founder?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Test your founder instincts with this quick interactive game. Learn what matters most when choosing the right partner to build with.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CoFounderGame />
          </motion.div>
        </motion.section>

        <CategorySection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
