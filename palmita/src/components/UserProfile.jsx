import { User, Shield } from "lucide-react";

export default function UserProfile({ usuario }) {
  return (
    <div className="pantalla-interior">
      <h2 className="titulo-seccion">👤 Mi Perfil</h2>
      
      <div className="perfil-card">
        <div className="avatar-grande">
          <User size={60} />
        </div>
        <h2>{usuario ? usuario.nombre : "Estudiante Invitado"}</h2>
        <p className="email-usuario">{usuario ? usuario.email : "Sin registro"}</p>
        
        <div className="stats-perfil">
          <div className="stat-item">
            <span>🔥</span>
            <strong>3</strong>
            <small>Racha</small>
          </div>
          <div className="stat-item">
            <span>💎</span>
            <strong>500</strong>
            <small>Gemas</small>
          </div>
          <div className="stat-item">
            <span>🛡️</span>
            <strong>Bronce</strong>
            <small>Liga</small>
          </div>
        </div>
      </div>
    </div>
  );
}