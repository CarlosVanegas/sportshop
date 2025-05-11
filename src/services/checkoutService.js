import { api } from "./api"

/**
 * Inicia el proceso de checkout
 * @param {Object} checkoutData - Datos para iniciar el checkout (billingAddress, paymentMethod)
 * @returns {Promise<Object>} - Datos del checkout (checkoutId, subtotal, tax, shipping, total)
 */
export const initiateCheckout = async (checkoutData) => {
    try {
        console.log("Iniciando proceso de checkout:", checkoutData)
        const response = await api.post("/checkout", checkoutData)
        console.log("Respuesta de checkout:", response)
        return response
    } catch (error) {
        console.error("Error al iniciar checkout:", error)
        throw error
    }
}

/**
 * Procesa el pago y crea la orden
 * @param {string} checkoutId - ID del checkout
 * @param {Object} paymentData - Datos de pago (cardNumber, cardExpiry, cardCvv)
 * @returns {Promise<Object>} - Datos de la orden creada (orderId, message)
 */
export const processPayment = async (checkoutId, paymentData) => {
    try {
        console.log(`Procesando pago para checkout ${checkoutId}:`, paymentData)
        const response = await api.post(`/checkout/${checkoutId}/pay`, paymentData)
        console.log("Respuesta de pago:", response)
        return response
    } catch (error) {
        console.error("Error al procesar pago:", error)
        throw error
    }
}
