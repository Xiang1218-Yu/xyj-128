import { useState, useRef } from 'react';
import { KeyboardScene, KeyboardSceneRefs } from '@/components/Keyboard3D/KeyboardScene';
import { ControlPanel } from '@/components/ControlPanel/ControlPanel';
import { useKeyboardPress } from '@/hooks/useKeyboardPress';
import { KeyZone } from '@/types/keyboard';
import { exportSceneAsImage } from '@/utils/exportImage';
import * as THREE from 'three';

export default function Home() {
  const [selectedZone, setSelectedZone] = useState<KeyZone | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);

  const sceneRefs: KeyboardSceneRefs = { glRef, sceneRef, cameraRef };

  useKeyboardPress();

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await exportSceneAsImage(glRef, sceneRef, cameraRef);
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#0a0a0f]">
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20 pointer-events-none z-10" />
          <div className="absolute inset-0 opacity-30 pointer-events-none z-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />
          </div>
          <KeyboardScene selectedZone={selectedZone} sceneRefs={sceneRefs} />
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="px-6 py-3 bg-gray-900/60 backdrop-blur-xl rounded-full border border-gray-700/30">
            <p className="text-sm text-gray-300 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              按任意键体验3D键盘交互
            </p>
          </div>
        </div>

        <div className="absolute top-6 left-6 z-20">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/40 backdrop-blur-md rounded-xl border border-gray-700/30">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">⌨</span>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Keyboard Studio</div>
              <div className="text-gray-400 text-xs">3D 键盘定制器</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2.5 bg-indigo-600/80 hover:bg-indigo-500 disabled:bg-indigo-800/50 disabled:cursor-not-allowed backdrop-blur-md rounded-xl border border-indigo-400/30 text-white text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {isExporting ? '导出中...' : '导出高清图片'}
        </button>
      </div>
      
      <div className="w-96 flex-shrink-0">
        <ControlPanel
          selectedZone={selectedZone}
          onZoneChange={setSelectedZone}
          onExport={handleExport}
          isExporting={isExporting}
        />
      </div>
    </div>
  );
}
