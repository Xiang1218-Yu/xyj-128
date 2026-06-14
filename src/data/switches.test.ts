import { describe, it, expect } from 'vitest';
import { SWITCH_CONFIGS, SWITCH_LIST, SWITCH_CATEGORY_LABELS } from '@/data/switches';
import { SwitchType } from '@/types/keyboard';

describe('switches', () => {
  describe('SWITCH_CONFIGS', () => {
    it('should have config for all switch types', () => {
      const types: SwitchType[] = ['red', 'blue', 'brown', 'black', 'silver', 'green'];
      for (const type of types) {
        expect(SWITCH_CONFIGS[type]).toBeDefined();
        expect(SWITCH_CONFIGS[type].id).toBe(type);
        expect(SWITCH_CONFIGS[type].name.length).toBeGreaterThan(0);
        expect(SWITCH_CONFIGS[type].physics).toBeDefined();
      }
    });

    it('should have valid category for each switch', () => {
      const validCategories = ['linear', 'tactile', 'clicky'];
      for (const config of Object.values(SWITCH_CONFIGS)) {
        expect(validCategories).toContain(config.category);
      }
    });

    it('should have valid physics for each switch', () => {
      for (const config of Object.values(SWITCH_CONFIGS)) {
        const p = config.physics;
        expect(p.totalTravel).toBeGreaterThan(0);
        expect(p.actuationTravel).toBeGreaterThan(0);
        expect(p.actuationForce).toBeGreaterThan(0);
        expect(p.bottomOutForce).toBeGreaterThan(0);
        expect(p.returnSpeed).toBeGreaterThan(0);
        expect(p.damping).toBeGreaterThan(0);
      }
    });

    it('should classify red, black, silver as linear', () => {
      expect(SWITCH_CONFIGS.red.category).toBe('linear');
      expect(SWITCH_CONFIGS.black.category).toBe('linear');
      expect(SWITCH_CONFIGS.silver.category).toBe('linear');
    });

    it('should classify blue, green as clicky', () => {
      expect(SWITCH_CONFIGS.blue.category).toBe('clicky');
      expect(SWITCH_CONFIGS.green.category).toBe('clicky');
    });

    it('should classify brown as tactile', () => {
      expect(SWITCH_CONFIGS.brown.category).toBe('tactile');
    });
  });

  describe('SWITCH_LIST', () => {
    it('should contain all switch types', () => {
      expect(SWITCH_LIST).toEqual(['red', 'blue', 'brown', 'black', 'silver', 'green']);
    });
  });

  describe('SWITCH_CATEGORY_LABELS', () => {
    it('should have labels for all categories', () => {
      expect(SWITCH_CATEGORY_LABELS.linear).toBeDefined();
      expect(SWITCH_CATEGORY_LABELS.tactile).toBeDefined();
      expect(SWITCH_CATEGORY_LABELS.clicky).toBeDefined();
    });
  });
});
