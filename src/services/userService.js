import { api } from "./api"

/**
 * Obtiene el perfil del usuario actual
 * @returns {Promise<Object>} - Datos del perfil del usuario
 */
export const getUserProfile = async () => {
    try {
        return await api.get("/users/me")
    } catch (error) {
        console.error("Error al obtener perfil de usuario:", error)
        throw error
    }
}

/**
 * Actualiza el perfil del usuario actual
 * @param {Object} userData - Datos actualizados del usuario
 * @returns {Promise<Object>} - Datos actualizados del perfil
 */
export const updateUserProfile = async (userData) => {
    try {
        return await api.put("/users/me", userData)
    } catch (error) {
        console.error("Error al actualizar perfil de usuario:", error)
        throw error
    }
}

/**
 * Cambia la contraseña del usuario
 * @param {Object} passwordData - Datos de contraseña (currentPassword, newPassword)
 * @returns {Promise<boolean>} - true si se cambió correctamente
 */
export const changeUserPassword = async (passwordData) => {
    try {
        await api.put("/users/me/password", passwordData)
        return true
    } catch (error) {
        console.error("Error al cambiar contraseña:", error)
        throw error
    }
}
