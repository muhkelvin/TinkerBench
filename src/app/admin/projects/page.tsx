import React from 'react';
import Link from 'next/link';
import { getAllProjectsAdmin } from '@/lib/data/projects';
import { formatDate } from '@/lib/utils';
import { Plus, Edit, Archive, Trash2, ExternalLink } from 'lucide-react';
import { archiveProject, deleteProject } from '@/actions/projects';

export const instant = false;

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E1D6]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#24251F]">
            Manajemen Proyek
          </h1>
          <p className="font-mono text-xs text-[#686960] mt-0.5">
            Daftar lengkap seluruh karya, prototipe, dan rilis beta
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="touch-target px-3.5 py-2 rounded-lg bg-[#24251F] text-[#FFFEFA] text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek Baru</span>
        </Link>
      </div>

      {projects.length > 0 ? (
        <>
          {/* Mobile view: Kartu Bertumpuk (< 768px) per PRD Section 12.7 */}
          <div className="md:hidden space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded border ${
                      project.publication_status === 'published'
                        ? 'bg-[#C7E36A] text-[#24251F] border-[#C7E36A]'
                        : project.publication_status === 'archived'
                        ? 'bg-[#E5E1D6] text-[#686960] border-[#E5E1D6]'
                        : 'bg-[#FFFEFA] text-[#686960] border-[#E5E1D6]'
                    }`}
                  >
                    {project.publication_status.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs text-[#686960] uppercase">
                    {project.maturity}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-base text-[#24251F]">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap font-mono text-xs text-[#686960] mt-0.5">
                    <span>/labs/{project.slug}</span>
                    {project.project_type && (
                      <span className="px-1.5 py-0.5 rounded bg-[#E5E1D6] text-[#24251F] text-[10px] uppercase font-mono">
                        {project.project_type.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tags.map((t) => (
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

                <div className="pt-2 border-t border-[#E5E1D6] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#686960]">
                    Update: {formatDate(project.updated_at)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="touch-target p-2 text-[#24251F] hover:bg-[#F5F3EC] rounded"
                      title="Edit Proyek"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    {project.publication_status === 'published' && (
                      <Link
                        href={`/labs/${project.slug}`}
                        target="_blank"
                        className="touch-target p-2 text-[#686960] hover:text-[#24251F] rounded"
                        title="Lihat Halaman Publik"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view: Tabel (≥ 768px) per PRD Section 12.7 */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E5E1D6] bg-[#FFFEFA]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E5E1D6] bg-[#F5F3EC] font-mono text-xs text-[#686960]">
                  <th className="py-3 px-4 font-medium">Judul & Tags</th>
                  <th className="py-3 px-4 font-medium">Maturity</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Terakhir Diubah</th>
                  <th className="py-3 px-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1D6]">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-[#F5F3EC]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#24251F]">{project.title}</div>
                      <div className="flex items-center gap-2 flex-wrap font-mono text-xs text-[#686960] mt-0.5">
                        <span>/labs/{project.slug}</span>
                        {project.project_type && (
                          <span className="px-1.5 py-0.5 rounded bg-[#E5E1D6]/70 text-[#24251F] text-[10px] uppercase font-mono">
                            {project.project_type.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {project.tags.map((t) => (
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
                      <span className="font-mono text-xs uppercase text-[#24251F]">
                        {project.maturity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded border inline-block ${
                          project.publication_status === 'published'
                            ? 'bg-[#C7E36A] text-[#24251F] border-[#C7E36A]'
                            : project.publication_status === 'archived'
                            ? 'bg-[#E5E1D6] text-[#686960] border-[#E5E1D6]'
                            : 'bg-[#FFFEFA] text-[#686960] border-[#E5E1D6]'
                        }`}
                      >
                        {project.publication_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#686960]">
                      {formatDate(project.updated_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {project.publication_status === 'published' && (
                          <Link
                            href={`/labs/${project.slug}`}
                            target="_blank"
                            className="touch-target p-1.5 text-[#686960] hover:text-[#24251F] rounded"
                            title="Lihat Publik"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="touch-target p-1.5 text-[#24251F] hover:bg-[#E5E1D6]/60 rounded"
                          title="Edit Proyek"
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
            Belum ada proyek yang dibuat.
          </p>
          <Link
            href="/admin/projects/new"
            className="touch-target px-4 py-2 rounded-lg bg-[#24251F] text-[#FFFEFA] text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Proyek Pertama</span>
          </Link>
        </div>
      )}
    </div>
  );
}
