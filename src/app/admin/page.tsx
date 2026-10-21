import React from 'react';
import Link from 'next/link';
import { getAllProjectsAdmin } from '@/lib/data/projects';
import { getAllPostsAdmin } from '@/lib/data/posts';
import { formatDate } from '@/lib/utils';
import { Plus, FolderGit2, PenTool, ExternalLink, ArrowRight } from 'lucide-react';

export default async function AdminDashboardPage() {
  const [projects, posts] = await Promise.all([
    getAllProjectsAdmin(),
    getAllPostsAdmin(),
  ]);

  // Compute metrics from database
  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.publication_status === 'published').length;
  const draftProjects = projects.filter((p) => p.publication_status === 'draft').length;

  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.publication_status === 'published').length;
  const draftPosts = posts.filter((p) => p.publication_status === 'draft').length;

  // Recent updates (combined projects and posts)
  const recentActivities = [
    ...projects.map((p) => ({
      id: p.id,
      title: p.title,
      type: 'Project' as const,
      status: p.publication_status,
      updated_at: p.updated_at,
      editUrl: `/admin/projects/${p.id}/edit`,
    })),
    ...posts.map((p) => ({
      id: p.id,
      title: p.title,
      type: 'Note' as const,
      status: p.publication_status,
      updated_at: p.updated_at,
      editUrl: `/admin/notes/${p.id}/edit`,
    })),
  ]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Header & Fast Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E1D6]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#24251F]">
            Admin Dashboard
          </h1>
          <p className="font-mono text-xs text-[#686960] mt-0.5">
            Ringkasan status proyek dan publikasi catatan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="touch-target px-3.5 py-2 rounded-lg bg-[#24251F] text-[#FFFEFA] text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Proyek</span>
          </Link>
          <Link
            href="/admin/notes/new"
            className="touch-target px-3.5 py-2 rounded-lg border border-[#E5E1D6] bg-[#FFFEFA] text-[#24251F] text-xs font-medium inline-flex items-center gap-1.5 hover:bg-[#F5F3EC] transition-colors"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Tulis Catatan</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards (PRD Section 8.2: Semua angka dihitung dari database, tanpa grafik) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-[#686960]">Total Proyek</span>
            <FolderGit2 className="w-4 h-4 text-[#686960]" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#24251F]">
            {totalProjects}
          </div>
          <div className="mt-2 text-xs font-mono text-[#686960] flex gap-2">
            <span>{publishedProjects} Terbit</span>
            <span>·</span>
            <span>{draftProjects} Draft</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-[#686960]">Proyek Terbit</span>
            <span className="w-2 h-2 rounded-full bg-[#C7E36A] border border-[#24251F]/30" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#24251F]">
            {publishedProjects}
          </div>
          <div className="mt-2 text-xs font-mono text-[#686960]">
            Aktif di direktori /labs
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-[#686960]">Total Catatan</span>
            <PenTool className="w-4 h-4 text-[#686960]" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#24251F]">
            {totalPosts}
          </div>
          <div className="mt-2 text-xs font-mono text-[#686960] flex gap-2">
            <span>{publishedPosts} Terbit</span>
            <span>·</span>
            <span>{draftPosts} Draft</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-[#686960]">Catatan Terbit</span>
            <span className="w-2 h-2 rounded-full bg-[#C7E36A] border border-[#24251F]/30" />
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#24251F]">
            {publishedPosts}
          </div>
          <div className="mt-2 text-xs font-mono text-[#686960]">
            Aktif di halaman /notes
          </div>
        </div>
      </div>

      {/* Recent Updates Table / List */}
      <section className="rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E1D6]">
          <h2 className="font-semibold text-base text-[#24251F]">
            Aktivitas Terakhir Diubah
          </h2>
          <span className="font-mono text-xs text-[#686960]">5 Terkini</span>
        </div>

        {recentActivities.length > 0 ? (
          <div className="divide-y divide-[#E5E1D6]">
            {recentActivities.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] bg-[#F5F3EC] px-1.5 py-0.5 rounded border border-[#E5E1D6] text-[#686960]">
                      {item.type}
                    </span>
                    <span
                      className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                        item.status === 'published'
                          ? 'bg-[#C7E36A] text-[#24251F]'
                          : 'bg-[#E5E1D6]/70 text-[#686960]'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-[#686960]">
                      {formatDate(item.updated_at)}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-[#24251F]">
                    {item.title}
                  </h3>
                </div>

                <Link
                  href={item.editUrl}
                  className="touch-target font-mono text-xs text-[#24251F] hover:underline inline-flex items-center gap-1 shrink-0 self-start sm:self-auto"
                >
                  <span>Edit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm font-mono text-[#686960]">Belum ada aktivitas.</p>
        )}
      </section>
    </div>
  );
}
