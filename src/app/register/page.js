"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthDate: "",
        shippingAddress: "",
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [registerError, setRegisterError] = useState("")

    const router = useRouter()
    const { register } = useAuth()

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

        if (!formData.firstName) {
            newErrors.firstName = "El nombre es obligatorio"
        }

        if (!formData.lastName) {
            newErrors.lastName = "El apellido es obligatorio"
        }

        if (!formData.email) {
            newErrors.email = "El correo electrónico es obligatorio"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "El correo electrónico no es válido"
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es obligatoria"
        } else if (formData.password.length < 8) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres"
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Debes confirmar la contraseña"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden"
        }

        if (!formData.birthDate) {
            newErrors.birthDate = "La fecha de nacimiento es obligatoria"
        }

        if (!formData.shippingAddress) {
            newErrors.shippingAddress = "La dirección de envío es obligatoria"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)
        setRegisterError("")

        try {
            await register(formData)
            router.push("/")
        } catch (error) {
            console.error("Error al registrarse:", error)
            setRegisterError(error.message || "Error al registrarse. Inténtalo de nuevo.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-black">Crear Cuenta</h1>

                {registerError && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{registerError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`w-full px-4  text-black py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                    errors.firstName ? "border-red-500" : "border-neutral-300"
                                }`}
                                placeholder="Tu nombre"
                            />
                            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                                Apellido
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                    errors.lastName ? "border-red-500" : "border-neutral-300"
                                }`}
                                placeholder="Tu apellido"
                            />
                            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-black text-sm font-medium text-neutral-700 mb-1">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2  text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.email ? "border-red-500" : "border-neutral-300"
                            }`}
                            placeholder="tu@email.com"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 text-black py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                    errors.password ? "border-red-500" : "border-neutral-300"
                                }`}
                                placeholder="********"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-2  text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                    errors.confirmPassword ? "border-red-500" : "border-neutral-300"
                                }`}
                                placeholder="********"
                            />
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="birthDate" className="block text-sm font-medium text-neutral-700 mb-1">
                            Fecha de Nacimiento
                        </label>
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.birthDate ? "border-red-500" : "border-neutral-300"
                            }`}
                        />
                        {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="shippingAddress" className="block text-sm font-medium text-neutral-700 mb-1">
                            Dirección de Envío
                        </label>
                        <textarea
                            id="shippingAddress"
                            name="shippingAddress"
                            value={formData.shippingAddress}
                            onChange={handleChange}
                            rows="3"
                            className={`w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                errors.shippingAddress ? "border-red-500" : "border-neutral-300"
                            }`}
                            placeholder="Tu dirección completa"
                        ></textarea>
                        {errors.shippingAddress && <p className="mt-1 text-sm text-red-600">{errors.shippingAddress}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary-600 text-black hover:bg-primary-700  font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-70"
                    >
                        {isSubmitting ? "Registrando..." : "Crear Cuenta"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-neutral-600">
                        ¿Ya tienes una cuenta?{" "}
                        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Inicia Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
