import { KeyCapProfile, KeyCapProfileConfig } from '@/types/keyboard';

export const KEYCAP_PROFILE_CONFIGS: Record<KeyCapProfile, KeyCapProfileConfig> = {
  cherry: {
    id: 'cherry',
    name: 'Cherry',
    description: '经典圆柱形曲面，舒适手感',
    height: 0.5,
    topRadius: 0.06,
    bottomRadius: 0.08,
    sideAngle: 6,
    rowHeightVariation: [1.0, 0.9, 0.85, 0.8, 0.85, 0.9],
  },
  oem: {
    id: 'oem',
    name: 'OEM',
    description: '标准出厂规格，阶梯式高度',
    height: 0.55,
    topRadius: 0.05,
    bottomRadius: 0.07,
    sideAngle: 5,
    rowHeightVariation: [1.0, 0.95, 0.88, 0.82, 0.88, 0.95],
  },
  dsa: {
    id: 'dsa',
    name: 'DSA',
    description: '球形矮键帽，统一高度',
    height: 0.35,
    topRadius: 0.15,
    bottomRadius: 0.1,
    sideAngle: 3,
    rowHeightVariation: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
  },
  sa: {
    id: 'sa',
    name: 'SA',
    description: '高键帽球形，复古质感',
    height: 0.65,
    topRadius: 0.12,
    bottomRadius: 0.06,
    sideAngle: 8,
    rowHeightVariation: [1.0, 0.92, 0.85, 0.78, 0.85, 0.92],
  },
  xda: {
    id: 'xda',
    name: 'XDA',
    description: '扁平球面，美观低高度',
    height: 0.4,
    topRadius: 0.18,
    bottomRadius: 0.09,
    sideAngle: 2,
    rowHeightVariation: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
  },
  'low-profile': {
    id: 'low-profile',
    name: '矮轴',
    description: '超薄设计，轻便便携',
    height: 0.25,
    topRadius: 0.04,
    bottomRadius: 0.05,
    sideAngle: 3,
    rowHeightVariation: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
  },
};

export const KEYCAP_PROFILE_LIST: KeyCapProfile[] = [
  'cherry',
  'oem',
  'dsa',
  'sa',
  'xda',
  'low-profile',
];

export const DEFAULT_KEYCAP_PROFILE: KeyCapProfile = 'cherry';
