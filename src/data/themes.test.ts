import { describe, it, expect } from 'vitest';
import { UI_THEMES, UI_THEME_LIST, getUITheme } from '@/data/themes';
import { UIThemeType } from '@/types/keyboard';

describe('themes', () => {
  describe('UI_THEMES', () => {
    it('should have config for all theme types', () => {
      const types: UIThemeType[] = ['midnight', 'sunset', 'ocean', 'forest', 'cyberpunk', 'minimal', 'vintage', 'aurora'];
      for (const type of types) {
        expect(UI_THEMES[type]).toBeDefined();
        expect(UI_THEMES[type].id).toBe(type);
        expect(UI_THEMES[type].name.length).toBeGreaterThan(0);
      }
    });

    it('should have colors for each theme', () => {
      for (const theme of Object.values(UI_THEMES)) {
        expect(theme.colors).toBeDefined();
        expect(theme.colors.bgPrimary).toBeDefined();
        expect(theme.colors.textPrimary).toBeDefined();
        expect(theme.colors.accentPrimary).toBeDefined();
      }
    });

    it('should have scene ambience for each theme', () => {
      for (const theme of Object.values(UI_THEMES)) {
        expect(theme.sceneAmbience).toBeDefined();
        expect(theme.sceneAmbience.backgroundColor).toBeDefined();
        expect(theme.sceneAmbience.fogColor).toBeDefined();
        expect(theme.sceneAmbience.ambientLightIntensity).toBeGreaterThan(0);
      }
    });

    it('should have lighting for each theme', () => {
      for (const theme of Object.values(UI_THEMES)) {
        expect(theme.lighting).toBeDefined();
        expect(theme.lighting.directionalLights.length).toBeGreaterThan(0);
      }
    });
  });

  describe('UI_THEME_LIST', () => {
    it('should contain all theme types', () => {
      expect(UI_THEME_LIST.length).toBe(8);
    });
  });

  describe('getUITheme', () => {
    it('should return theme by id', () => {
      const theme = getUITheme('midnight');
      expect(theme.id).toBe('midnight');
    });

    it('should return correct theme for each type', () => {
      for (const type of UI_THEME_LIST) {
        const theme = getUITheme(type);
        expect(theme.id).toBe(type);
      }
    });
  });
});
