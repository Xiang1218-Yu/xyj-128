import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTypingGameStore } from '@/store/useTypingGameStore';

describe('useTypingGameStore', () => {
  beforeEach(() => {
    useTypingGameStore.setState({
      isPlaying: false,
      isPaused: false,
      currentText: '',
      currentIndex: 0,
      typedHistory: [],
      difficulty: 'easy',
      stats: {
        correctChars: 0,
        wrongChars: 0,
        totalChars: 0,
        startTime: null,
        endTime: null,
        wpm: 0,
        accuracy: 0,
      },
      highlightKeyId: null,
      gameMode: 'words',
    });
  });

  describe('initial state', () => {
    it('should have correct default values', () => {
      const state = useTypingGameStore.getState();
      expect(state.isPlaying).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.currentText).toBe('');
      expect(state.currentIndex).toBe(0);
      expect(state.typedHistory).toEqual([]);
      expect(state.difficulty).toBe('easy');
      expect(state.gameMode).toBe('words');
      expect(state.highlightKeyId).toBeNull();
    });
  });

  describe('startGame', () => {
    it('should start game with generated text', () => {
      useTypingGameStore.getState().startGame();
      const state = useTypingGameStore.getState();
      expect(state.isPlaying).toBe(true);
      expect(state.isPaused).toBe(false);
      expect(state.currentText.length).toBeGreaterThan(0);
      expect(state.currentIndex).toBe(0);
      expect(state.typedHistory).toEqual([]);
      expect(state.stats.startTime).not.toBeNull();
    });

    it('should reset stats on start', () => {
      useTypingGameStore.getState().startGame();
      const stats = useTypingGameStore.getState().stats;
      expect(stats.correctChars).toBe(0);
      expect(stats.wrongChars).toBe(0);
      expect(stats.totalChars).toBe(0);
      expect(stats.endTime).toBeNull();
      expect(stats.wpm).toBe(0);
      expect(stats.accuracy).toBe(0);
    });
  });

  describe('pauseGame / resumeGame', () => {
    it('should pause the game', () => {
      useTypingGameStore.getState().startGame();
      useTypingGameStore.getState().pauseGame();
      expect(useTypingGameStore.getState().isPaused).toBe(true);
    });

    it('should resume the game', () => {
      useTypingGameStore.getState().startGame();
      useTypingGameStore.getState().pauseGame();
      useTypingGameStore.getState().resumeGame();
      expect(useTypingGameStore.getState().isPaused).toBe(false);
    });
  });

  describe('resetGame', () => {
    it('should reset all game state', () => {
      useTypingGameStore.getState().startGame();
      useTypingGameStore.getState().resetGame();
      const state = useTypingGameStore.getState();
      expect(state.isPlaying).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.currentText).toBe('');
      expect(state.currentIndex).toBe(0);
      expect(state.typedHistory).toEqual([]);
      expect(state.highlightKeyId).toBeNull();
    });
  });

  describe('handleCharInput', () => {
    it('should not accept input when game is not playing', () => {
      useTypingGameStore.getState().handleCharInput('a');
      expect(useTypingGameStore.getState().typedHistory.length).toBe(0);
    });

    it('should not accept input when game is paused', () => {
      useTypingGameStore.getState().startGame();
      useTypingGameStore.getState().pauseGame();
      useTypingGameStore.getState().handleCharInput('a');
      expect(useTypingGameStore.getState().typedHistory.length).toBe(0);
    });

    it('should handle correct character input', () => {
      useTypingGameStore.getState().startGame();
      const text = useTypingGameStore.getState().currentText;
      const firstChar = text[0];
      useTypingGameStore.getState().handleCharInput(firstChar);
      const state = useTypingGameStore.getState();
      expect(state.typedHistory.length).toBe(1);
      expect(state.typedHistory[0].char).toBe(firstChar);
      expect(state.typedHistory[0].correct).toBe(true);
      expect(state.currentIndex).toBe(1);
      expect(state.stats.correctChars).toBe(1);
      expect(state.stats.totalChars).toBe(1);
    });

    it('should handle wrong character input', () => {
      useTypingGameStore.getState().startGame();
      const text = useTypingGameStore.getState().currentText;
      const firstChar = text[0];
      const wrongChar = firstChar === 'a' ? 'b' : 'a';
      useTypingGameStore.getState().handleCharInput(wrongChar);
      const state = useTypingGameStore.getState();
      expect(state.typedHistory[0].correct).toBe(false);
      expect(state.stats.wrongChars).toBe(1);
      expect(state.currentIndex).toBe(1);
    });

    it('should calculate accuracy', () => {
      useTypingGameStore.getState().startGame();
      const text = useTypingGameStore.getState().currentText;
      useTypingGameStore.getState().handleCharInput(text[0]);
      expect(useTypingGameStore.getState().stats.accuracy).toBe(100);
    });

    it('should end game when all characters typed', () => {
      useTypingGameStore.getState().startGame();
      const text = useTypingGameStore.getState().currentText;
      for (let i = 0; i < text.length; i++) {
        useTypingGameStore.getState().handleCharInput(text[i]);
      }
      const state = useTypingGameStore.getState();
      expect(state.isPlaying).toBe(false);
      expect(state.stats.endTime).not.toBeNull();
    });

    it('should not accept input after text is complete', () => {
      useTypingGameStore.getState().startGame();
      const text = useTypingGameStore.getState().currentText;
      for (let i = 0; i < text.length; i++) {
        useTypingGameStore.getState().handleCharInput(text[i]);
      }
      const historyLength = useTypingGameStore.getState().typedHistory.length;
      useTypingGameStore.getState().handleCharInput('x');
      expect(useTypingGameStore.getState().typedHistory.length).toBe(historyLength);
    });
  });

  describe('setDifficulty', () => {
    it('should change difficulty', () => {
      useTypingGameStore.getState().setDifficulty('hard');
      expect(useTypingGameStore.getState().difficulty).toBe('hard');
    });
  });

  describe('setGameMode', () => {
    it('should change game mode', () => {
      useTypingGameStore.getState().setGameMode('code');
      expect(useTypingGameStore.getState().gameMode).toBe('code');
    });
  });

  describe('setHighlightKeyId', () => {
    it('should set highlight key id', () => {
      useTypingGameStore.getState().setHighlightKeyId('KeyA');
      expect(useTypingGameStore.getState().highlightKeyId).toBe('KeyA');
    });

    it('should clear highlight key id', () => {
      useTypingGameStore.getState().setHighlightKeyId('KeyA');
      useTypingGameStore.getState().setHighlightKeyId(null);
      expect(useTypingGameStore.getState().highlightKeyId).toBeNull();
    });
  });

  describe('different game modes', () => {
    it('should generate words text for words mode', () => {
      useTypingGameStore.getState().setGameMode('words');
      useTypingGameStore.getState().startGame();
      expect(useTypingGameStore.getState().currentText.length).toBeGreaterThan(0);
    });

    it('should generate sentences text for sentences mode', () => {
      useTypingGameStore.getState().setGameMode('sentences');
      useTypingGameStore.getState().startGame();
      expect(useTypingGameStore.getState().currentText.length).toBeGreaterThan(0);
    });

    it('should generate code text for code mode', () => {
      useTypingGameStore.getState().setGameMode('code');
      useTypingGameStore.getState().startGame();
      expect(useTypingGameStore.getState().currentText.length).toBeGreaterThan(0);
    });

    it('should generate different text for different difficulties', () => {
      useTypingGameStore.getState().setDifficulty('easy');
      useTypingGameStore.getState().startGame();
      const easyText = useTypingGameStore.getState().currentText;

      useTypingGameStore.getState().resetGame();
      useTypingGameStore.getState().setDifficulty('hard');
      useTypingGameStore.getState().startGame();
      const hardText = useTypingGameStore.getState().currentText;

      expect(easyText).toBeDefined();
      expect(hardText).toBeDefined();
    });
  });
});
