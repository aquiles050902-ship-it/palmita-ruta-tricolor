import { motion } from "framer-motion";
import { useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

export default function QuizEngine({ alCerrar, alCompletar }) {
  // Datos del ejercicio (luego vendrán de una base de datos)
  const pregunta = {
    titulo: "Completa la Secuencia",
    instruccion: "Observa el patrón y selecciona el número que falta:",
    contenido: "2, 4, 8, 16, ...",
    opciones: [
      { id: "a", texto: "20" },
      { id: "b", texto: "32" }, // Respuesta correcta
      { id: "c", texto: "24" },
      { id: "d", texto: "18" }
    ],
    correcta: "b"
  };

  const [seleccion, setSeleccion] = useState(null);
  const [estado, setEstado] = useState("pendiente"); // pendiente, correcto, error

  const comprobarRespuesta = () => {
    if (!seleccion) return;

    if (seleccion === pregunta.correcta) {
      setEstado("correcto");
    } else {
      setEstado("error");
    }
  };

  return (
    <div className="quiz-container">
      {/* Barra superior del quiz */}
      <div className="quiz-header">
        <button className="btn-cerrar" onClick={alCerrar}>
          <X size={24} />
        </button>
        <div className="barra-progreso">
          <div className="progreso-relleno" style={{ width: '20%' }}></div>
        </div>
      </div>

      {/* Área de pregunta */}
      <div className="quiz-contenido">
        <h2 className="quiz-titulo">{pregunta.titulo}</h2>
        <p className="quiz-instruccion">{pregunta.instruccion}</p>
        <div className="quiz-visual">
          <span>{pregunta.contenido}</span>
        </div>

        {/* Opciones */}
        <div className="quiz-opciones">
          {pregunta.opciones.map((op) => (
            <motion.div
              key={op.id}
              whileTap={{ scale: 0.98 }}
              className={`opcion-card ${seleccion === op.id ? 'seleccionada' : ''} ${estado === 'error' && seleccion === op.id ? 'error' : ''}`}
              onClick={() => {
                if (estado !== 'correcto') {
                  setSeleccion(op.id);
                  setEstado('pendiente');
                }
              }}
            >
              <div className="letra-opcion">{op.id.toUpperCase()}</div>
              <div className="texto-opcion">{op.texto}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pie de página con botón de comprobar */}
      <div className={`quiz-footer ${estado}`}>
        <div className="mensaje-feedback">
          {estado === 'correcto' && (
            <div className="feedback-content exito">
              <CheckCircle size={32} />
              <div>
                <h3>¡Excelente!</h3>
                <p>Respuesta correcta</p>
              </div>
            </div>
          )}
          {estado === 'error' && (
            <div className="feedback-content error">
              <AlertCircle size={32} />
              <div>
                <h3>Incorrecto</h3>
                <p>Inténtalo de nuevo</p>
              </div>
            </div>
          )}
        </div>

        <button 
          className={`btn-comprobar ${estado}`}
          onClick={estado === 'correcto' ? alCompletar : comprobarRespuesta}
        >
          {estado === 'correcto' ? 'CONTINUAR' : 'COMPROBAR'}
        </button>
      </div>
    </div>
  );
}