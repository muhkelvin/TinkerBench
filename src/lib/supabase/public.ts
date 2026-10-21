import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

/**
 * Check if a real Supabase instance is configured.
 * Prevents DNS timeout hangs when placeholder credentials are used in local dev.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    supabasePublishableKey &&
    !supabasePublishableKey.includes('placeholder')
  );
}

/**
 * Public client for querying published content without user cookies.
 * Safe for server components with caching.
 */
export function createPublicClient() {
  return createClient<any>(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabasePublishableKey || 'placeholder-publishable-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

