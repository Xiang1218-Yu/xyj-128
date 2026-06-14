import { describe, it, expect } from 'vitest';
import { LIGHTING_MODES, LIGHTING_MODE_LIST, DEFAULT_RGB_COLORS, DEFAULT_RGB_BRIGHTNESS, DEFAULT_RGB_SPEED, MIN_RGB_BRIGHTNESS, MAX_RGB_BRIGHTNESS, MIN_RGB_SPEED, MAX_RGB_SPEED } from '@/data/lighting';
import { LightingMode, KeyZone } from '@/types/keyboard';

describe('lighting', () => {
  describe('LIGHTING_MODES', () => {
    it('should have config for all lighting modes', () => {
      const modes: LightingMode[] = ['static', 'breathing', 'wave', 'rainbow', 'reactive', 'ripple', 'starlight', 'marquee'];
      for (const mode of modes) {
        expect(LIGHTING_MODES[mode]).toBeDefined();
        expect(LIGHTING_MODES[mode].id).toBe(mode);
        expect(LIGHTING_MODES[mode].name.length).toBeGreaterThan(0);
        expect(LIGHTING_MODES[mode].icon.length).toBeGreaterThan(0);
      }
    });
  });

  describe('LIGHTING_MODE_LIST', () => {
    it('should contain all lighting modes', () => {
      expect(LIGHTING_MODE_LIST.length).toBe(8);
    });
  });

  describe('DEFAULT_RGB_COLORS', () => {
    it('should have color for all zones', () => {
      const zones: KeyZone[] = ['alphanumeric', 'function', 'navigation', 'numpad', 'modifiers', 'spacebar'];
      for (const zone of zones) {
        expect(DEFAULT_RGB_COLORS[zone]).toBeDefined();
        expect(DEFAULT_RGB_COLORS[zone]).toMatch(/^#[0-9a-f]{6}$/);
      }
    });
  });

  describe('constants', () => {
    it('should have valid default brightness', () => {
      expect(DEFAULT_RGB_BRIGHTNESS).toBeGreaterThanOrEqual(MIN_RGB_BRIGHTNESS);
      expect(DEFAULT_RGB_BRIGHTNESS).toBeLessThanOrEqual(MAX_RGB_BRIGHTNESS);
    });

    it('should have valid default speed', () => {
      expect(DEFAULT_RGB_SPEED).toBeGreaterThanOrEqual(MIN_RGB_SPEED);
      expect(DEFAULT_RGB_SPEED).toBeLessThanOrEqual(MAX_RGB_SPEED);
    });

    it('should have min < max for brightness', () => {
      expect(MIN_RGB_BRIGHTNESS).toBeLessThan(MAX_RGB_BRIGHTNESS);
    });

    it('should have min < max for speed', () => {
      expect(MIN_RGB_SPEED).toBeLessThan(MAX_RGB_SPEED);
    });
  });
});
