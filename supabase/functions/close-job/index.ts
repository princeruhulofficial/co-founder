import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, managementCode } = await req.json();

    console.log("Close job request received:", { jobId, hasCode: !!managementCode });

    if (!jobId || !managementCode) {
      return new Response(
        JSON.stringify({ success: false, error: "Job ID and management code are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify management code matches
    const { data: job, error: fetchError } = await supabase
      .from("job_listings")
      .select("id, management_code, status")
      .eq("id", jobId)
      .single();

    if (fetchError || !job) {
      console.error("Job not found:", fetchError);
      return new Response(
        JSON.stringify({ success: false, error: "Job listing not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (job.management_code !== managementCode) {
      console.error("Invalid management code");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid management code" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (job.status === "closed") {
      return new Response(
        JSON.stringify({ success: true, message: "Job already closed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Close the job
    const { error: updateError } = await supabase
      .from("job_listings")
      .update({ status: "closed" })
      .eq("id", jobId);

    if (updateError) {
      console.error("Failed to close job:", updateError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to close job listing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Job closed successfully:", jobId);

    return new Response(
      JSON.stringify({ success: true, message: "Job listing closed successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
