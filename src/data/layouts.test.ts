import { describe, it, expect } from 'vitest';
import { LAYOUT_CONFIGS, LAYOUT_LIST } from '@/data/layouts';

describe('layouts', () => {
  describe('LAYOUT_LIST', () => {
    it('should contain all layout types', () => {
      expect(LAYOUT_LIST).toEqual(['60%', '65%', '75%', 'TKL', 'Full']);
    });
  });

  describe('LAYOUT_CONFIGS', () => {
    it('should have config for each layout type', () => {
      for (const type of LAYOUT_LIST) {
        expect(LAYOUT_CONFIGS[type]).toBeDefined();
      }
    });

    it('should have correct layout type in each config', () => {
      for (const type of LAYOUT_LIST) {
        expect(LAYOUT_CONFIGS[type].type).toBe(type);
      }
    });

    it('should have name and description for each layout', () => {
      for (const type of LAYOUT_LIST) {
        expect(LAYOUT_CONFIGS[type].name.length).toBeGreaterThan(0);
        expect(LAYOUT_CONFIGS[type].description.length).toBeGreaterThan(0);
      }
    });

    it('should have keys for each layout', () => {
      for (const type of LAYOUT_LIST) {
        expect(LAYOUT_CONFIGS[type].keys.length).toBeGreaterThan(0);
      }
    });

    it('should have positive width and height', () => {
      for (const type of LAYOUT_LIST) {
        expect(LAYOUT_CONFIGS[type].width).toBeGreaterThan(0);
        expect(LAYOUT_CONFIGS[type].height).toBeGreaterThan(0);
      }
    });

    it('60% layout should have approximately 61 keys', () => {
      const keys = LAYOUT_CONFIGS['60%'].keys;
      expect(keys.length).toBeGreaterThanOrEqual(58);
      expect(keys.length).toBeLessThanOrEqual(65);
    });

    it('65% layout should have more keys than 60%', () => {
      expect(LAYOUT_CONFIGS['65%'].keys.length).toBeGreaterThan(LAYOUT_CONFIGS['60%'].keys.length);
    });

    it('75% layout should have more keys than 65%', () => {
      expect(LAYOUT_CONFIGS['75%'].keys.length).toBeGreaterThan(LAYOUT_CONFIGS['65%'].keys.length);
    });

    it('TKL layout should have approximately 87 keys', () => {
      const keys = LAYOUT_CONFIGS['TKL'].keys;
      expect(keys.length).toBeGreaterThanOrEqual(84);
      expect(keys.length).toBeLessThanOrEqual(90);
    });

    it('Full layout should have more keys than TKL', () => {
      expect(LAYOUT_CONFIGS['Full'].keys.length).toBeGreaterThan(LAYOUT_CONFIGS['TKL'].keys.length);
    });

    it('each key should have required properties', () => {
      for (const type of LAYOUT_LIST) {
        for (const key of LAYOUT_CONFIGS[type].keys) {
          expect(key.id).toBeDefined();
          expect(key.label).toBeDefined();
          expect(typeof key.x).toBe('number');
          expect(typeof key.y).toBe('number');
          expect(typeof key.width).toBe('number');
          expect(typeof key.height).toBe('number');
          expect(typeof key.row).toBe('number');
          expect(typeof key.col).toBe('number');
          expect(key.zone).toBeDefined();
        }
      }
    });

    it('each key should have unique id within a layout', () => {
      for (const type of LAYOUT_LIST) {
        const ids = LAYOUT_CONFIGS[type].keys.map((k) => k.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      }
    });

    it('all keys should have positive width and height', () => {
      for (const type of LAYOUT_LIST) {
        for (const key of LAYOUT_CONFIGS[type].keys) {
          expect(key.width).toBeGreaterThan(0);
          expect(key.height).toBeGreaterThan(0);
        }
      }
    });
  });
});
