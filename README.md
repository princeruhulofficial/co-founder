# Co Finder

**The co-founder matching platform for serious builders.**

Find the right technical co-founder. List your project. Attract people who actually want to build with you.

[Live Demo](https://founder-connect-nine.vercel.app) · Built by [Prince Ruhul](https://github.com/princeruhulofficial)

---

### What is Co Finder?

Most founder matching platforms are noisy, low-signal, and full of people who just want to "network".  
Co Finder is built for **people who ship**.

- Founders looking for technical co-founders
- Developers looking for ambitious projects to join as co-founder
- Early-stage teams that need the right partner, not just freelancers

---

### Core Features

| Feature | Description |
|---------|-------------|
| **Profile System** | Founders & Developers can create rich profiles |
| **Project Listing** | List what you're building and what kind of co-founder you need |
| **Jobs Board** | Post and browse co-founder / early team opportunities |
| **Feedback Wall** | Get honest product feedback from other builders |
| **Leaderboard** | See top active founders and developers |
| **Co-Founder Game** | Interactive quiz to test founder instincts |
| **Search & Filters** | Find people by skills, type, and intent |

---

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS + Framer Motion
- **Backend**: Supabase (Auth + Database + Edge Functions)
- **Deployment**: Vercel

---

### Getting Started

```bash
git clone https://github.com/princeruhulofficial/co-founder.git
cd co-founder

npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> You will need Supabase environment variables to connect to the backend.

---

### Project Structure

```
src/
├── components/     # UI components (Header, Hero, Cards, Modals...)
├── pages/          # Route pages (Index, Profiles, Jobs, Feedback...)
├── lib/            # Database helpers, analytics, data
├── integrations/   # Supabase client & types
└── hooks/          # Custom React hooks
```

---

### Vision

Co Finder is not just another directory.  
The long-term goal is to become the **highest-signal place** for ambitious founders and technical co-founders to find each other — especially from emerging markets.

Built with the same philosophy as [Prevalid](https://www.prevalid.net):  
**Infrastructure over noise. Real builders over pretenders.**

---

### Roadmap (High Level)

- [ ] Better matching / recommendation engine
- [ ] Verified profiles & reputation system
- [ ] Direct messaging between interested parties
- [ ] AI-assisted profile & project improvement
- [ ] Stronger Bangladesh / South Asia focus + global reach

---

### License

Private / All rights reserved for now.

---

<div align="center">
  <strong>Built by Prince Ruhul</strong><br>
  Founder of <a href="https://www.prevalid.net">Prevalid</a> — Making AI Accountable<br>
  From Bangladesh, building for the world.
</div>
