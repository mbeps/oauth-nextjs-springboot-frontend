import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Routes that don't require authentication
const publicRoutes = ['/', '/error'];

// Routes that require authentication
const protectedRoutes = ['/dashboard'];

async function checkAuth(request: NextRequest): Promise<boolean> {
  try {
    // Get JWT cookie from request
    const jwtCookie = request.cookies.get('jwt');
    
    if (!jwtCookie) {
      return false;
    }

    // Verify auth status with backend
    const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
      headers: {
        Cookie: `jwt=${jwtCookie.value}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.authenticated === true;
  } catch (error) {
    console.error('Auth check failed in middleware:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is public
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Public routes are always accessible
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  if (isProtectedRoute) {
    const isAuthenticated = await checkAuth(request);

    if (!isAuthenticated) {
      // Redirect to home page if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};