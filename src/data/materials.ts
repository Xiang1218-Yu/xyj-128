import { MaterialConfig, CaseMaterial, TextureDetailLevel, WearLevel, EngravingType } from '@/types/keyboard';

export const TEXTURE_DETAIL_OPTIONS: { id: TextureDetailLevel; name: string; description: string }[] = [
  { id: 'low', name: '低', description: '基础纹理，性能最佳' },
  { id: 'medium', name: '中', description: '平衡纹理质量与性能' },
  { id: 'high', name: '高', description: '丰富纹理细节' },
  { id: 'ultra', name: '超高', description: '极致细节，需要更强GPU' },
];

export const WEAR_LEVEL_OPTIONS: { id: WearLevel; name: string; description: string }[] = [
  { id: 'none', name: '全新', description: '无磨损痕迹' },
  { id: 'light', name: '轻微', description: '细微使用痕迹' },
  { id: 'moderate', name: '中等', description: '明显使用磨损' },
  { id: 'heavy', name: '严重', description: '重度磨损痕迹' },
  { id: 'vintage', name: '复古', description: '经典复古质感' },
];

export const ENGRAVING_OPTIONS: { id: EngravingType; name: string; emoji: string }[] = [
  { id: 'none', name: '无雕刻', emoji: '⬜' },
  { id: 'logo', name: '品牌Logo', emoji: '🔷' },
  { id: 'geometric', name: '几何图案', emoji: '🔶' },
  { id: 'floral', name: '花卉纹样', emoji: '🌸' },
  { id: 'circuit', name: '电路板', emoji: '⚡' },
  { id: 'dragon', name: '龙纹雕刻', emoji: '🐉' },
  { id: 'custom', name: '自定义', emoji: '✏️' },
];

export const DEFAULT_ENGRAVING_COLOR = '#00ffaa';

export const MATERIAL_CONFIGS: Record<CaseMaterial, MaterialConfig> = {
  aluminum: {
    id: 'aluminum',
    name: '铝合金',
    color: '#8a8f98',
    roughness: 0.18,
    metalness: 0.95,
    defaultTextureDetail: 'high',
    defaultWearLevel: 'none',
    defaultEngraving: 'logo',
  },
  plastic: {
    id: 'plastic',
    name: 'ABS塑料',
    color: '#2d3748',
    roughness: 0.45,
    metalness: 0.02,
    defaultTextureDetail: 'medium',
    defaultWearLevel: 'light',
    defaultEngraving: 'none',
  },
  wood: {
    id: 'wood',
    name: '实木',
    color: '#7c4a1e',
    roughness: 0.72,
    metalness: 0.0,
    defaultTextureDetail: 'ultra',
    defaultWearLevel: 'moderate',
    defaultEngraving: 'floral',
  },
  carbon: {
    id: 'carbon',
    name: '碳纤维',
    color: '#1a1f2e',
    roughness: 0.28,
    metalness: 0.4,
    defaultTextureDetail: 'high',
    defaultWearLevel: 'none',
    defaultEngraving: 'circuit',
  },
};

export const MATERIAL_LIST: CaseMaterial[] = [
  'aluminum',
  'plastic',
  'wood',
  'carbon',
];

export const PRESET_COLORS: string[] = [
  '#f8fafc',
  '#fef3c7',
  '#fde68a',
  '#fca5a5',
  '#f87171',
  '#ef4444',
  '#fb923c',
  '#f97316',
  '#fbbf24',
  '#f59e0b',
  '#a3e635',
  '#84cc16',
  '#4ade80',
  '#22c55e',
  '#34d399',
  '#10b981',
  '#2dd4bf',
  '#14b8a6',
  '#38bdf8',
  '#0ea5e9',
  '#60a5fa',
  '#3b82f6',
  '#818cf8',
  '#6366f1',
  '#a78bfa',
  '#8b5cf6',
  '#c084fc',
  '#a855f7',
  '#f0abfc',
  '#d946ef',
  '#f472b6',
  '#ec4899',
  '#64748b',
  '#334155',
  '#1e293b',
  '#0f172a',
];
