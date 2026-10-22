import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getPublishedProjects } from '@/lib/data/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { FolderGit2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Labs — Direktori Proyek & Eksperimen',
  description:
    'Koleksi proyek nyata, prototipe, live demo, dan rilis beta yang sedang dikerjakan di Tinkerbench Labs.',
};

import { LabsHeader, LabsEmptyState } from '@/components/labs/LabsView';

interface LabsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    type?: string;
    tag?: string;
  }>;
}

async function LabsContent({ searchParams }: LabsPageProps) {
  const params = await searchParams;
  const projects = await getPublishedProjects({
    search: params.q,
    status: params.status,
    type: params.type,
    tag: params.tag,
  });

  return (
    <>
      <ProjectFilters />

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <LabsEmptyState />
      )}
    </>
  );
}

export default function LabsPage({ searchParams }: LabsPageProps) {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <LabsHeader />

      {/* Dynamic Content wrapped in Suspense for Next.js 16 PPR */}
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="h-11 bg-[#E5E1D6]/30 animate-pulse rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] animate-pulse" />
              ))}
            </div>
          </div>
        }
      >
        <LabsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
