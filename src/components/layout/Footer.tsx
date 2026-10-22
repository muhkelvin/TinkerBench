'use client';

import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { useTranslation } from '@/lib/i18n/context';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-[#E5E1D6] bg-[#F5F3EC] py-12 text-[#686960]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#E5E1D6]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-sm bg-[#C7E36A] border border-[#24251F]/30" />
              <span className="font-semibold text-sm tracking-tight text-[#24251F]">
                {siteConfig.name}
              </span>
            </div>
            <p className="font-mono text-xs text-[#686960] tracking-tight">
              {t.footer.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link href="/labs" className="hover:text-[#24251F] transition-colors">
              {t.nav.labs}
            </Link>
            <Link href="/notes" className="hover:text-[#24251F] transition-colors">
              {t.nav.notes}
            </Link>
            <Link href="/about" className="hover:text-[#24251F] transition-colors">
              {t.nav.about}
            </Link>
            <Link href="/privacy" className="hover:text-[#24251F] transition-colors">
              {t.nav.privacy}
            </Link>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#24251F] transition-colors"
            >
              {t.nav.github}
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#686960]">
          <p>{t.footer.rights}</p>
          <p className="text-[11px]">
            {t.footer.builtWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
