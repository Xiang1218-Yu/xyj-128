import { useKeyboardStore } from '@/store/useKeyboardStore';
import { MATERIAL_CONFIGS } from '@/data/materials';
import { SWITCH_CONFIGS } from '@/data/switches';
import { ZONE_CONFIGS } from '@/data/zones';
import { LIGHTING_MODES } from '@/data/lighting';
import { FONT_CONFIGS } from '@/data/fonts';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { KeyZone } from '@/types/keyboard';

export interface KeyboardConfigInfo {
  layout: {
    name: string;
    keyCount: number;
  };
  caseMaterial: {
    name: string;
    color: string;
  };
  switchType: {
    name: string;
    color: string;
    description: string;
  };
  font: {
    name: string;
  };
  lighting: {
    rgbEnabled: boolean;
    modeName: string;
    brightness: number;
    speed: number;
  };
  zoneColors: {
    name: string;
    color: string;
  }[];
}

export function getKeyboardConfigInfo(): KeyboardConfigInfo {
  const state = useKeyboardStore.getState();
  const layoutConfig = LAYOUT_CONFIGS[state.layout];
  const materialConfig = MATERIAL_CONFIGS[state.caseMaterial];
  const switchConfig = SWITCH_CONFIGS[state.switchType];
  const lightingConfig = LIGHTING_MODES[state.lightingMode];
  const fontConfig = FONT_CONFIGS[state.fontStyle];

  const zones: KeyZone[] = ['alphanumeric', 'function', 'navigation', 'numpad', 'modifiers', 'spacebar'];
  const zoneColors = zones.map((zone) => ({
    name: ZONE_CONFIGS[zone].name,
    color: state.zoneColors[zone],
  }));

  return {
    layout: {
      name: layoutConfig.name,
      keyCount: layoutConfig.keys.length,
    },
    caseMaterial: {
      name: materialConfig.name,
      color: materialConfig.color,
    },
    switchType: {
      name: switchConfig.name,
      color: switchConfig.color,
      description: switchConfig.description,
    },
    font: {
      name: fontConfig.name,
    },
    lighting: {
      rgbEnabled: state.rgbEnabled,
      modeName: lightingConfig.name,
      brightness: state.rgbBrightness,
      speed: state.rgbSpeed,
    },
    zoneColors,
  };
}
