'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  checkAuthStatus,
  fetchProtectedData,
  performAction,
  logout,
  type AuthStatus,
  type ProtectedData,
} from '@/lib/auth';

export default function Dashboard() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ authenticated: false });
  const [protectedData, setProtectedData] = useState<ProtectedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const status = await checkAuthStatus();
        setAuthStatus(status);
        
        if (!status.authenticated) {
          router.push('/');
          return;
        }

        // Load protected data
        const data = await fetchProtectedData();
        setProtectedData(data);
      } catch (error) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleAction = async (action: string) => {
    setActionLoading(true);
    setError(null);
    
    try {
      const result = await performAction(action);
      console.log('Action result:', result);
      
      // Refresh protected data
      const data = await fetchProtectedData();
      setProtectedData(data);
    } catch (error) {
      setError(`Failed to perform action: ${action}`);
      console.error('Action error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authStatus.authenticated || !authStatus.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={authStatus.user.avatar_url} alt={authStatus.user.name} />
                  <AvatarFallback>
                    {authStatus.user.name?.charAt(0) || authStatus.user.login.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{authStatus.user.name}</p>
                  <p className="text-xs text-gray-500">@{authStatus.user.login}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Your GitHub profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-sm text-gray-900">{authStatus.user.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Username</label>
                    <p className="text-sm text-gray-900">@{authStatus.user.login}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-sm text-gray-900">{authStatus.user.id}</p>
                  </div>
                  {authStatus.user.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{authStatus.user.email}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Protected Data Card */}
            <Card>
              <CardHeader>
                <CardTitle>Protected Data</CardTitle>
                <CardDescription>Data from protected API endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                {protectedData ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Message</label>
                      <p className="text-sm text-gray-900">{protectedData.message}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Items</label>
                      <ul className="text-sm text-gray-900 list-disc list-inside">
                        {protectedData.data?.items?.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm text-gray-900">
                        {protectedData.data?.lastUpdated
                          ? new Date(protectedData.data.lastUpdated).toLocaleString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Loading protected data...</p>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Perform actions on protected endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => handleAction('refresh_data')}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Refresh Data'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleAction('test_action')}
                    disabled={actionLoading}
                  >
                    Test Action
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleAction('sample_operation')}
                    disabled={actionLoading}
                  >
                    Sample Operation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}