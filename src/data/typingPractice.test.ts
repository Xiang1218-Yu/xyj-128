import { describe, it, expect } from 'vitest';
import { generatePracticeText, CHAR_TO_KEYCODE, getKeyIdByChar, isShiftRequired } from '@/data/typingPractice';

describe('typingPractice', () => {
  describe('generatePracticeText', () => {
    it('should generate words text for easy difficulty', () => {
      const text = generatePracticeText('words', 'easy');
      expect(text.length).toBeGreaterThan(0);
      expect(text).toContain(' ');
    });

    it('should generate words text for medium difficulty', () => {
      const text = generatePracticeText('words', 'medium');
      expect(text.length).toBeGreaterThan(0);
    });

    it('should generate words text for hard difficulty', () => {
      const text = generatePracticeText('words', 'hard');
      expect(text.length).toBeGreaterThan(0);
    });

    it('should generate sentences text', () => {
      const text = generatePracticeText('sentences', 'easy');
      expect(text.length).toBeGreaterThan(0);
    });

    it('should generate code text', () => {
      const text = generatePracticeText('code', 'easy');
      expect(text.length).toBeGreaterThan(0);
    });

    it('should generate different text each call', () => {
      const text1 = generatePracticeText('words', 'easy');
      const text2 = generatePracticeText('words', 'easy');
      expect(text1).not.toBe(text2);
    });

    it('should generate longer text for easy words than hard words', () => {
      const easyText = generatePracticeText('words', 'easy');
      const hardText = generatePracticeText('words', 'hard');
      expect(easyText.split(' ').length).toBeGreaterThanOrEqual(hardText.split(' ').length);
    });

    it('should generate medium difficulty text for all modes', () => {
      const wordsText = generatePracticeText('words', 'medium');
      const sentencesText = generatePracticeText('sentences', 'medium');
      const codeText = generatePracticeText('code', 'medium');
      expect(wordsText.length).toBeGreaterThan(0);
      expect(sentencesText.length).toBeGreaterThan(0);
      expect(codeText.length).toBeGreaterThan(0);
    });

    it('should generate hard difficulty text for all modes', () => {
      const wordsText = generatePracticeText('words', 'hard');
      const sentencesText = generatePracticeText('sentences', 'hard');
      const codeText = generatePracticeText('code', 'hard');
      expect(wordsText.length).toBeGreaterThan(0);
      expect(sentencesText.length).toBeGreaterThan(0);
      expect(codeText.length).toBeGreaterThan(0);
    });
  });

  describe('CHAR_TO_KEYCODE', () => {
    it('should have mapping for lowercase letters', () => {
      expect(CHAR_TO_KEYCODE['a']).toBe('KeyA');
      expect(CHAR_TO_KEYCODE['z']).toBe('KeyZ');
    });

    it('should have mapping for uppercase letters', () => {
      expect(CHAR_TO_KEYCODE['A']).toBe('KeyA');
      expect(CHAR_TO_KEYCODE['Z']).toBe('KeyZ');
    });

    it('should have mapping for digits', () => {
      expect(CHAR_TO_KEYCODE['0']).toBe('Digit0');
      expect(CHAR_TO_KEYCODE['9']).toBe('Digit9');
    });

    it('should have mapping for space', () => {
      expect(CHAR_TO_KEYCODE[' ']).toBe('Space');
    });

    it('should have mapping for special characters', () => {
      expect(CHAR_TO_KEYCODE['!']).toBe('Digit1');
      expect(CHAR_TO_KEYCODE['@']).toBe('Digit2');
      expect(CHAR_TO_KEYCODE['.']).toBe('Period');
    });

    it('should have mapping for enter and tab', () => {
      expect(CHAR_TO_KEYCODE['\n']).toBe('Enter');
      expect(CHAR_TO_KEYCODE['\t']).toBe('Tab');
    });
  });

  describe('getKeyIdByChar', () => {
    it('should find key id for a character', () => {
      const layoutKeys = [
        { id: 'key-a', keyCode: 'KeyA' },
        { id: 'key-b', keyCode: 'KeyB' },
      ];
      expect(getKeyIdByChar('a', layoutKeys)).toBe('key-a');
    });

    it('should return null for unmapped character', () => {
      const layoutKeys = [{ id: 'key-a', keyCode: 'KeyA' }];
      expect(getKeyIdByChar('α', layoutKeys)).toBeNull();
    });

    it('should return null when no matching keyCode in layoutKeys', () => {
      const layoutKeys = [{ id: 'key-a', keyCode: 'KeyA' }];
      expect(getKeyIdByChar('b', layoutKeys)).toBeNull();
    });
  });

  describe('isShiftRequired', () => {
    it('should return true for uppercase letters', () => {
      expect(isShiftRequired('A')).toBe(true);
      expect(isShiftRequired('Z')).toBe(true);
    });

    it('should return false for lowercase letters', () => {
      expect(isShiftRequired('a')).toBe(false);
      expect(isShiftRequired('z')).toBe(false);
    });

    it('should return true for shift-required special chars', () => {
      expect(isShiftRequired('!')).toBe(true);
      expect(isShiftRequired('@')).toBe(true);
      expect(isShiftRequired('#')).toBe(true);
      expect(isShiftRequired('$')).toBe(true);
      expect(isShiftRequired('%')).toBe(true);
      expect(isShiftRequired('^')).toBe(true);
      expect(isShiftRequired('&')).toBe(true);
      expect(isShiftRequired('*')).toBe(true);
      expect(isShiftRequired('(')).toBe(true);
      expect(isShiftRequired(')')).toBe(true);
      expect(isShiftRequired('_')).toBe(true);
      expect(isShiftRequired('+')).toBe(true);
      expect(isShiftRequired('{')).toBe(true);
      expect(isShiftRequired('}')).toBe(true);
      expect(isShiftRequired('|')).toBe(true);
      expect(isShiftRequired(':')).toBe(true);
      expect(isShiftRequired('"')).toBe(true);
      expect(isShiftRequired('<')).toBe(true);
      expect(isShiftRequired('>')).toBe(true);
      expect(isShiftRequired('?')).toBe(true);
      expect(isShiftRequired('~')).toBe(true);
    });

    it('should return false for digits', () => {
      expect(isShiftRequired('0')).toBe(false);
      expect(isShiftRequired('9')).toBe(false);
    });
  });
});
