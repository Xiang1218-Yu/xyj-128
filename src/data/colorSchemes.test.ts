import { describe, it, expect } from 'vitest';
import { COLOR_SCHEMES, getColorSchemeById, getColorSchemesByCategory, COLOR_SCHEME_CATEGORIES } from '@/data/colorSchemes';

describe('colorSchemes', () => {
  describe('COLOR_SCHEMES', () => {
    it('should have at least 40 schemes', () => {
      expect(COLOR_SCHEMES.length).toBeGreaterThanOrEqual(40);
    });

    it('should have all required fields', () => {
      for (const scheme of COLOR_SCHEMES) {
        expect(scheme.id).toBeDefined();
        expect(scheme.name).toBeDefined();
        expect(scheme.description).toBeDefined();
        expect(scheme.category).toBeDefined();
        expect(scheme.zoneColors).toBeDefined();
        expect(scheme.fontColor).toBeDefined();
      }
    });

    it('should have unique ids', () => {
      const ids = COLOR_SCHEMES.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all zone colors for each scheme', () => {
      const zones = ['alphanumeric', 'function', 'navigation', 'numpad', 'modifiers', 'spacebar'];
      for (const scheme of COLOR_SCHEMES) {
        for (const zone of zones) {
          expect(scheme.zoneColors[zone as keyof typeof scheme.zoneColors]).toBeDefined();
        }
      }
    });
  });

  describe('getColorSchemeById', () => {
    it('should find existing scheme', () => {
      const scheme = getColorSchemeById('classic-pbt');
      expect(scheme).toBeDefined();
      expect(scheme!.id).toBe('classic-pbt');
    });

    it('should return undefined for non-existent scheme', () => {
      const scheme = getColorSchemeById('nonexistent');
      expect(scheme).toBeUndefined();
    });
  });

  describe('getColorSchemesByCategory', () => {
    it('should filter schemes by category', () => {
      const classicSchemes = getColorSchemesByCategory('classic');
      expect(classicSchemes.length).toBeGreaterThan(0);
      for (const scheme of classicSchemes) {
        expect(scheme.category).toBe('classic');
      }
    });

    it('should return empty array for category with no schemes', () => {
      const schemes = getColorSchemesByCategory('nonexistent' as any);
      expect(schemes).toEqual([]);
    });
  });

  describe('COLOR_SCHEME_CATEGORIES', () => {
    it('should have all expected categories', () => {
      const categoryIds = COLOR_SCHEME_CATEGORIES.map((c) => c.id);
      expect(categoryIds).toContain('classic');
      expect(categoryIds).toContain('retro');
      expect(categoryIds).toContain('cyber');
      expect(categoryIds).toContain('nature');
      expect(categoryIds).toContain('pastel');
      expect(categoryIds).toContain('dark');
      expect(categoryIds).toContain('gaming');
      expect(categoryIds).toContain('artisan');
    });
  });
});
