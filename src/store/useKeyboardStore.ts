import { create } from 'zustand';
import { KeyboardState, KeyboardActions, LayoutType, CaseMaterial, KeyZone, SwitchType, FontStyle, StickerType, LightingMode, KeyTransform, LayoutConfig, SnapGridSize, ColorScheme, SwitchPhysicsParams, UIThemeType, TextureDetailLevel, WearLevel, EngravingType } from '@/types/keyboard';
import { DEFAULT_ZONE_COLORS } from '@/data/zones';
import { DEFAULT_FONT_SIZE, DEFAULT_FONT_COLOR } from '@/data/fonts';
import { DEFAULT_RGB_COLORS, DEFAULT_RGB_BRIGHTNESS, DEFAULT_RGB_SPEED } from '@/data/lighting';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { SWITCH_CONFIGS } from '@/data/switches';
import { checkCollisionWithOthers, snapTransformToGrid, findNonCollidingPosition, clampToBounds } from '@/utils/layoutUtils';
import { COLOR_SCHEMES } from '@/data/colorSchemes';
import { MATERIAL_CONFIGS, DEFAULT_ENGRAVING_COLOR } from '@/data/materials';

interface KeyboardStore extends KeyboardState, KeyboardActions {}

let stickerIdCounter = 0;
const genStickerId = () => `sticker_${Date.now()}_${++stickerIdCounter}`;

const CUSTOM_LAYOUTS_STORAGE_KEY = 'keyboard_custom_layouts';
const CUSTOM_TRANSFORMS_STORAGE_KEY = 'keyboard_custom_transforms';
const FAVORITE_SCHEMES_STORAGE_KEY = 'keyboard_favorite_schemes';
const CUSTOM_SCHEMES_STORAGE_KEY = 'keyboard_custom_schemes';
const UI_THEME_STORAGE_KEY = 'keyboard_ui_theme';

const loadFavoriteSchemes = (): string[] => {
  try {
    const raw = localStorage.getItem(FAVORITE_SCHEMES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const loadCustomSchemes = (): ColorScheme[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_SCHEMES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const loadUITheme = (): UIThemeType => {
  try {
    const raw = localStorage.getItem(UI_THEME_STORAGE_KEY);
    if (raw && ['midnight', 'sunset', 'ocean', 'forest', 'cyberpunk', 'minimal', 'vintage', 'aurora'].includes(raw)) {
      return raw as UIThemeType;
    }
    return 'midnight';
  } catch {
    return 'midnight';
  }
};

const loadSavedLayouts = (): Record<string, LayoutConfig> => {
  try {
    const raw = localStorage.getItem(CUSTOM_LAYOUTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const useKeyboardStore = create<KeyboardStore>((set, get) => ({
  layout: '65%',
  caseMaterial: 'aluminum',
  textureDetail: MATERIAL_CONFIGS['aluminum'].defaultTextureDetail,
  wearLevel: MATERIAL_CONFIGS['aluminum'].defaultWearLevel,
  engravingType: MATERIAL_CONFIGS['aluminum'].defaultEngraving,
  engravingColor: DEFAULT_ENGRAVING_COLOR,
  switchType: 'red',
  soundEnabled: true,
  zoneColors: { ...DEFAULT_ZONE_COLORS },
  pressedKeys: new Set<string>(),
  fontStyle: 'sans',
  fontSize: DEFAULT_FONT_SIZE,
  fontColor: DEFAULT_FONT_COLOR,
  selectedKeyId: null,
  selectedStickerId: null,
  isDraggingSticker: false,
  keyCustoms: {},
  rgbEnabled: true,
  lightingMode: 'rainbow',
  rgbBrightness: DEFAULT_RGB_BRIGHTNESS,
  rgbSpeed: DEFAULT_RGB_SPEED,
  zoneRgbColors: { ...DEFAULT_RGB_COLORS },
  layoutEditMode: false,
  isDraggingKey: false,
  isResizingKey: false,
  savedCustomLayouts: loadSavedLayouts(),
  snapToGrid: true,
  snapGridSize: 0.05,
  collisionDetection: true,
  favoriteSchemeIds: loadFavoriteSchemes(),
  customSchemes: loadCustomSchemes(),
  activeSchemeId: null,
  customSwitchPhysics: {},
  useCustomSwitchPhysics: false,
  curveAnimationProgress: 0,
  isCurveAnimating: false,
  uiTheme: loadUITheme(),

  setLayout: (layout: LayoutType) => {
    set({ layout });
  },

  setCaseMaterial: (caseMaterial: CaseMaterial) => {
    const config = MATERIAL_CONFIGS[caseMaterial];
    set({
      caseMaterial,
      textureDetail: config.defaultTextureDetail,
      wearLevel: config.defaultWearLevel,
      engravingType: config.defaultEngraving,
    });
  },

  setTextureDetail: (textureDetail: TextureDetailLevel) => {
    set({ textureDetail });
  },

  setWearLevel: (wearLevel: WearLevel) => {
    set({ wearLevel });
  },

  setEngravingType: (engravingType: EngravingType) => {
    set({ engravingType });
  },

  setEngravingColor: (engravingColor: string) => {
    set({ engravingColor });
  },

  resetMaterialCustoms: () => {
    const state = get();
    const config = MATERIAL_CONFIGS[state.caseMaterial];
    set({
      textureDetail: config.defaultTextureDetail,
      wearLevel: config.defaultWearLevel,
      engravingType: config.defaultEngraving,
      engravingColor: DEFAULT_ENGRAVING_COLOR,
    });
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

  setIsDraggingSticker: (isDraggingSticker: boolean) => {
    set({ isDraggingSticker });
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

  setRgbEnabled: (rgbEnabled: boolean) => {
    set({ rgbEnabled });
  },

  setLightingMode: (lightingMode: LightingMode) => {
    set({ lightingMode });
  },

  setRgbBrightness: (rgbBrightness: number) => {
    set({ rgbBrightness: Math.max(0.1, Math.min(1, rgbBrightness)) });
  },

  setRgbSpeed: (rgbSpeed: number) => {
    set({ rgbSpeed: Math.max(0.2, Math.min(3, rgbSpeed)) });
  },

  setZoneRgbColor: (zone: KeyZone, color: string) => {
    set((state) => ({
      zoneRgbColors: {
        ...state.zoneRgbColors,
        [zone]: color,
      },
    }));
  },

  resetRgbColors: () => {
    set({ zoneRgbColors: { ...DEFAULT_RGB_COLORS } });
  },

  setLayoutEditMode: (layoutEditMode: boolean) => {
    set({ layoutEditMode });
  },

  setIsDraggingKey: (isDraggingKey: boolean) => {
    set({ isDraggingKey });
  },

  setIsResizingKey: (isResizingKey: boolean) => {
    set({ isResizingKey });
  },

  setKeyTransform: (keyId: string, transform: Partial<KeyTransform>) => {
    set((state) => {
      const layoutConfig = LAYOUT_CONFIGS[state.layout];
      const baseKey = layoutConfig.keys.find((k) => k.id === keyId);
      if (!baseKey) return {};

      const existing = state.keyCustoms[keyId];
      const existingTransform = existing?.transform ?? {};

      const effectiveX = transform.x ?? existingTransform.x ?? baseKey.x;
      const effectiveY = transform.y ?? existingTransform.y ?? baseKey.y;
      const effectiveWidth = transform.width ?? existingTransform.width ?? baseKey.width;
      const effectiveHeight = transform.height ?? existingTransform.height ?? baseKey.height;

      let finalX = effectiveX;
      let finalY = effectiveY;
      let finalWidth = effectiveWidth;
      let finalHeight = effectiveHeight;

      if (state.snapToGrid) {
        const snapped = snapTransformToGrid(
          {
            x: finalX,
            y: finalY,
            width: finalWidth,
            height: finalHeight,
          },
          state.snapGridSize
        );
        finalX = snapped.x ?? finalX;
        finalY = snapped.y ?? finalY;
        finalWidth = snapped.width ?? finalWidth;
        finalHeight = snapped.height ?? finalHeight;
      }

      const clamped = clampToBounds(
        finalX,
        finalY,
        finalWidth,
        finalHeight,
        layoutConfig.width,
        layoutConfig.height
      );
      finalX = clamped.x;
      finalY = clamped.y;

      if (state.collisionDetection) {
        const { collides } = checkCollisionWithOthers(
          keyId,
          finalX,
          finalY,
          finalWidth,
          finalHeight,
          layoutConfig.keys,
          state.keyCustoms,
          0.02
        );

        if (collides) {
          const nonColliding = findNonCollidingPosition(
            keyId,
            finalX,
            finalY,
            finalWidth,
            finalHeight,
            layoutConfig.keys,
            state.keyCustoms
          );
          finalX = nonColliding.x;
          finalY = nonColliding.y;

          if (state.snapToGrid) {
            finalX = snapTransformToGrid({ x: finalX }, state.snapGridSize).x ?? finalX;
            finalY = snapTransformToGrid({ y: finalY }, state.snapGridSize).y ?? finalY;
          }
        }
      }

      const newTransform: KeyTransform = {};
      if (finalX !== baseKey.x) newTransform.x = finalX;
      if (finalY !== baseKey.y) newTransform.y = finalY;
      if (finalWidth !== baseKey.width) newTransform.width = finalWidth;
      if (finalHeight !== baseKey.height) newTransform.height = finalHeight;

      const hasTransform = Object.keys(newTransform).length > 0;
      const { transform: _ignored, ...restOfExisting } = existing ?? {};
      const hasOtherCustomizations = Object.keys(restOfExisting).length > 0;

      if (!hasTransform && !hasOtherCustomizations) {
        const newKeyCustoms = { ...state.keyCustoms };
        delete newKeyCustoms[keyId];
        return { keyCustoms: newKeyCustoms };
      }

      return {
        keyCustoms: {
          ...state.keyCustoms,
          [keyId]: {
            ...existing,
            transform: hasTransform ? newTransform : undefined,
          },
        },
      };
    });
  },

  resetKeyTransform: (keyId: string) => {
    set((state) => {
      const existing = state.keyCustoms[keyId];
      if (!existing) return {};
      const { transform, ...rest } = existing;
      const newKeyCustoms = { ...state.keyCustoms };
      if (Object.keys(rest).length > 0) {
        newKeyCustoms[keyId] = rest;
      } else {
        delete newKeyCustoms[keyId];
      }
      return { keyCustoms: newKeyCustoms };
    });
  },

  resetAllKeyTransforms: () => {
    set((state) => {
      const newKeyCustoms: typeof state.keyCustoms = {};
      Object.entries(state.keyCustoms).forEach(([keyId, custom]) => {
        const { transform, ...rest } = custom;
        if (Object.keys(rest).length > 0) {
          newKeyCustoms[keyId] = rest;
        }
      });
      return { keyCustoms: newKeyCustoms };
    });
  },

  saveCustomLayout: (name: string) => {
    const state = get();
    const baseLayout = LAYOUT_CONFIGS[state.layout];
    const customKeys = baseLayout.keys.map((k) => {
      const custom = state.keyCustoms[k.id];
      if (custom?.transform) {
        return {
          ...k,
          x: custom.transform.x ?? k.x,
          y: custom.transform.y ?? k.y,
          width: custom.transform.width ?? k.width,
          height: custom.transform.height ?? k.height,
        };
      }
      return { ...k };
    });
    const newLayout: LayoutConfig = {
      type: baseLayout.type,
      name,
      description: `自定义布局 (${baseLayout.name})`,
      keys: customKeys,
      width: baseLayout.width,
      height: baseLayout.height,
    };
    const newSaved = { ...state.savedCustomLayouts, [name]: newLayout };
    try {
      localStorage.setItem(CUSTOM_LAYOUTS_STORAGE_KEY, JSON.stringify(newSaved));
    } catch {
      // ignore
    }
    set({ savedCustomLayouts: newSaved });
  },

  loadCustomLayout: (name: string) => {
    const state = get();
    const saved = state.savedCustomLayouts[name];
    if (!saved) return;
    set((currentState) => {
      const newKeyCustoms = { ...currentState.keyCustoms };
      saved.keys.forEach((k) => {
        const baseKey = LAYOUT_CONFIGS[saved.type].keys.find((bk) => bk.id === k.id);
        if (!baseKey) return;
        const existing = newKeyCustoms[k.id] ?? {};
        const transform: KeyTransform = {};
        if (k.x !== baseKey.x) transform.x = k.x;
        if (k.y !== baseKey.y) transform.y = k.y;
        if (k.width !== baseKey.width) transform.width = k.width;
        if (k.height !== baseKey.height) transform.height = k.height;
        if (Object.keys(transform).length > 0) {
          newKeyCustoms[k.id] = { ...existing, transform };
        }
      });
      return { keyCustoms: newKeyCustoms };
    });
  },

  deleteCustomLayout: (name: string) => {
    set((state) => {
      const newSaved = { ...state.savedCustomLayouts };
      delete newSaved[name];
      try {
        localStorage.setItem(CUSTOM_LAYOUTS_STORAGE_KEY, JSON.stringify(newSaved));
      } catch {
        // ignore
      }
      return { savedCustomLayouts: newSaved };
    });
  },

  setSnapToGrid: (snapToGrid: boolean) => {
    set({ snapToGrid });
  },

  setSnapGridSize: (snapGridSize: SnapGridSize) => {
    set({ snapGridSize });
  },

  setCollisionDetection: (collisionDetection: boolean) => {
    set({ collisionDetection });
  },

  applyColorScheme: (scheme: ColorScheme) => {
    set({
      zoneColors: { ...scheme.zoneColors },
      fontColor: scheme.fontColor,
      activeSchemeId: scheme.id,
    });
  },

  toggleFavoriteScheme: (schemeId: string) => {
    set((state) => {
      const isFavorited = state.favoriteSchemeIds.includes(schemeId);
      const newFavorites = isFavorited
        ? state.favoriteSchemeIds.filter((id) => id !== schemeId)
        : [...state.favoriteSchemeIds, schemeId];
      try {
        localStorage.setItem(FAVORITE_SCHEMES_STORAGE_KEY, JSON.stringify(newFavorites));
      } catch {
        // ignore
      }
      return { favoriteSchemeIds: newFavorites };
    });
  },

  addCustomScheme: (scheme: ColorScheme) => {
    set((state) => {
      const newSchemes = [...state.customSchemes, scheme];
      try {
        localStorage.setItem(CUSTOM_SCHEMES_STORAGE_KEY, JSON.stringify(newSchemes));
      } catch {
        // ignore
      }
      return { customSchemes: newSchemes };
    });
  },

  removeCustomScheme: (schemeId: string) => {
    set((state) => {
      const newSchemes = state.customSchemes.filter((s) => s.id !== schemeId);
      try {
        localStorage.setItem(CUSTOM_SCHEMES_STORAGE_KEY, JSON.stringify(newSchemes));
      } catch {
        // ignore
      }
      const newFavorites = state.favoriteSchemeIds.filter((id) => id !== schemeId);
      try {
        localStorage.setItem(FAVORITE_SCHEMES_STORAGE_KEY, JSON.stringify(newFavorites));
      } catch {
        // ignore
      }
      return {
        customSchemes: newSchemes,
        favoriteSchemeIds: newFavorites,
        activeSchemeId: state.activeSchemeId === schemeId ? null : state.activeSchemeId,
      };
    });
  },

  setActiveSchemeId: (schemeId: string | null) => {
    set({ activeSchemeId: schemeId });
  },

  setCustomSwitchPhysics: (params: Partial<SwitchPhysicsParams>) => {
    set((state) => ({
      customSwitchPhysics: {
        ...state.customSwitchPhysics,
        ...params,
      },
    }));
  },

  setUseCustomSwitchPhysics: (enabled: boolean) => {
    set({ useCustomSwitchPhysics: enabled });
  },

  resetCustomSwitchPhysics: () => {
    set({ customSwitchPhysics: {}, useCustomSwitchPhysics: false });
  },

  setCurveAnimationProgress: (progress: number) => {
    set({ curveAnimationProgress: Math.max(0, Math.min(1, progress)) });
  },

  setIsCurveAnimating: (animating: boolean) => {
    set({ isCurveAnimating: animating });
  },

  setUITheme: (theme: UIThemeType) => {
    try {
      localStorage.setItem(UI_THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
    set({ uiTheme: theme });
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
export const useIsDraggingSticker = () => useKeyboardStore((state) => state.isDraggingSticker);
export const useKeyCustom = (keyId: string) =>
  useKeyboardStore((state) => state.keyCustoms[keyId]);
export const useKeyCustoms = () => useKeyboardStore((state) => state.keyCustoms);
export const useRgbEnabled = () => useKeyboardStore((state) => state.rgbEnabled);
export const useLightingMode = () => useKeyboardStore((state) => state.lightingMode);
export const useRgbBrightness = () => useKeyboardStore((state) => state.rgbBrightness);
export const useRgbSpeed = () => useKeyboardStore((state) => state.rgbSpeed);
export const useZoneRgbColors = () => useKeyboardStore((state) => state.zoneRgbColors);
export const useLayoutEditMode = () => useKeyboardStore((state) => state.layoutEditMode);
export const useIsDraggingKey = () => useKeyboardStore((state) => state.isDraggingKey);
export const useIsResizingKey = () => useKeyboardStore((state) => state.isResizingKey);
export const useSavedCustomLayouts = () => useKeyboardStore((state) => state.savedCustomLayouts);
export const useKeyTransform = (keyId: string) =>
  useKeyboardStore((state) => state.keyCustoms[keyId]?.transform);

export const getEffectiveKeyConfig = (keyConfig: any, keyCustoms: Record<string, any>) => {
  const custom = keyCustoms[keyConfig.id];
  if (!custom?.transform) return keyConfig;
  return {
    ...keyConfig,
    x: custom.transform.x ?? keyConfig.x,
    y: custom.transform.y ?? keyConfig.y,
    width: custom.transform.width ?? keyConfig.width,
    height: custom.transform.height ?? keyConfig.height,
  };
};

export const useSnapToGrid = () => useKeyboardStore((state) => state.snapToGrid);
export const useSnapGridSize = () => useKeyboardStore((state) => state.snapGridSize);
export const useCollisionDetection = () => useKeyboardStore((state) => state.collisionDetection);
export const useFavoriteSchemeIds = () => useKeyboardStore((state) => state.favoriteSchemeIds);
export const useCustomSchemes = () => useKeyboardStore((state) => state.customSchemes);
export const useActiveSchemeId = () => useKeyboardStore((state) => state.activeSchemeId);
export const useIsSchemeFavorited = (schemeId: string) =>
  useKeyboardStore((state) => state.favoriteSchemeIds.includes(schemeId));
export const useAllSchemes = () => {
  const customSchemes = useKeyboardStore((state) => state.customSchemes);
  return { COLOR_SCHEMES, customSchemes };
};

export const useCustomSwitchPhysics = () =>
  useKeyboardStore((state) => state.customSwitchPhysics);
export const useUseCustomSwitchPhysics = () =>
  useKeyboardStore((state) => state.useCustomSwitchPhysics);
export const useCurveAnimationProgress = () =>
  useKeyboardStore((state) => state.curveAnimationProgress);
export const useIsCurveAnimating = () =>
  useKeyboardStore((state) => state.isCurveAnimating);

export const useSwitchPhysics = (): SwitchPhysicsParams => {
  const switchType = useKeyboardStore((state) => state.switchType);
  const customPhysics = useKeyboardStore((state) => state.customSwitchPhysics);
  const useCustom = useKeyboardStore((state) => state.useCustomSwitchPhysics);

  const basePhysics = SWITCH_CONFIGS[switchType].physics;

  if (useCustom) {
    return {
      ...basePhysics,
      ...customPhysics,
    };
  }

  return basePhysics;
};

export const useUITheme = () => useKeyboardStore((state) => state.uiTheme);
export const useSetUITheme = () => useKeyboardStore((state) => state.setUITheme);

export const useTextureDetail = () => useKeyboardStore((state) => state.textureDetail);
export const useWearLevel = () => useKeyboardStore((state) => state.wearLevel);
export const useEngravingType = () => useKeyboardStore((state) => state.engravingType);
export const useEngravingColor = () => useKeyboardStore((state) => state.engravingColor);
