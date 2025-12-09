import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Heart, RefreshCw, Frown } from "lucide-react";
import audio from '../utils/audio';

// === BASE DE DATOS: 20 NIVELES x 5 VARIANTES CADA UNO (100 PREGUNTAS TOTAL) ===
const QUESTIONS_DB = {
  // --- NIVEL 1: ALGORITMOS (SECUENCIAS) ---
  1: [
    { titulo: "Nivel 1: Algoritmos", instruccion: "¿Cuál es el orden para cepillarse?", contenido: "🦷 Dientes Sucios ➡️ ✨ Limpios", opciones: [{ id: "a", text: "Enjuagar -> Secar -> Pasta" }, { id: "b", text: "Pasta -> Cepillar -> Enjuagar" }, { id: "c", text: "Cepillar -> Pasta -> Enjuagar" }, { id: "d", text: "Secar -> Enjuagar -> Pasta" }], correcta: "b" },
    { titulo: "Nivel 1: Algoritmos", instruccion: "Pasos para preparar Cereal:", contenido: "🥣 Tazón Vacio ➡️ 😋 Cereal Listo", opciones: [{ id: "a", text: "Comer -> Leche -> Cereal" }, { id: "b", text: "Cereal -> Leche -> Comer" }, { id: "c", text: "Leche -> Comer -> Cereal" }, { id: "d", text: "Lavar -> Comer -> Servir" }], correcta: "b" },
    { titulo: "Nivel 1: Algoritmos", instruccion: "¿Qué va primero al vestirse?", contenido: "🦶 Pies ➡️ 👟 Zapatos", opciones: [{ id: "a", text: "Zapatos -> Medias" }, { id: "b", text: "Medias -> Zapatos" }, { id: "c", text: "Cordones -> Medias" }, { id: "d", text: "Zapatos -> Cortar uñas" }], correcta: "b" },
    { titulo: "Nivel 1: Algoritmos", instruccion: "Algoritmo para una planta:", contenido: "🌱 Semilla ➡️ 🌻 Flor", opciones: [{ id: "a", text: "Agua -> Esperar -> Sembrar" }, { id: "b", text: "Cosechar -> Sembrar -> Regar" }, { id: "c", text: "Sembrar -> Regar -> Esperar" }, { id: "d", text: "Esperar -> Sembrar -> Regar" }], correcta: "c" },
    { titulo: "Nivel 1: Algoritmos", instruccion: "Lavarse las manos:", contenido: "🦠 Sucias ➡️ ✨ Limpias", opciones: [{ id: "a", text: "Mojar -> Jabón -> Frotar -> Enjuagar" }, { id: "b", text: "Secar -> Mojar -> Jabón" }, { id: "c", text: "Jabón -> Secar -> Mojar" }, { id: "d", text: "Frotar -> Secar -> Mojar" }], correcta: "a" }
  ],
  // ... (RESTO DE LA BASE DE DATOS DE PREGUNTAS IGUAL QUE ANTES) ...
  // Para ahorrar espacio, asumo que tienes el resto de QUESTIONS_DB copiado del mensaje anterior.
  // Si no, avísame y te lo pego completo de nuevo.
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
  // ... CONTINÚA CON LOS NIVELES 4-20 DEL ARCHIVO ANTERIOR ...
  // (Si necesitas el bloque completo de 4 a 20, dímelo y lo repito)
  // POR SEGURIDAD, ASUMO QUE TIENES LA BASE DE DATOS. SI NO, ESTE ES EL COMPONENTE COMPLETO CON LA LÓGICA CORREGIDA:
};

// COMPONENTE CORREGIDO
export default function QuizEngine({ alCerrar, alCompletar, alPerder, nivelId = 1, desafiosCompletados = [] }) {
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [quizIdActual, setQuizIdActual] = useState(null); 
  
  // CORRECCIÓN: Esta función ahora recibe la lista 'completados' como argumento
  const seleccionarNuevoQuiz = (targetNivelId, completados) => {
    // Si no hay base de datos para este nivel, usar nivel 1 por defecto
    const pool = QUESTIONS_DB[targetNivelId] || QUESTIONS_DB[1];
    
    if (!pool) return; // Seguridad extra

    // 1. Crear lista de variantes disponibles
    const variantesDisponibles = pool
      .map((_, index) => index)
      .filter(index => !completados.includes(`${targetNivelId}-${index + 1}`));

    let selectedIndex;
    
    if (variantesDisponibles.length > 0) {
      const randomAvailableIndex = Math.floor(Math.random() * variantesDisponibles.length);
      selectedIndex = variantesDisponibles[randomAvailableIndex];
    } else {
      // Si todo está completado, elegir al azar
      selectedIndex = Math.floor(Math.random() * pool.length);
    }
    
    const varianteIndex = selectedIndex + 1;
    const nuevoQuizId = `${targetNivelId}-${varianteIndex}`;
    
    setPreguntaActual(pool[selectedIndex]);
    setQuizIdActual(nuevoQuizId);
  };
  
  useEffect(() => {
    // CORRECCIÓN: Pasamos 'desafiosCompletados' explícitamente a la función
    seleccionarNuevoQuiz(nivelId, desafiosCompletados);
    setSeleccion(null);
    setEstado("pendiente");
    setVidas(3);
  }, [nivelId, desafiosCompletados.length]);

  const [seleccion, setSeleccion] = useState(null);
  const [estado, setEstado] = useState("pendiente"); 
  const [vidas, setVidas] = useState(3); 

  const comprobarRespuesta = () => {
    if (!seleccion || estado === 'correcto' || estado === 'derrota' || !preguntaActual) return;

    if (seleccion === preguntaActual.correcta) {
      setEstado("correcto");
      audio.playSfx('success');
    } else {
      const nuevasVidas = vidas - 1;
      setVidas(nuevasVidas);
      audio.playSfx('error');
      
      if (nuevasVidas > 0) {
        setEstado("error_intento");
        setTimeout(() => {
            setEstado("pendiente");
            setSeleccion(null); 
        }, 1500);
      } else {
        setEstado("derrota");
      }
    }
  };

  const handleReintentar = () => {
      if (alPerder) alPerder();
      
      // Al reintentar, volvemos a seleccionar usando la lista actual
      seleccionarNuevoQuiz(nivelId, desafiosCompletados); 
      
      setVidas(3);
      setEstado("pendiente");
      setSeleccion(null);
  };

  const avanzar = () => {
    alCompletar(quizIdActual);
  };

  if (!preguntaActual) return <div className="quiz-container" style={{display:'flex',justifyContent:'center',alignItems:'center',color:'white'}}>Cargando...</div>;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="btn-cerrar" onClick={alCerrar}><X size={32} color="#aaa" /></button>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#ff4b4b', fontWeight: '800', fontSize: '22px' }}>
            <Heart fill={vidas > 0 ? "#ff4b4b" : "none"} size={30} /> {vidas}
        </div>
      </div>

      <div className="quiz-contenido">
        {estado === 'derrota' ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center' }}>
                <div style={{ background: 'rgba(255, 75, 75, 0.2)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Frown size={60} color="#ff4b4b" />
                </div>
                <h2 style={{ color: '#ff4b4b' }}>¡Oh no!</h2>
                <p style={{ color: '#aaa', fontSize: '18px', marginBottom: '20px' }}>Te has quedado sin vidas.<br/><span style={{ fontSize: '14px' }}>(-1 Racha, -20 Gemas)</span></p>
                <p style={{ color: 'white', marginBottom: '30px' }}>Intenta de nuevo con otra pregunta.</p>
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

      <div className={`quiz-footer ${estado === 'derrota' || estado === 'error_intento' ? 'error' : (estado === 'correcto' ? 'correcto' : '')}`}>
        <div className="mensaje-feedback">
          {estado === 'correcto' && <div className="feedback-content exito"><CheckCircle size={40} fill="#58cc02" color="white" /><div><h3>¡Correcto!</h3></div></div>}
          {estado === 'error_intento' && <div className="feedback-content error"><AlertCircle size={40} fill="#ff4b4b" color="white" /><div><h3>¡Incorrecto!</h3></div></div>}
          {estado === 'derrota' && <div className="feedback-content error"><RefreshCw size={40} color="white" /><div><h3>Fin del juego</h3></div></div>}
        </div>

        {estado === 'correcto' && <button className="btn-comprobar correcto" onClick={avanzar}>CONTINUAR</button>}
        {estado === 'derrota' && <button className="btn-comprobar error" onClick={handleReintentar} style={{background:'#ff4b4b'}}>REINTENTAR</button>}
        {(estado === 'pendiente' || estado === 'error_intento') && <button className={`btn-comprobar ${estado==='error_intento'?'error':''}`} onClick={comprobarRespuesta} disabled={estado === 'error_intento'}>COMPROBAR</button>}
      </div>
    </div>
  );
}