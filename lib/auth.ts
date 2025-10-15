export interface User {
  id: number;  // Matches GitHub's Integer type
  login: string;
  name: string;
  email?: string;
  avatarUrl: string;  // Changed from avatar_url to match DTO
}

export interface AuthStatus {
  authenticated: boolean;
  user?: User;
}

export interface ProtectedData {
  message: string;
  user: string;
  data?: {
    items?: string[];
    count?: number;
    lastUpdated?: number;
  } | null;
}

export interface PublicData {
  status: string;
  message: string;
  timestamp: number;
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
 * With JWT, this deletes the JWT cookie on the client side.
 */
export async function logout() {
  try {
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
    
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
    window.location.href = '/';
  }
}