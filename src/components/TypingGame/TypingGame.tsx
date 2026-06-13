import { useEffect, useCallback } from 'react';
import {
  useTypingGameStore,
  useIsTypingGameActive,
  useTypingStats,
  useCurrentChar,
} from '@/store/useTypingGameStore';
import { useLayout } from '@/store/useKeyboardStore';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { getKeyIdByChar, isShiftRequired } from '@/data/typingPractice';
import { Difficulty } from '@/types/typingGame';
import { Play, Pause, RotateCcw, Zap, Trophy, Clock, Target, Keyboard } from 'lucide-react';

export function TypingGame() {
  const {
    isPlaying,
    isPaused,
    currentText,
    currentIndex,
    typedHistory,
    difficulty,
    gameMode,
    stats,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    setDifficulty,
    setGameMode,
    setHighlightKeyId,
    handleCharInput,
  } = useTypingGameStore();

  const layout = useLayout();
  const layoutConfig = LAYOUT_CONFIGS[layout];
  const isActive = useIsTypingGameActive();
  const currentChar = useCurrentChar();
  const typingStats = useTypingStats();

  useEffect(() => {
    if (!isActive || !currentChar) {
      setHighlightKeyId(null);
      return;
    }
    const keyId = getKeyIdByChar(currentChar, layoutConfig.keys);
    setHighlightKeyId(keyId);
  }, [currentChar, isActive, layoutConfig.keys, setHighlightKeyId]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive) return;

      let char: string | null = null;

      if (e.key === ' ') {
        char = ' ';
      } else if (e.key === 'Enter') {
        char = '\n';
      } else if (e.key === 'Tab') {
        char = '\t';
      } else if (e.key.length === 1) {
        char = e.key;
      }

      if (char !== null) {
        e.preventDefault();
        e.stopPropagation();
        handleCharInput(char);
      }
    },
    [isActive, handleCharInput]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleKeyDown]);

  const isFinished = isPlaying === false && currentIndex > 0 && currentIndex >= currentText.length;

  const renderText = () => {
    if (!currentText) return null;

    return (
      <div className="font-mono text-lg leading-relaxed tracking-wide select-none">
        {currentText.split('').map((char, idx) => {
          const typed = typedHistory[idx];
          let className = 'text-gray-500';

          if (idx < currentIndex) {
            if (typed?.correct) {
              className = 'text-green-400';
            } else {
              className = 'text-red-400 bg-red-500/20 rounded';
            }
          } else if (idx === currentIndex) {
            className = 'text-white bg-indigo-500/40 rounded animate-pulse';
          }

          let displayChar = char;
          if (char === ' ') {
            displayChar = '\u00A0';
          } else if (char === '\n') {
            displayChar = '↵';
          } else if (char === '\t') {
            displayChar = '⇥';
          }

          return (
            <span key={idx} className={className}>
              {displayChar}
            </span>
          );
        })}
      </div>
    );
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const elapsedTime = stats.startTime ? (stats.endTime || Date.now()) - stats.startTime : 0;

  const modeLabels: Record<'words' | 'sentences' | 'code', string> = {
    words: '单词',
    sentences: '句子',
    code: '代码',
  };

  const diffLabels: Record<Difficulty, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };

  const nextKeyHint = currentChar
    ? {
        char: currentChar === ' ' ? 'Space' : currentChar === '\n' ? 'Enter' : currentChar,
        shift: isShiftRequired(currentChar),
      }
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white font-semibold">打字练习</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400">按键盘开始</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={gameMode}
          onChange={(e) => setGameMode(e.target.value as 'words' | 'sentences' | 'code')}
          disabled={isPlaying}
          className="bg-gray-800/60 text-white text-sm px-3 py-2 rounded-lg border border-gray-700/50 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
        >
          <option value="words">单词模式</option>
          <option value="sentences">句子模式</option>
          <option value="code">代码模式</option>
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          disabled={isPlaying}
          className="bg-gray-800/60 text-white text-sm px-3 py-2 rounded-lg border border-gray-700/50 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
        >
          <option value="easy">简单</option>
          <option value="medium">中等</option>
          <option value="hard">困难</option>
        </select>
      </div>

      {isActive && nextKeyHint && (
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
          <div className="text-sm text-gray-300">下一个按键：</div>
          <div className="flex items-center gap-2">
            {nextKeyHint.shift && (
              <span className="px-3 py-1.5 bg-amber-500/30 text-amber-300 text-sm font-mono rounded-lg border border-amber-500/40 animate-pulse">
                Shift
              </span>
            )}
            <span className="px-4 py-1.5 bg-indigo-500/40 text-white text-lg font-mono font-bold rounded-lg border border-indigo-400/50 shadow-lg shadow-indigo-500/20 animate-pulse">
              {nextKeyHint.char}
            </span>
          </div>
          <div className="ml-auto text-xs text-gray-400">
            模式: {modeLabels[gameMode]} · {diffLabels[difficulty]}
          </div>
        </div>
      )}

      {(isPlaying || isFinished) && (
        <>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-800/40 rounded-lg">
              <Clock className="w-4 h-4 text-blue-400" />
              <div className="text-white font-mono text-sm font-semibold">
                {formatTime(elapsedTime)}
              </div>
              <div className="text-gray-500 text-xs">用时</div>
            </div>
            <div className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-800/40 rounded-lg">
              <Zap className="w-4 h-4 text-yellow-400" />
              <div className="text-white font-mono text-sm font-semibold">
                {typingStats.wpm}
              </div>
              <div className="text-gray-500 text-xs">WPM</div>
            </div>
            <div className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-800/40 rounded-lg">
              <Target className="w-4 h-4 text-green-400" />
              <div className="text-white font-mono text-sm font-semibold">
                {typingStats.accuracy.toFixed(1)}%
              </div>
              <div className="text-gray-500 text-xs">准确率</div>
            </div>
            <div className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-800/40 rounded-lg">
              <Trophy className="w-4 h-4 text-purple-400" />
              <div className="text-white font-mono text-sm font-semibold">
                {typingStats.correctChars}/{typingStats.totalChars}
              </div>
              <div className="text-gray-500 text-xs">正确</div>
            </div>
          </div>

          <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{
                width: currentText.length > 0 ? `${(currentIndex / currentText.length) * 100}%` : '0%',
              }}
            />
          </div>

          <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 min-h-[120px] max-h-[180px] overflow-y-auto">
            {renderText()}
          </div>
        </>
      )}

      {isFinished && (
        <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-white font-semibold mb-1">练习完成！</div>
          <div className="text-sm text-gray-300">
            速度: <span className="text-yellow-400 font-mono font-bold">{typingStats.wpm} WPM</span>
            <span className="mx-2 text-gray-600">·</span>
            准确率: <span className="text-green-400 font-mono font-bold">{typingStats.accuracy.toFixed(1)}%</span>
            <span className="mx-2 text-gray-600">·</span>
            用时: <span className="text-blue-400 font-mono font-bold">{formatTime(elapsedTime)}</span>
          </div>
        </div>
      )}

      {!isPlaying && !isFinished && (
        <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/30 text-center">
          <Keyboard className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
          <div className="text-white font-semibold mb-1">准备开始练习</div>
          <div className="text-sm text-gray-400 mb-4">
            点击开始按钮后，3D键盘会高亮提示下一个按键
          </div>
          <div className="text-xs text-gray-500">
            模式: {modeLabels[gameMode]} · {diffLabels[difficulty]}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!isPlaying ? (
          <button
            onClick={startGame}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-white font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20"
          >
            <Play className="w-4 h-4" />
            开始练习
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button
                onClick={pauseGame}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600/80 hover:bg-amber-500 rounded-xl text-white font-medium transition-all"
              >
                <Pause className="w-4 h-4" />
                暂停
              </button>
            ) : (
              <button
                onClick={resumeGame}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600/80 hover:bg-green-500 rounded-xl text-white font-medium transition-all"
              >
                <Play className="w-4 h-4" />
                继续
              </button>
            )}
            <button
              onClick={resetGame}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700/80 hover:bg-gray-600 rounded-xl text-white font-medium transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
          </>
        )}
      </div>
    </div>
  );
}
