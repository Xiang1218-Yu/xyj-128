import { describe, it, expect } from 'vitest';
import { getKeyboardConfigInfo } from '@/utils/exportConfig';
import { useKeyboardStore } from '@/store/useKeyboardStore';

describe('exportConfig', () => {
  describe('getKeyboardConfigInfo', () => {
    it('should return complete config info', () => {
      const info = getKeyboardConfigInfo();
      expect(info.layout).toBeDefined();
      expect(info.layout.name).toBeDefined();
      expect(info.layout.keyCount).toBeGreaterThan(0);
      expect(info.caseMaterial).toBeDefined();
      expect(info.caseMaterial.name).toBeDefined();
      expect(info.switchType).toBeDefined();
      expect(info.switchType.name).toBeDefined();
      expect(info.font).toBeDefined();
      expect(info.font.name).toBeDefined();
      expect(info.lighting).toBeDefined();
      expect(info.lighting.rgbEnabled).toBeDefined();
      expect(info.lighting.modeName).toBeDefined();
      expect(info.lighting.brightness).toBeDefined();
      expect(info.lighting.speed).toBeDefined();
      expect(info.zoneColors).toBeDefined();
      expect(info.zoneColors.length).toBeGreaterThan(0);
    });

    it('should reflect current store state', () => {
      useKeyboardStore.getState().setLayout('TKL');
      const info = getKeyboardConfigInfo();
      expect(info.layout.name).toContain('TKL');
    });

    it('should reflect switch type change', () => {
      useKeyboardStore.getState().setSwitchType('blue');
      const info = getKeyboardConfigInfo();
      expect(info.switchType.name).toBeDefined();
    });

    it('should reflect RGB enabled state', () => {
      useKeyboardStore.getState().setRgbEnabled(false);
      const info = getKeyboardConfigInfo();
      expect(info.lighting.rgbEnabled).toBe(false);
    });

    it('should include all zone colors', () => {
      const info = getKeyboardConfigInfo();
      expect(info.zoneColors.length).toBe(6);
      for (const zone of info.zoneColors) {
        expect(zone.name).toBeDefined();
        expect(zone.color).toBeDefined();
      }
    });
  });
});
