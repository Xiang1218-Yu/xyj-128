import { Difficulty } from '@/types/typingGame';

const easyWords = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
  'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people',
  'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is',
];

const mediumWords = [
  'ability', 'accept', 'achieve', 'across', 'action', 'actually', 'address', 'advantage', 'advertising', 'advice',
  'affect', 'against', 'agency', 'already', 'although', 'always', 'amount', 'analysis', 'animal', 'another',
  'answer', 'anyone', 'anything', 'apparently', 'appear', 'approach', 'appropriate', 'around', 'article', 'artist',
  'assume', 'attack', 'attention', 'audience', 'available', 'balance', 'beautiful', 'because', 'become', 'before',
  'behavior', 'behind', 'believe', 'benefit', 'between', 'beyond', 'billion', 'black', 'blood', 'board',
  'body', 'budget', 'build', 'building', 'business', 'camera', 'campaign', 'cancer', 'candidate', 'capital',
  'career', 'carry', 'catch', 'cause', 'center', 'central', 'century', 'certain', 'certainly', 'challenge',
  'chance', 'change', 'character', 'charge', 'check', 'child', 'choice', 'choose', 'church', 'citizen',
  'civil', 'claim', 'class', 'clear', 'clearly', 'close', 'coach', 'cold', 'collect', 'college',
  'color', 'come', 'commercial', 'common', 'community', 'company', 'compare', 'computer', 'concern', 'condition',
];

const hardWords = [
  'abbreviation', 'aberration', 'abhorrence', 'abnormality', 'abolitionism', 'abomination', 'abstruseness', 'acceleration', 'acclimatization', 'accommodation',
  'accomplishment', 'accountability', 'accreditation', 'acculturation', 'acknowledgment', 'acquaintanceship', 'acquisition', 'acrimoniousness', 'adjudication', 'administrative',
  'adolescence', 'adulteration', 'advertisement', 'aesthetically', 'affirmation', 'aggrandizement', 'aggravation', 'agriculture', 'allegation', 'allegiance',
  'alphabetically', 'altercation', 'ambidextrous', 'ambiguousness', 'amphitheater', 'analogousness', 'anachronism', 'anecdotal', 'annihilation', 'annotations',
  'announcement', 'antagonism', 'antecedent', 'anticipation', 'apologetically', 'apparatus', 'appeasement', 'appellation', 'appreciation', 'appropriation',
  'approximation', 'archaeological', 'architectural', 'arrangement', 'articulation', 'assassination', 'assimilation', 'association', 'astrophysicist', 'asynchronous',
  'atmospheric', 'attentiveness', 'attractiveness', 'auditorium', 'authenticity', 'authorization', 'autobiography', 'autonomous', 'availability', 'awkwardness',
  'bacteriological', 'balkanization', 'barbarousness', 'battlefield', 'beautiful', 'behavioristic', 'belaboredness', 'beneficence', 'bibliographer', 'biodegradable',
  'bipartisanship', 'bizarre', 'blasphemous', 'boisterous', 'bureaucracy', 'bureaucratic', 'butterscotch', 'calculating', 'calisthenics', 'camouflage',
  'cancellations', 'capabilities', 'capitalization', 'capriciousness', 'captivation', 'carbonization', 'careerism', 'categorization', 'causalities', 'celebration',
];

const easySentences = [
  'The quick brown fox jumps over the lazy dog.',
  'A journey of a thousand miles begins with a single step.',
  'To be or not to be that is the question.',
  'All that glitters is not gold.',
  'Actions speak louder than words.',
  'Practice makes perfect.',
  'Time flies when you are having fun.',
  'Knowledge is power.',
  'Life is what you make it.',
  'Every cloud has a silver lining.',
];

const mediumSentences = [
  'The only way to do great work is to love what you do.',
  'In the middle of difficulty lies opportunity.',
  'Success is not final failure is not fatal it is the courage to continue that counts.',
  'The future belongs to those who believe in the beauty of their dreams.',
  'It does not matter how slowly you go as long as you do not stop.',
  'The greatest glory in living lies not in never falling but in rising every time we fall.',
  'The way to get started is to quit talking and begin doing.',
  'Your time is limited so do not waste it living someone else life.',
  'If life were predictable it would cease to be life and be without flavor.',
  'If you look at what you have in life you will always have more.',
];

const hardSentences = [
  'The extraordinary complexity of quantum mechanics challenges our most fundamental intuitions about the nature of reality and the fabric of the universe itself.',
  'Psycholinguistic researchers have demonstrated that the brain processes syntactically ambiguous sentences through a remarkable integration of contextual semantic and pragmatic information.',
  'The constitutional doctrine of separation of powers serves as a bulwark against the potential for tyrannical consolidation of authority within any single branch of government.',
  'Electroencephalographic studies reveal that paradoxical sleep phases are characterized by desynchronized cortical activity despite pronounced muscular atonia and diminished behavioral responsiveness.',
  'The phenomenological exploration of intersubjectivity underscores the extent to which our perceptual experiences are fundamentally shaped by implicit cultural assumptions and embodied social practices.',
];

const codeSnippets = [
  'const sum = (a, b) => a + b;',
  'function fibonacci(n) { return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2); }',
  'const arr = [1, 2, 3, 4, 5].map(x => x * 2);',
  'if (value === null || value === undefined) { return defaultValue; }',
  'for (let i = 0; i < array.length; i++) { console.log(array[i]); }',
  'const result = await fetch(url).then(res => res.json());',
  'export interface User { id: number; name: string; email: string; }',
  'class Animal { constructor(name) { this.name = name; } speak() { console.log(this.name); } }',
  'const [state, setState] = useState(initialValue);',
  'try { riskyOperation(); } catch (error) { console.error(error); }',
];

function randomPick<T>(arr: T[], count: number): T[] {
  const result: T[] = [];
  const used = new Set<number>();
  while (result.length < count && used.size < arr.length) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx]);
    }
  }
  return result;
}

function generateWordsText(difficulty: Difficulty, wordCount: number): string {
  const wordPool = difficulty === 'easy' ? easyWords : difficulty === 'medium' ? mediumWords : hardWords;
  const words = randomPick(wordPool, wordCount);
  return words.join(' ');
}

function generateSentencesText(difficulty: Difficulty, sentenceCount: number): string {
  const sentencePool = difficulty === 'easy' ? easySentences : difficulty === 'medium' ? mediumSentences : hardSentences;
  const sentences = randomPick(sentencePool, sentenceCount);
  return sentences.join(' ');
}

function generateCodeText(count: number): string {
  const snippets = randomPick(codeSnippets, count);
  return snippets.join(' ');
}

export function generatePracticeText(
  mode: 'words' | 'sentences' | 'code',
  difficulty: Difficulty
): string {
  switch (mode) {
    case 'words':
      return generateWordsText(difficulty, difficulty === 'easy' ? 30 : difficulty === 'medium' ? 25 : 20);
    case 'sentences':
      return generateSentencesText(difficulty, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 2 : 1);
    case 'code':
      return generateCodeText(difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);
    default:
      return generateWordsText('easy', 30);
  }
}

export const CHAR_TO_KEYCODE: Record<string, string> = {
  'a': 'KeyA', 'b': 'KeyB', 'c': 'KeyC', 'd': 'KeyD', 'e': 'KeyE',
  'f': 'KeyF', 'g': 'KeyG', 'h': 'KeyH', 'i': 'KeyI', 'j': 'KeyJ',
  'k': 'KeyK', 'l': 'KeyL', 'm': 'KeyM', 'n': 'KeyN', 'o': 'KeyO',
  'p': 'KeyP', 'q': 'KeyQ', 'r': 'KeyR', 's': 'KeyS', 't': 'KeyT',
  'u': 'KeyU', 'v': 'KeyV', 'w': 'KeyW', 'x': 'KeyX', 'y': 'KeyY',
  'z': 'KeyZ',
  'A': 'KeyA', 'B': 'KeyB', 'C': 'KeyC', 'D': 'KeyD', 'E': 'KeyE',
  'F': 'KeyF', 'G': 'KeyG', 'H': 'KeyH', 'I': 'KeyI', 'J': 'KeyJ',
  'K': 'KeyK', 'L': 'KeyL', 'M': 'KeyM', 'N': 'KeyN', 'O': 'KeyO',
  'P': 'KeyP', 'Q': 'KeyQ', 'R': 'KeyR', 'S': 'KeyS', 'T': 'KeyT',
  'U': 'KeyU', 'V': 'KeyV', 'W': 'KeyW', 'X': 'KeyX', 'Y': 'KeyY',
  'Z': 'KeyZ',
  '0': 'Digit0', '1': 'Digit1', '2': 'Digit2', '3': 'Digit3', '4': 'Digit4',
  '5': 'Digit5', '6': 'Digit6', '7': 'Digit7', '8': 'Digit8', '9': 'Digit9',
  ' ': 'Space',
  '.': 'Period', ',': 'Comma', ';': 'Semicolon', "'": 'Quote',
  '[': 'BracketLeft', ']': 'BracketRight', '\\': 'Backslash',
  '/': 'Slash', '-': 'Minus', '=': 'Equal', '`': 'Backquote',
  '!': 'Digit1', '@': 'Digit2', '#': 'Digit3', '$': 'Digit4', '%': 'Digit5',
  '^': 'Digit6', '&': 'Digit7', '*': 'Digit8', '(': 'Digit9', ')': 'Digit0',
  '_': 'Minus', '+': 'Equal',
  '{': 'BracketLeft', '}': 'BracketRight', '|': 'Backslash',
  ':': 'Semicolon', '"': 'Quote', '<': 'Comma', '>': 'Period', '?': 'Slash',
  '~': 'Backquote',
  '\n': 'Enter', '\r': 'Enter',
  '\t': 'Tab',
};

export function getKeyIdByChar(char: string, layoutKeys: Array<{ id: string; keyCode?: string }>): string | null {
  const keyCode = CHAR_TO_KEYCODE[char];
  if (!keyCode) return null;
  const key = layoutKeys.find((k) => k.keyCode === keyCode);
  return key ? key.id : null;
}

export function isShiftRequired(char: string): boolean {
  return /[A-Z!@#$%^&*()_+{}|:"<>?~]/.test(char);
}
