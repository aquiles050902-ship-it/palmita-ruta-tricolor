// fileName: UserProfile.jsx
import { User, Shield } from "lucide-react";

export default function UserProfile({ usuario }) {
  // Aseguramos valores por defecto si 'usuario' no existe o sus propiedades no están definidas
  const racha = usuario ? usuario.racha || 0 : 0;
  const gemas = usuario ? usuario.gemas || 0 : 0;
  const liga = usuario ? usuario.liga || "Bronce" : "Bronce"; // Suponiendo una propiedad 'liga'

  const colorAvatar = usuario?.genero === 'niña' ? '#ff69b4' : '#1e90ff';

  return (
    <div className="pantalla-interior">
      <h2 className="titulo-seccion">👤 Mi Perfil</h2>
      
      <div className="perfil-card">
        <div className="avatar-grande" style={{ borderColor: colorAvatar, boxShadow: `0 0 0 3px ${colorAvatar}33 inset` }}>
          <User size={60} color={colorAvatar} />
        </div>
        <h2>{usuario ? usuario.nombre : "Estudiante Invitado"}</h2>
        <p className="email-usuario">{usuario ? usuario.email : "Sin registro"}</p>
        
        <div className="stats-perfil">
          <div className="stat-item">
            <span>🔥</span>
            <strong>{racha}</strong> 
            <small>Racha</small>
          </div>
          <div className="stat-item">
            <span>💎</span>
            <strong>{gemas}</strong>
            <small>Gemas</small>
          </div>
          <div className="stat-item">
            <span>🛡️</span>
            <strong>{liga}</strong>
            <small>Liga</small>
          </div>
        </div>
      </div>
    </div>
  );
}