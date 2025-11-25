import { Award, Lock } from "lucide-react";

export default function TrophyRoom() {
  const trofeos = [
    { id: 1, nombre: "Primeros Pasos", desc: "Completa el nivel 1", ganado: true },
    { id: 2, nombre: "Racha de Fuego", desc: "3 días seguidos", ganado: true },
    { id: 3, nombre: "Cerebro Galáctico", desc: "Sin errores en un quiz", ganado: false },
    { id: 4, nombre: "Hacker Junior", desc: "Completa Fundamentos", ganado: false },
  ];

  return (
    <div className="pantalla-interior">
      <h2 className="titulo-seccion">🏆 Mis Trofeos</h2>
      <div className="grid-trofeos">
        {trofeos.map((t) => (
          <div key={t.id} className={`card-trofeo ${t.ganado ? 'ganado' : 'bloqueado'}`}>
            <div className="icono-trofeo">
              {t.ganado ? <Award size={40} color="#FFCC00" /> : <Lock size={32} color="#555" />}
            </div>
            <h3>{t.nombre}</h3>
            <p>{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}