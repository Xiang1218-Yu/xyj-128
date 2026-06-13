import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { KeyConfig } from '@/types/keyboard';
import { useKeyboardStore, useIsKeyPressed, useSwitchType, useSoundEnabled } from '@/store/useKeyboardStore';
import { useZoneColors } from '@/store/useKeyboardStore';
import { playPressSound, playReleaseSound } from '@/utils/switchSound';

interface KeyCapProps {
  keyConfig: KeyConfig;
  selectedZone?: string | null;
}

export function KeyCap({ keyConfig, selectedZone }: KeyCapProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isPressed = useIsKeyPressed(keyConfig.id);
  const zoneColors = useZoneColors();
  const switchType = useSwitchType();
  const soundEnabled = useSoundEnabled();
  const pressKey = useKeyboardStore((state) => state.pressKey);
  const releaseKey = useKeyboardStore((state) => state.releaseKey);

  const color = zoneColors[keyConfig.zone];
  const isSelected = selectedZone === keyConfig.zone;

  const pressDepth = useMemo(() => (isPressed ? -0.18 : 0), [isPressed]);
  const targetScale = useMemo(() => (isPressed ? 0.985 : 1), [isPressed]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        pressDepth,
        delta * 18
      );
      groupRef.current.scale.y = THREE.MathUtils.lerp(
        groupRef.current.scale.y,
        targetScale,
        delta * 14
      );
      groupRef.current.scale.x = THREE.MathUtils.lerp(
        groupRef.current.scale.x,
        targetScale,
        delta * 14
      );
      groupRef.current.scale.z = THREE.MathUtils.lerp(
        groupRef.current.scale.z,
        targetScale,
        delta * 14
      );
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    pressKey(keyConfig.id);
    if (soundEnabled) {
      playPressSound(switchType);
    }
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    releaseKey(keyConfig.id);
    if (soundEnabled) {
      playReleaseSound(switchType);
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    if (isPressed) {
      releaseKey(keyConfig.id);
    }
  };

  const emissiveIntensity = hovered || isSelected ? 0.35 : isPressed ? 0.6 : 0.12;
  const emissiveColor = isPressed ? '#ffffff' : hovered ? '#6366f1' : isSelected ? '#8b5cf6' : '#000000';

  const fontSize = keyConfig.width > 1.5 ? 0.28 : keyConfig.width > 1 ? 0.32 : 0.38;

  return (
    <group position={[keyConfig.x + keyConfig.width / 2, 0, keyConfig.y + keyConfig.height / 2]}>
      <group ref={groupRef}>
        <RoundedBox
          ref={meshRef}
          args={[keyConfig.width * 0.92, 0.4, keyConfig.height * 0.92]}
          radius={0.08}
          smoothness={4}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerOut={handlePointerOut}
          onPointerOver={() => setHovered(true)}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            roughness={0.28}
            metalness={0.15}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
          />
        </RoundedBox>
        
        <Text
          position={[0, 0.21, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={fontSize}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
          fontWeight={600}
        >
          {keyConfig.label}
        </Text>
      </group>
    </group>
  );
}
