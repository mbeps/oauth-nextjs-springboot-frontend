'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginWithGitHub, fetchPublicData, performAction, type PublicData } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Home page component - login and public information page.
 * Displays GitHub OAuth login button and tests protected routes without auth.
 * Redirects authenticated users to dashboard.
 * @returns Home page with login options and public data
 * @author Maruf Bepary
 */
export default function Home() {
  const { authenticated, loading } = useAuth();
  const [publicData, setPublicData] = useState<PublicData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    if (!loading && authenticated) {
      router.push('/dashboard');
    }
  }, [authenticated, loading, router]);

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const data = await fetchPublicData();
        setPublicData(data);
      } catch (error) {
        console.error('Failed to load public data:', error);
      }
    };

    loadPublicData();
  }, []);

  /**
   * Initiates GitHub OAuth login flow.
   * Redirects user to GitHub authorization endpoint via backend.
   * @author Maruf Bepary
   */
  const handleLogin = () => {
    loginWithGitHub();
  };

  /**
   * Attempts to perform a protected action (requires authentication).
   * Shows success toast if successful or error toast if unauthenticated.
   * @async
   * @param action Action identifier to execute on backend
   * @author Maruf Bepary
   */
  const handleTestAction = async (action: string) => {
    setActionLoading(true);

    try {
      await performAction(action);
      toast.success(`Action '${action}' completed successfully`);
    } catch (error) {
      toast.error('Authentication required', {
        description: 'You must be logged in to perform this action'
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show login page if authenticated (will redirect)
  if (authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OAuth Demo App
          </h1>
          <p className="text-gray-600">
            NextJS + Spring Boot OAuth Integration
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in with GitHub to access the protected dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleLogin} 
              className="w-full"
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Sign in with GitHub
            </Button>

            {publicData && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700">
                  ✅ Backend connection successful
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Status: {publicData.status} | {new Date(publicData.timestamp).toLocaleTimeString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Protected Actions (Should fail when not logged in) */}
        <Card>
          <CardHeader>
            <CardTitle>Test Protected Actions</CardTitle>
            <CardDescription>
              These buttons require authentication and will show error toasts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline"
                onClick={() => handleTestAction('test_action')}
                disabled={actionLoading}
              >
                Test Action
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleTestAction('sample_operation')}
                disabled={actionLoading}
              >
                Sample Operation
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>This is a demo application showcasing OAuth integration</p>
          <p className="mt-1">Frontend: NextJS | Backend: Spring Boot</p>
        </div>
      </div>
    </div>
  );
}