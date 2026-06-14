import { useEffect } from 'react';
import { useUITheme, useSetUITheme } from '@/store/useKeyboardStore';
import { getUITheme } from '@/data/themes';
import { UIThemeType } from '@/types/keyboard';

export function useTheme() {
  const currentTheme = useUITheme();
  const setUITheme = useSetUITheme();

  useEffect(() => {
    const theme = getUITheme(currentTheme);

    const root = document.documentElement;
    
    const ambience = theme.sceneAmbience;
    
    root.style.setProperty('--theme-bg', ambience.backgroundColor);
    root.style.setProperty('--theme-fog', ambience.fogColor);
    root.style.setProperty('--theme-ambient', ambience.ambientLightColor || '#ffffff');
    root.style.setProperty('--theme-bloom-intensity', String(ambience.bloomIntensity));
    root.style.setProperty('--theme-bloom-threshold', String(ambience.bloomThreshold));

    document.body.style.backgroundColor = ambience.backgroundColor;

    root.classList.remove('theme-midnight', 'theme-sunset', 'theme-ocean', 'theme-forest', 'theme-cyberpunk', 'theme-minimal', 'theme-vintage', 'theme-aurora');
    root.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  const setTheme = (themeId: UIThemeType) => {
    setUITheme(themeId);
  };

  const cycleTheme = () => {
    const themes: UIThemeType[] = ['midnight', 'sunset', 'ocean', 'forest', 'cyberpunk', 'minimal', 'vintage', 'aurora'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setUITheme(themes[nextIndex]);
  };

  return {
    theme: currentTheme,
    setTheme,
    cycleTheme,
    themeConfig: getUITheme(currentTheme),
  };
}
