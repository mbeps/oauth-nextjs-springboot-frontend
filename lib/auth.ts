export interface User {
  id: number;
  login: string;
  name: string;
  email?: string;
  avatar_url: string;
}

export interface AuthStatus {
  authenticated: boolean;
  user?: User;
}

export interface ProtectedData {
  message: string;
  data?: {
    items?: string[];
    lastUpdated?: string | number | null;
  } | null;
}

export interface PublicData {
  status: string;
  timestamp: string | number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function checkAuthStatus(): Promise<AuthStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    }
    
    return { authenticated: false };
  } catch (error) {
    console.error('Auth status check failed:', error);
    return { authenticated: false };
  }
}

export async function fetchProtectedData(): Promise<ProtectedData> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/protected/data`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch protected data:', error);
    throw error;
  }
}

export async function performAction(action: string): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/protected/action`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to perform action:', error);
    throw error;
  }
}

export async function fetchPublicData(): Promise<PublicData> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/health`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch public data:', error);
    throw error;
  }
}

export function loginWithGitHub() {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/github`;
}

/**
 * Logs out the current user by calling Spring Security's logout endpoint.
 * This invalidates the session, clears authentication, and deletes the session cookie.
 */
export async function logout() {
  try {
    // Call Spring Security's logout endpoint which properly invalidates the session
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Logout successful:', data.message);
    }
    
    // Redirect to home page after logout
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
    // Redirect anyway to show logged out state
    window.location.href = '/';
  }
}