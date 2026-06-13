export type LayoutType = '60%' | '65%' | '75%' | 'TKL' | 'Full';

export type FontStyle = 'sans' | 'serif' | 'mono' | 'rounded' | 'display';

export type StickerType = 'cat' | 'star' | 'heart' | 'fire' | 'lightning' | 'music' | 'gamepad' | 'coffee' | 'rocket' | 'diamond' | 'crown';

export type KeyZone = 
  | 'alphanumeric'
  | 'function'
  | 'navigation'
  | 'numpad'
  | 'modifiers'
  | 'spacebar';

export type CaseMaterial = 'aluminum' | 'plastic' | 'wood' | 'carbon';

export type SwitchType = 'red' | 'blue' | 'brown' | 'black' | 'silver' | 'green';

export interface KeyConfig {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
  col: number;
  zone: KeyZone;
  keyCode?: string;
}

export interface LayoutConfig {
  type: LayoutType;
  name: string;
  description: string;
  keys: KeyConfig[];
  width: number;
  height: number;
}

export interface MaterialConfig {
  id: CaseMaterial;
  name: string;
  color: string;
  roughness: number;
  metalness: number;
}

export interface ZoneConfig {
  id: KeyZone;
  name: string;
  description: string;
  defaultColor: string;
}

export interface SwitchConfig {
  id: SwitchType;
  name: string;
  description: string;
  category: 'linear' | 'tactile' | 'clicky';
  color: string;
}

export interface FontConfig {
  id: FontStyle;
  name: string;
  description: string;
  fontWeight: number;
}

export interface StickerConfig {
  id: StickerType;
  name: string;
  emoji: string;
  color: string;
}

export interface StickerInstance {
  id: string;
  type: StickerType;
  x: number;
  y: number;
}

export interface KeyTransform {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface KeyCustom {
  label?: string;
  stickers?: StickerInstance[];
  transform?: KeyTransform;
}

export type LightingMode =
  | 'static'
  | 'breathing'
  | 'wave'
  | 'rainbow'
  | 'reactive'
  | 'ripple'
  | 'starlight'
  | 'marquee';

export interface LightingModeConfig {
  id: LightingMode;
  name: string;
  description: string;
  icon: string;
}

export interface ZoneRGBConfig {
  enabled: boolean;
  color: string;
}

export type SnapGridSize = 0.01 | 0.05 | 0.1 | 0.25 | 0.5;

export interface KeyboardState {
  layout: LayoutType;
  caseMaterial: CaseMaterial;
  switchType: SwitchType;
  soundEnabled: boolean;
  zoneColors: Record<KeyZone, string>;
  pressedKeys: Set<string>;
  fontStyle: FontStyle;
  fontSize: number;
  fontColor: string;
  selectedKeyId: string | null;
  selectedStickerId: string | null;
  isDraggingSticker: boolean;
  keyCustoms: Record<string, KeyCustom>;
  rgbEnabled: boolean;
  lightingMode: LightingMode;
  rgbBrightness: number;
  rgbSpeed: number;
  zoneRgbColors: Record<KeyZone, string>;
  layoutEditMode: boolean;
  isDraggingKey: boolean;
  isResizingKey: boolean;
  savedCustomLayouts: Record<string, LayoutConfig>;
  snapToGrid: boolean;
  snapGridSize: SnapGridSize;
  collisionDetection: boolean;
}

export interface KeyboardActions {
  setLayout: (layout: LayoutType) => void;
  setCaseMaterial: (material: CaseMaterial) => void;
  setSwitchType: (switchType: SwitchType) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setZoneColor: (zone: KeyZone, color: string) => void;
  pressKey: (keyId: string) => void;
  releaseKey: (keyId: string) => void;
  resetColors: () => void;
  setFontStyle: (fontStyle: FontStyle) => void;
  setFontSize: (fontSize: number) => void;
  setFontColor: (fontColor: string) => void;
  setSelectedKeyId: (keyId: string | null) => void;
  setSelectedStickerId: (stickerId: string | null) => void;
  setIsDraggingSticker: (isDragging: boolean) => void;
  setKeyLabel: (keyId: string, label: string) => void;
  addKeySticker: (keyId: string, stickerType: StickerType) => void;
  removeKeySticker: (keyId: string, stickerId: string) => void;
  setKeyStickerPosition: (keyId: string, stickerId: string, x: number, y: number) => void;
  resetKeyCustom: (keyId: string) => void;
  resetAllKeyCustoms: () => void;
  setRgbEnabled: (enabled: boolean) => void;
  setLightingMode: (mode: LightingMode) => void;
  setRgbBrightness: (brightness: number) => void;
  setRgbSpeed: (speed: number) => void;
  setZoneRgbColor: (zone: KeyZone, color: string) => void;
  resetRgbColors: () => void;
  setLayoutEditMode: (enabled: boolean) => void;
  setIsDraggingKey: (isDragging: boolean) => void;
  setIsResizingKey: (isResizing: boolean) => void;
  setKeyTransform: (keyId: string, transform: Partial<KeyTransform>) => void;
  resetKeyTransform: (keyId: string) => void;
  resetAllKeyTransforms: () => void;
  saveCustomLayout: (name: string) => void;
  loadCustomLayout: (name: string) => void;
  deleteCustomLayout: (name: string) => void;
  setSnapToGrid: (enabled: boolean) => void;
  setSnapGridSize: (size: SnapGridSize) => void;
  setCollisionDetection: (enabled: boolean) => void;
}
