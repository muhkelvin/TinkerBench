'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Project, Maturity, PublicationStatus, ProjectType } from '@/types/database.types';
import { saveProject, archiveProject, deleteProject } from '@/actions/projects';
import { uploadMedia } from '@/actions/media';
import { formatSlug } from '@/lib/utils';
import {
  Save,
  Send,
  Archive,
  Trash2,
  Plus,
  X,
  Upload,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface ProjectFormProps {
  initialData?: Project | null;
}

const SUGGESTED_TAGS = [
  'photography',
  'retail',
  'booking',
  'saas',
  'ecommerce',
  'pos',
  'analytics',
  'landing-page',
  'client-work',
  'portfolio',
  'pwa',
  'dashboard',
];

const SUGGESTED_TECH = [
  'Next.js 16',
  'React 19',
  'TypeScript',
  'Tailwind CSS',
  'Supabase',
  'PostgreSQL',
  'Prisma',
  'Zustand',
  'TanStack Query',
  'Vite',
];

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialData?.slug));
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [problem, setProblem] = useState(initialData?.problem || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [limitations, setLimitations] = useState(initialData?.limitations || '');
  const [maturity, setMaturity] = useState<Maturity>(initialData?.maturity || 'concept');
  const [publicationStatus, setPublicationStatus] = useState<PublicationStatus>(
    initialData?.publication_status || 'draft'
  );
  const [projectType, setProjectType] = useState<ProjectType>(
    initialData?.project_type || 'web_app'
  );
  const [coverPath, setCoverPath] = useState(initialData?.cover_path || '');
  const [coverAlt, setCoverAlt] = useState(initialData?.cover_alt || '');
  const [demoUrl, setDemoUrl] = useState(initialData?.demo_url || '');
  const [sourceUrl, setSourceUrl] = useState(initialData?.source_url || '');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);

  // Dynamic arrays
  const [features, setFeatures] = useState<string[]>(initialData?.features || ['']);
  const [techStack, setTechStack] = useState<string[]>(
    initialData?.tech_stack || ['Next.js 16', 'TypeScript', 'Tailwind CSS']
  );
  const [techInput, setTechInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags || ['web-app']);
  const [tagInput, setTagInput] = useState('');
  const [buildLog, setBuildLog] = useState<Array<{ date: string; text: string }>>(
    initialData?.build_log || []
  );

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Tag & Tech handlers
  const handleAddTag = (textToAdd?: string) => {
    const raw = textToAdd !== undefined ? textToAdd : tagInput;
    const clean = raw.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9-]/g, '-');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setHasUnsavedChanges(true);
  };

  const handleAddTech = (techToAdd?: string) => {
    const raw = techToAdd !== undefined ? techToAdd : techInput;
    const clean = raw.trim();
    if (clean && !techStack.includes(clean)) {
      setTechStack([...techStack, clean]);
      setTechInput('');
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== techToRemove));
    setHasUnsavedChanges(true);
  };

  // Warn if slug is changed on published content (PRD Section 9.3)
  const isSlugChangedOnPublished =
    isEditing &&
    initialData?.publication_status === 'published' &&
    initialData.slug !== slug;

  // Auto-slug from title if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setHasUnsavedChanges(true);
    if (!slugManuallyEdited && !isEditing) {
      setSlug(formatSlug(val));
    }
  };

  // Warn before leaving if unsaved changes exist (PRD Section 12.7)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Media upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadMedia(formData);
    setIsUploading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Gagal mengunggah media');
    } else if (res.url) {
      setCoverPath(res.url);
      setHasUnsavedChanges(true);
    }
  };

  const handleSubmit = async (targetStatus?: PublicationStatus) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const statusToSave = targetStatus || publicationStatus;

    const payload = {
      title,
      slug: slug.trim(),
      summary,
      problem: problem.trim() || null,
      content: content.trim() || null,
      features: features.filter((f) => f.trim().length > 0),
      limitations: limitations.trim() || null,
      tech_stack: techStack.filter((t) => t.trim().length > 0),
      tags: tags.filter((t) => t.trim().length > 0),
      maturity,
      publication_status: statusToSave,
      project_type: projectType,
      cover_path: coverPath.trim() || null,
      cover_alt: coverAlt.trim() || null,
      gallery: [],
      build_log: buildLog.filter((b) => b.text.trim().length > 0),
      demo_url: demoUrl.trim() || null,
      source_url: sourceUrl.trim() || null,
      is_featured: isFeatured,
    };

    const result = await saveProject(payload, initialData?.id);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Gagal menyimpan proyek');
    } else {
      setHasUnsavedChanges(false);
      router.push('/admin/projects');
      router.refresh();
    }
  };

  const handleArchive = async () => {
    if (!initialData?.id) return;
    if (!confirm('Apakah Anda yakin ingin mengarsipkan proyek ini?')) return;
    setIsSubmitting(true);
    await archiveProject(initialData.id);
    setIsSubmitting(false);
    router.push('/admin/projects');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm('PERINGATAN: Tindakan ini permanen. Hapus proyek ini?')) return;
    setIsSubmitting(true);
    await deleteProject(initialData.id);
    setIsSubmitting(false);
    router.push('/admin/projects');
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E1D6]">
        <Link
          href="/admin/projects"
          className="touch-target font-mono text-xs text-[#686960] hover:text-[#24251F] inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar Proyek
        </Link>
        <div className="flex items-center gap-3">
          {isEditing && slug && (
            <Link
              href={`/labs/${slug}`}
              target="_blank"
              className="font-mono text-xs text-[#686960] hover:text-[#24251F] inline-flex items-center gap-1"
            >
              Lihat di Web Publik ↗
            </Link>
          )}
          <span className="font-mono text-xs text-[#686960] uppercase">
            {isEditing ? 'Mode Edit Proyek' : 'Proyek Baru'}
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#B42318]/10 border border-[#B42318]/30 text-xs text-[#B42318] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Fields: Single Column Layout per PRD Section 12.7 */}
      <div className="space-y-6 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 sm:p-6 shadow-sm">
        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block font-mono text-xs font-medium text-[#24251F]">
              Judul Proyek *
            </label>
            <span
              className={`font-mono text-[11px] ${
                title.length > 500 ? 'text-[#B42318] font-semibold' : 'text-[#686960]'
              }`}
            >
              {title.length}/500 karakter
            </span>
          </div>
          <input
            type="text"
            required
            maxLength={500}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Contoh: NexaPOS — Modern Cloud Point of Sale"
            className={`w-full h-11 px-3 text-[16px] rounded-lg border ${
              title.length > 500 ? 'border-[#B42318]' : 'border-[#E5E1D6]'
            } bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none transition-colors`}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block font-mono text-xs font-medium text-[#24251F] mb-1.5">
            Slug URL (huruf kecil, angka, dan tanda hubung) *
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManuallyEdited(true);
              setHasUnsavedChanges(true);
            }}
            placeholder="nexapos"
            className="w-full h-11 px-3 text-[16px] font-mono rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none transition-colors"
          />
          {isSlugChangedOnPublished && (
            <p className="mt-1 text-xs text-[#B42318] font-mono">
              Peringatan: Proyek ini sudah terbit. Mengubah slug akan membuat URL lama tidak berfungsi (MVP tidak menyediakan redirect otomatis).
            </p>
          )}
        </div>

        {/* Summary */}
        <div>
          <label className="block font-mono text-xs font-medium text-[#24251F] mb-1.5">
            Ringkasan Proyek (1–2 Kalimat) *
          </label>
          <textarea
            required
            rows={3}
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Jelaskan apa yang dibuat dan fungsinya dalam 1–2 kalimat singkat..."
            className="w-full p-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none transition-colors leading-relaxed"
          />
        </div>

        {/* Selects: Maturity, Type, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-mono text-xs font-medium text-[#24251F] mb-1.5">
              Maturity Level *
            </label>
            <select
              value={maturity}
              onChange={(e) => {
                setMaturity(e.target.value as Maturity);
                setHasUnsavedChanges(true);
              }}
              className="w-full h-11 px-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            >
              <option value="concept">Concept (Ide / Prototipe)</option>
              <option value="production">Production (Live / Siap Pakai)</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs font-medium text-[#24251F] mb-1.5">
              Kategori / Jenis Aplikasi *
            </label>
            <select
              value={projectType}
              onChange={(e) => {
                setProjectType(e.target.value as ProjectType);
                setHasUnsavedChanges(true);
              }}
              className="w-full h-11 px-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            >
              <option value="web_app">Web App</option>
              <option value="pwa">PWA (Progressive Web App)</option>
              <option value="saas">SaaS (Software as a Service)</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="landing_page">Landing Page</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-xs font-medium text-[#24251F] mb-1.5">
              Status Publikasi *
            </label>
            <select
              value={publicationStatus}
              onChange={(e) => {
                setPublicationStatus(e.target.value as PublicationStatus);
                setHasUnsavedChanges(true);
              }}
              className="w-full h-11 px-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            >
              <option value="draft">Draft (Privat)</option>
              <option value="published">Published (Publik)</option>
              <option value="archived">Archived (Diarsipkan)</option>
            </select>
          </div>
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="featured"
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => {
              setIsFeatured(e.target.checked);
              setHasUnsavedChanges(true);
            }}
            className="w-4 h-4 rounded border-[#E5E1D6] accent-[#24251F]"
          />
          <label htmlFor="featured" className="font-mono text-xs text-[#24251F]">
            Tampilkan sebagai Selected Project di Homepage
          </label>
        </div>

        {/* Cover Image & Alt Text */}
        <div className="pt-4 border-t border-[#E5E1D6] space-y-4">
          <label className="block font-mono text-xs font-semibold text-[#24251F]">
            Cover / Screenshot Utama
          </label>

          {/* Visual Preview of Cover Image */}
          {coverPath && (
            <div className="p-3 rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-36 h-24 rounded overflow-hidden border border-[#E5E1D6] bg-[#FFFEFA] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPath}
                  alt={coverAlt || 'Preview screenshot cover'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <span className="font-mono text-xs text-[#24251F] font-medium block truncate">
                  {coverPath}
                </span>
                <span className="font-mono text-[11px] text-[#686960] block truncate">
                  Alt: {coverAlt || '(belum diisi)'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCoverPath('');
                    setCoverAlt('');
                    setHasUnsavedChanges(true);
                  }}
                  className="text-xs font-mono text-[#B42318] hover:underline inline-flex items-center gap-1 pt-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus Cover</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              className="text-xs font-mono text-[#686960] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#24251F] file:text-[#FFFEFA] file:text-xs file:font-medium hover:file:opacity-90"
            />
            {isUploading && (
              <span className="font-mono text-xs text-[#686960] animate-pulse">
                Mengunggah...
              </span>
            )}
          </div>

          <div>
            <label className="block font-mono text-xs text-[#686960] mb-1">
              URL / Path Gambar
            </label>
            <input
              type="text"
              value={coverPath}
              onChange={(e) => {
                setCoverPath(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="https://... atau /images/projects/..."
              className="w-full h-11 px-3 text-[16px] font-mono rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-[#686960] mb-1">
              Alt Text Gambar (Wajib jika cover diisi) *
            </label>
            <input
              type="text"
              value={coverAlt}
              onChange={(e) => {
                setCoverAlt(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Deskripsi visual screenshot untuk aksesibilitas..."
              className="w-full h-11 px-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            />
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E5E1D6]">
          <div>
            <label className="block font-mono text-xs font-medium text-[#24251F] mb-1">
              URL Demo Interaktif (https://)
            </label>
            <input
              type="url"
              value={demoUrl}
              onChange={(e) => {
                setDemoUrl(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="https://demo.example.com"
              className="w-full h-11 px-3 text-[16px] font-mono rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-xs font-medium text-[#24251F] mb-1">
              URL Source Code (https://)
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => {
                setSourceUrl(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="https://github.com/..."
              className="w-full h-11 px-3 text-[16px] font-mono rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            />
          </div>
        </div>

        {/* Tags Topik & Niche (Interactive Chip Builder) */}
        <div className="pt-4 border-t border-[#E5E1D6] space-y-3">
          <div className="flex items-center justify-between">
            <label className="block font-mono text-xs font-medium text-[#24251F]">
              Tags Topik & Niche ({tags.length} aktif)
            </label>
            <span className="font-mono text-[11px] text-[#686960]">
              Untuk filter di halaman /labs
            </span>
          </div>

          {/* Active Tag Chips */}
          <div className="min-h-[42px] p-2 rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] flex flex-wrap gap-1.5 items-center">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs bg-[#FFFEFA] border border-[#E5E1D6] px-2 py-1 rounded text-[#24251F] inline-flex items-center gap-1.5 shadow-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-[#686960] hover:text-[#B42318] font-bold text-sm leading-none"
                    title={`Hapus #${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="font-mono text-xs text-[#686960] italic">
                Belum ada tag. Tambahkan tag di bawah atau klik pilihan cepat.
              </span>
            )}
          </div>

          {/* Input & Add Tag Button */}
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Ketik tag baru (misal: photography, booking) lalu Enter..."
              className="flex-1 h-10 px-3 text-[15px] font-mono rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddTag()}
              className="touch-target px-3.5 py-2 rounded-lg bg-[#24251F] text-[#FFFEFA] text-xs font-mono inline-flex items-center gap-1.5 hover:opacity-90 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Tag</span>
            </button>
          </div>

          {/* Quick Tag Suggestions */}
          <div>
            <span className="font-mono text-[11px] text-[#686960] block mb-1.5">
              Pilihan Tag Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map((suggested) => {
                const isAdded = tags.includes(suggested);
                return (
                  <button
                    key={suggested}
                    type="button"
                    onClick={() => (isAdded ? handleRemoveTag(suggested) : handleAddTag(suggested))}
                    className={`font-mono text-[11px] px-2 py-0.5 rounded border transition-colors ${isAdded
                      ? 'bg-[#24251F] text-[#FFFEFA] border-[#24251F]'
                      : 'bg-[#FFFEFA] border-[#E5E1D6] text-[#24251F] hover:bg-[#F5F3EC] hover:border-[#24251F]'
                      }`}
                  >
                    {isAdded ? `✓ #${suggested}` : `+ #${suggested}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tech Stack & Tools (Interactive Chip Builder) */}
        <div className="pt-4 border-t border-[#E5E1D6] space-y-3">
          <div className="flex items-center justify-between">
            <label className="block font-mono text-xs font-medium text-[#24251F]">
              Tech Stack & Tools ({techStack.length} aktif)
            </label>
            <span className="font-mono text-[11px] text-[#686960]">
              Ditampilkan pada card dan spesifikasi proyek
            </span>
          </div>

          {/* Active Tech Stack Chips */}
          <div className="min-h-[42px] p-2 rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] flex flex-wrap gap-1.5 items-center">
            {techStack.length > 0 ? (
              techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs bg-[#FFFEFA] border border-[#E5E1D6] px-2 py-1 rounded text-[#24251F] inline-flex items-center gap-1.5 shadow-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="text-[#686960] hover:text-[#B42318] font-bold text-sm leading-none"
                    title={`Hapus ${tech}`}
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="font-mono text-xs text-[#686960] italic">
                Belum ada tech stack ditambahkan.
              </span>
            )}
          </div>

          {/* Input & Add Tech Button */}
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  handleAddTech();
                }
              }}
              placeholder="Ketik tech stack (misal: Next.js 16, Supabase) lalu Enter..."
              className="flex-1 h-10 px-3 text-[15px] font-mono rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddTech()}
              className="touch-target px-3.5 py-2 rounded-lg bg-[#24251F] text-[#FFFEFA] text-xs font-mono inline-flex items-center gap-1.5 hover:opacity-90 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Tech</span>
            </button>
          </div>

          {/* Quick Tech Suggestions */}
          <div>
            <span className="font-mono text-[11px] text-[#686960] block mb-1.5">
              Pilihan Tech Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TECH.map((suggested) => {
                const isAdded = techStack.includes(suggested);
                return (
                  <button
                    key={suggested}
                    type="button"
                    onClick={() =>
                      isAdded ? handleRemoveTech(suggested) : handleAddTech(suggested)
                    }
                    className={`font-mono text-[11px] px-2 py-0.5 rounded border transition-colors ${isAdded
                      ? 'bg-[#24251F] text-[#FFFEFA] border-[#24251F]'
                      : 'bg-[#FFFEFA] border-[#E5E1D6] text-[#24251F] hover:bg-[#F5F3EC] hover:border-[#24251F]'
                      }`}
                  >
                    {isAdded ? `✓ ${suggested}` : `+ ${suggested}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="pt-4 border-t border-[#E5E1D6]">
          <label className="block font-mono text-xs font-medium text-[#24251F] mb-1.5">
            Pernyataan Masalah (Problem Statement)
          </label>
          <textarea
            rows={3}
            value={problem}
            onChange={(e) => {
              setProblem(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Masalah konkret yang melatarbelakangi pembuatan proyek ini..."
            className="w-full p-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
          />
        </div>

        {/* Limitations */}
        <div>
          <label className="block font-mono text-xs font-medium text-[#24251F] mb-1.5">
            Batasan & Ruang Lingkup Saat Ini
          </label>
          <textarea
            rows={2}
            value={limitations}
            onChange={(e) => {
              setLimitations(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Jujur tentang apa yang belum berfungsi atau batasan demo..."
            className="w-full p-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
          />
        </div>

        {/* Technical Markdown Content */}
        <div>
          <label className="block font-mono text-xs font-medium text-[#24251F] mb-1.5">
            Detail Teknis (Markdown)
          </label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="## Pendekatan Teknis&#10;&#10;Jelaskan arsitektur data, alur transaksi, atau tantangan implementasi..."
            className="w-full p-3 text-[16px] font-mono rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none leading-relaxed"
          />
        </div>

        {/* Features List */}
        <div className="pt-4 border-t border-[#E5E1D6] space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-medium text-[#24251F]">
              Daftar Fitur Utama
            </label>
            <button
              type="button"
              onClick={() => setFeatures([...features, ''])}
              className="touch-target px-2 py-1 text-xs font-mono text-[#24251F] hover:bg-[#F5F3EC] rounded inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Fitur</span>
            </button>
          </div>
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const updated = [...features];
                  updated[idx] = e.target.value;
                  setFeatures(updated);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Deskripsi fitur..."
                className="flex-1 h-10 px-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                className="touch-target p-2 text-[#686960] hover:text-[#B42318] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Build Log Entries */}
        <div className="pt-4 border-t border-[#E5E1D6] space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-medium text-[#24251F]">
              Build Log (Catatan Progres Bertanggal)
            </label>
            <button
              type="button"
              onClick={() =>
                setBuildLog([
                  { date: new Date().toISOString().split('T')[0] || '', text: '' },
                  ...buildLog,
                ])
              }
              className="touch-target px-2 py-1 text-xs font-mono text-[#24251F] hover:bg-[#F5F3EC] rounded inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Entri Log</span>
            </button>
          </div>
          {buildLog.map((entry, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg border border-[#E5E1D6] bg-[#F5F3EC]">
              <input
                type="date"
                value={entry.date}
                onChange={(e) => {
                  const updated = [...buildLog];
                  if (updated[idx]) {
                    updated[idx] = { ...updated[idx], date: e.target.value };
                    setBuildLog(updated);
                    setHasUnsavedChanges(true);
                  }
                }}
                className="h-9 px-2 text-xs font-mono rounded border border-[#E5E1D6] bg-[#FFFEFA]"
              />
              <input
                type="text"
                value={entry.text}
                onChange={(e) => {
                  const updated = [...buildLog];
                  if (updated[idx]) {
                    updated[idx] = { ...updated[idx], text: e.target.value };
                    setBuildLog(updated);
                    setHasUnsavedChanges(true);
                  }
                }}
                placeholder="Apa yang diubah atau diperbaiki..."
                className="flex-1 h-9 px-3 text-[16px] rounded border border-[#E5E1D6] bg-[#FFFEFA]"
              />
              <button
                type="button"
                onClick={() => setBuildLog(buildLog.filter((_, i) => i !== idx))}
                className="touch-target p-1.5 text-[#686960] hover:text-[#B42318] self-end sm:self-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop & Mobile Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        {isEditing && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleArchive}
              disabled={isSubmitting}
              className="touch-target px-3.5 py-2 text-xs font-mono text-[#686960] hover:text-[#24251F] border border-[#E5E1D6] hover:bg-[#FFFEFA] rounded-lg inline-flex items-center gap-1.5"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Arsipkan</span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="touch-target px-3.5 py-2 text-xs font-mono text-[#B42318] hover:bg-[#B42318]/10 rounded-lg inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>
        )}

        <div className="hidden sm:flex items-center gap-3 ml-auto">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('draft')}
            className="touch-target px-4 py-2 rounded-lg border border-[#E5E1D6] bg-[#FFFEFA] text-[#24251F] text-xs font-medium inline-flex items-center gap-1.5 hover:bg-[#F5F3EC]"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Draft</span>
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('published')}
            className="touch-target px-5 py-2 rounded-lg bg-[#24251F] text-[#FFFEFA] text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Publikasikan'}</span>
          </button>
        </div>
      </div>

      {/* Sticky Mobile Action Bar per PRD Section 12.7 */}
      <div className="sm:hidden mobile-action-bar flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit('draft')}
          className="touch-target flex-1 rounded-lg border border-[#E5E1D6] bg-[#FFFEFA] text-[#24251F] text-xs font-medium inline-flex items-center justify-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Draft</span>
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit('published')}
          className="touch-target flex-1 rounded-lg bg-[#24251F] text-[#FFFEFA] text-xs font-medium inline-flex items-center justify-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Menyimpan...' : 'Publish'}</span>
        </button>
      </div>
    </div>
  );
}
