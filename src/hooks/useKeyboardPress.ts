import { useEffect, useCallback } from 'react';
import { useKeyboardStore } from '@/store/useKeyboardStore';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { useLayout, useSwitchType, useSoundEnabled } from '@/store/useKeyboardStore';
import { playPressSound, playReleaseSound } from '@/utils/switchSound';

export const useKeyboardPress = () => {
  const layout = useLayout();
  const switchType = useSwitchType();
  const soundEnabled = useSoundEnabled();
  const pressKey = useKeyboardStore((state) => state.pressKey);
  const releaseKey = useKeyboardStore((state) => state.releaseKey);

  const getKeyIdByCode = useCallback(
    (code: string): string | null => {
      const layoutConfig = LAYOUT_CONFIGS[layout];
      const key = layoutConfig.keys.find((k) => k.keyCode === code);
      return key ? key.id : null;
    },
    [layout]
  );

  useEffect(() => {
    const isInputFocused = () => {
      const active = document.activeElement;
      if (!active) return false;
      const tag = active.tagName.toLowerCase();
      return (
        tag === 'input' ||
        tag === 'textarea' ||
        active.hasAttribute('contenteditable')
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused()) return;
      const keyId = getKeyIdByCode(e.code);
      if (keyId) {
        e.preventDefault();
        pressKey(keyId);
        if (soundEnabled) {
          playPressSound(switchType);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isInputFocused()) return;
      const keyId = getKeyIdByCode(e.code);
      if (keyId) {
        e.preventDefault();
        releaseKey(keyId);
        if (soundEnabled) {
          playReleaseSound(switchType);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [getKeyIdByCode, pressKey, releaseKey, switchType, soundEnabled]);
};
