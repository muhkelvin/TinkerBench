import React from 'react';
import Link from 'next/link';
import type { Post } from '@/types/database.types';
import { formatDate, estimateReadingTime } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const readingTime = estimateReadingTime(post.content);

  return (
    <article className="group relative rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-5 sm:p-6 transition-all duration-200 hover:border-[#24251F]/40 hover:shadow-sm">
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#686960] mb-2.5">
        <time dateTime={post.published_at || post.created_at}>
          {formatDate(post.published_at || post.created_at)}
        </time>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {readingTime} menit baca
        </span>
      </div>

      <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[#24251F] group-hover:text-[#24251F]">
        <Link
          href={`/notes/${post.slug}`}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24251F] rounded"
        >
          <span className="absolute inset-0" aria-hidden="true" />
          {post.title}
        </Link>
      </h3>

      <p className="mt-2 text-sm text-[#686960] line-clamp-3 leading-relaxed">
        {post.excerpt}
      </p>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#E5E1D6] flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] text-[#686960] bg-[#F5F3EC] px-2 py-0.5 rounded border border-[#E5E1D6]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
