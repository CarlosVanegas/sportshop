"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loginError, setLoginError] = useState("")
    const [redirectPath, setRedirectPath] = useState("")

    const router = useRouter()
    const searchParams = useSearchParams()
    const { login, isAuthenticated } = useAuth()

    useEffect(() => {
        // Si ya está autenticado, redirigir a la página principal
        if (isAuthenticated) {
            router.push("/")
        }

        // Obtener la ruta de redirección de los parámetros de búsqueda
        const redirect = searchParams.get("redirect")
        if (redirect) {
            setRedirectPath(redirect)
        }
    }, [isAuthenticated, router, searchParams])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        // Limpiar errores al cambiar el valor
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.email) {
            newErrors.email = "El correo electrónico es obligatorio"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "El correo electrónico no es válido"
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es obligatoria"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        setLoginError("")

        try {
            await login(formData)

            // Redirigir a la página de destino o a la página principal
            if (redirectPath) {
                router.push(`/${redirectPath}`)
            } else {
                router.push("/")
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error)
            setLoginError(error.message || "Error al iniciar sesión. Inténtalo de nuevo.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-sm mx-auto bg-white border border-neutral-200 rounded-lg p-6">
                <h1 className="text-xl font-semibold text-center mb-4 text-black">Iniciar Sesión</h1>

                {loginError && <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{loginError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm text-neutral-700 mb-1">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                                errors.email ? "border-red-500" : "border-neutral-300"
                            }`}
                            placeholder="tu@email.com"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="password" className="block text-sm text-neutral-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 text-black border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                                errors.password ? "border-red-500" : "border-neutral-300"
                            }`}
                            placeholder="********"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white text-sm py-2 rounded hover:bg-neutral-800 transition-colors disabled:opacity-60"
                    >
                        {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="mt-5 text-center">
                    <p className="text-sm text-neutral-500">
                        ¿No tienes una cuenta?{" "}
                        <Link href="/register" className="text-primary-600 hover:underline font-medium">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
