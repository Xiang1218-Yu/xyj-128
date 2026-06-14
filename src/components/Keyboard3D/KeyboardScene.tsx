import { useRef, useMemo, MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Lights } from './Lights';
import { KeyboardCase } from './KeyboardCase';
import { KeyCap } from './KeyCap';
import { useLayout, useIsDraggingSticker, useLayoutEditMode, useIsDraggingKey, useIsResizingKey, useUITheme } from '@/store/useKeyboardStore';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { getUITheme } from '@/data/themes';
import { KeyZone } from '@/types/keyboard';
import * as THREE from 'three';

function SceneRefCapture({
  glRef,
  sceneRef,
  cameraRef,
}: {
  glRef: MutableRefObject<THREE.WebGLRenderer | null>;
  sceneRef: MutableRefObject<THREE.Scene | null>;
  cameraRef: MutableRefObject<THREE.Camera | null>;
}) {
  const { gl, scene, camera } = useThree();
  glRef.current = gl;
  sceneRef.current = scene;
  cameraRef.current = camera;
  return null;
}

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

export interface KeyboardSceneRefs {
  glRef: MutableRefObject<THREE.WebGLRenderer | null>;
  sceneRef: MutableRefObject<THREE.Scene | null>;
  cameraRef: MutableRefObject<THREE.Camera | null>;
}

interface KeyboardSceneProps {
  selectedZone: KeyZone | null;
  onKeySelect?: (keyId: string) => void;
  sceneRefs?: KeyboardSceneRefs;
}

export function KeyboardScene({ selectedZone, onKeySelect, sceneRefs }: KeyboardSceneProps) {
  const isDraggingSticker = useIsDraggingSticker();
  const layoutEditMode = useLayoutEditMode();
  const isDraggingKey = useIsDraggingKey();
  const isResizingKey = useIsResizingKey();
  const themeId = useUITheme();
  const theme = useMemo(() => getUITheme(themeId), [themeId]);

  const orbitDisabled = isDraggingSticker || layoutEditMode || isDraggingKey || isResizingKey;

  const defaultGlRef = useRef<THREE.WebGLRenderer | null>(null);
  const defaultSceneRef = useRef<THREE.Scene | null>(null);
  const defaultCameraRef = useRef<THREE.Camera | null>(null);

  const glRef = sceneRefs?.glRef ?? defaultGlRef;
  const sceneRefToUse = sceneRefs?.sceneRef ?? defaultSceneRef;
  const cameraRef = sceneRefs?.cameraRef ?? defaultCameraRef;

  const { sceneAmbience } = theme;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 20, 26], fov: 45 }}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      dpr={[1, 2]}
    >
      <SceneRefCapture glRef={glRef} sceneRef={sceneRefToUse} cameraRef={cameraRef} />
      <color attach="background" args={[sceneAmbience.backgroundColor]} />
      <fog attach="fog" args={[sceneAmbience.fogColor, sceneAmbience.fogNear, sceneAmbience.fogFar]} />
      
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
        enabled={!orbitDisabled}
      />
      
      <EffectComposer>
        <Bloom
          luminanceThreshold={sceneAmbience.bloomThreshold}
          luminanceSmoothing={0.9}
          height={300}
          intensity={sceneAmbience.bloomIntensity}
        />
      </EffectComposer>
    </Canvas>
  );
}
