import { motion } from "framer-motion";
import { Flame, Gem, ChevronsLeft, ChevronsRight } from "lucide-react";
import PalmitaMascot from "./PalmitaMascot"; 

export default function HeaderBar({ setMenuAmpliado, menuAmpliado, usuario, playSound, theme, onToggleTheme }) { 
  const gemas = usuario ? usuario.gemas : 0;
  const racha = usuario ? usuario.racha : 0;

  const toggleMenu = () => {
      setMenuAmpliado(!menuAmpliado);
      if(playSound) playSound('click_menu'); 
  }

  return (
    <header className="barra-superior">
      <div className="izquierda">
        <motion.div 
          whileHover={{ scale: 1.1 }} 
          className="menu-boton" 
          onClick={toggleMenu} 
          style={{ cursor: 'pointer', marginRight: '15px' }}
        >
          {menuAmpliado ? <ChevronsLeft size={32} /> : <ChevronsRight size={32} />}
        </motion.div>
        
        <div style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '5px' }}>
           {/* CORRECCIÓN: crecimiento={10} para que el logo llene el espacio */}
           <PalmitaMascot width={50} gafasId={1} crecimiento={10} /> 
        </div>
        
        <h1 className="logo">Palmita</h1>
      </div>

      <div className="derecha">
        <div className="gemas">
          <Gem className="icono-gema" size={28} />
          <span>{gemas}</span>
        </div>
        
        <div className="racha">
          <Flame className="llama" size={32} />
          <span className="numero-racha">{racha}</span>
        </div>
      <button title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`} onClick={onToggleTheme} style={{
          background: 'transparent',
          color: 'inherit',
          border: '1px solid #444',
          padding: '8px 12px',
          borderRadius: '10px',
          cursor: 'pointer'
        }}>
          {theme === 'dark' ? '🌞 Claro' : '🌙 Oscuro'}
        </button>
      </div>
    </header>
  );
}