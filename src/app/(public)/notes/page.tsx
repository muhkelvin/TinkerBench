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

  const totalPages = Math.ceil(total / 10);

  return (
    <>
      {/* Search Input */}
      <form method="GET" action="/notes" className="relative w-full mb-8">
        <label htmlFor="notes-search" className="sr-only">
          Cari catatan
        </label>
        <div className="relative">
          <input
            id="notes-search"
            name="q"
            type="search"
            defaultValue={params.q || ''}
            placeholder="Cari topik teknis atau catatan build log..."
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
              <div>
                Halaman {currentPage} dari {totalPages}
              </div>
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/notes?page=${currentPage - 1}${params.q ? `&q=${params.q}` : ''}`}
                    className="touch-target px-3 py-1.5 rounded border border-[#E5E1D6] hover:bg-[#FFFEFA] text-[#24251F]"
                  >
                    ← Sebelumnya
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={`/notes?page=${currentPage + 1}${params.q ? `&q=${params.q}` : ''}`}
                    className="touch-target px-3 py-1.5 rounded border border-[#E5E1D6] hover:bg-[#FFFEFA] text-[#24251F]"
                  >
                    Selanjutnya →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#E5E1D6] p-12 text-center bg-[#FFFEFA]">
          <p className="font-mono text-sm text-[#686960] mb-2">
            Belum ada catatan yang sesuai dengan pencarian Anda.
          </p>
          <p className="text-xs text-[#686960] mb-4">
            Lihat prototipe dan proyek yang sedang kami kerjakan di direktori Labs.
          </p>
          <Link
            href="/labs"
            className="touch-target inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#24251F] text-[#FFFEFA] text-xs font-medium"
          >
            Buka Direktori Labs →
          </Link>
        </div>
      )}
    </>
  );
}

export default function NotesPage({ searchParams }: NotesPageProps) {
  return (
    <div className="space-y-8 max-w-[740px] mx-auto">
      {/* Page Header Static Shell */}
      <div>
        <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#686960] mb-2 uppercase">
          <PenTool className="w-3.5 h-3.5" />
          <span>Jurnal & Catatan Teknis</span>
        </div>
        <h1 className="h1-fluid text-[#24251F] mb-3">Notes</h1>
        <p className="text-[#686960] leading-relaxed">
          Catatan langsung dari proses pengerjaan: mengapa suatu teknologi dipilih, trade-off arsitektur, kegagalan eksperimen, dan rilis progres terkini.
        </p>
      </div>

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
