import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/api/auth',
  '/api/demo-gemini', // Keep demo API accessible
];

// Define routes that require specific roles
const roleProtectedRoutes = {
  '/teacher': 'teacher',
  '/profile': 'student', // Profile requires authentication
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route) || pathname === route
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for role-protected routes
  let requiredRole: 'student' | 'teacher' | null = null;
  for (const [route, role] of Object.entries(roleProtectedRoutes)) {
    if (pathname.startsWith(route)) {
      requiredRole = role as 'teacher' | 'student';
      break;
    }
  }

  // Get the session token from cookies or headers
  // In a real implementation, this would check for a valid Firebase session
  const sessionToken = request.cookies.get('session-token')?.value ||
                     request.headers.get('authorization');

  // If no session token and route requires authentication, redirect to login
  if (!sessionToken && requiredRole) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add security headers
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}

// Configure the middleware to match specific paths
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
