import { isAxiosError } from 'axios';
import { parseSetCookie } from 'cookie';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { api } from '../../api';
import { logErrorResponse } from '../../_utils/utils';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (accessToken) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ success: false }, { status: 200 });
    }

    const apiRes = await api.get('auth/session', {
      headers: { Cookie: cookieStore.toString() },
    });

    const setCookieHeaders = apiRes.headers['set-cookie'];

    if (setCookieHeaders) {
      const setCookieArray = Array.isArray(setCookieHeaders)
        ? setCookieHeaders
        : [setCookieHeaders];

      for (const setCookieHeader of setCookieArray) {
        const parsedCookie = parseSetCookie(setCookieHeader);

        if (parsedCookie?.value !== undefined) {
          cookieStore.set(parsedCookie.name, parsedCookie.value, parsedCookie);
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
    } else {
      logErrorResponse({ message: (error as Error).message });
    }

    return NextResponse.json({ success: false }, { status: 200 });
  }
}
