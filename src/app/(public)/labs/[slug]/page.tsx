import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getPublishedProjectSlugs } from '@/lib/data/projects';
import { getRelatedPostsByProject } from '@/lib/data/posts';
import { MaturityBadge } from '@/components/projects/MaturityBadge';
import { BuildLog } from '@/components/projects/BuildLog';
import { MarkdownRenderer } from '@/lib/markdown/renderer';
import { siteConfig } from '@/lib/site-config';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  Mail,
  Layers,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Code2,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPublishedProjectSlugs();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Proyek Tidak Ditemukan' };

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} | ${siteConfig.name}`,
      description: project.summary,
      images: project.cover_path ? [{ url: project.cover_path }] : undefined,
    },
  };
}

import { ProjectDetailView } from '@/components/projects/ProjectDetailView';

async function ProjectDetailContent({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedPosts = await getRelatedPostsByProject(project.id);

  return <ProjectDetailView project={project} relatedPosts={relatedPosts} />;
}

function ProjectDetailSkeleton() {
  return (
    <div className="max-w-[740px] mx-auto space-y-8 animate-pulse">
      <div className="h-4 w-24 bg-[#E5E1D6]/70 rounded" />
      <div className="space-y-4">
        <div className="h-5 w-32 bg-[#E5E1D6]/70 rounded" />
        <div className="h-10 w-3/4 bg-[#E5E1D6] rounded-lg" />
        <div className="h-16 w-full bg-[#E5E1D6]/50 rounded-lg" />
      </div>
      <div className="aspect-video w-full rounded-xl bg-[#E5E1D6]/40" />
      <div className="space-y-3 pt-4">
        <div className="h-4 w-full bg-[#E5E1D6]/60 rounded" />
        <div className="h-4 w-5/6 bg-[#E5E1D6]/60 rounded" />
      </div>
    </div>
  );
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailContent params={params} />
    </Suspense>
  );
}
