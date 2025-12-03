// Simple audio manager for background music and SFX
// Usage:
// import audio from '../utils/audio';
// audio.initOnUserGesture(); // call once after first user interaction
// audio.playMusic(); audio.pauseMusic(); audio.toggleMusic();
// audio.playSfx('click'|'success'|'error');

const MUSIC_KEY = 'palmita_music_enabled';
const SFX_KEY = 'palmita_sfx_enabled';
const MUSIC_VOL_KEY = 'palmita_music_vol';
const SFX_VOL_KEY = 'palmita_sfx_vol';

const sounds = {
  music: '/sounds/bg-ambient.mp3',
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
};

function getBool(key, def = true) {
  const v = localStorage.getItem(key);
  if (v === null) return def;
  return v === 'true';
}
function getNum(key, def) {
  const v = localStorage.getItem(key);
  if (v === null) return def;
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

class AudioManager {
  constructor() {
    this.musicEnabled = getBool(MUSIC_KEY, true);
    this.sfxEnabled = getBool(SFX_KEY, true);
    this.musicVolume = getNum(MUSIC_VOL_KEY, 0.2);
    this.sfxVolume = getNum(SFX_VOL_KEY, 0.35);

    this.musicEl = new Audio(sounds.music);
    this.musicEl.loop = true;
    this.musicEl.volume = this.musicVolume;
    this._initialized = false;

    this.ctx = null; // optional WebAudioContext for future advanced use
  }

  initOnUserGesture() {
    if (this._initialized) return;
    const onFirst = () => {
      this._initialized = true;
      document.removeEventListener('pointerdown', onFirst);
      document.removeEventListener('keydown', onFirst);
      // Attempt to start music if enabled
      if (this.musicEnabled) {
        this.playMusic();
      }
    };
    document.addEventListener('pointerdown', onFirst, { once: true });
    document.addEventListener('keydown', onFirst, { once: true });
  }

  setMusicEnabled(v) {
    this.musicEnabled = v;
    localStorage.setItem(MUSIC_KEY, String(v));
    if (v) this.playMusic(); else this.pauseMusic();
  }
  setSfxEnabled(v) {
    this.sfxEnabled = v;
    localStorage.setItem(SFX_KEY, String(v));
  }
  setMusicVolume(v) {
    this.musicVolume = Math.max(0, Math.min(1, v));
    localStorage.setItem(MUSIC_VOL_KEY, String(this.musicVolume));
    this.musicEl.volume = this.musicVolume;
  }
  setSfxVolume(v) {
    this.sfxVolume = Math.max(0, Math.min(1, v));
    localStorage.setItem(SFX_VOL_KEY, String(this.sfxVolume));
  }

  playMusic() {
    try {
      this.musicEl.currentTime = this.musicEl.currentTime || 0;
      this.musicEl.play().catch(() => {/* ignore autoplay block until init */});
    } catch {}
  }
  pauseMusic() {
    try { this.musicEl.pause(); } catch {}
  }
  toggleMusic() {
    this.setMusicEnabled(!this.musicEnabled);
  }

  playSfx(name) {
    if (!this.sfxEnabled) return;
    const src = sounds[name];
    if (!src) return;
    try {
      const el = new Audio(src);
      el.volume = this.sfxVolume;
      el.play().catch(() => {});
    } catch {}
  }
}

const audio = new AudioManager();
export default audio;
