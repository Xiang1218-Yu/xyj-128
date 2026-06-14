import { describe, it, expect } from 'vitest';
import { STICKER_CONFIGS, STICKER_LIST } from '@/data/stickers';
import { StickerType } from '@/types/keyboard';

describe('stickers', () => {
  describe('STICKER_CONFIGS', () => {
    it('should have config for all sticker types', () => {
      const types: StickerType[] = ['cat', 'star', 'heart', 'fire', 'lightning', 'music', 'gamepad', 'coffee', 'rocket', 'diamond', 'crown'];
      for (const type of types) {
        expect(STICKER_CONFIGS[type]).toBeDefined();
        expect(STICKER_CONFIGS[type].id).toBe(type);
        expect(STICKER_CONFIGS[type].name.length).toBeGreaterThan(0);
        expect(STICKER_CONFIGS[type].emoji.length).toBeGreaterThan(0);
        expect(STICKER_CONFIGS[type].color).toBeDefined();
      }
    });

    it('should have unique ids', () => {
      const ids = Object.values(STICKER_CONFIGS).map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid hex colors', () => {
      for (const config of Object.values(STICKER_CONFIGS)) {
        expect(config.color).toMatch(/^#[0-9a-f]{6}$/);
      }
    });
  });

  describe('STICKER_LIST', () => {
    it('should contain all sticker types', () => {
      expect(STICKER_LIST.length).toBe(11);
      expect(STICKER_LIST).toContain('cat');
      expect(STICKER_LIST).toContain('star');
      expect(STICKER_LIST).toContain('heart');
      expect(STICKER_LIST).toContain('crown');
    });
  });
});
