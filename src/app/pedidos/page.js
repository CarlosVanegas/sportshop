"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { getUserOrders } from "@/services/orderService"
import {
    ShoppingBag,
    Calendar,
    Clock,
    ChevronRight,
    Search,
    Filter,
    Package,
    ArrowUpDown,
    CheckCircle,
    AlertCircle,
    XCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function OrdersPage() {
    const { isAuthenticated } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [sortOrder, setSortOrder] = useState("newest")
    const { toast } = useToast()

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated) return

            setLoading(true)
            setError(null)
            try {
                const data = await getUserOrders()
                setOrders(data || [])
            } catch (err) {
                console.error("Error al cargar pedidos:", err)
                setError("No se pudieron cargar tus pedidos. Por favor, intenta de nuevo más tarde.")

                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudieron cargar tus pedidos. Por favor, intenta de nuevo.",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [isAuthenticated, toast])

    // Filtrar y ordenar pedidos
    const filteredOrders = orders
        .filter((order) => {
            // Filtrar por término de búsqueda
            const searchMatch =
                searchTerm === "" ||
                order.orderId.toString().includes(searchTerm) ||
                (order.totalAmount && order.totalAmount.toString().includes(searchTerm))

            // Filtrar por estado
            const statusMatch = filterStatus === "all" || order.status === filterStatus

            return searchMatch && statusMatch
        })
        .sort((a, b) => {
            // Ordenar por fecha
            const dateA = new Date(a.orderDate)
            const dateB = new Date(b.orderDate)

            if (sortOrder === "newest") {
                return dateB - dateA
            } else {
                return dateA - dateB
            }
        })

    if (!isAuthenticated) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-indigo-500" />
                    <h1 className="text-2xl font-bold mb-4 text-gray-900">Acceso Restringido</h1>
                    <p className="text-gray-600 mb-6">Debes iniciar sesión para ver tus pedidos</p>
                    <Link
                        href="/login?redirect=pedidos"
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
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Mis Pedidos</h1>
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-40 bg-gray-200 rounded"></div>
                        <div className="h-40 bg-gray-200 rounded"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Mis Pedidos</h1>
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
                    <AlertCircle className="h-6 w-6 mb-2" />
                    <h2 className="text-xl font-semibold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Mis Pedidos</h1>
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h2 className="text-xl font-semibold mb-2 text-gray-900">No tienes pedidos</h2>
                    <p className="text-gray-600 mb-6">Aún no has realizado ningún pedido</p>
                    <Link
                        href="/productos"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Explorar Productos
                    </Link>
                </div>
            </div>
        )
    }

    // Función para formatear la fecha
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

    // Función para formatear la hora
    const formatTime = (dateString) => {
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return ""

            return date.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            })
        } catch (e) {
            return ""
        }
    }

    // Función para obtener el color del estado
    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-emerald-100 text-emerald-800 border-emerald-200"
            case "pending":
                return "bg-amber-100 text-amber-800 border-amber-200"
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    // Función para obtener el icono del estado
    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-4 w-4 mr-1" />
            case "pending":
                return <Clock className="h-4 w-4 mr-1" />
            case "cancelled":
                return <XCircle className="h-4 w-4 mr-1" />
            default:
                return <Package className="h-4 w-4 mr-1" />
        }
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

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Mis Pedidos</h1>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/productos"
                        className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Seguir comprando
                    </Link>
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Buscar por número de pedido o importe"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center">
                            <Filter className="h-4 w-4 mr-2 text-gray-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="pending">Pendientes</option>
                                <option value="completed">Completados</option>
                                <option value="cancelled">Cancelados</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <ArrowUpDown className="h-4 w-4 mr-2 text-gray-500" />
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                            >
                                <option value="newest">Más recientes primero</option>
                                <option value="oldest">Más antiguos primero</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de pedidos */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-black">Historial de Pedidos ({filteredOrders.length})</h2>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center">
                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pedidos</h3>
                        <p className="text-gray-700">Prueba con otros filtros de búsqueda</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <div key={order.orderId} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div className="mb-4 md:mb-0">
                                        <div className="flex items-center mb-2">
                                            <h3 className="font-semibold text-lg text-gray-900">Pedido #{order.orderId}</h3>
                                            <span
                                                className={`ml-3 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)} flex items-center`}
                                            >
                        {getStatusIcon(order.status)}
                                                {translateStatus(order.status)}
                      </span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>{formatDate(order.orderDate)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                <span>{formatTime(order.orderDate)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Package className="h-4 w-4 mr-1" />
                                                <span>{order.items?.length || 0} productos</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="mr-6">
                                            <p className="text-sm text-gray-700 mb-1">Total</p>
                                            <p className="font-bold text-xl text-gray-900">${order.totalAmount?.toFixed(2) || "0.00"}</p>
                                        </div>
                                        <Link
                                            href={`/pedidos/${order.orderId}`}
                                            className="inline-flex items-center justify-center bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-4 rounded-lg transition-colors"
                                        >
                                            Ver detalles
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
