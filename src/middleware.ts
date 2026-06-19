import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('carbonos_user_session')?.value;

  const isAuthPage = pathname.startsWith('/auth');

  // If trying to access protected routes without a session, redirect to login
  if (!session && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // If trying to access login/signup with an active session, redirect to dashboard
  if (session && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - og-image.png (social previews)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|og-image.png).*)',
  ],
};
