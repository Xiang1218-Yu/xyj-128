import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { KeyConfig } from '@/types/keyboard';
import {
  useKeyboardStore,
  useIsKeyPressed,
  useSwitchType,
  useSoundEnabled,
  useFontStyle,
  useFontSize,
  useFontColor,
  useSelectedKeyId,
  useKeyCustom,
} from '@/store/useKeyboardStore';
import { useZoneColors } from '@/store/useKeyboardStore';
import { playPressSound, playReleaseSound } from '@/utils/switchSound';
import { FONT_FAMILY_MAP, FONT_CONFIGS } from '@/data/fonts';
import { STICKER_CONFIGS } from '@/data/stickers';

interface KeyCapProps {
  keyConfig: KeyConfig;
  selectedZone?: string | null;
  onKeySelect?: (keyId: string) => void;
}

export function KeyCap({ keyConfig, selectedZone, onKeySelect }: KeyCapProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isPressed = useIsKeyPressed(keyConfig.id);
  const zoneColors = useZoneColors();
  const switchType = useSwitchType();
  const soundEnabled = useSoundEnabled();
  const fontStyle = useFontStyle();
  const globalFontSize = useFontSize();
  const fontColor = useFontColor();
  const selectedKeyId = useSelectedKeyId();
  const keyCustom = useKeyCustom(keyConfig.id);
  const pressKey = useKeyboardStore((state) => state.pressKey);
  const releaseKey = useKeyboardStore((state) => state.releaseKey);
  const setSelectedKeyId = useKeyboardStore((state) => state.setSelectedKeyId);

  const color = zoneColors[keyConfig.zone];
  const isZoneSelected = selectedZone === keyConfig.zone;
  const isKeySelected = selectedKeyId === keyConfig.id;

  const displayLabel = keyCustom?.label ?? keyConfig.label;
  const sticker = keyCustom?.sticker;
  const stickerConfig = sticker ? STICKER_CONFIGS[sticker] : null;

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

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedKeyId(keyConfig.id);
    onKeySelect?.(keyConfig.id);
  };

  const emissiveIntensity = hovered || isZoneSelected || isKeySelected ? 0.35 : isPressed ? 0.6 : 0.12;
  const emissiveColor = isPressed
    ? '#ffffff'
    : isKeySelected
    ? '#f59e0b'
    : hovered
    ? '#6366f1'
    : isZoneSelected
    ? '#8b5cf6'
    : '#000000';

  const baseFontSize = keyConfig.width > 1.5 ? 0.28 : keyConfig.width > 1 ? 0.32 : 0.38;
  const fontSize = baseFontSize * (globalFontSize / 0.38);

  const fontConfig = FONT_CONFIGS[fontStyle];
  const fontFamily = FONT_FAMILY_MAP[fontStyle];

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
          onClick={handleClick}
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

        {stickerConfig && stickerConfig.id !== 'none' && (
          <Text
            position={[keyConfig.width * 0.35, 0.215, -keyConfig.height * 0.3]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={fontSize * 0.7}
            anchorX="center"
            anchorY="middle"
          >
            {stickerConfig.emoji}
          </Text>
        )}

        <Text
          position={[0, 0.21, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={fontSize}
          color={fontColor}
          anchorX="center"
          anchorY="middle"
          fontWeight={fontConfig.fontWeight}
          font={fontFamily}
        >
          {displayLabel}
        </Text>
      </group>
    </group>
  );
}
