'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { createAdminClient, verifyAdmin } from '@/lib/supabase/server';
import { projectSchema, type ProjectInput } from '@/lib/validation';

export async function saveProject(input: ProjectInput, projectId?: string) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, error: 'Akses ditolak: Hanya admin yang diizinkan melakukan operasi ini.' };
  }

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Validasi data gagal' };
  }

  const data = parsed.data;
  const supabase = await createAdminClient();

  // Check unique slug
  const { data: existingSlug } = await (projectId
    ? (supabase
        .from('projects')
        .select('id, slug')
        .eq('slug', data.slug)
        .neq('id', projectId)
        .maybeSingle() as any)
    : (supabase
        .from('projects')
        .select('id, slug')
        .eq('slug', data.slug)
        .maybeSingle() as any));

  if (existingSlug) {
    return { success: false, error: `Slug "${data.slug}" sudah digunakan oleh proyek lain.` };
  }

  // Determine published_at logic per PRD 9.3
  let publishedAt: string | null = null;
  if (projectId) {
    const { data: currentProject } = await (supabase
      .from('projects')
      .select('published_at, publication_status')
      .eq('id', projectId)
      .single() as any);

    if (currentProject?.published_at) {
      publishedAt = currentProject.published_at;
    } else if (data.publication_status === 'published') {
      publishedAt = new Date().toISOString();
    }
  } else if (data.publication_status === 'published') {
    publishedAt = new Date().toISOString();
  }

  const payload = {
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    problem: data.problem || null,
    content: data.content || null,
    features: data.features,
    limitations: data.limitations || null,
    tech_stack: data.tech_stack,
    tags: data.tags,
    maturity: data.maturity,
    publication_status: data.publication_status,
    project_type: data.project_type,
    cover_path: data.cover_path || null,
    cover_alt: data.cover_alt || null,
    gallery: data.gallery,
    build_log: data.build_log,
    demo_url: data.demo_url || null,
    source_url: data.source_url || null,
    is_featured: data.is_featured,
    published_at: publishedAt,
  };

  let savedId = projectId;

  if (projectId) {
    const { error } = await (supabase
      .from('projects')
      .update(payload as any)
      .eq('id', projectId) as any);

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    const { data: inserted, error } = await (supabase
      .from('projects')
      .insert(payload as any)
      .select('id')
      .single() as any);

    if (error) {
      return { success: false, error: error.message };
    }
    savedId = inserted?.id;
  }

  // Invalidate cache immediately per PRD Section 11
  try {
    updateTag('projects');
    updateTag('site-index');
    updateTag(`project:${data.slug}`);
    revalidatePath('/');
    revalidatePath('/labs');
    revalidatePath(`/labs/${data.slug}`);
    revalidatePath('/admin/projects');
    revalidatePath('/sitemap.xml');
  } catch {
    // Non-fatal in dev environments
  }

  return { success: true, id: savedId };
}

export async function archiveProject(id: string) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, error: 'Akses ditolak.' };
  }

  const supabase = await createAdminClient();
  const { data: project } = await (supabase
    .from('projects')
    .select('slug')
    .eq('id', id)
    .single() as any);

  const { error } = await (supabase
    .from('projects')
    .update({ publication_status: 'archived' } as any)
    .eq('id', id) as any);

  if (error) {
    return { success: false, error: error.message };
  }

  if (project?.slug) {
    updateTag(`project:${project.slug}`);
  }
  updateTag('projects');
  updateTag('site-index');
  revalidatePath('/');
  revalidatePath('/labs');
  revalidatePath('/admin/projects');

  return { success: true };
}

export async function deleteProject(id: string) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, error: 'Akses ditolak.' };
  }

  const supabase = await createAdminClient();
  const { data: project } = await (supabase
    .from('projects')
    .select('slug')
    .eq('id', id)
    .single() as any);

  const { error } = await (supabase.from('projects').delete().eq('id', id) as any);

  if (error) {
    return { success: false, error: error.message };
  }

  if (project?.slug) {
    updateTag(`project:${project.slug}`);
  }
  updateTag('projects');
  updateTag('site-index');
  revalidatePath('/');
  revalidatePath('/labs');
  revalidatePath('/admin/projects');

  return { success: true };
}
