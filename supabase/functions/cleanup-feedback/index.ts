import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Delete expired feedback posts (older than 24 hours)
    const { data: deletedPosts, error: postsError } = await supabase
      .from("feedback_posts")
      .delete()
      .lt("expires_at", new Date().toISOString())
      .select("id");

    if (postsError) {
      console.error("Error deleting expired posts:", postsError);
      throw postsError;
    }

    const deletedCount = deletedPosts?.length || 0;
    console.log(`Cleanup complete: deleted ${deletedCount} expired feedback posts`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        deleted_posts: deletedCount,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error: unknown) {
    console.error("Cleanup error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
