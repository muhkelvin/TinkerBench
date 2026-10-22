import { describe, it, expect } from 'vitest';
import { idDictionary } from './dictionaries/id';
import { enDictionary } from './dictionaries/en';
import { localizeProject, localizePost } from './project-translations';
import type { Project, Post } from '@/types/database.types';

describe('i18n Dictionaries', () => {
  it('should have matching top-level keys in id and en dictionaries', () => {
    const idKeys = Object.keys(idDictionary).sort();
    const enKeys = Object.keys(enDictionary).sort();
    expect(idKeys).toEqual(enKeys);
  });

  it('should have matching navigation keys', () => {
    const idNavKeys = Object.keys(idDictionary.nav).sort();
    const enNavKeys = Object.keys(enDictionary.nav).sort();
    expect(idNavKeys).toEqual(enNavKeys);
  });

  it('should have matching home keys', () => {
    const idHomeKeys = Object.keys(idDictionary.home).sort();
    const enHomeKeys = Object.keys(enDictionary.home).sort();
    expect(idHomeKeys).toEqual(enHomeKeys);
  });

  it('should have matching labs keys', () => {
    const idLabsKeys = Object.keys(idDictionary.labs).sort();
    const enLabsKeys = Object.keys(enDictionary.labs).sort();
    expect(idLabsKeys).toEqual(enLabsKeys);
  });

  it('should have matching notes keys', () => {
    const idNotesKeys = Object.keys(idDictionary.notes).sort();
    const enNotesKeys = Object.keys(enDictionary.notes).sort();
    expect(idNotesKeys).toEqual(enNotesKeys);
  });
});

describe('localizeProject helper', () => {
  const sampleProject: Project = {
    id: 'test-1',
    title: 'PhotoGPay — Alat Seleksi Foto',
    slug: 'photogpay',
    summary: 'Ringkasan bahasa Indonesia',
    problem: 'Masalah bahasa Indonesia',
    content: 'Konten',
    features: ['Fitur 1'],
    limitations: 'Batasan',
    tech_stack: ['Next.js'],
    tags: ['photography'],
    maturity: 'production',
    publication_status: 'published',
    project_type: 'saas',
    cover_path: null,
    cover_alt: null,
    gallery: [],
    build_log: [],
    demo_url: null,
    source_url: null,
    is_featured: true,
    published_at: '2026-10-21T10:00:00Z',
    created_at: '2026-10-14T08:00:00Z',
    updated_at: '2026-10-21T10:00:00Z',
  };

  it('should return original project when locale is id', () => {
    const result = localizeProject(sampleProject, 'id');
    expect(result.summary).toBe('Ringkasan bahasa Indonesia');
  });

  it('should return translated project when locale is en', () => {
    const result = localizeProject(sampleProject, 'en');
    expect(result.summary).toContain('Google Drive integrated photo selection tool');
    expect(result.problem).toContain('Photography clients often send messy screenshots');
  });

  it('should fallback to original if translation is not defined', () => {
    const unlistedProject: Project = {
      ...sampleProject,
      slug: 'unlisted-project-slug',
    };
    const result = localizeProject(unlistedProject, 'en');
    expect(result.summary).toBe('Ringkasan bahasa Indonesia');
  });
});

describe('localizePost helper', () => {
  const samplePost: Post = {
    id: 'post-1',
    title: 'Memilih IndexedDB vs SQLite WASM untuk Aplikasi Offline-First',
    slug: 'memilih-indexeddb-vs-sqlite-wasm',
    excerpt: 'Catatan evaluasi teknis penyimpanan lokal browser untuk NexaPOS',
    content: 'Konten',
    tags: ['offline-first'],
    cover_path: null,
    cover_alt: null,
    publication_status: 'published',
    seo_title: null,
    seo_description: null,
    published_at: '2026-10-19T09:00:00Z',
    created_at: '2026-10-18T08:00:00Z',
    updated_at: '2026-10-19T09:00:00Z',
  };

  it('should return original post when locale is id', () => {
    const result = localizePost(samplePost, 'id');
    expect(result.title).toBe('Memilih IndexedDB vs SQLite WASM untuk Aplikasi Offline-First');
  });

  it('should return translated post when locale is en', () => {
    const result = localizePost(samplePost, 'en');
    expect(result.title).toBe('Choosing IndexedDB vs SQLite WASM for Offline-First Applications');
    expect(result.excerpt).toContain('Technical evaluation of browser local storage engines');
  });
});
