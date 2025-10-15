"use client";

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ErrorClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case 'auth_failed':
        return 'Authentication failed. Please try again.';
      case 'access_denied':
        return 'Access was denied. You need to authorize the application to continue.';
      case 'server_error':
        return 'A server error occurred. Please try again later.';
      default:
        return 'An unexpected error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Authentication Error</CardTitle>
            <CardDescription>
              There was a problem with the authentication process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {getErrorMessage(error)}
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/">Try Again</Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>

            {error && (
              <div className="text-xs text-gray-500 text-center">Error code: {error}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
