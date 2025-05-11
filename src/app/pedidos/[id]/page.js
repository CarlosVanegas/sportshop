"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { getOrderDetails } from "@/services/orderService"
import { CheckCircle, Clock, Calendar, Package, Truck, ShoppingBag, ChevronLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Imágenes de productos de muestra para asegurar que siempre se muestre algo
const PRODUCT_IMAGES = {
    yoga: "/rolled-yoga-mat.png",
    running: "/running-shoes-on-track.png",
    fitness: "/diverse-fitness-equipment.png",
    camiseta: "/sports-shirt.png",
    default: "/assorted-sports-gear.png",
}

export default function OrderDetailPage() {
    const { id } = useParams()
    const searchParams = useSearchParams()
    const showSuccess = searchParams.get("success") === "true"

    const { isAuthenticated } = useAuth()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { toast } = useToast()

    const handleImageError = (e) => {
        // Evitar bucle infinito estableciendo una imagen de respaldo estática
        // y asegurándose de que no se vuelva a intentar cargar la imagen original
        e.target.onerror = null // Importante: previene bucles infinitos

        // Usar una imagen de respaldo local en lugar de intentar cargar de nuevo
        if (e.target.src.includes("assorted-sports-gear.png")) {
            e.target.src = "/assorted-sports-gear.png"
        } else {
            e.target.src = "/generic-sports-product.png"
        }
    }

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!isAuthenticated || !id) return

            setLoading(true)
            setError(null)
            try {
                const data = await getOrderDetails(id)

                // Asegurarse de que cada item tenga una imagen válida
                if (data && data.items) {
                    data.items = data.items.map((item) => {
                        // Determinar qué imagen de muestra usar basado en la descripción
                        let imageKey = "default"
                        const description = (item.description || "").toLowerCase()

                        if (description.includes("yoga")) imageKey = "yoga"
                        else if (description.includes("running") || description.includes("zapatilla")) imageKey = "running"
                        else if (description.includes("fitness") || description.includes("equipo")) imageKey = "fitness"
                        else if (description.includes("camiseta")) imageKey = "camiseta"

                        // Usar placeholders estáticos en lugar de URLs que podrían no existir
                        return {
                            ...item,
                            imageUrl: `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(description || "sports product")}`,
                        }
                    })
                }

                setOrder(data)

                // Mostrar toast de éxito si es necesario
                if (showSuccess) {
                    toast({
                        variant: "success",
                        title: "¡Pedido confirmado!",
                        description: `Tu pedido #${id} ha sido procesado correctamente`,
                    })
                }
            } catch (err) {
                console.error(`Error al cargar detalles del pedido ${id}:`, err)
                setError("No se pudieron cargar los detalles del pedido. Por favor, intenta de nuevo más tarde.")
            } finally {
                setLoading(false)
            }
        }

        fetchOrderDetails()
    }, [isAuthenticated, id, showSuccess, toast])

    if (!isAuthenticated) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-indigo-500" />
                    <h1 className="text-2xl font-bold mb-4 text-gray-900">Acceso Restringido</h1>
                    <p className="text-gray-700 mb-6">Debes iniciar sesión para ver los detalles del pedido</p>
                    <Link
                        href={`/login?redirect=pedidos/${id}`}
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-8">
                    <Link href="/pedidos" className="text-indigo-600 hover:text-indigo-800 flex items-center mr-4">
                        <ChevronLeft className="h-5 w-5" />
                        <span>Volver a mis pedidos</span>
                    </Link>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-40 bg-gray-200 rounded"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-8">
                    <Link href="/pedidos" className="text-indigo-600 hover:text-indigo-800 flex items-center mr-4">
                        <ChevronLeft className="h-5 w-5" />
                        <span>Volver a mis pedidos</span>
                    </Link>
                </div>
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-8">
                    <Link href="/pedidos" className="text-indigo-600 hover:text-indigo-800 flex items-center mr-4">
                        <ChevronLeft className="h-5 w-5" />
                        <span>Volver a mis pedidos</span>
                    </Link>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h2 className="text-xl font-semibold mb-2 text-gray-900">Pedido no encontrado</h2>
                    <p className="text-gray-700 mb-6">No se encontró el pedido solicitado</p>
                    <Link
                        href="/pedidos"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Volver a Mis Pedidos
                    </Link>
                </div>
            </div>
        )
    }

    // Función para traducir el estado
    const translateStatus = (status) => {
        switch (status) {
            case "completed":
                return "Completado"
            case "pending":
                return "Pendiente"
            case "cancelled":
                return "Cancelado"
            default:
                return status
        }
    }

    // Función para obtener el color del estado
    const getStatusBgColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-emerald-500"
            case "pending":
                return "bg-amber-500"
            case "cancelled":
                return "bg-red-500"
            default:
                return "bg-gray-500"
        }
    }

    // Función para obtener el icono del estado
    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-5 w-5" />
            case "pending":
                return <Clock className="h-5 w-5" />
            case "cancelled":
                return <ShoppingBag className="h-5 w-5" />
            default:
                return <Package className="h-5 w-5" />
        }
    }

    // Calcular el total del pedido
    const orderTotal = order.items.reduce((total, item) => total + item.subtotal, 0)

    // Formatear fecha correctamente
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return "Fecha no disponible"

            return date.toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        } catch (e) {
            return "Fecha no disponible"
        }
    }

    // Determinar el progreso del pedido
    const getOrderProgress = (status) => {
        switch (status) {
            case "completed":
                return 100
            case "shipped":
                return 75
            case "processing":
                return 50
            case "pending":
                return 25
            default:
                return 25
        }
    }

    const orderProgress = getOrderProgress(order.status)

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="flex items-center mb-8">
                <Link href="/pedidos" className="text-indigo-600 hover:text-indigo-800 flex items-center mr-4">
                    <ChevronLeft className="h-5 w-5" />
                    <span className="font-medium">Volver a mis pedidos</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Pedido #{order.orderId}</h1>
            </div>

            {showSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl mb-8 flex items-center animate-bounce-in">
                    <CheckCircle className="h-6 w-6 mr-3 text-emerald-500 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-lg">¡Pedido confirmado con éxito!</h3>
                        <p className="text-emerald-700">Gracias por tu compra. Te notificaremos cuando tu pedido sea enviado.</p>
                    </div>
                </div>
            )}

            {/* Estado del pedido con diseño mejorado */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-indigo-600 text-white p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Estado del Pedido</h2>
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2 opacity-80" />
                                <span className="opacity-90">{formatDate(order.orderDate)}</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center">
                            <div className={`${getStatusBgColor(order.status)} p-3 rounded-full mr-3`}>
                                {getStatusIcon(order.status)}
                            </div>
                            <span className="text-lg font-semibold">{translateStatus(order.status)}</span>
                        </div>
                    </div>
                </div>

                {/* Barra de progreso mejorada */}
                <div className="p-6">
                    <div className="flex justify-between mb-2">
                        <div className={`flex flex-col items-center ${orderProgress >= 25 ? "text-indigo-600" : "text-gray-400"}`}>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${orderProgress >= 25 ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}
                            >
                                <ShoppingBag className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-medium">Recibido</span>
                        </div>
                        <div className={`flex flex-col items-center ${orderProgress >= 50 ? "text-indigo-600" : "text-gray-400"}`}>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${orderProgress >= 50 ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}
                            >
                                <Package className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-medium">Preparación</span>
                        </div>
                        <div className={`flex flex-col items-center ${orderProgress >= 75 ? "text-indigo-600" : "text-gray-400"}`}>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${orderProgress >= 75 ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}
                            >
                                <Truck className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-medium">Enviado</span>
                        </div>
                        <div className={`flex flex-col items-center ${orderProgress >= 100 ? "text-indigo-600" : "text-gray-400"}`}>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${orderProgress >= 100 ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}
                            >
                                <CheckCircle className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-medium">Entregado</span>
                        </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mt-2">
                        <div
                            className="h-2 bg-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${orderProgress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-black">Productos ({order.items.length})</h2>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {order.items.map((item) => (
                                <div key={item.productId} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                                    <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 mb-4 sm:mb-0 border border-gray-200">
                                        <img
                                            src={item.imageUrl || "/placeholder.svg?height=96&width=96&query=sports%20product"}
                                            alt={item.description || "Producto"}
                                            className="object-cover w-full h-full"
                                            onError={handleImageError}
                                        />
                                    </div>

                                    <div className="sm:ml-6 flex-grow">
                                        <h3 className="font-semibold text-gray-900 text-lg">{item.description}</h3>
                                        <p className="text-gray-600 mt-1">
                                            ${item.priceAtTime?.toFixed(2) || "0.00"} x {item.quantity}
                                        </p>
                                    </div>

                                    <div className="mt-4 sm:mt-0 sm:ml-6">
                                        <span className="font-bold text-xl text-gray-900">${item.subtotal?.toFixed(2) || "0.00"}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Resumen del Pedido</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">${orderTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Envío</span>
                                <span className="font-medium text-emerald-600">Gratis</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 mt-2">
                                <div className="flex justify-between font-bold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-2xl text-indigo-600">${orderTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Link
                                href="/productos"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center block"
                            >
                                Seguir Comprando
                            </Link>

                            <Link
                                href="/pedidos"
                                className="w-full bg-white border-2 border-indigo-600 hover:bg-indigo-50 text-indigo-600 font-medium py-3 px-4 rounded-lg transition-colors text-center block"
                            >
                                Ver Mis Pedidos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información de envío */}
            <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900">Información de Envío</h2>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Truck className="h-5 w-5 mr-2 text-indigo-600" />
                            Dirección de Envío
                        </h3>
                        <p className="text-gray-800">{order.shippingAddress || "No se especificó dirección de envío"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Package className="h-5 w-5 mr-2 text-indigo-600" />
                            Método de Envío
                        </h3>
                        <p className="text-gray-700">Envío estándar (3-5 días hábiles)</p>
                        <p className="text-gray-700 text-sm mt-1">Seguimiento: {order.trackingNumber || "Pendiente de envío"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
