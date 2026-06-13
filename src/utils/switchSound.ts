import { SwitchType } from '@/types/keyboard';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

interface SoundProfile {
  press: {
    thockFreq: number;
    thockGain: number;
    thockDuration: number;
    clickFreq?: number;
    clickGain?: number;
    clickDuration?: number;
    noiseGain: number;
    noiseDuration: number;
    noiseFilterFreq: number;
    noiseFilterQ: number;
    returnFreq: number;
    returnGain: number;
    returnDuration: number;
  };
}

const SOUND_PROFILES: Record<SwitchType, SoundProfile> = {
  red: {
    press: {
      thockFreq: 180,
      thockGain: 0.3,
      thockDuration: 0.06,
      noiseGain: 0.15,
      noiseDuration: 0.05,
      noiseFilterFreq: 1200,
      noiseFilterQ: 1.2,
      returnFreq: 280,
      returnGain: 0.08,
      returnDuration: 0.03,
    },
  },
  blue: {
    press: {
      thockFreq: 200,
      thockGain: 0.25,
      thockDuration: 0.05,
      clickFreq: 4200,
      clickGain: 0.35,
      clickDuration: 0.015,
      noiseGain: 0.12,
      noiseDuration: 0.04,
      noiseFilterFreq: 3500,
      noiseFilterQ: 3.0,
      returnFreq: 3500,
      returnGain: 0.18,
      returnDuration: 0.012,
    },
  },
  brown: {
    press: {
      thockFreq: 190,
      thockGain: 0.25,
      thockDuration: 0.05,
      clickFreq: 1200,
      clickGain: 0.1,
      clickDuration: 0.02,
      noiseGain: 0.12,
      noiseDuration: 0.04,
      noiseFilterFreq: 1500,
      noiseFilterQ: 1.5,
      returnFreq: 350,
      returnGain: 0.06,
      returnDuration: 0.025,
    },
  },
  black: {
    press: {
      thockFreq: 130,
      thockGain: 0.35,
      thockDuration: 0.07,
      noiseGain: 0.18,
      noiseDuration: 0.06,
      noiseFilterFreq: 800,
      noiseFilterQ: 1.0,
      returnFreq: 200,
      returnGain: 0.1,
      returnDuration: 0.04,
    },
  },
  silver: {
    press: {
      thockFreq: 220,
      thockGain: 0.25,
      thockDuration: 0.04,
      noiseGain: 0.12,
      noiseDuration: 0.035,
      noiseFilterFreq: 1400,
      noiseFilterQ: 1.3,
      returnFreq: 320,
      returnGain: 0.06,
      returnDuration: 0.025,
    },
  },
  green: {
    press: {
      thockFreq: 160,
      thockGain: 0.3,
      thockDuration: 0.06,
      clickFreq: 3800,
      clickGain: 0.4,
      clickDuration: 0.018,
      noiseGain: 0.15,
      noiseDuration: 0.05,
      noiseFilterFreq: 3000,
      noiseFilterQ: 2.5,
      returnFreq: 3200,
      returnGain: 0.2,
      returnDuration: 0.015,
    },
  },
};

function playThock(ctx: AudioContext, profile: SoundProfile['press'], time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(profile.thockFreq * 1.3, time);
  osc.frequency.exponentialRampToValueAtTime(profile.thockFreq, time + profile.thockDuration * 0.3);

  gain.gain.setValueAtTime(profile.thockGain, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + profile.thockDuration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + profile.thockDuration + 0.01);
}

function playClick(ctx: AudioContext, profile: SoundProfile['press'], time: number) {
  if (profile.clickFreq === undefined || profile.clickGain === undefined || profile.clickDuration === undefined) {
    return;
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(profile.clickFreq, time);
  osc.frequency.exponentialRampToValueAtTime(profile.clickFreq * 0.6, time + profile.clickDuration);

  gain.gain.setValueAtTime(profile.clickGain, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + profile.clickDuration);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(profile.clickFreq, time);
  filter.Q.setValueAtTime(2.0, time);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + profile.clickDuration + 0.01);
}

function playNoise(ctx: AudioContext, profile: SoundProfile['press'], time: number) {
  const noiseBuffer = createNoiseBuffer(ctx, profile.noiseDuration + 0.02);
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(profile.noiseFilterFreq, time);
  filter.Q.setValueAtTime(profile.noiseFilterQ, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(profile.noiseGain, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.001, time + profile.noiseDuration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(time);
  source.stop(time + profile.noiseDuration + 0.02);
}

function playReturn(ctx: AudioContext, profile: SoundProfile['press'], time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(profile.returnFreq * 1.2, time);
  osc.frequency.exponentialRampToValueAtTime(profile.returnFreq, time + profile.returnDuration * 0.5);

  gain.gain.setValueAtTime(profile.returnGain, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + profile.returnDuration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + profile.returnDuration + 0.01);
}

export function playPressSound(switchType: SwitchType) {
  const ctx = getAudioContext();
  const profile = SOUND_PROFILES[switchType].press;
  const now = ctx.currentTime;

  playThock(ctx, profile, now);
  playClick(ctx, profile, now);
  playNoise(ctx, profile, now);
}

export function playReleaseSound(switchType: SwitchType) {
  const ctx = getAudioContext();
  const profile = SOUND_PROFILES[switchType].press;
  const now = ctx.currentTime;

  playReturn(ctx, profile, now);

  const noiseBuffer = createNoiseBuffer(ctx, profile.returnDuration + 0.01);
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(profile.noiseFilterFreq * 0.5, now);
  filter.Q.setValueAtTime(0.8, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(profile.returnGain * 0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + profile.returnDuration * 0.8);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(now);
  source.stop(now + profile.returnDuration + 0.01);
}
