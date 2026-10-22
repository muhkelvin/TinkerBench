'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Project, Post } from '@/types/database.types';
import { MaturityBadge } from '@/components/projects/MaturityBadge';
import { BuildLog } from '@/components/projects/BuildLog';
import { MarkdownRenderer } from '@/lib/markdown/renderer';
import { siteConfig } from '@/lib/site-config';
import { formatDate } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/context';
import { localizeProject, localizePost } from '@/lib/i18n/project-translations';
import {
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  Mail,
  Layers,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Code2,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';

interface ProjectDetailViewProps {
  project: Project;
  relatedPosts: Post[];
}

export function ProjectDetailView({ project: rawProject, relatedPosts: rawPosts }: ProjectDetailViewProps) {
  const { locale, t } = useLanguage();
  const project = localizeProject(rawProject, locale);
  const relatedPosts = rawPosts.map((p) => localizePost(p, locale));

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
    <article className="max-w-[740px] mx-auto space-y-10">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="font-mono text-xs text-[#686960] flex items-center gap-2">
        <Link href="/labs" className="hover:text-[#24251F] inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          {t.projectDetail.breadcrumbLabs}
        </Link>
        <span>/</span>
        <span className="text-[#24251F] truncate">{project.slug}</span>
      </nav>

      {/* 2. Header & Metadata */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <MaturityBadge maturity={project.maturity} />
          <span className="font-mono text-xs text-[#24251F] bg-[#FFFEFA] px-2.5 py-0.5 rounded border border-[#E5E1D6]">
            {projectTypeLabel}
          </span>
          <span className="font-mono text-xs text-[#686960]">
            {t.projectDetail.publishedOn} {formatDate(project.published_at || project.created_at)}
          </span>
        </div>

        <h1 className="h1-fluid text-[#24251F]">
          {project.title}
        </h1>

        <p className="text-lg text-[#686960] leading-relaxed">
          {project.summary}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.tags.map((tag) => (
              <Link
                key={tag}
                href={`/labs?tag=${encodeURIComponent(tag)}`}
                className="font-mono text-xs text-[#686960] hover:text-[#24251F] bg-[#FFFEFA] hover:bg-[#E5E1D6]/60 border border-[#E5E1D6] px-2 py-0.5 rounded transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 3. Action CTAs */}
      <div className="rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {project.demo_url ? (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-4 py-2 rounded-lg bg-[#24251F] text-[#FFFEFA] text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span>{t.projectDetail.tryDemo}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <span className="font-mono text-xs text-[#686960] bg-[#F5F3EC] px-3 py-2 rounded-lg border border-[#E5E1D6]">
              {t.projectDetail.demoUnavailable} {project.maturity}.
            </span>
          )}

          {project.source_url && (
            <a
              href={project.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-4 py-2 rounded-lg border border-[#E5E1D6] text-[#24251F] text-sm font-medium inline-flex items-center gap-2 hover:bg-[#F5F3EC] transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>{t.projectDetail.sourceCode}</span>
            </a>
          )}

          {siteConfig.links.whatsapp && (
            <a
              href={`${siteConfig.links.whatsapp}?text=Halo,%20saya%20tertarik%20dengan%20proyek%20${encodeURIComponent(
                project.title
              )}%20di%20Tinkerbench`}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-4 py-2 rounded-lg border border-[#E5E1D6] bg-[#FFFEFA] hover:bg-[#F5F3EC] text-[#24251F] text-sm font-medium inline-flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#24251F]" />
              <span>{t.projectDetail.chatWa}</span>
            </a>
          )}
        </div>

        {/* Tailored CTAs */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {project.project_type === 'customizable' && siteConfig.links.whatsapp && (
            <a
              href={`${siteConfig.links.whatsapp}?text=Halo,%20saya%20tertarik%20dengan%20proyek%20${encodeURIComponent(
                project.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#24251F] hover:underline inline-flex items-center gap-1.5 font-medium"
            >
              <MessageCircle className="w-4 h-4 text-[#C7E36A] fill-[#24251F]" />
              {t.projectDetail.askCustomize}
            </a>
          )}
          {project.project_type === 'saas_candidate' && siteConfig.links.email && (
            <a
              href={`mailto:${siteConfig.links.email}?subject=Feedback%20Project%20${encodeURIComponent(
                project.title
              )}`}
              className="text-[#24251F] hover:underline inline-flex items-center gap-1.5 font-medium"
            >
              <Mail className="w-4 h-4 text-[#686960]" />
              {t.projectDetail.sendFeedback}
            </a>
          )}
        </div>
      </div>

      {/* 4. Cover / Screenshot */}
      {project.cover_path && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#E5E1D6] bg-[#FFFEFA]">
          <Image
            src={project.cover_path}
            alt={project.cover_alt || project.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 740px"
            className="object-cover"
          />
        </div>
      )}

      {/* 5. Problem Statement */}
      {project.problem && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#686960]">
            <AlertCircle className="w-4 h-4 text-[#B42318]" />
            <span>{t.projectDetail.problemSolved}</span>
          </div>
          <div className="p-5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] text-[#24251F] leading-relaxed">
            {project.problem}
          </div>
        </section>
      )}

      {/* 6. Technical Content (Markdown) */}
      {project.content && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#686960]">
            <Code2 className="w-4 h-4 text-[#24251F]" />
            <span>{t.projectDetail.techDetails}</span>
          </div>
          <div className="p-6 sm:p-8 rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] shadow-sm">
            <MarkdownRenderer content={project.content} />
          </div>
        </section>
      )}

      {/* 7. Key Features */}
      {project.features && project.features.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-[#24251F]">
            {t.projectDetail.keyFeatures}
          </h2>
          <ul className="space-y-2.5">
            {project.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-[#24251F] bg-[#FFFEFA] p-3.5 rounded-lg border border-[#E5E1D6]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#24251F] shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 8. Tech Stack */}
      {project.tech_stack && project.tech_stack.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#686960]">
            <Layers className="w-4 h-4" />
            <span>{t.projectDetail.techStack}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs bg-[#FFFEFA] text-[#24251F] px-3 py-1.5 rounded-lg border border-[#E5E1D6]"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 9. Limitations */}
      {project.limitations && (
        <section className="space-y-2 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-5">
          <h3 className="font-mono text-xs font-semibold uppercase text-[#686960]">
            {t.projectDetail.currentLimitations}
          </h3>
          <p className="text-sm text-[#686960] leading-relaxed">
            {project.limitations}
          </p>
        </section>
      )}

      {/* 10. Build Log */}
      {project.build_log && project.build_log.length > 0 && (
        <BuildLog entries={project.build_log} />
      )}

      {/* 11. Related Notes */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="pt-8 border-t border-[#E5E1D6] space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#686960]" />
            <h3 className="font-semibold text-lg text-[#24251F]">
              {t.projectDetail.relatedNotes}
            </h3>
          </div>
          <div className="space-y-3">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/notes/${post.slug}`}
                className="block p-4 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:border-[#24251F]/40 transition-colors"
              >
                <div className="font-mono text-xs text-[#686960] mb-1">
                  {formatDate(post.published_at || post.created_at)}
                </div>
                <h4 className="font-medium text-[#24251F] hover:underline">
                  {post.title}
                </h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
