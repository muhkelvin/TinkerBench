'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/context';
import type { Locale } from '@/lib/i18n/types';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
  showIcon?: boolean;
}

export function LanguageToggle({ className = '', showIcon = true }: LanguageToggleProps) {
  const { locale, setLocale, isDetecting } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (newLocale: Locale) => {
    if (newLocale !== locale) {
      setLocale(newLocale);
    }
  };

  return (
    <div
      role="group"
      aria-label="Pilih Bahasa / Switch Language"
      className={`inline-flex items-center gap-1 p-0.5 rounded-lg border border-[#E5E1D6] bg-[#FFFEFA]/80 backdrop-blur-xs font-mono text-xs ${className}`}
    >
      {showIcon && (
        <span className="pl-1.5 pr-0.5 text-[#686960] flex items-center" aria-hidden="true">
          <Globe
            suppressHydrationWarning
            className={`w-3.5 h-3.5 ${mounted && isDetecting ? 'animate-spin' : ''}`}
          />
        </span>
      )}

      <button
        type="button"
        aria-pressed={locale === 'id'}
        onClick={() => handleSelect('id')}
        className={`touch-target px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
          locale === 'id'
            ? 'bg-[#24251F] text-[#FFFEFA] shadow-xs'
            : 'text-[#686960] hover:text-[#24251F] hover:bg-[#E5E1D6]/40'
        }`}
      >
        ID
      </button>

      <span className="text-[#E5E1D6] select-none text-[10px]" aria-hidden="true">
        /
      </span>

      <button
        type="button"
        aria-pressed={locale === 'en'}
        onClick={() => handleSelect('en')}
        className={`touch-target px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
          locale === 'en'
            ? 'bg-[#24251F] text-[#FFFEFA] shadow-xs'
            : 'text-[#686960] hover:text-[#24251F] hover:bg-[#E5E1D6]/40'
        }`}
      >
        EN
      </button>
    </div>
  );
}
