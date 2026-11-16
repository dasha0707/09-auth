import { NextRequest, NextResponse } from 'next/server';
import { parseSetCookie } from 'cookie';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/notes', '/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];
const isRoute = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivate = privateRoutes.some((route) => isRoute(pathname, route));
  const isPublic = publicRoutes.some((route) => isRoute(pathname, route));
  if (!isPrivate && !isPublic) return NextResponse.next();

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  let isAuthenticated = false;
  let updatedCookies: string[] = [];

  // With no tokens there is no need for a network request.
  if (accessToken || refreshToken) {
    try {
      // A refresh token can renew an expired or missing access token.
      const session = await checkSession(request.headers.get('cookie') ?? '');
      const payload = session.data;
      const setCookie = session.headers['set-cookie'];
      updatedCookies = !setCookie ? [] : Array.isArray(setCookie) ? setCookie : [setCookie];
      const refreshedAccess = updatedCookies.some((header) =>
        /(?:^|\s)accessToken=/.test(header),
      );
      isAuthenticated = payload?.success === false
        ? false
        : Boolean(payload) || refreshedAccess;
    } catch {
      isAuthenticated = false;
    }
  }

  let response: NextResponse;
  if (isPrivate && !isAuthenticated) {
    response = NextResponse.redirect(new URL('/sign-in', request.url));
  } else if (isPublic && isAuthenticated) {
    response = NextResponse.redirect(new URL('/', request.url));
  } else {
    response = NextResponse.next();
  }

  // Keep freshly issued cookies on the response after a session refresh.
  for (const cookieStr of updatedCookies) {
    const parsed = parseSetCookie(cookieStr);
    if (parsed.value) response.cookies.set(parsed.name, parsed.value, parsed);
  }
  return response;
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
