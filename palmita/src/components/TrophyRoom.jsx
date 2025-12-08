import { Award, Lock } from "lucide-react";

// Recibimos "usuario" como propiedad
export default function TrophyRoom({ usuario }) {
  
  // Obtenemos los niveles que ha pasado el usuario (o array vacío si no hay nadie)
  const nivelesCompletados = usuario?.progresoNiveles || [];

  // Base de datos de Trofeos
  // La propiedad "ganado" ahora se CALCULA dinámicamente
  const trofeos = [
    { id: 1, nombre: "Chef Robot", desc: "Nivel 1: La Receta", color: "#FFD700" },
    { id: 2, nombre: "Explorador", desc: "Nivel 2: Laberinto", color: "#C0C0C0" },
    { id: 3, nombre: "Detective", desc: "Nivel 3: Patrones", color: "#CD7F32" },
    { id: 4, nombre: "Cazador de Bugs", desc: "Nivel 4: Errores", color: "#58cc02" },
    { id: 5, nombre: "Controlador", desc: "Nivel 5: Semáforo", color: "#FF9600" },
    { id: 6, nombre: "Maestro del SI", desc: "Nivel 6: Condicionales", color: "#00C2CB" },
    { id: 7, nombre: "Señor Bucles", desc: "Nivel 7: Repeticiones", color: "#ce82ff" },
    { id: 8, nombre: "Científico", desc: "Nivel 8: Datos", color: "#ff4b4b" },
    { id: 9, nombre: "Genio Lógico", desc: "Nivel 9: Lógica Pura", color: "#1cb0f6" },
    { id: 10, nombre: "Programador PRO", desc: "Nivel 10: Graduado", color: "linear-gradient(45deg, #FFD700, #ff4b4b)" },
  ];

  return (
    <div className="pantalla-interior">
      <h2 className="titulo-seccion">🏆 Sala de Trofeos</h2>
      <p style={{ color: '#aaa', marginBottom: '30px', textAlign: 'center' }}>
        Has desbloqueado {nivelesCompletados.length} de {trofeos.length} medallas.
      </p>

      <div className="grid-trofeos">
        {trofeos.map((t) => {
          // Verificamos si el usuario tiene este ID en su lista de completados
          const ganado = nivelesCompletados.includes(t.id);

          return (
            <div 
              key={t.id} 
              className={`card-trofeo ${ganado ? 'ganado' : 'bloqueado'}`}
              style={ganado ? { borderColor: t.color.includes('gradient') ? 'gold' : t.color } : {}}
            >
              <div className="icono-trofeo">
                {ganado ? (
                  <Award 
                    size={48} 
                    style={{ 
                      color: t.color.includes('gradient') ? 'white' : t.color,
                      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))"
                    }} 
                  />
                ) : (
                  <Lock size={32} color="#555" />
                )}
              </div>
              
              <h3 style={ganado ? { color: 'white' } : { color: '#777' }}>
                {t.nombre}
              </h3>
              
              <p style={{ fontSize: '12px', opacity: 0.7 }}>
                {t.desc}
              </p>

              {ganado && <div className="brillo-trofeo"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}