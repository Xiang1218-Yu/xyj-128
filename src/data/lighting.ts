import { LightingMode, LightingModeConfig, KeyZone } from '@/types/keyboard';

export const LIGHTING_MODES: Record<LightingMode, LightingModeConfig> = {
  static: {
    id: 'static',
    name: '静态常亮',
    description: '所有区域保持固定颜色',
    icon: 'lightbulb',
  },
  breathing: {
    id: 'breathing',
    name: '呼吸灯',
    description: '颜色按呼吸节奏渐变明暗',
    icon: 'wind',
  },
  wave: {
    id: 'wave',
    name: '波浪流动',
    description: '灯光以波浪形式横向流动',
    icon: 'waves',
  },
  rainbow: {
    id: 'rainbow',
    name: '彩虹渐变',
    description: '全区域彩虹色循环流动',
    icon: 'rainbow',
  },
  reactive: {
    id: 'reactive',
    name: '按键响应',
    description: '按下按键时触发灯光高亮',
    icon: 'zap',
  },
  ripple: {
    id: 'ripple',
    name: '涟漪扩散',
    description: '按键时产生涟漪扩散效果',
    icon: 'radio',
  },
  starlight: {
    id: 'starlight',
    name: '星光闪烁',
    description: '随机按键如星光般闪烁',
    icon: 'sparkles',
  },
  marquee: {
    id: 'marquee',
    name: '跑马灯',
    description: '灯光沿键盘边缘跑马流动',
    icon: 'arrow-right-left',
  },
};

export const LIGHTING_MODE_LIST: LightingMode[] = [
  'static',
  'breathing',
  'wave',
  'rainbow',
  'reactive',
  'ripple',
  'starlight',
  'marquee',
];

export const DEFAULT_RGB_COLORS: Record<KeyZone, string> = {
  alphanumeric: '#3b82f6',
  function: '#8b5cf6',
  navigation: '#06b6d4',
  numpad: '#10b981',
  modifiers: '#f59e0b',
  spacebar: '#ef4444',
};

export const DEFAULT_RGB_BRIGHTNESS = 0.8;
export const DEFAULT_RGB_SPEED = 1.0;
export const MIN_RGB_BRIGHTNESS = 0.1;
export const MAX_RGB_BRIGHTNESS = 1.0;
export const MIN_RGB_SPEED = 0.2;
export const MAX_RGB_SPEED = 3.0;
