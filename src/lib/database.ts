import { supabase } from "@/integrations/supabase/client";

export interface DbProfile {
  id: string;
  name: string;
  tagline: string | null;
  avatar: string | null;
  type: 'founder' | 'developer';
  category: string;
  contact: string;
  contact_type: 'email' | 'linkedin' | 'twitter' | 'discord';
  project_name: string | null;
  project_description: string | null;
  hiring_type: string | null;
  skills_needed: string[];
  skills: string[];
  preferred_project_type: string | null;
  is_hiring: boolean;
  is_featured: boolean;
  views: number;
  interests: number;
  created_at: string;
  updated_at: string;
}

// Convert DB profile to frontend Profile format (for compatibility)
export interface Profile {
  id: string;
  type: 'founder' | 'developer';
  name: string;
  avatar: string;
  tagline: string;
  building: string;
  lookingFor: string;
  contactType: 'email' | 'twitter' | 'linkedin' | 'discord';
  contact: string;
  projectName?: string;
  projectDescription?: string;
  hiringType?: string;
  developerNeeds?: string[];
  skills?: string[];
  preferredProjectType?: string;
  views: number;
  interests: number;
  joinedAt: string;
  lastActive: string;
  category: string;
  isHiring?: boolean;
  isFeatured?: boolean;
}

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 5) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

export function dbProfileToProfile(dbProfile: DbProfile): Profile {
  return {
    id: dbProfile.id,
    type: dbProfile.type,
    name: dbProfile.name,
    avatar: dbProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbProfile.name)}&background=random`,
    tagline: dbProfile.tagline || '',
    building: dbProfile.project_description || dbProfile.tagline || '',
    lookingFor: dbProfile.type === 'founder' 
      ? `Looking for ${dbProfile.hiring_type || 'co-founder'}` 
      : dbProfile.preferred_project_type || 'Exciting startup opportunities',
    contactType: dbProfile.contact_type === 'discord' ? 'email' : dbProfile.contact_type,
    contact: dbProfile.contact,
    projectName: dbProfile.project_name || undefined,
    projectDescription: dbProfile.project_description || undefined,
    hiringType: dbProfile.hiring_type || undefined,
    developerNeeds: dbProfile.skills_needed.length > 0 ? dbProfile.skills_needed : undefined,
    skills: dbProfile.skills.length > 0 ? dbProfile.skills : undefined,
    preferredProjectType: dbProfile.preferred_project_type || undefined,
    views: dbProfile.views,
    interests: dbProfile.interests,
    joinedAt: getRelativeTime(dbProfile.created_at),
    lastActive: getRelativeTime(dbProfile.updated_at),
    category: dbProfile.category,
    isHiring: dbProfile.is_hiring,
    isFeatured: dbProfile.is_featured,
  };
}

// Fetch all profiles (excluding backup_email)
export async function fetchProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, tagline, avatar, type, category, contact, contact_type, project_name, project_description, hiring_type, skills_needed, skills, preferred_project_type, is_hiring, is_featured, views, interests, created_at, updated_at')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return (data || []).map(dbProfileToProfile);
}

// Fetch featured/hiring profiles
export async function fetchFeaturedProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, tagline, avatar, type, category, contact, contact_type, project_name, project_description, hiring_type, skills_needed, skills, preferred_project_type, is_hiring, is_featured, views, interests, created_at, updated_at')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching featured profiles:', error);
    return [];
  }

  return (data || []).map(dbProfileToProfile);
}

// Fetch single profile by ID
export async function fetchProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, tagline, avatar, type, category, contact, contact_type, project_name, project_description, hiring_type, skills_needed, skills, preferred_project_type, is_hiring, is_featured, views, interests, created_at, updated_at')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return dbProfileToProfile(data as DbProfile);
}

// Create a new profile
export async function createProfile(profileData: {
  name: string;
  tagline: string;
  avatar?: string;
  type: 'founder' | 'developer';
  category: string;
  contact: string;
  contactType: 'email' | 'twitter' | 'linkedin';
  backupEmail: string;
  projectName?: string;
  projectDescription?: string;
  hiringType?: string;
  skillsNeeded?: string[];
  skills?: string[];
  preferredProjectType?: string;
  isHiring?: boolean;
}): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      name: profileData.name,
      tagline: profileData.tagline,
      avatar: profileData.avatar || null,
      type: profileData.type,
      category: profileData.category,
      contact: profileData.contact,
      contact_type: profileData.contactType,
      backup_email: profileData.backupEmail,
      project_name: profileData.projectName || null,
      project_description: profileData.projectDescription || null,
      hiring_type: profileData.hiringType || null,
      skills_needed: profileData.skillsNeeded || [],
      skills: profileData.skills || [],
      preferred_project_type: profileData.preferredProjectType || null,
      is_hiring: profileData.isHiring || false,
    })
    .select('id, name, tagline, avatar, type, category, contact, contact_type, project_name, project_description, hiring_type, skills_needed, skills, preferred_project_type, is_hiring, is_featured, views, interests, created_at, updated_at')
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return dbProfileToProfile(data as DbProfile);
}

// Increment views
export async function incrementProfileViews(id: string): Promise<void> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('views')
    .eq('id', id)
    .single();
  
  if (profile) {
    await supabase
      .from('profiles')
      .update({ views: (profile.views || 0) + 1 })
      .eq('id', id);
  }
}

// Increment interests
export async function incrementProfileInterests(id: string): Promise<void> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('interests')
    .eq('id', id)
    .single();
  if (profile) {
    await supabase
      .from('profiles')
      .update({ interests: (profile.interests || 0) + 1 })
      .eq('id', id);
  }
}

// Verify edit access via edge function
export async function verifyEditAccess(profileId: string, backupEmail: string): Promise<{ verified: boolean; error?: string }> {
  const { data, error } = await supabase.functions.invoke('verify-edit-access', {
    body: { profileId, backupEmail },
  });

  if (error) {
    console.error('Error verifying edit access:', error);
    return { verified: false, error: 'Failed to verify access' };
  }

  return data;
}

// Update profile via edge function (secure)
export async function updateProfileSecure(
  profileId: string, 
  backupEmail: string, 
  updates: Record<string, unknown>
): Promise<{ success: boolean; profile?: Profile; error?: string }> {
  const { data, error } = await supabase.functions.invoke('update-profile', {
    body: { profileId, backupEmail, updates },
  });

  if (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }

  if (data.success && data.profile) {
    return { success: true, profile: dbProfileToProfile(data.profile) };
  }

  return { success: false, error: data.error || 'Update failed' };
}
