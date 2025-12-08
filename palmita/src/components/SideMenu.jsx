import { Map, Award, Smile, User, LogOut, Volume2 } from "lucide-react"; 
import audio from '../utils/audio';

// NOTA: Ya no importamos AudioControls porque ahora es una página normal
export default function SideMenu({ menuAbierto, setMenuAbierto, setVistaActual, vistaActual, menuAmpliado }) {
  
  const menuItems = [
    { name: "Mi Aventura", icon: Map, id: "mapa" },       
    { name: "Mis Trofeos", icon: Award, id: "logros" },   
    { name: "Mi Palmita", icon: Smile, id: "mascota" },   
    { name: "Mi Perfil", icon: User, id: "perfil" },
    // Ahora Audio es una opción más de la lista:
    { name: "Audio", icon: Volume2, id: "audio" },      
  ];

  const navegar = (idPagina) => {
    audio.playSfx('click');
    setVistaActual(idPagina);
    if (window.innerWidth <= 768) setMenuAbierto(false);
  };

  return (
    <nav className={`menu-lateral ${menuAbierto ? 'abierto' : ''} ${!menuAmpliado ? 'contraido' : ''}`}>
      <ul>
        <li className="titulo-menu" style={{ 
            opacity: 0.6, 
            paddingBottom: '10px', 
            textAlign: menuAmpliado ? 'left' : 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1px'
        }}>
          MENÚ
        </li>

        {menuItems.map((item) => (
          <li 
            key={item.id} 
            className={vistaActual === item.id ? "activo" : ""} 
            onClick={() => navegar(item.id)}
            title={!menuAmpliado ? item.name : ''} 
          >
            <item.icon size={32} strokeWidth={2.5} /> 
            
            {menuAmpliado && <span className="texto-menu">{item.name}</span>}
          </li>
        ))}

        {/* El botón de Salir lo dejamos abajo separado */}
        <li style={{ marginTop: 'auto', color: '#ff4b4b' }} onClick={() => window.location.reload()}>
            <LogOut size={28} />
            {menuAmpliado && <span className="texto-menu">Salir</span>}
        </li>
      </ul>
    </nav>
  );
}