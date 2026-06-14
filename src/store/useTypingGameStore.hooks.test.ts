import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useTypingGameStore,
  useIsTypingGameActive,
  useCurrentHighlightKeyId,
  useTypingStats,
  useCurrentChar,
} from '@/store/useTypingGameStore';

describe('useTypingGameStore hooks', () => {
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

  it('useIsTypingGameActive should return false when not playing', () => {
    const { result } = renderHook(() => useIsTypingGameActive());
    expect(result.current).toBe(false);
  });

  it('useIsTypingGameActive should return true when playing and not paused', () => {
    act(() => {
      useTypingGameStore.getState().startGame();
    });
    const { result } = renderHook(() => useIsTypingGameActive());
    expect(result.current).toBe(true);
  });

  it('useIsTypingGameActive should return false when paused', () => {
    act(() => {
      useTypingGameStore.getState().startGame();
      useTypingGameStore.getState().pauseGame();
    });
    const { result } = renderHook(() => useIsTypingGameActive());
    expect(result.current).toBe(false);
  });

  it('useCurrentHighlightKeyId should return highlight key id', () => {
    const { result } = renderHook(() => useCurrentHighlightKeyId());
    expect(result.current).toBeNull();
  });

  it('useTypingStats should return stats', () => {
    const { result } = renderHook(() => useTypingStats());
    expect(result.current.correctChars).toBe(0);
    expect(result.current.wpm).toBe(0);
  });

  it('useCurrentChar should return null when not playing', () => {
    const { result } = renderHook(() => useCurrentChar());
    expect(result.current).toBeNull();
  });

  it('useCurrentChar should return current character when playing', () => {
    act(() => {
      useTypingGameStore.getState().startGame();
    });
    const { result } = renderHook(() => useCurrentChar());
    expect(result.current).not.toBeNull();
    expect(typeof result.current).toBe('string');
  });

  it('useCurrentChar should return null when text is complete', () => {
    act(() => {
      useTypingGameStore.getState().startGame();
      const text = useTypingGameStore.getState().currentText;
      for (let i = 0; i < text.length; i++) {
        useTypingGameStore.getState().handleCharInput(text[i]);
      }
    });
    const { result } = renderHook(() => useCurrentChar());
    expect(result.current).toBeNull();
  });
});
