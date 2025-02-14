import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Check if we're on the login page
  if (request.nextUrl.pathname === '/login') {
    const token = request.cookies.get('auth-token')?.value;

    // If we have a valid token, redirect to dashboard
    if (token) {
      try {
        await verifyToken(token);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
        // Token is invalid, continue to login page
      }
    }
    return NextResponse.next();
  }

  // Check if the request is for the dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      // Redirect to login if no token is present
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify the token
      await verifyToken(token);
      return NextResponse.next();
    } catch (error) {
      // Redirect to login if token is invalid
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
