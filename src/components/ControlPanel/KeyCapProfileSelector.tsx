import { Box, RotateCcw } from 'lucide-react';
import {
  useKeyboardStore,
  useKeyCapProfile,
  useKeyCapProfileConfig,
} from '@/store/useKeyboardStore';
import { KEYCAP_PROFILE_LIST, KEYCAP_PROFILE_CONFIGS } from '@/data/keycapProfiles';
import { KeyCapProfile } from '@/types/keyboard';

export function KeyCapProfileSelector() {
  const currentProfile = useKeyCapProfile();
  const currentConfig = useKeyCapProfileConfig();
  const setKeyCapProfile = useKeyboardStore((state) => state.setKeyCapProfile);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-medium text-gray-200">键帽高度</h3>
        </div>
        <div className="text-xs text-gray-500">
          {currentConfig.height.toFixed(2)}mm
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {KEYCAP_PROFILE_LIST.map((profile) => {
          const config = KEYCAP_PROFILE_CONFIGS[profile as KeyCapProfile];
          const isSelected = currentProfile === profile;

          return (
            <button
              key={profile}
              onClick={() => setKeyCapProfile(profile as KeyCapProfile)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-600/20 border border-emerald-500/50'
                  : 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-6 rounded-sm transition-all ${
                    isSelected ? 'bg-emerald-400' : 'bg-gray-500'
                  }`}
                  style={{
                    height: `${config.height * 30}px`,
                    borderRadius: `${config.topRadius * 50}px ${config.topRadius * 50}px ${config.bottomRadius * 30}px ${config.bottomRadius * 30}px`,
                  }}
                />
                <span
                  className={`text-xs font-medium ${
                    isSelected ? 'text-emerald-300' : 'text-gray-300'
                  }`}
                >
                  {config.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-600 mt-2">
        {currentConfig.description}
      </p>
    </div>
  );
}
