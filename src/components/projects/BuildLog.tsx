import React from 'react';
import type { BuildLogEntry } from '@/types/database.types';
import { formatDate } from '@/lib/utils';
import { GitCommit } from 'lucide-react';

interface BuildLogProps {
  entries: BuildLogEntry[];
}

export function BuildLog({ entries }: BuildLogProps) {
  if (!entries || entries.length === 0) return null;

  return (
    <section className="my-8 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E5E1D6]">
        <GitCommit className="w-4 h-4 text-[#686960]" />
        <h3 className="font-mono text-sm font-semibold tracking-tight text-[#24251F] uppercase">
          Build Log — Catatan Perubahan
        </h3>
      </div>

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className="font-mono text-xs text-[#686960] shrink-0 sm:w-28">
              {formatDate(entry.date)}
            </span>
            <p className="text-sm text-[#24251F] leading-relaxed [overflow-wrap:anywhere]">
              {entry.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
