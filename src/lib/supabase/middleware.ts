import { environment } from '@/configs/environment';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = environment;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies
          .getAll()
          .filter((cookie) => cookie.name.startsWith('sb-'));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname !== '/login') {
    const url = new URL('/login', request.url);
    const callbackUrl = request.nextUrl.pathname + request.nextUrl.search;
    url.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname === '/login') {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    const url = new URL(callbackUrl || '/', request.url);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
