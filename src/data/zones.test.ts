import { describe, it, expect } from 'vitest';
import { ZONE_CONFIGS, DEFAULT_ZONE_COLORS, ZONE_LIST } from '@/data/zones';
import { KeyZone } from '@/types/keyboard';

describe('zones', () => {
  describe('ZONE_CONFIGS', () => {
    it('should have config for all zones', () => {
      const zones: KeyZone[] = ['alphanumeric', 'function', 'navigation', 'numpad', 'modifiers', 'spacebar'];
      for (const zone of zones) {
        expect(ZONE_CONFIGS[zone]).toBeDefined();
        expect(ZONE_CONFIGS[zone].id).toBe(zone);
        expect(ZONE_CONFIGS[zone].name.length).toBeGreaterThan(0);
        expect(ZONE_CONFIGS[zone].defaultColor).toBeDefined();
      }
    });
  });

  describe('DEFAULT_ZONE_COLORS', () => {
    it('should have color for all zones', () => {
      const zones: KeyZone[] = ['alphanumeric', 'function', 'navigation', 'numpad', 'modifiers', 'spacebar'];
      for (const zone of zones) {
        expect(DEFAULT_ZONE_COLORS[zone]).toBeDefined();
      }
    });

    it('should match ZONE_CONFIGS default colors', () => {
      for (const [zone, config] of Object.entries(ZONE_CONFIGS)) {
        expect(DEFAULT_ZONE_COLORS[zone as KeyZone]).toBe(config.defaultColor);
      }
    });
  });

  describe('ZONE_LIST', () => {
    it('should contain all zone ids', () => {
      expect(ZONE_LIST).toEqual(['alphanumeric', 'function', 'navigation', 'numpad', 'modifiers', 'spacebar']);
    });
  });
});
