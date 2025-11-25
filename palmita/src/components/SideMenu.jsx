import { Map, Award, Smile, User, LogOut } from "lucide-react"; 

export default function SideMenu({ menuAbierto, setMenuAbierto, setVistaActual, vistaActual }) {
  
  const menuItems = [
    { name: "Mi Aventura", icon: Map, id: "mapa" },       
    { name: "Mis Trofeos", icon: Award, id: "logros" },   
    { name: "Mi Palmita", icon: Smile, id: "mascota" },   
    { name: "Mi Perfil", icon: User, id: "perfil" },      
  ];

  const navegar = (idPagina) => {
    setVistaActual(idPagina); // Cambia la vista en App.jsx
    if (window.innerWidth <= 768) setMenuAbierto(false); // Cierra menú en móvil
  };

  return (
    <nav className={`menu-lateral ${menuAbierto ? 'abierto' : ''}`}>
      <ul>
        <li className="titulo-menu" style={{ pointerEvents: 'none', fontSize: '14px', textTransform: 'uppercase', opacity: 0.6, paddingBottom: '10px' }}>
          MENÚ
        </li>

        {menuItems.map((item) => (
          <li 
            key={item.id} 
            className={vistaActual === item.id ? "activo" : ""} 
            onClick={() => navegar(item.id)}
          >
            <item.icon size={32} strokeWidth={2.5} /> 
            {item.name}
          </li>
        ))}

        <li style={{ marginTop: 'auto', color: '#ff4b4b' }} onClick={() => window.location.reload()}>
            <LogOut size={28} />
            Salir
        </li>
      </ul>
    </nav>
  );
}