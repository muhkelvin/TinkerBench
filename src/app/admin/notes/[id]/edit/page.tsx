import React from 'react';
import { notFound } from 'next/navigation';
import { getPostByIdAdmin } from '@/lib/data/posts';
import { getAllProjectsAdmin } from '@/lib/data/projects';
import { PostForm } from '@/components/admin/PostForm';

interface EditNotePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params;
  const [{ post, projectIds }, projects] = await Promise.all([
    getPostByIdAdmin(id),
    getAllProjectsAdmin(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <PostForm
      initialData={post}
      initialProjectIds={projectIds}
      availableProjects={projects}
    />
  );
}
