'use client';

import React from 'react';
import { FolderGit2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export function LabsHeader() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl">
      <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#686960] mb-2 uppercase">
        <FolderGit2 className="w-3.5 h-3.5" />
        <span>{t.labs.badge}</span>
      </div>
      <h1 className="h1-fluid text-[#24251F] mb-3">{t.labs.title}</h1>
      <p className="text-[#686960] leading-relaxed">
        {t.labs.description}
      </p>
    </div>
  );
}

export function LabsEmptyState() {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-dashed border-[#E5E1D6] p-12 text-center bg-[#FFFEFA]">
      <p className="font-mono text-sm text-[#686960] mb-2">
        {t.labs.noProjects}
      </p>
      <p className="text-xs text-[#686960]">
        {t.labs.noProjectsSub}
      </p>
    </div>
  );
}
