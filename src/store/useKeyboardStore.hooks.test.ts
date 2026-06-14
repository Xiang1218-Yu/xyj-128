import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useLayout,
  useCaseMaterial,
  useSwitchType,
  useSoundEnabled,
  useZoneColors,
  usePressedKeys,
  useIsKeyPressed,
  useFontStyle,
  useFontSize,
  useFontColor,
  useSelectedKeyId,
  useSelectedStickerId,
  useIsDraggingSticker,
  useKeyCustom,
  useKeyCustoms,
  useRgbEnabled,
  useLightingMode,
  useRgbBrightness,
  useRgbSpeed,
  useZoneRgbColors,
  useLayoutEditMode,
  useIsDraggingKey,
  useIsResizingKey,
  useSavedCustomLayouts,
  useKeyTransform,
  useSnapToGrid,
  useSnapGridSize,
  useCollisionDetection,
  useFavoriteSchemeIds,
  useCustomSchemes,
  useActiveSchemeId,
  useIsSchemeFavorited,
  useAllSchemes,
  useCustomSwitchPhysics,
  useUseCustomSwitchPhysics,
  useCurveAnimationProgress,
  useIsCurveAnimating,
  useSwitchPhysics,
  useUITheme,
  useSetUITheme,
  useTextureDetail,
  useWearLevel,
  useEngravingType,
  useEngravingColor,
  useKeyCapProfile,
  useKeyCapProfileConfig,
  useKeyboardScale,
  useTypingStats,
  useKeyboardStore,
} from '@/store/useKeyboardStore';
import { DEFAULT_ZONE_COLORS } from '@/data/zones';

describe('useKeyboardStore hooks', () => {
  beforeEach(() => {
    useKeyboardStore.setState({
      layout: '65%',
      caseMaterial: 'aluminum',
      switchType: 'red',
      soundEnabled: true,
      zoneColors: { ...DEFAULT_ZONE_COLORS },
      pressedKeys: new Set<string>(),
      fontStyle: 'sans',
      selectedKeyId: null,
      selectedStickerId: null,
      isDraggingSticker: false,
      keyCustoms: {},
      rgbEnabled: true,
      lightingMode: 'rainbow',
      layoutEditMode: false,
      isDraggingKey: false,
      isResizingKey: false,
      savedCustomLayouts: {},
      snapToGrid: true,
      snapGridSize: 0.05,
      collisionDetection: true,
      favoriteSchemeIds: [],
      customSchemes: [],
      activeSchemeId: null,
      customSwitchPhysics: {},
      useCustomSwitchPhysics: false,
      curveAnimationProgress: 0,
      isCurveAnimating: false,
      uiTheme: 'midnight',
      keyCapProfile: 'cherry',
      keyboardScale: { overall: 1, keyGap: 0, tiltX: 0, tiltZ: 0 },
      typingStats: {
        totalKeyPresses: 0,
        totalKeyReleases: 0,
        startTime: null,
        lastPressTime: null,
        wpm: 0,
        accuracy: 100,
        correctChars: 0,
        totalChars: 0,
      },
    });
  });

  it('useLayout should return current layout', () => {
    const { result } = renderHook(() => useLayout());
    expect(result.current).toBe('65%');
  });

  it('useCaseMaterial should return current material', () => {
    const { result } = renderHook(() => useCaseMaterial());
    expect(result.current).toBe('aluminum');
  });

  it('useSwitchType should return current switch type', () => {
    const { result } = renderHook(() => useSwitchType());
    expect(result.current).toBe('red');
  });

  it('useSoundEnabled should return sound state', () => {
    const { result } = renderHook(() => useSoundEnabled());
    expect(result.current).toBe(true);
  });

  it('useZoneColors should return zone colors', () => {
    const { result } = renderHook(() => useZoneColors());
    expect(result.current).toEqual(DEFAULT_ZONE_COLORS);
  });

  it('usePressedKeys should return pressed keys set', () => {
    const { result } = renderHook(() => usePressedKeys());
    expect(result.current).toBeInstanceOf(Set);
  });

  it('useIsKeyPressed should check if key is pressed', () => {
    const { result } = renderHook(() => useIsKeyPressed('KeyA'));
    expect(result.current).toBe(false);
    act(() => {
      useKeyboardStore.getState().pressKey('KeyA');
    });
    expect(result.current).toBe(true);
  });

  it('useFontStyle should return font style', () => {
    const { result } = renderHook(() => useFontStyle());
    expect(result.current).toBe('sans');
  });

  it('useFontSize should return font size', () => {
    const { result } = renderHook(() => useFontSize());
    expect(typeof result.current).toBe('number');
  });

  it('useFontColor should return font color', () => {
    const { result } = renderHook(() => useFontColor());
    expect(typeof result.current).toBe('string');
  });

  it('useSelectedKeyId should return selected key id', () => {
    const { result } = renderHook(() => useSelectedKeyId());
    expect(result.current).toBeNull();
  });

  it('useSelectedStickerId should return selected sticker id', () => {
    const { result } = renderHook(() => useSelectedStickerId());
    expect(result.current).toBeNull();
  });

  it('useIsDraggingSticker should return dragging state', () => {
    const { result } = renderHook(() => useIsDraggingSticker());
    expect(result.current).toBe(false);
  });

  it('useKeyCustom should return key customization', () => {
    const { result } = renderHook(() => useKeyCustom('key1'));
    expect(result.current).toBeUndefined();
  });

  it('useKeyCustoms should return all key customs', () => {
    const { result } = renderHook(() => useKeyCustoms());
    expect(result.current).toEqual({});
  });

  it('useRgbEnabled should return RGB state', () => {
    const { result } = renderHook(() => useRgbEnabled());
    expect(result.current).toBe(true);
  });

  it('useLightingMode should return lighting mode', () => {
    const { result } = renderHook(() => useLightingMode());
    expect(result.current).toBe('rainbow');
  });

  it('useRgbBrightness should return brightness', () => {
    const { result } = renderHook(() => useRgbBrightness());
    expect(typeof result.current).toBe('number');
  });

  it('useRgbSpeed should return speed', () => {
    const { result } = renderHook(() => useRgbSpeed());
    expect(typeof result.current).toBe('number');
  });

  it('useZoneRgbColors should return zone RGB colors', () => {
    const { result } = renderHook(() => useZoneRgbColors());
    expect(result.current).toBeDefined();
  });

  it('useLayoutEditMode should return layout edit mode', () => {
    const { result } = renderHook(() => useLayoutEditMode());
    expect(result.current).toBe(false);
  });

  it('useIsDraggingKey should return dragging state', () => {
    const { result } = renderHook(() => useIsDraggingKey());
    expect(result.current).toBe(false);
  });

  it('useIsResizingKey should return resizing state', () => {
    const { result } = renderHook(() => useIsResizingKey());
    expect(result.current).toBe(false);
  });

  it('useSavedCustomLayouts should return saved layouts', () => {
    const { result } = renderHook(() => useSavedCustomLayouts());
    expect(result.current).toEqual({});
  });

  it('useKeyTransform should return key transform', () => {
    const { result } = renderHook(() => useKeyTransform('key1'));
    expect(result.current).toBeUndefined();
  });

  it('useSnapToGrid should return snap state', () => {
    const { result } = renderHook(() => useSnapToGrid());
    expect(result.current).toBe(true);
  });

  it('useSnapGridSize should return grid size', () => {
    const { result } = renderHook(() => useSnapGridSize());
    expect(result.current).toBe(0.05);
  });

  it('useCollisionDetection should return collision state', () => {
    const { result } = renderHook(() => useCollisionDetection());
    expect(result.current).toBe(true);
  });

  it('useFavoriteSchemeIds should return favorites', () => {
    const { result } = renderHook(() => useFavoriteSchemeIds());
    expect(result.current).toEqual([]);
  });

  it('useCustomSchemes should return custom schemes', () => {
    const { result } = renderHook(() => useCustomSchemes());
    expect(result.current).toEqual([]);
  });

  it('useActiveSchemeId should return active scheme', () => {
    const { result } = renderHook(() => useActiveSchemeId());
    expect(result.current).toBeNull();
  });

  it('useIsSchemeFavorited should check if scheme is favorited', () => {
    const { result } = renderHook(() => useIsSchemeFavorited('scheme1'));
    expect(result.current).toBe(false);
  });

  it('useAllSchemes should return all schemes', () => {
    const { result } = renderHook(() => useAllSchemes());
    expect(result.current.COLOR_SCHEMES).toBeDefined();
    expect(result.current.customSchemes).toEqual([]);
  });

  it('useCustomSwitchPhysics should return custom physics', () => {
    const { result } = renderHook(() => useCustomSwitchPhysics());
    expect(result.current).toEqual({});
  });

  it('useUseCustomSwitchPhysics should return custom physics flag', () => {
    const { result } = renderHook(() => useUseCustomSwitchPhysics());
    expect(result.current).toBe(false);
  });

  it('useSwitchPhysics should return base physics when not custom', () => {
    const { result } = renderHook(() => useSwitchPhysics());
    expect(result.current.totalTravel).toBeDefined();
    expect(result.current.actuationForce).toBeDefined();
  });

  it('useSwitchPhysics should merge custom physics when enabled', () => {
    act(() => {
      useKeyboardStore.getState().setCustomSwitchPhysics({ actuationForce: 80 });
      useKeyboardStore.getState().setUseCustomSwitchPhysics(true);
    });
    const { result } = renderHook(() => useSwitchPhysics());
    expect(result.current.actuationForce).toBe(80);
  });

  it('useCurveAnimationProgress should return progress', () => {
    const { result } = renderHook(() => useCurveAnimationProgress());
    expect(result.current).toBe(0);
  });

  it('useIsCurveAnimating should return animating state', () => {
    const { result } = renderHook(() => useIsCurveAnimating());
    expect(result.current).toBe(false);
  });

  it('useUITheme should return UI theme', () => {
    const { result } = renderHook(() => useUITheme());
    expect(result.current).toBe('midnight');
  });

  it('useSetUITheme should return setter function', () => {
    const { result } = renderHook(() => useSetUITheme());
    expect(typeof result.current).toBe('function');
  });

  it('useTextureDetail should return texture detail', () => {
    const { result } = renderHook(() => useTextureDetail());
    expect(result.current).toBe('high');
  });

  it('useWearLevel should return wear level', () => {
    const { result } = renderHook(() => useWearLevel());
    expect(result.current).toBe('none');
  });

  it('useEngravingType should return engraving type', () => {
    const { result } = renderHook(() => useEngravingType());
    expect(result.current).toBe('logo');
  });

  it('useEngravingColor should return engraving color', () => {
    const { result } = renderHook(() => useEngravingColor());
    expect(typeof result.current).toBe('string');
  });

  it('useKeyCapProfile should return keycap profile', () => {
    const { result } = renderHook(() => useKeyCapProfile());
    expect(result.current).toBe('cherry');
  });

  it('useKeyCapProfileConfig should return profile config', () => {
    const { result } = renderHook(() => useKeyCapProfileConfig());
    expect(result.current.id).toBe('cherry');
    expect(result.current.height).toBeGreaterThan(0);
  });

  it('useKeyboardScale should return keyboard scale', () => {
    const { result } = renderHook(() => useKeyboardScale());
    expect(result.current.overall).toBe(1);
  });

  it('useTypingStats should return typing stats', () => {
    const { result } = renderHook(() => useTypingStats());
    expect(result.current.totalKeyPresses).toBe(0);
    expect(result.current.accuracy).toBe(100);
  });
});
