'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export function ProjectFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const currentSearch = searchParams.get('q') || '';
  const currentStatus = searchParams.get('status') || '';
  const currentType = searchParams.get('type') || '';
  const currentTag = searchParams.get('tag') || '';

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('search') as string;
    updateFilters('q', q.trim() || null);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = Boolean(
    currentSearch || currentStatus || currentType || currentTag
  );

  const statuses = [
    { label: t.labs.allStatus, value: '' },
    { label: t.labs.maturities.concept, value: 'concept' },
    { label: t.labs.maturities.production, value: 'production' },
  ];

  const types = [
    { label: t.labs.allCategories, value: '' },
    { label: t.labs.categories.web_app, value: 'web_app' },
    { label: t.labs.categories.pwa, value: 'pwa' },
    { label: t.labs.categories.saas, value: 'saas' },
    { label: t.labs.categories.ecommerce, value: 'ecommerce' },
    { label: t.labs.categories.landing_page, value: 'landing_page' },
  ];

  const popularTags = [
    'photography',
    'retail',
    'analytics',
    'offline-first',
    'booking',
  ];

  return (
    <div className="mb-8 space-y-3.5">
      {/* Search Input */}
      <form onSubmit={handleSearchChange} className="relative w-full">
        <label htmlFor="project-search" className="sr-only">
          {t.labs.searchLabel}
        </label>
        <div className="relative">
          <input
            id="project-search"
            name="search"
            type="search"
            defaultValue={currentSearch}
            placeholder={t.labs.searchPlaceholder}
            className="w-full h-11 pl-10 pr-4 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#FFFEFA] text-[#24251F] placeholder:text-[#686960]/60 focus:border-[#24251F] focus:outline-none transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#686960] pointer-events-none" />
        </div>
      </form>

      {/* 1. Status Filter Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-xs text-[#686960] w-16 shrink-0 font-medium">{t.labs.filterStatus}</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {statuses.map((item) => {
            const isSelected = currentStatus === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => updateFilters('status', item.value || null)}
                className={`touch-target px-3 py-1 text-xs font-mono rounded-md border transition-colors ${
                  isSelected
                    ? 'bg-[#24251F] text-[#FFFEFA] border-[#24251F]'
                    : 'bg-[#FFFEFA] text-[#686960] border-[#E5E1D6] hover:border-[#24251F]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Kategori Filter Row (Stacked Underneath) */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-xs text-[#686960] w-16 shrink-0 font-medium">{t.labs.filterCategory}</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {types.map((item) => {
            const isSelected = currentType === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => updateFilters('type', item.value || null)}
                className={`touch-target px-3 py-1 text-xs font-mono rounded-md border transition-colors ${
                  isSelected
                    ? 'bg-[#24251F] text-[#FFFEFA] border-[#24251F]'
                    : 'bg-[#FFFEFA] text-[#686960] border-[#E5E1D6] hover:border-[#24251F]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Tag Filter Row & Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E5E1D6]/60 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#686960] w-16 shrink-0 font-medium">{t.labs.filterTag}</span>
          {currentTag && (
            <span className="inline-flex items-center gap-1 bg-[#C7E36A] text-[#24251F] px-2.5 py-0.5 rounded font-medium border border-[#24251F]/20">
              #{currentTag}
              <button
                type="button"
                onClick={() => updateFilters('tag', null)}
                className="hover:text-[#B42318] ml-0.5"
                aria-label="Hapus filter tag"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {popularTags.map((tTag) => {
            const isSelected = currentTag.toLowerCase() === tTag.toLowerCase();
            if (isSelected) return null;
            return (
              <button
                key={tTag}
                type="button"
                onClick={() => updateFilters('tag', tTag)}
                className="text-[#686960] hover:text-[#24251F] bg-[#FFFEFA] hover:bg-[#E5E1D6]/50 px-2.5 py-0.5 rounded border border-[#E5E1D6] transition-colors"
              >
                #{tTag}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="touch-target px-2.5 py-1 text-xs font-mono text-[#B42318] hover:bg-[#B42318]/10 rounded-md shrink-0 inline-flex items-center gap-1 ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            {t.labs.resetFilter}
          </button>
        )}
      </div>
    </div>
  );
}
