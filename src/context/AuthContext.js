"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { isAuthenticated, loginUser, logoutUser, registerUser } from "@/services/authService"
import { getUserProfile } from "@/services/userService"

// Crear el contexto con un valor inicial
const AuthContext = createContext({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    login: async () => {},
    register: async () => {},
    logout: () => {},
})

// Proveedor del contexto
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Cargar usuario al iniciar
    useEffect(() => {
        const loadUser = async () => {
            try {
                if (isAuthenticated()) {
                    console.log("Usuario autenticado, cargando perfil...")
                    const userData = await getUserProfile()
                    console.log("Perfil de usuario cargado:", userData)
                    setUser(userData)
                } else {
                    console.log("Usuario no autenticado")
                }
            } catch (err) {
                console.error("Error al cargar usuario:", err)
                // Si hay un error al cargar el usuario, probablemente el token es inválido
                logoutUser()
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [])

    // Función para iniciar sesión
    const login = async (credentials) => {
        setLoading(true)
        setError(null)
        try {
            console.log("Iniciando sesión con:", credentials)
            const response = await loginUser(credentials)
            console.log("Respuesta de login:", response)

            // Esperar un momento para que el token se guarde correctamente
            await new Promise((resolve) => setTimeout(resolve, 500))

            console.log("Obteniendo perfil de usuario...")
            const userData = await getUserProfile()
            console.log("Perfil de usuario:", userData)
            setUser(userData)
            return userData
        } catch (err) {
            console.error("Error en login:", err)
            setError(err.message || "Error al iniciar sesión")
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Función para registrarse
    const register = async (userData) => {
        setLoading(true)
        setError(null)
        try {
            const response = await registerUser(userData)
            // Después de registrarse, iniciamos sesión automáticamente
            await login({
                email: userData.email,
                password: userData.password,
            })
            return response
        } catch (err) {
            setError(err.message || "Error al registrarse")
            throw err
        } finally {
            setLoading(false)
        }
    }

    // Función para cerrar sesión
    const logout = () => {
        logoutUser()
        setUser(null)
    }

    // Valor del contexto
    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider")
    }
    return context
}
