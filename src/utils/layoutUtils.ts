import { KeyConfig, KeyTransform, SnapGridSize } from '@/types/keyboard';

export interface AABB {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export const keyToAABB = (
  x: number,
  y: number,
  width: number,
  height: number,
  padding: number = 0
): AABB => ({
  left: x - padding,
  right: x + width + padding,
  top: y - padding,
  bottom: y + height + padding,
});

export const keyConfigToAABB = (
  key: KeyConfig,
  transform?: KeyTransform,
  padding: number = 0
): AABB => {
  const x = transform?.x ?? key.x;
  const y = transform?.y ?? key.y;
  const width = transform?.width ?? key.width;
  const height = transform?.height ?? key.height;
  return keyToAABB(x, y, width, height, padding);
};

export const aabbIntersects = (a: AABB, b: AABB): boolean => {
  return (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
  );
};

export const snapToGrid = (value: number, gridSize: SnapGridSize): number => {
  return Math.round(value / gridSize) * gridSize;
};

export const snapTransformToGrid = (
  transform: Partial<KeyTransform>,
  gridSize: SnapGridSize
): Partial<KeyTransform> => {
  const result: Partial<KeyTransform> = {};
  if (transform.x !== undefined) result.x = snapToGrid(transform.x, gridSize);
  if (transform.y !== undefined) result.y = snapToGrid(transform.y, gridSize);
  if (transform.width !== undefined) result.width = snapToGrid(transform.width, gridSize);
  if (transform.height !== undefined) result.height = snapToGrid(transform.height, gridSize);
  return result;
};

export const checkCollisionWithOthers = (
  currentKeyId: string,
  proposedX: number,
  proposedY: number,
  proposedWidth: number,
  proposedHeight: number,
  allKeys: KeyConfig[],
  keyCustoms: Record<string, { transform?: KeyTransform }>,
  padding: number = 0.02
): { collides: boolean; collidingKeyId?: string } => {
  const proposedAABB = keyToAABB(
    proposedX,
    proposedY,
    proposedWidth,
    proposedHeight,
    padding
  );

  for (const key of allKeys) {
    if (key.id === currentKeyId) continue;
    const custom = keyCustoms[key.id];
    const otherAABB = keyConfigToAABB(key, custom?.transform, padding);
    if (aabbIntersects(proposedAABB, otherAABB)) {
      return { collides: true, collidingKeyId: key.id };
    }
  }

  return { collides: false };
};

export const findNonCollidingPosition = (
  currentKeyId: string,
  desiredX: number,
  desiredY: number,
  width: number,
  height: number,
  allKeys: KeyConfig[],
  keyCustoms: Record<string, { transform?: KeyTransform }>,
  maxAttempts: number = 20
): { x: number; y: number } => {
  let bestX = desiredX;
  let bestY = desiredY;
  let minDistance = Infinity;

  const searchOffsets = [
    { dx: 0, dy: 0 },
    { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
    { dx: 1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, { dx: -1, dy: -1 },
  ];

  const step = 0.05;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const scale = attempt * step;
    for (const offset of searchOffsets) {
      const testX = desiredX + offset.dx * scale;
      const testY = desiredY + offset.dy * scale;

      const { collides } = checkCollisionWithOthers(
        currentKeyId,
        testX,
        testY,
        width,
        height,
        allKeys,
        keyCustoms,
        0.02
      );

      if (!collides) {
        const dist = Math.sqrt(
          Math.pow(testX - desiredX, 2) + Math.pow(testY - desiredY, 2)
        );
        if (dist < minDistance) {
          minDistance = dist;
          bestX = testX;
          bestY = testY;
        }
      }
    }

    if (minDistance < Infinity) {
      break;
    }
  }

  return { x: bestX, y: bestY };
};

export const clampToBounds = (
  x: number,
  y: number,
  width: number,
  height: number,
  boundsWidth: number,
  boundsHeight: number
): { x: number; y: number } => {
  return {
    x: Math.max(-2, Math.min(boundsWidth - width + 2, x)),
    y: Math.max(-2, Math.min(boundsHeight - height + 2, y)),
  };
};

export const SNAP_GRID_OPTIONS: { value: SnapGridSize; label: string }[] = [
  { value: 0.01, label: '极细 (0.01)' },
  { value: 0.05, label: '细 (0.05)' },
  { value: 0.1, label: '标准 (0.1)' },
  { value: 0.25, label: '粗 (0.25)' },
  { value: 0.5, label: '极粗 (0.5)' },
];
