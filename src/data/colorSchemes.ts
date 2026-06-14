import { ColorScheme, ColorSchemeCategory, KeyZone } from '@/types/keyboard';

const createScheme = (
  id: string,
  name: string,
  description: string,
  category: ColorSchemeCategory,
  colors: Partial<Record<KeyZone, string>>,
  fontColor: string = '#1e293b'
): ColorScheme => ({
  id,
  name,
  description,
  category,
  zoneColors: {
    alphanumeric: colors.alphanumeric ?? '#f8fafc',
    function: colors.function ?? '#e2e8f0',
    navigation: colors.navigation ?? '#cbd5e1',
    numpad: colors.numpad ?? '#e2e8f0',
    modifiers: colors.modifiers ?? '#94a3b8',
    spacebar: colors.spacebar ?? '#64748b',
  },
  fontColor,
});

export const COLOR_SCHEME_CATEGORIES: { id: ColorSchemeCategory; name: string; icon: string }[] = [
  { id: 'classic', name: '经典', icon: '🎯' },
  { id: 'retro', name: '复古', icon: '📼' },
  { id: 'cyber', name: '赛博朋克', icon: '🌆' },
  { id: 'nature', name: '自然', icon: '🌿' },
  { id: 'pastel', name: '粉彩', icon: '🌸' },
  { id: 'dark', name: '暗黑', icon: '🌑' },
  { id: 'gaming', name: '游戏', icon: '🎮' },
  { id: 'artisan', name: '工匠', icon: '🎨' },
];

export const COLOR_SCHEMES: ColorScheme[] = [
  createScheme('classic-pbt', '经典PBT白', '永恒的经典白色PBT键帽配色', 'classic', {
    alphanumeric: '#fafafa',
    function: '#f5f5f5',
    navigation: '#eeeeee',
    numpad: '#f5f5f5',
    modifiers: '#e0e0e0',
    spacebar: '#bdbdbd',
  }, '#212121'),

  createScheme('classic-olivia', 'Olivia', '优雅的粉灰配色，女性玩家最爱', 'classic', {
    alphanumeric: '#faf7f5',
    function: '#f5ebe4',
    navigation: '#ebe0d9',
    numpad: '#f5ebe4',
    modifiers: '#e8c5b8',
    spacebar: '#d4a373',
  }, '#4a3728'),

  createScheme('classic-dolch', 'Dolch', '经典德式灰黑配色', 'classic', {
    alphanumeric: '#4a4a4a',
    function: '#3d3d3d',
    navigation: '#333333',
    numpad: '#3d3d3d',
    modifiers: '#2d2d2d',
    spacebar: '#1a1a1a',
  }, '#e0e0e0'),

  createScheme('classic-9009', '9009复古灰', '复古终端机风格配色', 'classic', {
    alphanumeric: '#d9d9d9',
    function: '#c9c9c9',
    navigation: '#b8b8b8',
    numpad: '#c9c9c9',
    modifiers: '#8a8a8a',
    spacebar: '#6b6b6b',
  }, '#1a1a1a'),

  createScheme('classic-nord', 'Nord极', '北欧简约风格冷色调', 'classic', {
    alphanumeric: '#eceff4',
    function: '#e5e9f0',
    navigation: '#d8dee9',
    numpad: '#e5e9f0',
    modifiers: '#81a1c1',
    spacebar: '#5e81ac',
  }, '#2e3440'),

  createScheme('classic-gmk-botanical', 'Botanical', '植物学家主题绿白配色', 'classic', {
    alphanumeric: '#f0f4f0',
    function: '#e5ede5',
    navigation: '#d8e6d8',
    numpad: '#e5ede5',
    modifiers: '#6b9e6b',
    spacebar: '#4a7c4a',
  }, '#2d4a2d'),

  createScheme('retro-typewriter', '打字机', '复古打字机墨绿配色', 'retro', {
    alphanumeric: '#2d4a3e',
    function: '#243d32',
    navigation: '#1c3128',
    numpad: '#243d32',
    modifiers: '#15251e',
    spacebar: '#0d1814',
  }, '#c9b896'),

  createScheme('retro-miami', '迈阿密', '80年代迈阿密霓虹风格', 'retro', {
    alphanumeric: '#ffe4e1',
    function: '#ffc0cb',
    navigation: '#ffb6c1',
    numpad: '#ffc0cb',
    modifiers: '#00ced1',
    spacebar: '#20b2aa',
  }, '#8b008b'),

  createScheme('retro-synthwave', '合成波', '80年代电子音乐风格', 'retro', {
    alphanumeric: '#1a0a2e',
    function: '#2d1b4e',
    navigation: '#3d2566',
    numpad: '#2d1b4e',
    modifiers: '#ff6b9d',
    spacebar: '#ff2e63',
  }, '#ffd700'),

  createScheme('retro-macintosh', 'Macintosh', '经典Macintosh米色', 'retro', {
    alphanumeric: '#f5f5dc',
    function: '#eee8cd',
    navigation: '#e5dcb8',
    numpad: '#eee8cd',
    modifiers: '#c4b896',
    spacebar: '#a89878',
  }, '#3d3d3d'),

  createScheme('retro-terminal', '终端机', '复古绿屏终端', 'retro', {
    alphanumeric: '#0a0a0a',
    function: '#151515',
    navigation: '#1f1f1f',
    numpad: '#151515',
    modifiers: '#2d2d2d',
    spacebar: '#3d3d3d',
  }, '#33ff33'),

  createScheme('retro-70s', '70年代橙', '70年代复古橙色', 'retro', {
    alphanumeric: '#fff3e0',
    function: '#ffe0b2',
    navigation: '#ffcc80',
    numpad: '#ffe0b2',
    modifiers: '#ff9800',
    spacebar: '#e65100',
  }, '#3e2723'),

  createScheme('cyber-neon', '霓虹都市', '赛博朋克霓虹紫绿配色', 'cyber', {
    alphanumeric: '#0d0221',
    function: '#1a0533',
    navigation: '#260945',
    numpad: '#1a0533',
    modifiers: '#a855f7',
    spacebar: '#22d3ee',
  }, '#e879f9'),

  createScheme('cyber-matrix', '黑客帝国', '矩阵代码雨风格', 'cyber', {
    alphanumeric: '#000000',
    function: '#050505',
    navigation: '#0a0a0a',
    numpad: '#050505',
    modifiers: '#0f3d0f',
    spacebar: '#006600',
  }, '#00ff41'),

  createScheme('cyber-ghost', '赛博幽灵', '冷色调赛博朋克', 'cyber', {
    alphanumeric: '#0f1729',
    function: '#131e3a',
    navigation: '#18254a',
    numpad: '#131e3a',
    modifiers: '#00d4ff',
    spacebar: '#ff006e',
  }, '#80deea'),

  createScheme('cyber-chrome', '镀铬机械', '机械感金属镀铬', 'cyber', {
    alphanumeric: '#1a1a2e',
    function: '#16213e',
    navigation: '#0f3460',
    numpad: '#16213e',
    modifiers: '#533483',
    spacebar: '#e94560',
  }, '#c0c0c0'),

  createScheme('cyber-y2k', 'Y2K千禧', '千禧年未来主义', 'cyber', {
    alphanumeric: '#1e1e2e',
    function: '#282842',
    navigation: '#313152',
    numpad: '#282842',
    modifiers: '#00ffff',
    spacebar: '#ff00ff',
  }, '#ff6ec7'),

  createScheme('cyber-edgerunner', '边缘行者', '夜之城风格', 'cyber', {
    alphanumeric: '#0b0b1f',
    function: '#141432',
    navigation: '#1c1c42',
    numpad: '#141432',
    modifiers: '#ffff00',
    spacebar: '#ff0080',
  }, '#00ffff'),

  createScheme('nature-forest', '森林', '深林绿意盎然', 'nature', {
    alphanumeric: '#e8f5e9',
    function: '#c8e6c9',
    navigation: '#a5d6a7',
    numpad: '#c8e6c9',
    modifiers: '#66bb6a',
    spacebar: '#2e7d32',
  }, '#1b5e20'),

  createScheme('nature-ocean', '深海', '深邃海洋蓝', 'nature', {
    alphanumeric: '#e3f2fd',
    function: '#bbdefb',
    navigation: '#90caf9',
    numpad: '#bbdefb',
    modifiers: '#42a5f5',
    spacebar: '#1565c0',
  }, '#0d47a1'),

  createScheme('nature-sunset', '日落', '温暖的黄昏色调', 'nature', {
    alphanumeric: '#fff3e0',
    function: '#ffe0b2',
    navigation: '#ffcc80',
    numpad: '#ffe0b2',
    modifiers: '#ff7043',
    spacebar: '#d84315',
  }, '#bf360c'),

  createScheme('nature-mountain', '雪山', '冷冽的雪山配色', 'nature', {
    alphanumeric: '#f0f9ff',
    function: '#e0f2fe',
    navigation: '#bae6fd',
    numpad: '#e0f2fe',
    modifiers: '#38bdf8',
    spacebar: '#0369a1',
  }, '#0c4a6e'),

  createScheme('nature-autumn', '秋叶', '秋季暖色调', 'nature', {
    alphanumeric: '#fff8e1',
    function: '#ffecb3',
    navigation: '#ffe082',
    numpad: '#ffecb3',
    modifiers: '#ffa726',
    spacebar: '#ef6c00',
  }, '#e65100'),

  createScheme('nature-lavender', '薰衣草', '普罗旺斯薰衣草田', 'nature', {
    alphanumeric: '#f3e5f5',
    function: '#e1bee7',
    navigation: '#ce93d8',
    numpad: '#e1bee7',
    modifiers: '#ab47bc',
    spacebar: '#7b1fa2',
  }, '#4a148c'),

  createScheme('pastel-cream', '奶油草莓', '甜美奶油色', 'pastel', {
    alphanumeric: '#fff5f5',
    function: '#ffe4e6',
    navigation: '#fecdd3',
    numpad: '#ffe4e6',
    modifiers: '#fda4af',
    spacebar: '#fb7185',
  }, '#9f1239'),

  createScheme('pastel-mint', '薄荷糖', '清爽薄荷绿', 'pastel', {
    alphanumeric: '#f0fdf4',
    function: '#dcfce7',
    navigation: '#bbf7d0',
    numpad: '#dcfce7',
    modifiers: '#86efac',
    spacebar: '#4ade80',
  }, '#166534'),

  createScheme('pastel-blueberry', '蓝莓奶昔', '柔和蓝莓紫色', 'pastel', {
    alphanumeric: '#f5f3ff',
    function: '#ede9fe',
    navigation: '#ddd6fe',
    numpad: '#ede9fe',
    modifiers: '#a78bfa',
    spacebar: '#8b5cf6',
  }, '#5b21b6'),

  createScheme('pastel-peach', '蜜桃乌龙', '温暖蜜桃色', 'pastel', {
    alphanumeric: '#fff7ed',
    function: '#ffedd5',
    navigation: '#fed7aa',
    numpad: '#ffedd5',
    modifiers: '#fdba74',
    spacebar: '#fb923c',
  }, '#9a3412'),

  createScheme('pastel-lilac', '丁香紫', '梦幻丁香花', 'pastel', {
    alphanumeric: '#fdf4ff',
    function: '#fae8ff',
    navigation: '#f5d0fe',
    numpad: '#fae8ff',
    modifiers: '#e879f9',
    spacebar: '#d946ef',
  }, '#86198f'),

  createScheme('pastel-sky', '天空蓝', '清澈天空色', 'pastel', {
    alphanumeric: '#f0f9ff',
    function: '#e0f2fe',
    navigation: '#bae6fd',
    numpad: '#e0f2fe',
    modifiers: '#7dd3fc',
    spacebar: '#38bdf8',
  }, '#0369a1'),

  createScheme('dark-goth', '哥特', '纯黑哥特风格', 'dark', {
    alphanumeric: '#1a1a1a',
    function: '#141414',
    navigation: '#0f0f0f',
    numpad: '#141414',
    modifiers: '#0a0a0a',
    spacebar: '#050505',
  }, '#8b0000'),

  createScheme('dark-vampire', '吸血鬼', '暗夜血红色', 'dark', {
    alphanumeric: '#1a0a0a',
    function: '#2d1515',
    navigation: '#3d1e1e',
    numpad: '#2d1515',
    modifiers: '#6b0f1a',
    spacebar: '#9b1c2c',
  }, '#dc2626'),

  createScheme('dark-midnight', '午夜', '深邃午夜蓝', 'dark', {
    alphanumeric: '#0a0f1a',
    function: '#141e30',
    navigation: '#1e2a45',
    numpad: '#141e30',
    modifiers: '#2d4a6d',
    spacebar: '#3d5a80',
  }, '#98c1d9'),

  createScheme('dark-obsidian', '黑曜石', '黑曜石黑金色', 'dark', {
    alphanumeric: '#121212',
    function: '#1e1e1e',
    navigation: '#2a2a2a',
    numpad: '#1e1e1e',
    modifiers: '#4a4a4a',
    spacebar: '#6b6b6b',
  }, '#ffd700'),

  createScheme('dark-void', '虚空', '绝对虚空黑', 'dark', {
    alphanumeric: '#0d0d0d',
    function: '#0a0a0a',
    navigation: '#070707',
    numpad: '#0a0a0a',
    modifiers: '#050505',
    spacebar: '#000000',
  }, '#00ffff'),

  createScheme('dark-royal', '皇家暗紫', '高贵暗紫色', 'dark', {
    alphanumeric: '#1a0a2e',
    function: '#251247',
    navigation: '#301a5c',
    numpad: '#251247',
    modifiers: '#5a2a9e',
    spacebar: '#7c3aed',
  }, '#fbbf24'),

  createScheme('gaming-razer', '雷蛇绿', '经典雷蛇电竞绿', 'gaming', {
    alphanumeric: '#1a1a1a',
    function: '#141414',
    navigation: '#0f0f0f',
    numpad: '#141414',
    modifiers: '#0d4d0d',
    spacebar: '#00ff00',
  }, '#00ff00'),

  createScheme('gaming-rog', 'ROG败家之眼', '华硕ROG风格', 'gaming', {
    alphanumeric: '#1a0000',
    function: '#2d0000',
    navigation: '#400000',
    numpad: '#2d0000',
    modifiers: '#6b0000',
    spacebar: '#dc143c',
  }, '#ff0000'),

  createScheme('gaming-logitech', 'Logitech蓝', '罗技电竞蓝', 'gaming', {
    alphanumeric: '#0a0a1a',
    function: '#0f0f2d',
    navigation: '#141440',
    numpad: '#0f0f2d',
    modifiers: '#0066cc',
    spacebar: '#0088ff',
  }, '#00bfff'),

  createScheme('gaming-apex', 'Apex英雄', 'Apex英雄主题', 'gaming', {
    alphanumeric: '#0f1a0f',
    function: '#1a2d1a',
    navigation: '#254025',
    numpad: '#1a2d1a',
    modifiers: '#ff4500',
    spacebar: '#ff6600',
  }, '#ffd700'),

  createScheme('gaming-csgo', 'CS:GO', '反恐精英主题', 'gaming', {
    alphanumeric: '#1a1a0a',
    function: '#2d2d0f',
    navigation: '#404014',
    numpad: '#2d2d0f',
    modifiers: '#d4af37',
    spacebar: '#ffd700',
  }, '#ff6347'),

  createScheme('gaming-valorant', 'Valorant', '瓦罗兰特主题', 'gaming', {
    alphanumeric: '#1a0505',
    function: '#2d0a0a',
    navigation: '#400f0f',
    numpad: '#2d0a0a',
    modifiers: '#ff4655',
    spacebar: '#ff1525',
  }, '#ffffff'),

  createScheme('artisan-wood', '原木', '天然原木纹理', 'artisan', {
    alphanumeric: '#d4a574',
    function: '#c4956a',
    navigation: '#b08050',
    numpad: '#c4956a',
    modifiers: '#8b6914',
    spacebar: '#6b4423',
  }, '#3e2723'),

  createScheme('artisan-marble', '大理石', '高贵大理石纹', 'artisan', {
    alphanumeric: '#f5f5f5',
    function: '#e8e8e8',
    navigation: '#dcdcdc',
    numpad: '#e8e8e8',
    modifiers: '#c0c0c0',
    spacebar: '#808080',
  }, '#2f4f4f'),

  createScheme('artisan-coffee', '咖啡', '精品咖啡色系', 'artisan', {
    alphanumeric: '#fff8e7',
    function: '#f5e6c8',
    navigation: '#e8d4a8',
    numpad: '#f5e6c8',
    modifiers: '#8b6914',
    spacebar: '#6f4e37',
  }, '#3e2723'),

  createScheme('artisan-bamboo', '竹', '东方竹韵', 'artisan', {
    alphanumeric: '#f0fff0',
    function: '#e0ffe0',
    navigation: '#c8ffc8',
    numpad: '#e0ffe0',
    modifiers: '#7ccd7c',
    spacebar: '#458b45',
  }, '#2f4f2f'),

  createScheme('artisan-leather', '皮革', '奢华皮革质感', 'artisan', {
    alphanumeric: '#8b4513',
    function: '#7a3c11',
    navigation: '#69330f',
    numpad: '#7a3c11',
    modifiers: '#5c2a0d',
    spacebar: '#4a200a',
  }, '#f4e4bc'),

  createScheme('artisan-ceramic', '陶瓷', '精致陶瓷白', 'artisan', {
    alphanumeric: '#fffeff',
    function: '#fafafa',
    navigation: '#f5f5f5',
    numpad: '#fafafa',
    modifiers: '#e8e8e8',
    spacebar: '#d4d4d4',
  }, '#2c3e50'),

  createScheme('gaming-dota', 'DOTA2', '刀塔主题配色', 'gaming', {
    alphanumeric: '#0a0a1a',
    function: '#14142d',
    navigation: '#1e1e40',
    numpad: '#14142d',
    modifiers: '#dc143c',
    spacebar: '#ff4500',
  }, '#ffd700'),

  createScheme('gaming-minecraft', '我的世界', '像素风格配色', 'gaming', {
    alphanumeric: '#3d3d29',
    function: '#2d2d1f',
    navigation: '#1f1f14',
    numpad: '#2d2d1f',
    modifiers: '#4a7c20',
    spacebar: '#6b8e23',
  }, '#8b4513'),

  createScheme('retro-gameboy', 'GameBoy', '经典GameBoy灰绿', 'retro', {
    alphanumeric: '#c0c0c0',
    function: '#b0b0b0',
    navigation: '#a0a0a0',
    numpad: '#b0b0b0',
    modifiers: '#808080',
    spacebar: '#606060',
  }, '#0f380f'),

  createScheme('cyber-arcade', '街机霓虹', '复古街机厅霓虹', 'cyber', {
    alphanumeric: '#1a0a2e',
    function: '#2d1b4e',
    navigation: '#3d2566',
    numpad: '#2d1b4e',
    modifiers: '#ff00ff',
    spacebar: '#00ffff',
  }, '#ffff00'),

  createScheme('nature-coral', '珊瑚礁', '热带珊瑚礁配色', 'nature', {
    alphanumeric: '#ffe4e1',
    function: '#ffcdd2',
    navigation: '#ef9a9a',
    numpad: '#ffcdd2',
    modifiers: '#ef5350',
    spacebar: '#e53935',
  }, '#b71c1c'),

  createScheme('pastel-cloud', '云朵棉花糖', '梦幻云朵色', 'pastel', {
    alphanumeric: '#ffffff',
    function: '#f8f9fa',
    navigation: '#e9ecef',
    numpad: '#f8f9fa',
    modifiers: '#dee2e6',
    spacebar: '#ced4da',
  }, '#ff99cc'),

  createScheme('dark-wizard', '黑巫师', '暗黑魔法风格', 'dark', {
    alphanumeric: '#1a0a2e',
    function: '#150824',
    navigation: '#10061a',
    numpad: '#150824',
    modifiers: '#2d1b4e',
    spacebar: '#4a2c7a',
  }, '#9d4edd'),

  createScheme('classic-modern-dolch', '现代Dolch', '现代版Dolch灰', 'classic', {
    alphanumeric: '#525252',
    function: '#404040',
    navigation: '#333333',
    numpad: '#404040',
    modifiers: '#262626',
    spacebar: '#171717',
  }, '#f5f5f5'),

  createScheme('artisan-ink', '水墨', '东方水墨意境', 'artisan', {
    alphanumeric: '#fafafa',
    function: '#f0f0f0',
    navigation: '#e5e5e5',
    numpad: '#f0f0f0',
    modifiers: '#737373',
    spacebar: '#262626',
  }, '#171717'),

  createScheme('gaming-overwatch', '守望先锋', 'OW主题配色', 'gaming', {
    alphanumeric: '#0a1a2a',
    function: '#0f2840',
    navigation: '#143656',
    numpad: '#0f2840',
    modifiers: '#f99e1a',
    spacebar: '#40b4e5',
  }, '#ffffff'),

  createScheme('nature-desert', '沙漠', '撒哈拉沙漠黄昏', 'nature', {
    alphanumeric: '#fff5e1',
    function: '#ffe4b8',
    navigation: '#ffd28a',
    numpad: '#ffe4b8',
    modifiers: '#ffb74d',
    spacebar: '#f57c00',
  }, '#bf360c'),

  createScheme('pastel-rainbow', '彩虹糖', '七彩马卡龙', 'pastel', {
    alphanumeric: '#fce4ec',
    function: '#f3e5f5',
    navigation: '#e8eaf6',
    numpad: '#e0f7fa',
    modifiers: '#e8f5e9',
    spacebar: '#fff8e1',
  }, '#4a148c'),

  createScheme('cyber-punk2077', '2077夜之城', '赛博朋克2077主题', 'cyber', {
    alphanumeric: '#0b0b1f',
    function: '#161635',
    navigation: '#20204a',
    numpad: '#161635',
    modifiers: '#ffff00',
    spacebar: '#ff0080',
  }, '#00ffff'),

  createScheme('classic-bow', '黑底白字', '经典黑底白字', 'classic', {
    alphanumeric: '#1a1a1a',
    function: '#262626',
    navigation: '#333333',
    numpad: '#262626',
    modifiers: '#404040',
    spacebar: '#525252',
  }, '#ffffff'),

  createScheme('dark-phantom', '幻影', '幻影忍者黑', 'dark', {
    alphanumeric: '#0f0f1a',
    function: '#0a0a14',
    navigation: '#05050e',
    numpad: '#0a0a14',
    modifiers: '#1f1f3d',
    spacebar: '#2f2f5c',
  }, '#4ade80'),
];

export const getColorSchemeById = (id: string): ColorScheme | undefined => {
  return COLOR_SCHEMES.find((scheme) => scheme.id === id);
};

export const getColorSchemesByCategory = (category: ColorSchemeCategory): ColorScheme[] => {
  return COLOR_SCHEMES.filter((scheme) => scheme.category === category);
};
