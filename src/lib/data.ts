export type ProfileType = 'founder' | 'developer';

export interface Profile {
  id: string;
  type: ProfileType;
  name: string;
  avatar: string;
  tagline: string;
  
  // Common fields
  building: string;
  lookingFor: string;
  contactType: 'email' | 'twitter' | 'linkedin';
  contact: string;
  
  // Founder specific
  projectName?: string;
  projectDescription?: string;
  hiringType?: string;
  developerNeeds?: string[];
  
  // Developer specific
  skills?: string[];
  preferredProjectType?: string;
  
  // Metrics
  views: number;
  interests: number;
  joinedAt: string;
  lastActive: string;
  
  // Categories
  category: string;
}

export const categories = [
  { id: 'saas', name: 'SaaS', icon: '💼' },
  { id: 'ai', name: 'AI & ML', icon: '🤖' },
  { id: 'devtools', name: 'Dev Tools', icon: '🛠️' },
  { id: 'fintech', name: 'Fintech', icon: '💳' },
  { id: 'marketplace', name: 'Marketplace', icon: '🏪' },
  { id: 'mobile', name: 'Mobile Apps', icon: '📱' },
  { id: 'web3', name: 'Web3', icon: '⛓️' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
];

export const initialProfiles: Profile[] = [
  {
    id: '1',
    type: 'founder',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    tagline: 'Building the future of AI-powered analytics',
    building: 'DataPulse - Real-time analytics dashboard for startups',
    lookingFor: 'Full-stack developer with React & Python experience',
    contactType: 'twitter',
    contact: '@alexchen',
    projectName: 'DataPulse',
    projectDescription: 'AI-powered analytics platform that helps startups understand their metrics in real-time. We process millions of events daily.',
    hiringType: 'Technical Co-founder',
    developerNeeds: ['React', 'Python', 'PostgreSQL', 'AWS'],
    views: 1234,
    interests: 89,
    joinedAt: 'Today',
    lastActive: '2 hours ago',
    category: 'ai',
  },
  {
    id: '2',
    type: 'developer',
    name: 'Sarah Kim',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    tagline: 'Senior full-stack engineer, ex-Stripe',
    building: 'Open to exciting early-stage opportunities',
    lookingFor: 'Founding engineer role at AI or Fintech startup',
    contactType: 'email',
    contact: 'sarah@example.com',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Go'],
    preferredProjectType: 'Fintech, AI/ML, Developer Tools',
    views: 2341,
    interests: 156,
    joinedAt: '3 days ago',
    lastActive: 'Active today',
    category: 'fintech',
  },
  {
    id: '3',
    type: 'founder',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    tagline: 'Serial entrepreneur, 2x exit',
    building: 'ShipFast - No-code deployment platform',
    lookingFor: 'Backend engineer who loves DevOps',
    contactType: 'linkedin',
    contact: 'linkedin.com/in/marcusj',
    projectName: 'ShipFast',
    projectDescription: 'Deploy any app to production in under 60 seconds. We are simplifying cloud infrastructure for indie hackers.',
    hiringType: 'CTO / Co-founder',
    developerNeeds: ['Kubernetes', 'Docker', 'Go', 'Terraform'],
    views: 3421,
    interests: 201,
    joinedAt: '1 week ago',
    lastActive: 'Yesterday',
    category: 'devtools',
  },
  {
    id: '4',
    type: 'developer',
    name: 'Emily Zhang',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    tagline: 'Mobile developer with 8 years experience',
    building: 'Looking to join a mission-driven startup',
    lookingFor: 'Co-founder opportunity in health tech or education',
    contactType: 'twitter',
    contact: '@emilyzhang_dev',
    skills: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'Firebase'],
    preferredProjectType: 'Health Tech, EdTech, Consumer Apps',
    views: 1876,
    interests: 94,
    joinedAt: '5 days ago',
    lastActive: 'Active today',
    category: 'mobile',
  },
  {
    id: '5',
    type: 'founder',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    tagline: 'Ex-Google PM building B2B SaaS',
    building: 'Metricly - Revenue attribution for B2B',
    lookingFor: 'Full-stack engineer with analytics experience',
    contactType: 'email',
    contact: 'james@metricly.io',
    projectName: 'Metricly',
    projectDescription: 'Multi-touch revenue attribution that actually works. Connect your CRM, ads, and website to understand what drives revenue.',
    hiringType: 'Founding Engineer',
    developerNeeds: ['React', 'Python', 'BigQuery', 'dbt'],
    views: 2156,
    interests: 134,
    joinedAt: '2 days ago',
    lastActive: '1 hour ago',
    category: 'saas',
  },
  {
    id: '6',
    type: 'developer',
    name: 'David Park',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    tagline: 'AI/ML engineer, Stanford CS',
    building: 'Building AI agents in my spare time',
    lookingFor: 'AI startup with ambitious vision',
    contactType: 'twitter',
    contact: '@davidpark_ml',
    skills: ['Python', 'PyTorch', 'LangChain', 'Vector DBs', 'RAG'],
    preferredProjectType: 'AI/ML, LLM Applications, Automation',
    views: 4521,
    interests: 287,
    joinedAt: 'Today',
    lastActive: 'Just now',
    category: 'ai',
  },
  {
    id: '7',
    type: 'founder',
    name: 'Rachel Green',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    tagline: 'YC W23, building commerce infrastructure',
    building: 'CartFlow - Headless checkout for any platform',
    lookingFor: 'Senior frontend engineer',
    contactType: 'email',
    contact: 'rachel@cartflow.dev',
    projectName: 'CartFlow',
    projectDescription: 'Drop-in checkout solution that increases conversion by 40%. Works with Shopify, WooCommerce, and custom stores.',
    hiringType: 'Technical Co-founder',
    developerNeeds: ['React', 'Next.js', 'Stripe', 'Node.js'],
    views: 3890,
    interests: 245,
    joinedAt: '4 days ago',
    lastActive: 'Active today',
    category: 'ecommerce',
  },
  {
    id: '8',
    type: 'developer',
    name: 'Michael Torres',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    tagline: 'Blockchain developer, DeFi specialist',
    building: 'Contributing to open-source DeFi protocols',
    lookingFor: 'Web3 startup building real utility',
    contactType: 'twitter',
    contact: '@mtorres_web3',
    skills: ['Solidity', 'Rust', 'React', 'Ethers.js', 'Foundry'],
    preferredProjectType: 'DeFi, NFT Infrastructure, DAOs',
    views: 1654,
    interests: 78,
    joinedAt: '1 week ago',
    lastActive: '3 hours ago',
    category: 'web3',
  },
  {
    id: '9',
    type: 'founder',
    name: 'Lisa Wang',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    tagline: 'Former Airbnb, building marketplace',
    building: 'TalentHub - Freelance marketplace for AI experts',
    lookingFor: 'Backend engineer with marketplace experience',
    contactType: 'linkedin',
    contact: 'linkedin.com/in/lisawang',
    projectName: 'TalentHub',
    projectDescription: 'The Upwork for AI/ML talent. Connect with vetted AI engineers for your next project.',
    hiringType: 'Co-founder',
    developerNeeds: ['Python', 'Django', 'PostgreSQL', 'Redis'],
    views: 2987,
    interests: 167,
    joinedAt: '6 days ago',
    lastActive: 'Yesterday',
    category: 'marketplace',
  },
  {
    id: '10',
    type: 'developer',
    name: 'Kevin Brown',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    tagline: 'DevOps wizard, infrastructure at scale',
    building: 'Automating everything that can be automated',
    lookingFor: 'Early-stage startup needing infrastructure expertise',
    contactType: 'email',
    contact: 'kevin@devops.pro',
    skills: ['AWS', 'Terraform', 'Kubernetes', 'Docker', 'CI/CD', 'Go'],
    preferredProjectType: 'DevTools, Infrastructure, SaaS',
    views: 1432,
    interests: 89,
    joinedAt: '2 weeks ago',
    lastActive: 'Active today',
    category: 'devtools',
  },
];

// Storage functions
export const getProfiles = (): Profile[] => {
  const stored = localStorage.getItem('cofoundr_profiles');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('cofoundr_profiles', JSON.stringify(initialProfiles));
  return initialProfiles;
};

export const saveProfile = (profile: Profile): void => {
  const profiles = getProfiles();
  profiles.unshift(profile);
  localStorage.setItem('cofoundr_profiles', JSON.stringify(profiles));
};

export const updateProfile = (id: string, updates: Partial<Profile>): void => {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.id === id);
  if (index !== -1) {
    profiles[index] = { ...profiles[index], ...updates };
    localStorage.setItem('cofoundr_profiles', JSON.stringify(profiles));
  }
};

export const incrementViews = (id: string): void => {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.id === id);
  if (index !== -1) {
    profiles[index].views += 1;
    localStorage.setItem('cofoundr_profiles', JSON.stringify(profiles));
  }
};

export const incrementInterests = (id: string): void => {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.id === id);
  if (index !== -1) {
    profiles[index].interests += 1;
    localStorage.setItem('cofoundr_profiles', JSON.stringify(profiles));
  }
};
