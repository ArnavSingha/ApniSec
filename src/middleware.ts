import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect routes.
 * It checks for an 'accessToken' cookie and redirects to the login page if it's not present.
 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('accessToken')?.value;

  // Paths to protect
  const protectedRoutes = ['/dashboard', '/profile'];
  const isProtectedRoute = protectedRoutes.some(p => path.startsWith(p));
  
  // Paths for authenticated users that should redirect to dashboard
  const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAuthPage = authPages.some(p => path.startsWith(p));

  if (isAuthPage && token) {
    // Redirect authenticated users away from auth pages to the dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (isProtectedRoute && !token) {
    // Redirect unauthenticated users from protected routes to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
