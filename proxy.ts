import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/notes', '/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

const isRoute = (path: string, prefix: string) => path === prefix || path.startsWith(prefix + '/');

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivate = privateRoutes.some((route) => isRoute(pathname, route));
  const isPublic = publicRoutes.some((route) => isRoute(pathname, route));

  if (!isPrivate && !isPublic) return NextResponse.next();

  const { success } = await checkSession(request.headers.get('cookie') ?? '');
  if (isPrivate && !success) return NextResponse.redirect(new URL('/sign-in', request.url));
  if (isPublic && success) return NextResponse.redirect(new URL('/profile', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
