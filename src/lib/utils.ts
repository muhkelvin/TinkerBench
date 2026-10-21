export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Escapes characters % and _ for safe PostgreSQL ilike queries
 * as required by PRD Section 9.3
 */
export function escapeIlikePattern(query: string): string {
  return query.replace(/[%_]/g, '\\$&');
}

/**
 * Slug validator & formatter (lowercase alphanumeric and hyphen)
 */
export function formatSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Formats a date string (ISO) into technical editorial date (e.g. "18 Okt 2026")
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Calculate reading time in minutes for Markdown content
 */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
