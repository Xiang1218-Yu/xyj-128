import { LayoutConfig, LayoutType, KeyConfig, KeyZone, LayoutRowDef, RowKeyDef } from '@/types/keyboard';
import {
  KEY_GAP_X,
  ROW_HEIGHT,
  generateKeyRow,
  generateLayoutKeys,
  shiftKeys,
  calculateLayoutDimensions,
} from '@/utils/layoutUtils';

const Z = {
  ALPHA: 'alphanumeric' as KeyZone,
  FUNC: 'function' as KeyZone,
  NAV: 'navigation' as KeyZone,
  NUMPAD: 'numpad' as KeyZone,
  MOD: 'modifiers' as KeyZone,
  SPACE: 'spacebar' as KeyZone,
};

const ESC_AFTER_GAP = 0.2;
const MOD_AFTER_GAP = 0.05;

const row0Keys60: RowKeyDef[] = [
  { label: 'Esc', zone: Z.FUNC, keyCode: 'Escape' },
  { label: '1', zone: Z.ALPHA, keyCode: 'Digit1', xOffset: ESC_AFTER_GAP },
  { label: '2', zone: Z.ALPHA, keyCode: 'Digit2' },
  { label: '3', zone: Z.ALPHA, keyCode: 'Digit3' },
  { label: '4', zone: Z.ALPHA, keyCode: 'Digit4' },
  { label: '5', zone: Z.ALPHA, keyCode: 'Digit5' },
  { label: '6', zone: Z.ALPHA, keyCode: 'Digit6' },
  { label: '7', zone: Z.ALPHA, keyCode: 'Digit7' },
  { label: '8', zone: Z.ALPHA, keyCode: 'Digit8' },
  { label: '9', zone: Z.ALPHA, keyCode: 'Digit9' },
  { label: '0', zone: Z.ALPHA, keyCode: 'Digit0' },
  { label: '-', zone: Z.ALPHA, keyCode: 'Minus' },
  { label: '=', zone: Z.ALPHA, keyCode: 'Equal' },
  { label: 'Back', width: 1.75, zone: Z.MOD, keyCode: 'Backspace' },
];

const row1Keys60: RowKeyDef[] = [
  { label: 'Tab', width: 1.5, zone: Z.MOD, keyCode: 'Tab' },
  { label: 'Q', zone: Z.ALPHA, keyCode: 'KeyQ', xOffset: MOD_AFTER_GAP },
  { label: 'W', zone: Z.ALPHA, keyCode: 'KeyW' },
  { label: 'E', zone: Z.ALPHA, keyCode: 'KeyE' },
  { label: 'R', zone: Z.ALPHA, keyCode: 'KeyR' },
  { label: 'T', zone: Z.ALPHA, keyCode: 'KeyT' },
  { label: 'Y', zone: Z.ALPHA, keyCode: 'KeyY' },
  { label: 'U', zone: Z.ALPHA, keyCode: 'KeyU' },
  { label: 'I', zone: Z.ALPHA, keyCode: 'KeyI' },
  { label: 'O', zone: Z.ALPHA, keyCode: 'KeyO' },
  { label: 'P', zone: Z.ALPHA, keyCode: 'KeyP' },
  { label: '[', zone: Z.ALPHA, keyCode: 'BracketLeft' },
  { label: ']', zone: Z.ALPHA, keyCode: 'BracketRight' },
  { label: '\\', width: 1.4, zone: Z.ALPHA, keyCode: 'Backslash' },
];

const row2Keys60: RowKeyDef[] = [
  { label: 'Caps', width: 1.75, zone: Z.MOD, keyCode: 'CapsLock' },
  { label: 'A', zone: Z.ALPHA, keyCode: 'KeyA', xOffset: MOD_AFTER_GAP },
  { label: 'S', zone: Z.ALPHA, keyCode: 'KeyS' },
  { label: 'D', zone: Z.ALPHA, keyCode: 'KeyD' },
  { label: 'F', zone: Z.ALPHA, keyCode: 'KeyF' },
  { label: 'G', zone: Z.ALPHA, keyCode: 'KeyG' },
  { label: 'H', zone: Z.ALPHA, keyCode: 'KeyH' },
  { label: 'J', zone: Z.ALPHA, keyCode: 'KeyJ' },
  { label: 'K', zone: Z.ALPHA, keyCode: 'KeyK' },
  { label: 'L', zone: Z.ALPHA, keyCode: 'KeyL' },
  { label: ';', zone: Z.ALPHA, keyCode: 'Semicolon' },
  { label: "'", zone: Z.ALPHA, keyCode: 'Quote' },
  { label: 'Enter', width: 2.2, zone: Z.MOD, keyCode: 'Enter' },
];

const row3Keys60: RowKeyDef[] = [
  { label: 'Shift', width: 2.25, zone: Z.MOD, keyCode: 'ShiftLeft' },
  { label: 'Z', zone: Z.ALPHA, keyCode: 'KeyZ', xOffset: MOD_AFTER_GAP },
  { label: 'X', zone: Z.ALPHA, keyCode: 'KeyX' },
  { label: 'C', zone: Z.ALPHA, keyCode: 'KeyC' },
  { label: 'V', zone: Z.ALPHA, keyCode: 'KeyV' },
  { label: 'B', zone: Z.ALPHA, keyCode: 'KeyB' },
  { label: 'N', zone: Z.ALPHA, keyCode: 'KeyN' },
  { label: 'M', zone: Z.ALPHA, keyCode: 'KeyM' },
  { label: ',', zone: Z.ALPHA, keyCode: 'Comma' },
  { label: '.', zone: Z.ALPHA, keyCode: 'Period' },
  { label: '/', zone: Z.ALPHA, keyCode: 'Slash' },
  { label: 'Shift', width: 2.75, zone: Z.MOD, keyCode: 'ShiftRight' },
];

const row4Keys60: RowKeyDef[] = [
  { label: 'Ctrl', width: 1.25, zone: Z.MOD, keyCode: 'ControlLeft' },
  { label: 'Win', width: 1.25, zone: Z.MOD, keyCode: 'MetaLeft', xOffset: MOD_AFTER_GAP },
  { label: 'Alt', width: 1.25, zone: Z.MOD, keyCode: 'AltLeft' },
  { label: 'Space', width: 6.25, zone: Z.SPACE, keyCode: 'Space' },
  { label: 'Alt', width: 1.25, zone: Z.MOD, keyCode: 'AltRight' },
  { label: 'Fn', width: 1.25, zone: Z.MOD },
  { label: 'Menu', width: 1.25, zone: Z.MOD, keyCode: 'ContextMenu' },
  { label: 'Ctrl', width: 1.25, zone: Z.MOD, keyCode: 'ControlRight' },
];

const rows60: LayoutRowDef[] = [
  { keys: row0Keys60 },
  { keys: row1Keys60 },
  { keys: row2Keys60 },
  { keys: row3Keys60 },
  { keys: row4Keys60 },
];

const generate60Layout = (): KeyConfig[] => generateLayoutKeys(rows60);

const generate65Layout = (): KeyConfig[] => {
  const keys = generate60Layout();

  keys.push(
    ...generateKeyRow(
      [{ label: 'Del', zone: Z.NAV, keyCode: 'Delete' }],
      { rowIndex: 1, rowStartX: 15.7, colStartIndex: 15, idPrefix: 'r1-65-' }
    )
  );
  keys.push(
    ...generateKeyRow(
      [{ label: 'PgUp', zone: Z.NAV, keyCode: 'PageUp' }],
      { rowIndex: 2, rowStartX: 15.7, colStartIndex: 15, idPrefix: 'r2-65-' }
    )
  );
  keys.push(
    ...generateKeyRow(
      [{ label: 'PgDn', zone: Z.NAV, keyCode: 'PageDown' }],
      { rowIndex: 3, rowStartX: 15.7, colStartIndex: 15, idPrefix: 'r3-65-' }
    )
  );
  keys.push(
    ...generateKeyRow(
      [{ label: '←', zone: Z.NAV, keyCode: 'ArrowLeft' }],
      { rowIndex: 4, rowStartX: 15.7, colStartIndex: 15, idPrefix: 'r4-65-' }
    )
  );
  keys.push(
    ...generateKeyRow(
      [
        { label: '↑', zone: Z.NAV, keyCode: 'ArrowUp' },
        { label: '↓', zone: Z.NAV, keyCode: 'ArrowDown' },
        { label: '→', zone: Z.NAV, keyCode: 'ArrowRight' },
      ],
      { rowIndex: 5, rowStartX: 13.6, colStartIndex: 13, idPrefix: 'r5-65-' }
    )
  );

  const row4Keys = keys.filter((k) => k.row === 4);
  const lastRow4Key = row4Keys[row4Keys.length - 1];
  if (lastRow4Key && lastRow4Key.label === 'Ctrl') {
    lastRow4Key.width = 1.0;
    lastRow4Key.x = 14.7;
  }

  return keys;
};

const funcRowKeys75: RowKeyDef[] = [
  { label: 'Esc', zone: Z.FUNC, keyCode: 'Escape' },
  { label: 'F1', zone: Z.FUNC, keyCode: 'F1', xOffset: ESC_AFTER_GAP },
  { label: 'F2', zone: Z.FUNC, keyCode: 'F2' },
  { label: 'F3', zone: Z.FUNC, keyCode: 'F3' },
  { label: 'F4', zone: Z.FUNC, keyCode: 'F4' },
  { label: 'F5', zone: Z.FUNC, keyCode: 'F5' },
  { label: 'F6', zone: Z.FUNC, keyCode: 'F6' },
  { label: 'F7', zone: Z.FUNC, keyCode: 'F7' },
  { label: 'F8', zone: Z.FUNC, keyCode: 'F8' },
  { label: 'F9', zone: Z.FUNC, keyCode: 'F9' },
  { label: 'F10', zone: Z.FUNC, keyCode: 'F10' },
  { label: 'F11', zone: Z.FUNC, keyCode: 'F11' },
  { label: 'F12', zone: Z.FUNC, keyCode: 'F12' },
  { label: 'Del', zone: Z.NAV, keyCode: 'Delete' },
  { label: 'Home', zone: Z.NAV, keyCode: 'Home' },
  { label: 'End', zone: Z.NAV, keyCode: 'End' },
];

const generate75Layout = (): KeyConfig[] => {
  const keys: KeyConfig[] = [];

  keys.push(...generateKeyRow(funcRowKeys75, { rowIndex: 0 }));

  const base65 = generate65Layout();
  keys.push(...shiftKeys(base65, 0, ROW_HEIGHT, 1, '75-'));

  return keys;
};

const funcRowKeysTKL: RowKeyDef[] = [
  { label: 'Esc', zone: Z.FUNC, keyCode: 'Escape' },
  { label: 'F1', zone: Z.FUNC, keyCode: 'F1', xOffset: 0.45 },
  { label: 'F2', zone: Z.FUNC, keyCode: 'F2' },
  { label: 'F3', zone: Z.FUNC, keyCode: 'F3' },
  { label: 'F4', zone: Z.FUNC, keyCode: 'F4' },
  { label: 'F5', zone: Z.FUNC, keyCode: 'F5', xOffset: 0.5 },
  { label: 'F6', zone: Z.FUNC, keyCode: 'F6' },
  { label: 'F7', zone: Z.FUNC, keyCode: 'F7' },
  { label: 'F8', zone: Z.FUNC, keyCode: 'F8' },
  { label: 'F9', zone: Z.FUNC, keyCode: 'F9', xOffset: 0.5 },
  { label: 'F10', zone: Z.FUNC, keyCode: 'F10' },
  { label: 'F11', zone: Z.FUNC, keyCode: 'F11' },
  { label: 'F12', zone: Z.FUNC, keyCode: 'F12' },
  { label: 'PrtSc', zone: Z.NAV, keyCode: 'PrintScreen', xOffset: 0.5 },
  { label: 'ScrLk', zone: Z.NAV, keyCode: 'ScrollLock' },
  { label: 'Pause', zone: Z.NAV, keyCode: 'Pause' },
];

const row1KeysTKL: RowKeyDef[] = [
  { label: '`', zone: Z.ALPHA, keyCode: 'Backquote' },
  { label: '1', zone: Z.ALPHA, keyCode: 'Digit1' },
  { label: '2', zone: Z.ALPHA, keyCode: 'Digit2' },
  { label: '3', zone: Z.ALPHA, keyCode: 'Digit3' },
  { label: '4', zone: Z.ALPHA, keyCode: 'Digit4' },
  { label: '5', zone: Z.ALPHA, keyCode: 'Digit5' },
  { label: '6', zone: Z.ALPHA, keyCode: 'Digit6' },
  { label: '7', zone: Z.ALPHA, keyCode: 'Digit7' },
  { label: '8', zone: Z.ALPHA, keyCode: 'Digit8' },
  { label: '9', zone: Z.ALPHA, keyCode: 'Digit9' },
  { label: '0', zone: Z.ALPHA, keyCode: 'Digit0' },
  { label: '-', zone: Z.ALPHA, keyCode: 'Minus' },
  { label: '=', zone: Z.ALPHA, keyCode: 'Equal' },
  { label: 'Back', width: 2, zone: Z.MOD, keyCode: 'Backspace' },
  { label: 'Ins', zone: Z.NAV, keyCode: 'Insert', xOffset: 0.5 },
  { label: 'Home', zone: Z.NAV, keyCode: 'Home' },
  { label: 'PgUp', zone: Z.NAV, keyCode: 'PageUp' },
];

const row2KeysTKL: RowKeyDef[] = [
  { label: 'Tab', width: 1.5, zone: Z.MOD, keyCode: 'Tab' },
  { label: 'Q', zone: Z.ALPHA, keyCode: 'KeyQ', xOffset: MOD_AFTER_GAP },
  { label: 'W', zone: Z.ALPHA, keyCode: 'KeyW' },
  { label: 'E', zone: Z.ALPHA, keyCode: 'KeyE' },
  { label: 'R', zone: Z.ALPHA, keyCode: 'KeyR' },
  { label: 'T', zone: Z.ALPHA, keyCode: 'KeyT' },
  { label: 'Y', zone: Z.ALPHA, keyCode: 'KeyY' },
  { label: 'U', zone: Z.ALPHA, keyCode: 'KeyU' },
  { label: 'I', zone: Z.ALPHA, keyCode: 'KeyI' },
  { label: 'O', zone: Z.ALPHA, keyCode: 'KeyO' },
  { label: 'P', zone: Z.ALPHA, keyCode: 'KeyP' },
  { label: '[', zone: Z.ALPHA, keyCode: 'BracketLeft' },
  { label: ']', zone: Z.ALPHA, keyCode: 'BracketRight' },
  { label: '\\', width: 1.45, zone: Z.ALPHA, keyCode: 'Backslash' },
  { label: 'Del', zone: Z.NAV, keyCode: 'Delete', xOffset: 0.5 },
  { label: 'End', zone: Z.NAV, keyCode: 'End' },
  { label: 'PgDn', zone: Z.NAV, keyCode: 'PageDown' },
];

const row3KeysTKL: RowKeyDef[] = [
  { label: 'Caps', width: 1.75, zone: Z.MOD, keyCode: 'CapsLock' },
  { label: 'A', zone: Z.ALPHA, keyCode: 'KeyA', xOffset: MOD_AFTER_GAP },
  { label: 'S', zone: Z.ALPHA, keyCode: 'KeyS' },
  { label: 'D', zone: Z.ALPHA, keyCode: 'KeyD' },
  { label: 'F', zone: Z.ALPHA, keyCode: 'KeyF' },
  { label: 'G', zone: Z.ALPHA, keyCode: 'KeyG' },
  { label: 'H', zone: Z.ALPHA, keyCode: 'KeyH' },
  { label: 'J', zone: Z.ALPHA, keyCode: 'KeyJ' },
  { label: 'K', zone: Z.ALPHA, keyCode: 'KeyK' },
  { label: 'L', zone: Z.ALPHA, keyCode: 'KeyL' },
  { label: ';', zone: Z.ALPHA, keyCode: 'Semicolon' },
  { label: "'", zone: Z.ALPHA, keyCode: 'Quote' },
  { label: 'Enter', width: 2.25, zone: Z.MOD, keyCode: 'Enter' },
];

const row4KeysTKL: RowKeyDef[] = [
  { label: 'Shift', width: 2.25, zone: Z.MOD, keyCode: 'ShiftLeft' },
  { label: 'Z', zone: Z.ALPHA, keyCode: 'KeyZ', xOffset: MOD_AFTER_GAP },
  { label: 'X', zone: Z.ALPHA, keyCode: 'KeyX' },
  { label: 'C', zone: Z.ALPHA, keyCode: 'KeyC' },
  { label: 'V', zone: Z.ALPHA, keyCode: 'KeyV' },
  { label: 'B', zone: Z.ALPHA, keyCode: 'KeyB' },
  { label: 'N', zone: Z.ALPHA, keyCode: 'KeyN' },
  { label: 'M', zone: Z.ALPHA, keyCode: 'KeyM' },
  { label: ',', zone: Z.ALPHA, keyCode: 'Comma' },
  { label: '.', zone: Z.ALPHA, keyCode: 'Period' },
  { label: '/', zone: Z.ALPHA, keyCode: 'Slash' },
  { label: 'Shift', width: 2.8, zone: Z.MOD, keyCode: 'ShiftRight' },
  { label: '↑', zone: Z.NAV, keyCode: 'ArrowUp', xOffset: 0.55 },
];

const row5KeysTKL: RowKeyDef[] = [
  { label: 'Ctrl', width: 1.25, zone: Z.MOD, keyCode: 'ControlLeft' },
  { label: 'Win', width: 1.25, zone: Z.MOD, keyCode: 'MetaLeft', xOffset: MOD_AFTER_GAP },
  { label: 'Alt', width: 1.25, zone: Z.MOD, keyCode: 'AltLeft' },
  { label: 'Space', width: 6.25, zone: Z.SPACE, keyCode: 'Space' },
  { label: 'Alt', width: 1.25, zone: Z.MOD, keyCode: 'AltRight' },
  { label: 'Win', width: 1.25, zone: Z.MOD, keyCode: 'MetaRight' },
  { label: 'Menu', width: 1.25, zone: Z.MOD, keyCode: 'ContextMenu' },
  { label: 'Ctrl', width: 1.25, zone: Z.MOD, keyCode: 'ControlRight' },
  { label: '←', zone: Z.NAV, keyCode: 'ArrowLeft', xOffset: 0.5 },
  { label: '↓', zone: Z.NAV, keyCode: 'ArrowDown' },
  { label: '→', zone: Z.NAV, keyCode: 'ArrowRight' },
];

const generateTKLLayout = (): KeyConfig[] => {
  const rows: LayoutRowDef[] = [
    { keys: funcRowKeysTKL },
    { keys: row1KeysTKL },
    { keys: row2KeysTKL },
    { keys: row3KeysTKL },
    { keys: row4KeysTKL },
    { keys: row5KeysTKL },
  ];
  return generateLayoutKeys(rows);
};

const numpadX = 19.8;

const generateFullLayout = (): KeyConfig[] => {
  const keys = generateTKLLayout();

  keys.push(
    ...generateKeyRow(
      [
        { label: 'Num', zone: Z.NUMPAD, keyCode: 'NumLock' },
        { label: '/', zone: Z.NUMPAD, keyCode: 'NumpadDivide' },
        { label: '*', zone: Z.NUMPAD, keyCode: 'NumpadMultiply' },
        { label: '-', zone: Z.NUMPAD, keyCode: 'NumpadSubtract' },
      ],
      { rowIndex: 1, rowStartX: numpadX, colStartIndex: 20, idPrefix: 'np1-' }
    )
  );
  keys.push(
    ...generateKeyRow(
      [
        { label: '7', zone: Z.NUMPAD, keyCode: 'Numpad7' },
        { label: '8', zone: Z.NUMPAD, keyCode: 'Numpad8' },
        { label: '9', zone: Z.NUMPAD, keyCode: 'Numpad9' },
        { label: '+', zone: Z.NUMPAD, keyCode: 'NumpadAdd' },
      ],
      { rowIndex: 2, rowStartX: numpadX, colStartIndex: 20, idPrefix: 'np2-' }
    )
  );
  keys.push(
    ...generateKeyRow(
      [
        { label: '4', zone: Z.NUMPAD, keyCode: 'Numpad4' },
        { label: '5', zone: Z.NUMPAD, keyCode: 'Numpad5' },
        { label: '6', zone: Z.NUMPAD, keyCode: 'Numpad6' },
      ],
      { rowIndex: 3, rowStartX: numpadX, colStartIndex: 20, idPrefix: 'np3-' }
    )
  );

  const npRow4Keys = generateKeyRow(
    [
      { label: '1', zone: Z.NUMPAD, keyCode: 'Numpad1' },
      { label: '2', zone: Z.NUMPAD, keyCode: 'Numpad2' },
      { label: '3', zone: Z.NUMPAD, keyCode: 'Numpad3' },
      { label: 'Enter', zone: Z.NUMPAD, keyCode: 'NumpadEnter' },
    ],
    { rowIndex: 4, rowStartX: numpadX, colStartIndex: 20, idPrefix: 'np4-' }
  );
  const npEnter = npRow4Keys.find((k) => k.id === 'np4-3');
  if (npEnter) {
    npEnter.height = 2.1;
  }
  keys.push(...npRow4Keys);

  keys.push(
    ...generateKeyRow(
      [
        { label: '0', width: 2.05, zone: Z.NUMPAD, keyCode: 'Numpad0' },
        { label: '.', zone: Z.NUMPAD, keyCode: 'NumpadDecimal', xOffset: 0.05 - KEY_GAP_X },
      ],
      { rowIndex: 5, rowStartX: numpadX, colStartIndex: 20, idPrefix: 'np5-' }
    )
  );

  return keys;
};

const buildLayoutConfig = (
  type: LayoutType,
  name: string,
  description: string,
  keys: KeyConfig[],
  overrides?: { width?: number; height?: number }
): LayoutConfig => {
  const dims = calculateLayoutDimensions(keys);
  return {
    type,
    name,
    description,
    keys,
    width: overrides?.width ?? dims.width,
    height: overrides?.height ?? dims.height,
  };
};

export const LAYOUT_CONFIGS: Record<LayoutType, LayoutConfig> = {
  '60%': buildLayoutConfig(
    '60%',
    '60% 紧凑型',
    '最小化设计，仅保留核心按键，适合追求简洁的用户',
    generate60Layout()
  ),
  '65%': buildLayoutConfig(
    '65%',
    '65% 紧凑+',
    '在60%基础上增加方向键和导航键，平衡便携与功能',
    generate65Layout()
  ),
  '75%': buildLayoutConfig(
    '75%',
    '75% 功能型',
    '包含完整功能键行，紧凑布局适合小桌面',
    generate75Layout()
  ),
  TKL: buildLayoutConfig(
    'TKL',
    'TKL 87键',
    '无数字键盘的经典布局，保留完整功能区和导航区',
    generateTKLLayout()
  ),
  Full: buildLayoutConfig(
    'Full',
    '全尺寸 104键',
    '完整键盘布局，包含数字小键盘，适合数据输入',
    generateFullLayout()
  ),
};

export const LAYOUT_LIST: LayoutType[] = ['60%', '65%', '75%', 'TKL', 'Full'];
