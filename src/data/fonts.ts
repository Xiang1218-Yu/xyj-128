import { FontConfig, FontStyle } from '@/types/keyboard';

export const FONT_CONFIGS: Record<FontStyle, FontConfig> = {
  sans: {
    id: 'sans',
    name: '无衬线体',
    description: '现代简洁，清晰易读',
    fontWeight: 600,
  },
  serif: {
    id: 'serif',
    name: '衬线体',
    description: '经典优雅，复古风格',
    fontWeight: 600,
  },
  mono: {
    id: 'mono',
    name: '等宽字体',
    description: '代码风格，整齐划一',
    fontWeight: 600,
  },
  rounded: {
    id: 'rounded',
    name: '圆润体',
    description: '柔和可爱，圆角设计',
    fontWeight: 600,
  },
  display: {
    id: 'display',
    name: '艺术体',
    description: '粗体醒目，视觉冲击',
    fontWeight: 800,
  },
};

export const FONT_LIST: FontStyle[] = ['sans', 'serif', 'mono', 'rounded', 'display'];

export const FONT_FAMILY_MAP: Record<FontStyle, string> = {
  sans: 'Inter, system-ui, -apple-system, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
  rounded: '"Nunito", "Comic Sans MS", cursive, sans-serif',
  display: '"Impact", "Arial Black", sans-serif',
};

export const DEFAULT_FONT_SIZE = 0.38;
export const MIN_FONT_SIZE = 0.2;
export const MAX_FONT_SIZE = 0.6;
export const DEFAULT_FONT_COLOR = '#1e293b';
