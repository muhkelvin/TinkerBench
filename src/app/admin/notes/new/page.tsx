import React from 'react';
import { getAllProjectsAdmin } from '@/lib/data/projects';
import { PostForm } from '@/components/admin/PostForm';

export default async function NewNotePage() {
  const projects = await getAllProjectsAdmin();
  return <PostForm availableProjects={projects} />;
}
