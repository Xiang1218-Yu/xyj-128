import { Maximize2, Minus, Plus, RotateCcw, ArrowUpDown, ArrowLeftRight } from 'lucide-react';
import {
  useKeyboardStore,
  useKeyboardScale,
} from '@/store/useKeyboardStore';

export function KeyboardScaleControl() {
  const keyboardScale = useKeyboardScale();
  const setKeyboardScale = useKeyboardStore((state) => state.setKeyboardScale);
  const resetKeyboardScale = useKeyboardStore((state) => state.resetKeyboardScale);

  const overallPercent = Math.round((keyboardScale.overall - 0.5) * 100);
  const keyGapPercent = Math.round(keyboardScale.keyGap * 100);
  const tiltXDeg = Math.round(keyboardScale.tiltX * (180 / Math.PI));
  const tiltZDeg = Math.round(keyboardScale.tiltZ * (180 / Math.PI));

  const handleOverallChange = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(2, keyboardScale.overall + delta));
    setKeyboardScale({ overall: newScale });
  };

  const handleKeyGapChange = (delta: number) => {
    const newGap = Math.max(-0.2, Math.min(0.5, keyboardScale.keyGap + delta));
    setKeyboardScale({ keyGap: newGap });
  };

  const handleTiltXChange = (delta: number) => {
    const newTilt = Math.max(-0.3, Math.min(0.3, keyboardScale.tiltX + delta));
    setKeyboardScale({ tiltX: newTilt });
  };

  const handleTiltZChange = (delta: number) => {
    const newTilt = Math.max(-0.3, Math.min(0.3, keyboardScale.tiltZ + delta));
    setKeyboardScale({ tiltZ: newTilt });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-medium text-gray-200">键盘调节</h3>
        </div>
        <button
          onClick={resetKeyboardScale}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 rounded-lg transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          重置
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-400 flex items-center gap-2">
              <Maximize2 className="w-3 h-3 text-gray-500" />
              整体尺寸
            </label>
            <span className="text-xs text-gray-500">{overallPercent > 0 ? '+' : ''}{overallPercent}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOverallChange(-0.05)}
              className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-gray-400 hover:text-gray-200 transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1 h-2 bg-gray-800/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-150"
                style={{ width: `${((keyboardScale.overall - 0.5) / 1.5) * 100}%` }}
              />
            </div>
            <button
              onClick={() => handleOverallChange(0.05)}
              className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-gray-400 hover:text-gray-200 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-400 flex items-center gap-2">
              <ArrowUpDown className="w-3 h-3 text-gray-500" />
              键间距
            </label>
            <span className="text-xs text-gray-500">{keyGapPercent > 0 ? '+' : ''}{keyGapPercent}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleKeyGapChange(-0.02)}
              className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-gray-400 hover:text-gray-200 transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1 h-2 bg-gray-800/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-150"
                style={{ width: `${((keyboardScale.keyGap + 0.2) / 0.7) * 100}%` }}
              />
            </div>
            <button
              onClick={() => handleKeyGapChange(0.02)}
              className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-gray-400 hover:text-gray-200 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">前倾后仰</label>
              <span className="text-xs text-gray-500">{tiltXDeg > 0 ? '+' : ''}{tiltXDeg}°</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleTiltXChange(-0.02)}
                className="flex-1 p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-gray-400 hover:text-gray-200 text-xs transition-all"
              >
                ←
              </button>
              <button
                onClick={() => handleTiltXChange(0.02)}
                className="flex-1 p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-gray-400 hover:text-gray-200 text-xs transition-all"
              >
                →
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400">左右倾斜</label>
              <span className="text-xs text-gray-500">{tiltZDeg > 0 ? '+' : ''}{tiltZDeg}°</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleTiltZChange(-0.02)}
                className="flex-1 p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-gray-400 hover:text-gray-200 text-xs transition-all"
              >
                ↺
              </button>
              <button
                onClick={() => handleTiltZChange(0.02)}
                className="flex-1 p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-gray-400 hover:text-gray-200 text-xs transition-all"
              >
                ↻
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
