"use client"

import { createContext, useState, useEffect, useContext, useCallback, useRef } from "react"
import { getCartItems, addCartItem, removeCartItem, updateCartItemQuantity } from "@/services/cartService"
import { useAuth } from "./AuthContext"
import { useToast } from "@/hooks/use-toast"

// Crear el contexto con un valor inicial
const CartContext = createContext({
    cartItems: [],
    loading: false,
    error: null,
    cartTotal: 0,
    itemCount: 0,
    addToCart: async () => null,
    removeFromCart: async () => {},
    updateQuantity: async () => null,
    refreshCart: async () => {},
})

// Proveedor del contexto
export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { isAuthenticated } = useAuth()
    const { toast } = useToast()

    // Añadir un ref para evitar múltiples cargas simultáneas
    const isLoadingRef = useRef(false)

    // Usar useCallback para evitar recrear la función en cada renderizado
    const loadCart = useCallback(async () => {
        if (!isAuthenticated) return

        // Evitar múltiples cargas simultáneas usando un ref
        if (isLoadingRef.current) return

        isLoadingRef.current = true
        setLoading(true)
        setError(null)

        try {
            console.log("Cargando carrito...")
            const items = await getCartItems()
            console.log("Items del carrito obtenidos:", items)

            // Transformar los items si es necesario para adaptarlos al formato esperado
            const formattedItems = items.map((item) => ({
                id: item.itemId,
                quantity: item.quantity,
                product: {
                    id: item.productId,
                    description: item.productDescription,
                    imageUrl: item.imageUrl,
                    price: item.price,
                },
                subtotal: item.subtotal,
            }))

            console.log("Items formateados:", formattedItems)
            setCartItems(formattedItems || [])
        } catch (err) {
            console.error("Error al cargar el carrito:", err)
            setError(err.message || "Error al cargar el carrito")

            // Mostrar notificación de error
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo cargar el carrito. Por favor, intenta de nuevo.",
            })

            // En caso de error, mantener el carrito actual o establecerlo como vacío
            setCartItems([])
        } finally {
            setLoading(false)
            isLoadingRef.current = false
        }
    }, [isAuthenticated, toast])

    // Cargar carrito al iniciar o cuando cambia la autenticación
    useEffect(() => {
        if (isAuthenticated) {
            loadCart()
        } else {
            setCartItems([])
        }
    }, [isAuthenticated, loadCart])

    // Función para agregar un item al carrito
    const addToCart = async (productId, quantity = 1) => {
        if (!isAuthenticated) {
            setError("Debes iniciar sesión para añadir productos al carrito")

            // Mostrar notificación de error
            toast({
                variant: "warning",
                title: "Inicio de sesión requerido",
                description: "Debes iniciar sesión para añadir productos al carrito",
            })

            return null
        }

        setLoading(true)
        setError(null)
        try {
            console.log(`Añadiendo producto ${productId} al carrito, cantidad: ${quantity}`)
            const newItem = await addCartItem({ productId, quantity })
            console.log("Item añadido:", newItem)

            // Asegurarse de que el carrito se actualice con la información completa del producto
            await loadCart()

            return newItem
        } catch (err) {
            console.error("Error al agregar al carrito:", err)
            setError(err.message || "Error al agregar al carrito")

            // Mostrar notificación de error
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo añadir el producto al carrito. Inténtalo de nuevo.",
            })

            return null
        } finally {
            setLoading(false)
        }
    }

    // Función para eliminar un item del carrito
    const removeFromCart = async (itemId) => {
        if (!isAuthenticated) {
            setError("Debes iniciar sesión para eliminar productos del carrito")
            return
        }

        // Validar que el itemId no sea undefined o null
        if (!itemId) {
            console.error("Error: Intentando eliminar un item con ID undefined o null")
            setError("Error: No se puede eliminar el producto (ID no válido)")
            return
        }

        setLoading(true)
        setError(null)
        try {
            console.log(`Eliminando item ${itemId} del carrito...`)
            await removeCartItem(itemId)
            console.log(`Item ${itemId} eliminado correctamente`)

            // Actualizar el estado local después de eliminar
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
        } catch (err) {
            console.error(`Error al eliminar item ${itemId} del carrito:`, err)
            setError(err.message || "Error al eliminar del carrito")
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Función para actualizar la cantidad de un item
    const updateQuantity = async (itemId, quantity) => {
        if (!isAuthenticated) {
            setError("Debes iniciar sesión para actualizar productos del carrito")
            return
        }

        // Validar que el itemId no sea undefined o null
        if (!itemId) {
            console.error("Error: Intentando actualizar un item con ID undefined o null")
            setError("Error: No se puede actualizar el producto (ID no válido)")
            return
        }

        setLoading(true)
        setError(null)
        try {
            console.log(`Actualizando cantidad del item ${itemId} a ${quantity}...`)
            const updatedItem = await updateCartItemQuantity(itemId, quantity)
            console.log(`Item ${itemId} actualizado correctamente:`, updatedItem)

            // Actualizar el estado local sin recargar todo el carrito
            setCartItems((prevItems) =>
                prevItems.map((item) => (item.id === itemId ? { ...item, quantity: quantity } : item)),
            )

            return updatedItem
        } catch (err) {
            console.error(`Error al actualizar cantidad del item ${itemId}:`, err)
            setError(err.message || "Error al actualizar cantidad")
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Calcular el total del carrito
    const cartTotal = cartItems.reduce((total, item) => {
        const price = item.product?.price || 0
        return total + price * item.quantity
    }, 0)

    // Calcular el número total de items
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0)

    // Valor del contexto
    const value = {
        cartItems,
        loading,
        error,
        cartTotal,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        refreshCart: loadCart,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Hook personalizado para usar el contexto
export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart debe ser usado dentro de un CartProvider")
    }
    return context
}
