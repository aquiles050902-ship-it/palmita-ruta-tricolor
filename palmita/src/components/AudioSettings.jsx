import { useState } from 'react';
import { Volume2, VolumeX, Music, Mic } from 'lucide-react';
import audio from '../utils/audio';

export default function AudioSettings() {
  // Leemos el estado inicial del audio
  const [musicEnabled, setMusicEnabled] = useState(audio.musicEnabled);
  const [sfxEnabled, setSfxEnabled] = useState(audio.sfxEnabled);
  const [musicVol, setMusicVol] = useState(audio.musicVolume * 100); // Usamos escala 0-100 para visual
  const [sfxVol, setSfxVol] = useState(audio.sfxVolume * 100);

  const toggleMusic = () => {
    const nuevoEstado = !musicEnabled;
    setMusicEnabled(nuevoEstado);
    audio.setMusicEnabled(nuevoEstado);
  };

  const toggleSfx = () => {
    const nuevoEstado = !sfxEnabled;
    setSfxEnabled(nuevoEstado);
    audio.setSfxEnabled(nuevoEstado);
    if (nuevoEstado) audio.playSfx('click');
  };

  const handleMusicVol = (e) => {
    const val = Number(e.target.value);
    setMusicVol(val);
    audio.setMusicVolume(val / 100);
  };

  const handleSfxVol = (e) => {
    const val = Number(e.target.value);
    setSfxVol(val);
    audio.setSfxVolume(val / 100);
    if (!sfxEnabled && val > 0) {
        setSfxEnabled(true);
        audio.setSfxEnabled(true);
    }
  };

  return (
    <div className="pantalla-interior">
      <h2 className="titulo-seccion">🔊 Configuración de Sonido</h2>
      
      <div className="perfil-card" style={{ maxWidth: '500px' }}>
        
        {/* === SECCIÓN MÚSICA === */}
        <div className="setting-row">
          <div className="setting-icon" style={{ background: musicEnabled ? '#58cc02' : '#e5e5e5' }}>
            <Music size={28} color="white" />
          </div>
          <div className="setting-info">
            <h3>Música de Fondo</h3>
            <p>{musicEnabled ? 'Activada' : 'Silenciada'}</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={musicEnabled} onChange={toggleMusic} />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Slider Música */}
        <div className="range-container">
            <input 
                type="range" 
                min="0" max="100" 
                value={musicVol} 
                onChange={handleMusicVol} 
                disabled={!musicEnabled}
                className="big-range"
            />
        </div>

        <div className="divider"></div>

        {/* === SECCIÓN EFECTOS === */}
        <div className="setting-row">
          <div className="setting-icon" style={{ background: sfxEnabled ? '#00C2CB' : '#e5e5e5' }}>
            {sfxEnabled ? <Volume2 size={28} color="white" /> : <VolumeX size={28} color="white" />}
          </div>
          <div className="setting-info">
            <h3>Efectos de Sonido</h3>
            <p>{sfxEnabled ? 'Activados' : 'Silenciados'}</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={sfxEnabled} onChange={toggleSfx} />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Slider SFX */}
        <div className="range-container">
            <input 
                type="range" 
                min="0" max="100" 
                value={sfxVol} 
                onChange={handleSfxVol} 
                disabled={!sfxEnabled}
                className="big-range"
            />
        </div>

      </div>
    </div>
  );
}