'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { createAdminClient, verifyAdmin } from '@/lib/supabase/server';
import { postSchema, type PostInput } from '@/lib/validation';

export async function savePost(input: PostInput, postId?: string) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, error: 'Akses ditolak: Hanya admin yang diizinkan melakukan operasi ini.' };
  }

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Validasi data gagal' };
  }

  const data = parsed.data;
  const supabase = await createAdminClient();

  // Check unique slug
  const { data: existingSlug } = await (postId
    ? (supabase
        .from('posts')
        .select('id, slug')
        .eq('slug', data.slug)
        .neq('id', postId)
        .maybeSingle() as any)
    : (supabase
        .from('posts')
        .select('id, slug')
        .eq('slug', data.slug)
        .maybeSingle() as any));

  if (existingSlug) {
    return { success: false, error: `Slug "${data.slug}" sudah digunakan oleh catatan lain.` };
  }

  let publishedAt: string | null = null;
  if (postId) {
    const { data: currentPost } = await (supabase
      .from('posts')
      .select('published_at, publication_status')
      .eq('id', postId)
      .single() as any);

    if (currentPost?.published_at) {
      publishedAt = currentPost.published_at;
    } else if (data.publication_status === 'published') {
      publishedAt = new Date().toISOString();
    }
  } else if (data.publication_status === 'published') {
    publishedAt = new Date().toISOString();
  }

  const payload = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    tags: data.tags,
    cover_path: data.cover_path || null,
    cover_alt: data.cover_alt || null,
    publication_status: data.publication_status,
    seo_title: data.seo_title || null,
    seo_description: data.seo_description || null,
    published_at: publishedAt,
  };

  let savedId = postId;

  if (postId) {
    const { error } = await (supabase
      .from('posts')
      .update(payload as any)
      .eq('id', postId) as any);

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    const { data: inserted, error } = await (supabase
      .from('posts')
      .insert(payload as any)
      .select('id')
      .single() as any);

    if (error) {
      return { success: false, error: error.message };
    }
    savedId = inserted?.id;
  }

  // Update post_projects relations
  if (savedId) {
    await (supabase.from('post_projects').delete().eq('post_id', savedId) as any);
    if (data.project_ids && data.project_ids.length > 0) {
      const relationRows = data.project_ids.map((projectId) => ({
        post_id: savedId,
        project_id: projectId,
      }));
      await (supabase.from('post_projects').insert(relationRows as any) as any);
    }
  }

  try {
    updateTag('posts');
    updateTag('site-index');
    updateTag(`post:${data.slug}`);
    revalidatePath('/');
    revalidatePath('/notes');
    revalidatePath(`/notes/${data.slug}`);
    revalidatePath('/admin/notes');
    revalidatePath('/sitemap.xml');
  } catch {
    // Non-fatal in dev
  }

  return { success: true, id: savedId };
}

export async function archivePost(id: string) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, error: 'Akses ditolak.' };
  }

  const supabase = await createAdminClient();
  const { data: post } = await (supabase
    .from('posts')
    .select('slug')
    .eq('id', id)
    .single() as any);

  const { error } = await (supabase
    .from('posts')
    .update({ publication_status: 'archived' } as any)
    .eq('id', id) as any);

  if (error) {
    return { success: false, error: error.message };
  }

  if (post?.slug) {
    updateTag(`post:${post.slug}`);
  }
  updateTag('posts');
  updateTag('site-index');
  revalidatePath('/');
  revalidatePath('/notes');
  revalidatePath('/admin/notes');

  return { success: true };
}

export async function deletePost(id: string) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, error: 'Akses ditolak.' };
  }

  const supabase = await createAdminClient();
  const { data: post } = await (supabase
    .from('posts')
    .select('slug')
    .eq('id', id)
    .single() as any);

  const { error } = await (supabase.from('posts').delete().eq('id', id) as any);

  if (error) {
    return { success: false, error: error.message };
  }

  if (post?.slug) {
    updateTag(`post:${post.slug}`);
  }
  updateTag('posts');
  updateTag('site-index');
  revalidatePath('/');
  revalidatePath('/notes');
  revalidatePath('/admin/notes');

  return { success: true };
}
