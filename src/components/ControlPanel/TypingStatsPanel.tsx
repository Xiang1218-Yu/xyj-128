import { BarChart3, Timer, Zap, Target, RotateCcw } from 'lucide-react';
import {
  useKeyboardStore,
  useTypingStats,
} from '@/store/useKeyboardStore';
import { useEffect, useState } from 'react';

export function TypingStatsPanel() {
  const stats = useTypingStats();
  const resetTypingStats = useKeyboardStore((state) => state.resetTypingStats);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: number | null = null;

    if (stats.startTime) {
      interval = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - stats.startTime!) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [stats.startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-medium text-gray-200">输入统计</h3>
        </div>
        <button
          onClick={resetTypingStats}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 rounded-lg transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          重置
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-gray-500">按键次数</span>
          </div>
          <div className="text-xl font-bold text-gray-200">
            {stats.totalKeyPresses}
          </div>
        </div>

        <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Timer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-gray-500">用时</span>
          </div>
          <div className="text-xl font-bold text-gray-200">
            {formatTime(elapsedTime)}
          </div>
        </div>

        <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-1.5 mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-gray-500">WPM</span>
          </div>
          <div className="text-xl font-bold text-emerald-400">
            {stats.wpm}
          </div>
        </div>

        <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-[10px] text-gray-500">准确率</span>
          </div>
          <div className="text-xl font-bold text-pink-400">
            {stats.accuracy}%
          </div>
        </div>
      </div>

      <div className="mt-3 p-2.5 bg-gray-800/30 rounded-lg border border-gray-700/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">总字符数</span>
          <span className="text-gray-300">{stats.totalChars}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-gray-500">正确字符</span>
          <span className="text-emerald-400">{stats.correctChars}</span>
        </div>
      </div>
    </div>
  );
}
