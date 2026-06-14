import { describe, it, expect } from 'vitest';
import { FONT_CONFIGS, FONT_LIST, FONT_FAMILY_MAP, DEFAULT_FONT_SIZE, MIN_FONT_SIZE, MAX_FONT_SIZE, DEFAULT_FONT_COLOR } from '@/data/fonts';
import { FontStyle } from '@/types/keyboard';

describe('fonts', () => {
  describe('FONT_CONFIGS', () => {
    it('should have config for all font styles', () => {
      const styles: FontStyle[] = ['sans', 'serif', 'mono', 'rounded', 'display'];
      for (const style of styles) {
        expect(FONT_CONFIGS[style]).toBeDefined();
        expect(FONT_CONFIGS[style].id).toBe(style);
        expect(FONT_CONFIGS[style].name.length).toBeGreaterThan(0);
        expect(FONT_CONFIGS[style].fontWeight).toBeGreaterThan(0);
      }
    });
  });

  describe('FONT_LIST', () => {
    it('should contain all font styles', () => {
      expect(FONT_LIST).toEqual(['sans', 'serif', 'mono', 'rounded', 'display']);
    });
  });

  describe('FONT_FAMILY_MAP', () => {
    it('should have mapping for all font styles', () => {
      for (const style of FONT_LIST) {
        expect(FONT_FAMILY_MAP[style]).toBeDefined();
        expect(FONT_FAMILY_MAP[style].length).toBeGreaterThan(0);
      }
    });
  });

  describe('constants', () => {
    it('should have valid default font size', () => {
      expect(DEFAULT_FONT_SIZE).toBeGreaterThan(0);
    });

    it('should have min < default < max font size', () => {
      expect(MIN_FONT_SIZE).toBeLessThan(DEFAULT_FONT_SIZE);
      expect(DEFAULT_FONT_SIZE).toBeLessThan(MAX_FONT_SIZE);
    });

    it('should have valid default font color', () => {
      expect(DEFAULT_FONT_COLOR).toMatch(/^#[0-9a-f]{6}$/);
    });
  });
});
