'use client';

import React from 'react';
import Link from 'next/link';
import { PenTool, Search } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import type { Post } from '@/types/database.types';
import { PostCard } from '@/components/notes/PostCard';

export function NotesHeader() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#686960] mb-2 uppercase">
        <PenTool className="w-3.5 h-3.5" />
        <span>{t.notes.badge}</span>
      </div>
      <h1 className="h1-fluid text-[#24251F] mb-3">{t.notes.title}</h1>
      <p className="text-[#686960] leading-relaxed">
        {t.notes.description}
      </p>
    </div>
  );
}

interface NotesListProps {
  posts: Post[];
  total: number;
  currentPage: number;
  query?: string;
  tag?: string;
}

export function NotesList({ posts, total, currentPage, query = '' }: NotesListProps) {
  const { t } = useTranslation();
  const totalPages = Math.ceil(total / 10);

  const pageOfText = t.notes.pageOf
    .replace('{current}', String(currentPage))
    .replace('{total}', String(totalPages));

  return (
    <>
      {/* Search Input */}
      <form method="GET" action="/notes" className="relative w-full mb-8">
        <label htmlFor="notes-search" className="sr-only">
          {t.notes.searchLabel}
        </label>
        <div className="relative">
          <input
            id="notes-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder={t.notes.searchPlaceholder}
            className="w-full h-11 pl-10 pr-4 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#FFFEFA] text-[#24251F] placeholder:text-[#686960]/60 focus:border-[#24251F] focus:outline-none transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#686960] pointer-events-none" />
        </div>
      </form>

      {/* Notes List */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Simple Pagination */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-[#E5E1D6] flex items-center justify-between font-mono text-xs text-[#686960]">
              <div>{pageOfText}</div>
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/notes?page=${currentPage - 1}${query ? `&q=${query}` : ''}`}
                    className="touch-target px-3 py-1.5 rounded border border-[#E5E1D6] hover:bg-[#FFFEFA] text-[#24251F]"
                  >
                    {t.notes.prevPage}
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={`/notes?page=${currentPage + 1}${query ? `&q=${query}` : ''}`}
                    className="touch-target px-3 py-1.5 rounded border border-[#E5E1D6] hover:bg-[#FFFEFA] text-[#24251F]"
                  >
                    {t.notes.nextPage}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#E5E1D6] p-12 text-center bg-[#FFFEFA]">
          <p className="font-mono text-sm text-[#686960] mb-2">
            {t.notes.noNotes}
          </p>
          <p className="text-xs text-[#686960] mb-4">
            {t.notes.noNotesSub}
          </p>
          <Link
            href="/labs"
            className="touch-target inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#24251F] text-[#FFFEFA] text-xs font-medium"
          >
            {t.notes.openLabsBtn}
          </Link>
        </div>
      )}
    </>
  );
}
