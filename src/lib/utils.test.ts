import { describe, it, expect } from 'vitest';
import { escapeIlikePattern, formatSlug, estimateReadingTime } from './utils';

describe('escapeIlikePattern (PRD Section 9.3)', () => {
  it('escapes % and _ to prevent SQL ilike pattern injections', () => {
    expect(escapeIlikePattern('50%')).toBe('50\\%');
    expect(escapeIlikePattern('user_name')).toBe('user\\_name');
    expect(escapeIlikePattern('100%_complete')).toBe('100\\%\\_complete');
    expect(escapeIlikePattern('normal text')).toBe('normal text');
  });
});

describe('formatSlug', () => {
  it('converts titles into clean lowercase hyphenated slugs', () => {
    expect(formatSlug('NexaPOS — Modern Cloud Point of Sale')).toBe(
      'nexapos-modern-cloud-point-of-sale'
    );
    expect(formatSlug('   E-commerce & Analytics!   ')).toBe(
      'e-commerce-analytics'
    );
  });
});

describe('estimateReadingTime', () => {
  it('calculates reading time correctly based on word count', () => {
    const text200Words = Array(200).fill('kata').join(' ');
    expect(estimateReadingTime(text200Words)).toBe(1);

    const text450Words = Array(450).fill('kata').join(' ');
    expect(estimateReadingTime(text450Words)).toBe(3);
  });
});
