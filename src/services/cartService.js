import { api } from "./api"

/**
 * Obtiene los items del carrito del usuario
 * @returns {Promise<Array>} - Lista de items en el carrito
 */
export const getCartItems = async () => {
    try {
        const items = await api.get("/cart")
        console.log("Items recibidos de la API:", items)
        return items
    } catch (error) {
        console.error("Error al obtener items del carrito:", error)
        throw error
    }
}

/**
 * Agrega un item al carrito
 * @param {Object} item - Item a agregar (productId, quantity)
 * @returns {Promise<Object>} - Item agregado
 */
export const addCartItem = async (item) => {
    try {
        // Validar que el productId no sea undefined o null
        if (!item || !item.productId) {
            throw new Error("ID de producto no válido")
        }
        return await api.post("/cart/items", item)
    } catch (error) {
        console.error("Error al agregar item al carrito:", error)
        throw error
    }
}

/**
 * Elimina un item del carrito
 * @param {number} itemId - ID del item a eliminar
 * @returns {Promise<boolean>} - true si se eliminó correctamente
 */
export const removeCartItem = async (itemId) => {
    try {
        // Validar que el itemId no sea undefined o null
        if (!itemId) {
            throw new Error("ID de item no válido")
        }
        console.log(`Eliminando item ${itemId} del carrito...`)
        return await api.delete(`/cart/items/${itemId}`)
    } catch (error) {
        console.error(`Error al eliminar item ${itemId} del carrito:`, error)
        throw error
    }
}

/**
 * Actualiza la cantidad de un item en el carrito
 * @param {number} itemId - ID del item a actualizar
 * @param {number} quantity - Nueva cantidad
 * @returns {Promise<Object>} - Item actualizado
 */
export const updateCartItemQuantity = async (itemId, quantity) => {
    try {
        // Validar que el itemId no sea undefined o null
        if (!itemId) {
            throw new Error("ID de item no válido")
        }
        // Validar que la cantidad sea un número positivo
        if (typeof quantity !== "number" || quantity < 1) {
            throw new Error("Cantidad no válida")
        }
        return await api.put(`/cart/items/${itemId}`, { quantity })
    } catch (error) {
        console.error(`Error al actualizar cantidad del item ${itemId}:`, error)
        throw error
    }
}
