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
  useZoneColors,
  useRgbEnabled,
  useLightingMode,
  useRgbSpeed,
  useRgbBrightness,
  useZoneRgbColors,
  usePressedKeys,
  useLayout,
} from '@/store/useKeyboardStore';
import { useCurrentHighlightKeyId, useIsTypingGameActive } from '@/store/useTypingGameStore';
import { playPressSound, playReleaseSound } from '@/utils/switchSound';
import { FONT_CONFIGS } from '@/data/fonts';
import { STICKER_CONFIGS } from '@/data/stickers';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { ZONE_LIST } from '@/data/zones';
import { KeyZone } from '@/types/keyboard';

const LONG_PRESS_THRESHOLD = 200;

interface KeyCapProps {
  keyConfig: KeyConfig;
  selectedZone?: string | null;
  onKeySelect?: (keyId: string) => void;
}

interface Ripple {
  keyId: string;
  startTime: number;
  x: number;
  y: number;
}

function hexToRgb(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

function hslToRgb(h: number, s: number, l: number): THREE.Color {
  const color = new THREE.Color();
  color.setHSL(h, s, l);
  return color;
}

function lerpColor(a: THREE.Color, b: THREE.Color, t: number): THREE.Color {
  return a.clone().lerp(b, t);
}

const ripplesGlobal: Ripple[] = [];
const starlightPhaseGlobal: Record<string, number> = {};
const lastPressedKeysGlobal: Set<string> = new Set();

export function KeyCap({ keyConfig, selectedZone, onKeySelect }: KeyCapProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const backlightRef = useRef<THREE.Mesh>(null);
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
  const highlightKeyId = useCurrentHighlightKeyId();
  const isTypingGameActive = useIsTypingGameActive();
  const pressKey = useKeyboardStore((state) => state.pressKey);
  const releaseKey = useKeyboardStore((state) => state.releaseKey);
  const setSelectedKeyId = useKeyboardStore((state) => state.setSelectedKeyId);
  const setSelectedStickerId = useKeyboardStore((state) => state.setSelectedStickerId);
  const setKeyStickerPosition = useKeyboardStore((state) => state.setKeyStickerPosition);
  const setIsDraggingSticker = useKeyboardStore((state) => state.setIsDraggingSticker);

  const rgbEnabled = useRgbEnabled();
  const lightingMode = useLightingMode();
  const rgbSpeed = useRgbSpeed();
  const rgbBrightness = useRgbBrightness();
  const zoneRgbColors = useZoneRgbColors();
  const pressedKeys = usePressedKeys();
  const layout = useLayout();
  const layoutConfig = LAYOUT_CONFIGS[layout];

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
  const isHighlighted = isTypingGameActive && highlightKeyId === keyConfig.id;

  const displayLabel = keyCustom?.label ?? keyConfig.label;
  const stickers: StickerInstance[] = keyCustom?.stickers ?? [];

  const pressDepth = useMemo(() => (isPressed ? -0.18 : 0), [isPressed]);
  const targetScale = useMemo(() => (isPressed ? 0.985 : 1), [isPressed]);

  const totalWidth = layoutConfig.width;
  const totalHeight = layoutConfig.height;

  const rgbColorRef = useRef<THREE.Color>(new THREE.Color(zoneRgbColors[keyConfig.zone]));
  const rgbIntensityRef = useRef<number>(0);

  const getLightingColor = (time: number): THREE.Color => {
    const t = time * rgbSpeed;
    const baseColor = hexToRgb(zoneRgbColors[keyConfig.zone]);

    switch (lightingMode) {
      case 'static':
        return baseColor;

      case 'breathing': {
        const breath = (Math.sin(t * 2) + 1) / 2;
        const intensity = 0.3 + breath * 0.7;
        return baseColor.clone().multiplyScalar(intensity);
      }

      case 'wave': {
        const keyCenterX = keyConfig.x + keyConfig.width / 2;
        const normalizedX = keyCenterX / totalWidth;
        const wave = Math.sin(normalizedX * Math.PI * 4 - t * 3) * 0.5 + 0.5;
        const hue = (normalizedX + t * 0.15) % 1;
        const waveColor = hslToRgb(hue, 0.85, 0.55);
        return lerpColor(baseColor, waveColor, wave);
      }

      case 'rainbow': {
        const keyCenterX = keyConfig.x + keyConfig.width / 2;
        const keyCenterY = keyConfig.y + keyConfig.height / 2;
        const normalizedX = keyCenterX / totalWidth;
        const normalizedY = keyCenterY / totalHeight;
        const hue = (normalizedX * 0.6 + normalizedY * 0.2 + t * 0.2) % 1;
        return hslToRgb(hue, 0.9, 0.6);
      }

      case 'reactive': {
        if (isPressed) {
          const white = new THREE.Color('#ffffff');
          return lerpColor(baseColor, white, 0.7);
        }
        return baseColor.clone().multiplyScalar(0.4);
      }

      case 'ripple': {
        const newPressed = [...pressedKeys].filter(
          (k) => !lastPressedKeysGlobal.has(k)
        );
        newPressed.forEach((keyId) => {
          const key = layoutConfig.keys.find((k) => k.id === keyId);
          if (key) {
            ripplesGlobal.push({
              keyId,
              startTime: time,
              x: key.x + key.width / 2,
              y: key.y + key.height / 2,
            });
          }
        });

        for (let i = ripplesGlobal.length - 1; i >= 0; i--) {
          if (time - ripplesGlobal[i].startTime > 1.5) {
            ripplesGlobal.splice(i, 1);
          }
        }

        let outColor = baseColor.clone().multiplyScalar(0.3);
        const keyCenterX = keyConfig.x + keyConfig.width / 2;
        const keyCenterY = keyConfig.y + keyConfig.height / 2;

        ripplesGlobal.forEach((ripple) => {
          const dx = keyCenterX - ripple.x;
          const dy = keyCenterY - ripple.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const age = time - ripple.startTime;
          const waveRadius = age * 20;
          const waveWidth = 4;
          const wave = Math.exp(-Math.pow((dist - waveRadius) / waveWidth, 2));
          const hue = (ripple.startTime * 0.5 + age * 0.5) % 1;
          const rippleColor = hslToRgb(hue, 0.9, 0.6);
          outColor = lerpColor(outColor, rippleColor, wave * 0.8);
        });

        lastPressedKeysGlobal.clear();
        pressedKeys.forEach((k) => lastPressedKeysGlobal.add(k));
        return outColor;
      }

      case 'starlight': {
        if (!starlightPhaseGlobal[keyConfig.id]) {
          starlightPhaseGlobal[keyConfig.id] = Math.random() * Math.PI * 2;
        }
        const phase = starlightPhaseGlobal[keyConfig.id];
        const twinkleSpeed = 1.5 + ((keyConfig.row + keyConfig.col) % 3) * 0.5;
        const twinkle = Math.sin(t * twinkleSpeed + phase) * 0.5 + 0.5;
        const intensity = 0.2 + twinkle * 0.8;
        const hue = (t * 0.1 + phase * 0.1) % 1;
        const starColor = hslToRgb(hue, 0.7, 0.6);
        return lerpColor(baseColor, starColor, twinkle * 0.6).multiplyScalar(intensity);
      }

      case 'marquee': {
        const zoneIndex = ZONE_LIST.indexOf(keyConfig.zone);
        const zoneCount = ZONE_LIST.length;
        const hue = ((t * 0.3 + zoneIndex / zoneCount) % 1);
        const zoneColor = hslToRgb(hue, 0.85, 0.55);
        const pulse = (Math.sin(t * 4 - zoneIndex * 0.8) + 1) / 2;
        return lerpColor(baseColor, zoneColor, 0.5 + pulse * 0.5);
      }

      default:
        return baseColor;
    }
  };

  useFrame((state, delta) => {
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

    if (isHighlighted) {
      const pulseIntensity = 0.7 + Math.sin(state.clock.elapsedTime * 6) * 0.3;
      const highlightColor = new THREE.Color('#22d3ee');

      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.emissive.copy(highlightColor);
        mat.emissiveIntensity = pulseIntensity;
        mat.needsUpdate = true;
      }

      if (backlightRef.current) {
        const backMat = backlightRef.current.material as THREE.MeshBasicMaterial;
        backMat.color.copy(highlightColor);
        backMat.opacity = Math.min(1, pulseIntensity * 1.5);
        backMat.needsUpdate = true;
      }
    } else if (rgbEnabled) {
      const animatedColor = getLightingColor(state.clock.elapsedTime);
      rgbColorRef.current.copy(animatedColor);
      const intensity = isPressed ? rgbBrightness * 1.2 : rgbBrightness * 0.7;
      rgbIntensityRef.current = intensity;

      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.emissive.copy(animatedColor);
        mat.emissiveIntensity = intensity;
        mat.needsUpdate = true;
      }

      if (backlightRef.current) {
        const backMat = backlightRef.current.material as THREE.MeshBasicMaterial;
        backMat.color.copy(animatedColor);
        backMat.opacity = Math.min(1, intensity * 1.2);
        backMat.needsUpdate = true;
      }
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

  const interactionEmissiveIntensity = isHighlighted
    ? 0.9
    : hovered || isZoneSelected || isKeySelected
    ? 0.35
    : isPressed
    ? 0.6
    : 0.12;
  const interactionEmissiveColor = isHighlighted
    ? '#22d3ee'
    : isPressed
    ? '#ffffff'
    : isKeySelected
    ? '#f59e0b'
    : hovered
    ? '#6366f1'
    : isZoneSelected
    ? '#8b5cf6'
    : '#000000';

  const finalEmissiveColor = isHighlighted
    ? new THREE.Color('#22d3ee')
    : rgbEnabled
    ? rgbColorRef.current
    : new THREE.Color(interactionEmissiveColor);
  const finalEmissiveIntensity = isHighlighted
    ? 0.9
    : rgbEnabled
    ? rgbIntensityRef.current
    : interactionEmissiveIntensity;

  const baseFontSize = keyConfig.width > 1.5 ? 0.28 : keyConfig.width > 1 ? 0.32 : 0.38;
  const fontSize = baseFontSize * (globalFontSize / 0.38);

  const fontConfig = FONT_CONFIGS[fontStyle];

  return (
    <group position={[keyConfig.x + keyConfig.width / 2, 0, keyConfig.y + keyConfig.height / 2]}>
      {(rgbEnabled || isHighlighted) && (
        <mesh
          ref={backlightRef}
          position={[0, -0.05, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[keyConfig.width * 1.0, keyConfig.height * 1.0]} />
          <meshBasicMaterial
            color={zoneRgbColors[keyConfig.zone]}
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      )}
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
            emissive={finalEmissiveColor}
            emissiveIntensity={finalEmissiveIntensity}
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
