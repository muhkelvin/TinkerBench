import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  getPostBySlug,
  getProjectsForPost,
  getRelatedPostsByProject,
  getPublishedPostSlugs,
} from '@/lib/data/posts';
import { MarkdownRenderer } from '@/lib/markdown/renderer';
import { formatDate, estimateReadingTime } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';
import { ArrowLeft, Clock, FolderGit2, BookOpen } from 'lucide-react';

interface NoteDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPostSlugs();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: NoteDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Catatan Tidak Ditemukan' };

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: `${post.title} | ${siteConfig.name}`,
      description: post.excerpt,
      images: post.cover_path ? [{ url: post.cover_path }] : undefined,
    },
  };
}

import { NoteDetailView } from '@/components/notes/NoteDetailView';

async function NoteDetailContent({ params }: NoteDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedProjects = await getProjectsForPost(post.id);

  let siblingNotes: Array<{ id: string; title: string; slug: string; published_at: string | null }> = [];
  if (relatedProjects.length > 0 && relatedProjects[0]) {
    siblingNotes = await getRelatedPostsByProject(relatedProjects[0].id, post.id);
  }

  return (
    <NoteDetailView
      post={post}
      relatedProjects={relatedProjects}
      siblingNotes={siblingNotes}
    />
  );
}

function NoteDetailSkeleton() {
  return (
    <div className="max-w-[740px] mx-auto space-y-8 animate-pulse">
      <div className="h-4 w-28 bg-[#E5E1D6]/70 rounded" />
      <div className="space-y-4">
        <div className="h-4 w-36 bg-[#E5E1D6]/70 rounded" />
        <div className="h-10 w-3/4 bg-[#E5E1D6] rounded-lg" />
        <div className="h-16 w-full bg-[#E5E1D6]/50 rounded-lg" />
      </div>
      <div className="space-y-3 pt-6">
        <div className="h-4 w-full bg-[#E5E1D6]/60 rounded" />
        <div className="h-4 w-11/12 bg-[#E5E1D6]/60 rounded" />
        <div className="h-4 w-4/5 bg-[#E5E1D6]/60 rounded" />
      </div>
    </div>
  );
}

export default function NoteDetailPage({ params }: NoteDetailPageProps) {
  return (
    <Suspense fallback={<NoteDetailSkeleton />}>
      <NoteDetailContent params={params} />
    </Suspense>
  );
}
