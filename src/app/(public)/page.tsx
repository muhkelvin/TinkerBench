import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { getFeaturedProjects } from '@/lib/data/projects';
import { getRecentPosts } from '@/lib/data/posts';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { PostCard } from '@/components/notes/PostCard';

export const metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default async function HomePage() {
  const [featuredProjects, recentNotes] = await Promise.all([
    getFeaturedProjects(),
    getRecentPosts(),
  ]);

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* 1. Concise Editorial Hero */}
      <section className="pt-2 sm:pt-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-[#24251F] bg-[#C7E36A] px-2.5 py-1 rounded border border-[#24251F]/20 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#24251F]" />
          <span>INDIE SOFTWARE LAB</span>
        </div>
        <h1 className="h1-fluid text-[#24251F] mb-4">
          {siteConfig.tagline}
        </h1>
        <p className="text-base sm:text-lg text-[#686960] leading-relaxed">
          {siteConfig.description}
        </p>
      </section>

      {/* 2. Selected Projects (Maks 3) */}
      {featuredProjects.length > 0 && (
        <section aria-labelledby="featured-projects-heading">
          <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-[#E5E1D6]">
            <div>
              <h2 id="featured-projects-heading" className="text-xl font-semibold tracking-tight text-[#24251F]">
                Selected Projects
              </h2>
              <p className="font-mono text-xs text-[#686960] mt-0.5">
                Eksperimen, prototipe, dan produk digital aktif
              </p>
            </div>
            <Link
              href="/labs"
              className="touch-target font-mono text-xs text-[#24251F] hover:underline flex items-center gap-1 group"
            >
              Lihat semua ({featuredProjects.length}+)
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Recent Notes (Maks 3) */}
      {recentNotes.length > 0 && (
        <section aria-labelledby="recent-notes-heading">
          <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-[#E5E1D6]">
            <div>
              <h2 id="recent-notes-heading" className="text-xl font-semibold tracking-tight text-[#24251F]">
                Recent Notes & Logs
              </h2>
              <p className="font-mono text-xs text-[#686960] mt-0.5">
                Dokumentasi keputusan teknis, arsitektur, dan pembelajaran
              </p>
            </div>
            <Link
              href="/notes"
              className="touch-target font-mono text-xs text-[#24251F] hover:underline flex items-center gap-1 group"
            >
              Semua catatan
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentNotes.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Philosophy Note */}
      <section className="rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-6 sm:p-8 max-w-3xl">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#686960] mb-2">
          Prinsip Kerja — The Tinkerbench Method
        </h3>
        <p className="text-[#24251F] text-base leading-relaxed">
          Urutan prioritas di Tinkerbench tidak pernah dibalik: <strong>bangun satu proyek nyata → uji dengan kondisi sebenarnya → dokumentasikan prosesnya → publikasikan</strong>. Bukan etalase klaim tanpa kode yang berjalan.
        </p>
        <div className="mt-4 pt-4 border-t border-[#E5E1D6] flex items-center gap-4 text-xs font-mono text-[#686960]">
          <Link href="/about" className="hover:text-[#24251F] underline underline-offset-4">
            Baca selengkapnya tentang lab →
          </Link>
        </div>
      </section>
    </div>
  );
}
