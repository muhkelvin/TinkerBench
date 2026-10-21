import React from 'react';
import type { Maturity } from '@/types/database.types';

interface MaturityBadgeProps {
  maturity: Maturity;
  className?: string;
}

export function MaturityBadge({ maturity, className = '' }: MaturityBadgeProps) {
  const isProduction = maturity === 'production';

  const labels: Record<Maturity, string> = {
    concept: 'CONCEPT',
    production: 'PRODUCTION',
  };

  return (
    <span
      className={`font-mono text-[12px] font-medium tracking-tight px-2 py-0.5 rounded border inline-flex items-center gap-1.5 uppercase ${
        isProduction
          ? 'bg-[#C7E36A] text-[#24251F] border-[#C7E36A]'
          : 'bg-[#EAE6DB] text-[#24251F] border-[#D9D4C7]'
      } ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isProduction ? 'bg-[#24251F]' : 'bg-[#686960]'
        }`}
      />
      {labels[maturity] || maturity}
    </span>
  );
}
