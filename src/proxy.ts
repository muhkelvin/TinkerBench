import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy-helpers';

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);

  // Geo IP language detection: if visitor doesn't have a manual choice cookie
  const existingCookie = request.cookies.get('tb_locale')?.value;
  if (!existingCookie) {
    const country =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-country-code') ||
      request.headers.get('geoip-country-code') ||
      request.headers.get('cloudfront-viewer-country');

    if (country) {
      const defaultLocale = country.trim().toUpperCase() === 'ID' ? 'id' : 'en';
      response.cookies.set('tb_locale', defaultLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      });
      response.headers.set('x-detected-locale', defaultLocale);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - static image extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
