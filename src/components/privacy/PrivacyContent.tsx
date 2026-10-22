'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export function PrivacyContent() {
  const { t } = useTranslation();

  return (
    <div className="max-w-[740px] mx-auto space-y-8">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#686960] uppercase">
          <ShieldCheck className="w-4 h-4 text-[#24251F]" />
          <span>{t.privacy.badge}</span>
        </div>
        <h1 className="h1-fluid text-[#24251F]">
          {t.privacy.title}
        </h1>
        <p className="text-[#686960] leading-relaxed">
          {t.privacy.intro}
        </p>
      </header>

      <div className="space-y-6 text-[#24251F] leading-relaxed">
        <section className="space-y-2 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-6">
          <h2 className="text-base font-semibold text-[#24251F]">
            {t.privacy.sec1Title}
          </h2>
          <p className="text-sm text-[#686960]">
            {t.privacy.sec1Desc}
          </p>
        </section>

        <section className="space-y-2 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-6">
          <h2 className="text-base font-semibold text-[#24251F]">
            {t.privacy.sec2Title}
          </h2>
          <p className="text-sm text-[#686960]">
            {t.privacy.sec2Desc}
          </p>
        </section>

        <section className="space-y-2 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-6">
          <h2 className="text-base font-semibold text-[#24251F]">
            {t.privacy.sec3Title}
          </h2>
          <p className="text-sm text-[#686960]">
            {t.privacy.sec3Desc}
          </p>
        </section>
      </div>
    </div>
  );
}
