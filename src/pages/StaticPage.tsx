import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const pageContent: Record<string, { title: string; content: string }> = {
  blog: {
    title: 'Blog',
    content: 'Our blog is coming soon. We\'ll be sharing insights on co-founding, startup building, and developer hiring.',
  },
  contact: {
    title: 'Contact Us',
    content: 'Have questions or feedback? Reach out to us at hello@cofoundr.dev or connect with us on Twitter @cofoundr.',
  },
  privacy: {
    title: 'Privacy Policy',
    content: 'Your privacy is important to us. We collect minimal data needed to provide our service. Profile information you share is displayed publicly. Contact information is only revealed when someone expresses interest. We do not sell your data to third parties.',
  },
  terms: {
    title: 'Terms of Service',
    content: 'By using CoFoundr, you agree to use the platform respectfully and provide accurate information. You are responsible for any content you post. We reserve the right to remove profiles that violate our community guidelines.',
  },
};

const StaticPage = () => {
  const { page } = useParams<{ page: string }>();
  const content = pageContent[page || ''] || { title: 'Page Not Found', content: 'This page does not exist.' };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16 max-w-2xl">
        <h1 className="font-heading text-4xl text-foreground mb-6">{content.title}</h1>
        <p className="text-muted-foreground whitespace-pre-line">{content.content}</p>
      </main>

      <Footer />
    </div>
  );
};

export default StaticPage;
