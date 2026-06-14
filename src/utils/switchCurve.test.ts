import { describe, it, expect } from 'vitest';
import {
  generatePressCurve,
  generateReleaseCurve,
  getMaxForce,
  getForceAtTravel,
  calculatePressDepth,
  calculateAnimationSpeed,
  formatValue,
} from '@/utils/switchCurve';
import { SwitchPhysicsParams } from '@/types/keyboard';

const linearPhysics: SwitchPhysicsParams = {
  totalTravel: 4.0,
  actuationTravel: 2.0,
  actuationForce: 45,
  tactileForce: 0,
  tactileTravel: 0,
  bottomOutForce: 60,
  returnSpeed: 18,
  damping: 14,
};

const tactilePhysics: SwitchPhysicsParams = {
  totalTravel: 4.0,
  actuationTravel: 2.0,
  actuationForce: 45,
  tactileForce: 55,
  tactileTravel: 1.2,
  bottomOutForce: 65,
  returnSpeed: 17,
  damping: 13,
};

describe('switchCurve', () => {
  describe('generatePressCurve', () => {
    it('should generate correct number of points', () => {
      const points = generatePressCurve(linearPhysics, 50);
      expect(points.length).toBe(51);
    });

    it('should start at travel 0', () => {
      const points = generatePressCurve(linearPhysics);
      expect(points[0].travel).toBe(0);
    });

    it('should end at totalTravel', () => {
      const points = generatePressCurve(linearPhysics);
      expect(points[points.length - 1].travel).toBe(4.0);
    });

    it('should have increasing travel values', () => {
      const points = generatePressCurve(linearPhysics);
      for (let i = 1; i < points.length; i++) {
        expect(points[i].travel).toBeGreaterThan(points[i - 1].travel);
      }
    });

    it('should have positive force values for linear switch', () => {
      const points = generatePressCurve(linearPhysics);
      for (const point of points) {
        expect(point.force).toBeGreaterThan(0);
      }
    });

    it('should handle tactile switch with tactile bump', () => {
      const points = generatePressCurve(tactilePhysics);
      const maxForce = Math.max(...points.map((p) => p.force));
      expect(maxForce).toBeGreaterThan(tactilePhysics.actuationForce);
    });

    it('should default to 100 steps', () => {
      const points = generatePressCurve(linearPhysics);
      expect(points.length).toBe(101);
    });
  });

  describe('generateReleaseCurve', () => {
    it('should generate correct number of points', () => {
      const points = generateReleaseCurve(linearPhysics, 50);
      expect(points.length).toBe(51);
    });

    it('should start at totalTravel', () => {
      const points = generateReleaseCurve(linearPhysics);
      expect(points[0].travel).toBe(4.0);
    });

    it('should end at travel 0', () => {
      const points = generateReleaseCurve(linearPhysics);
      expect(points[points.length - 1].travel).toBeCloseTo(0, 5);
    });

    it('should have decreasing travel values', () => {
      const points = generateReleaseCurve(linearPhysics);
      for (let i = 1; i < points.length; i++) {
        expect(points[i].travel).toBeLessThan(points[i - 1].travel);
      }
    });

    it('should have non-negative force values', () => {
      const points = generateReleaseCurve(linearPhysics);
      for (const point of points) {
        expect(point.force).toBeGreaterThanOrEqual(0);
      }
    });

    it('should handle tactile switch release curve', () => {
      const points = generateReleaseCurve(tactilePhysics);
      expect(points.length).toBe(101);
      for (const point of points) {
        expect(point.force).toBeGreaterThanOrEqual(0);
      }
    });

    it('should produce different curves for tactile vs linear release', () => {
      const tactileRelease = generateReleaseCurve(tactilePhysics);
      const linearRelease = generateReleaseCurve(linearPhysics);
      const tactileForceAt1 = tactileRelease.find((p) => Math.abs(p.travel - 1.0) < 0.01);
      const linearForceAt1 = linearRelease.find((p) => Math.abs(p.travel - 1.0) < 0.01);
      if (tactileForceAt1 && linearForceAt1) {
        expect(tactileForceAt1.force).not.toBe(linearForceAt1.force);
      }
    });
  });

  describe('getMaxForce', () => {
    it('should return max force scaled by 1.1', () => {
      const maxForce = getMaxForce(linearPhysics);
      expect(maxForce).toBe(Math.max(45, 0, 60) * 1.1);
    });

    it('should handle tactile switches', () => {
      const maxForce = getMaxForce(tactilePhysics);
      expect(maxForce).toBe(Math.max(45, 55, 65) * 1.1);
    });
  });

  describe('getForceAtTravel', () => {
    it('should return force at travel for pressing linear switch', () => {
      const force = getForceAtTravel(linearPhysics, 0, true);
      expect(force).toBeGreaterThan(0);
    });

    it('should return higher force at bottom out', () => {
      const forceAtActuation = getForceAtTravel(linearPhysics, 2.0, true);
      const forceAtBottom = getForceAtTravel(linearPhysics, 4.0, true);
      expect(forceAtBottom).toBeGreaterThan(forceAtActuation);
    });

    it('should handle tactile bump for pressing tactile switch', () => {
      const forceAtBump = getForceAtTravel(tactilePhysics, 0.6, true);
      const forceAtSameLinear = getForceAtTravel(linearPhysics, 0.6, true);
      expect(forceAtBump).toBeGreaterThan(forceAtSameLinear);
    });

    it('should handle release curve', () => {
      const force = getForceAtTravel(linearPhysics, 3.0, false);
      expect(force).toBeGreaterThan(0);
    });

    it('should clamp travel to valid range', () => {
      const forceNegative = getForceAtTravel(linearPhysics, -1, true);
      const forceZero = getForceAtTravel(linearPhysics, 0, true);
      expect(forceNegative).toBeCloseTo(forceZero, 5);

      const forceOver = getForceAtTravel(linearPhysics, 10, true);
      const forceMax = getForceAtTravel(linearPhysics, 4.0, true);
      expect(forceOver).toBeCloseTo(forceMax, 5);
    });

    it('should return bottom out force at full travel when pressing', () => {
      const force = getForceAtTravel(linearPhysics, 4.0, true);
      expect(force).toBe(linearPhysics.bottomOutForce);
    });

    it('should return different forces for press vs release', () => {
      const pressForce = getForceAtTravel(linearPhysics, 3.0, true);
      const releaseForce = getForceAtTravel(linearPhysics, 3.0, false);
      expect(pressForce).not.toBe(releaseForce);
    });

    it('should handle tactile switch release at travel >= actuationTravel', () => {
      const force = getForceAtTravel(tactilePhysics, 3.0, false);
      expect(force).toBeGreaterThan(0);
    });

    it('should handle tactile switch release between tactile and actuation', () => {
      const force = getForceAtTravel(tactilePhysics, 0.5, false);
      expect(force).toBeGreaterThan(0);
    });

    it('should handle tactile switch release below tactile threshold', () => {
      const force = getForceAtTravel(tactilePhysics, 0.1, false);
      expect(force).toBeGreaterThan(0);
    });

    it('should handle linear switch release below actuation', () => {
      const force = getForceAtTravel(linearPhysics, 0.5, false);
      expect(force).toBeGreaterThan(0);
    });

    it('should handle tactile release curve through all regions', () => {
      const forces = [
        getForceAtTravel(tactilePhysics, 3.5, false),
        getForceAtTravel(tactilePhysics, 1.0, false),
        getForceAtTravel(tactilePhysics, 0.3, false),
        getForceAtTravel(tactilePhysics, 0.1, false),
      ];
      for (const f of forces) {
        expect(f).toBeGreaterThan(0);
      }
    });
  });

  describe('calculatePressDepth', () => {
    it('should return 0 when not pressed', () => {
      const depth = calculatePressDepth(linearPhysics, false);
      expect(depth).toBe(0);
    });

    it('should return negative depth when pressed', () => {
      const depth = calculatePressDepth(linearPhysics, true);
      expect(depth).toBeLessThan(0);
    });

    it('should scale with total travel', () => {
      const depth = calculatePressDepth(linearPhysics, true);
      expect(Math.abs(depth)).toBeCloseTo(linearPhysics.totalTravel * 0.045, 5);
    });
  });

  describe('calculateAnimationSpeed', () => {
    it('should return press and release speeds', () => {
      const speeds = calculateAnimationSpeed(linearPhysics);
      expect(speeds.pressSpeed).toBeGreaterThan(0);
      expect(speeds.releaseSpeed).toBeGreaterThan(0);
    });

    it('should set release speed equal to return speed', () => {
      const speeds = calculateAnimationSpeed(linearPhysics);
      expect(speeds.releaseSpeed).toBe(linearPhysics.returnSpeed);
    });

    it('should vary with actuation force', () => {
      const heavyPhysics = { ...linearPhysics, actuationForce: 80 };
      const lightPhysics = { ...linearPhysics, actuationForce: 30 };
      const heavySpeed = calculateAnimationSpeed(heavyPhysics);
      const lightSpeed = calculateAnimationSpeed(lightPhysics);
      expect(heavySpeed.pressSpeed).not.toBe(lightSpeed.pressSpeed);
    });
  });

  describe('formatValue', () => {
    it('should format value with unit', () => {
      expect(formatValue(45, 'g')).toBe('45.0 g');
    });

    it('should use specified decimals', () => {
      expect(formatValue(4.123, 'mm', 2)).toBe('4.12 mm');
    });

    it('should default to 1 decimal', () => {
      expect(formatValue(3.456, 'mm')).toBe('3.5 mm');
    });
  });
});
