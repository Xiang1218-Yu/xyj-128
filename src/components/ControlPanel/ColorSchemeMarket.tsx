import { Palette, Heart, Upload, X, Search, Check, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import {
  useKeyboardStore,
  useFavoriteSchemeIds,
  useCustomSchemes,
  useActiveSchemeId,
  useZoneColors,
  useFontColor,
} from '@/store/useKeyboardStore';
import { COLOR_SCHEMES, COLOR_SCHEME_CATEGORIES } from '@/data/colorSchemes';
import { ColorScheme, ColorSchemeCategory, KeyZone } from '@/types/keyboard';
import { ZONE_LIST } from '@/data/zones';

type FilterType = 'all' | 'favorites' | 'custom' | ColorSchemeCategory;

export function ColorSchemeMarket() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState<ColorSchemeCategory>('artisan');

  const favoriteSchemeIds = useFavoriteSchemeIds();
  const customSchemes = useCustomSchemes();
  const activeSchemeId = useActiveSchemeId();
  const zoneColors = useZoneColors();
  const fontColor = useFontColor();

  const applyColorScheme = useKeyboardStore((state) => state.applyColorScheme);
  const toggleFavoriteScheme = useKeyboardStore((state) => state.toggleFavoriteScheme);
  const addCustomScheme = useKeyboardStore((state) => state.addCustomScheme);
  const removeCustomScheme = useKeyboardStore((state) => state.removeCustomScheme);

  const allSchemes = useMemo(() => {
    return [...COLOR_SCHEMES, ...customSchemes];
  }, [customSchemes]);

  const filteredSchemes = useMemo(() => {
    let schemes = allSchemes;

    if (activeFilter === 'favorites') {
      schemes = schemes.filter((s) => favoriteSchemeIds.includes(s.id));
    } else if (activeFilter === 'custom') {
      schemes = customSchemes;
    } else if (activeFilter !== 'all') {
      schemes = schemes.filter((s) => s.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      schemes = schemes.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
    }

    return schemes;
  }, [allSchemes, activeFilter, searchQuery, favoriteSchemeIds, customSchemes]);

  const handleApplyScheme = (scheme: ColorScheme) => {
    applyColorScheme(scheme);
  };

  const handleToggleFavorite = (e: React.MouseEvent, schemeId: string) => {
    e.stopPropagation();
    toggleFavoriteScheme(schemeId);
  };

  const handleUploadScheme = () => {
    if (!uploadName.trim()) return;

    const newScheme: ColorScheme = {
      id: `custom_${Date.now()}`,
      name: uploadName.trim(),
      description: uploadDescription.trim() || '自定义配色方案',
      category: uploadCategory,
      zoneColors: { ...zoneColors },
      fontColor: fontColor,
      isCustom: true,
    };

    addCustomScheme(newScheme);
    setShowUploadModal(false);
    setUploadName('');
    setUploadDescription('');
  };

  const handleDeleteCustomScheme = (e: React.MouseEvent, schemeId: string) => {
    e.stopPropagation();
    removeCustomScheme(schemeId);
  };

  const ColorPreview = ({ colors }: { colors: Record<KeyZone, string> }) => (
    <div className="flex gap-0.5">
      {ZONE_LIST.map((zone) => (
        <div
          key={zone}
          className="flex-1 h-4 first:rounded-l last:rounded-r"
          style={{ backgroundColor: colors[zone] }}
        />
      ))}
    </div>
  );

  const SchemeCard = ({ scheme }: { scheme: ColorScheme }) => {
    const isActive = activeSchemeId === scheme.id;
    const isFavorited = favoriteSchemeIds.includes(scheme.id);
    const categoryInfo = COLOR_SCHEME_CATEGORIES.find((c) => c.id === scheme.category);

    return (
      <div
        className={`group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
          isActive
            ? 'bg-purple-600/20 border-purple-500/50'
            : 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-800/60 hover:border-gray-600/50'
        }`}
        onClick={() => handleApplyScheme(scheme)}
      >
        {isActive && (
          <div className="absolute top-2 right-2">
            <Check className="w-4 h-4 text-purple-400" />
          </div>
        )}

        <div className="mb-2">
          <ColorPreview colors={scheme.zoneColors} />
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">{scheme.name}</h4>
            <p className="text-xs text-gray-400 truncate mt-0.5">{scheme.description}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-xs">{categoryInfo?.icon}</span>
              <span className="text-xs text-gray-500">{categoryInfo?.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <button
            onClick={(e) => handleToggleFavorite(e, scheme.id)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-all ${
              isFavorited
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
            {isFavorited ? '已收藏' : '收藏'}
          </button>

          {scheme.isCustom && (
            <button
              onClick={(e) => handleDeleteCustomScheme(e, scheme.id)}
              className="flex items-center justify-center px-2 py-1.5 rounded-lg text-xs bg-gray-700/30 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl border border-purple-500/30 transition-all group"
      >
        <span className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white font-medium">配色市场</span>
        </span>
        <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
          {allSchemes.length} 套精选
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">配色市场</h2>
                  <p className="text-xs text-gray-400">精选 {allSchemes.length} 套键盘配色方案</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Upload className="w-4 h-4" />
                  上传当前配色
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 border-b border-gray-800/50 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="搜索配色方案..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setActiveFilter('favorites')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === 'favorites'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300'
                  }`}
                >
                  ❤️ 我的收藏 ({favoriteSchemeIds.length})
                </button>
                <button
                  onClick={() => setActiveFilter('custom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === 'custom'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300'
                  }`}
                >
                  🎨 我的上传 ({customSchemes.length})
                </button>
                {COLOR_SCHEME_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeFilter === category.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300'
                    }`}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filteredSchemes.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredSchemes.map((scheme) => (
                    <SchemeCard key={scheme.id} scheme={scheme} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Palette className="w-12 h-12 text-gray-600 mb-4" />
                  <div className="text-gray-400 text-sm">没有找到匹配的配色方案</div>
                  <div className="text-gray-500 text-xs mt-1">尝试其他筛选条件或搜索词</div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-800/50 bg-gray-900/50">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <span>💡 点击配色方案即可一键应用到你的键盘</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
              <h3 className="text-lg font-bold text-white">上传当前配色</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/30">
                <div className="text-xs text-gray-400 mb-2">当前配色预览</div>
                <ColorPreview colors={zoneColors} />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">配色名称 *</label>
                <input
                  type="text"
                  placeholder="例如：我的专属配色"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">描述</label>
                <textarea
                  placeholder="简单描述一下这个配色..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">分类</label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_SCHEME_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setUploadCategory(category.id)}
                      className={`p-2 rounded-lg text-center transition-all ${
                        uploadCategory === category.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60'
                      }`}
                    >
                      <div className="text-lg">{category.icon}</div>
                      <div className="text-xs mt-0.5">{category.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800/50 flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 text-sm font-medium transition-all"
              >
                取消
              </button>
              <button
                onClick={handleUploadScheme}
                disabled={!uploadName.trim()}
                className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl text-white text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                确认上传
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
