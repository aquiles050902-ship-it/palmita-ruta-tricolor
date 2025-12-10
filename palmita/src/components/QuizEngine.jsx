import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Heart, RefreshCw, Frown, Sparkles } from "lucide-react";
import audio from '../utils/audio';

// === BASE DE DATOS: 20 NIVELES ===
const QUESTIONS_DB = {
  // --- NIVEL 1: ALGORITMOS (SECUENCIAS) ---
  1: [
    { titulo: "Nivel 1: Algoritmos", instruccion: "¿Cuál es el orden para cepillarse?", contenido: "🦷 Dientes Sucios ➡️ ✨ Limpios", opciones: [{ id: "a", text: "Enjuagar -> Secar -> Pasta" }, { id: "b", text: "Pasta -> Cepillar -> Enjuagar" }, { id: "c", text: "Cepillar -> Pasta -> Enjuagar" }, { id: "d", text: "Secar -> Enjuagar -> Pasta" }], correcta: "b" },
    { titulo: "Nivel 1: Algoritmos", instruccion: "Pasos para preparar Cereal:", contenido: "🥣 Tazón Vacio ➡️ 😋 Cereal Listo", opciones: [{ id: "a", text: "Comer -> Leche -> Cereal" }, { id: "b", text: "Cereal -> Leche -> Comer" }, { id: "c", text: "Leche -> Comer -> Cereal" }, { id: "d", text: "Lavar -> Comer -> Servir" }], correcta: "b" },
    { titulo: "Nivel 1: Algoritmos", instruccion: "¿Qué va primero al vestirse?", contenido: "🦶 Pies ➡️ 👟 Zapatos", opciones: [{ id: "a", text: "Zapatos -> Medias" }, { id: "b", text: "Medias -> Zapatos" }, { id: "c", text: "Cordones -> Medias" }, { id: "d", text: "Zapatos -> Cortar uñas" }], correcta: "b" },
    { titulo: "Nivel 1: Algoritmos", instruccion: "Algoritmo para una planta:", contenido: "🌱 Semilla ➡️ 🌻 Flor", opciones: [{ id: "a", text: "Agua -> Esperar -> Sembrar" }, { id: "b", text: "Cosechar -> Sembrar -> Regar" }, { id: "c", text: "Sembrar -> Regar -> Esperar" }, { id: "d", text: "Esperar -> Sembrar -> Regar" }], correcta: "c" },
    { titulo: "Nivel 1: Algoritmos", instruccion: "Lavarse las manos:", contenido: "🦠 Sucias ➡️ ✨ Limpias", opciones: [{ id: "a", text: "Mojar -> Jabón -> Frotar -> Enjuagar" }, { id: "b", text: "Secar -> Mojar -> Jabón" }, { id: "c", text: "Jabón -> Secar -> Mojar" }, { id: "d", text: "Frotar -> Secar -> Mojar" }], correcta: "a" }
  ],
  // --- NIVEL 2: INSTRUCCIONES PRECISAS ---
  2: [
    { titulo: "Nivel 2: Instrucciones", instruccion: "Robot mira al NORTE (⬆️). Meta al ESTE (➡️).", contenido: "🤖 ⬆️ ... 🏁 ➡️", opciones: [{ id: "a", text: "Girar Izquierda" }, { id: "b", text: "Seguir Derecho" }, { id: "c", text: "Girar Derecha" }, { id: "d", text: "Saltar" }], correcta: "c" },
    { titulo: "Nivel 2: Instrucciones", instruccion: "El dron mira al SUR (⬇️). Meta al OESTE (⬅️).", contenido: "🚁 ⬇️ ... 🏁 ⬅️", opciones: [{ id: "a", text: "Girar Derecha" }, { id: "b", text: "Girar Izquierda" }, { id: "c", text: "Subir" }, { id: "d", text: "Retroceder" }], correcta: "a" }, 
    { titulo: "Nivel 2: Instrucciones", instruccion: "Palmita mira a la Derecha (➡️). Quiere ir Arriba (⬆️).", contenido: "🌴 ➡️ ... 🏁 ⬆️", opciones: [{ id: "a", text: "Girar Izquierda" }, { id: "b", text: "Girar Derecha" }, { id: "c", text: "Caminar" }, { id: "d", text: "Agacharse" }], correcta: "a" },
    { titulo: "Nivel 2: Instrucciones", instruccion: "Estás en el piso 1. Quieres ir al piso 3.", contenido: "Elevador: 1️⃣ ... 3️⃣", opciones: [{ id: "a", text: "Presionar 'Bajar'" }, { id: "b", text: "Presionar 'Subir' 2 veces" }, { id: "c", text: "Abrir puerta" }, { id: "d", text: "Saltar" }], correcta: "b" },
    { titulo: "Nivel 2: Instrucciones", instruccion: "El coche va recto. Hay un muro enfrente.", contenido: "🚗 💨 🧱", opciones: [{ id: "a", text: "Acelerar" }, { id: "b", text: "Frenar y Girar" }, { id: "c", text: "Tocar bocina" }, { id: "d", text: "Encender luces" }], correcta: "b" }
  ],
   // --- NIVEL 3: PATRONES ---
  3: [
    { titulo: "Nivel 3: Patrones", instruccion: "Completa la serie:", contenido: "🍎 - 🍌 - 🍎 - 🍌 - ❓", opciones: [{ id: "a", text: "🍎 Manzana" }, { id: "b", text: "🍇 Uva" }, { id: "c", text: "🍌 Banana" }, { id: "d", text: "🍉 Sandía" }], correcta: "a" },
    { titulo: "Nivel 3: Patrones", instruccion: "¿Qué sigue?", contenido: "🔺 🟦 🔺 🟦 ❓", opciones: [{ id: "a", text: "🟢 Círculo" }, { id: "b", text: "🔺 Triángulo" }, { id: "c", text: "🟦 Cuadrado" }, { id: "d", text: "⭐ Estrella" }], correcta: "b" },
    { titulo: "Nivel 3: Patrones", instruccion: "Descubre la regla:", contenido: "1, 2, 1, 2, 1, ❓", opciones: [{ id: "a", text: "1" }, { id: "b", text: "3" }, { id: "c", text: "2" }, { id: "d", text: "0" }], correcta: "c" },
    { titulo: "Nivel 3: Patrones", instruccion: "Patrón de música:", contenido: "🥁 🎸 🥁 🎸 ❓", opciones: [{ id: "a", text: "🎹 Piano" }, { id: "b", text: "🎸 Guitarra" }, { id: "c", text: "🥁 Tambor" }, { id: "d", text: "🎻 Violín" }], correcta: "c" },
    { titulo: "Nivel 3: Patrones", instruccion: "Día y Noche:", contenido: "☀️ 🌙 ☀️ 🌙 ❓", opciones: [{ id: "a", text: "☁️ Nube" }, { id: "b", text: "☀️ Sol" }, { id: "c", text: "🌙 Luna" }, { id: "d", text: "🌧️ Lluvia" }], correcta: "b" }
  ],
};

// === LISTA DE 40 FRASES MOTIVADORAS ===
const FRASES_MOTIVADORAS = [
  "¡Casi lo tienes, inténtalo de nuevo! 🚀", "¡No te rindas, tú puedes! 💪", "¡Los errores nos ayudan a aprender! 🧠",
  "¡Sigue adelante, vas muy bien! 🌟", "¡Un intento más y lo lograrás! 🔥", "¡Confía en ti, eres genial! 🌈",
  "¡Aprender es un superpoder! ⚡", "¡Respira y prueba otra vez! 🍃", "¡El esfuerzo tiene recompensa! 🏆",
  "¡Eres más inteligente de lo que crees! 🤓", "¡Cada error es un paso hacia el éxito! 👣", "¡Lo estás haciendo genial, sigue así! 🎈",
  "¡No pasa nada, vuelve a probar! 👍", "¡Tú eres capaz de cosas increíbles! ✨", "¡La práctica hace al maestro! 🎻",
  "¡Eres un campeón/campeona en proceso! 🏅", "¡Sigue intentando, estás muy cerca! 🎯", "¡Tu cerebro está creciendo! 🌱",
  "¡No dejes que un fallo te detenga! 🛑", "¡Eres valiente por intentarlo! 🦁", "¡Aprender es divertido, sigue jugando! 🎮",
  "¡Hoy es un buen día para aprender algo nuevo! ☀️", "¡Eres una estrella brillante! ⭐", "¡Cree en ti mismo y volarás alto! 🦋",
  "¡Persiste y triunfarás! 🏔️", "¡Tus ideas son importantes! 💡", "¡Eres único y especial! 🦄",
  "¡El éxito es la suma de pequeños esfuerzos! 🧱", "¡Nunca dejes de soñar y aprender! 🌙", "¡Eres fuerte, eres listo/a, eres importante! ❤️",
  "¡Vamos, tú puedes resolverlo! 🧩", "¡Mira qué lejos has llegado! 🔭", "¡Sigue tu curiosidad! 🔍",
  "¡Eres un explorador del conocimiento! 🗺️", "¡Inténtalo una vez más con fuerza! 💥", "¡No hay problema sin solución! 🗝️",
  "¡Eres un genio en potencia! 🧞", "¡Sigue brillando, no te apagues! 🕯️", "¡El camino al éxito está lleno de intentos! 🛤️",
  "¡Lo importante es no dejar de intentar! 🔄"
];

export default function QuizEngine({ alCerrar, alCompletar, alPerder, nivelId = 1, desafiosCompletados = [] }) {
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [quizIdActual, setQuizIdActual] = useState(null); 
  const [fraseMotivacional, setFraseMotivacional] = useState(""); 
  
  // NUEVO: Métricas de la sesión actual
  const [metricas, setMetricas] = useState({ aciertos: 0, fallos: 0 });
  
  const seleccionarNuevoQuiz = (targetNivelId, completados) => {
    const pool = QUESTIONS_DB[targetNivelId] || QUESTIONS_DB[1];
    if (!pool) return; 

    const variantesDisponibles = pool
      .map((_, index) => index)
      .filter(index => !completados.includes(`${targetNivelId}-${index + 1}`));

    let selectedIndex;
    if (variantesDisponibles.length > 0) {
      const randomAvailableIndex = Math.floor(Math.random() * variantesDisponibles.length);
      selectedIndex = variantesDisponibles[randomAvailableIndex];
    } else {
      selectedIndex = Math.floor(Math.random() * pool.length);
    }
    
    const varianteIndex = selectedIndex + 1;
    const nuevoQuizId = `${targetNivelId}-${varianteIndex}`;
    
    setPreguntaActual(pool[selectedIndex]);
    setQuizIdActual(nuevoQuizId);
  };
  
  useEffect(() => {
    seleccionarNuevoQuiz(nivelId, desafiosCompletados);
    setSeleccion(null);
    setEstado("pendiente");
    setVidas(3);
    setMetricas({ aciertos: 0, fallos: 0 }); // Reiniciar métricas
  }, [nivelId, desafiosCompletados.length]);

  const [seleccion, setSeleccion] = useState(null);
  const [estado, setEstado] = useState("pendiente"); 
  const [vidas, setVidas] = useState(3); 

  const generarFrase = () => {
    const indice = Math.floor(Math.random() * FRASES_MOTIVADORAS.length);
    setFraseMotivacional(FRASES_MOTIVADORAS[indice]);
  };

  const comprobarRespuesta = () => {
    if (!seleccion || estado === 'correcto' || estado === 'derrota' || !preguntaActual) return;

    if (seleccion === preguntaActual.correcta) {
      setEstado("correcto");
      audio.playSfx('success');
      // Registrar Acierto
      setMetricas(prev => ({ ...prev, aciertos: prev.aciertos + 1 }));
    } else {
      const nuevasVidas = vidas - 1;
      setVidas(nuevasVidas);
      audio.playSfx('error');
      
      // Registrar Fallo
      setMetricas(prev => ({ ...prev, fallos: prev.fallos + 1 }));
      generarFrase(); 

      if (nuevasVidas > 0) {
        setEstado("error_intento"); 
        setTimeout(() => {
            setEstado("pendiente");
            setSeleccion(null); 
        }, 5000); 
      } else {
        setEstado("derrota");
      }
    }
  };

  const handleReintentar = () => {
      // Al reintentar, enviamos lo que pasó antes de resetear
      if (alPerder) alPerder(metricas);
      seleccionarNuevoQuiz(nivelId, desafiosCompletados); 
      setVidas(3);
      setEstado("pendiente");
      setSeleccion(null);
      setMetricas({ aciertos: 0, fallos: 0 });
  };

  const avanzar = () => {
    // Al ganar, enviamos las métricas
    alCompletar(quizIdActual, metricas);
  };

  if (!preguntaActual) return <div className="quiz-container" style={{display:'flex',justifyContent:'center',alignItems:'center',color:'white'}}>Cargando...</div>;

  return (
    <div className="quiz-container">
      {/* POPUP DE ERROR (FRASE MOTIVACIONAL EN EL CENTRO) */}
      <AnimatePresence>
        {estado === 'error_intento' && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                background: '#222', border: '4px solid #ff4b4b',
                padding: '30px', borderRadius: '25px', textAlign: 'center',
                maxWidth: '90%', width: '400px',
                boxShadow: '0 0 50px rgba(255, 75, 75, 0.4)'
              }}
            >
              <motion.div 
                animate={{ rotate: [0, -10, 10, 0] }} 
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center' }}
              >
                <AlertCircle size={80} color="#ff4b4b" fill="rgba(255, 75, 75, 0.2)" />
              </motion.div>
              
              <h2 style={{ color: '#ff4b4b', margin: '0 0 10px 0', fontSize: '28px' }}>¡Ups!</h2>
              <p style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', lineHeight: '1.4' }}>
                {fraseMotivacional}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="quiz-header">
        <button className="btn-cerrar" onClick={alCerrar}><X size={32} color="#aaa" /></button>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#ff4b4b', fontWeight: '800', fontSize: '22px' }}>
            <Heart fill={vidas > 0 ? "#ff4b4b" : "none"} size={30} /> {vidas}
        </div>
      </div>

      {/* CONTENIDO DEL JUEGO */}
      <div className="quiz-contenido">
        {estado === 'derrota' ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ background: 'rgba(255, 75, 75, 0.2)', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Frown size={70} color="#ff4b4b" />
                </div>
                <h2 style={{ color: '#ff4b4b', fontSize: '28px', marginBottom: '10px' }}>¡Casi lo logras!</h2>
                
                {/* Frase Motivacional en Pantalla de Derrota */}
                <div style={{ background: '#333', padding: '15px', borderRadius: '15px', marginBottom: '20px', border: '2px dashed #ff4b4b' }}>
                    <p style={{ color: '#FFD700', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                        {fraseMotivacional || "¡No te rindas!"}
                    </p>
                </div>

                <p style={{ color: '#aaa', fontSize: '16px', marginBottom: '30px' }}>Te has quedado sin vidas.<br/><span style={{ fontSize: '14px' }}>(-1 Racha, -20 Gemas)</span></p>
            </motion.div>
        ) : (
            <>
                <h2 className="quiz-titulo">{preguntaActual.titulo}</h2>
                <p style={{ color: '#00C2CB', fontWeight: 'bold', margin: '0 0 10px 0', fontSize: '14px' }}>Desafío: {quizIdActual}</p>
                <p className="quiz-instruccion">{preguntaActual.instruccion}</p>
                <div className="quiz-visual"><span>{preguntaActual.contenido}</span></div>
                <div className="quiz-opciones">
                {preguntaActual.opciones.map((op, index) => {
                    let clase = "";
                    if (seleccion === op.id) clase = "seleccionada";
                    if (estado === 'correcto' && op.id === preguntaActual.correcta) clase = "correcta-verde";
                    if (estado === 'error_intento' && seleccion === op.id) clase = "error";
                    return (
                        <motion.div key={op.id} whileTap={{ scale: 0.98 }} className={`opcion-card ${clase}`} onClick={() => { if (estado === 'pendiente') { setSeleccion(op.id); audio.playSfx('click'); } }}>
                            <div className="letra-opcion">{index + 1}</div>
                            <div className="texto-opcion">{op.text}</div>
                        </motion.div>
                    )
                })}
                </div>
            </>
        )}
      </div>

      {/* FOOTER (Barra Inferior) */}
      <div className={`quiz-footer ${estado === 'derrota' || estado === 'error_intento' ? 'error' : (estado === 'correcto' ? 'correcto' : '')}`}>
        <div className="mensaje-feedback">
          {estado === 'correcto' && <div className="feedback-content exito"><CheckCircle size={40} fill="#58cc02" color="white" /><div><h3>¡Correcto!</h3></div></div>}
          
          {estado === 'error_intento' && (
             <div className="feedback-content error" style={{opacity: 0.5}}>
             </div>
          )}

          {estado === 'derrota' && <div className="feedback-content error"><Sparkles size={40} color="#FFD700" /><div><h3>¡Sigue intentando!</h3></div></div>}
        </div>

        {estado === 'correcto' && <button className="btn-comprobar correcto" onClick={avanzar}>CONTINUAR</button>}
        {estado === 'derrota' && <button className="btn-comprobar error" onClick={handleReintentar} style={{background:'#ff4b4b'}}>REINTENTAR</button>}
        {(estado === 'pendiente' || estado === 'error_intento') && <button className={`btn-comprobar ${estado==='error_intento'?'error':''}`} onClick={comprobarRespuesta} disabled={estado === 'error_intento'}>COMPROBAR</button>}
      </div>
    </div>
  );
}