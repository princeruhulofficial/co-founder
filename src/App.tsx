import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { usePageTracking } from "@/hooks/usePageTracking";
import Index from "./pages/Index";
import Profiles from "./pages/Profiles";
import ProfileView from "./pages/ProfileView";
import AddProfile from "./pages/AddProfile";
import Feedback from "./pages/Feedback";
import Jobs from "./pages/Jobs";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import StaticPage from "./pages/StaticPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle page tracking inside Router
const AppRoutes = () => {
  usePageTracking();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/profiles" element={<Profiles />} />
      <Route path="/profile/:id" element={<ProfileView />} />
      <Route path="/add-profile" element={<AddProfile />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/blog" element={<StaticPage />} />
      <Route path="/contact" element={<StaticPage />} />
      <Route path="/privacy" element={<StaticPage />} />
      <Route path="/terms" element={<StaticPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
