// Google Analytics 4 utility functions
// IMPORTANT: Never track emails, backup emails, or personal identifiers

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Track page views (for SPA navigation)
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }
};

// Track profile view
export const trackProfileView = (profileId: string, profileRole: 'founder' | 'developer') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'profile_view', {
      profile_id: profileId,
      profile_role: profileRole,
    });
  }
};

// Track interested button click
export const trackInterestedClick = (profileId: string, projectId?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'interested_click', {
      profile_id: profileId,
      ...(projectId && { project_id: projectId }),
    });
  }
};

// Track project published
export const trackProjectPublished = (profileId: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'project_published', {
      profile_id: profileId,
      hiring_status: 'active',
    });
  }
};

// Track hiring completed
export const trackHiringCompleted = (profileId: string, projectId: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'hiring_completed', {
      profile_id: profileId,
      project_id: projectId,
    });
  }
};

// Track add profile started
export const trackAddProfileStarted = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_profile_started');
  }
};

// Track add profile completed
export const trackAddProfileCompleted = (role: 'founder' | 'developer') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_profile_completed', {
      role: role,
    });
  }
};
