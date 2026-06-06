import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token');
  const path = request.nextUrl.pathname;

  // Define public routes
  const publicRoutes = ['/login', '/register', '/verify-email', '/forgot-password', '/new-password'];
  const isPublicRoute = publicRoutes.includes(path);

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Role-based auth stub
  // In a real application, decode the JWT token to fetch the user role and validate permissions.
  // const userRole = token ? getUserRoleFromToken(token) : null;
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};