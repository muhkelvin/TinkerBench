'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Post, Project, PublicationStatus } from '@/types/database.types';
import { savePost, archivePost, deletePost } from '@/actions/posts';
import { uploadMedia } from '@/actions/media';
import { formatSlug } from '@/lib/utils';
import { MarkdownRenderer } from '@/lib/markdown/renderer';
import {
  Save,
  Send,
  Archive,
  Trash2,
  Plus,
  AlertCircle,
  ArrowLeft,
  Eye,
  PenLine,
} from 'lucide-react';
import Link from 'next/link';

const SUGGESTED_NOTE_TAGS = [
  'technical-notes',
  'architecture',
  'performance',
  'database',
  'nextjs',
  'typescript',
  'supabase',
  'offline-first',
  'devops',
];

interface PostFormProps {
  initialData?: Post | null;
  initialProjectIds?: string[];
  availableProjects?: Project[];
}

export function PostForm({
  initialData,
  initialProjectIds = [],
  availableProjects = [],
}: PostFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialData?.slug));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || ['technical-notes']);
  const [tagInput, setTagInput] = useState('');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(initialProjectIds);
  const [publicationStatus, setPublicationStatus] = useState<PublicationStatus>(
    initialData?.publication_status || 'draft'
  );
  const [coverPath, setCoverPath] = useState(initialData?.cover_path || '');
  const [coverAlt, setCoverAlt] = useState(initialData?.cover_alt || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description || '');

  // Mobile editor tab: 'write' | 'preview' per PRD Section 12.7
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const isSlugChangedOnPublished =
    isEditing &&
    initialData?.publication_status === 'published' &&
    initialData.slug !== slug;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setHasUnsavedChanges(true);
    if (!slugManuallyEdited && !isEditing) {
      setSlug(formatSlug(val));
    }
  };

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

  const toggleProject = (projectId: string) => {
    setHasUnsavedChanges(true);
    if (selectedProjectIds.includes(projectId)) {
      setSelectedProjectIds(selectedProjectIds.filter((id) => id !== projectId));
    } else {
      setSelectedProjectIds([...selectedProjectIds, projectId]);
    }
  };

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

  const handleSubmit = async (targetStatus?: PublicationStatus) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const statusToSave = targetStatus || publicationStatus;

    const payload = {
      title,
      slug: slug.trim(),
      excerpt,
      content,
      tags: tags.filter((t) => t.trim().length > 0),
      cover_path: coverPath.trim() || null,
      cover_alt: coverAlt.trim() || null,
      project_ids: selectedProjectIds,
      publication_status: statusToSave,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
    };

    const result = await savePost(payload, initialData?.id);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Gagal menyimpan catatan');
    } else {
      setHasUnsavedChanges(false);
      router.push('/admin/notes');
      router.refresh();
    }
  };

  const handleArchive = async () => {
    if (!initialData?.id) return;
    if (!confirm('Arsipkan catatan ini?')) return;
    setIsSubmitting(true);
    await archivePost(initialData.id);
    setIsSubmitting(false);
    router.push('/admin/notes');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm('PERINGATAN: Tindakan ini permanen. Hapus catatan ini?')) return;
    setIsSubmitting(true);
    await deletePost(initialData.id);
    setIsSubmitting(false);
    router.push('/admin/notes');
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E1D6]">
        <Link
          href="/admin/notes"
          className="touch-target font-mono text-xs text-[#686960] hover:text-[#24251F] inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar Catatan
        </Link>
        <div className="flex items-center gap-3">
          {isEditing && slug && (
            <Link
              href={`/notes/${slug}`}
              target="_blank"
              className="font-mono text-xs text-[#686960] hover:text-[#24251F] inline-flex items-center gap-1"
            >
              Lihat di Web Publik ↗
            </Link>
          )}
          <span className="font-mono text-xs text-[#686960] uppercase">
            {isEditing ? 'Mode Edit Catatan' : 'Catatan Baru'}
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#B42318]/10 border border-[#B42318]/30 text-xs text-[#B42318] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Fields: Single Column Layout */}
      <div className="space-y-6 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 sm:p-6 shadow-sm">
        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block font-mono text-xs font-medium text-[#24251F]">
              Judul Catatan *
            </label>
            <span
              className={`font-mono text-[11px] ${
                title.length > 500 ? 'text-[#B42318] font-semibold' : 'text-[#686960]'
              }`}
            >
              {title.length}/500
            </span>
          </div>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Contoh: Memilih IndexedDB vs SQLite WASM untuk Offline-First"
            className="w-full h-11 px-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none transition-colors"
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
            placeholder="memilih-indexeddb-vs-sqlite-wasm"
            className="w-full h-11 px-3 text-[16px] font-mono rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none transition-colors"
          />
          {isSlugChangedOnPublished && (
            <p className="mt-1 text-xs text-[#B42318] font-mono">
              Peringatan: Catatan ini sudah terbit. Mengubah slug akan membuat URL lama tidak berfungsi.
            </p>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block font-mono text-xs font-medium text-[#24251F] mb-1.5">
            Ringkasan / Excerpt (1 Paragraf) *
          </label>
          <textarea
            required
            rows={3}
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Ringkasan singkat bahasan atau kesimpulan untuk ditampilkan di daftar dan kartu catatan..."
            className="w-full p-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none transition-colors leading-relaxed"
          />
        </div>

        {/* Status */}
        <div className="w-full sm:w-1/2">
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

        {/* Markdown Editor with Mobile Tabs: Write / Preview (PRD Section 12.7) */}
        <div className="pt-4 border-t border-[#E5E1D6] space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D6]">
            <label className="font-mono text-xs font-semibold text-[#24251F]">
              Isi Konten Markdown *
            </label>
            <div className="flex items-center gap-1 bg-[#F5F3EC] p-1 rounded-lg border border-[#E5E1D6]">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`touch-target px-3 py-1 text-xs font-mono rounded-md inline-flex items-center gap-1 transition-colors ${
                  activeTab === 'write'
                    ? 'bg-[#FFFEFA] text-[#24251F] shadow-xs'
                    : 'text-[#686960] hover:text-[#24251F]'
                }`}
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Write</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`touch-target px-3 py-1 text-xs font-mono rounded-md inline-flex items-center gap-1 transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-[#FFFEFA] text-[#24251F] shadow-xs'
                    : 'text-[#686960] hover:text-[#24251F]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          </div>

          {activeTab === 'write' ? (
            <textarea
              required
              rows={14}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Tulis konten Markdown di sini: heading, list, code block, tabel, kutipan..."
              className="w-full p-4 text-[16px] font-mono rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none leading-relaxed"
            />
          ) : (
            <div className="min-h-[350px] p-4 rounded-lg border border-[#E5E1D6] bg-[#FFFEFA] overflow-y-auto">
              {content.trim() ? (
                <MarkdownRenderer content={content} />
              ) : (
                <p className="text-xs font-mono text-[#686960]">
                  Belum ada teks untuk ditampilkan.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Project Relations (PRD Section 6.5 & 8.4) */}
        {availableProjects.length > 0 && (
          <div className="pt-4 border-t border-[#E5E1D6] space-y-2">
            <label className="block font-mono text-xs font-medium text-[#24251F]">
              Hubungkan ke Proyek (Opsional)
            </label>
            <p className="text-xs text-[#686960]">
              Catatan ini akan muncul di detail proyek yang dipilih dan menampilkan rekomendasi catatan terkait.
            </p>
            <div className="space-y-1.5 pt-1">
              {availableProjects.map((project) => (
                <label
                  key={project.id}
                  className="flex items-center gap-2 p-2 rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] cursor-pointer hover:bg-[#EAE6DB] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedProjectIds.includes(project.id)}
                    onChange={() => toggleProject(project.id)}
                    className="w-4 h-4 rounded border-[#E5E1D6] accent-[#24251F]"
                  />
                  <span className="text-xs font-medium text-[#24251F]">
                    {project.title}
                  </span>
                  <span className="font-mono text-[11px] text-[#686960] ml-auto uppercase">
                    {project.maturity}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="pt-4 border-t border-[#E5E1D6] space-y-3">
          <div className="flex items-center justify-between">
            <label className="block font-mono text-xs font-medium text-[#24251F]">
              Tags Catatan ({tags.length} aktif)
            </label>
            <span className="font-mono text-[11px] text-[#686960]">
              Untuk topik dan filter catatan
            </span>
          </div>

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
              placeholder="Ketik tag baru lalu Enter..."
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

          <div>
            <span className="font-mono text-[11px] text-[#686960] block mb-1.5">
              Pilihan Tag Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_NOTE_TAGS.map((suggested) => {
                const isAdded = tags.includes(suggested);
                return (
                  <button
                    key={suggested}
                    type="button"
                    onClick={() => (isAdded ? handleRemoveTag(suggested) : handleAddTag(suggested))}
                    className={`font-mono text-[11px] px-2 py-0.5 rounded border transition-colors ${
                      isAdded
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

        {/* Cover Image Upload */}
        <div className="pt-4 border-t border-[#E5E1D6] space-y-4">
          <label className="block font-mono text-xs font-semibold text-[#24251F]">
            Cover Gambar Catatan (Opsional)
          </label>

          {/* Visual Preview */}
          {coverPath && (
            <div className="p-3 rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-36 h-24 rounded overflow-hidden border border-[#E5E1D6] bg-[#FFFEFA] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPath}
                  alt={coverAlt || 'Preview cover catatan'}
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

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            className="text-xs font-mono text-[#686960] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#24251F] file:text-[#FFFEFA] file:text-xs file:font-medium hover:file:opacity-90"
          />
          {isUploading && (
            <span className="font-mono text-xs text-[#686960] animate-pulse block">
              Mengunggah gambar...
            </span>
          )}

          <div>
            <label className="block font-mono text-xs text-[#686960] mb-1">
              Path / URL Cover
            </label>
            <input
              type="text"
              value={coverPath}
              onChange={(e) => {
                setCoverPath(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="https://... atau /uploads/..."
              className="w-full h-11 px-3 text-[16px] font-mono rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-[#686960] mb-1">
              Alt Text Cover (Wajib jika cover diisi)
            </label>
            <input
              type="text"
              value={coverAlt}
              onChange={(e) => {
                setCoverAlt(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Deskripsi cover untuk screen reader..."
              className="w-full h-11 px-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            />
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="pt-4 border-t border-[#E5E1D6] space-y-4">
          <label className="block font-mono text-xs font-semibold text-[#24251F]">
            Metadata SEO Tambahan (Opsional)
          </label>
          <div>
            <label className="block font-mono text-xs text-[#686960] mb-1">
              SEO Title
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => {
                setSeoTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Biarkan kosong untuk menggunakan Judul Catatan"
              className="w-full h-11 px-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-[#686960] mb-1">
              SEO Description
            </label>
            <textarea
              rows={2}
              value={seoDescription}
              onChange={(e) => {
                setSeoDescription(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Biarkan kosong untuk menggunakan Excerpt"
              className="w-full p-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] focus:border-[#24251F] focus:outline-none"
            />
          </div>
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
