import { create } from 'zustand';
import { KeyboardState, KeyboardActions, LayoutType, CaseMaterial, KeyZone, SwitchType, FontStyle, StickerType } from '@/types/keyboard';
import { DEFAULT_ZONE_COLORS } from '@/data/zones';
import { DEFAULT_FONT_SIZE, DEFAULT_FONT_COLOR } from '@/data/fonts';

interface KeyboardStore extends KeyboardState, KeyboardActions {}

export const useKeyboardStore = create<KeyboardStore>((set) => ({
  layout: '65%',
  caseMaterial: 'aluminum',
  switchType: 'red',
  soundEnabled: true,
  zoneColors: { ...DEFAULT_ZONE_COLORS },
  pressedKeys: new Set<string>(),
  fontStyle: 'sans',
  fontSize: DEFAULT_FONT_SIZE,
  fontColor: DEFAULT_FONT_COLOR,
  selectedKeyId: null,
  keyCustoms: {},

  setLayout: (layout: LayoutType) => {
    set({ layout });
  },

  setCaseMaterial: (caseMaterial: CaseMaterial) => {
    set({ caseMaterial });
  },

  setSwitchType: (switchType: SwitchType) => {
    set({ switchType });
  },

  setSoundEnabled: (soundEnabled: boolean) => {
    set({ soundEnabled });
  },

  setZoneColor: (zone: KeyZone, color: string) => {
    set((state) => ({
      zoneColors: {
        ...state.zoneColors,
        [zone]: color,
      },
    }));
  },

  pressKey: (keyId: string) => {
    set((state) => {
      const newPressedKeys = new Set(state.pressedKeys);
      newPressedKeys.add(keyId);
      return { pressedKeys: newPressedKeys };
    });
  },

  releaseKey: (keyId: string) => {
    set((state) => {
      const newPressedKeys = new Set(state.pressedKeys);
      newPressedKeys.delete(keyId);
      return { pressedKeys: newPressedKeys };
    });
  },

  resetColors: () => {
    set({ zoneColors: { ...DEFAULT_ZONE_COLORS } });
  },

  setFontStyle: (fontStyle: FontStyle) => {
    set({ fontStyle });
  },

  setFontSize: (fontSize: number) => {
    set({ fontSize });
  },

  setFontColor: (fontColor: string) => {
    set({ fontColor });
  },

  setSelectedKeyId: (selectedKeyId: string | null) => {
    set({ selectedKeyId });
  },

  setKeyLabel: (keyId: string, label: string) => {
    set((state) => ({
      keyCustoms: {
        ...state.keyCustoms,
        [keyId]: {
          ...state.keyCustoms[keyId],
          label,
        },
      },
    }));
  },

  setKeySticker: (keyId: string, sticker: StickerType) => {
    set((state) => ({
      keyCustoms: {
        ...state.keyCustoms,
        [keyId]: {
          ...state.keyCustoms[keyId],
          sticker,
        },
      },
    }));
  },

  resetKeyCustom: (keyId: string) => {
    set((state) => {
      const newKeyCustoms = { ...state.keyCustoms };
      delete newKeyCustoms[keyId];
      return { keyCustoms: newKeyCustoms };
    });
  },

  resetAllKeyCustoms: () => {
    set({ keyCustoms: {} });
  },
}));

export const useLayout = () => useKeyboardStore((state) => state.layout);
export const useCaseMaterial = () => useKeyboardStore((state) => state.caseMaterial);
export const useSwitchType = () => useKeyboardStore((state) => state.switchType);
export const useSoundEnabled = () => useKeyboardStore((state) => state.soundEnabled);
export const useZoneColors = () => useKeyboardStore((state) => state.zoneColors);
export const usePressedKeys = () => useKeyboardStore((state) => state.pressedKeys);
export const useIsKeyPressed = (keyId: string) =>
  useKeyboardStore((state) => state.pressedKeys.has(keyId));
export const useFontStyle = () => useKeyboardStore((state) => state.fontStyle);
export const useFontSize = () => useKeyboardStore((state) => state.fontSize);
export const useFontColor = () => useKeyboardStore((state) => state.fontColor);
export const useSelectedKeyId = () => useKeyboardStore((state) => state.selectedKeyId);
export const useKeyCustom = (keyId: string) =>
  useKeyboardStore((state) => state.keyCustoms[keyId]);
export const useKeyCustoms = () => useKeyboardStore((state) => state.keyCustoms);
