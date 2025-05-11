"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { initiateCheckout, processPayment } from "@/services/checkoutService"

export default function CheckoutPage() {
    const router = useRouter()
    const { isAuthenticated } = useAuth()
    const { cartItems, cartTotal, refreshCart } = useCart()
    const { toast } = useToast()
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

    // Estados para el proceso de checkout
    const [step, setStep] = useState(1) // 1: Dirección y método de pago, 2: Detalles de pago
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [checkoutData, setCheckoutData] = useState(null)

    // Formulario de dirección y método de pago
    const [checkoutForm, setCheckoutForm] = useState({
        billingAddress: "",
        paymentMethod: "card", // Por defecto tarjeta
    })

    // Formulario de pago
    const [paymentForm, setPaymentForm] = useState({
        cardNumber: "",
        cardExpiry: "",
        cardCvv: "",
    })

    // Validación de formularios
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        // Redirigir si no está autenticado o el carrito está vacío
        if (!isAuthenticated) {
            router.push("/login?redirect=checkout")
            return
        }

        if (!cartItems || cartItems.length === 0) {
            toast({
                variant: "warning",
                title: "Carrito vacío",
                description: "No puedes proceder al checkout con un carrito vacío",
            })
            router.push("/cart")
        }
    }, [isAuthenticated, cartItems, router, toast])

    // Manejar cambios en el formulario de checkout
    const handleCheckoutFormChange = (e) => {
        const { name, value } = e.target
        setCheckoutForm((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Limpiar error al cambiar el valor
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    // Manejar cambios en el formulario de pago
    const handlePaymentFormChange = (e) => {
        const { name, value } = e.target

        // Formatear número de tarjeta: añadir espacios cada 4 dígitos
        if (name === "cardNumber") {
            const formattedValue = value
                .replace(/\s/g, "") // Eliminar espacios existentes
                .replace(/\D/g, "") // Permitir solo dígitos
                .slice(0, 16) // Limitar a 16 dígitos
                .replace(/(\d{4})(?=\d)/g, "$1 ") // Añadir espacio cada 4 dígitos

            setPaymentForm((prev) => ({
                ...prev,
                [name]: formattedValue,
            }))
        }
        // Formatear fecha de expiración: añadir / después de los primeros 2 dígitos
        else if (name === "cardExpiry") {
            const digits = value.replace(/\D/g, "").slice(0, 4)
            let formattedValue = digits

            if (digits.length > 2) {
                formattedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`
            }

            setPaymentForm((prev) => ({
                ...prev,
                [name]: formattedValue,
            }))
        }
        // Formatear CVV: solo permitir 3 o 4 dígitos
        else if (name === "cardCvv") {
            const formattedValue = value.replace(/\D/g, "").slice(0, 4)

            setPaymentForm((prev) => ({
                ...prev,
                [name]: formattedValue,
            }))
        } else {
            setPaymentForm((prev) => ({
                ...prev,
                [name]: value,
            }))
        }

        // Limpiar error al cambiar el valor
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    // Validar formulario de checkout
    const validateCheckoutForm = () => {
        const errors = {}

        if (!checkoutForm.billingAddress.trim()) {
            errors.billingAddress = "La dirección de facturación es obligatoria"
        }

        if (!checkoutForm.paymentMethod) {
            errors.paymentMethod = "Selecciona un método de pago"
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Validar formulario de pago
    const validatePaymentForm = () => {
        const errors = {}
        const cardNumberWithoutSpaces = paymentForm.cardNumber.replace(/\s/g, "")

        if (!cardNumberWithoutSpaces) {
            errors.cardNumber = "El número de tarjeta es obligatorio"
        } else if (cardNumberWithoutSpaces.length < 16) {
            errors.cardNumber = "El número de tarjeta debe tener 16 dígitos"
        }

        if (!paymentForm.cardExpiry) {
            errors.cardExpiry = "La fecha de expiración es obligatoria"
        } else {
            const [month, year] = paymentForm.cardExpiry.split("/")
            const currentYear = new Date().getFullYear() % 100 // Últimos 2 dígitos del año actual
            const currentMonth = new Date().getMonth() + 1 // Mes actual (1-12)

            if (!month || !year || month > 12 || month < 1) {
                errors.cardExpiry = "Fecha de expiración inválida"
            } else if (
                Number.parseInt(year) < currentYear ||
                (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
            ) {
                errors.cardExpiry = "La tarjeta ha expirado"
            }
        }

        if (!paymentForm.cardCvv) {
            errors.cardCvv = "El código de seguridad es obligatorio"
        } else if (paymentForm.cardCvv.length < 3) {
            errors.cardCvv = "El código de seguridad debe tener al menos 3 dígitos"
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Iniciar el proceso de checkout
    const handleInitiateCheckout = async (e) => {
        e.preventDefault()

        if (!validateCheckoutForm()) return

        setLoading(true)
        setError(null)

        try {
            const response = await initiateCheckout(checkoutForm)
            setCheckoutData(response)
            setStep(2) // Avanzar al paso de pago
        } catch (err) {
            console.error("Error al iniciar checkout:", err)
            setError(err.message || "Error al iniciar el proceso de checkout")

            toast({
                variant: "destructive",
                title: "Error",
                description: err.message || "No se pudo iniciar el proceso de checkout",
            })
        } finally {
            setLoading(false)
        }
    }

    // Procesar el pago
    const handleProcessPayment = async (e) => {
        e.preventDefault()

        if (!validatePaymentForm()) return

        setLoading(true)
        setError(null)

        try {
            const response = await processPayment(checkoutData.checkoutId, paymentForm)

            // Actualizar el carrito (vaciar)
            await refreshCart()

            // Mostrar notificación de éxito
            toast({
                variant: "success",
                title: "¡Pago exitoso!",
                description: "Tu pedido ha sido procesado correctamente",
            })

            // Redirigir a la página de confirmación del pedido
            router.push(`/pedidos/${response.orderId}?success=true`)
        } catch (err) {
            console.error("Error al procesar el pago:", err)
            setError(err.message || "Error al procesar el pago")

            toast({
                variant: "destructive",
                title: "Error en el pago",
                description: err.message || "No se pudo procesar el pago. Inténtalo de nuevo.",
            })
        } finally {
            setLoading(false)
        }
    }

    // Función para manejar errores de carga de imagen
    const handleImageError = (e) => {
        e.target.src = "/placeholder.svg"
    }

    // Si no hay items en el carrito o no está autenticado, mostrar un mensaje
    if (!cartItems || cartItems.length === 0 || !isAuthenticated) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h2 className="text-xl font-semibold mb-2 text-gray-900">No puedes proceder al checkout</h2>
                    <p className="text-gray-700 mb-6">
                        {!isAuthenticated
                            ? "Debes iniciar sesión para continuar"
                            : "Tu carrito está vacío. Añade productos para continuar."}
                    </p>
                    <Link
                        href={!isAuthenticated ? "/login?redirect=checkout" : "/productos"}
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        {!isAuthenticated ? "Iniciar Sesión" : "Explorar Productos"}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="flex items-center mb-8">
                <Link href="/cart" className="text-indigo-600 hover:text-indigo-800 flex items-center mr-4">
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    <span className="font-medium">Volver al carrito</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            </div>

            {/* Pasos del checkout */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div className={`flex items-center ${step >= 1 ? "text-indigo-600" : "text-gray-400"}`}>
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                                step >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200"
                            }`}
                        >
                            1
                        </div>
                        <span className="font-medium">Dirección y método de pago</span>
                    </div>
                    <div className="h-0.5 w-16 bg-gray-200 mx-4"></div>
                    <div className={`flex items-center ${step >= 2 ? "text-indigo-600" : "text-gray-400"}`}>
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                                step >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200"
                            }`}
                        >
                            2
                        </div>
                        <span className="font-medium">Detalles de pago</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de checkout */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {step === 1 && (
                            <form onSubmit={handleInitiateCheckout}>
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-black">Dirección y método de pago</h2>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label htmlFor="billingAddress" className="block  text-sm font-medium text-black mb-1">
                                            Dirección de facturación
                                        </label>
                                        <textarea
                                            id="billingAddress"
                                            name="billingAddress"
                                            rows="3"
                                            value={checkoutForm.billingAddress}
                                            onChange={handleCheckoutFormChange}
                                            className={`w-full px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                                formErrors.billingAddress ? "border-red-500" : "border-gray-300"
                                            }`}
                                            placeholder="Ingresa tu dirección completa"
                                        ></textarea>
                                        {formErrors.billingAddress && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.billingAddress}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
                                        <div className="space-y-3">
                                            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="card"
                                                    checked={checkoutForm.paymentMethod === "card"}
                                                    onChange={handleCheckoutFormChange}
                                                    className="h-4 w-4 text-black text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <div className="ml-3 flex items-center">
                                                    <CreditCard className="h-6 w-6 text-gray-400 mr-2" />
                                                    <span className="font-medium text-gray-900">Tarjeta de crédito/débito</span>
                                                </div>
                                            </label>
                                        </div>
                                        {formErrors.paymentMethod && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.paymentMethod}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-50 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-70"
                                    >
                                        {loading ? "Procesando..." : "Continuar al pago"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 2 && checkoutData && (
                            <form onSubmit={handleProcessPayment}>
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-black">Detalles de pago</h2>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6">
                                        <h3 className="font-medium text-indigo-800 mb-2">Información de pago seguro</h3>
                                        <p className="text-indigo-700 text-sm">
                                            Tus datos de pago están protegidos con encriptación de extremo a extremo.
                                        </p>
                                    </div>

                                    <div>
                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            Número de tarjeta
                                        </label>
                                        <input
                                            type="text"
                                            id="cardNumber"
                                            name="cardNumber"
                                            value={paymentForm.cardNumber}
                                            onChange={handlePaymentFormChange}
                                            placeholder="1234 5678 9012 3456"
                                            className={`w-full px-4 py-2 border  text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                                formErrors.cardNumber ? "border-red-500" : "border-gray-300"
                                            }`}
                                        />
                                        {formErrors.cardNumber && <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                                                Fecha de expiración
                                            </label>
                                            <input
                                                type="text"
                                                id="cardExpiry"
                                                name="cardExpiry"
                                                value={paymentForm.cardExpiry}
                                                onChange={handlePaymentFormChange}
                                                placeholder="MM/YY"
                                                className={`w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                                    formErrors.cardExpiry ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {formErrors.cardExpiry && <p className="mt-1 text-sm text-red-600">{formErrors.cardExpiry}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                                                Código de seguridad (CVV)
                                            </label>
                                            <input
                                                type="text"
                                                id="cardCvv"
                                                name="cardCvv"
                                                value={paymentForm.cardCvv}
                                                onChange={handlePaymentFormChange}
                                                placeholder="123"
                                                className={`w-full px-4 py-2  text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                                    formErrors.cardCvv ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                            {formErrors.cardCvv && <p className="mt-1 text-sm text-red-600">{formErrors.cardCvv}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-50 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-70"
                                    >
                                        {loading ? "Procesando pago..." : `Pagar $${checkoutData.total.toFixed(2)}`}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        disabled={loading}
                                        className="w-full mt-3 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors hover:bg-gray-50 disabled:opacity-70"
                                    >
                                        Volver
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Resumen del pedido */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-black">Resumen del pedido</h2>
                        </div>

                        <div className="p-6 max-h-80 overflow-y-auto">
                            {cartItems.map((item) => {
                                // Construir la URL de la imagen correctamente
                                const imageUrl = item.product?.imageUrl
                                    ? item.product.imageUrl.startsWith("http")
                                        ? item.product.imageUrl
                                        : `${API_BASE_URL}${item.product.imageUrl}`
                                    : "/placeholder.svg"

                                // Asegurarse de que el precio es un número
                                const price = typeof item.product?.price === "number" ? item.product.price : 0
                                const subtotal = price * item.quantity

                                return (
                                    <div key={item.id} className="flex items-center py-3 border-b border-gray-100 last:border-0">
                                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                            <img
                                                src={imageUrl || "/placeholder.svg"}
                                                alt={item.product?.description || "Producto"}
                                                className="object-cover w-full h-full"
                                                onError={handleImageError}
                                            />
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                                                {item.product?.description || "Producto"}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                ${price.toFixed(2)} x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-200">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                    ${checkoutData ? checkoutData.subtotal.toFixed(2) : cartTotal.toFixed(2)}
                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Impuestos</span>
                                    <span className="font-medium text-gray-900">
                    ${checkoutData ? checkoutData.tax.toFixed(2) : "0.00"}
                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Envío</span>
                                    <span className="font-medium text-gray-900">
                    ${checkoutData ? checkoutData.shipping.toFixed(2) : "0.00"}
                  </span>
                                </div>
                                <div className="pt-2 mt-2 border-t border-gray-200">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-bold text-xl text-indigo-600">
                      ${checkoutData ? checkoutData.total.toFixed(2) : cartTotal.toFixed(2)}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center mb-4 text-green-700">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <h3 className="font-medium">Compra segura garantizada</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Todos nuestros pagos son procesados de forma segura. Tus datos están protegidos.
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                            </div>
                            <Link href="/politica-de-privacidad" className="text-xs text-indigo-600 hover:text-indigo-800">
                                Política de privacidad
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
