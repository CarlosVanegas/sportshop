// Configuración base para las llamadas a la API
// Usamos un proxy interno para evitar problemas de CORS
const API_BASE_URL = "/api/proxy"

// Mejorar la función handleApiError para proporcionar más información sobre el error
const handleApiError = async (response) => {
    if (!response.ok) {
        // Para errores de red como CORS o servidor no disponible
        if (response.status === 0 || response.status === 404 || response.status === 500) {
            console.error(`Error de conexión: No se pudo conectar a ${API_BASE_URL}`)

            // Para errores 500, intentar obtener más detalles del error
            if (response.status === 500) {
                try {
                    const errorData = await response.json()
                    console.error("Detalles del error 500:", errorData)
                    throw new Error(`Error en el servidor: ${errorData.message || errorData.error || "Internal Server Error"}`)
                } catch (e) {
                    throw new Error(`Error en el servidor (500). Por favor, verifica que el servidor backend esté en ejecución.`)
                }
            }

            throw new Error(`No se pudo conectar al servidor. Verifica que el servidor esté en ejecución.`)
        }

        try {
            const errorData = await response.json()
            console.error("Respuesta de error completa:", errorData)
            const errorMessage = errorData?.message || errorData?.error || `Error ${response.status}: ${response.statusText}`
            throw new Error(errorMessage)
        } catch (e) {
            // Si no se puede parsear la respuesta como JSON
            throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
    }

    // Para respuestas vacías (como 204 No Content)
    if (response.status === 204) {
        return true
    }

    // Intentar parsear la respuesta como JSON
    try {
        return await response.json()
    } catch (e) {
        console.warn("La respuesta no es JSON válido:", e)
        return {}
    }
}

// Función para obtener el token de autenticación
const getAuthToken = () => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token")
        console.log("Token obtenido para solicitud API:", token ? "Presente" : "No presente")
        return token
    }
    return null
}

// Modificar la función apiRequest para incluir más opciones y mejor manejo de errores
export const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken()

    const defaultHeaders = {
        "Content-Type": "application/json",
    }

    if (token) {
        defaultHeaders["Authorization"] = `Bearer ${token}`
        console.log("Añadiendo token a la solicitud:", `Bearer ${token.substring(0, 10)}...`)
    } else {
        console.warn("No se encontró token de autenticación para la solicitud a:", endpoint)
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    }

    try {
        console.log(`Realizando solicitud ${options.method || "GET"} a: ${API_BASE_URL}${endpoint}`)

        // Añadir un timeout más largo para dar tiempo al servidor
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos de timeout

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...config,
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        console.log(`Respuesta recibida de ${endpoint}:`, response.status, response.statusText)
        return handleApiError(response)
    } catch (error) {
        console.error(`Error de red en solicitud a ${endpoint}:`, error)

        if (error.name === "AbortError") {
            throw new Error(`La solicitud a ${endpoint} ha excedido el tiempo de espera. Verifica la conexión al servidor.`)
        }

        throw new Error(`Error de conexión: ${error.message}. Verifica que el servidor esté en ejecución.`)
    }
}

// Exportamos métodos HTTP comunes
export const api = {
    get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: "GET" }),
    post: (endpoint, data, options = {}) =>
        apiRequest(endpoint, {
            ...options,
            method: "POST",
            // Solo añadir body si data no es null o undefined
            body: data !== null && data !== undefined ? JSON.stringify(data) : undefined,
        }),
    put: (endpoint, data, options = {}) =>
        apiRequest(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: "DELETE" }),
}
