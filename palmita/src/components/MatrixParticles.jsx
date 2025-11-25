import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MatrixParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generamos 30 partículas con valores aleatorios
    const tempParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // Posición horizontal (0% a 100%)
      delay: Math.random() * 5, // Retraso inicial
      duration: Math.random() * 10 + 5, // Duración (velocidad) entre 5 y 15s
      size: Math.random() * 6 + 2, // Tamaño entre 2px y 8px
      opacity: Math.random() * 0.5 + 0.1 // Opacidad variable
    }));
    setParticles(tempParticles);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none', // IMPORTANTE: Para que no bloquee los clics
      zIndex: 0 // Detrás de todo
    }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: '-20px', // Empiezan justo debajo de la pantalla
            width: p.size,
            height: p.size,
            backgroundColor: '#58cc02', // Verde Duolingo
            borderRadius: '2px', // Cuadrados ligeramente redondeados (estilo pixel/código)
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px #58cc02` // Pequeño brillo neón
          }}
          animate={{
            y: [0, -window.innerHeight - 100], // Suben hasta salir por arriba
            opacity: [0, p.opacity, 0], // Aparecen y desaparecen
            rotate: [0, 180] // Giran un poco
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}