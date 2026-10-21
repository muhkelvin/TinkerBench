import { describe, it, expect } from 'vitest';
import { projectSchema, postSchema, validateImageFile } from './index';

describe('projectSchema', () => {
  it('validates a correct project payload', () => {
    const valid = {
      title: 'NexaPOS',
      slug: 'nexapos-point-of-sale',
      summary: 'Sistem POS offline-first yang cepat dan andal.',
      maturity: 'prototype',
      publication_status: 'draft',
      project_type: 'portfolio',
      tech_stack: ['Next.js 16', 'TypeScript'],
      tags: ['pos', 'offline'],
      features: ['Fitur 1', 'Fitur 2'],
      demo_url: 'https://demo.example.com',
      source_url: 'https://github.com/example/repo',
      is_featured: false,
    };

    const result = projectSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects uppercase or invalid characters in slug (PRD Section 9.3)', () => {
    const invalid = {
      title: 'Test',
      slug: 'NexaPOS_Demo!',
      summary: 'Summary',
      maturity: 'prototype',
      publication_status: 'draft',
      project_type: 'portfolio',
    };

    const result = projectSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('enforces cover_alt when cover_path is provided (PRD Section 9.4)', () => {
    const invalid = {
      title: 'Test',
      slug: 'test-project',
      summary: 'Summary',
      maturity: 'prototype',
      publication_status: 'draft',
      project_type: 'portfolio',
      cover_path: 'https://example.com/cover.webp',
      cover_alt: '', // Missing alt text
    };

    const result = projectSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects non-https URLs for demo_url (PRD Section 9.3)', () => {
    const invalid = {
      title: 'Test',
      slug: 'test-project',
      summary: 'Summary',
      maturity: 'prototype',
      publication_status: 'draft',
      project_type: 'portfolio',
      demo_url: 'http://insecure-demo.com',
    };

    const result = projectSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('postSchema', () => {
  it('validates valid post payload', () => {
    const valid = {
      title: 'Catatan Arsitektur',
      slug: 'catatan-arsitektur',
      excerpt: 'Ringkasan artikel',
      content: '## Konten Utama\n\nPenjelasan mendalam.',
      tags: ['architecture'],
      publication_status: 'published',
    };

    const result = postSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});

describe('validateImageFile (Media validation)', () => {
  it('allows valid JPEG, PNG, and WebP up to 5MB', () => {
    expect(
      validateImageFile({ size: 1024 * 1024, type: 'image/jpeg', name: 'photo.jpg' }).valid
    ).toBe(true);
    expect(
      validateImageFile({ size: 2 * 1024 * 1024, type: 'image/png', name: 'screenshot.png' }).valid
    ).toBe(true);
    expect(
      validateImageFile({ size: 3 * 1024 * 1024, type: 'image/webp', name: 'banner.webp' }).valid
    ).toBe(true);
  });

  it('rejects files larger than 5MB (PRD Section 8.5 & 10.2)', () => {
    const res = validateImageFile({
      size: 6 * 1024 * 1024,
      type: 'image/jpeg',
      name: 'large.jpg',
    });
    expect(res.valid).toBe(false);
    expect(res.error).toContain('5 MB');
  });

  it('strictly rejects SVG uploads (PRD Section 8.5 & 10.2)', () => {
    const res = validateImageFile({
      size: 1024,
      type: 'image/svg+xml',
      name: 'icon.svg',
    });
    expect(res.valid).toBe(false);
    expect(res.error).toContain('SVG dilarang');
  });
});
