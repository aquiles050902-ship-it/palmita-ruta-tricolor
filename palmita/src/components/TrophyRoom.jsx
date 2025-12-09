import { Award, Lock, Star, Zap, Hexagon, Code, Database, Globe, Cpu, Hash, Medal, Crown } from "lucide-react";

export default function TrophyRoom({ usuario }) {
  
  // AHORA: Obtenemos los IDs ÚNICOS de desafíos que ha pasado el usuario (ej: ["1-1", "1-2", "5-3"])
  const desafiosCompletados = usuario?.progresoNiveles || [];

  // Configuración de los 20 Niveles Principales (Temas)
  const temasNiveles = {
    1: { nombre: "Algoritmos", color: "#FFD700", icon: Award },
    2: { nombre: "Instrucciones", color: "#C0C0C0", icon: Globe },
    3: { nombre: "Patrones", color: "#CD7F32", icon: Hash },
    4: { nombre: "Debugging", color: "#58cc02", icon: Zap },
    5: { nombre: "Eventos", color: "#FF9600", icon: Star },
    6: { nombre: "Condicionales", color: "#00C2CB", icon: Hexagon },
    7: { nombre: "Bucles", color: "#ce82ff", icon: RefreshCwIcon },
    8: { nombre: "Datos", color: "#ff4b4b", icon: Database },
    9: { nombre: "Lógica", color: "#1cb0f6", icon: Code },
    10: { nombre: "Conceptos", color: "#8B4513", icon: Medal },
    11: { nombre: "Anidados", color: "#2b7489", icon: RefreshCwIcon },
    12: { nombre: "Variables", color: "#e67e22", icon: BoxIcon },
    13: { nombre: "Op. Lógicos", color: "#8e44ad", icon: Hexagon },
    14: { nombre: "Funciones", color: "#27ae60", icon: Code },
    15: { nombre: "Eventos Pro", color: "#c0392b", icon: Zap },
    16: { nombre: "Coordenadas", color: "#2980b9", icon: Globe },
    17: { nombre: "Arrays", color: "#f1c40f", icon: Database },
    18: { nombre: "Búsqueda", color: "#16a085", icon: Star },
    19: { nombre: "Binario", color: "#2c3e50", icon: Hash },
    20: { nombre: "MASTER", color: "linear-gradient(45deg, #FFD700, #ff0000)", icon: Crown },
  };

  // Generamos dinámicamente los 100 trofeos (20 niveles * 5 variantes)
  const generarTrofeos = () => {
    let listaTrofeos = [];
    
    // Recorremos los 20 niveles
    for (let nivel = 1; nivel <= 20; nivel++) {
      const tema = temasNiveles[nivel];
      
      // Creamos 5 trofeos por cada nivel
      for (let variante = 1; variante <= 5; variante++) {
        listaTrofeos.push({
          id_unico: `${nivel}-${variante}`, // ID único para react key: "1-1", "1-2", etc.
          nivel_asociado: nivel,            
          nombre: `${tema.nombre} ${variante}`,
          desc: `Desafío ${nivel}.${variante}`,
          color: tema.color,
          icon: tema.icon
        });
      }
    }
    return listaTrofeos;
  };

  const trofeos = generarTrofeos();
  const totalDesafiosCompletados = desafiosCompletados.length;

  return (
    <div className="pantalla-interior">
      <h2 className="titulo-seccion">🏆 Sala de Trofeos (100)</h2>
      
      {/* Barra de Progreso Global */}
      <div style={{ width: '90%', maxWidth: '600px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', color: '#aaa' }}>
            <span>Progreso Total</span>
            <span>{totalDesafiosCompletados} / 100</span>
        </div>
        <div style={{ width: '100%', height: '12px', background: '#333', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ 
                width: `${(totalDesafiosCompletados / 100) * 100}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #58cc02, #00C2CB)',
                transition: 'width 1s ease'
            }}></div>
        </div>
      </div>

      <div className="grid-trofeos" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
        {trofeos.map((t) => {
          // LÓGICA CLAVE: Un trofeo está ganado si su ID ÚNICO está en la lista de desafíos completados
          const ganado = desafiosCompletados.includes(t.id_unico);
          const Icono = t.icon;

          return (
            <div 
              key={t.id_unico} 
              className={`card-trofeo ${ganado ? 'ganado' : 'bloqueado'}`}
              style={{
                  borderColor: ganado ? (t.color.includes('gradient') ? 'gold' : t.color) : '#333',
                  opacity: ganado ? 1 : 0.5,
                  padding: '10px',
                  minHeight: '120px'
              }}
            >
              <div className="icono-trofeo" style={{ marginBottom: '5px' }}>
                {ganado ? (
                  <Icono 
                    size={32} 
                    style={{ 
                      color: t.color.includes('gradient') ? 'white' : t.color,
                      filter: "drop-shadow(0 0 5px rgba(255,255,255,0.3))"
                    }} 
                  />
                ) : (
                  <Lock size={24} color="#444" />
                )}
              </div>
              
              <h3 style={{ 
                  fontSize: '11px', 
                  margin: '5px 0', 
                  color: ganado ? 'white' : '#666',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
              }}>
                {t.nombre}
              </h3>
              
              <p style={{ fontSize: '9px', color: '#666' }}>
                {t.desc}
              </p>

              {/* Efecto de brillo solo para los ganados */}
              {ganado && <div className="brillo-trofeo" style={{ animationDuration: '4s' }}></div>}
            </div>
          );
        })}
      </div>
      <div style={{ height: '80px' }}></div>
    </div>
  );
}

// Iconos SVG simples para complementar
function BoxIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>; }
function RefreshCwIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>; }