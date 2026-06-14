import { describe, it, expect } from 'vitest';
import {
  keyToAABB,
  keyConfigToAABB,
  aabbIntersects,
  snapToGrid,
  snapTransformToGrid,
  checkCollisionWithOthers,
  findNonCollidingPosition,
  clampToBounds,
  calculateLayoutDimensions,
  generateKeyRow,
  generateLayoutKeys,
  shiftKeys,
  KEY_UNIT,
  KEY_GAP_X,
  KEY_GAP_Y,
  ROW_HEIGHT,
} from '@/utils/layoutUtils';
import { KeyConfig, KeyTransform, SnapGridSize } from '@/types/keyboard';

describe('layoutUtils', () => {
  describe('constants', () => {
    it('should have KEY_UNIT = 1', () => {
      expect(KEY_UNIT).toBe(1);
    });

    it('should have KEY_GAP_X > 0', () => {
      expect(KEY_GAP_X).toBeGreaterThan(0);
    });

    it('should have KEY_GAP_Y > 0', () => {
      expect(KEY_GAP_Y).toBeGreaterThan(0);
    });

    it('should have ROW_HEIGHT = KEY_UNIT + KEY_GAP_Y', () => {
      expect(ROW_HEIGHT).toBe(KEY_UNIT + KEY_GAP_Y);
    });
  });

  describe('keyToAABB', () => {
    it('should create AABB from position and dimensions', () => {
      const aabb = keyToAABB(1, 2, 3, 4);
      expect(aabb.left).toBe(1);
      expect(aabb.right).toBe(4);
      expect(aabb.top).toBe(2);
      expect(aabb.bottom).toBe(6);
    });

    it('should apply padding', () => {
      const aabb = keyToAABB(1, 2, 3, 4, 0.5);
      expect(aabb.left).toBe(0.5);
      expect(aabb.right).toBe(4.5);
      expect(aabb.top).toBe(1.5);
      expect(aabb.bottom).toBe(6.5);
    });
  });

  describe('keyConfigToAABB', () => {
    it('should use key config values', () => {
      const key: KeyConfig = {
        id: 'test',
        label: 'A',
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        row: 0,
        col: 0,
        zone: 'alphanumeric',
      };
      const aabb = keyConfigToAABB(key);
      expect(aabb.left).toBe(1);
      expect(aabb.right).toBe(4);
    });

    it('should use transform values when provided', () => {
      const key: KeyConfig = {
        id: 'test',
        label: 'A',
        x: 1,
        y: 2,
        width: 1,
        height: 1,
        row: 0,
        col: 0,
        zone: 'alphanumeric',
      };
      const transform: KeyTransform = { x: 5, y: 6, width: 2, height: 2 };
      const aabb = keyConfigToAABB(key, transform);
      expect(aabb.left).toBe(5);
      expect(aabb.right).toBe(7);
      expect(aabb.top).toBe(6);
      expect(aabb.bottom).toBe(8);
    });
  });

  describe('aabbIntersects', () => {
    it('should detect overlapping AABBs', () => {
      const a = { left: 0, right: 2, top: 0, bottom: 2 };
      const b = { left: 1, right: 3, top: 1, bottom: 3 };
      expect(aabbIntersects(a, b)).toBe(true);
    });

    it('should detect non-overlapping AABBs', () => {
      const a = { left: 0, right: 1, top: 0, bottom: 1 };
      const b = { left: 2, right: 3, top: 2, bottom: 3 };
      expect(aabbIntersects(a, b)).toBe(false);
    });

    it('should detect adjacent AABBs as not overlapping', () => {
      const a = { left: 0, right: 1, top: 0, bottom: 1 };
      const b = { left: 1, right: 2, top: 0, bottom: 1 };
      expect(aabbIntersects(a, b)).toBe(false);
    });

    it('should detect fully contained AABB', () => {
      const a = { left: 0, right: 4, top: 0, bottom: 4 };
      const b = { left: 1, right: 2, top: 1, bottom: 2 };
      expect(aabbIntersects(a, b)).toBe(true);
    });
  });

  describe('snapToGrid', () => {
    it('should snap value to nearest grid point', () => {
      expect(snapToGrid(0.03, 0.05)).toBe(0.05);
      expect(snapToGrid(0.02, 0.05)).toBe(0);
      expect(snapToGrid(0.07, 0.05)).toBe(0.05);
    });

    it('should handle already-aligned values', () => {
      expect(snapToGrid(0.5, 0.5)).toBe(0.5);
      expect(snapToGrid(0, 0.1)).toBe(0);
    });

    it('should handle different grid sizes', () => {
      expect(snapToGrid(0.12, 0.1)).toBe(0.1);
      expect(snapToGrid(0.16, 0.1)).toBe(0.2);
      expect(snapToGrid(0.26, 0.25)).toBe(0.25);
    });
  });

  describe('snapTransformToGrid', () => {
    it('should snap all transform properties', () => {
      const result = snapTransformToGrid(
        { x: 0.03, y: 0.07, width: 1.02, height: 1.08 },
        0.05
      );
      expect(result.x).toBe(0.05);
      expect(result.y).toBe(0.05);
      expect(result.width).toBe(1.0);
      expect(result.height).toBe(1.1);
    });

    it('should only snap defined properties', () => {
      const result = snapTransformToGrid({ x: 0.03 }, 0.05);
      expect(result.x).toBe(0.05);
      expect(result.y).toBeUndefined();
      expect(result.width).toBeUndefined();
      expect(result.height).toBeUndefined();
    });
  });

  describe('checkCollisionWithOthers', () => {
    const keys: KeyConfig[] = [
      { id: 'key1', label: 'A', x: 0, y: 0, width: 1, height: 1, row: 0, col: 0, zone: 'alphanumeric' },
      { id: 'key2', label: 'B', x: 1.05, y: 0, width: 1, height: 1, row: 0, col: 1, zone: 'alphanumeric' },
      { id: 'key3', label: 'C', x: 5, y: 5, width: 1, height: 1, row: 1, col: 0, zone: 'alphanumeric' },
    ];

    it('should detect collision with other keys', () => {
      const result = checkCollisionWithOthers('key3', 0, 0, 1, 1, keys, {});
      expect(result.collides).toBe(true);
    });

    it('should not detect collision when no overlap', () => {
      const result = checkCollisionWithOthers('key3', 10, 10, 1, 1, keys, {});
      expect(result.collides).toBe(false);
    });

    it('should skip the current key when checking', () => {
      const result = checkCollisionWithOthers('key1', 0, 0, 1, 1, keys, {});
      expect(result.collides).toBe(false);
    });

    it('should use custom transform for other keys', () => {
      const result = checkCollisionWithOthers(
        'key3',
        1.0,
        0,
        1,
        1,
        keys,
        { key2: { transform: { x: 0.5 } } }
      );
      expect(result.collides).toBe(true);
    });
  });

  describe('findNonCollidingPosition', () => {
    it('should return original position if no collision', () => {
      const keys: KeyConfig[] = [
        { id: 'key1', label: 'A', x: 0, y: 0, width: 1, height: 1, row: 0, col: 0, zone: 'alphanumeric' },
      ];
      const result = findNonCollidingPosition('key1', 5, 5, 1, 1, keys, {});
      expect(result.x).toBe(5);
      expect(result.y).toBe(5);
    });

    it('should find nearby non-colliding position', () => {
      const keys: KeyConfig[] = [
        { id: 'key1', label: 'A', x: 0, y: 0, width: 1, height: 1, row: 0, col: 0, zone: 'alphanumeric' },
        { id: 'key2', label: 'B', x: 1, y: 0, width: 1, height: 1, row: 0, col: 1, zone: 'alphanumeric' },
      ];
      const result = findNonCollidingPosition('key1', 1, 0, 1, 1, keys, {});
      expect(result).toBeDefined();
      expect(typeof result.x).toBe('number');
      expect(typeof result.y).toBe('number');
    });
  });

  describe('clampToBounds', () => {
    it('should allow positions within bounds', () => {
      const result = clampToBounds(1, 1, 1, 1, 10, 10);
      expect(result.x).toBe(1);
      expect(result.y).toBe(1);
    });

    it('should clamp negative x', () => {
      const result = clampToBounds(-5, 1, 1, 1, 10, 10);
      expect(result.x).toBe(-2);
    });

    it('should clamp x that exceeds bounds', () => {
      const result = clampToBounds(20, 1, 1, 1, 10, 10);
      expect(result.x).toBe(11);
    });

    it('should clamp negative y', () => {
      const result = clampToBounds(1, -5, 1, 1, 10, 10);
      expect(result.y).toBe(-2);
    });

    it('should clamp y that exceeds bounds', () => {
      const result = clampToBounds(1, 20, 1, 1, 10, 10);
      expect(result.y).toBe(11);
    });
  });

  describe('calculateLayoutDimensions', () => {
    it('should return zero for empty keys', () => {
      const result = calculateLayoutDimensions([]);
      expect(result).toEqual({ width: 0, height: 0 });
    });

    it('should calculate dimensions from keys', () => {
      const keys: KeyConfig[] = [
        { id: 'k1', label: 'A', x: 0, y: 0, width: 1, height: 1, row: 0, col: 0, zone: 'alphanumeric' },
        { id: 'k2', label: 'B', x: 5, y: 3, width: 2, height: 1, row: 1, col: 1, zone: 'alphanumeric' },
      ];
      const result = calculateLayoutDimensions(keys);
      expect(result.width).toBe(7);
      expect(result.height).toBe(4);
    });
  });

  describe('generateKeyRow', () => {
    it('should generate keys for a row', () => {
      const rowKeys = generateKeyRow(
        [
          { label: 'A', zone: 'alphanumeric' },
          { label: 'B', zone: 'alphanumeric' },
        ],
        { rowIndex: 0 }
      );
      expect(rowKeys.length).toBe(2);
      expect(rowKeys[0].label).toBe('A');
      expect(rowKeys[1].label).toBe('B');
    });

    it('should set correct row index and y position', () => {
      const rowKeys = generateKeyRow(
        [{ label: 'A', zone: 'alphanumeric' }],
        { rowIndex: 3 }
      );
      expect(rowKeys[0].row).toBe(3);
      expect(rowKeys[0].y).toBe(3 * ROW_HEIGHT);
    });

    it('should handle custom width keys', () => {
      const rowKeys = generateKeyRow(
        [{ label: 'Space', width: 6.25, zone: 'spacebar' }],
        { rowIndex: 0 }
      );
      expect(rowKeys[0].width).toBe(6.25);
    });

    it('should apply xOffset', () => {
      const rowKeys = generateKeyRow(
        [
          { label: 'A', zone: 'alphanumeric' },
          { label: 'B', zone: 'alphanumeric', xOffset: 0.2 },
        ],
        { rowIndex: 0 }
      );
      const gap = rowKeys[1].x - rowKeys[0].x - rowKeys[0].width;
      expect(gap).toBeCloseTo(KEY_GAP_X + 0.2, 5);
    });

    it('should use idPrefix', () => {
      const rowKeys = generateKeyRow(
        [{ label: 'A', zone: 'alphanumeric' }],
        { rowIndex: 0, idPrefix: 'np-' }
      );
      expect(rowKeys[0].id).toContain('np-');
    });

    it('should use rowStartX', () => {
      const rowKeys = generateKeyRow(
        [{ label: 'A', zone: 'alphanumeric' }],
        { rowIndex: 0, rowStartX: 10 }
      );
      expect(rowKeys[0].x).toBe(10);
    });
  });

  describe('generateLayoutKeys', () => {
    it('should generate keys for multiple rows', () => {
      const keys = generateLayoutKeys([
        { keys: [{ label: 'A', zone: 'alphanumeric' }] },
        { keys: [{ label: 'B', zone: 'alphanumeric' }] },
      ]);
      expect(keys.length).toBe(2);
    });

    it('should apply yOffset', () => {
      const keys = generateLayoutKeys([
        { keys: [{ label: 'A', zone: 'alphanumeric' }], yOffset: 2 },
      ]);
      expect(keys[0].y).toBe(0 + 2);
    });

    it('should use rowIndexOverride', () => {
      const keys = generateLayoutKeys([
        { keys: [{ label: 'A', zone: 'alphanumeric' }], rowIndexOverride: 5 },
      ]);
      expect(keys[0].row).toBe(5);
    });
  });

  describe('shiftKeys', () => {
    it('should shift key positions', () => {
      const keys: KeyConfig[] = [
        { id: 'k1', label: 'A', x: 1, y: 2, width: 1, height: 1, row: 0, col: 0, zone: 'alphanumeric' },
      ];
      const shifted = shiftKeys(keys, 3, 4);
      expect(shifted[0].x).toBe(4);
      expect(shifted[0].y).toBe(6);
    });

    it('should shift row index', () => {
      const keys: KeyConfig[] = [
        { id: 'k1', label: 'A', x: 0, y: 0, width: 1, height: 1, row: 0, col: 0, zone: 'alphanumeric' },
      ];
      const shifted = shiftKeys(keys, 0, 0, 2);
      expect(shifted[0].row).toBe(2);
    });

    it('should add idPrefix', () => {
      const keys: KeyConfig[] = [
        { id: 'k1', label: 'A', x: 0, y: 0, width: 1, height: 1, row: 0, col: 0, zone: 'alphanumeric' },
      ];
      const shifted = shiftKeys(keys, 0, 0, 0, '75-');
      expect(shifted[0].id).toBe('75-k1');
    });
  });
});
