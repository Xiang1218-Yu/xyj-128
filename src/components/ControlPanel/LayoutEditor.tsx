import { Grid3X3, RotateCcw, Save, Trash2, Move, Maximize, Minimize, ChevronDown, ChevronUp, FolderOpen, PenTool } from 'lucide-react';
import { useState } from 'react';
import {
  useKeyboardStore,
  useLayoutEditMode,
  useSelectedKeyId,
  useKeyTransform,
  useSavedCustomLayouts,
} from '@/store/useKeyboardStore';
import { useLayout } from '@/store/useKeyboardStore';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { KeyTransform } from '@/types/keyboard';

export function LayoutEditor() {
  const layoutEditMode = useLayoutEditMode();
  const selectedKeyId = useSelectedKeyId();
  const keyTransform = useKeyTransform(selectedKeyId ?? '');
  const savedCustomLayouts = useSavedCustomLayouts();
  const setLayoutEditMode = useKeyboardStore((state) => state.setLayoutEditMode);
  const setKeyTransform = useKeyboardStore((state) => state.setKeyTransform);
  const resetKeyTransform = useKeyboardStore((state) => state.resetKeyTransform);
  const resetAllKeyTransforms = useKeyboardStore((state) => state.resetAllKeyTransforms);
  const saveCustomLayout = useKeyboardStore((state) => state.saveCustomLayout);
  const loadCustomLayout = useKeyboardStore((state) => state.loadCustomLayout);
  const deleteCustomLayout = useKeyboardStore((state) => state.deleteCustomLayout);

  const layout = useLayout();
  const layoutConfig = LAYOUT_CONFIGS[layout];

  const selectedKeyConfig = selectedKeyId
    ? layoutConfig.keys.find((k) => k.id === selectedKeyId)
    : null;

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [saveError, setSaveError] = useState('');

  const currentX = keyTransform?.x ?? selectedKeyConfig?.x ?? 0;
  const currentY = keyTransform?.y ?? selectedKeyConfig?.y ?? 0;
  const currentWidth = keyTransform?.width ?? selectedKeyConfig?.width ?? 1;
  const currentHeight = keyTransform?.height ?? selectedKeyConfig?.height ?? 1;

  const hasAnyTransforms = Object.values(useKeyboardStore.getState().keyCustoms).some(
    (c) => c.transform && Object.keys(c.transform).length > 0
  );

  const handleNumericChange = (field: keyof KeyTransform, value: string) => {
    if (!selectedKeyId) return;
    const num = parseFloat(value);
    if (isNaN(num)) return;
    let clamped = num;
    if (field === 'x' || field === 'y') {
      clamped = Math.max(-5, Math.min(30, num));
    } else if (field === 'width' || field === 'height') {
      clamped = Math.max(0.5, Math.min(20, num));
    }
    setKeyTransform(selectedKeyId, { [field]: clamped });
  };

  const handleStepChange = (field: keyof KeyTransform, step: number) => {
    if (!selectedKeyId) return;
    const base = field === 'x' || field === 'y'
      ? (selectedKeyConfig?.[field] ?? 0)
      : (selectedKeyConfig?.[field] ?? 1);
    const current = keyTransform?.[field] ?? base;
    const newValue = (current as number) + step;
    let clamped = newValue;
    if (field === 'x' || field === 'y') {
      clamped = Math.max(-5, Math.min(30, newValue));
    } else if (field === 'width' || field === 'height') {
      clamped = Math.max(0.5, Math.min(20, newValue));
    }
    setKeyTransform(selectedKeyId, { [field]: clamped });
  };

  const handleSaveLayout = () => {
    const trimmedName = layoutName.trim();
    if (!trimmedName) {
      setSaveError('请输入布局名称');
      return;
    }
    if (savedCustomLayouts[trimmedName] && !confirm(`布局 "${trimmedName}" 已存在，是否覆盖？`)) {
      return;
    }
    saveCustomLayout(trimmedName);
    setSaveError('');
    setLayoutName('');
    setShowSaveDialog(false);
  };

  const savedLayoutNames = Object.keys(savedCustomLayouts);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-medium text-gray-200">自定义布局</h3>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setLayoutEditMode(!layoutEditMode)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
            layoutEditMode
              ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
              : 'bg-gray-800/60 hover:bg-gray-700/60 border-gray-700/50 text-gray-300'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <PenTool className={`w-4 h-4 ${layoutEditMode ? 'text-emerald-400' : 'text-gray-400'}`} />
            <span className="text-sm font-medium">
              {layoutEditMode ? '退出编辑模式' : '进入编辑模式'}
            </span>
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              layoutEditMode ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'
            }`}
          />
        </button>

        {layoutEditMode && (
          <div className="p-3 bg-emerald-900/10 border border-emerald-500/20 rounded-xl">
            <div className="flex items-start gap-2">
              <Move className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-400 space-y-1">
                <div>
                  <span className="text-emerald-300">移动：</span>
                  拖动键帽调整位置
                </div>
                <div>
                  <span className="text-emerald-300">缩放：</span>
                  拖动选中键右下角方块调整大小
                </div>
                <div className="text-gray-500">提示：编辑模式下 3D 视图无法旋转缩放</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-3.5 h-3.5" />
            保存布局
          </button>
          <button
            onClick={() => setShowLoadDialog(true)}
            disabled={savedLayoutNames.length === 0}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-xl text-cyan-300 text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            载入 ({savedLayoutNames.length})
          </button>
        </div>

        {hasAnyTransforms && (
          <button
            onClick={() => {
              if (confirm('确定重置所有键的位置和大小调整吗？')) {
                resetAllKeyTransforms();
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-gray-500 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-all border border-gray-700/30 hover:border-red-500/30"
          >
            <RotateCcw className="w-3 h-3" />
            重置全部位置大小
          </button>
        )}

        {layoutEditMode && selectedKeyConfig && (
          <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-emerald-600/20 text-emerald-300 text-xs font-medium rounded">
                  {selectedKeyConfig.label}
                </div>
                <span className="text-[10px] text-gray-500">精确调整</span>
              </div>
              <button
                onClick={() => resetKeyTransform(selectedKeyId!)}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-gray-500 hover:text-emerald-300 hover:bg-emerald-900/20 rounded transition-all"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                还原
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Move className="w-2.5 h-2.5" /> X 位置
                  </span>
                  <span className="text-[10px] text-emerald-400">{currentX.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStepChange('x', -0.1)}
                    className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded text-gray-400 hover:text-gray-200 text-xs transition-all"
                  >
                    ←
                  </button>
                  <input
                    type="number"
                    step="0.05"
                    value={currentX.toFixed(2)}
                    onChange={(e) => handleNumericChange('x', e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-900/60 border border-gray-700/50 rounded text-xs text-gray-200 text-center focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    onClick={() => handleStepChange('x', 0.1)}
                    className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded text-gray-400 hover:text-gray-200 text-xs transition-all"
                  >
                    →
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Move className="w-2.5 h-2.5" /> Y 位置
                  </span>
                  <span className="text-[10px] text-emerald-400">{currentY.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStepChange('y', -0.1)}
                    className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded text-gray-400 hover:text-gray-200 text-xs transition-all"
                  >
                    ↑
                  </button>
                  <input
                    type="number"
                    step="0.05"
                    value={currentY.toFixed(2)}
                    onChange={(e) => handleNumericChange('y', e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-900/60 border border-gray-700/50 rounded text-xs text-gray-200 text-center focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    onClick={() => handleStepChange('y', 0.1)}
                    className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded text-gray-400 hover:text-gray-200 text-xs transition-all"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Maximize className="w-2.5 h-2.5" /> 宽度
                  </span>
                  <span className="text-[10px] text-emerald-400">{currentWidth.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStepChange('width', -0.1)}
                    className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded text-gray-400 hover:text-gray-200 text-xs transition-all"
                  >
                    <Minimize className="w-2.5 h-2.5" />
                  </button>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    value={currentWidth.toFixed(2)}
                    onChange={(e) => handleNumericChange('width', e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-900/60 border border-gray-700/50 rounded text-xs text-gray-200 text-center focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    onClick={() => handleStepChange('width', 0.1)}
                    className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded text-gray-400 hover:text-gray-200 text-xs transition-all"
                  >
                    <Maximize className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Maximize className="w-2.5 h-2.5" /> 高度
                  </span>
                  <span className="text-[10px] text-emerald-400">{currentHeight.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStepChange('height', -0.1)}
                    className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded text-gray-400 hover:text-gray-200 text-xs transition-all"
                  >
                    <Minimize className="w-2.5 h-2.5" />
                  </button>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    value={currentHeight.toFixed(2)}
                    onChange={(e) => handleNumericChange('height', e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-900/60 border border-gray-700/50 rounded text-xs text-gray-200 text-center focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    onClick={() => handleStepChange('height', 0.1)}
                    className="p-1.5 bg-gray-800/60 hover:bg-gray-700/60 rounded text-gray-400 hover:text-gray-200 text-xs transition-all"
                  >
                    <Maximize className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {layoutEditMode && !selectedKeyConfig && (
          <div className="p-3 bg-gray-800/30 rounded-xl border border-dashed border-gray-700/50 text-center">
            <div className="text-2xl mb-1">🔧</div>
            <p className="text-xs text-gray-500">点击键帽选择后可精确调整</p>
          </div>
        )}
      </div>

      {showSaveDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSaveDialog(false)}
        >
          <div
            className="w-80 p-5 bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <Save className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-medium text-white">保存自定义布局</h3>
            </div>

            <input
              type="text"
              value={layoutName}
              onChange={(e) => {
                setLayoutName(e.target.value);
                setSaveError('');
              }}
              placeholder="输入布局名称..."
              maxLength={30}
              className="w-full px-3 py-2.5 bg-gray-800/60 border border-gray-700/50 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              autoFocus
            />
            {saveError && <p className="text-xs text-red-400 mt-2">{saveError}</p>}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setLayoutName('');
                  setSaveError('');
                }}
                className="flex-1 px-3 py-2 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-sm text-gray-300 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleSaveLayout}
                className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white font-medium transition-all"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoadDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowLoadDialog(false)}
        >
          <div
            className="w-80 p-5 bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl max-h-96 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-medium text-white">载入自定义布局</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
              {savedLayoutNames.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-xs">暂无保存的布局</div>
              ) : (
                savedLayoutNames.map((name) => {
                  const saved = savedCustomLayouts[name];
                  return (
                    <div
                      key={name}
                      className="flex items-center gap-2 p-2.5 bg-gray-800/40 rounded-lg border border-gray-700/30 hover:border-cyan-500/30 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-200 truncate">{name}</div>
                        <div className="text-[10px] text-gray-500">
                          {saved?.description} · {saved?.keys.length} 键
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          loadCustomLayout(name);
                          setShowLoadDialog(false);
                        }}
                        className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 rounded text-cyan-300 text-xs font-medium transition-all"
                      >
                        载入
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`确定删除布局 "${name}" 吗？`)) {
                            deleteCustomLayout(name);
                          }
                        }}
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setShowLoadDialog(false)}
              className="w-full mt-4 px-3 py-2 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-sm text-gray-300 transition-all"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
