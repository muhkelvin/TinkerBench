'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function loginAdmin(prevState: { error?: string } | null, formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string)?.trim();

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' };
  }

  const configuredAdminEmail = (process.env.ADMIN_EMAIL || 'admin@tinkerbench.dev').trim().toLowerCase();
  const configuredAdminPassword = (process.env.ADMIN_PASSWORD || 'admin12345!').trim();

  let isAuthenticated = false;

  // 1. If real Supabase is configured, attempt Supabase Auth sign-in to set auth session cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    supabasePublishableKey &&
    !supabasePublishableKey.includes('placeholder');

  const cookieStore = await cookies();

  if (isSupabaseConfigured) {
    try {
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

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        isAuthenticated = true;
      }
    } catch {
      // Continue to local credentials check
    }
  }

  // 2. Check against configured admin credentials in .env.local
  if (!isAuthenticated && email === configuredAdminEmail && password === configuredAdminPassword) {
    isAuthenticated = true;
  }

  if (!isAuthenticated) {
    return { error: 'Email atau kata sandi administrator tidak sesuai.' };
  }

  // Set secure signed admin session cookie (7 days)
  const token = await createSessionToken(email);
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect('/admin');
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
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
      await supabase.auth.signOut();
    }
  } catch {
    // Ignore error
  }

  redirect('/admin/login');
}
