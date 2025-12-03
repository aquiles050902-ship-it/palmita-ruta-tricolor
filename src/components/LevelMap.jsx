import { motion } from "framer-motion";
import { Star, Lock, Play } from "lucide-react";

export default function LevelMap() {
  // Simulamos los niveles de tu base de datos (esto luego vendrá de Firebase)
  const niveles = [
    { id: 1, titulo: "Fundamentos", estado: "completado", pos: "center" },
    { id: 2, titulo: "Secuencias", estado: "actual", pos: "left" },
    { id: 3, titulo: "Patrones", estado: "bloqueado", pos: "center" },
    { id: 4, titulo: "Bucles", estado: "bloqueado", pos: "right" },
    { id: 5, titulo: "Condicionales", estado: "bloqueado", pos: "center" },
  ];

  return (
    <div className="mapa-container">
      <h2 className="titulo-seccion">Ruta de Aprendizaje</h2>
      
      <div className="camino-niveles">
        {niveles.map((nivel, index) => (
          <div 
            key={nivel.id} 
            className={`nivel-wrapper ${nivel.pos}`}
          >
            <motion.div 
              whileHover={nivel.estado !== 'bloqueado' ? { scale: 1.1 } : {}}
              whileTap={nivel.estado !== 'bloqueado' ? { scale: 0.9 } : {}}
              className={`nodo-nivel ${nivel.estado}`}
              onClick={() => console.log(`Entrando al nivel: ${nivel.titulo}`)}
            >
              {/* Ícono según el estado */}
              {nivel.estado === 'completado' && <Star fill="white" size={32} />}
              {nivel.estado === 'actual' && <Play fill="white" size={32} className="icono-play" />}
              {nivel.estado === 'bloqueado' && <Lock size={28} />}
              
              {/* Efecto de corona para el nivel actual */}
              {nivel.estado === 'actual' && (
                <div className="corona-animada" />
              )}
            </motion.div>
            
            <span className="etiqueta-nivel">{nivel.titulo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
