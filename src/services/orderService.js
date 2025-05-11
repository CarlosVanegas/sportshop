import { api } from "./api"

/**
 * Confirma el pedido actual (convierte el carrito en orden)
 * @returns {Promise<Object>} - Datos de la orden creada
 */
export const confirmOrder = async () => {
    try {
        console.log("Iniciando confirmación de pedido...")

        // Primero verificamos que el carrito tenga items
        const cartItems = await api.get("/cart")
        console.log("Items en el carrito antes de confirmar:", cartItems)

        if (!cartItems || cartItems.length === 0) {
            throw new Error("Carrito vacío")
        }

        // Llamar al endpoint POST /api/orders sin body
        // Usamos null explícitamente para indicar que no hay body
        const response = await api.post("/orders", null)
        console.log("Respuesta de confirmación de pedido:", response)
        return response
    } catch (error) {
        console.error("Error al confirmar pedido:", error)

        // Mejorar el mensaje de error para el usuario
        if (error.message && error.message.includes("500")) {
            throw new Error("Error en el servidor. Por favor, intenta más tarde o contacta a soporte.")
        }

        throw error
    }
}

/**
 * Obtiene todas las órdenes del usuario
 * @returns {Promise<Array>} - Lista de órdenes
 */
export const getUserOrders = async () => {
    try {
        return await api.get("/orders")
    } catch (error) {
        console.error("Error al obtener órdenes del usuario:", error)
        throw error
    }
}

/**
 * Obtiene el detalle de una orden específica
 * @param {number} orderId - ID de la orden
 * @returns {Promise<Object>} - Detalle de la orden
 */
export const getOrderDetails = async (orderId) => {
    try {
        return await api.get(`/orders/${orderId}`)
    } catch (error) {
        console.error(`Error al obtener detalle de la orden ${orderId}:`, error)
        throw error
    }
}
