import { SwitchConfig, SwitchType } from '@/types/keyboard';

export const SWITCH_CONFIGS: Record<SwitchType, SwitchConfig> = {
  red: {
    id: 'red',
    name: '红轴',
    description: '线性无声，触发轻盈顺滑',
    category: 'linear',
    color: '#ef4444',
  },
  blue: {
    id: 'blue',
    name: '青轴',
    description: '段落清脆，经典咔哒声',
    category: 'clicky',
    color: '#3b82f6',
  },
  brown: {
    id: 'brown',
    name: '茶轴',
    description: '微段落感，柔和安静',
    category: 'tactile',
    color: '#a16207',
  },
  black: {
    id: 'black',
    name: '黑轴',
    description: '线性无声，触发力度重',
    category: 'linear',
    color: '#1e293b',
  },
  silver: {
    id: 'silver',
    name: '银轴',
    description: '线性无声，短触发快速响应',
    category: 'linear',
    color: '#94a3b8',
  },
  green: {
    id: 'green',
    name: '绿轴',
    description: '段落清脆，重力度咔哒声',
    category: 'clicky',
    color: '#22c55e',
  },
};

export const SWITCH_LIST: SwitchType[] = [
  'red',
  'blue',
  'brown',
  'black',
  'silver',
  'green',
];

export const SWITCH_CATEGORY_LABELS: Record<SwitchConfig['category'], string> = {
  linear: '线性',
  tactile: '段落',
  clicky: '有声',
};
