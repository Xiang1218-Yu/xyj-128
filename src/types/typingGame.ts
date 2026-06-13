export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TypingStats {
  correctChars: number;
  wrongChars: number;
  totalChars: number;
  startTime: number | null;
  endTime: number | null;
  wpm: number;
  accuracy: number;
}

export interface TypingGameState {
  isPlaying: boolean;
  isPaused: boolean;
  currentText: string;
  currentIndex: number;
  typedHistory: Array<{ char: string; correct: boolean }>;
  difficulty: Difficulty;
  stats: TypingStats;
  highlightKeyId: string | null;
  gameMode: 'words' | 'sentences' | 'code';
}

export interface TypingGameActions {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  handleCharInput: (char: string) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setGameMode: (mode: 'words' | 'sentences' | 'code') => void;
  setHighlightKeyId: (keyId: string | null) => void;
}

export type TypingGameStore = TypingGameState & TypingGameActions;
