import type { Metadata, Viewport } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/lib/site-config';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name }],
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import { LanguageProvider } from '@/lib/i18n/context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-[var(--bench-bg)] text-[var(--bench-primary)] min-h-dvh flex flex-col font-sans selection:bg-[var(--bench-lime)] selection:text-[var(--bench-primary)]">
        <LanguageProvider initialLocale="id">
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
