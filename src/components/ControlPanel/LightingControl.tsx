import { Lightbulb, Power, RotateCcw, Sun, Gauge, Palette } from 'lucide-react';
import { useState } from 'react';
import {
  useKeyboardStore,
  useRgbEnabled,
  useLightingMode,
  useRgbBrightness,
  useRgbSpeed,
  useZoneRgbColors,
} from '@/store/useKeyboardStore';
import { LIGHTING_MODES, LIGHTING_MODE_LIST, MIN_RGB_BRIGHTNESS, MAX_RGB_BRIGHTNESS, MIN_RGB_SPEED, MAX_RGB_SPEED } from '@/data/lighting';
import { ZONE_LIST, ZONE_CONFIGS } from '@/data/zones';
import { PRESET_COLORS } from '@/data/materials';
import { KeyZone, LightingMode } from '@/types/keyboard';

const modeIcons: Record<LightingMode, string> = {
  static: '💡',
  breathing: '🌬️',
  wave: '🌊',
  rainbow: '🌈',
  reactive: '⚡',
  ripple: '🔘',
  starlight: '✨',
  marquee: '🏃',
};

export function LightingControl() {
  const rgbEnabled = useRgbEnabled();
  const lightingMode = useLightingMode();
  const rgbBrightness = useRgbBrightness();
  const rgbSpeed = useRgbSpeed();
  const zoneRgbColors = useZoneRgbColors();

  const setRgbEnabled = useKeyboardStore((state) => state.setRgbEnabled);
  const setLightingMode = useKeyboardStore((state) => state.setLightingMode);
  const setRgbBrightness = useKeyboardStore((state) => state.setRgbBrightness);
  const setRgbSpeed = useKeyboardStore((state) => state.setRgbSpeed);
  const setZoneRgbColor = useKeyboardStore((state) => state.setZoneRgbColor);
  const resetRgbColors = useKeyboardStore((state) => state.resetRgbColors);

  const [selectedZone, setSelectedZone] = useState<KeyZone | null>(null);
  const [showZoneColors, setShowZoneColors] = useState(false);

  const handleZoneSelect = (zone: KeyZone) => {
    setSelectedZone(selectedZone === zone ? null : zone);
  };

  const handleColorSelect = (color: string) => {
    if (selectedZone) {
      setZoneRgbColor(selectedZone, color);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-medium text-gray-200">RGB 背光</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetRgbColors}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded-lg transition-all"
            title="重置灯光颜色"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={() => setRgbEnabled(!rgbEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              rgbEnabled
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50'
                : 'bg-gray-800/60 text-gray-400 border border-gray-700/50 hover:bg-gray-700/60'
            }`}
          >
            <Power className="w-3 h-3" />
            {rgbEnabled ? '开启' : '关闭'}
          </button>
        </div>
      </div>

      {rgbEnabled && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <div className="text-xs text-gray-400 mb-2">灯效模式</div>
            <div className="grid grid-cols-4 gap-1.5">
              {LIGHTING_MODE_LIST.map((mode) => {
                const config = LIGHTING_MODES[mode];
                const isActive = lightingMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setLightingMode(mode)}
                    className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-br from-cyan-600/30 to-indigo-600/30 text-cyan-200 border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                        : 'bg-gray-800/60 text-gray-400 border border-gray-700/50 hover:bg-gray-700/60 hover:text-gray-300'
                    }`}
                    title={config.description}
                  >
                    <span className="text-lg">{modeIcons[mode]}</span>
                    <span className="text-[10px] leading-tight text-center">{config.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/30 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-xs text-gray-300">亮度</span>
                </div>
                <span className="text-xs text-cyan-300 font-mono">
                  {Math.round(rgbBrightness * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={MIN_RGB_BRIGHTNESS}
                max={MAX_RGB_BRIGHTNESS}
                step={0.05}
                value={rgbBrightness}
                onChange={(e) => setRgbBrightness(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-xs text-gray-300">速度</span>
                </div>
                <span className="text-xs text-cyan-300 font-mono">
                  {rgbSpeed.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min={MIN_RGB_SPEED}
                max={MAX_RGB_SPEED}
                step={0.1}
                value={rgbSpeed}
                onChange={(e) => setRgbSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-green-500"
              />
            </div>
          </div>

          <div>
            <button
              onClick={() => setShowZoneColors(!showZoneColors)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:bg-gray-700/40 transition-all"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-300">分区颜色定制</span>
              </div>
              <span className="text-xs text-gray-500">{showZoneColors ? '收起' : '展开'}</span>
            </button>

            {showZoneColors && (
              <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
                <div className="text-xs text-gray-400 mb-2">选择分区</div>
                <div className="flex flex-wrap gap-1.5">
                  {ZONE_LIST.map((zone) => {
                    const config = ZONE_CONFIGS[zone as KeyZone];
                    const isSelected = selectedZone === zone;
                    const currentColor = zoneRgbColors[zone as KeyZone];

                    return (
                      <button
                        key={zone}
                        onClick={() => handleZoneSelect(zone as KeyZone)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                          isSelected
                            ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50'
                            : 'bg-gray-800/60 text-gray-300 border border-gray-700/50 hover:bg-gray-700/60 hover:border-gray-600/50'
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-sm border border-gray-600/50"
                          style={{
                            backgroundColor: currentColor,
                            boxShadow: isSelected ? `0 0 8px ${currentColor}80` : 'none',
                          }}
                        />
                        {config.name}
                      </button>
                    );
                  })}
                </div>

                {selectedZone && (
                  <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/30 space-y-3">
                    <div className="text-xs text-gray-400">
                      当前分区: <span className="text-cyan-300">{ZONE_CONFIGS[selectedZone].name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={zoneRgbColors[selectedZone]}
                        onChange={(e) => handleColorSelect(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={zoneRgbColors[selectedZone]}
                        onChange={(e) => handleColorSelect(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-900/60 border border-gray-700/50 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    <div>
                      <div className="text-xs text-gray-400 mb-2">预设颜色</div>
                      <div className="grid grid-cols-9 gap-1.5">
                        {PRESET_COLORS.map((color) => {
                          const isActive = zoneRgbColors[selectedZone]?.toLowerCase() === color.toLowerCase();
                          return (
                            <button
                              key={color}
                              onClick={() => handleColorSelect(color)}
                              className={`aspect-square rounded-md border-2 transition-all duration-150 hover:scale-110 ${
                                isActive
                                  ? 'border-white shadow-lg'
                                  : 'border-transparent hover:border-gray-500'
                              }`}
                              style={{
                                backgroundColor: color,
                                boxShadow: isActive ? `0 0 12px ${color}80` : 'none',
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!rgbEnabled && (
        <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 text-center">
          <div className="text-gray-500 text-sm">RGB 背光已关闭</div>
        </div>
      )}
    </div>
  );
}
