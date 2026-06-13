import { Volume2, VolumeX } from 'lucide-react';
import { useSwitchType, useSoundEnabled, useKeyboardStore } from '@/store/useKeyboardStore';
import { SWITCH_LIST, SWITCH_CONFIGS, SWITCH_CATEGORY_LABELS } from '@/data/switches';
import { SwitchType } from '@/types/keyboard';
import { playPressSound } from '@/utils/switchSound';

export function SwitchSelector() {
  const currentSwitch = useSwitchType();
  const soundEnabled = useSoundEnabled();
  const setSwitchType = useKeyboardStore((state) => state.setSwitchType);
  const setSoundEnabled = useKeyboardStore((state) => state.setSoundEnabled);

  const handleSwitchSelect = (switchType: SwitchType) => {
    setSwitchType(switchType);
    if (soundEnabled) {
      playPressSound(switchType);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M6 12h4" />
            <circle cx="16" cy="12" r="2" />
          </svg>
          <h3 className="text-sm font-medium text-gray-200">轴体音效</h3>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all duration-200 ${
            soundEnabled
              ? 'bg-amber-600/20 text-amber-300 hover:bg-amber-600/30'
              : 'bg-gray-800/60 text-gray-500 hover:bg-gray-700/60'
          }`}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
          {soundEnabled ? '已开启' : '已静音'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SWITCH_LIST.map((switchType) => {
          const config = SWITCH_CONFIGS[switchType];
          const isSelected = switchType === currentSwitch;

          return (
            <button
              key={switchType}
              onClick={() => handleSwitchSelect(switchType)}
              className={`relative p-3 rounded-xl border transition-all duration-200 text-left ${
                isSelected
                  ? 'bg-amber-600/20 border-amber-500/50 text-amber-300'
                  : 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-700/60 hover:border-gray-600/50 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-5 h-5 rounded-full border border-gray-600/50 flex-shrink-0"
                  style={{
                    backgroundColor: config.color,
                    boxShadow: isSelected ? `0 0 10px ${config.color}60` : 'none',
                  }}
                />
                <span className="text-sm font-medium">{config.name}</span>
              </div>
              <div className="flex items-center gap-1.5 ml-7">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    config.category === 'linear'
                      ? 'bg-slate-700/60 text-slate-300'
                      : config.category === 'tactile'
                      ? 'bg-amber-900/40 text-amber-300'
                      : 'bg-blue-900/40 text-blue-300'
                  }`}
                >
                  {SWITCH_CATEGORY_LABELS[config.category]}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1 ml-7 leading-tight">
                {config.description}
              </p>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
