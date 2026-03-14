import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/', '/login', '/signup'];
const publicApiRoutes = ['/api/auth', '/api/health'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  const isPublicPage = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isPublicApi = publicApiRoutes.some((route) => pathname.startsWith(route));
  const hasAccessToken = Boolean(req.cookies.get('plm-access-token')?.value);

  if (pathname === '/' && hasAccessToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if ((pathname.startsWith('/api') && !isPublicApi && !hasAccessToken) || (!pathname.startsWith('/api') && !isPublicPage && !hasAccessToken)) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if ((pathname === '/login' || pathname === '/signup') && hasAccessToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\..*|_next).*)']
};
