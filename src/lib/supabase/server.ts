import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session';

/**
 * Server client using Next.js 16 async cookie store for authenticated operations.
 * If SUPABASE_SERVICE_ROLE_KEY is set, uses service role client to execute
 * admin server actions with full verified permissions (bypassing client-side RLS).
 */
export async function createAdminClient(): Promise<any> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (serviceRoleKey && !serviceRoleKey.includes('placeholder')) {
    return createClient<any>(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }) as any;
  }

  const cookieStore = await cookies();
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'placeholder-publishable-key';

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return (cookieStore.getAll() as any);
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            (cookieStore.set as any)(name, value, options);
          });
        } catch {
          // Ignore if called from Server Component
        }
      },
    },
  }) as any;
}

/**
 * Verify if current session belongs to an authorized admin.
 * Checks signed session cookie first, then Supabase session if configured.
 */
export async function verifyAdmin(): Promise<{ isAdmin: boolean; user: any }> {
  // 1. Check custom signed admin session cookie
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (session && session.role === 'admin') {
      return {
        isAdmin: true,
        user: { id: 'admin-tb', email: session.email, role: 'admin' },
      };
    }
  } catch {
    // Continue to Supabase check
  }

  // 2. Fallback to Supabase session if configured
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return { isAdmin: false, user: null };
    }

    const cookieStore = await cookies();
    const supabasePublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-publishable-key';

    const supabase = createServerClient<any>(supabaseUrl, supabasePublishableKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch { }
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { isAdmin: false, user: null };
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
    if (adminError || !isAdmin) {
      return { isAdmin: false, user };
    }

    return { isAdmin: true, user };
  } catch {
    return { isAdmin: false, user: null };
  }
}
