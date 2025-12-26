import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateProjectRequest {
  action: 'create';
  profileId: string;
  backupEmail: string;
  project: {
    logo?: string;
    name: string;
    description: string;
    lookingFor: string;
    isHiring: boolean;
  };
}

interface UpdateProjectRequest {
  action: 'update';
  projectId: string;
  backupEmail: string;
  updates: Record<string, unknown>;
}

interface DeleteProjectRequest {
  action: 'delete';
  projectId: string;
  backupEmail: string;
}

type ProjectRequest = CreateProjectRequest | UpdateProjectRequest | DeleteProjectRequest;

async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: ProjectRequest = await req.json();
    console.log('Project request:', body.action);

    if (body.action === 'create') {
      const { profileId, backupEmail, project } = body;

      // Verify profile ownership
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, backup_email')
        .eq('id', profileId)
        .single();

      if (profileError || !profile) {
        console.error('Profile not found:', profileError);
        return new Response(
          JSON.stringify({ success: false, error: 'Profile not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      // Verify backup email
      if (profile.backup_email.toLowerCase().trim() !== backupEmail.toLowerCase().trim()) {
        console.log('Email verification failed');
        return new Response(
          JSON.stringify({ success: false, error: 'Email verification failed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        );
      }

      // Create project
      const { data: newProject, error: createError } = await supabase
        .from('projects')
        .insert({
          profile_id: profileId,
          logo: project.logo || null,
          name: project.name,
          description: project.description,
          looking_for: project.lookingFor,
          is_hiring: project.isHiring,
        })
        .select()
        .single();

      if (createError) {
        console.error('Create project error:', createError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create project' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      console.log('Project created successfully:', newProject.id);
      return new Response(
        JSON.stringify({ success: true, project: newProject }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (body.action === 'update') {
      const { projectId, backupEmail, updates } = body;

      // Get project and verify ownership
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, profile_id')
        .eq('id', projectId)
        .single();

      if (projectError || !project) {
        console.error('Project not found:', projectError);
        return new Response(
          JSON.stringify({ success: false, error: 'Project not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      // Verify profile ownership
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('backup_email')
        .eq('id', project.profile_id)
        .single();

      if (profileError || !profile) {
        console.error('Profile not found:', profileError);
        return new Response(
          JSON.stringify({ success: false, error: 'Profile not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      if (profile.backup_email.toLowerCase().trim() !== backupEmail.toLowerCase().trim()) {
        console.log('Email verification failed');
        return new Response(
          JSON.stringify({ success: false, error: 'Email verification failed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        );
      }

      // Update project
      const { data: updatedProject, error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (updateError) {
        console.error('Update project error:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update project' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      console.log('Project updated successfully:', updatedProject.id);
      return new Response(
        JSON.stringify({ success: true, project: updatedProject }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (body.action === 'delete') {
      const { projectId, backupEmail } = body;

      // Get project and verify ownership
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, profile_id')
        .eq('id', projectId)
        .single();

      if (projectError || !project) {
        return new Response(
          JSON.stringify({ success: false, error: 'Project not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      // Verify profile ownership
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('backup_email')
        .eq('id', project.profile_id)
        .single();

      if (profileError || !profile) {
        return new Response(
          JSON.stringify({ success: false, error: 'Profile not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      if (profile.backup_email.toLowerCase().trim() !== backupEmail.toLowerCase().trim()) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email verification failed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        );
      }

      // Delete project
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (deleteError) {
        console.error('Delete project error:', deleteError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to delete project' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      console.log('Project deleted successfully:', projectId);
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('Handler error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

serve(handler);
