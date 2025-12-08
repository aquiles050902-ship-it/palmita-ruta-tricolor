import { User, Shield, Star } from "lucide-react";

export default function UserProfile({ usuario }) {
  // Aseguramos valores por defecto
  const racha = usuario ? usuario.racha || 0 : 0;
  const gemas = usuario ? usuario.gemas || 0 : 0;
  
  // Calculamos cuántos niveles ha pasado
  const nivelesCompletados = usuario && usuario.progresoNiveles ? usuario.progresoNiveles.length : 0;

  // --- LÓGICA DE LIGAS ---
  const obtenerLiga = (cantidad) => {
    if (cantidad >= 9) return { nombre: "Diamante", color: "#00C2CB", sombra: "#008a91" }; // Cyan
    if (cantidad >= 6) return { nombre: "Oro",     color: "#FFD700", sombra: "#B8860B" }; // Dorado
    if (cantidad >= 3) return { nombre: "Plata",   color: "#C0C0C0", sombra: "#7F8C8D" }; // Plateado
    return { nombre: "Bronce",  color: "#CD7F32", sombra: "#8D5524" }; // Bronce
  };

  const infoLiga = obtenerLiga(nivelesCompletados);
  const colorAvatar = usuario?.genero === 'niña' ? '#ff69b4' : '#1e90ff';

  // Calculamos cuánto falta para la siguiente liga
  let siguienteMeta = 0;
  let mensajeProgreso = "";
  
  if (infoLiga.nombre === "Bronce") {
      siguienteMeta = 3;
      mensajeProgreso = `Faltan ${siguienteMeta - nivelesCompletados} niveles para Plata`;
  } else if (infoLiga.nombre === "Plata") {
      siguienteMeta = 6;
      mensajeProgreso = `Faltan ${siguienteMeta - nivelesCompletados} niveles para Oro`;
  } else if (infoLiga.nombre === "Oro") {
      siguienteMeta = 9;
      mensajeProgreso = `Faltan ${siguienteMeta - nivelesCompletados} niveles para Diamante`;
  } else {
      mensajeProgreso = "¡Eres una leyenda!";
  }

  return (
    <div className="pantalla-interior">
      <h2 className="titulo-seccion">👤 Mi Perfil</h2>
      
      <div className="perfil-card">
        {/* Avatar */}
        <div className="avatar-grande" style={{ 
            borderColor: colorAvatar, 
            boxShadow: `0 0 0 4px ${colorAvatar}33` 
        }}>
          <User size={60} color={colorAvatar} />
        </div>
        
        <h2>{usuario ? usuario.nombre : "Estudiante Invitado"}</h2>
        <p className="email-usuario">{usuario ? usuario.email : "Sin registro"}</p>
        
        {/* Estadísticas */}
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
            <span>🏆</span>
            <strong>{nivelesCompletados}</strong>
            <small>Niveles</small>
          </div>
        </div>

        {/* TARJETA DE LIGA */}
        <div style={{ 
            marginTop: '25px', 
            background: `linear-gradient(135deg, ${infoLiga.color}22, transparent)`,
            border: `2px solid ${infoLiga.color}`,
            borderRadius: '16px',
            padding: '15px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '5px' }}>
                <Shield size={32} fill={infoLiga.color} color={infoLiga.sombra} />
                <h3 style={{ margin: 0, color: infoLiga.sombra, textTransform: 'uppercase' }}>
                    Liga {infoLiga.nombre}
                </h3>
            </div>
            
            <p style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>
                {mensajeProgreso}
            </p>

            {/* Barra de progreso de liga */}
            {infoLiga.nombre !== "Diamante" && (
                <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '10px', marginTop: '10px', overflow: 'hidden' }}>
                    <div style={{ 
                        height: '100%', 
                        width: `${(nivelesCompletados / siguienteMeta) * 100}%`, 
                        background: infoLiga.color,
                        borderRadius: '10px',
                        transition: 'width 0.5s ease'
                    }}></div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}