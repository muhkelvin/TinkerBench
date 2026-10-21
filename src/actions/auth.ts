'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/server';
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

  // 1. Check against configured admin credentials in .env.local
  if (email === configuredAdminEmail && password === configuredAdminPassword) {
    isAuthenticated = true;
  }

  // 2. If not matched, try Supabase auth if configured with real project
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes('placeholder');

  if (!isAuthenticated && isSupabaseConfigured) {
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        const { data: isAdmin } = await supabase.rpc('is_admin');
        if (isAdmin) {
          isAuthenticated = true;
        }
      }
    } catch {
      // Continue to error if auth fails
    }
  }

  if (!isAuthenticated) {
    return { error: 'Email atau kata sandi administrator tidak sesuai.' };
  }

  // Set secure signed admin session cookie (7 days)
  const token = await createSessionToken(email);
  const cookieStore = await cookies();
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
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const supabase = await createAdminClient();
      await supabase.auth.signOut();
    }
  } catch {
    // Ignore error
  }

  redirect('/admin/login');
}
