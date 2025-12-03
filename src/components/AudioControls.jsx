import { useEffect, useRef, useState } from 'react';
import { Music2, Volume2, VolumeX } from 'lucide-react';
import audio from '../utils/audio';

export default function AudioControls({ inline = false }) {
  const [open, setOpen] = useState(false);
  const [music, setMusic] = useState(audio.musicEnabled);
  const [sfx, setSfx] = useState(audio.sfxEnabled);
  const [musicVol, setMusicVol] = useState(audio.musicVolume);
  const [sfxVol, setSfxVol] = useState(audio.sfxVolume);
  const popRef = useRef(null);

  useEffect(() => {
    audio.initOnUserGesture();
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (popRef.current && !popRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onDocClick);
    return () => document.removeEventListener('pointerdown', onDocClick);
  }, [open]);

  const toggleMusic = () => {
    const v = !music;
    setMusic(v);
    audio.setMusicEnabled(v);
  };
  const toggleSfx = () => {
    const v = !sfx;
    setSfx(v);
    audio.setSfxEnabled(v);
    if (v) audio.playSfx('click');
  };

  return (
    <div className={inline ? 'audio-controls-inline' : 'audio-controls-float'}>
      <button
        className={inline ? 'audio-fab-inline' : 'audio-fab'}
        aria-label="Controles de audio"
        title="Controles de audio"
        onClick={() => setOpen((o) => !o)}
      >
        <Music2 size={18} />
        {inline && <span style={{ marginLeft: 8, fontWeight: 700 }}>Audio</span>}
      </button>

      {open && (
        <div className={inline ? 'audio-popover-inline' : 'audio-popover'} ref={popRef} role="dialog" aria-label="Panel de audio">
          <div className="audio-row">
            <span className={`pill ${music ? 'on' : 'off'}`} onClick={toggleMusic} role="button" tabIndex={0}
              onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); toggleMusic(); } }}>
              Música: {music ? 'ON' : 'OFF'}
            </span>
            <input
              className="audio-range"
              type="range"
              min="0" max="1" step="0.05"
              value={musicVol}
              onChange={(e)=>{ const v = Number(e.target.value); setMusicVol(v); audio.setMusicVolume(v); }}
            />
          </div>
          <div className="audio-row">
            <span className={`pill ${sfx ? 'on' : 'off'}`} onClick={toggleSfx} role="button" tabIndex={0}
              onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); toggleSfx(); } }}>
              SFX: {sfx ? 'ON' : 'OFF'}
            </span>
            <input
              className="audio-range"
              type="range"
              min="0" max="1" step="0.05"
              value={sfxVol}
              onChange={(e)=>{ const v = Number(e.target.value); setSfxVol(v); audio.setSfxVolume(v); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
