import { api } from "./api"

/**
 * Obtiene todos los productos
 * @returns {Promise<Array>} - Lista de productos
 */
export const getAllProducts = async () => {
    try {
        console.log("Obteniendo todos los productos...")
        // Añadir un timeout más largo para dar tiempo al servidor
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

        const products = await api.get("/products", { signal: controller.signal })

        clearTimeout(timeoutId)

        console.log("Productos obtenidos:", products)
        return products
    } catch (error) {
        console.error("Error al obtener productos:", error)
        // Devolver un array vacío en caso de error para evitar errores en la UI
        return []
    }
}

/**
 * Obtiene un producto por ID
 * @param {number} productId - ID del producto
 * @returns {Promise<Object>} - Datos del producto
 */
export const getProductById = async (productId) => {
    try {
        return await api.get(`/products/${productId}`)
    } catch (error) {
        console.error(`Error al obtener el producto ${productId}:`, error)
        throw error
    }
}

/**
 * Busca productos por término de búsqueda
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} - Lista de productos filtrados
 */
export const searchProducts = async (query) => {
    try {
        return await api.get(`/products?search=${query}`)
    } catch (error) {
        console.error(`Error al buscar productos con la consulta "${query}":`, error)
        return []
    }
}

/**
 * Filtra productos por categoría
 * @param {string} category - Categoría para filtrar
 * @returns {Promise<Array>} - Lista de productos filtrados
 */
export const getProductsByCategory = async (category) => {
    try {
        // Como la API no tiene filtro por categoría, filtramos manualmente
        const allProducts = await getAllProducts()

        // Asignamos categorías basadas en la descripción del producto
        const categorizedProducts = allProducts.map((product) => {
            let productCategory = "otros"

            const description = product.description.toLowerCase()
            if (description.includes("fútbol") || description.includes("futbol") || description.includes("portero")) {
                productCategory = "futbol"
            } else if (description.includes("baloncesto") || description.includes("basketball")) {
                productCategory = "baloncesto"
            } else if (description.includes("running") || description.includes("zapatillas")) {
                productCategory = "running"
            } else if (
                description.includes("yoga") ||
                description.includes("fitness") ||
                description.includes("mancuernas")
            ) {
                productCategory = "fitness"
            }

            return { ...product, category: productCategory }
        })

        if (category === "todos") {
            return categorizedProducts
        }

        return categorizedProducts.filter((product) => product.category === category)
    } catch (error) {
        console.error(`Error al obtener productos de la categoría "${category}":`, error)
        return []
    }
}
