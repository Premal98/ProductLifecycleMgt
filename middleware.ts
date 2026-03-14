import { NextRequest, NextResponse } from 'next/server';
import { canAccess } from '@/lib/rbac';

const publicRoutes = ['/', '/login', '/signup'];
const publicApiRoutes = ['/api/auth', '/api/health'];
const protectedRouteAccess = [
  { prefix: '/settings/users', resource: 'users' },
  { prefix: '/settings', resource: 'settings' },
  { prefix: '/products', resource: 'products' },
  { prefix: '/projects', resource: 'projects' },
  { prefix: '/boms', resource: 'boms' },
  { prefix: '/documents', resource: 'documents' },
  { prefix: '/cad', resource: 'cad_files' },
  { prefix: '/suppliers', resource: 'suppliers' },
  { prefix: '/reports', resource: 'reports' },
  { prefix: '/dashboard', resource: 'dashboard' }
];

function matchProtectedResource(pathname: string) {
  return protectedRouteAccess.find(
    (entry) => pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`)
  )?.resource;
}

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

  if (!pathname.startsWith('/api') && !isPublicPage && hasAccessToken) {
    const resource = matchProtectedResource(pathname);
    if (resource) {
      const role = req.cookies.get('plm-role')?.value || 'viewer';
      if (!canAccess(role, resource, 'read')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)']
};
