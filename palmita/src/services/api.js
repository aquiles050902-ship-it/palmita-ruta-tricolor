const API_URL = "http://localhost:3000/api";

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

export const apiLogin = async (identificador, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identificador, password }),
  });
  if (!response.ok) throw new Error("Credenciales inválidas");
  return await response.json();
};

export const apiGuardar = async (usuario) => {
  if (!usuario.id) return; 
  try {
    await fetch(`${API_URL}/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
    });
  } catch (error) { console.error("Error guardando:", error); }
};

export const apiObtenerEstudiantes = async () => {
  const response = await fetch(`${API_URL}/estudiantes`);
  if (!response.ok) throw new Error("Error al cargar estudiantes");
  return await response.json();
};

export const apiObtenerProfesores = async () => {
  const response = await fetch(`${API_URL}/profesores`);
  if (!response.ok) throw new Error("Error al cargar profesores");
  return await response.json();
};

export const apiEliminarEstudiante = async (id) => {
  const response = await fetch(`${API_URL}/estudiantes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar");
  return await response.json();
};