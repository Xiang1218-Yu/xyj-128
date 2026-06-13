import { Type, Minus, Plus, RotateCcw, Sticker, Palette, Edit3 } from 'lucide-react';
import { useState } from 'react';
import {
  useKeyboardStore,
  useFontStyle,
  useFontSize,
  useFontColor,
  useSelectedKeyId,
  useKeyCustom,
} from '@/store/useKeyboardStore';
import { FONT_LIST, FONT_CONFIGS, MIN_FONT_SIZE, MAX_FONT_SIZE, DEFAULT_FONT_SIZE, DEFAULT_FONT_COLOR } from '@/data/fonts';
import { STICKER_LIST, STICKER_CONFIGS } from '@/data/stickers';
import { FontStyle, StickerType } from '@/types/keyboard';
import { useLayout } from '@/store/useKeyboardStore';
import { LAYOUT_CONFIGS } from '@/data/layouts';

const PRESET_COLORS = [
  '#1e293b',
  '#ffffff',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#64748b',
];

export function KeyCapEditor() {
  const [showKeyLabel, setShowKeyLabel] = useState(false);
  const fontStyle = useFontStyle();
  const fontSize = useFontSize();
  const fontColor = useFontColor();
  const selectedKeyId = useSelectedKeyId();
  const keyCustom = selectedKeyId ? useKeyCustom(selectedKeyId) : undefined;
  const setFontStyle = useKeyboardStore((state) => state.setFontStyle);
  const setFontSize = useKeyboardStore((state) => state.setFontSize);
  const setFontColor = useKeyboardStore((state) => state.setFontColor);
  const setKeyLabel = useKeyboardStore((state) => state.setKeyLabel);
  const setKeySticker = useKeyboardStore((state) => state.setKeySticker);
  const resetKeyCustom = useKeyboardStore((state) => state.resetKeyCustom);
  const resetAllKeyCustoms = useKeyboardStore((state) => state.resetAllKeyCustoms);
  const layout = useLayout();
  const layoutConfig = LAYOUT_CONFIGS[layout];

  const selectedKeyConfig = selectedKeyId
    ? layoutConfig.keys.find((k) => k.id === selectedKeyId)
    : null;

  const currentLabel = keyCustom?.label ?? selectedKeyConfig?.label ?? '';
  const currentSticker = keyCustom?.sticker ?? 'none';

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, fontSize + delta));
    setFontSize(newSize);
  };

  const handleResetFont = () => {
    setFontStyle('sans');
    setFontSize(DEFAULT_FONT_SIZE);
    setFontColor(DEFAULT_FONT_COLOR);
  };

  const handleLabelChange = (label: string) => {
    if (selectedKeyId) {
      setKeyLabel(selectedKeyId, label);
    }
  };

  const handleStickerChange = (sticker: StickerType) => {
    if (selectedKeyId) {
      setKeySticker(selectedKeyId, sticker);
    }
  };

  const handleResetKey = () => {
    if (selectedKeyId) {
      resetKeyCustom(selectedKeyId);
    }
  };

  const fontSizePercent = Math.round(((fontSize - MIN_FONT_SIZE) / (MAX_FONT_SIZE - MIN_FONT_SIZE)) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-medium text-gray-200">键帽字符</h3>
        </div>
        <button
          onClick={handleResetFont}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 rounded-lg transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          重置字体
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-2 block">字体风格</label>
          <div className="grid grid-cols-3 gap-1.5">
            {FONT_LIST.map((style) => {
              const config = FONT_CONFIGS[style as FontStyle];
              const isSelected = fontStyle === style;

              return (
                <button
                  key={style}
                  onClick={() => setFontStyle(style as FontStyle)}
                  className={`px-2 py-2 rounded-lg text-xs transition-all duration-200 ${
                    isSelected
                      ? 'bg-cyan-600/20 border border-cyan-500/50 text-cyan-300'
                      : 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60 text-gray-300'
                  }`}
                >
                  <div
                    className="text-sm font-bold mb-0.5"
                    style={{
                      fontFamily:
                        style === 'sans'
                          ? 'sans-serif'
                          : style === 'serif'
                          ? 'serif'
                          : style === 'mono'
                          ? 'monospace'
                          : style === 'rounded'
                          ? 'cursive'
                          : 'Impact, sans-serif',
                    }}
                  >
                    Aa
                  </div>
                  <div className="text-[10px] text-gray-500">{config.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-400">字号大小</label>
            <span className="text-xs text-gray-500">{fontSizePercent}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFontSizeChange(-0.02)}
              className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-gray-400 hover:text-gray-200 transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1 h-2 bg-gray-800/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-150"
                style={{ width: `${fontSizePercent}%` }}
              />
            </div>
            <button
              onClick={() => handleFontSizeChange(0.02)}
              className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-gray-400 hover:text-gray-200 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-3.5 h-3.5 text-gray-500" />
            <label className="text-xs text-gray-400">字体颜色</label>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {PRESET_COLORS.map((color) => {
              const isSelected = fontColor === color;
              return (
                <button
                  key={color}
                  onClick={() => setFontColor(color)}
                  className={`aspect-square rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent my-5" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-medium text-gray-200">单键编辑</h3>
        </div>
        {selectedKeyId && (
          <button
            onClick={handleResetKey}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-amber-300 hover:bg-amber-900/20 rounded-lg transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            重置此键
          </button>
        )}
      </div>

      {selectedKeyConfig ? (
        <div className="space-y-4">
          <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2 py-1 bg-indigo-600/20 text-indigo-300 text-xs font-medium rounded">
                {selectedKeyConfig.label}
              </div>
              <span className="text-xs text-gray-500">
                行 {selectedKeyConfig.row + 1} · 列 {selectedKeyConfig.col + 1}
              </span>
            </div>

            <button
              onClick={() => setShowKeyLabel(!showKeyLabel)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg transition-all"
            >
              <span className="text-xs text-gray-300">修改字符内容</span>
              <span className="text-xs text-gray-500">{showKeyLabel ? '收起' : '展开'}</span>
            </button>

            {showKeyLabel && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  value={currentLabel}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder="输入自定义字符..."
                  maxLength={10}
                  className="w-full px-3 py-2 bg-gray-900/60 border border-gray-700/50 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
                <p className="text-[10px] text-gray-600">最多 10 个字符</p>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sticker className="w-3.5 h-3.5 text-pink-400" />
              <label className="text-xs text-gray-400">添加贴纸</label>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {STICKER_LIST.map((sticker) => {
                const config = STICKER_CONFIGS[sticker as StickerType];
                const isSelected = currentSticker === sticker;

                if (sticker === 'none') {
                  return (
                    <button
                      key={sticker}
                      onClick={() => handleStickerChange(sticker as StickerType)}
                      className={`aspect-square rounded-lg text-xs transition-all duration-200 flex items-center justify-center ${
                        isSelected
                          ? 'bg-pink-600/20 border border-pink-500/50 text-pink-300'
                          : 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60 text-gray-500'
                      }`}
                    >
                      <span className="text-[10px]">无</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={sticker}
                    onClick={() => handleStickerChange(sticker as StickerType)}
                    className={`aspect-square rounded-lg text-lg transition-all duration-200 flex items-center justify-center ${
                      isSelected
                        ? 'bg-pink-600/20 border border-pink-500/50 scale-110'
                        : 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60 hover:scale-105'
                    }`}
                  >
                    {config.emoji}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={resetAllKeyCustoms}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-gray-500 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-all border border-gray-700/30 hover:border-red-500/30"
          >
            <RotateCcw className="w-3 h-3" />
            重置所有自定义
          </button>
        </div>
      ) : (
        <div className="p-4 bg-gray-800/30 rounded-xl border border-dashed border-gray-700/50 text-center">
          <div className="text-2xl mb-2">👆</div>
          <p className="text-xs text-gray-500">点击键盘上的任意键帽进行编辑</p>
        </div>
      )}
    </div>
  );
}
