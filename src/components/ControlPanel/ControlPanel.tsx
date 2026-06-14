import { Keyboard, Info, Mouse, MousePointer2, Download, ChevronDown, ChevronUp, Gamepad2, Grid3X3 } from 'lucide-react';
import { useState } from 'react';
import { LayoutSelector } from './LayoutSelector';
import { MaterialSelector } from './MaterialSelector';
import { ZoneColorPicker } from './ZoneColorPicker';
import { SwitchSelector } from './SwitchSelector';
import { SwitchCurveVisualizer } from './SwitchCurveVisualizer';
import { KeyCapEditor } from './KeyCapEditor';
import { LightingControl } from './LightingControl';
import { LayoutEditor } from './LayoutEditor';
import { ColorSchemeMarket } from './ColorSchemeMarket';
import { ThemeSelector } from './ThemeSelector';
import { KeyCapProfileSelector } from './KeyCapProfileSelector';
import { KeyboardScaleControl } from './KeyboardScaleControl';
import { TypingStatsPanel } from './TypingStatsPanel';
import { PressDepthIndicator } from './PressDepthIndicator';
import { TypingGame } from '@/components/TypingGame/TypingGame';
import { KeyZone } from '@/types/keyboard';
import { useLayout, useLayoutEditMode } from '@/store/useKeyboardStore';
import { useTheme } from '@/hooks/useTheme';
import { LAYOUT_CONFIGS } from '@/data/layouts';

interface ControlPanelProps {
  selectedZone: KeyZone | null;
  onZoneChange: (zone: KeyZone | null) => void;
  onExport?: () => void;
  isExporting?: boolean;
}

export function ControlPanel({ selectedZone, onZoneChange, onExport, isExporting }: ControlPanelProps) {
  const [showTips, setShowTips] = useState(true);
  const [showTypingGame, setShowTypingGame] = useState(true);
  const layout = useLayout();
  const layoutEditMode = useLayoutEditMode();
  const layoutConfig = LAYOUT_CONFIGS[layout];
  const { themeConfig } = useTheme();

  const colors = themeConfig.colors;

  return (
    <div className={`h-full flex flex-col ${colors.bgPrimary} backdrop-blur-xl border-l ${colors.borderColor}`}>
      <div className={`p-6 border-b ${colors.borderColor}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 bg-gradient-to-br ${colors.accentGradient} rounded-xl`}>
            <Keyboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${colors.textPrimary}`}>DIY 键盘工坊</h1>
            <p className={`text-xs ${colors.textTertiary}`}>定制你的专属键盘</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 ${colors.bgSecondary} rounded-lg`}>
          <Info className={`w-4 h-4 ${colors.accentPrimary} flex-shrink-0`} />
          <span className={`text-xs ${colors.textSecondary}`}>
            当前布局: <span className={`${colors.accentPrimary} font-medium`}>{layoutConfig.name}</span>
            <span className={`${colors.textTertiary} ml-1`}>({layoutConfig.keys.length} 键)</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <ThemeSelector />
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />

        <div className="space-y-3">
          <button
            onClick={() => setShowTypingGame(!showTypingGame)}
            className={`w-full flex items-center justify-between px-3 py-2.5 ${colors.bgElevated} hover:opacity-90 rounded-xl border ${colors.borderColor} transition-all group`}
          >
            <span className="flex items-center gap-2">
              <Gamepad2 className={`w-4 h-4 ${colors.accentPrimary}`} />
              <span className={`text-sm ${colors.textPrimary} font-medium`}>打字练习小游戏</span>
            </span>
            {showTypingGame ? (
              <ChevronUp className={`w-4 h-4 ${colors.textTertiary} group-hover:${colors.textPrimary} transition-colors`} />
            ) : (
              <ChevronDown className={`w-4 h-4 ${colors.textTertiary} group-hover:${colors.textPrimary} transition-colors`} />
            )}
          </button>
          {showTypingGame && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <TypingGame />
            </div>
          )}
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <LayoutSelector />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <KeyCapProfileSelector />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <LayoutEditor />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <MaterialSelector />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <SwitchSelector />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <SwitchCurveVisualizer />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <PressDepthIndicator />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <ColorSchemeMarket />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <LightingControl />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <ZoneColorPicker selectedZone={selectedZone} onZoneChange={onZoneChange} />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <KeyCapEditor />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <KeyboardScaleControl />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        <TypingStatsPanel />
      </div>

      <div className={`p-4 border-t ${colors.borderColor} space-y-3`}>
        {onExport && (
          <button
            onClick={onExport}
            disabled={isExporting}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r ${colors.accentGradient} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
          >
            <Download className="w-4 h-4" />
            {isExporting ? '导出中...' : '导出高清图片'}
          </button>
        )}
        
        <button
          onClick={() => setShowTips(!showTips)}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs ${colors.textTertiary} hover:${colors.textSecondary} ${colors.bgSecondary} rounded-lg transition-all`}
        >
          <span className="flex items-center gap-2">
            <Mouse className="w-4 h-4" />
            操作提示
          </span>
          <span className={colors.textTertiary}>{showTips ? '收起' : '展开'}</span>
        </button>
        
        {showTips && (
          <div className="mt-3 space-y-2 animate-in slide-in-from-bottom-2 duration-200">
            <div className={`flex items-start gap-2 px-3 py-2 ${colors.bgSecondary} rounded-lg`}>
              <MousePointer2 className={`w-4 h-4 ${colors.accentPrimary} mt-0.5 flex-shrink-0`} />
              <div className={`text-xs ${colors.textTertiary}`}>
                <div className={`${colors.textSecondary} mb-0.5`}>3D 视图操作</div>
                <div>左键拖动旋转 · 滚轮缩放 · 右键平移</div>
              </div>
            </div>
            <div className={`flex items-start gap-2 px-3 py-2 ${colors.bgSecondary} rounded-lg`}>
              <Keyboard className={`w-4 h-4 ${colors.accentSecondary} mt-0.5 flex-shrink-0`} />
              <div className={`text-xs ${colors.textTertiary}`}>
                <div className={`${colors.textSecondary} mb-0.5`}>按键交互</div>
                <div>点击 3D 按键或使用物理键盘体验按动效果</div>
              </div>
            </div>
            <div className={`flex items-start gap-2 px-3 py-2 ${colors.bgSecondary} rounded-lg`}>
              <Grid3X3 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className={`text-xs ${colors.textTertiary}`}>
                <div className={`${colors.textSecondary} mb-0.5`}>自定义布局</div>
                <div>进入编辑模式后拖动键帽移动位置，拖动右下角方块调整大小。默认开启网格吸附和碰撞检测，可在"吸附与碰撞"中调整。</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
