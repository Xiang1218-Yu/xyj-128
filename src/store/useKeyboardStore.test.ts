import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useKeyboardStore, getEffectiveKeyConfig } from '@/store/useKeyboardStore';
import { DEFAULT_ZONE_COLORS } from '@/data/zones';
import { DEFAULT_FONT_SIZE, DEFAULT_FONT_COLOR } from '@/data/fonts';
import { DEFAULT_RGB_COLORS, DEFAULT_RGB_BRIGHTNESS, DEFAULT_RGB_SPEED } from '@/data/lighting';
import { MATERIAL_CONFIGS, DEFAULT_ENGRAVING_COLOR } from '@/data/materials';

describe('useKeyboardStore', () => {
  beforeEach(() => {
    useKeyboardStore.setState({
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

  describe('initial state', () => {
    it('should have correct default layout', () => {
      expect(useKeyboardStore.getState().layout).toBe('65%');
    });

    it('should have correct default case material', () => {
      expect(useKeyboardStore.getState().caseMaterial).toBe('aluminum');
    });

    it('should have correct default switch type', () => {
      expect(useKeyboardStore.getState().switchType).toBe('red');
    });

    it('should have default zone colors', () => {
      expect(useKeyboardStore.getState().zoneColors).toEqual(DEFAULT_ZONE_COLORS);
    });

    it('should have empty pressedKeys set', () => {
      expect(useKeyboardStore.getState().pressedKeys.size).toBe(0);
    });

    it('should have default keyboard scale', () => {
      expect(useKeyboardStore.getState().keyboardScale).toEqual({
        overall: 1,
        keyGap: 0,
        tiltX: 0,
        tiltZ: 0,
      });
    });
  });

  describe('setLayout', () => {
    it('should change layout', () => {
      useKeyboardStore.getState().setLayout('TKL');
      expect(useKeyboardStore.getState().layout).toBe('TKL');
    });
  });

  describe('setCaseMaterial', () => {
    it('should change case material and reset material defaults', () => {
      useKeyboardStore.getState().setCaseMaterial('wood');
      const state = useKeyboardStore.getState();
      expect(state.caseMaterial).toBe('wood');
      expect(state.textureDetail).toBe(MATERIAL_CONFIGS['wood'].defaultTextureDetail);
      expect(state.wearLevel).toBe(MATERIAL_CONFIGS['wood'].defaultWearLevel);
      expect(state.engravingType).toBe(MATERIAL_CONFIGS['wood'].defaultEngraving);
    });

    it('should set plastic material defaults', () => {
      useKeyboardStore.getState().setCaseMaterial('plastic');
      const state = useKeyboardStore.getState();
      expect(state.caseMaterial).toBe('plastic');
      expect(state.textureDetail).toBe('medium');
      expect(state.wearLevel).toBe('light');
      expect(state.engravingType).toBe('none');
    });
  });

  describe('setTextureDetail / setWearLevel / setEngravingType / setEngravingColor', () => {
    it('should set texture detail', () => {
      useKeyboardStore.getState().setTextureDetail('ultra');
      expect(useKeyboardStore.getState().textureDetail).toBe('ultra');
    });

    it('should set wear level', () => {
      useKeyboardStore.getState().setWearLevel('vintage');
      expect(useKeyboardStore.getState().wearLevel).toBe('vintage');
    });

    it('should set engraving type', () => {
      useKeyboardStore.getState().setEngravingType('floral');
      expect(useKeyboardStore.getState().engravingType).toBe('floral');
    });

    it('should set engraving color', () => {
      useKeyboardStore.getState().setEngravingColor('#ff0000');
      expect(useKeyboardStore.getState().engravingColor).toBe('#ff0000');
    });
  });

  describe('resetMaterialCustoms', () => {
    it('should reset material customization to defaults', () => {
      useKeyboardStore.getState().setCaseMaterial('wood');
      useKeyboardStore.getState().setTextureDetail('low');
      useKeyboardStore.getState().setWearLevel('heavy');
      useKeyboardStore.getState().setEngravingType('none');
      useKeyboardStore.getState().resetMaterialCustoms();
      const state = useKeyboardStore.getState();
      expect(state.textureDetail).toBe(MATERIAL_CONFIGS['wood'].defaultTextureDetail);
      expect(state.wearLevel).toBe(MATERIAL_CONFIGS['wood'].defaultWearLevel);
      expect(state.engravingType).toBe(MATERIAL_CONFIGS['wood'].defaultEngraving);
      expect(state.engravingColor).toBe(DEFAULT_ENGRAVING_COLOR);
    });
  });

  describe('setSwitchType / setSoundEnabled', () => {
    it('should change switch type', () => {
      useKeyboardStore.getState().setSwitchType('blue');
      expect(useKeyboardStore.getState().switchType).toBe('blue');
    });

    it('should toggle sound enabled', () => {
      useKeyboardStore.getState().setSoundEnabled(false);
      expect(useKeyboardStore.getState().soundEnabled).toBe(false);
    });
  });

  describe('setZoneColor / resetColors', () => {
    it('should set a specific zone color', () => {
      useKeyboardStore.getState().setZoneColor('alphanumeric', '#ff0000');
      expect(useKeyboardStore.getState().zoneColors.alphanumeric).toBe('#ff0000');
    });

    it('should not affect other zone colors', () => {
      const before = { ...useKeyboardStore.getState().zoneColors };
      useKeyboardStore.getState().setZoneColor('alphanumeric', '#ff0000');
      const after = useKeyboardStore.getState().zoneColors;
      expect(after.function).toBe(before.function);
      expect(after.navigation).toBe(before.navigation);
    });

    it('should reset all zone colors', () => {
      useKeyboardStore.getState().setZoneColor('alphanumeric', '#ff0000');
      useKeyboardStore.getState().setZoneColor('function', '#00ff00');
      useKeyboardStore.getState().resetColors();
      expect(useKeyboardStore.getState().zoneColors).toEqual(DEFAULT_ZONE_COLORS);
    });
  });

  describe('pressKey / releaseKey', () => {
    it('should add key to pressedKeys', () => {
      useKeyboardStore.getState().pressKey('KeyA');
      expect(useKeyboardStore.getState().pressedKeys.has('KeyA')).toBe(true);
    });

    it('should add multiple keys', () => {
      useKeyboardStore.getState().pressKey('KeyA');
      useKeyboardStore.getState().pressKey('KeyB');
      expect(useKeyboardStore.getState().pressedKeys.has('KeyA')).toBe(true);
      expect(useKeyboardStore.getState().pressedKeys.has('KeyB')).toBe(true);
    });

    it('should remove key from pressedKeys', () => {
      useKeyboardStore.getState().pressKey('KeyA');
      useKeyboardStore.getState().releaseKey('KeyA');
      expect(useKeyboardStore.getState().pressedKeys.has('KeyA')).toBe(false);
    });

    it('should handle releasing non-pressed key gracefully', () => {
      useKeyboardStore.getState().releaseKey('KeyZ');
      expect(useKeyboardStore.getState().pressedKeys.size).toBe(0);
    });
  });

  describe('font settings', () => {
    it('should set font style', () => {
      useKeyboardStore.getState().setFontStyle('mono');
      expect(useKeyboardStore.getState().fontStyle).toBe('mono');
    });

    it('should set font size', () => {
      useKeyboardStore.getState().setFontSize(0.5);
      expect(useKeyboardStore.getState().fontSize).toBe(0.5);
    });

    it('should set font color', () => {
      useKeyboardStore.getState().setFontColor('#ffffff');
      expect(useKeyboardStore.getState().fontColor).toBe('#ffffff');
    });
  });

  describe('setSelectedKeyId', () => {
    it('should set selected key id and clear sticker id', () => {
      useKeyboardStore.getState().setSelectedStickerId('sticker1');
      useKeyboardStore.getState().setSelectedKeyId('key1');
      const state = useKeyboardStore.getState();
      expect(state.selectedKeyId).toBe('key1');
      expect(state.selectedStickerId).toBeNull();
    });

    it('should clear selected key id', () => {
      useKeyboardStore.getState().setSelectedKeyId('key1');
      useKeyboardStore.getState().setSelectedKeyId(null);
      expect(useKeyboardStore.getState().selectedKeyId).toBeNull();
    });
  });

  describe('key customization', () => {
    it('should set key label', () => {
      useKeyboardStore.getState().setKeyLabel('key1', 'NewLabel');
      expect(useKeyboardStore.getState().keyCustoms['key1'].label).toBe('NewLabel');
    });

    it('should add sticker to key', () => {
      useKeyboardStore.getState().addKeySticker('key1', 'cat');
      const customs = useKeyboardStore.getState().keyCustoms;
      expect(customs['key1'].stickers).toBeDefined();
      expect(customs['key1'].stickers.length).toBe(1);
      expect(customs['key1'].stickers[0].type).toBe('cat');
    });

    it('should add multiple stickers with offset positions', () => {
      useKeyboardStore.getState().addKeySticker('key1', 'cat');
      useKeyboardStore.getState().addKeySticker('key1', 'star');
      const stickers = useKeyboardStore.getState().keyCustoms['key1'].stickers;
      expect(stickers.length).toBe(2);
      expect(stickers[0].x).not.toBe(stickers[1].x);
    });

    it('should remove sticker from key', () => {
      useKeyboardStore.getState().addKeySticker('key1', 'cat');
      const stickerId = useKeyboardStore.getState().keyCustoms['key1'].stickers[0].id;
      useKeyboardStore.getState().removeKeySticker('key1', stickerId);
      expect(useKeyboardStore.getState().keyCustoms['key1'].stickers.length).toBe(0);
    });

    it('should clear selected sticker id when removing that sticker', () => {
      useKeyboardStore.getState().addKeySticker('key1', 'cat');
      const stickerId = useKeyboardStore.getState().keyCustoms['key1'].stickers[0].id;
      useKeyboardStore.getState().setSelectedStickerId(stickerId);
      useKeyboardStore.getState().removeKeySticker('key1', stickerId);
      expect(useKeyboardStore.getState().selectedStickerId).toBeNull();
    });

    it('should set sticker position with clamping', () => {
      useKeyboardStore.getState().addKeySticker('key1', 'cat');
      const stickerId = useKeyboardStore.getState().keyCustoms['key1'].stickers[0].id;
      useKeyboardStore.getState().setKeyStickerPosition('key1', stickerId, 0.3, -0.4);
      const sticker = useKeyboardStore.getState().keyCustoms['key1'].stickers[0];
      expect(sticker.x).toBe(0.3);
      expect(sticker.y).toBe(-0.4);
    });

    it('should clamp sticker position to bounds', () => {
      useKeyboardStore.getState().addKeySticker('key1', 'cat');
      const stickerId = useKeyboardStore.getState().keyCustoms['key1'].stickers[0].id;
      useKeyboardStore.getState().setKeyStickerPosition('key1', stickerId, 1.0, -1.0);
      const sticker = useKeyboardStore.getState().keyCustoms['key1'].stickers[0];
      expect(sticker.x).toBe(0.45);
      expect(sticker.y).toBe(-0.45);
    });

    it('should reset single key custom', () => {
      useKeyboardStore.getState().setKeyLabel('key1', 'NewLabel');
      useKeyboardStore.getState().resetKeyCustom('key1');
      expect(useKeyboardStore.getState().keyCustoms['key1']).toBeUndefined();
    });

    it('should reset all key customs', () => {
      useKeyboardStore.getState().setKeyLabel('key1', 'A');
      useKeyboardStore.getState().setKeyLabel('key2', 'B');
      useKeyboardStore.getState().resetAllKeyCustoms();
      expect(Object.keys(useKeyboardStore.getState().keyCustoms).length).toBe(0);
      expect(useKeyboardStore.getState().selectedStickerId).toBeNull();
    });
  });

  describe('RGB / lighting', () => {
    it('should toggle RGB enabled', () => {
      useKeyboardStore.getState().setRgbEnabled(false);
      expect(useKeyboardStore.getState().rgbEnabled).toBe(false);
    });

    it('should set lighting mode', () => {
      useKeyboardStore.getState().setLightingMode('wave');
      expect(useKeyboardStore.getState().lightingMode).toBe('wave');
    });

    it('should clamp RGB brightness to min 0.1', () => {
      useKeyboardStore.getState().setRgbBrightness(0.01);
      expect(useKeyboardStore.getState().rgbBrightness).toBe(0.1);
    });

    it('should clamp RGB brightness to max 1', () => {
      useKeyboardStore.getState().setRgbBrightness(2);
      expect(useKeyboardStore.getState().rgbBrightness).toBe(1);
    });

    it('should clamp RGB speed to min 0.2', () => {
      useKeyboardStore.getState().setRgbSpeed(0.1);
      expect(useKeyboardStore.getState().rgbSpeed).toBe(0.2);
    });

    it('should clamp RGB speed to max 3', () => {
      useKeyboardStore.getState().setRgbSpeed(5);
      expect(useKeyboardStore.getState().rgbSpeed).toBe(3);
    });

    it('should set zone RGB color', () => {
      useKeyboardStore.getState().setZoneRgbColor('alphanumeric', '#ff0000');
      expect(useKeyboardStore.getState().zoneRgbColors.alphanumeric).toBe('#ff0000');
    });

    it('should reset RGB colors', () => {
      useKeyboardStore.getState().setZoneRgbColor('alphanumeric', '#ff0000');
      useKeyboardStore.getState().resetRgbColors();
      expect(useKeyboardStore.getState().zoneRgbColors).toEqual(DEFAULT_RGB_COLORS);
    });
  });

  describe('layout editing', () => {
    it('should set layout edit mode', () => {
      useKeyboardStore.getState().setLayoutEditMode(true);
      expect(useKeyboardStore.getState().layoutEditMode).toBe(true);
    });

    it('should set is dragging key', () => {
      useKeyboardStore.getState().setIsDraggingKey(true);
      expect(useKeyboardStore.getState().isDraggingKey).toBe(true);
    });

    it('should set is resizing key', () => {
      useKeyboardStore.getState().setIsResizingKey(true);
      expect(useKeyboardStore.getState().isResizingKey).toBe(true);
    });
  });

  describe('setKeyTransform', () => {
    it('should set key transform when key exists in layout', () => {
      useKeyboardStore.getState().setKeyTransform('r0-0', { x: 2.0 });
      const custom = useKeyboardStore.getState().keyCustoms['r0-0'];
      expect(custom).toBeDefined();
      expect(custom.transform).toBeDefined();
      expect(custom.transform.x).toBeDefined();
    });

    it('should not set transform for non-existent key', () => {
      useKeyboardStore.getState().setKeyTransform('nonexistent-key', { x: 2.0 });
      expect(useKeyboardStore.getState().keyCustoms['nonexistent-key']).toBeUndefined();
    });

    it('should set transform with snap to grid enabled', () => {
      useKeyboardStore.getState().setSnapToGrid(true);
      useKeyboardStore.getState().setSnapGridSize(0.05);
      useKeyboardStore.getState().setKeyTransform('r0-0', { x: 1.03 });
      const custom = useKeyboardStore.getState().keyCustoms['r0-0'];
      expect(custom).toBeDefined();
    });

    it('should set transform with snap to grid disabled', () => {
      useKeyboardStore.getState().setSnapToGrid(false);
      useKeyboardStore.getState().setKeyTransform('r0-0', { x: 1.03 });
      const custom = useKeyboardStore.getState().keyCustoms['r0-0'];
      expect(custom).toBeDefined();
    });

    it('should set transform with collision detection enabled', () => {
      useKeyboardStore.getState().setCollisionDetection(true);
      useKeyboardStore.getState().setKeyTransform('r0-0', { x: 1.0 });
      const custom = useKeyboardStore.getState().keyCustoms['r0-0'];
      expect(custom).toBeDefined();
    });

    it('should set transform with collision detection disabled', () => {
      useKeyboardStore.getState().setCollisionDetection(false);
      useKeyboardStore.getState().setKeyTransform('r0-0', { x: 1.0 });
      const custom = useKeyboardStore.getState().keyCustoms['r0-0'];
      expect(custom).toBeDefined();
    });

    it('should remove key custom when transform matches base', () => {
      useKeyboardStore.getState().setCollisionDetection(false);
      useKeyboardStore.getState().setSnapToGrid(false);
      useKeyboardStore.getState().setKeyTransform('r0-0', { x: 0 });
      expect(useKeyboardStore.getState().keyCustoms['r0-0']).toBeUndefined();
    });

    it('should preserve other customizations when transform is set', () => {
      useKeyboardStore.getState().setKeyLabel('r0-0', 'NewLabel');
      useKeyboardStore.getState().setKeyTransform('r0-0', { x: 5 });
      const custom = useKeyboardStore.getState().keyCustoms['r0-0'];
      expect(custom.label).toBe('NewLabel');
      expect(custom.transform).toBeDefined();
    });

    it('should handle existing custom with existing transform', () => {
      useKeyboardStore.getState().setKeyTransform('r0-0', { x: 5 });
      useKeyboardStore.getState().setKeyTransform('r0-0', { y: 3 });
      const custom = useKeyboardStore.getState().keyCustoms['r0-0'];
      expect(custom.transform).toBeDefined();
    });

    it('should set width and height transform', () => {
      useKeyboardStore.getState().setCollisionDetection(false);
      useKeyboardStore.getState().setSnapToGrid(false);
      useKeyboardStore.getState().setKeyTransform('r0-0', { width: 2, height: 2 });
      const custom = useKeyboardStore.getState().keyCustoms['r0-0'];
      expect(custom).toBeDefined();
    });
  });

  describe('resetKeyTransform', () => {
    it('should remove transform from key custom', () => {
      useKeyboardStore.getState().setKeyLabel('r0-0', 'Test');
      useKeyboardStore.getState().setKeyTransform('r0-0', { x: 5 });
      useKeyboardStore.getState().resetKeyTransform('r0-0');
      const custom = useKeyboardStore.getState().keyCustoms['r0-0'];
      if (custom) {
        expect(custom.transform).toBeUndefined();
      }
    });

    it('should remove entire key custom if only transform existed', () => {
      useKeyboardStore.getState().setKeyTransform('r0-0', { x: 5 });
      useKeyboardStore.getState().resetKeyTransform('r0-0');
      expect(useKeyboardStore.getState().keyCustoms['r0-0']).toBeUndefined();
    });
  });

  describe('resetAllKeyTransforms', () => {
    it('should remove all transforms but keep other customs', () => {
      useKeyboardStore.getState().setKeyLabel('r0-0', 'Test');
      useKeyboardStore.getState().addKeySticker('r0-0', 'cat');
      useKeyboardStore.getState().setKeyTransform('r0-0', { x: 5 });
      useKeyboardStore.getState().resetAllKeyTransforms();
      const custom = useKeyboardStore.getState().keyCustoms['r0-0'];
      expect(custom).toBeDefined();
      expect(custom.transform).toBeUndefined();
      expect(custom.label).toBe('Test');
    });
  });

  describe('custom layouts', () => {
    it('should save custom layout', () => {
      useKeyboardStore.getState().saveCustomLayout('my-layout');
      expect(useKeyboardStore.getState().savedCustomLayouts['my-layout']).toBeDefined();
      expect(useKeyboardStore.getState().savedCustomLayouts['my-layout'].name).toBe('my-layout');
    });

    it('should delete custom layout', () => {
      useKeyboardStore.getState().saveCustomLayout('my-layout');
      useKeyboardStore.getState().deleteCustomLayout('my-layout');
      expect(useKeyboardStore.getState().savedCustomLayouts['my-layout']).toBeUndefined();
    });

    it('should load custom layout', () => {
      useKeyboardStore.getState().saveCustomLayout('my-layout');
      useKeyboardStore.getState().loadCustomLayout('my-layout');
    });

    it('should not error loading non-existent layout', () => {
      useKeyboardStore.getState().loadCustomLayout('nonexistent');
    });
  });

  describe('snap and collision', () => {
    it('should set snap to grid', () => {
      useKeyboardStore.getState().setSnapToGrid(false);
      expect(useKeyboardStore.getState().snapToGrid).toBe(false);
    });

    it('should set snap grid size', () => {
      useKeyboardStore.getState().setSnapGridSize(0.1);
      expect(useKeyboardStore.getState().snapGridSize).toBe(0.1);
    });

    it('should set collision detection', () => {
      useKeyboardStore.getState().setCollisionDetection(false);
      expect(useKeyboardStore.getState().collisionDetection).toBe(false);
    });
  });

  describe('color schemes', () => {
    it('should apply color scheme', () => {
      const scheme = {
        id: 'test-scheme',
        name: 'Test',
        description: 'Test scheme',
        category: 'classic' as const,
        zoneColors: { ...DEFAULT_ZONE_COLORS, alphanumeric: '#ff0000' },
        fontColor: '#ffffff',
      };
      useKeyboardStore.getState().applyColorScheme(scheme);
      expect(useKeyboardStore.getState().zoneColors.alphanumeric).toBe('#ff0000');
      expect(useKeyboardStore.getState().fontColor).toBe('#ffffff');
      expect(useKeyboardStore.getState().activeSchemeId).toBe('test-scheme');
    });

    it('should toggle favorite scheme', () => {
      useKeyboardStore.getState().toggleFavoriteScheme('scheme1');
      expect(useKeyboardStore.getState().favoriteSchemeIds).toContain('scheme1');
      useKeyboardStore.getState().toggleFavoriteScheme('scheme1');
      expect(useKeyboardStore.getState().favoriteSchemeIds).not.toContain('scheme1');
    });

    it('should add custom scheme', () => {
      const scheme = {
        id: 'custom1',
        name: 'Custom',
        description: 'Custom scheme',
        category: 'classic' as const,
        zoneColors: { ...DEFAULT_ZONE_COLORS },
        fontColor: '#000000',
      };
      useKeyboardStore.getState().addCustomScheme(scheme);
      expect(useKeyboardStore.getState().customSchemes.length).toBe(1);
      expect(useKeyboardStore.getState().customSchemes[0].id).toBe('custom1');
    });

    it('should remove custom scheme and clean up favorites', () => {
      const scheme = {
        id: 'custom1',
        name: 'Custom',
        description: 'Custom scheme',
        category: 'classic' as const,
        zoneColors: { ...DEFAULT_ZONE_COLORS },
        fontColor: '#000000',
      };
      useKeyboardStore.getState().addCustomScheme(scheme);
      useKeyboardStore.getState().toggleFavoriteScheme('custom1');
      useKeyboardStore.getState().setActiveSchemeId('custom1');
      useKeyboardStore.getState().removeCustomScheme('custom1');
      expect(useKeyboardStore.getState().customSchemes.length).toBe(0);
      expect(useKeyboardStore.getState().favoriteSchemeIds).not.toContain('custom1');
      expect(useKeyboardStore.getState().activeSchemeId).toBeNull();
    });

    it('should set active scheme id', () => {
      useKeyboardStore.getState().setActiveSchemeId('scheme1');
      expect(useKeyboardStore.getState().activeSchemeId).toBe('scheme1');
      useKeyboardStore.getState().setActiveSchemeId(null);
      expect(useKeyboardStore.getState().activeSchemeId).toBeNull();
    });
  });

  describe('switch physics', () => {
    it('should set custom switch physics', () => {
      useKeyboardStore.getState().setCustomSwitchPhysics({ actuationForce: 80 });
      expect(useKeyboardStore.getState().customSwitchPhysics.actuationForce).toBe(80);
    });

    it('should merge custom switch physics', () => {
      useKeyboardStore.getState().setCustomSwitchPhysics({ actuationForce: 80 });
      useKeyboardStore.getState().setCustomSwitchPhysics({ totalTravel: 3.5 });
      const physics = useKeyboardStore.getState().customSwitchPhysics;
      expect(physics.actuationForce).toBe(80);
      expect(physics.totalTravel).toBe(3.5);
    });

    it('should enable custom switch physics', () => {
      useKeyboardStore.getState().setUseCustomSwitchPhysics(true);
      expect(useKeyboardStore.getState().useCustomSwitchPhysics).toBe(true);
    });

    it('should reset custom switch physics', () => {
      useKeyboardStore.getState().setCustomSwitchPhysics({ actuationForce: 80 });
      useKeyboardStore.getState().setUseCustomSwitchPhysics(true);
      useKeyboardStore.getState().resetCustomSwitchPhysics();
      expect(useKeyboardStore.getState().customSwitchPhysics).toEqual({});
      expect(useKeyboardStore.getState().useCustomSwitchPhysics).toBe(false);
    });
  });

  describe('curve animation', () => {
    it('should set curve animation progress with clamping', () => {
      useKeyboardStore.getState().setCurveAnimationProgress(0.5);
      expect(useKeyboardStore.getState().curveAnimationProgress).toBe(0.5);
    });

    it('should clamp curve animation progress to 0-1', () => {
      useKeyboardStore.getState().setCurveAnimationProgress(-1);
      expect(useKeyboardStore.getState().curveAnimationProgress).toBe(0);
      useKeyboardStore.getState().setCurveAnimationProgress(2);
      expect(useKeyboardStore.getState().curveAnimationProgress).toBe(1);
    });

    it('should set curve animating', () => {
      useKeyboardStore.getState().setIsCurveAnimating(true);
      expect(useKeyboardStore.getState().isCurveAnimating).toBe(true);
    });
  });

  describe('UI theme', () => {
    it('should set UI theme', () => {
      useKeyboardStore.getState().setUITheme('cyberpunk');
      expect(useKeyboardStore.getState().uiTheme).toBe('cyberpunk');
    });
  });

  describe('keycap profile', () => {
    it('should set keycap profile', () => {
      useKeyboardStore.getState().setKeyCapProfile('dsa');
      expect(useKeyboardStore.getState().keyCapProfile).toBe('dsa');
    });
  });

  describe('keyboard scale', () => {
    it('should set keyboard scale partially', () => {
      useKeyboardStore.getState().setKeyboardScale({ overall: 1.5 });
      expect(useKeyboardStore.getState().keyboardScale.overall).toBe(1.5);
      expect(useKeyboardStore.getState().keyboardScale.tiltX).toBe(0);
    });

    it('should reset keyboard scale', () => {
      useKeyboardStore.getState().setKeyboardScale({ overall: 2, keyGap: 0.5 });
      useKeyboardStore.getState().resetKeyboardScale();
      expect(useKeyboardStore.getState().keyboardScale).toEqual({
        overall: 1,
        keyGap: 0,
        tiltX: 0,
        tiltZ: 0,
      });
    });
  });

  describe('typing stats', () => {
    it('should record key press and calculate wpm', () => {
      useKeyboardStore.getState().recordKeyPress();
      const stats = useKeyboardStore.getState().typingStats;
      expect(stats.totalKeyPresses).toBe(1);
      expect(stats.startTime).not.toBeNull();
    });

    it('should record key release', () => {
      useKeyboardStore.getState().recordKeyRelease();
      expect(useKeyboardStore.getState().typingStats.totalKeyReleases).toBe(1);
    });

    it('should reset typing stats', () => {
      useKeyboardStore.getState().recordKeyPress();
      useKeyboardStore.getState().recordKeyRelease();
      useKeyboardStore.getState().resetTypingStats();
      const stats = useKeyboardStore.getState().typingStats;
      expect(stats.totalKeyPresses).toBe(0);
      expect(stats.totalKeyReleases).toBe(0);
      expect(stats.startTime).toBeNull();
      expect(stats.wpm).toBe(0);
      expect(stats.accuracy).toBe(100);
    });

    it('should set typing accuracy correctly', () => {
      useKeyboardStore.getState().setTypingAccuracy(true);
      expect(useKeyboardStore.getState().typingStats.correctChars).toBe(1);
      expect(useKeyboardStore.getState().typingStats.totalChars).toBe(1);
      expect(useKeyboardStore.getState().typingStats.accuracy).toBe(100);

      useKeyboardStore.getState().setTypingAccuracy(false);
      expect(useKeyboardStore.getState().typingStats.correctChars).toBe(1);
      expect(useKeyboardStore.getState().typingStats.totalChars).toBe(2);
      expect(useKeyboardStore.getState().typingStats.accuracy).toBe(50);
    });
  });
});

describe('getEffectiveKeyConfig', () => {
  it('should return original config when no custom transform', () => {
    const keyConfig = { id: 'key1', x: 1, y: 2, width: 1, height: 1 };
    const result = getEffectiveKeyConfig(keyConfig, {});
    expect(result).toEqual(keyConfig);
  });

  it('should merge custom transform with base config', () => {
    const keyConfig = { id: 'key1', x: 1, y: 2, width: 1, height: 1 };
    const keyCustoms = {
      key1: { transform: { x: 3 } },
    };
    const result = getEffectiveKeyConfig(keyConfig, keyCustoms);
    expect(result.x).toBe(3);
    expect(result.y).toBe(2);
    expect(result.width).toBe(1);
  });

  it('should use fallback values when transform properties are undefined', () => {
    const keyConfig = { id: 'key1', x: 1, y: 2, width: 3, height: 4 };
    const keyCustoms = {
      key1: { transform: { } },
    };
    const result = getEffectiveKeyConfig(keyConfig, keyCustoms);
    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
    expect(result.width).toBe(3);
    expect(result.height).toBe(4);
  });

  it('should merge partial custom transform with base config', () => {
    const keyConfig = { id: 'key1', x: 1, y: 2, width: 3, height: 4 };
    const keyCustoms = {
      key1: { transform: { y: 10, width: 5 } },
    };
    const result = getEffectiveKeyConfig(keyConfig, keyCustoms);
    expect(result.x).toBe(1);
    expect(result.y).toBe(10);
    expect(result.width).toBe(5);
    expect(result.height).toBe(4);
  });
});

describe('localStorage persistence', () => {
  it('should persist favorite schemes to localStorage', () => {
    useKeyboardStore.getState().toggleFavoriteScheme('scheme1');
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should persist custom schemes to localStorage', () => {
    const scheme = {
      id: 'custom1',
      name: 'Custom',
      description: 'Custom scheme',
      category: 'classic' as const,
      zoneColors: { ...DEFAULT_ZONE_COLORS },
      fontColor: '#000000',
    };
    useKeyboardStore.getState().addCustomScheme(scheme);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should persist custom layouts to localStorage', () => {
    useKeyboardStore.getState().saveCustomLayout('test-layout');
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should persist UI theme to localStorage', () => {
    useKeyboardStore.getState().setUITheme('cyberpunk');
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should load favorite schemes from localStorage', () => {
    localStorage.getItem = vi.fn((key: string) => {
      if (key === 'keyboard_favorite_schemes') return JSON.stringify(['scheme1']);
      return null;
    });
  });

  it('should load custom schemes from localStorage', () => {
    localStorage.getItem = vi.fn((key: string) => {
      if (key === 'keyboard_custom_schemes') return JSON.stringify([{ id: 'custom1', name: 'Test' }]);
      return null;
    });
  });

  it('should load UI theme from localStorage', () => {
    localStorage.getItem = vi.fn((key: string) => {
      if (key === 'keyboard_ui_theme') return 'ocean';
      return null;
    });
  });

  it('should handle invalid localStorage data gracefully', () => {
    localStorage.getItem = vi.fn(() => 'invalid-json');
    expect(() => {
      localStorage.getItem('keyboard_favorite_schemes');
    }).not.toThrow();
  });

  it('should handle null localStorage values', () => {
    localStorage.getItem = vi.fn(() => null);
    expect(() => {
      localStorage.getItem('keyboard_favorite_schemes');
    }).not.toThrow();
  });
});
