"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, AlertCircle } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
    const { cartItems, loading, removeFromCart, updateQuantity, cartTotal, refreshCart, error } = useCart()
    const { isAuthenticated } = useAuth()
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderError, setOrderError] = useState("")
    const [deleteError, setDeleteError] = useState("")
    const [serverStatus, setServerStatus] = useState({ isChecking: false, isOnline: true })
    const router = useRouter()
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const { toast } = useToast()

    // Usar un ref para controlar si ya se ha cargado el carrito
    const hasLoadedCart = useRef(false)

    // Verificar el estado del servidor
    const checkServerStatus = async () => {
        if (serverStatus.isChecking) return

        setServerStatus({ isChecking: true, isOnline: serverStatus.isOnline })

        try {
            // Intentar hacer una solicitud simple para verificar si el servidor está en línea
            const response = await fetch(`${API_BASE_URL}/api/health`, {
                method: "GET",
                cache: "no-store",
                headers: { "Content-Type": "application/json" },
            })

            setServerStatus({ isChecking: false, isOnline: response.ok })
            return response.ok
        } catch (error) {
            console.error("Error al verificar estado del servidor:", error)
            setServerStatus({ isChecking: false, isOnline: false })
            return false
        }
    }

    // Corregido para evitar el bucle infinito
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login?redirect=cart")
            return
        }

        // Solo cargar el carrito una vez cuando la página se monta
        if (!hasLoadedCart.current) {
            refreshCart().catch((err) => {
                console.error("Error al cargar el carrito:", err)
                // Si hay un error al cargar el carrito, verificar el estado del servidor
                checkServerStatus()
            })
            hasLoadedCart.current = true
        }
    }, [isAuthenticated, router]) // Eliminado refreshCart de las dependencias

    const handleRemoveItem = async (itemId, productName) => {
        setDeleteError("")
        // Validar que el itemId no sea undefined o null
        if (!itemId) {
            console.error("Error: Intentando eliminar un item con ID undefined o null")
            setDeleteError("Error: No se puede eliminar el producto (ID no válido)")
            return
        }

        try {
            console.log(`Intentando eliminar item ${itemId} del carrito...`)
            await removeFromCart(itemId)
            console.log(`Item ${itemId} eliminado correctamente`)

            // Mostrar notificación toast
            toast({
                variant: "dark",
                title: "Producto eliminado",
                description: `${productName || "Producto"} se ha eliminado del carrito`,
            })
        } catch (error) {
            console.error("Error al eliminar item:", error)
            setDeleteError(`Error al eliminar producto: ${error.message || "Inténtalo de nuevo"}`)

            // Verificar si el error es de conexión
            if (error.message && error.message.includes("conectar")) {
                checkServerStatus()
            }

            // Mostrar notificación de error
            toast({
                variant: "destructive",
                title: "Error",
                description: `No se pudo eliminar el producto: ${error.message || "Inténtalo de nuevo"}`,
            })
        }
    }

    const handleQuantityChange = async (itemId, newQuantity, productName) => {
        if (newQuantity < 1) return
        if (!itemId) {
            console.error("Error: Intentando actualizar un item con ID undefined o null")
            return
        }

        try {
            await updateQuantity(itemId, newQuantity)

            // Mostrar notificación toast
            toast({
                variant: "dark",
                title: "Cantidad actualizada",
                description: `${productName || "Producto"}: cantidad actualizada a ${newQuantity}`,
            })
        } catch (error) {
            console.error("Error al actualizar cantidad:", error)

            // Verificar si el error es de conexión
            if (error.message && error.message.includes("conectar")) {
                checkServerStatus()
            }

            // Mostrar notificación de error
            toast({
                variant: "destructive",
                title: "Error",
                description: `No se pudo actualizar la cantidad: ${error.message || "Inténtalo de nuevo"}`,
            })
        }
    }

    // Función para manejar errores de carga de imagen
    const handleImageError = (e) => {
        e.target.src = "/placeholder.svg"
    }

    // Función para proceder al checkout
    const handleProceedToCheckout = () => {
        if (!isAuthenticated) {
            router.push("/login?redirect=checkout")
            return
        }

        // Verificar si el carrito está vacío
        if (!cartItems || cartItems.length === 0) {
            toast({
                variant: "warning",
                title: "Carrito vacío",
                description: "No puedes proceder al checkout con un carrito vacío",
            })
            return
        }

        // Verificar si el servidor está en línea
        if (!serverStatus.isOnline) {
            checkServerStatus().then((isOnline) => {
                if (!isOnline) {
                    toast({
                        variant: "destructive",
                        title: "Servidor no disponible",
                        description: "No se puede conectar al servidor. Por favor, intenta más tarde.",
                    })
                } else {
                    router.push("/checkout")
                }
            })
        } else {
            router.push("/checkout")
        }
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
                <h1 className="text-2xl font-bold mb-8 text-gray-900">Tu Carrito</h1>
                <div className="flex justify-center">
                    <div className="animate-pulse text-center">
                        <p className="text-gray-500">Cargando carrito...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Mostrar mensaje de servidor no disponible
    if (!serverStatus.isOnline) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
                <div className="flex items-center mb-8">
                    <Link href="/productos" className="text-gray-500 hover:text-black flex items-center mr-4">
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        Volver
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Tu Carrito</h1>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center mb-8">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                    <h2 className="text-xl font-medium mb-2 text-red-700">Servidor no disponible</h2>
                    <p className="text-red-600 mb-6">
                        No se puede conectar al servidor. Por favor, verifica que el servidor esté en ejecución o intenta más tarde.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={checkServerStatus}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            disabled={serverStatus.isChecking}
                        >
                            {serverStatus.isChecking ? "Verificando..." : "Reintentar conexión"}
                        </button>
                        <Link
                            href="/productos"
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Volver a productos
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
                <h1 className="text-2xl font-bold mb-8 text-gray-900">Tu Carrito</h1>
                <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm border border-gray-100">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h2 className="text-xl font-medium mb-2 text-gray-900">Tu carrito está vacío</h2>
                    <p className="text-gray-500 mb-6">Parece que aún no has añadido productos a tu carrito</p>
                    <Link
                        href="/productos"
                        className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Explorar Productos
                    </Link>
                </div>
            </div>
        )
    }

    // Depuración
    console.log("Datos del carrito:", cartItems)

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
            <div className="flex items-center mb-8">
                <Link href="/productos" className="text-gray-500 hover:text-black flex items-center mr-4">
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Volver
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Tu Carrito</h1>
            </div>

            {orderError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-100">{orderError}</div>
            )}

            {deleteError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-100">{deleteError}</div>
            )}

            {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-100">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-medium text-gray-900">Productos ({cartItems.length})</h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {cartItems.map((item) => {
                                // Verificar que el item tenga un ID válido
                                if (!item || !item.id) {
                                    console.warn("Item inválido en el carrito:", item)
                                    return null
                                }

                                // Asegurarse de que el producto existe
                                const product = item.product || {}

                                // Construir la URL de la imagen correctamente
                                const imageUrl = product.imageUrl
                                    ? product.imageUrl.startsWith("http")
                                        ? product.imageUrl
                                        : `${API_BASE_URL}${product.imageUrl}`
                                    : "/placeholder.svg"

                                // Asegurarse de que el precio es un número
                                const price = typeof product.price === "number" ? product.price : 0
                                const subtotal = price * item.quantity

                                return (
                                    <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                                        <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 mb-4 sm:mb-0 border border-gray-200">
                                            <Image
                                                src={imageUrl || "/placeholder.svg"}
                                                alt={product.description || "Producto"}
                                                fill
                                                className="object-cover"
                                                onError={handleImageError}
                                                sizes="(max-width: 768px) 96px, 96px"
                                            />
                                        </div>

                                        <div className="sm:ml-6 flex-grow">
                                            <h3 className="font-medium text-gray-900">{product.description || "Producto"}</h3>
                                            <p className="text-gray-500 text-sm mt-1">Código: {product.id || "N/A"}</p>
                                            <p className="text-gray-700 font-medium mt-1">${price.toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center mt-4 sm:mt-0">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1, product.description)}
                                                className="p-2 rounded-full hover:bg-gray-100 text-gray-700 border border-gray-200"
                                                aria-label="Disminuir cantidad"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="mx-3 w-8 text-center text-gray-900 font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1, product.description)}
                                                className="p-2 rounded-full hover:bg-gray-100 text-gray-700 border border-gray-200"
                                                aria-label="Aumentar cantidad"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center">
                                            <span className="font-medium mr-4 text-gray-900 text-lg">${subtotal.toFixed(2)}</span>
                                            <button
                                                onClick={() => handleRemoveItem(item.id, product.description)}
                                                className="p-2 rounded-full hover:bg-red-50 text-red-500"
                                                aria-label="Eliminar"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-xl p-6 sticky top-24 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-medium mb-6 text-gray-900 border-b border-gray-200 pb-4">Resumen del Pedido</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Envío</span>
                                <span className="text-green-600 font-medium">Calculado en el checkout</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between font-medium">
                                <span className="text-gray-900">Total estimado</span>
                                <span className="text-xl text-gray-900">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleProceedToCheckout}
                            disabled={isProcessing || cartItems.length === 0 || !serverStatus.isOnline}
                            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-70 mb-4"
                        >
                            {isProcessing ? "Procesando..." : "Proceder al Checkout"}
                        </button>

                        <Link href="/productos" className="block text-center text-gray-600 hover:text-black text-sm font-medium">
                            Seguir comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
