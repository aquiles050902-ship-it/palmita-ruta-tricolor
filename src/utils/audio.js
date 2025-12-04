// src/utils/audio.js

const MUSIC_KEY = 'palmita_music_enabled';
const SFX_KEY = 'palmita_sfx_enabled';
const MUSIC_VOL_KEY = 'palmita_music_vol';
const SFX_VOL_KEY = 'palmita_sfx_vol';

function getBool(key, def = true) {
  const v = localStorage.getItem(key);
  return v === null ? def : v === 'true';
}
function getNum(key, def) {
  const v = localStorage.getItem(key);
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

class AudioManager {
  constructor() {
    this.musicEnabled = getBool(MUSIC_KEY, true);
    this.sfxEnabled = getBool(SFX_KEY, true);
    this.musicVolume = getNum(MUSIC_VOL_KEY, 0.2); 
    this.sfxVolume = getNum(SFX_VOL_KEY, 0.5);

    this.ctx = null;      
    this.musicInterval = null; 
    this.isPlayingMusic = false;
  }

  // Inicializa el sistema de audio con el primer clic
  initOnUserGesture() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.musicEnabled && !this.isPlayingMusic) {
      this.playMusic();
    }
  }

  // --- MÚSICA (Melodía generada) ---
  playMusic() {
    if (!this.musicEnabled || !this.ctx) return;
    if (this.isPlayingMusic) return;

    this.isPlayingMusic = true;
    this.startMelody();
  }

  pauseMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) clearInterval(this.musicInterval);
  }

  startMelody() {
    let noteIndex = 0;
    // Notas simples (Do, Mi, Sol...)
    const notes = [261.6, 329.6, 392.0, 523.2, 392.0, 329.6]; 
    
    const playNote = () => {
        if (!this.isPlayingMusic || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine'; 
        osc.frequency.setValueAtTime(notes[noteIndex % notes.length], this.ctx.currentTime);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        // Volumen de la música
        gain.gain.value = this.musicVolume * 0.1; 
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
        
        noteIndex++;
    };

    playNote();
    this.musicInterval = setInterval(playNote, 500); // Velocidad
  }

  toggleMusic() {
    this.setMusicEnabled(!this.musicEnabled);
  }

  setMusicEnabled(v) {
    this.musicEnabled = v;
    localStorage.setItem(MUSIC_KEY, String(v));
    if (v) this.playMusic(); else this.pauseMusic();
  }

  setMusicVolume(v) {
    this.musicVolume = Math.max(0, Math.min(1, v));
    localStorage.setItem(MUSIC_VOL_KEY, String(this.musicVolume));
  }

  // --- EFECTOS DE SONIDO (SFX) ---
  playSfx(name) {
    if (!this.sfxEnabled || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    
    // Configuramos el sonido según el nombre
    if (name === 'click' || name === 'click_menu') {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
        osc.start(now);
        osc.stop(now + 0.1);
    } 
    else if (name === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
        osc.start(now);
        osc.stop(now + 0.3);
    } 
    else if (name === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
        osc.start(now);
        osc.stop(now + 0.2);
    }
  }

  setSfxEnabled(v) {
    this.sfxEnabled = v;
    localStorage.setItem(SFX_KEY, String(v));
  }

  setSfxVolume(v) {
    this.sfxVolume = Math.max(0, Math.min(1, v));
    localStorage.setItem(SFX_VOL_KEY, String(this.sfxVolume));
  }
}

const audio = new AudioManager();
export default audio;