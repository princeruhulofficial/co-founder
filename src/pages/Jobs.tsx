import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/JobCard";
import { PostJobModal } from "@/components/PostJobModal";
import { CloseJobModal } from "@/components/CloseJobModal";
import { fetchJobListings, JobListing } from "@/lib/jobs";
import { Plus, XCircle, Briefcase, Loader2 } from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    const data = await fetchJobListings();
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Briefcase className="h-4 w-4" />
            Open Roles & Opportunities
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Browse open roles from founders and projects. No middleman — contact directly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => setPostModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Post an Opportunity
            </Button>
            <Button
              variant="outline"
              onClick={() => setCloseModalOpen(true)}
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              Close a Listing
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            100% free • No account needed • Direct contact only
          </p>
        </motion.div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : jobs.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 rounded-full bg-secondary/50 inline-block mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No opportunities yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Be the first to post an opportunity!
            </p>
            <Button onClick={() => setPostModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Post an Opportunity
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Footer />

      <PostJobModal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        onJobCreated={loadJobs}
      />

      <CloseJobModal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        onJobClosed={loadJobs}
      />
    </div>
  );
};

export default Jobs;
