import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient, isSupabaseConfigured } from '@/lib/supabase/public';
import { createAdminClient } from '@/lib/supabase/server';
import type { Post, Project } from '@/types/database.types';
import { escapeIlikePattern } from '@/lib/utils';

const FALLBACK_POSTS: Post[] = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Memilih IndexedDB vs SQLite WASM untuk Aplikasi Offline-First',
    slug: 'memilih-indexeddb-vs-sqlite-wasm',
    excerpt:
      'Catatan evaluasi teknis penyimpanan lokal browser untuk NexaPOS: performa, ukuran bundle, dan kemudahan migrasi skema.',
    content: `Dalam merancang NexaPOS, salah satu keputusan paling krusial adalah memilih storage engine lokal di sisi browser.

## Mengapa Membutuhkan Storage Lokal?
Ketika kasir sedang melayani antrean ramai dan koneksi WiFi terputus, aplikasi tidak boleh freeze atau menolak input transaksi. Transaksi harus tetap tercatat secara instan ke media lokal dan kemudian disinkronisasikan.

### Evaluasi Opsi
1. **SQLite WASM**:
   - Kelebihan: Sintaks SQL standar, constraint database sangat ketat.
   - Kekurangan: Ukuran binary WASM cukup besar (~800KB), waktu inisialisasi awal lebih lambat di HP murah.
2. **IndexedDB murni / IDB wrapper**:
   - Kelebihan: Dukungan bawaan browser tanpa beban bundle tambahan, konsumsi memori rendah.
   - Kekurangan: API async berbasis key-value cursor yang lebih rumit jika memerlukan relasi kompleks.

### Keputusan
Untuk kebutuhan NexaPOS pada tahap prototype, IndexedDB dipilih karena prioritas utamanya adalah kecepatan startup di perangkat mobile dan minimnya payload awal.`,
    tags: ['architecture', 'offline-first', 'indexeddb', 'nexapos'],
    cover_path: null,
    cover_alt: null,
    publication_status: 'published',
    seo_title: 'Memilih IndexedDB vs SQLite WASM untuk Offline-First POS',
    seo_description: 'Evaluasi teknis storage engine browser untuk NexaPOS.',
    published_at: '2026-10-19T09:00:00Z',
    created_at: '2026-10-18T08:00:00Z',
    updated_at: '2026-10-19T09:00:00Z',
  },
];

/**
 * Get recent notes for Homepage (max 3)
 */
export async function getRecentPosts(): Promise<Post[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('posts', 'site-index');

  if (!isSupabaseConfigured()) {
    return FALLBACK_POSTS.slice(0, 3);
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('publication_status', 'published')
      .order('published_at', { ascending: false })
      .limit(3);

    if (error || !data || data.length === 0) {
      return FALLBACK_POSTS.slice(0, 3);
    }
    return data as Post[];
  } catch {
    return FALLBACK_POSTS.slice(0, 3);
  }
}

/**
 * Get published posts with search & pagination (10 per page)
 */
export async function getPublishedPosts(options?: {
  page?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
}): Promise<{ posts: Post[]; total: number }> {
  'use cache';
  cacheLife('hours');
  cacheTag('posts');

  const page = options?.page || 1;
  const pageSize = options?.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const filterFallback = () => {
    let list = [...FALLBACK_POSTS];
    if (options?.search) {
      const s = options.search.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s)
      );
    }
    if (options?.tag) {
      list = list.filter((p) => p.tags && p.tags.includes(options.tag!));
    }
    return { posts: list.slice(from, to + 1), total: list.length };
  };

  if (!isSupabaseConfigured()) {
    return filterFallback();
  }

  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('publication_status', 'published')
      .order('published_at', { ascending: false });

    if (options?.search) {
      const sanitized = escapeIlikePattern(options.search);
      query = query.or(`title.ilike.%${sanitized}%,excerpt.ilike.%${sanitized}%`);
    }
    if (options?.tag) {
      query = query.contains('tags', [options.tag]);
    }

    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error || !data) {
      return filterFallback();
    }
    return { posts: data as Post[], total: count || data.length };
  } catch {
    return filterFallback();
  }
}

/**
 * Get published post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('posts', `post:${slug}`);

  if (!isSupabaseConfigured()) {
    return FALLBACK_POSTS.find((p) => p.slug === slug) || null;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('publication_status', 'published')
      .single();

    if (error || !data) {
      return FALLBACK_POSTS.find((p) => p.slug === slug) || null;
    }
    return data as Post;
  } catch {
    return FALLBACK_POSTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Get projects related to a post
 */
export async function getProjectsForPost(postId: string): Promise<Project[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('posts', 'projects');

  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('post_projects')
      .select('project_id, projects(*)')
      .eq('post_id', postId);

    if (error || !data) return [];
    return data
      .map((item) => (item as unknown as { projects: Project }).projects)
      .filter((p) => p && p.publication_status === 'published');
  } catch {
    return [];
  }
}

/**
 * Get other posts related to the same project (PRD 6.5: max 3)
 */
export async function getRelatedPostsByProject(
  projectId: string,
  excludePostId?: string
): Promise<Post[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('posts');

  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('post_projects')
      .select('post_id, posts(*)')
      .eq('project_id', projectId);

    if (error || !data) return [];
    return data
      .map((item) => (item as unknown as { posts: Post }).posts)
      .filter((p) => p && p.publication_status === 'published' && p.id !== excludePostId)
      .slice(0, 3);
  } catch {
    return [];
  }
}

/**
 * Get all published post slugs for sitemap
 */
export async function getPublishedPostSlugs(): Promise<Array<{ slug: string; updated_at: string }>> {
  'use cache';
  cacheLife('hours');
  cacheTag('posts', 'site-index');

  if (!isSupabaseConfigured()) {
    return FALLBACK_POSTS.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('posts')
      .select('slug, updated_at')
      .eq('publication_status', 'published');

    if (error || !data || data.length === 0) {
      return FALLBACK_POSTS.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
    }
    return data;
  } catch {
    return FALLBACK_POSTS.map((p) => ({ slug: p.slug, updated_at: p.updated_at }));
  }
}

// ---------------- Admin data queries (Uncached) ----------------

export async function getAllPostsAdmin(): Promise<Post[]> {
  if (!isSupabaseConfigured()) return FALLBACK_POSTS;

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !data) return FALLBACK_POSTS;
    return data as Post[];
  } catch {
    return FALLBACK_POSTS;
  }
}

export async function getPostByIdAdmin(id: string): Promise<{ post: Post | null; projectIds: string[] }> {
  if (!isSupabaseConfigured()) {
    const fb = FALLBACK_POSTS.find((p) => p.id === id);
    return { post: fb || null, projectIds: [] };
  }

  try {
    const supabase = await createAdminClient();
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !post) {
      const fb = FALLBACK_POSTS.find((p) => p.id === id);
      return { post: fb || null, projectIds: [] };
    }

    const { data: relations } = await supabase
      .from('post_projects')
      .select('project_id')
      .eq('post_id', id);

    const projectIds = relations ? (relations as Array<{ project_id: string }>).map((r) => r.project_id) : [];
    return { post: post as Post, projectIds };
  } catch {
    const fb = FALLBACK_POSTS.find((p) => p.id === id);
    return { post: fb || null, projectIds: [] };
  }
}
