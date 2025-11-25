import { motion } from "framer-motion";
import { Flame, Gem, Menu as MenuIcon, ChevronsLeft, ChevronsRight } from "lucide-react";
import PalmitaMascot from "./PalmitaMascot"; 

export default function HeaderBar({ setMenuAbierto, setMenuAmpliado, menuAmpliado }) {
  return (
    <header className="barra-superior">
      <div className="izquierda">
        {/* NUEVO: Botón de Contraer/Expandir la Barra Lateral */}
        <motion.div 
          whileHover={{ scale: 1.2 }} 
          className="menu-boton" 
          onClick={() => setMenuAmpliado((v) => !v)}
          role="button"
          aria-label={menuAmpliado ? "Contraer menú" : "Expandir menú"}
        >
          {/* Mostramos el icono de cerrar si está ampliado, o de abrir si está contraído */}
          {menuAmpliado ? <ChevronsLeft size={32} /> : <ChevronsRight size={32} />}
        </motion.div>
        
        {/* Logo Animado */}
        <div style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginLeft: '10px', marginRight: '5px' }}>
          <PalmitaMascot width={90} /> 
        </div>
        
        <h1 className="logo">Palmita</h1>
      </div>

      <div className="derecha">
        <div className="gemas">
          <Gem className="icono-gema" size={28} />
          <span>500</span>
        </div>
        <div className="corazones">
          <span role="img" aria-label="Vidas">❤</span> 
          <span className="numero-corazones">5</span>
        </div>
        <div className="racha">
          <Flame className="llama" size={32} />
          <span className="numero-racha">3</span>
        </div>
      </div>
    </header>
  );
}