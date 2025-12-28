import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Users, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import mentorImage from '@/assets/mentor-character.png';

interface Question {
  id: number;
  headline: string;
  scenario: string;
  optionA: {
    title: string;
    traits: string[];
  };
  optionB: {
    title: string;
    traits: string[];
  };
  correctOption: 'A' | 'B';
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    headline: "Your MVP needs to launch in 2 weeks",
    scenario: "You're a non-technical founder with a validated idea. You need someone to build the first version.",
    optionA: {
      title: "Hire a freelancer",
      traits: ["Quick turnaround", "Pay per project", "No equity given", "Limited ownership"]
    },
    optionB: {
      title: "Find a technical co-founder",
      traits: ["Shared vision", "Equity partner", "Long-term commitment", "Product ownership"]
    },
    correctOption: 'B',
    explanation: "For long-term success, a technical co-founder brings more than code—they bring strategic thinking, product ownership, and shared risk. Freelancers are great for tasks, but co-founders build companies."
  },
  {
    id: 2,
    headline: "A talented developer wants 40% equity",
    scenario: "You've found an amazing developer who loves your vision, but they're asking for significant equity to join full-time.",
    optionA: {
      title: "Negotiate down to 10%",
      traits: ["Keep more equity", "Standard employee range", "May feel undervalued", "Could leave later"]
    },
    optionB: {
      title: "Offer 25% with 4-year vesting",
      traits: ["True partnership", "Aligned incentives", "Protected by vesting", "Motivated long-term"]
    },
    correctOption: 'B',
    explanation: "A motivated co-founder with meaningful equity will outperform a resentful one with less. Vesting protects you while showing you value their contribution. 100% of nothing is still nothing."
  },
  {
    id: 3,
    headline: "Your co-founder candidate has a full-time job",
    scenario: "They're excited about your idea but can only work evenings and weekends for now.",
    optionA: {
      title: "Wait for someone full-time",
      traits: ["Immediate availability", "Full focus", "Faster progress", "Higher commitment signal"]
    },
    optionB: {
      title: "Start building together part-time",
      traits: ["Test compatibility first", "Lower risk for both", "Build trust gradually", "Prove concept together"]
    },
    correctOption: 'B',
    explanation: "Many successful startups began as side projects. Working together part-time lets you test the partnership before anyone quits their job. Compatibility matters more than availability at the start."
  },
  {
    id: 4,
    headline: "You disagree on the product direction",
    scenario: "Your technical co-founder wants to rebuild the backend 'properly' while you want to add features users are requesting.",
    optionA: {
      title: "Override their decision—you're the CEO",
      traits: ["Quick resolution", "Your vision wins", "May cause resentment", "Sets bad precedent"]
    },
    optionB: {
      title: "Schedule a proper discussion to understand both sides",
      traits: ["Builds trust", "Better decisions together", "Takes more time", "Creates healthy culture"]
    },
    correctOption: 'B',
    explanation: "Co-founder relationships are like marriages—you need healthy conflict resolution. Understanding the 'why' behind technical decisions often reveals valid concerns. The best decisions come from real dialogue."
  },
  {
    id: 5,
    headline: "A friend wants to be your co-founder",
    scenario: "Your close friend is excited to join, but they don't have startup experience and their skills overlap with yours.",
    optionA: {
      title: "Bring them on—trust matters most",
      traits: ["Strong trust foundation", "Fun to work with", "No skill gaps filled", "Friendship at risk"]
    },
    optionB: {
      title: "Be honest and find complementary skills",
      traits: ["Fills actual gaps", "Professional approach", "Harder conversation now", "Stronger team later"]
    },
    correctOption: 'B',
    explanation: "The best co-founder teams have complementary skills. Friendship is valuable, but startups need diverse capabilities. Have the honest conversation now—a true friend will understand."
  },
  {
    id: 6,
    headline: "Your co-founder wants to pivot completely",
    scenario: "After 3 months, they believe the market feedback suggests a totally different product direction.",
    optionA: {
      title: "Stick to the original plan",
      traits: ["Consistency", "Avoid wasted work", "May miss opportunity", "Shows conviction"]
    },
    optionB: {
      title: "Evaluate the data together objectively",
      traits: ["Data-driven decision", "Shows adaptability", "Values their input", "May require changes"]
    },
    correctOption: 'B',
    explanation: "Great co-founders challenge each other with data, not egos. If market feedback suggests a pivot, the ability to objectively evaluate and adapt is what separates successful founders from stubborn ones."
  }
];

const introMessage = "Choosing the right co-founder is one of the most important decisions you'll make. Let me walk you through some real dilemmas founders face...";

export function CoFounderGame() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'complete'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);

  const handleStart = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setSelectedOption(null);
  };

  const handleSelect = (option: 'A' | 'B') => {
    setSelectedOption(option);
    setGameState('feedback');
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setGameState('playing');
    } else {
      setGameState('complete');
    }
  };

  const handleRestart = () => {
    setGameState('intro');
    setCurrentQuestion(0);
    setSelectedOption(null);
  };

  const question = questions[currentQuestion];

  return (
    <section className="py-16 bg-[hsl(240,10%,8%)] rounded-2xl my-12">
      <div className="container max-w-4xl">
        {/* Header */}
        {gameState !== 'intro' && (
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={handleRestart}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Restart</span>
            </button>
            
            {gameState !== 'complete' && (
              <div className="flex-1 max-w-xs mx-4">
                <div className="bg-[hsl(240,10%,15%)] rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {currentQuestion + 1} / {questions.length}
                </p>
              </div>
            )}
            
            <div className="w-20" />
          </div>
        )}

        {/* Intro Screen */}
        {gameState === 'intro' && (
          <div className="text-center">
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-8">
              The Co-Founder Dilemma
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <img 
                src={mentorImage} 
                alt="Mentor" 
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full bg-[hsl(240,10%,15%)]"
              />
              
              <div className="relative bg-[hsl(240,10%,18%)] rounded-2xl p-6 max-w-md">
                <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 hidden md:block">
                  <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-[hsl(240,10%,18%)]" />
                </div>
                <p className="text-muted-foreground text-left">
                  {introMessage}
                </p>
              </div>
            </div>

            <Button 
              onClick={handleStart}
              size="lg"
              className="bg-white text-[hsl(240,10%,8%)] hover:bg-gray-100 font-semibold px-12 py-6 text-lg rounded-xl"
            >
              Start Game
            </Button>
          </div>
        )}

        {/* Question Screen */}
        {(gameState === 'playing' || gameState === 'feedback') && question && (
          <div>
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
              <img 
                src={mentorImage} 
                alt="Mentor" 
                className="w-20 h-20 object-cover rounded-full bg-[hsl(240,10%,15%)] shrink-0"
              />
              
              <div className="relative bg-[hsl(240,10%,18%)] rounded-2xl p-6 flex-1">
                <div className="absolute left-0 top-6 -translate-x-2 hidden md:block">
                  <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-[hsl(240,10%,18%)]" />
                </div>
                <h3 className="text-xl md:text-2xl font-heading text-white mb-2">
                  {question.headline}
                </h3>
                <p className="text-muted-foreground">
                  {question.scenario}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Option A */}
              <button
                onClick={() => gameState === 'playing' && handleSelect('A')}
                disabled={gameState === 'feedback'}
                className={`p-6 rounded-xl text-left transition-all ${
                  gameState === 'feedback' && selectedOption === 'A'
                    ? question.correctOption === 'A'
                      ? 'bg-green-900/30 border-2 border-green-500'
                      : 'bg-red-900/30 border-2 border-red-500'
                    : gameState === 'feedback' && question.correctOption === 'A'
                      ? 'bg-green-900/20 border-2 border-green-500/50'
                      : 'bg-[hsl(240,10%,15%)] hover:bg-[hsl(240,10%,20%)] border-2 border-transparent'
                }`}
              >
                <h4 className="text-lg font-semibold text-white mb-3">
                  {question.optionA.title}
                </h4>
                <ul className="space-y-2">
                  {question.optionA.traits.map((trait, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      {trait}
                    </li>
                  ))}
                </ul>
              </button>

              {/* Option B */}
              <button
                onClick={() => gameState === 'playing' && handleSelect('B')}
                disabled={gameState === 'feedback'}
                className={`p-6 rounded-xl text-left transition-all ${
                  gameState === 'feedback' && selectedOption === 'B'
                    ? question.correctOption === 'B'
                      ? 'bg-green-900/30 border-2 border-green-500'
                      : 'bg-red-900/30 border-2 border-red-500'
                    : gameState === 'feedback' && question.correctOption === 'B'
                      ? 'bg-green-900/20 border-2 border-green-500/50'
                      : 'bg-[hsl(240,10%,15%)] hover:bg-[hsl(240,10%,20%)] border-2 border-transparent'
                }`}
              >
                <h4 className="text-lg font-semibold text-white mb-3">
                  {question.optionB.title}
                </h4>
                <ul className="space-y-2">
                  {question.optionB.traits.map((trait, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                      {trait}
                    </li>
                  ))}
                </ul>
              </button>
            </div>

            {/* Feedback */}
            {gameState === 'feedback' && (
              <div className="bg-[hsl(240,10%,12%)] rounded-xl p-6 mb-6">
                <p className="text-muted-foreground mb-4">
                  {question.explanation}
                </p>
                <Button 
                  onClick={handleNext}
                  className="bg-white text-[hsl(240,10%,8%)] hover:bg-gray-100 font-semibold"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Complete Screen */}
        {gameState === 'complete' && (
          <div className="text-center">
            <div className="flex flex-col items-center gap-6 mb-8">
              <img 
                src={mentorImage} 
                alt="Mentor" 
                className="w-32 h-32 object-cover rounded-full bg-[hsl(240,10%,15%)]"
              />
              
              <div className="bg-[hsl(240,10%,18%)] rounded-2xl p-6 max-w-lg">
                <h3 className="text-2xl font-heading text-white mb-3">
                  You've got the mindset!
                </h3>
                <p className="text-muted-foreground">
                  Finding the right co-founder isn't about finding someone perfect—it's about finding someone who complements you, shares your vision, and is ready to build something meaningful together.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                asChild
                size="lg"
                className="bg-white text-[hsl(240,10%,8%)] hover:bg-gray-100 font-semibold px-8"
              >
                <Link to="/profiles?type=developer">
                  <Users className="w-5 h-5 mr-2" />
                  Find a Co-founder
                </Link>
              </Button>
              
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 font-semibold px-8"
              >
                <Link to="/add-profile">
                  <Briefcase className="w-5 h-5 mr-2" />
                  List Your Project
                </Link>
              </Button>
            </div>

            <button 
              onClick={handleRestart}
              className="mt-6 text-muted-foreground hover:text-white text-sm transition-colors"
            >
              Play again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
