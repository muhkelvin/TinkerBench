'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Post, Project } from '@/types/database.types';
import { MarkdownRenderer } from '@/lib/markdown/renderer';
import { formatDate, estimateReadingTime } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/context';
import { localizePost, localizeProject } from '@/lib/i18n/project-translations';
import { ArrowLeft, Clock, FolderGit2, BookOpen } from 'lucide-react';

interface NoteDetailViewProps {
  post: Post;
  relatedProjects: Project[];
  siblingNotes: Array<{ id: string; title: string; slug: string; published_at: string | null }>;
}

export function NoteDetailView({
  post: rawPost,
  relatedProjects: rawProjects,
  siblingNotes: rawSiblings,
}: NoteDetailViewProps) {
  const { locale, t } = useLanguage();
  const post = localizePost(rawPost, locale);
  const relatedProjects = rawProjects.map((p) => localizeProject(p, locale));
  const siblingNotes = rawSiblings.map((s) => ({
    ...s,
    title: (localizePost({ ...s, content: '', excerpt: '', tags: [], publication_status: 'published', created_at: s.published_at || '', updated_at: s.published_at || '', cover_path: null, cover_alt: null, seo_title: null, seo_description: null } as Post, locale)).title,
  }));

  const readingTime = estimateReadingTime(post.content);

  return (
    <article className="max-w-[740px] mx-auto space-y-8">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="font-mono text-xs text-[#686960] flex items-center gap-2">
        <Link href="/notes" className="hover:text-[#24251F] inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          {t.noteDetail.breadcrumbNotes}
        </Link>
        <span>/</span>
        <span className="text-[#24251F] truncate">{post.slug}</span>
      </nav>

      {/* 2. Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#686960]">
          <time dateTime={post.published_at || post.created_at}>
            {formatDate(post.published_at || post.created_at)}
          </time>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readingTime} {t.noteDetail.minRead}
          </span>
          {post.updated_at && post.updated_at !== post.published_at && (
            <>
              <span>·</span>
              <span className="text-[11px] text-[#686960]/80">
                ({t.noteDetail.updatedOn} {formatDate(post.updated_at)})
              </span>
            </>
          )}
        </div>

        <h1 className="h1-fluid text-[#24251F]">
          {post.title}
        </h1>

        <p className="text-lg text-[#686960] leading-relaxed italic border-l-2 border-[#C7E36A] pl-4">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs text-[#686960] bg-[#FFFEFA] border border-[#E5E1D6] px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 3. Cover Image if provided */}
      {post.cover_path && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#E5E1D6] bg-[#FFFEFA]">
          <Image
            src={post.cover_path}
            alt={post.cover_alt || post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 740px"
            className="object-cover"
          />
        </div>
      )}

      {/* 4. Associated Projects Link Banner */}
      {relatedProjects.length > 0 && (
        <aside className="rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FolderGit2 className="w-4 h-4 text-[#24251F]" />
            <div>
              <div className="font-mono text-xs text-[#686960]">{t.noteDetail.relatedProject}</div>
              <div className="font-medium text-sm text-[#24251F]">
                {relatedProjects.map((p) => p.title).join(', ')}
              </div>
            </div>
          </div>
          <Link
            href={`/labs/${relatedProjects[0]?.slug}`}
            className="touch-target px-3.5 py-1.5 rounded-lg border border-[#E5E1D6] hover:bg-[#F5F3EC] text-xs font-mono text-[#24251F] shrink-0"
          >
            {t.noteDetail.openLab}
          </Link>
        </aside>
      )}

      {/* 5. Main Markdown Content */}
      <section className="p-6 sm:p-10 rounded-2xl border border-[#E5E1D6] bg-[#FFFEFA] shadow-sm">
        <MarkdownRenderer content={post.content} />
      </section>

      {/* 6. Sibling Notes from the same project */}
      {siblingNotes.length > 0 && (
        <section className="pt-8 border-t border-[#E5E1D6] space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#686960]" />
            <h3 className="font-semibold text-lg text-[#24251F]">
              {t.noteDetail.otherNotes}
            </h3>
          </div>
          <div className="space-y-3">
            {siblingNotes.map((item) => (
              <Link
                key={item.id}
                href={`/notes/${item.slug}`}
                className="block p-4 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] hover:border-[#24251F]/40 transition-colors"
              >
                <div className="font-mono text-xs text-[#686960] mb-1">
                  {formatDate(item.published_at)}
                </div>
                <h4 className="font-medium text-[#24251F] hover:underline">
                  {item.title}
                </h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
