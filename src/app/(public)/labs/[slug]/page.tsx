import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getPublishedProjectSlugs } from '@/lib/data/projects';
import { getRelatedPostsByProject } from '@/lib/data/posts';
import { MaturityBadge } from '@/components/projects/MaturityBadge';
import { BuildLog } from '@/components/projects/BuildLog';
import { MarkdownRenderer } from '@/lib/markdown/renderer';
import { siteConfig } from '@/lib/site-config';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  Mail,
  Layers,
  AlertCircle,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPublishedProjectSlugs();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Proyek Tidak Ditemukan' };

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} | ${siteConfig.name}`,
      description: project.summary,
      images: project.cover_path ? [{ url: project.cover_path }] : undefined,
    },
  };
}

async function ProjectDetailContent({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedPosts = await getRelatedPostsByProject(project.id);

  return (
    <article className="max-w-[740px] mx-auto space-y-10">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="font-mono text-xs text-[#686960] flex items-center gap-2">
        <Link href="/labs" className="hover:text-[#24251F] inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Labs
        </Link>
        <span>/</span>
        <span className="text-[#24251F] truncate">{project.slug}</span>
      </nav>

      {/* 2. Header & Metadata */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <MaturityBadge maturity={project.maturity} />
          <span className="font-mono text-xs text-[#24251F] bg-[#FFFEFA] px-2.5 py-0.5 rounded border border-[#E5E1D6]">
            {project.project_type === 'pwa'
              ? 'PWA'
              : project.project_type === 'saas' || project.project_type === 'saas_candidate'
                ? 'SaaS'
                : project.project_type === 'ecommerce'
                  ? 'E-Commerce'
                  : project.project_type === 'landing_page'
                    ? 'Landing Page'
                    : 'Web App'}
          </span>
          <span className="font-mono text-xs text-[#686960]">
            Terbit: {formatDate(project.published_at || project.created_at)}
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

      {/* 3. Action CTAs according to Project Type & Availability (PRD Section 7) */}
      <div className="rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Demo Button if available */}
          {project.demo_url ? (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-4 py-2 rounded-lg bg-[#24251F] text-[#FFFEFA] text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span>Coba Demo Langsung</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <span className="font-mono text-xs text-[#686960] bg-[#F5F3EC] px-3 py-2 rounded-lg border border-[#E5E1D6]">
              Demo publik belum dibuka untuk tingkat {project.maturity}.
            </span>
          )}

          {/* GitHub Source Link if available */}
          {project.source_url && (
            <a
              href={project.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-4 py-2 rounded-lg border border-[#E5E1D6] text-[#24251F] text-sm font-medium inline-flex items-center gap-2 hover:bg-[#F5F3EC] transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>Source Code</span>
            </a>
          )}

          {/* WhatsApp Direct Inquiry Link */}
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
              <span>Tertarik? Chat WA</span>
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
              Tanya Penyesuaian
            </a>
          )}
          {project.project_type === 'saas_candidate' && siteConfig.links.email && (
            <a
              href={`mailto:${siteConfig.links.email}?subject=Masukan%20Proyek%20${encodeURIComponent(
                project.title
              )}`}
              className="text-[#24251F] hover:underline inline-flex items-center gap-1.5 font-medium"
            >
              <Mail className="w-4 h-4 text-[#686960]" />
              Kirim Masukan
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
            <span>Masalah yang Diselesaikan</span>
          </div>
          <div className="p-5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] text-[#24251F] leading-relaxed">
            {project.problem}
          </div>
        </section>
      )}

      {/* 6. Technical Content (Markdown) */}
      {project.content && (
        <section className="space-y-4">
          <MarkdownRenderer content={project.content} />
        </section>
      )}

      {/* 7. Key Features */}
      {project.features && project.features.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-[#24251F]">
            Fitur Utama
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
            <span>Tech Stack & Tools</span>
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
            Batasan & Ruang Lingkup Saat Ini
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

      {/* 11. Related Notes from this project */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="pt-8 border-t border-[#E5E1D6] space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#686960]" />
            <h3 className="font-semibold text-lg text-[#24251F]">
              Catatan Terkait Proyek Ini
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

function ProjectDetailSkeleton() {
  return (
    <div className="max-w-[740px] mx-auto space-y-8 animate-pulse">
      <div className="h-4 w-24 bg-[#E5E1D6]/70 rounded" />
      <div className="space-y-4">
        <div className="h-5 w-32 bg-[#E5E1D6]/70 rounded" />
        <div className="h-10 w-3/4 bg-[#E5E1D6] rounded-lg" />
        <div className="h-16 w-full bg-[#E5E1D6]/50 rounded-lg" />
      </div>
      <div className="aspect-video w-full rounded-xl bg-[#E5E1D6]/40" />
      <div className="space-y-3 pt-4">
        <div className="h-4 w-full bg-[#E5E1D6]/60 rounded" />
        <div className="h-4 w-5/6 bg-[#E5E1D6]/60 rounded" />
      </div>
    </div>
  );
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailContent params={params} />
    </Suspense>
  );
}
