import { useRef, useEffect, useState, useMemo } from 'react';
import { Play, Pause, RotateCcw, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  useSwitchType,
  useSwitchPhysics,
  useCustomSwitchPhysics,
  useUseCustomSwitchPhysics,
  useCurveAnimationProgress,
  useIsCurveAnimating,
  useKeyboardStore,
} from '@/store/useKeyboardStore';
import { SWITCH_CONFIGS } from '@/data/switches';
import {
  generatePressCurve,
  generateReleaseCurve,
  getMaxForce,
  getForceAtTravel,
  formatValue,
  calculatePressDepth,
  calculateAnimationSpeed,
} from '@/utils/switchCurve';
import { SwitchPhysicsParams } from '@/types/keyboard';

interface ParamSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  color: string;
}

function ParamSlider({ label, value, min, max, step, unit, onChange, color }: ParamSliderProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300 font-mono">{formatValue(value, unit)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: color,
        }}
      />
      <div className="flex justify-between text-[10px] text-gray-600">
        <span>{formatValue(min, unit, 0)}</span>
        <span>{formatValue(max, unit, 0)}</span>
      </div>
    </div>
  );
}

export function SwitchCurveVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const switchType = useSwitchType();
  const physics = useSwitchPhysics();
  const customPhysics = useCustomSwitchPhysics();
  const useCustom = useUseCustomSwitchPhysics();
  const progress = useCurveAnimationProgress();
  const isAnimating = useIsCurveAnimating();

  const setCustomSwitchPhysics = useKeyboardStore((state) => state.setCustomSwitchPhysics);
  const setUseCustomSwitchPhysics = useKeyboardStore((state) => state.setUseCustomSwitchPhysics);
  const resetCustomSwitchPhysics = useKeyboardStore((state) => state.resetCustomSwitchPhysics);
  const setCurveAnimationProgress = useKeyboardStore((state) => state.setCurveAnimationProgress);
  const setIsCurveAnimating = useKeyboardStore((state) => state.setIsCurveAnimating);

  const switchConfig = SWITCH_CONFIGS[switchType];
  const basePhysics = switchConfig.physics;

  const pressCurve = useMemo(() => generatePressCurve(physics), [physics]);
  const releaseCurve = useMemo(() => generateReleaseCurve(physics), [physics]);
  const maxForce = useMemo(() => getMaxForce(physics), [physics]);

  const svgWidth = 280;
  const svgHeight = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const scaleX = (travel: number) => padding.left + (travel / physics.totalTravel) * chartWidth;
  const scaleY = (force: number) => padding.top + chartHeight - (force / maxForce) * chartHeight;

  const createPath = (points: { travel: number; force: number }[]) => {
    if (points.length === 0) return '';
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.travel)} ${scaleY(p.force)}`)
      .join(' ');
  };

  const pressPath = createPath(pressCurve);
  const releasePath = createPath(releaseCurve);

  const currentTravel = progress * physics.totalTravel;
  const isPressingPhase = progress <= 0.5;
  const currentProgress = isPressingPhase ? progress * 2 : (1 - progress) * 2;
  const currentForce = getForceAtTravel(
    physics,
    isPressingPhase ? currentTravel : physics.totalTravel - (currentTravel - physics.totalTravel / 2),
    isPressingPhase
  );
  const indicatorX = scaleX(isPressingPhase ? currentTravel : physics.totalTravel - (currentTravel - physics.totalTravel / 2));
  const indicatorY = scaleY(currentForce);

  const gridLines = useMemo(() => {
    const lines = [];
    const forceSteps = 4;
    const travelSteps = 4;

    for (let i = 0; i <= forceSteps; i++) {
      const force = (i / forceSteps) * maxForce;
      lines.push({
        type: 'horizontal',
        y: scaleY(force),
        label: `${Math.round(force)} cN`,
      });
    }

    for (let i = 0; i <= travelSteps; i++) {
      const travel = (i / travelSteps) * physics.totalTravel;
      lines.push({
        type: 'vertical',
        x: scaleX(travel),
        label: `${travel.toFixed(1)} mm`,
      });
    }

    return lines;
  }, [maxForce, physics.totalTravel, scaleX, scaleY]);

  useEffect(() => {
    if (isAnimating) {
      let startTime: number | null = null;
      const duration = 2000;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const newProgress = Math.min(elapsed / duration, 1);

        setCurveAnimationProgress(newProgress);

        if (newProgress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsCurveAnimating(false);
          setCurveAnimationProgress(0);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, setCurveAnimationProgress, setIsCurveAnimating]);

  const toggleAnimation = () => {
    if (isAnimating) {
      setIsCurveAnimating(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      setCurveAnimationProgress(0);
      setIsCurveAnimating(true);
    }
  };

  const resetAnimation = () => {
    setIsCurveAnimating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setCurveAnimationProgress(0);
  };

  const handleParamChange = (key: keyof SwitchPhysicsParams, value: number) => {
    if (!useCustom) {
      setUseCustomSwitchPhysics(true);
    }
    setCustomSwitchPhysics({ [key]: value });
  };

  const animationSpeeds = calculateAnimationSpeed(physics);
  const pressDepth = calculatePressDepth(physics, true);

  const hasCustomParams = Object.keys(customPhysics).length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-medium text-gray-200">压力-行程曲线</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleAnimation}
            className={`p-1.5 rounded-lg transition-all ${
              isAnimating
                ? 'bg-amber-600/30 text-amber-400'
                : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300'
            }`}
            title={isAnimating ? '暂停动画' : '播放动画'}
          >
            {isAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={resetAnimation}
            className="p-1.5 rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300 transition-all"
            title="重置动画"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative bg-gray-800/40 rounded-xl p-3 border border-gray-700/50">
        <svg
          ref={svgRef}
          width="100%"
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="pressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={switchConfig.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={switchConfig.color} stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="releaseGradient" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {gridLines.map((line, i) =>
            line.type === 'horizontal' ? (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={line.y}
                  x2={svgWidth - padding.right}
                  y2={line.y}
                  stroke="#374151"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding.left - 5}
                  y={line.y + 3}
                  textAnchor="end"
                  className="fill-gray-500"
                  style={{ fontSize: '9px' }}
                >
                  {line.label}
                </text>
              </g>
            ) : (
              <g key={i}>
                <line
                  x1={line.x}
                  y1={padding.top}
                  x2={line.x}
                  y2={svgHeight - padding.bottom}
                  stroke="#374151"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x={line.x}
                  y={svgHeight - padding.bottom + 15}
                  textAnchor="middle"
                  className="fill-gray-500"
                  style={{ fontSize: '9px' }}
                >
                  {line.label}
                </text>
              </g>
            )
          )}

          <line
            x1={padding.left}
            y1={svgHeight - padding.bottom}
            x2={svgWidth - padding.right}
            y2={svgHeight - padding.bottom}
            stroke="#4b5563"
            strokeWidth="2"
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={svgHeight - padding.bottom}
            stroke="#4b5563"
            strokeWidth="2"
          />

          <line
            x1={scaleX(physics.actuationTravel)}
            y1={padding.top}
            x2={scaleX(physics.actuationTravel)}
            y2={svgHeight - padding.bottom}
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="6,3"
            opacity="0.6"
          />
          <text
            x={scaleX(physics.actuationTravel)}
            y={padding.top - 5}
            textAnchor="middle"
            className="fill-amber-400"
            style={{ fontSize: '9px', fontWeight: '500' }}
          >
            触发点
          </text>

          {physics.tactileForce > 0 && (
            <>
              <line
                x1={scaleX(physics.tactileTravel)}
                y1={padding.top}
                x2={scaleX(physics.tactileTravel)}
                y2={svgHeight - padding.bottom}
                stroke="#ec4899"
                strokeWidth="1.5"
                strokeDasharray="6,3"
                opacity="0.6"
              />
              <text
                x={scaleX(physics.tactileTravel)}
                y={padding.top - 5}
                textAnchor="middle"
                className="fill-pink-400"
                style={{ fontSize: '9px', fontWeight: '500' }}
              >
                段落点
              </text>
            </>
          )}

          <path
            d={`${pressPath} L ${scaleX(physics.totalTravel)} ${scaleY(0)} L ${padding.left} ${scaleY(0)} Z`}
            fill="url(#pressGradient)"
            opacity="0.5"
          />
          <path
            d={`${releasePath} L ${padding.left} ${scaleY(0)} L ${scaleX(physics.totalTravel)} ${scaleY(0)} Z`}
            fill="url(#releaseGradient)"
            opacity="0.3"
          />

          <path
            d={pressPath}
            fill="none"
            stroke={switchConfig.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={releasePath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8,4"
            opacity="0.8"
          />

          {progress > 0 && (
            <>
              <circle
                cx={indicatorX}
                cy={indicatorY}
                r="7"
                fill="#ffffff"
                stroke={isPressingPhase ? switchConfig.color : '#22c55e'}
                strokeWidth="3"
                className="drop-shadow-lg"
              />
              <circle
                cx={indicatorX}
                cy={indicatorY}
                r="4"
                fill={isPressingPhase ? switchConfig.color : '#22c55e'}
              />
              <line
                x1={indicatorX}
                y1={indicatorY}
                x2={indicatorX}
                y2={svgHeight - padding.bottom}
                stroke={isPressingPhase ? switchConfig.color : '#22c55e'}
                strokeWidth="1.5"
                strokeDasharray="4,2"
                opacity="0.6"
              />
            </>
          )}

          <text
            x={svgWidth / 2}
            y={svgHeight - 5}
            textAnchor="middle"
            className="fill-gray-500"
            style={{ fontSize: '10px' }}
          >
            行程 (mm)
          </text>
          <text
            x={10}
            y={svgHeight / 2}
            textAnchor="middle"
            className="fill-gray-500"
            style={{ fontSize: '10px' }}
            transform={`rotate(-90, 10, ${svgHeight / 2})`}
          >
            压力 (cN)
          </text>
        </svg>

        <div className="flex items-center justify-center gap-4 mt-2 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-0.5 rounded-full"
              style={{ backgroundColor: switchConfig.color }}
            />
            <span className="text-gray-400">按下</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-0.5 rounded-full border-dashed border-2 border-green-500/80"
            />
            <span className="text-gray-400">回弹</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-800/40 rounded-lg p-2 border border-gray-700/50">
          <div className="text-gray-500 mb-1">触发行程</div>
          <div className="text-amber-400 font-mono font-medium">
            {formatValue(physics.actuationTravel, 'mm')}
          </div>
        </div>
        <div className="bg-gray-800/40 rounded-lg p-2 border border-gray-700/50">
          <div className="text-gray-500 mb-1">触发压力</div>
          <div className="text-amber-400 font-mono font-medium">
            {formatValue(physics.actuationForce, 'cN')}
          </div>
        </div>
        <div className="bg-gray-800/40 rounded-lg p-2 border border-gray-700/50">
          <div className="text-gray-500 mb-1">总行程</div>
          <div className="text-indigo-400 font-mono font-medium">
            {formatValue(physics.totalTravel, 'mm')}
          </div>
        </div>
        <div className="bg-gray-800/40 rounded-lg p-2 border border-gray-700/50">
          <div className="text-gray-500 mb-1">底部压力</div>
          <div className="text-indigo-400 font-mono font-medium">
            {formatValue(physics.bottomOutForce, 'cN')}
          </div>
        </div>
        {physics.tactileForce > 0 && (
          <>
            <div className="bg-gray-800/40 rounded-lg p-2 border border-gray-700/50">
              <div className="text-gray-500 mb-1">段落行程</div>
              <div className="text-pink-400 font-mono font-medium">
                {formatValue(physics.tactileTravel, 'mm')}
              </div>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-2 border border-gray-700/50">
              <div className="text-gray-500 mb-1">段落压力</div>
              <div className="text-pink-400 font-mono font-medium">
                {formatValue(physics.tactileForce, 'cN')}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/30 text-[10px] text-gray-500">
        <div className="flex items-center justify-between">
          <span>按下深度: <span className="text-cyan-400 font-mono">{pressDepth.toFixed(3)}</span></span>
          <span>动画速度: <span className="text-cyan-400 font-mono">{animationSpeeds.pressSpeed.toFixed(1)}</span></span>
        </div>
      </div>

      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-3 py-2 bg-gray-800/40 hover:bg-gray-700/40 rounded-lg border border-gray-700/50 text-xs text-gray-300 transition-all"
        >
          <span className="flex items-center gap-2">
            <Settings2 className="w-3.5 h-3.5 text-amber-400" />
            自定义参数调节
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustom}
                  onChange={(e) => setUseCustomSwitchPhysics(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500/20"
                />
                启用自定义参数
              </label>
              {hasCustomParams && (
                <button
                  onClick={resetCustomSwitchPhysics}
                  className="text-[10px] text-gray-500 hover:text-red-400 transition-colors"
                >
                  重置为默认
                </button>
              )}
            </div>

            <div className="space-y-4">
              <ParamSlider
                label="总行程"
                value={physics.totalTravel}
                min={2.0}
                max={5.0}
                step={0.1}
                unit="mm"
                onChange={(v) => handleParamChange('totalTravel', v)}
                color={switchConfig.color}
              />
              <ParamSlider
                label="触发行程"
                value={physics.actuationTravel}
                min={0.5}
                max={Math.min(physics.totalTravel - 0.5, 3.0)}
                step={0.1}
                unit="mm"
                onChange={(v) => handleParamChange('actuationTravel', v)}
                color="#f59e0b"
              />
              <ParamSlider
                label="触发压力"
                value={physics.actuationForce}
                min={30}
                max={100}
                step={5}
                unit="cN"
                onChange={(v) => handleParamChange('actuationForce', v)}
                color="#f59e0b"
              />
              <ParamSlider
                label="底部压力"
                value={physics.bottomOutForce}
                min={physics.actuationForce}
                max={120}
                step={5}
                unit="cN"
                onChange={(v) => handleParamChange('bottomOutForce', v)}
                color="#8b5cf6"
              />
              {switchConfig.category !== 'linear' && (
                <>
                  <ParamSlider
                    label="段落行程"
                    value={physics.tactileTravel}
                    min={0.5}
                    max={Math.min(physics.actuationTravel, 2.5)}
                    step={0.1}
                    unit="mm"
                    onChange={(v) => handleParamChange('tactileTravel', v)}
                    color="#ec4899"
                  />
                  <ParamSlider
                    label="段落压力"
                    value={physics.tactileForce}
                    min={physics.actuationForce}
                    max={physics.bottomOutForce}
                    step={5}
                    unit="cN"
                    onChange={(v) => handleParamChange('tactileForce', v)}
                    color="#ec4899"
                  />
                </>
              )}
              <ParamSlider
                label="回弹速度"
                value={physics.returnSpeed}
                min={10}
                max={30}
                step={1}
                unit="x"
                onChange={(v) => handleParamChange('returnSpeed', v)}
                color="#22c55e"
              />
              <ParamSlider
                label="阻尼系数"
                value={physics.damping}
                min={8}
                max={20}
                step={1}
                unit="x"
                onChange={(v) => handleParamChange('damping', v)}
                color="#06b6d4"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
