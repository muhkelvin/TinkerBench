import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const httpsUrlRegex = /^https:\/\/.+/i;

export const galleryItemSchema = z.object({
  path: z.string().min(1, 'Path gambar wajib diisi'),
  alt: z.string().min(1, 'Alt text gambar wajib diisi'),
  caption: z.string().optional(),
});

export const buildLogItemSchema = z.object({
  date: z.string().min(1, 'Tanggal wajib diisi'),
  text: z.string().min(1, 'Catatan perubahan wajib diisi'),
});

export const projectSchema = z
  .object({
    title: z.string().trim().min(1, 'Judul proyek wajib diisi').max(200),
    slug: z
      .string()
      .trim()
      .min(1, 'Slug wajib diisi')
      .regex(slugRegex, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)'),
    summary: z.string().trim().min(1, 'Ringkasan proyek wajib diisi'),
    problem: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    features: z.array(z.string().trim().min(1)).default([]),
    limitations: z.string().optional().nullable(),
    tech_stack: z.array(z.string().trim().min(1)).default([]),
    tags: z.array(z.string().trim().min(1)).default([]),
    maturity: z.enum(['concept', 'production', 'prototype', 'demo', 'beta'], {
      message: 'Tingkat kematangan tidak valid',
    }),
    publication_status: z.enum(['draft', 'published', 'archived'], {
      message: 'Status publikasi tidak valid',
    }),
    project_type: z.enum(
      [
        'web_app',
        'pwa',
        'saas',
        'ecommerce',
        'landing_page',
        'portfolio',
        'customizable',
        'saas_candidate',
      ],
      {
        message: 'Jenis proyek tidak valid',
      }
    ),
    cover_path: z.string().optional().nullable(),
    cover_alt: z.string().optional().nullable(),
    gallery: z.array(galleryItemSchema).default([]),
    build_log: z.array(buildLogItemSchema).default([]),
    demo_url: z
      .string()
      .trim()
      .regex(httpsUrlRegex, 'URL demo harus diawali dengan https://')
      .optional()
      .nullable()
      .or(z.literal('')),
    source_url: z
      .string()
      .trim()
      .regex(httpsUrlRegex, 'URL source harus diawali dengan https://')
      .optional()
      .nullable()
      .or(z.literal('')),
    is_featured: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.cover_path && data.cover_path.trim().length > 0) {
        return !!data.cover_alt && data.cover_alt.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Alt text wajib diisi jika cover gambar dipilih',
      path: ['cover_alt'],
    }
  );

export type ProjectInput = z.infer<typeof projectSchema>;

export const postSchema = z
  .object({
    title: z.string().trim().min(1, 'Judul catatan wajib diisi').max(250),
    slug: z
      .string()
      .trim()
      .min(1, 'Slug wajib diisi')
      .regex(slugRegex, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)'),
    excerpt: z.string().trim().min(1, 'Ringkasan catatan wajib diisi'),
    content: z.string().trim().min(1, 'Isi konten Markdown wajib diisi'),
    tags: z.array(z.string().trim().min(1)).default([]),
    cover_path: z.string().optional().nullable(),
    cover_alt: z.string().optional().nullable(),
    project_ids: z.array(z.string().uuid()).default([]),
    publication_status: z.enum(['draft', 'published', 'archived'], {
      message: 'Status publikasi tidak valid',
    }),
    seo_title: z.string().optional().nullable(),
    seo_description: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.cover_path && data.cover_path.trim().length > 0) {
        return !!data.cover_alt && data.cover_alt.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Alt text wajib diisi jika cover gambar dipilih',
      path: ['cover_alt'],
    }
  );

export type PostInput = z.infer<typeof postSchema>;

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateImageFile(file: { size: number; type: string; name: string }) {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Ukuran file maksimal 5 MB' };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Hanya format JPEG, PNG, dan WebP yang diizinkan (SVG dilarang)' };
  }
  // Extra safety check against SVG disguised as other extensions
  if (file.name.toLowerCase().endsWith('.svg')) {
    return { valid: false, error: 'File SVG tidak diperbolehkan' };
  }
  return { valid: true, error: null };
}
