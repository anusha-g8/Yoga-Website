import { API_BASE_URL } from '../config';

/**
 * Sends activity data to the backend for monitoring
 * @param {Object} options 
 * @param {string} options.type - The type of activity (e.g. PAGE_VIEW, CLICK, SUBMIT)
 * @param {string} options.description - Human readable description
 * @param {Object} options.metadata - Additional context
 * @param {boolean} options.isTraffic - Whether this should count as a "visit"
 */
export const trackActivity = async ({ type, description, metadata = {}, isTraffic = false }) => {
  if (typeof fetch === 'undefined') {
    return;
  }
  try {
    const token = localStorage.getItem('memberToken');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['x-auth-token'] = token;
    }

    const body = {
      activity_type: type,
      description,
      metadata: {
        ...metadata,
        path: window.location.pathname,
        referrer: document.referrer
      },
      is_traffic: isTraffic
    };

    // Use sendBeacon if available for non-critical tracking (reliable on page unload)
    if (navigator.sendBeacon && !token) {
      const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
      navigator.sendBeacon(`${API_BASE_URL}/monitoring/track`, blob);
      return;
    }

    // Standard fetch for logged in users or fallback
    await fetch(`${API_BASE_URL}/monitoring/track`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
  } catch (error) {
    // Silently fail to not interrupt user experience
    console.debug('Tracking failed:', error);
  }
};
