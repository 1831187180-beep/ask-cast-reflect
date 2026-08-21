/**
 * Audio Synthesizer for Digital Ritual Ambiance
 * Built entirely with Web Audio API (zero external assets needed)
 */

class RitualAudio {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Subtle bronze coin toss chime
   */
  public playCoinSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // High metallic ping with fast exponential decay
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1420 + Math.random() * 180, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.18);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Audio playback silently guarded
    }
  }

  /**
   * Serene single Yao revelation chime (Tibetan singing bowl harmonic)
   */
  public playYaoSound(isYang: boolean, isChanging: boolean) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseFreq = isYang ? 392.0 : 329.63; // G4 or E4

      // Fundamental harmonic
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);

      // Warm subtle overtone
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * (isChanging ? 2.5 : 2.0), now);

      const duration = isChanging ? 1.4 : 0.9;
      const initialVolume = isChanging ? 0.12 : 0.08;

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(initialVolume, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(initialVolume * 0.4, now + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(this.ctx.destination);
      gain2.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Audio safely guarded
    }
  }

  /**
   * Hexagram completion deep resonant bell
   */
  public playHexagramCompleteSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const fundamental = 220; // A3

      [1, 1.5, 2.02, 3.01].forEach((multiplier, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * multiplier, now);

        const peak = 0.08 / (i + 1);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(peak, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch {
      // Audio safely guarded
    }
  }
}

export const ritualAudio = new RitualAudio();
