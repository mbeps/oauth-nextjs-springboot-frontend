import { apiClient } from './api-client';

export interface User {
  id: number;
  login: string;
  name: string;
  email?: string;
  avatarUrl: string;
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
    const response = await apiClient.get<AuthStatus>('/api/auth/status');
    return response.data;
  } catch (error) {
    console.error('Auth status check failed:', error);
    return { authenticated: false };
  }
}

export async function fetchProtectedData(): Promise<ProtectedData> {
  const response = await apiClient.get<ProtectedData>('/api/protected/data');
  return response.data;
}

export async function performAction(action: string): Promise<Record<string, unknown>> {
  const response = await apiClient.post<Record<string, unknown>>('/api/protected/action', { action });
  return response.data;
}

export async function fetchPublicData(): Promise<PublicData> {
  const response = await apiClient.get<PublicData>('/api/public/health');
  return response.data;
}

export function loginWithGitHub() {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/github`;
}

export async function logout() {
  try {
    await apiClient.post('/logout');
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
    window.location.href = '/';
  }
}