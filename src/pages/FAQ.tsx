import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Is CoFoundr free to use?',
    answer: 'Yes! Creating a profile and connecting with founders or developers is completely free. We believe in removing barriers to co-founding great startups.',
  },
  {
    question: 'Do I need to create an account?',
    answer: 'No account required! Simply create your profile and start connecting. We keep things simple so you can focus on what matters - finding the right co-founder.',
  },
  {
    question: 'How does the interest system work?',
    answer: 'When you find a profile you\'re interested in, click "I am interested" to reveal their contact information. This also lets them know someone is interested, which helps with profile ranking.',
  },
  {
    question: 'Can I edit my profile after creating it?',
    answer: 'Currently, profiles cannot be edited once created. We recommend taking your time to fill in accurate information when creating your profile.',
  },
  {
    question: 'How are profiles ranked?',
    answer: 'Profiles are ranked based on a combination of views, interests received, and recent activity. The more engagement your profile gets, the higher it ranks.',
  },
  {
    question: 'Is my contact information hidden?',
    answer: 'Yes, your contact information is only revealed when someone clicks "I am interested" on your profile. This ensures you\'re only contacted by genuinely interested parties.',
  },
  {
    question: 'What makes a good profile?',
    answer: 'A great profile clearly states what you\'re building, what skills you bring, and what you\'re looking for. Adding relevant skills tags and a professional photo also helps.',
  },
  {
    question: 'Can I be both a founder and developer?',
    answer: 'Currently, you can only create one profile type. If you\'re both, choose the role that best represents what you\'re primarily looking for right now.',
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16 max-w-2xl">
        <h1 className="font-heading text-4xl text-foreground mb-6 text-center">Frequently Asked Questions</h1>
        
        <p className="text-lg text-muted-foreground text-center mb-12">
          Everything you need to know about CoFoundr
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-xl border border-border/50 bg-card px-6"
            >
              <AccordionTrigger className="text-foreground hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
