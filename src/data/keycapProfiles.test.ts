import { describe, it, expect } from 'vitest';
import { KEYCAP_PROFILE_CONFIGS, KEYCAP_PROFILE_LIST, DEFAULT_KEYCAP_PROFILE } from '@/data/keycapProfiles';
import { KeyCapProfile } from '@/types/keyboard';

describe('keycapProfiles', () => {
  describe('KEYCAP_PROFILE_CONFIGS', () => {
    it('should have config for all profiles', () => {
      const profiles: KeyCapProfile[] = ['cherry', 'oem', 'dsa', 'sa', 'xda', 'low-profile'];
      for (const profile of profiles) {
        expect(KEYCAP_PROFILE_CONFIGS[profile]).toBeDefined();
        expect(KEYCAP_PROFILE_CONFIGS[profile].id).toBe(profile);
        expect(KEYCAP_PROFILE_CONFIGS[profile].name.length).toBeGreaterThan(0);
        expect(KEYCAP_PROFILE_CONFIGS[profile].height).toBeGreaterThan(0);
        expect(KEYCAP_PROFILE_CONFIGS[profile].topRadius).toBeGreaterThanOrEqual(0);
        expect(KEYCAP_PROFILE_CONFIGS[profile].bottomRadius).toBeGreaterThanOrEqual(0);
        expect(KEYCAP_PROFILE_CONFIGS[profile].sideAngle).toBeGreaterThanOrEqual(0);
        expect(KEYCAP_PROFILE_CONFIGS[profile].rowHeightVariation.length).toBeGreaterThan(0);
      }
    });

    it('should have DSA with uniform row height variation', () => {
      const dsa = KEYCAP_PROFILE_CONFIGS.dsa;
      const allSame = dsa.rowHeightVariation.every((v) => v === dsa.rowHeightVariation[0]);
      expect(allSame).toBe(true);
    });

    it('should have XDA with uniform row height variation', () => {
      const xda = KEYCAP_PROFILE_CONFIGS.xda;
      const allSame = xda.rowHeightVariation.every((v) => v === xda.rowHeightVariation[0]);
      expect(allSame).toBe(true);
    });

    it('should have low-profile as shortest profile', () => {
      const lowProfile = KEYCAP_PROFILE_CONFIGS['low-profile'].height;
      for (const config of Object.values(KEYCAP_PROFILE_CONFIGS)) {
        expect(config.height).toBeGreaterThanOrEqual(lowProfile);
      }
    });

    it('should have SA as tallest profile', () => {
      const saHeight = KEYCAP_PROFILE_CONFIGS.sa.height;
      for (const config of Object.values(KEYCAP_PROFILE_CONFIGS)) {
        expect(config.height).toBeLessThanOrEqual(saHeight);
      }
    });
  });

  describe('KEYCAP_PROFILE_LIST', () => {
    it('should contain all profiles', () => {
      expect(KEYCAP_PROFILE_LIST).toEqual(['cherry', 'oem', 'dsa', 'sa', 'xda', 'low-profile']);
    });
  });

  describe('DEFAULT_KEYCAP_PROFILE', () => {
    it('should be cherry', () => {
      expect(DEFAULT_KEYCAP_PROFILE).toBe('cherry');
    });
  });
});
