import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { KeyConfig, StickerInstance } from '@/types/keyboard';
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
  useSelectedStickerId,
} from '@/store/useKeyboardStore';
import { useZoneColors } from '@/store/useKeyboardStore';
import { playPressSound, playReleaseSound } from '@/utils/switchSound';
import { FONT_CONFIGS } from '@/data/fonts';
import { STICKER_CONFIGS } from '@/data/stickers';

const LONG_PRESS_THRESHOLD = 200;

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
  const selectedStickerId = useSelectedStickerId();
  const keyCustom = useKeyCustom(keyConfig.id);
  const pressKey = useKeyboardStore((state) => state.pressKey);
  const releaseKey = useKeyboardStore((state) => state.releaseKey);
  const setSelectedKeyId = useKeyboardStore((state) => state.setSelectedKeyId);
  const setSelectedStickerId = useKeyboardStore((state) => state.setSelectedStickerId);
  const setKeyStickerPosition = useKeyboardStore((state) => state.setKeyStickerPosition);
  const setIsDraggingSticker = useKeyboardStore((state) => state.setIsDraggingSticker);

  const pointerDownTimeRef = useRef<number>(0);
  const longPressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef<boolean>(false);
  const activeStickerDragRef = useRef<{
    id: string;
    plane: THREE.Plane;
    offset: THREE.Vector2;
    keyCenter: THREE.Vector2;
    keySize: THREE.Vector2;
  } | null>(null);
  const stickerGroupRefs = useRef<Record<string, THREE.Group | null>>({});

  const { camera, gl, raycaster, pointer } = useThree();

  const color = zoneColors[keyConfig.zone];
  const isZoneSelected = selectedZone === keyConfig.zone;
  const isKeySelected = selectedKeyId === keyConfig.id;

  const displayLabel = keyCustom?.label ?? keyConfig.label;
  const stickers: StickerInstance[] = keyCustom?.stickers ?? [];

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

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const triggerPress = () => {
    pressKey(keyConfig.id);
    if (soundEnabled) {
      playPressSound(switchType);
    }
  };

  const triggerRelease = () => {
    releaseKey(keyConfig.id);
    if (soundEnabled) {
      playReleaseSound(switchType);
    }
  };

  const handlePointerDownKey = (e: any) => {
    e.stopPropagation();
    pointerDownTimeRef.current = performance.now();
    longPressTriggeredRef.current = false;

    longPressTimerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      triggerPress();
    }, LONG_PRESS_THRESHOLD);
  };

  const handlePointerUpKey = (e: any) => {
    e.stopPropagation();

    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (longPressTriggeredRef.current) {
      triggerRelease();
      longPressTriggeredRef.current = false;
    } else {
      setSelectedKeyId(keyConfig.id);
      onKeySelect?.(keyConfig.id);
    }
  };

  const handlePointerOutKey = () => {
    setHovered(false);
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (longPressTriggeredRef.current) {
      triggerRelease();
      longPressTriggeredRef.current = false;
    }
  };

  const handleStickerPointerDown = (
    e: any,
    sticker: StickerInstance
  ) => {
    e.stopPropagation();

    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressTriggeredRef.current = false;

    setSelectedKeyId(keyConfig.id);
    setSelectedStickerId(sticker.id);

    const stickerGroup = stickerGroupRefs.current[sticker.id];
    if (!stickerGroup) return;

    const stickerWorldPos = new THREE.Vector3();
    stickerGroup.getWorldPosition(stickerWorldPos);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -stickerWorldPos.y);

    const hitPoint = new THREE.Vector3();
    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(plane, hitPoint);

    const dragOffset = new THREE.Vector2(
      hitPoint.x - stickerWorldPos.x,
      hitPoint.z - stickerWorldPos.z
    );

    const keyCapRoot = groupRef.current?.parent;
    if (!keyCapRoot) return;

    const keyCapWorldPos = new THREE.Vector3();
    keyCapRoot.getWorldPosition(keyCapWorldPos);

    const keyWidth = keyConfig.width * 0.92;
    const keyHeight = keyConfig.height * 0.92;

    activeStickerDragRef.current = {
      id: sticker.id,
      plane,
      offset: dragOffset,
      keyCenter: new THREE.Vector2(keyCapWorldPos.x, keyCapWorldPos.z),
      keySize: new THREE.Vector2(keyWidth, keyHeight),
    };

    setIsDraggingSticker(true);
    gl.domElement.style.cursor = 'grabbing';

    const onPointerMove = () => {
      const drag = activeStickerDragRef.current;
      if (!drag) return;

      raycaster.setFromCamera(pointer, camera);
      const hit = new THREE.Vector3();
      if (!raycaster.ray.intersectPlane(drag.plane, hit)) return;

      const stickerWorldX = hit.x - drag.offset.x;
      const stickerWorldZ = hit.z - drag.offset.y;

      let localX = (stickerWorldX - drag.keyCenter.x) / drag.keySize.x;
      let localY = (stickerWorldZ - drag.keyCenter.y) / drag.keySize.y;

      const maxPos = 0.45;
      localX = Math.max(-maxPos, Math.min(maxPos, localX));
      localY = Math.max(-maxPos, Math.min(maxPos, localY));

      setKeyStickerPosition(keyConfig.id, drag.id, localX, localY);
    };

    const onPointerUp = () => {
      activeStickerDragRef.current = null;
      setIsDraggingSticker(false);
      gl.domElement.style.cursor = '';
      gl.domElement.removeEventListener('pointermove', onPointerMove);
      gl.domElement.removeEventListener('pointerup', onPointerUp);
      gl.domElement.removeEventListener('pointercancel', onPointerUp);
    };

    gl.domElement.addEventListener('pointermove', onPointerMove);
    gl.domElement.addEventListener('pointerup', onPointerUp);
    gl.domElement.addEventListener('pointercancel', onPointerUp);
  };

  const handleStickerClick = (e: any, sticker: StickerInstance) => {
    e.stopPropagation();
    setSelectedKeyId(keyConfig.id);
    setSelectedStickerId(sticker.id);
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

  return (
    <group position={[keyConfig.x + keyConfig.width / 2, 0, keyConfig.y + keyConfig.height / 2]}>
      <group ref={groupRef}>
        <RoundedBox
          ref={meshRef}
          args={[keyConfig.width * 0.92, 0.4, keyConfig.height * 0.92]}
          radius={0.08}
          smoothness={4}
          onPointerDown={handlePointerDownKey}
          onPointerUp={handlePointerUpKey}
          onPointerOut={handlePointerOutKey}
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

        {stickers.map((sticker) => {
          const config = STICKER_CONFIGS[sticker.type];
          const isStickerSelected = selectedStickerId === sticker.id;
          const stickerX = sticker.x * keyConfig.width * 0.92;
          const stickerZ = sticker.y * keyConfig.height * 0.92;

          return (
            <group
              key={sticker.id}
              ref={(el) => {
                stickerGroupRefs.current[sticker.id] = el;
              }}
              position={[stickerX, 0.215, stickerZ]}
            >
              {isStickerSelected && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[fontSize * 0.55, 32]} />
                  <meshBasicMaterial
                    color="#f59e0b"
                    transparent
                    opacity={0.25}
                    depthTest={false}
                  />
                </mesh>
              )}
              <Text
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={fontSize * 0.7}
                anchorX="center"
                anchorY="middle"
                onPointerDown={(e) => handleStickerPointerDown(e, sticker)}
                onClick={(e) => handleStickerClick(e, sticker)}
              >
                {config.emoji}
              </Text>
            </group>
          );
        })}

        <Text
          position={[0, 0.21, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={fontSize}
          color={fontColor}
          anchorX="center"
          anchorY="middle"
          fontWeight={fontConfig.fontWeight}
        >
          {displayLabel}
        </Text>
      </group>
    </group>
  );
}
