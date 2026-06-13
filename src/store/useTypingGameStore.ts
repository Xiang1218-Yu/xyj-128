import { create } from 'zustand';
import { TypingGameStore, TypingStats, Difficulty } from '@/types/typingGame';
import { generatePracticeText } from '@/data/typingPractice';

const initialStats: TypingStats = {
  correctChars: 0,
  wrongChars: 0,
  totalChars: 0,
  startTime: null,
  endTime: null,
  wpm: 0,
  accuracy: 0,
};

export const useTypingGameStore = create<TypingGameStore>((set, get) => ({
  isPlaying: false,
  isPaused: false,
  currentText: '',
  currentIndex: 0,
  typedHistory: [],
  difficulty: 'easy',
  stats: { ...initialStats },
  highlightKeyId: null,
  gameMode: 'words',

  startGame: () => {
    const { gameMode, difficulty } = get();
    const text = generatePracticeText(gameMode, difficulty);
    set({
      isPlaying: true,
      isPaused: false,
      currentText: text,
      currentIndex: 0,
      typedHistory: [],
      stats: {
        ...initialStats,
        startTime: Date.now(),
      },
    });
  },

  pauseGame: () => {
    set({ isPaused: true });
  },

  resumeGame: () => {
    set({ isPaused: false });
  },

  resetGame: () => {
    set({
      isPlaying: false,
      isPaused: false,
      currentText: '',
      currentIndex: 0,
      typedHistory: [],
      stats: { ...initialStats },
      highlightKeyId: null,
    });
  },

  handleCharInput: (char: string) => {
    const { currentText, currentIndex, typedHistory, isPlaying, isPaused, stats } = get();
    if (!isPlaying || isPaused) return;
    if (currentIndex >= currentText.length) return;

    const expectedChar = currentText[currentIndex];
    const correct = char === expectedChar;

    const newStats = { ...stats };
    newStats.totalChars++;
    if (correct) {
      newStats.correctChars++;
    } else {
      newStats.wrongChars++;
    }
    newStats.accuracy = newStats.totalChars > 0
      ? (newStats.correctChars / newStats.totalChars) * 100
      : 100;

    if (newStats.startTime) {
      const elapsedMinutes = (Date.now() - newStats.startTime) / 60000;
      if (elapsedMinutes > 0) {
        newStats.wpm = Math.round((newStats.correctChars / 5) / elapsedMinutes);
      }
    }

    const newIndex = correct ? currentIndex + 1 : currentIndex + 1;

    if (newIndex >= currentText.length) {
      newStats.endTime = Date.now();
    }

    set({
      currentIndex: newIndex,
      typedHistory: [...typedHistory, { char, correct }],
      stats: newStats,
      isPlaying: newIndex < currentText.length,
    });
  },

  setDifficulty: (difficulty: Difficulty) => {
    set({ difficulty });
  },

  setGameMode: (gameMode: 'words' | 'sentences' | 'code') => {
    set({ gameMode });
  },

  setHighlightKeyId: (highlightKeyId: string | null) => {
    set({ highlightKeyId });
  },
}));

export const useIsTypingGameActive = () =>
  useTypingGameStore((state) => state.isPlaying && !state.isPaused);

export const useCurrentHighlightKeyId = () =>
  useTypingGameStore((state) => state.highlightKeyId);

export const useTypingStats = () =>
  useTypingGameStore((state) => state.stats);

export const useCurrentChar = () =>
  useTypingGameStore((state) => {
    if (!state.isPlaying || state.currentIndex >= state.currentText.length) return null;
    return state.currentText[state.currentIndex];
  });
