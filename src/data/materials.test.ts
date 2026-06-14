import { describe, it, expect } from 'vitest';
import { MATERIAL_CONFIGS, MATERIAL_LIST, PRESET_COLORS, DEFAULT_ENGRAVING_COLOR } from '@/data/materials';
import { CaseMaterial } from '@/types/keyboard';

describe('materials', () => {
  describe('MATERIAL_CONFIGS', () => {
    it('should have config for all materials', () => {
      const materials: CaseMaterial[] = ['aluminum', 'plastic', 'wood', 'carbon'];
      for (const mat of materials) {
        expect(MATERIAL_CONFIGS[mat]).toBeDefined();
        expect(MATERIAL_CONFIGS[mat].id).toBe(mat);
        expect(MATERIAL_CONFIGS[mat].name.length).toBeGreaterThan(0);
        expect(MATERIAL_CONFIGS[mat].color).toBeDefined();
        expect(MATERIAL_CONFIGS[mat].roughness).toBeGreaterThanOrEqual(0);
        expect(MATERIAL_CONFIGS[mat].metalness).toBeGreaterThanOrEqual(0);
      }
    });

    it('should have valid default texture detail for each material', () => {
      const validDetails = ['low', 'medium', 'high', 'ultra'];
      for (const config of Object.values(MATERIAL_CONFIGS)) {
        expect(validDetails).toContain(config.defaultTextureDetail);
      }
    });

    it('should have valid default wear level for each material', () => {
      const validLevels = ['none', 'light', 'moderate', 'heavy', 'vintage'];
      for (const config of Object.values(MATERIAL_CONFIGS)) {
        expect(validLevels).toContain(config.defaultWearLevel);
      }
    });

    it('should have valid default engraving for each material', () => {
      const validEngravings = ['none', 'logo', 'geometric', 'floral', 'circuit', 'dragon', 'custom'];
      for (const config of Object.values(MATERIAL_CONFIGS)) {
        expect(validEngravings).toContain(config.defaultEngraving);
      }
    });

    it('aluminum should have high metalness', () => {
      expect(MATERIAL_CONFIGS.aluminum.metalness).toBeGreaterThan(0.5);
    });

    it('wood should have zero metalness', () => {
      expect(MATERIAL_CONFIGS.wood.metalness).toBe(0);
    });
  });

  describe('MATERIAL_LIST', () => {
    it('should contain all materials', () => {
      expect(MATERIAL_LIST).toEqual(['aluminum', 'plastic', 'wood', 'carbon']);
    });
  });

  describe('PRESET_COLORS', () => {
    it('should be non-empty', () => {
      expect(PRESET_COLORS.length).toBeGreaterThan(0);
    });

    it('should contain valid hex colors', () => {
      for (const color of PRESET_COLORS) {
        expect(color).toMatch(/^#[0-9a-f]{6}$/);
      }
    });
  });

  describe('DEFAULT_ENGRAVING_COLOR', () => {
    it('should be a valid hex color', () => {
      expect(DEFAULT_ENGRAVING_COLOR).toMatch(/^#[0-9a-f]{6}$/);
    });
  });
});
