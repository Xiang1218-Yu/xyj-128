import { useState, useEffect } from 'react';
import { Gauge, Activity } from 'lucide-react';
import { usePressedKeys, useSwitchPhysics, useSelectedKeyId, useLayout } from '@/store/useKeyboardStore';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { calculatePressDepth } from '@/utils/switchCurve';

export function PressDepthIndicator() {
  const pressedKeys = usePressedKeys();
  const switchPhysics = useSwitchPhysics();
  const selectedKeyId = useSelectedKeyId();
  const layout = useLayout();
  const layoutConfig = LAYOUT_CONFIGS[layout];
  const [animatedDepth, setAnimatedDepth] = useState(0);

  const displayKeyId = selectedKeyId && pressedKeys.has(selectedKeyId)
    ? selectedKeyId
    : pressedKeys.size > 0
    ? Array.from(pressedKeys)[0]
    : null;

  const displayKeyConfig = displayKeyId
    ? layoutConfig.keys.find((k) => k.id === displayKeyId)
    : null;

  const isPressed = displayKeyId !== null;
  const targetDepth = isPressed ? calculatePressDepth(switchPhysics, true) : 0;

  useEffect(() => {
    let animationId: number;
    let currentDepth = animatedDepth;

    const animate = () => {
      const diff = targetDepth - currentDepth;
      if (Math.abs(diff) > 0.001) {
        currentDepth += diff * 0.15;
        setAnimatedDepth(currentDepth);
        animationId = requestAnimationFrame(animate);
      } else {
        setAnimatedDepth(targetDepth);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [targetDepth]);

  const depthPercent = Math.abs(animatedDepth) / switchPhysics.totalTravel;
  const isActuated = Math.abs(animatedDepth) >= switchPhysics.actuationTravel;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-medium text-gray-200">键程显示</h3>
        </div>
        {displayKeyConfig && (
          <span className="text-xs px-2 py-0.5 bg-cyan-600/20 text-cyan-300 rounded">
            {displayKeyConfig.label}
          </span>
        )}
      </div>

      <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/50">
        <div className="flex items-center gap-4">
          <div className="relative w-8 h-24 bg-gray-900/60 rounded-lg overflow-hidden border border-gray-700/50">
            <div
              className={`absolute bottom-0 left-0 right-0 transition-colors duration-100 ${
                isActuated
                  ? 'bg-gradient-to-t from-emerald-500 to-cyan-400'
                  : 'bg-gradient-to-t from-gray-600 to-gray-500'
              }`}
              style={{ height: `${depthPercent * 100}%` }}
            />
            <div
              className="absolute left-0 right-0 h-px bg-amber-400/60"
              style={{ bottom: `${(switchPhysics.actuationTravel / switchPhysics.totalTravel) * 100}%` }}
            />
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">按压深度</span>
                <span className={`font-mono ${isActuated ? 'text-emerald-400' : 'text-gray-300'}`}>
                  {Math.abs(animatedDepth).toFixed(3)}mm
                </span>
              </div>
              <div className="h-2 bg-gray-900/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-colors duration-100 ${
                    isActuated
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                      : 'bg-gradient-to-r from-gray-600 to-gray-500'
                  }`}
                  style={{ width: `${depthPercent * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">触发行程</span>
                <span className="text-amber-400">{switchPhysics.actuationTravel.toFixed(2)}mm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">总行程</span>
                <span className="text-gray-300">{switchPhysics.totalTravel.toFixed(2)}mm</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-100 ${
                  isActuated
                    ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50'
                    : 'bg-gray-600'
                }`}
              />
              <span className="text-[10px] text-gray-500">
                {isActuated ? '已触发' : '未触发'}
              </span>
            </div>
          </div>
        </div>

        {pressedKeys.size > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-700/50">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <span>同时按下:</span>
              <span className="text-cyan-400 font-medium">{pressedKeys.size} 键</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
