import { Map, Award, Smile, User, LogOut } from "lucide-react"; 
import audio from '../utils/audio';
import AudioControls from './AudioControls';

export default function SideMenu({ menuAbierto, setMenuAbierto, setVistaActual, vistaActual, menuAmpliado }) {
  
  const menuItems = [
    { name: "Mi Aventura", icon: Map, id: "mapa" },       
    { name: "Mis Trofeos", icon: Award, id: "logros" },   
    { name: "Mi Palmita", icon: Smile, id: "mascota" },   
    { name: "Mi Perfil", icon: User, id: "perfil" },      
  ];

  const navegar = (idPagina) => {
    audio.playSfx('click');
    setVistaActual(idPagina);
    if (window.innerWidth <= 768) setMenuAbierto(false);
  };

  return (
    <nav className={`menu-lateral ${menuAbierto ? 'abierto' : ''} ${!menuAmpliado ? 'contraido' : ''}`}>
      <ul>
        {/* CORRECCIÓN AQUÍ: Quitamos el punto y dejamos la palabra MENÚ siempre */}
        <li className="titulo-menu" style={{ 
            opacity: 0.6, 
            paddingBottom: '10px', 
            // Si está ampliado a la izquierda, si está cerrado centrado
            textAlign: menuAmpliado ? 'left' : 'center',
            // Ajustamos el tamaño para que se vea bien en ambos modos
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

        {/* Controles de Audio integrados en el menú */}
        <li style={{ marginTop: 'auto' }}>
          <AudioControls inline={true} />
        </li>

        <li style={{ color: '#ff4b4b' }} onClick={() => window.location.reload()}>
            <LogOut size={28} />
            {menuAmpliado && <span className="texto-menu">Salir</span>}
        </li>
      </ul>
    </nav>
  );
}