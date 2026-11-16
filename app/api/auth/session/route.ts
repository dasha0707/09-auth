import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api';
import { parseSetCookie } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json({ success: false }, { status: 200 });
    }

    const apiRes = await api.get('/auth/session', {
      headers: { Cookie: cookieStore.toString() },
    });

    const rawSetCookie = apiRes.headers['set-cookie'];
    const cookieValues = !rawSetCookie
      ? []
      : Array.isArray(rawSetCookie)
        ? rawSetCookie
        : [rawSetCookie];

    for (const cookieStr of cookieValues) {
      const parsed = parseSetCookie(cookieStr);
      if (parsed.value) cookieStore.set(parsed.name, parsed.value, parsed);
    }

    const hasUpdatedToken = cookieValues.some((header) =>
      /(?:^|\s)accessToken=/.test(header),
    );
    const data = apiRes.data as { success?: boolean } | null | undefined;
    const success = data?.success === false ? false : Boolean(data) || hasUpdatedToken;

    return NextResponse.json({ success }, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) logErrorResponse(error.response?.data);
    else logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
