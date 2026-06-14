import { Palette, Sparkles } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { UI_THEMES, UI_THEME_LIST } from '@/data/themes';
import { UIThemeType } from '@/types/keyboard';

export function ThemeSelector() {
  const { theme, setTheme, themeConfig } = useTheme();

  const handleThemeSelect = (themeId: UIThemeType) => {
    setTheme(themeId);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-medium text-gray-200">UI 视觉主题</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-600/20 rounded-lg border border-purple-500/30">
          <Sparkles className="w-3 h-3 text-purple-300" />
          <span className="text-[10px] text-purple-300 font-medium">联动 3D 场景</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/40 rounded-lg border border-gray-700/30">
          <span className="text-xl">{themeConfig.icon}</span>
          <div>
            <div className="text-sm font-medium text-white">{themeConfig.name}</div>
            <div className="text-xs text-gray-400">{themeConfig.description}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {UI_THEME_LIST.map((themeId) => {
          const themeData = UI_THEMES[themeId];
          const isActive = theme === themeId;
          
          return (
            <button
              key={themeId}
              onClick={() => handleThemeSelect(themeId)}
              className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/50 shadow-lg shadow-purple-500/10'
                  : 'bg-gray-800/40 border border-gray-700/30 hover:bg-gray-700/50 hover:border-gray-600/50'
              }`}
              title={themeData.description}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-inner"
                style={{
                  backgroundColor: themeData.sceneAmbience.backgroundColor,
                  boxShadow: isActive 
                    ? `0 0 12px ${themeData.sceneAmbience.backgroundColor}80, inset 0 0 0 2px ${themeData.lighting.pointLights[0]?.color || '#ffffff'}40`
                    : 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                }}
              >
                {themeData.icon}
              </div>
              
              <div className="flex gap-0.5">
                {themeData.lighting.pointLights.slice(0, 3).map((light, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ 
                      backgroundColor: light.color,
                      boxShadow: isActive ? `0 0 4px ${light.color}` : 'none',
                    }}
                  />
                ))}
              </div>
              
              <span className={`text-[10px] leading-tight text-center font-medium ${
                isActive ? 'text-purple-200' : 'text-gray-400 group-hover:text-gray-300'
              }`}>
                {themeData.name}
              </span>
              
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 p-3 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-700/30">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs font-medium text-purple-300">场景氛围同步</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded border border-gray-600/50"
              style={{ backgroundColor: themeConfig.sceneAmbience.backgroundColor }}
            />
            <span className="text-gray-400">背景</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded border border-gray-600/50"
              style={{ backgroundColor: themeConfig.lighting.directionalLights[0]?.color || '#ffffff' }}
            />
            <span className="text-gray-400">主光源</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded border border-gray-600/50"
              style={{ backgroundColor: themeConfig.lighting.pointLights[0]?.color || '#ffffff' }}
            />
            <span className="text-gray-400">氛围光</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: '#ffffff',
                opacity: themeConfig.sceneAmbience.bloomIntensity,
                boxShadow: `0 0 ${themeConfig.sceneAmbience.bloomIntensity * 8}px #ffffff`,
              }}
            />
            <span className="text-gray-400">辉光强度</span>
          </div>
        </div>
      </div>
    </div>
  );
}
