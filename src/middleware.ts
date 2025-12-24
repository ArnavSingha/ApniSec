import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect routes.
 * It checks for an 'accessToken' cookie and redirects to the login page if it's not present.
 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Paths to protect
  const isProtectedRoute = path.startsWith('/dashboard');

  const token = request.cookies.get('accessToken')?.value;

  if (isProtectedRoute && !token) {
    // Redirect to login page if token is missing for a protected route
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*'],
};
