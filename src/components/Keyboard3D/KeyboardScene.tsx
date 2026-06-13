import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Lights } from './Lights';
import { KeyboardCase } from './KeyboardCase';
import { KeyCap } from './KeyCap';
import { useLayout, useIsDraggingSticker } from '@/store/useKeyboardStore';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { KeyZone } from '@/types/keyboard';
import * as THREE from 'three';

interface KeyboardContentProps {
  selectedZone: KeyZone | null;
  onKeySelect?: (keyId: string) => void;
}

function KeyboardContent({ selectedZone, onKeySelect }: KeyboardContentProps) {
  const layout = useLayout();
  const layoutConfig = LAYOUT_CONFIGS[layout];
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  const keys = useMemo(() => {
    return layoutConfig.keys.map((keyConfig) => (
      <KeyCap
        key={keyConfig.id}
        keyConfig={keyConfig}
        selectedZone={selectedZone}
        onKeySelect={onKeySelect}
      />
    ));
  }, [layoutConfig.keys, selectedZone, onKeySelect]);

  return (
    <group ref={groupRef}>
      <KeyboardCase />
      <group position={[-layoutConfig.width / 2, 0.35, -layoutConfig.height / 2]}>
        {keys}
      </group>
    </group>
  );
}

interface KeyboardSceneProps {
  selectedZone: KeyZone | null;
  onKeySelect?: (keyId: string) => void;
}

export function KeyboardScene({ selectedZone, onKeySelect }: KeyboardSceneProps) {
  const isDraggingSticker = useIsDraggingSticker();

  return (
    <Canvas
      shadows
      camera={{ position: [0, 20, 26], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 15, 35]} />
      
      <Lights />
      <KeyboardContent selectedZone={selectedZone} onKeySelect={onKeySelect} />
      
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={12}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 8}
        enablePan={true}
        target={[0, 0, 0]}
        enabled={!isDraggingSticker}
      />
      
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={300}
          intensity={0.5}
        />
      </EffectComposer>
    </Canvas>
  );
}
