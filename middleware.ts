import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js middleware for authentication and route protection
 * Runs before every request to protected routes
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;
  
  // Protected routes - require authentication
  const protectedPaths = ['/dashboard', '/tasks', '/settings'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Public auth routes - redirect if already authenticated
  const authPaths = ['/login', '/signup'];
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  
  // Check if this is a redirect from the client-side auth guard to prevent loops
  const hasRedirectParam = request.nextUrl.searchParams.has('redirect');
  
  // Handle unauthenticated access to protected routes
  if (isProtectedPath && !isAuthenticated) {
    // Let the client-side AuthGuard handle the redirect to avoid loops
    return NextResponse.next();
  }
  
  // Redirect authenticated users away from auth pages
  if (isAuthPath && isAuthenticated && !hasRedirectParam) {
    // Only redirect if we're not already in a redirect (prevents loops)
    const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }
  
  return NextResponse.next();
}

/**
 * Middleware configuration - specify which routes to run middleware on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};