import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 1. Check known geo headers (Vercel, Cloudflare, Fastly, AWS CloudFront)
  const headers = request.headers;
  const headerCountry =
    headers.get('x-vercel-ip-country') ||
    headers.get('cf-ipcountry') ||
    headers.get('x-country-code') ||
    headers.get('geoip-country-code') ||
    headers.get('cloudfront-viewer-country');

  if (headerCountry) {
    const country = headerCountry.trim().toUpperCase();
    const isIndonesia = country === 'ID';
    return NextResponse.json({
      country,
      isIndonesia,
      defaultLocale: isIndonesia ? 'id' : 'en',
      source: 'header',
    });
  }

  // 2. Extract Client IP
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '';

  const isLocalOrPrivate =
    !clientIp ||
    clientIp === '127.0.0.1' ||
    clientIp === '::1' ||
    clientIp.startsWith('192.168.') ||
    clientIp.startsWith('10.') ||
    clientIp.startsWith('172.');

  if (!isLocalOrPrivate) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`https://api.country.is/${clientIp}`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as { country?: string };
        if (data && data.country) {
          const country = data.country.toUpperCase();
          const isIndonesia = country === 'ID';
          return NextResponse.json({
            country,
            isIndonesia,
            defaultLocale: isIndonesia ? 'id' : 'en',
            source: 'ip_lookup',
          });
        }
      }
    } catch {
      // Fallback silently if lookup failed or timed out
    }
  }

  // 3. Fallback: Localhost / Private IP / Unknown
  return NextResponse.json({
    country: 'UNKNOWN',
    isIndonesia: null,
    defaultLocale: null,
    source: 'fallback',
  });
}
