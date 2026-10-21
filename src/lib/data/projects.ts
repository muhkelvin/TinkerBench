import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient, isSupabaseConfigured } from '@/lib/supabase/public';
import { createAdminClient } from '@/lib/supabase/server';
import type { Project } from '@/types/database.types';
import { escapeIlikePattern } from '@/lib/utils';

// Fallback seed projects for offline / preview environment
const FALLBACK_PROJECTS: Project[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'NexaPOS — Modern Cloud Point of Sale',
    slug: 'nexapos',
    summary:
      'Sistem kasir berbasis cloud yang cepat, responsif di tablet, dan mendukung transaksi offline-first untuk toko retail kecil.',
    problem:
      'Banyak aplikasi kasir modern terlalu berat untuk perangkat entry-level atau lambat saat koneksi internet terputus di tengah antrean pembayaran.',
    content: `## Pendekatan Teknis

NexaPOS dirancang dengan prinsip **offline-first queue**. Setiap transaksi disimpan secara lokal di IndexedDB terlebih dahulu, lalu di-sync ke server saat koneksi stabil.

### Arsitektur Sinkronisasi
- Transaksi lokal diberi UUID dan timestamp monotonic.
- Worker background mencoba flush queue setiap 10 detik.
- Konflik stok diselesaikan dengan aturan last-write-wins pada level item katalog.`,
    features: [
      'Transaksi offline-first dengan sinkronisasi background',
      'Manajemen inventori multi-kategori dan varian produk',
      'Penerbitan struk digital via thermal print dan tautan web',
      'Laporan ringkasan penjualan harian',
    ],
    limitations:
      'Integrasi printer Bluetooth masih memerlukan web bluetooth API yang hanya aktif di Chromium mobile.',
    tech_stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'IndexedDB', 'PostgreSQL'],
    tags: ['pos', 'offline-first', 'retail', 'web-app'],
    maturity: 'concept',
    publication_status: 'published',
    project_type: 'pwa',
    cover_path: '/images/projects/nexapos.jpg',
    cover_alt: 'Pratinjau antarmuka tablet kasir modern NexaPOS',
    gallery: [],
    build_log: [
      { date: '2026-10-15', text: 'Implementasi IndexedDB transaction queue dan offline fallback' },
      { date: '2026-10-18', text: 'Perbaikan rendering katalog grid pada resolusi layar tablet' },
    ],
    demo_url: null,
    source_url: 'https://github.com/example/nexapos',
    is_featured: true,
    published_at: '2026-10-18T10:00:00Z',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-18T10:00:00Z',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'E-commerce Analytics & Cohort Explorer',
    slug: 'ecommerce-analytics',
    summary:
      'Dashboard analitik performa penjualan, retensi pelanggan, dan analisis cohort berbasis data transaksi e-commerce.',
    problem:
      'Pemilik brand sering kesulitan melihat tren repeat-order dan churn rate karena data tersebar di berbagai platform tanpa visualisasi kohort yang jelas.',
    content: `## Eksplorasi Data & Matriks

Fokus proyek ini adalah agregasi data transaksi secara modular. Metrik retensi dihitung per minggu pendaftaran pengguna untuk memvisualisasikan degradasi engagement seiring waktu.`,
    features: [
      'Visualisasi matriks cohort retention bulanan',
      'Grafik tren GMV, AOV, dan order frequency',
      'Filter segmentasi pelanggan loyal vs one-time buyer',
      'Ekspor ringkasan laporan ke CSV',
    ],
    limitations: 'Data demo menggunakan data transaksi sintetis teranonimisasi.',
    tech_stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    tags: ['analytics', 'dashboard', 'ecommerce', 'metrics'],
    maturity: 'production',
    publication_status: 'published',
    project_type: 'saas',
    cover_path: '/images/projects/ecommerce-analytics.jpg',
    cover_alt: 'Pratinjau dashboard visualisasi analisis kohort dan retensi pelanggan',
    gallery: [],
    build_log: [
      { date: '2026-10-10', text: 'Pembuatan kalkulasi matriks cohort retention di SQL view' },
      { date: '2026-10-12', text: 'Optimasi rendering tabel heatmap untuk layar mobile' },
    ],
    demo_url: 'https://demo-analytics.example.com',
    source_url: 'https://github.com/example/ecommerce-analytics',
    is_featured: true,
    published_at: '2026-10-14T10:00:00Z',
    created_at: '2026-10-10T08:00:00Z',
    updated_at: '2026-10-14T10:00:00Z',
  },
  {
    id: '33333333-3333-3333-3333-333333333334',
    title: 'Lumina — Photography Studio & Visual Showcase',
    slug: 'lumina-photography',
    summary:
      'Website visual showcase dan sistem reservasi sesi foto untuk studio fotografi komersial dengan galeri foto berkecepatan tinggi.',
    problem:
      'Studio fotografi membutuhkan ruang pamer visual yang memuat gambar resolusi tinggi tanpa kompromi performa, serta alur booking jadwal pemotretan langsung.',
    content: `## Arsitektur Visual & Performa Galeri

Lumina dirancang dengan layout masonry editorial yang ringan. Setiap aset foto dioptimalkan secara otomatis menggunakan format modern (WebP & AVIF) dengan placeholder blur instan.

### Alur Reservasi
- Klien memilih paket pemotretan (Editorial, Wedding, Portrait).
- Kalender interaktif menampilkan ketersediaan slot tanggal secara real-time.
- Formulir brief terhubung langsung ke notifikasi konfirmasi WhatsApp dan email studio.`,
    features: [
      'Galeri foto editorial resolusi tinggi dengan adaptive lazy loading',
      'Kalender reservasi sesi foto interaktif',
      'Integrasi brief pemotretan dan notifikasi WhatsApp otomatis',
      'Katalog paket layanan dan portofolio per kategori',
    ],
    limitations:
      'Pembayaran uang muka (DP) saat ini dialihkan via konfirmasi rekening bank resmi studio.',
    tech_stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'PostgreSQL'],
    tags: ['photography', 'portfolio-client', 'booking', 'gallery', 'web-app'],
    maturity: 'production',
    publication_status: 'published',
    project_type: 'web_app',
    cover_path: '/images/projects/lumina-photography.jpg',
    cover_alt: 'Pratinjau antarmuka website fotografi Lumina Studio',
    gallery: [],
    build_log: [
      { date: '2026-10-08', text: 'Desain layout masonry editorial dan optimasi responsive image' },
      { date: '2026-10-11', text: 'Integrasi modul pemilih tanggal sesi foto interaktif' },
    ],
    demo_url: 'https://demo-lumina.example.com',
    source_url: 'https://github.com/example/lumina-photography',
    is_featured: true,
    published_at: '2026-10-12T10:00:00Z',
    created_at: '2026-10-08T08:00:00Z',
    updated_at: '2026-10-12T10:00:00Z',
  },
];

/**
 * Get featured projects for Homepage (max 3)
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('projects', 'site-index');

  if (!isSupabaseConfigured()) {
    return FALLBACK_PROJECTS.slice(0, 3);
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('publication_status', 'published')
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(3);

    if (error || !data || data.length === 0) {
      return FALLBACK_PROJECTS.slice(0, 3);
    }
    return data as Project[];
  } catch {
    return FALLBACK_PROJECTS.slice(0, 3);
  }
}

/**
 * Get all published projects for Labs directory with optional filters
 */
export async function getPublishedProjects(options?: {
  search?: string;
  status?: string;
  type?: string;
  tag?: string;
}): Promise<Project[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('projects');

  const filterFallback = () => {
    let list = [...FALLBACK_PROJECTS];
    if (options?.status) {
      list = list.filter((p) => {
        if (options.status === 'concept') {
          return p.maturity === 'concept' || (p.maturity as string) === 'prototype';
        }
        if (options.status === 'production') {
          return (
            p.maturity === 'production' ||
            (p.maturity as string) === 'demo' ||
            (p.maturity as string) === 'beta'
          );
        }
        return p.maturity === options.status;
      });
    }
    if (options?.type) {
      list = list.filter((p) => {
        if (options.type === 'web_app') {
          return p.project_type === 'web_app' || p.project_type === 'portfolio' || p.project_type === 'customizable';
        }
        if (options.type === 'saas') {
          return p.project_type === 'saas' || p.project_type === 'saas_candidate';
        }
        return p.project_type === options.type;
      });
    }
    if (options?.tag) {
      const targetTag = options.tag.toLowerCase();
      list = list.filter(
        (p) => p.tags && p.tags.some((t) => t.toLowerCase() === targetTag)
      );
    }
    if (options?.search) {
      const s = options.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.summary.toLowerCase().includes(s) ||
          p.tags.some((t) => t.toLowerCase().includes(s))
      );
    }
    return list;
  };

  if (!isSupabaseConfigured()) {
    return filterFallback();
  }

  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('projects')
      .select('*')
      .eq('publication_status', 'published')
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false });

    if (options?.status) {
      query = query.eq('maturity', options.status as import('@/types/database.types').Maturity);
    }
    if (options?.type) {
      query = query.eq('project_type', options.type as import('@/types/database.types').ProjectType);
    }
    if (options?.tag) {
      query = query.contains('tags', [options.tag]);
    }
    if (options?.search) {
      const sanitized = escapeIlikePattern(options.search);
      query = query.or(`title.ilike.%${sanitized}%,summary.ilike.%${sanitized}%`);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return filterFallback();
    }
    return data as Project[];
  } catch {
    return filterFallback();
  }
}

/**
 * Get published project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('projects', `project:${slug}`);

  if (!isSupabaseConfigured()) {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('publication_status', 'published')
      .single();

    if (error || !data) {
      return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
    }
    return data as Project;
  } catch {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Get all published project slugs for sitemap
 */
export async function getPublishedProjectSlugs(): Promise<Array<{ slug: string; updated_at: string }>> {
  'use cache';
  cacheLife('hours');
  cacheTag('projects', 'site-index');

  if (!isSupabaseConfigured()) {
    return FALLBACK_PROJECTS.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('publication_status', 'published');

    if (error || !data || data.length === 0) {
      return FALLBACK_PROJECTS.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
    }
    return data;
  } catch {
    return FALLBACK_PROJECTS.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
  }
}

// ---------------- Admin data queries (Uncached) ----------------

export async function getAllProjectsAdmin(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_PROJECTS;
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !data) {
      return FALLBACK_PROJECTS;
    }
    return data as Project[];
  } catch {
    return FALLBACK_PROJECTS;
  }
}

export async function getProjectByIdAdmin(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_PROJECTS.find((p) => p.id === id) || null;
  }

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return FALLBACK_PROJECTS.find((p) => p.id === id) || null;
    }
    return data as Project;
  } catch {
    return FALLBACK_PROJECTS.find((p) => p.id === id) || null;
  }
}

