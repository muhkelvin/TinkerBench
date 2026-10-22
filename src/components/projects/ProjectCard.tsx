'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types/database.types';
import { MaturityBadge } from './MaturityBadge';
import { useLanguage } from '@/lib/i18n/context';
import { localizeProject } from '@/lib/i18n/project-translations';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project: rawProject }: ProjectCardProps) {
  const { locale, t } = useLanguage();
  const project = localizeProject(rawProject, locale);

  const typeLabels: Record<string, string> = {
    web_app: t.labs.categories.web_app || 'Web App',
    pwa: t.labs.categories.pwa || 'PWA',
    saas: t.labs.categories.saas || 'SaaS',
    ecommerce: t.labs.categories.ecommerce || 'E-Commerce',
    landing_page: t.labs.categories.landing_page || 'Landing Page',
    portfolio: t.labs.categories.web_app || 'Web App',
    customizable: t.labs.categories.web_app || 'Web App',
    saas_candidate: t.labs.categories.saas || 'SaaS',
  };

  const projectTypeLabel = typeLabels[project.project_type] || 'Web App';

  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 sm:p-6 transition-all duration-200 hover:border-[#24251F]/40 hover:shadow-sm">
      <div>
        {/* Cover Image if available */}
        {project.cover_path && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#E5E1D6] mb-4 bg-[#F5F3EC]">
            <Image
              src={project.cover_path}
              alt={project.cover_alt || project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <MaturityBadge maturity={project.maturity} />
          <span className="font-mono text-xs text-[#24251F] bg-[#F5F3EC] px-2.5 py-0.5 rounded border border-[#E5E1D6]">
            {projectTypeLabel}
          </span>
        </div>

        {/* Title & Link */}
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[#24251F] group-hover:text-[#24251F]">
          <Link
            href={`/labs/${project.slug}`}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24251F] rounded"
          >
            <span className="absolute inset-0" aria-hidden="true" />
            {project.title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="mt-2 text-sm text-[#686960] line-clamp-3 leading-relaxed">
          {project.summary}
        </p>
      </div>

      {/* Footer Tags & Arrow */}
      <div className="mt-5 pt-4 border-t border-[#E5E1D6] flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
          {project.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/labs?tag=${encodeURIComponent(tag)}`}
              className="relative z-10 font-mono text-[11px] text-[#686960] hover:text-[#24251F] bg-[#F5F3EC] hover:bg-[#E5E1D6] px-2 py-0.5 rounded border border-[#E5E1D6] transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <div className="text-[#686960] group-hover:text-[#24251F] transition-colors shrink-0">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </article>
  );
}
