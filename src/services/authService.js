import { api } from "./api"

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario a registrar
 * @returns {Promise<Object>} - Datos del usuario registrado
 */
export const registerUser = async (userData) => {
    try {
        return await api.post("/auth/register", userData)
    } catch (error) {
        console.error("Error al registrar usuario:", error)
        throw error
    }
}

/**
 * Inicia sesión de usuario
 * @param {Object} credentials - Credenciales de inicio de sesión (email, password)
 * @returns {Promise<Object>} - Token de autenticación
 */
export const loginUser = async (credentials) => {
    try {
        const response = await api.post("/auth/login", credentials)

        // Guardar el token en localStorage
        if (response.token) {
            localStorage.setItem("auth_token", response.token)
            // Imprimir el token para depuración
            console.log("Token guardado:", response.token)
        } else {
            console.error("No se recibió token en la respuesta:", response)
        }

        return response
    } catch (error) {
        console.error("Error al iniciar sesión:", error)
        throw error
    }
}

/**
 * Cierra la sesión del usuario
 */
export const logoutUser = () => {
    localStorage.removeItem("auth_token")
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - true si está autenticado, false en caso contrario
 */
export const isAuthenticated = () => {
    if (typeof window === "undefined") return false

    const token = localStorage.getItem("auth_token")
    return !!token
}
