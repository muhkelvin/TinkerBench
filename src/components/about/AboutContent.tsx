'use client';

import React from 'react';
import { siteConfig } from '@/lib/site-config';
import { useTranslation } from '@/lib/i18n/context';
import { Mail, MessageCircle, Terminal, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';

export function AboutContent() {
  const { t } = useTranslation();

  return (
    <div className="max-w-[740px] mx-auto space-y-12">
      {/* Intro */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-[#24251F] bg-[#C7E36A] px-2.5 py-1 rounded border border-[#24251F]/20">
          <Terminal className="w-3.5 h-3.5" />
          <span>{t.about.badge}</span>
        </div>
        <h1 className="h1-fluid text-[#24251F]">
          {t.about.title}
        </h1>
        <p className="text-lg text-[#686960] leading-relaxed">
          {t.about.introLead}
        </p>
      </section>

      {/* Origin & Motivation */}
      <section className="space-y-4 leading-relaxed text-[#24251F]">
        <h2 className="text-xl font-semibold tracking-tight text-[#24251F]">
          {t.about.originHeading}
        </h2>
        <p>
          {t.about.originP1}
        </p>
        <p>
          {t.about.originP2Lead}
          <strong>{t.about.originP2Bold}</strong>
          {t.about.originP2Mid}
          <strong>{t.about.originP2End}</strong>
        </p>
        <p className="text-[#686960] text-sm">
          {t.about.originP3}
        </p>
      </section>

      {/* Work Principles */}
      <section className="space-y-5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-[#24251F]">
          {t.about.principlesHeading}
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#24251F] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm text-[#24251F]">{t.about.principle1Title}</h3>
              <p className="text-sm text-[#686960] mt-0.5">
                {t.about.principle1Desc}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#24251F] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm text-[#24251F]">{t.about.principle2Title}</h3>
              <p className="text-sm text-[#686960] mt-0.5">
                {t.about.principle2Desc}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#24251F] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm text-[#24251F]">{t.about.principle3Title}</h3>
              <p className="text-sm text-[#686960] mt-0.5">
                {t.about.principle3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Commercial Offering */}
      <section className="space-y-4 rounded-xl border border-[#C7E36A]/60 bg-[#C7E36A]/10 p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-[#24251F]">
          {t.about.servicesHeading}
        </h2>
        <p className="text-sm text-[#24251F] leading-relaxed">
          {t.about.servicesDesc}
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs text-[#24251F] pt-1">
          {t.about.servicesList.map((service, idx) => (
            <li key={idx} className="flex items-center gap-2 bg-[#FFFEFA] p-2.5 rounded-lg border border-[#E5E1D6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#24251F]" />
              <span>{service}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Author & Contact */}
      <section className="space-y-4 pt-4 border-t border-[#E5E1D6]">
        <h2 className="text-xl font-semibold tracking-tight text-[#24251F]">
          {t.about.connectHeading}
        </h2>
        <p className="text-[#686960] leading-relaxed">
          {t.about.connectDesc}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          {siteConfig.links.whatsapp && (
            <a
              href={`${siteConfig.links.whatsapp}?text=Halo,%20saya%20tertarik%20untuk%20diskusi%20proyek%20dengan%20Tinkerbench`}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-5 py-2.5 rounded-lg bg-[#24251F] text-[#FFFEFA] text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4 text-[#C7E36A] fill-[#24251F]" />
              <span>{t.about.chatWa}</span>
            </a>
          )}
          {siteConfig.links.email && (
            <a
              href={`mailto:${siteConfig.links.email}?subject=Project%20Inquiry%20Tinkerbench`}
              className="touch-target px-4 py-2.5 rounded-lg border border-[#E5E1D6] bg-[#FFFEFA] text-[#24251F] text-sm font-medium inline-flex items-center gap-2 hover:bg-[#F5F3EC] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#24251F]" />
              <span>{t.about.sendEmail}</span>
            </a>
          )}
          {siteConfig.links.github && (
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-4 py-2.5 rounded-lg border border-[#E5E1D6] bg-[#FFFEFA] text-[#24251F] text-sm font-medium inline-flex items-center gap-2 hover:bg-[#F5F3EC] transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>{t.about.github}</span>
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
