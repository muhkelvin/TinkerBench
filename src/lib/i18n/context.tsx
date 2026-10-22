'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import type { Locale, Dictionary } from './types';
import { idDictionary } from './dictionaries/id';
import { enDictionary } from './dictionaries/en';

interface LanguageContextType {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  isDetecting: boolean;
  initialLocale: Locale;
}

const dictionaries: Record<Locale, Dictionary> = {
  id: idDictionary,
  en: enDictionary,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const COOKIE_NAME = 'tb_locale';
const STORAGE_KEY = 'tb_locale';

const INDONESIA_TIMEZONES = [
  'Asia/Jakarta',
  'Asia/Pontianak',
  'Asia/Makassar',
  'Asia/Jayapura',
];

function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;

  // 1. Check localStorage first
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'id' || saved === 'en') return saved;
  } catch {
    // localStorage might be blocked or restricted
  }

  // 2. Check cookie
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    if (match && (match[1] === 'id' || match[1] === 'en')) {
      return match[1] as Locale;
    }
  } catch {
    // cookie might be restricted
  }

  return null;
}

function persistLocale(locale: Locale) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Ignore
  }

  try {
    document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Ignore
  }

  try {
    document.documentElement.lang = locale;
  } catch {
    // Ignore
  }
}

export function LanguageProvider({
  initialLocale = 'id',
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const setLocale = (newLocale: Locale) => {
    startTransition(() => {
      setLocaleState(newLocale);
      persistLocale(newLocale);
    });
  };

  useEffect(() => {
    // Check if user already made a manual choice
    const stored = getStoredLocale();
    if (stored) {
      if (stored !== locale) {
        startTransition(() => {
          setLocaleState(stored);
        });
      }
      persistLocale(stored);
      return;
    }

    // No preference stored: perform automatic Geo IP & Timezone detection
    setIsDetecting(true);

    const detectVisitorLocale = async () => {
      let detected: Locale = 'id';

      // Method 1: Client timezone & navigator languages check
      try {
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isIndonesianTz = INDONESIA_TIMEZONES.includes(userTz);
        const navLangs = typeof navigator !== 'undefined' ? navigator.languages || [navigator.language] : [];
        const hasIndoLang = navLangs.some((l) => l.toLowerCase().startsWith('id'));

        // If outside Indonesia timezone and language is not Indonesian, suspect English
        if (!isIndonesianTz && !hasIndoLang && userTz) {
          detected = 'en';
        }
      } catch {
        // Continue to API check
      }

      // Method 2: Check server Geo IP API
      try {
        const res = await fetch('/api/geo');
        if (res.ok) {
          const data = (await res.json()) as {
            country?: string;
            isIndonesia?: boolean | null;
            defaultLocale?: Locale | null;
          };

          if (data.defaultLocale) {
            detected = data.defaultLocale;
          } else if (data.isIndonesia === false) {
            detected = 'en';
          } else if (data.isIndonesia === true) {
            detected = 'id';
          }
        }
      } catch {
        // Fallback to timezone detection result
      }

      startTransition(() => {
        setLocaleState(detected);
        persistLocale(detected);
        setIsDetecting(false);
      });
    };

    detectVisitorLocale();
  }, []);

  const value: LanguageContextType = {
    locale,
    t: dictionaries[locale] || idDictionary,
    setLocale,
    isDetecting,
    initialLocale,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeLocale = mounted ? context.locale : context.initialLocale;
  const activeT = mounted ? context.t : (dictionaries[context.initialLocale] || idDictionary);

  return {
    ...context,
    locale: activeLocale,
    t: activeT,
    mounted,
  };
}

export function useTranslation() {
  const { t, locale, setLocale, mounted } = useLanguage();
  return { t, locale, setLocale, mounted };
}
