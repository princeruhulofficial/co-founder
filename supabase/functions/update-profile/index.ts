import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdateProfileRequest {
  profileId: string;
  backupEmail: string;
  updates: {
    name?: string;
    tagline?: string;
    avatar?: string;
    contact?: string;
    contact_type?: string;
    project_name?: string;
    project_description?: string;
    hiring_type?: string;
    skills_needed?: string[];
    skills?: string[];
    preferred_project_type?: string;
    is_hiring?: boolean;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { profileId, backupEmail, updates }: UpdateProfileRequest = await req.json();

    if (!profileId || !backupEmail) {
      return new Response(
        JSON.stringify({ error: "Profile ID and backup email are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Attempting to update profile: ${profileId}`);

    // First verify the backup email matches
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("id, backup_email")
      .eq("id", profileId)
      .maybeSingle();

    if (fetchError || !profile) {
      console.error("Profile not found:", fetchError);
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify backup email
    if (profile.backup_email.toLowerCase() !== backupEmail.toLowerCase().trim()) {
      console.log(`Unauthorized update attempt for profile: ${profileId}`);
      return new Response(
        JSON.stringify({ error: "Unauthorized - backup email does not match" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize updates - remove any fields that shouldn't be updated
    const allowedFields = [
      'name', 'tagline', 'avatar', 'contact', 'contact_type',
      'project_name', 'project_description', 'hiring_type', 'skills_needed',
      'skills', 'preferred_project_type', 'is_hiring'
    ];

    const sanitizedUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        sanitizedUpdates[key] = value;
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid updates provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Note: is_featured will be auto-set by the database trigger if is_hiring is true

    console.log(`Updating profile ${profileId} with:`, Object.keys(sanitizedUpdates));

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update(sanitizedUpdates)
      .eq("id", profileId)
      .select("id, name, tagline, avatar, type, category, contact, contact_type, project_name, project_description, hiring_type, skills_needed, skills, preferred_project_type, is_hiring, is_featured, views, interests, created_at, updated_at")
      .single();

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update profile" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Profile ${profileId} updated successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        profile: updatedProfile,
        message: "Profile updated successfully" 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("Error in update-profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
