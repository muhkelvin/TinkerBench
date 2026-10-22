import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPosts } from '@/lib/data/posts';
import { PostCard } from '@/components/notes/PostCard';
import { PenTool, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Notes — Jurnal Proses & Keputusan Teknis',
  description:
    'Dokumentasi proses, eksperimen arsitektur, dan pembelajaran saat membangun produk digital di Tinkerbench Labs.',
};

import { NotesHeader, NotesList } from '@/components/notes/NotesView';

interface NotesPageProps {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    page?: string;
  }>;
}

async function NotesContent({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const { posts, total } = await getPublishedPosts({
    page: currentPage,
    pageSize: 10,
    search: params.q,
    tag: params.tag,
  });

  return (
    <NotesList
      posts={posts}
      total={total}
      currentPage={currentPage}
      query={params.q}
      tag={params.tag}
    />
  );
}

export default function NotesPage({ searchParams }: NotesPageProps) {
  return (
    <div className="space-y-8 max-w-[740px] mx-auto">
      {/* Page Header */}
      <NotesHeader />

      {/* Dynamic Content wrapped in Suspense for Next.js 16 PPR */}
      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="h-11 bg-[#E5E1D6]/30 animate-pulse rounded-lg" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] animate-pulse" />
            ))}
          </div>
        }
      >
        <NotesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
