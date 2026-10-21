import React from 'react';
import Link from 'next/link';
import { getAllPostsAdmin } from '@/lib/data/posts';
import { formatDate } from '@/lib/utils';
import { Plus, Edit, ExternalLink } from 'lucide-react';

export default async function AdminNotesPage() {
  const posts = await getAllPostsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E1D6]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#24251F]">
            Manajemen Catatan (Notes)
          </h1>
          <p className="font-mono text-xs text-[#686960] mt-0.5">
            Kelola technical notes, build log, dan evaluasi arsitektur
          </p>
        </div>

        <Link
          href="/admin/notes/new"
          className="touch-target px-3.5 py-2 rounded-lg bg-[#24251F] text-[#FFFEFA] text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Catatan Baru</span>
        </Link>
      </div>

      {posts.length > 0 ? (
        <>
          {/* Mobile View: Kartu Bertumpuk (< 768px) per PRD Section 12.7 */}
          <div className="md:hidden space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded border ${
                      post.publication_status === 'published'
                        ? 'bg-[#C7E36A] text-[#24251F] border-[#C7E36A]'
                        : post.publication_status === 'archived'
                        ? 'bg-[#E5E1D6] text-[#686960] border-[#E5E1D6]'
                        : 'bg-[#FFFEFA] text-[#686960] border-[#E5E1D6]'
                    }`}
                  >
                    {post.publication_status.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs text-[#686960]">
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-base text-[#24251F]">
                    {post.title}
                  </h3>
                  <p className="font-mono text-xs text-[#686960] mt-0.5">
                    /notes/{post.slug}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono text-[#686960] bg-[#F5F3EC] px-1.5 py-0.5 rounded border border-[#E5E1D6]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E5E1D6] flex items-center justify-end gap-2 text-xs font-mono">
                  <Link
                    href={`/admin/notes/${post.id}/edit`}
                    className="touch-target p-2 text-[#24251F] hover:bg-[#F5F3EC] rounded"
                    title="Edit Catatan"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  {post.publication_status === 'published' && (
                    <Link
                      href={`/notes/${post.slug}`}
                      target="_blank"
                      className="touch-target p-2 text-[#686960] hover:text-[#24251F] rounded"
                      title="Lihat Halaman Publik"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Tabel (≥ 768px) per PRD Section 12.7 */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E5E1D6] bg-[#FFFEFA]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E5E1D6] bg-[#F5F3EC] font-mono text-xs text-[#686960]">
                  <th className="py-3 px-4 font-medium">Judul & Tags</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Tanggal Terbit</th>
                  <th className="py-3 px-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1D6]">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#F5F3EC]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#24251F]">{post.title}</div>
                      <div className="font-mono text-xs text-[#686960]">
                        /notes/{post.slug}
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono text-[#686960] bg-[#F5F3EC] px-1.5 py-0.5 rounded border border-[#E5E1D6]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded border inline-block ${
                          post.publication_status === 'published'
                            ? 'bg-[#C7E36A] text-[#24251F] border-[#C7E36A]'
                            : post.publication_status === 'archived'
                            ? 'bg-[#E5E1D6] text-[#686960] border-[#E5E1D6]'
                            : 'bg-[#FFFEFA] text-[#686960] border-[#E5E1D6]'
                        }`}
                      >
                        {post.publication_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#686960]">
                      {formatDate(post.published_at || post.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {post.publication_status === 'published' && (
                          <Link
                            href={`/notes/${post.slug}`}
                            target="_blank"
                            className="touch-target p-1.5 text-[#686960] hover:text-[#24251F] rounded"
                            title="Lihat Publik"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/notes/${post.id}/edit`}
                          className="touch-target p-1.5 text-[#24251F] hover:bg-[#E5E1D6]/60 rounded"
                          title="Edit Catatan"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-[#E5E1D6] p-12 text-center bg-[#FFFEFA]">
          <p className="font-mono text-sm text-[#686960] mb-3">
            Belum ada catatan yang ditulis.
          </p>
          <Link
            href="/admin/notes/new"
            className="touch-target px-4 py-2 rounded-lg bg-[#24251F] text-[#FFFEFA] text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Catatan Pertama</span>
          </Link>
        </div>
      )}
    </div>
  );
}
