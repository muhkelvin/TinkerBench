import React from 'react';
import { siteConfig } from '@/lib/site-config';
import { getFeaturedProjects } from '@/lib/data/projects';
import { getRecentPosts } from '@/lib/data/posts';
import { HomeContent } from '@/components/home/HomeContent';

export const metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default async function HomePage() {
  const [featuredProjects, recentNotes] = await Promise.all([
    getFeaturedProjects(),
    getRecentPosts(),
  ]);

  return <HomeContent featuredProjects={featuredProjects} recentNotes={recentNotes} />;
}
