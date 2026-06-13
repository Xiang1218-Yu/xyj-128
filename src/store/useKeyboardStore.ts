import { create } from 'zustand';
import { KeyboardState, KeyboardActions, LayoutType, CaseMaterial, KeyZone, SwitchType, FontStyle, StickerType } from '@/types/keyboard';
import { DEFAULT_ZONE_COLORS } from '@/data/zones';
import { DEFAULT_FONT_SIZE, DEFAULT_FONT_COLOR } from '@/data/fonts';

interface KeyboardStore extends KeyboardState, KeyboardActions {}

let stickerIdCounter = 0;
const genStickerId = () => `sticker_${Date.now()}_${++stickerIdCounter}`;

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
  selectedStickerId: null,
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
    set({ selectedKeyId, selectedStickerId: null });
  },

  setSelectedStickerId: (selectedStickerId: string | null) => {
    set({ selectedStickerId });
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

  addKeySticker: (keyId: string, stickerType: StickerType) => {
    set((state) => {
      const existing = state.keyCustoms[keyId];
      const existingStickers = existing?.stickers ?? [];
      const offset = existingStickers.length * 0.08;
      return {
        keyCustoms: {
          ...state.keyCustoms,
          [keyId]: {
            ...existing,
            stickers: [
              ...existingStickers,
              {
                id: genStickerId(),
                type: stickerType,
                x: -0.3 + offset,
                y: -0.3,
              },
            ],
          },
        },
      };
    });
  },

  removeKeySticker: (keyId: string, stickerId: string) => {
    set((state) => {
      const existing = state.keyCustoms[keyId];
      if (!existing?.stickers) return {};
      return {
        selectedStickerId: state.selectedStickerId === stickerId ? null : state.selectedStickerId,
        keyCustoms: {
          ...state.keyCustoms,
          [keyId]: {
            ...existing,
            stickers: existing.stickers.filter((s) => s.id !== stickerId),
          },
        },
      };
    });
  },

  setKeyStickerPosition: (keyId: string, stickerId: string, x: number, y: number) => {
    set((state) => {
      const existing = state.keyCustoms[keyId];
      if (!existing?.stickers) return {};
      const clampedX = Math.max(-0.45, Math.min(0.45, x));
      const clampedY = Math.max(-0.45, Math.min(0.45, y));
      return {
        keyCustoms: {
          ...state.keyCustoms,
          [keyId]: {
            ...existing,
            stickers: existing.stickers.map((s) =>
              s.id === stickerId ? { ...s, x: clampedX, y: clampedY } : s
            ),
          },
        },
      };
    });
  },

  resetKeyCustom: (keyId: string) => {
    set((state) => {
      const newKeyCustoms = { ...state.keyCustoms };
      delete newKeyCustoms[keyId];
      return { keyCustoms: newKeyCustoms, selectedStickerId: null };
    });
  },

  resetAllKeyCustoms: () => {
    set({ keyCustoms: {}, selectedStickerId: null });
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
export const useSelectedStickerId = () => useKeyboardStore((state) => state.selectedStickerId);
export const useKeyCustom = (keyId: string) =>
  useKeyboardStore((state) => state.keyCustoms[keyId]);
export const useKeyCustoms = () => useKeyboardStore((state) => state.keyCustoms);
