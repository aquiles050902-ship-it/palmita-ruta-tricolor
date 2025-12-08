const API_URL = "http://localhost:3000/api";

// Función para registrarse
export const apiRegistro = async (datosUsuario) => {
  const response = await fetch(`${API_URL}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosUsuario),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al registrar usuario");
  }
  return await response.json();
};

// Función para iniciar sesión
export const apiLogin = async (identificador, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identificador, password }),
  });
  
  if (!response.ok) {
    throw new Error("Credenciales inválidas");
  }
  return await response.json();
};

// Función para guardar el juego
export const apiGuardar = async (usuario) => {
  if (!usuario.id) return; // Si no tiene ID (es invitado), no guardamos en BD
  
  try {
    await fetch(`${API_URL}/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
    });
  } catch (error) {
    console.error("Error guardando en la nube:", error);
  }
};