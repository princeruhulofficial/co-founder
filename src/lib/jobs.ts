import { supabase } from "@/integrations/supabase/client";

export interface JobListing {
  id: string;
  companyName: string;
  roleTitle: string;
  description: string;
  lookingFor: string;
  contactEmail: string | null;
  contactOther: string | null;
  createdAt: string;
}

export interface JobListingWithCode extends JobListing {
  managementCode: string;
}

interface DbJobListing {
  id: string;
  company_name: string;
  role_title: string;
  description: string;
  looking_for: string;
  contact_email: string | null;
  contact_other: string | null;
  management_code: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function dbJobToJob(dbJob: DbJobListing): JobListing {
  return {
    id: dbJob.id,
    companyName: dbJob.company_name,
    roleTitle: dbJob.role_title,
    description: dbJob.description,
    lookingFor: dbJob.looking_for,
    contactEmail: dbJob.contact_email,
    contactOther: dbJob.contact_other,
    createdAt: dbJob.created_at,
  };
}

export async function fetchJobListings(): Promise<JobListing[]> {
  const { data, error } = await supabase
    .from("job_listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching job listings:", error);
    return [];
  }

  return (data as DbJobListing[]).map(dbJobToJob);
}

export async function createJobListing(job: {
  companyName: string;
  roleTitle: string;
  description: string;
  lookingFor: string;
  contactEmail?: string;
  contactOther?: string;
}): Promise<{ success: boolean; job?: JobListingWithCode; error?: string }> {
  // Validate at least one contact method
  if (!job.contactEmail && !job.contactOther) {
    return { success: false, error: "Please provide at least one contact method" };
  }

  const { data, error } = await supabase
    .from("job_listings")
    .insert({
      company_name: job.companyName,
      role_title: job.roleTitle,
      description: job.description,
      looking_for: job.lookingFor,
      contact_email: job.contactEmail || null,
      contact_other: job.contactOther || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating job listing:", error);
    return { success: false, error: "Failed to create job listing" };
  }

  const dbJob = data as DbJobListing;
  return {
    success: true,
    job: {
      ...dbJobToJob(dbJob),
      managementCode: dbJob.management_code,
    },
  };
}

export async function closeJobListing(
  jobId: string,
  managementCode: string
): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase.functions.invoke("close-job", {
    body: { jobId, managementCode },
  });

  if (error) {
    console.error("Error closing job:", error);
    return { success: false, error: "Failed to close job listing" };
  }

  return data;
}

export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
}
