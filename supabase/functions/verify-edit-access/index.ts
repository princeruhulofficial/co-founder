import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  profileId: string;
  backupEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { profileId, backupEmail }: VerifyRequest = await req.json();

    if (!profileId || !backupEmail) {
      return new Response(
        JSON.stringify({ error: "Profile ID and backup email are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(backupEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Verifying edit access for profile: ${profileId}`);

    // Fetch the profile with backup_email (only accessible server-side)
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("id, backup_email")
      .eq("id", profileId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching profile:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to verify access" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!profile) {
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Compare backup emails (case-insensitive)
    const isMatch = profile.backup_email.toLowerCase() === backupEmail.toLowerCase().trim();

    if (!isMatch) {
      console.log(`Backup email mismatch for profile: ${profileId}`);
      return new Response(
        JSON.stringify({ verified: false, error: "Backup email does not match" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Edit access verified for profile: ${profileId}`);

    // Generate a simple verification token (valid for 30 minutes)
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    return new Response(
      JSON.stringify({ 
        verified: true, 
        token,
        expiresAt,
        message: "Edit access granted" 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("Error in verify-edit-access:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
