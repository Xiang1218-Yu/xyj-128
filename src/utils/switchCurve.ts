import { SwitchPhysicsParams } from '@/types/keyboard';

export interface CurvePoint {
  travel: number;
  force: number;
}

export function generatePressCurve(physics: SwitchPhysicsParams, steps: number = 100): CurvePoint[] {
  const points: CurvePoint[] = [];
  const { totalTravel, actuationTravel, actuationForce, tactileForce, tactileTravel, bottomOutForce } = physics;

  for (let i = 0; i <= steps; i++) {
    const travel = (i / steps) * totalTravel;
    let force: number;

    if (physics.tactileForce > 0 && travel <= tactileTravel) {
      const t = travel / tactileTravel;
      const tactilePeak = Math.sin(t * Math.PI) * (tactileForce - actuationForce);
      force = actuationForce + tactilePeak;
    } else if (travel <= actuationTravel) {
      const t = travel / actuationTravel;
      force = actuationForce * (0.3 + 0.7 * t);
    } else {
      const t = (travel - actuationTravel) / (totalTravel - actuationTravel);
      force = actuationForce + (bottomOutForce - actuationForce) * Math.pow(t, 1.2);
    }

    points.push({ travel, force });
  }

  return points;
}

export function generateReleaseCurve(physics: SwitchPhysicsParams, steps: number = 100): CurvePoint[] {
  const points: CurvePoint[] = [];
  const { totalTravel, actuationTravel, actuationForce, tactileForce, tactileTravel, bottomOutForce } = physics;

  for (let i = 0; i <= steps; i++) {
    const travel = totalTravel - (i / steps) * totalTravel;
    let force: number;

    if (travel >= actuationTravel) {
      const t = (travel - actuationTravel) / (totalTravel - actuationTravel);
      force = bottomOutForce - (bottomOutForce - actuationForce) * (1 - t);
    } else if (physics.tactileForce > 0 && travel >= tactileTravel * 0.3) {
      const t = (travel - actuationTravel * 0.3) / (tactileTravel - actuationTravel * 0.3);
      force = actuationForce * 0.8 + (tactileForce - actuationForce * 0.8) * Math.sin(t * Math.PI * 0.5);
    } else {
      const t = travel / actuationTravel;
      force = actuationForce * (0.2 + 0.6 * t);
    }

    points.push({ travel, force });
  }

  return points;
}

export function getMaxForce(physics: SwitchPhysicsParams): number {
  return Math.max(physics.actuationForce, physics.tactileForce, physics.bottomOutForce) * 1.1;
}

export function getForceAtTravel(physics: SwitchPhysicsParams, travel: number, isPressing: boolean): number {
  const { totalTravel, actuationTravel, actuationForce, tactileForce, tactileTravel, bottomOutForce } = physics;

  travel = Math.max(0, Math.min(totalTravel, travel));

  if (isPressing) {
    if (physics.tactileForce > 0 && travel <= tactileTravel) {
      const t = travel / tactileTravel;
      const tactilePeak = Math.sin(t * Math.PI) * (tactileForce - actuationForce);
      return actuationForce + tactilePeak;
    } else if (travel <= actuationTravel) {
      const t = travel / actuationTravel;
      return actuationForce * (0.3 + 0.7 * t);
    } else {
      const t = (travel - actuationTravel) / (totalTravel - actuationTravel);
      return actuationForce + (bottomOutForce - actuationForce) * Math.pow(t, 1.2);
    }
  } else {
    if (travel >= actuationTravel) {
      const t = (travel - actuationTravel) / (totalTravel - actuationTravel);
      return bottomOutForce - (bottomOutForce - actuationForce) * (1 - t);
    } else if (physics.tactileForce > 0 && travel >= tactileTravel * 0.3) {
      const t = (travel - actuationTravel * 0.3) / (tactileTravel - actuationTravel * 0.3);
      return actuationForce * 0.8 + (tactileForce - actuationForce * 0.8) * Math.sin(t * Math.PI * 0.5);
    } else {
      const t = travel / actuationTravel;
      return actuationForce * (0.2 + 0.6 * t);
    }
  }
}

export function calculatePressDepth(physics: SwitchPhysicsParams, isPressed: boolean): number {
  const scaleFactor = 0.045;
  return isPressed ? -physics.totalTravel * scaleFactor : 0;
}

export function calculateAnimationSpeed(physics: SwitchPhysicsParams): { pressSpeed: number; releaseSpeed: number } {
  const basePressSpeed = 18;
  const baseReleaseSpeed = 14;

  const forceFactor = 60 / physics.actuationForce;
  const travelFactor = 4 / physics.totalTravel;

  return {
    pressSpeed: basePressSpeed * forceFactor * travelFactor,
    releaseSpeed: physics.returnSpeed,
  };
}

export function formatValue(value: number, unit: string, decimals: number = 1): string {
  return `${value.toFixed(decimals)} ${unit}`;
}
