import { StickerConfig, StickerType } from '@/types/keyboard';

export const STICKER_CONFIGS: Record<StickerType, StickerConfig> = {
  cat: {
    id: 'cat',
    name: '小猫',
    emoji: '🐱',
    color: '#f59e0b',
  },
  star: {
    id: 'star',
    name: '星星',
    emoji: '⭐',
    color: '#eab308',
  },
  heart: {
    id: 'heart',
    name: '爱心',
    emoji: '❤️',
    color: '#ef4444',
  },
  fire: {
    id: 'fire',
    name: '火焰',
    emoji: '🔥',
    color: '#f97316',
  },
  lightning: {
    id: 'lightning',
    name: '闪电',
    emoji: '⚡',
    color: '#fbbf24',
  },
  music: {
    id: 'music',
    name: '音乐',
    emoji: '🎵',
    color: '#8b5cf6',
  },
  gamepad: {
    id: 'gamepad',
    name: '游戏手柄',
    emoji: '🎮',
    color: '#06b6d4',
  },
  coffee: {
    id: 'coffee',
    name: '咖啡',
    emoji: '☕',
    color: '#92400e',
  },
  rocket: {
    id: 'rocket',
    name: '火箭',
    emoji: '🚀',
    color: '#6366f1',
  },
  diamond: {
    id: 'diamond',
    name: '钻石',
    emoji: '💎',
    color: '#06b6d4',
  },
  crown: {
    id: 'crown',
    name: '皇冠',
    emoji: '👑',
    color: '#f59e0b',
  },
};

export const STICKER_LIST: StickerType[] = [
  'cat',
  'star',
  'heart',
  'fire',
  'lightning',
  'music',
  'gamepad',
  'coffee',
  'rocket',
  'diamond',
  'crown',
];
