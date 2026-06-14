import { Box, Layers, Scissors, Palette, RotateCcw } from 'lucide-react';
import { useCaseMaterial } from '@/store/useKeyboardStore';
import { useKeyboardStore } from '@/store/useKeyboardStore';
import {
  MATERIAL_LIST,
  MATERIAL_CONFIGS,
  TEXTURE_DETAIL_OPTIONS,
  WEAR_LEVEL_OPTIONS,
  ENGRAVING_OPTIONS,
  PRESET_COLORS,
} from '@/data/materials';
import {
  CaseMaterial,
  TextureDetailLevel,
  WearLevel,
  EngravingType,
} from '@/types/keyboard';

export function MaterialSelector() {
  const currentMaterial = useCaseMaterial();
  const textureDetail = useKeyboardStore((state) => state.textureDetail);
  const wearLevel = useKeyboardStore((state) => state.wearLevel);
  const engravingType = useKeyboardStore((state) => state.engravingType);
  const engravingColor = useKeyboardStore((state) => state.engravingColor);

  const setCaseMaterial = useKeyboardStore((state) => state.setCaseMaterial);
  const setTextureDetail = useKeyboardStore((state) => state.setTextureDetail);
  const setWearLevel = useKeyboardStore((state) => state.setWearLevel);
  const setEngravingType = useKeyboardStore((state) => state.setEngravingType);
  const setEngravingColor = useKeyboardStore((state) => state.setEngravingColor);
  const resetMaterialCustoms = useKeyboardStore((state) => state.resetMaterialCustoms);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-medium text-gray-200">外壳材质</h3>
          </div>
          <button
            onClick={resetMaterialCustoms}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-md transition-colors"
            title="重置为材质默认"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {MATERIAL_LIST.map((material) => {
            const config = MATERIAL_CONFIGS[material as CaseMaterial];
            const isSelected = material === currentMaterial;

            return (
              <button
                key={material}
                onClick={() => setCaseMaterial(material as CaseMaterial)}
                className={`relative p-3 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-700/60 hover:border-gray-600/50 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-md border border-gray-600/50 shadow-inner"
                    style={{
                      backgroundColor: config.color,
                      boxShadow: isSelected
                        ? `0 0 12px ${config.color}40`
                        : 'none',
                    }}
                  />
                  <span className="text-sm font-medium">{config.name}</span>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-medium text-gray-200">纹理细节</h3>
          <span className="ml-auto text-xs text-gray-500">
            {TEXTURE_DETAIL_OPTIONS.find((o) => o.id === textureDetail)?.description}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {TEXTURE_DETAIL_OPTIONS.map((option) => {
            const isSelected = option.id === textureDetail;
            return (
              <button
                key={option.id}
                onClick={() => setTextureDetail(option.id as TextureDetailLevel)}
                className={`py-2 px-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                    : 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60 hover:border-gray-600/50 text-gray-400'
                }`}
              >
                {option.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Scissors className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-medium text-gray-200">磨损程度</h3>
          <span className="ml-auto text-xs text-gray-500">
            {WEAR_LEVEL_OPTIONS.find((o) => o.id === wearLevel)?.description}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {WEAR_LEVEL_OPTIONS.map((option) => {
            const isSelected = option.id === wearLevel;
            return (
              <button
                key={option.id}
                onClick={() => setWearLevel(option.id as WearLevel)}
                className={`py-2 px-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                    : 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60 hover:border-gray-600/50 text-gray-400'
                }`}
              >
                {option.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-pink-400" />
          <h3 className="text-sm font-medium text-gray-200">表面雕刻</h3>
        </div>

        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {ENGRAVING_OPTIONS.map((option) => {
            const isSelected = option.id === engravingType;
            return (
              <button
                key={option.id}
                onClick={() => setEngravingType(option.id as EngravingType)}
                className={`py-2.5 px-1 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all duration-200 ${
                  isSelected
                    ? 'bg-pink-500/20 border border-pink-500/50 text-pink-300'
                    : 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60 hover:border-gray-600/50 text-gray-400'
                }`}
              >
                <span className="text-base leading-none">{option.emoji}</span>
                <span className="leading-tight">{option.name}</span>
              </button>
            );
          })}
        </div>

        {engravingType !== 'none' && (
          <div className="mt-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">雕刻颜色</span>
              <div
                className="w-5 h-5 rounded-md border border-gray-600/50 shadow-inner"
                style={{
                  backgroundColor: engravingColor,
                  boxShadow: `0 0 8px ${engravingColor}60`,
                }}
              />
            </div>
            <div className="grid grid-cols-10 gap-1">
              {PRESET_COLORS.map((color) => {
                const isSelected = color.toLowerCase() === engravingColor.toLowerCase();
                return (
                  <button
                    key={color}
                    onClick={() => setEngravingColor(color)}
                    className={`aspect-square rounded-md border transition-all duration-150 hover:scale-110 ${
                      isSelected
                        ? 'border-pink-400 ring-2 ring-pink-500/50 ring-offset-1 ring-offset-gray-900'
                        : 'border-gray-600/50 hover:border-gray-500'
                    }`}
                    style={{
                      backgroundColor: color,
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
