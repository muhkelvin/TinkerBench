import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Only admin routes require authentication checks
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  // 2. Check signed admin session cookie first
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const adminSession = await verifySessionToken(sessionToken);
  let isAuthorized = Boolean(adminSession && adminSession.role === 'admin');

  // 3. Fallback to Supabase auth check if not authorized and real Supabase is configured
  if (!isAuthorized) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
    const isSupabaseConfigured =
      supabaseUrl &&
      !supabaseUrl.includes('placeholder') &&
      supabasePublishableKey &&
      !supabasePublishableKey.includes('placeholder');

    if (isSupabaseConfigured) {
      try {
        const supabase = createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            },
          },
        });

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          isAuthorized = true;
        }
      } catch {
        // Fallback
      }
    }
  }

  // 4. Protect /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!isAuthorized) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // 5. If already authorized and visiting /admin/login, redirect to /admin
  if (pathname === '/admin/login' && isAuthorized) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}
