"use client"

import Link from "next/link"
import { Search, Heart, User, ShoppingCart, Menu, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const { user, isAuthenticated, logout } = useAuth()
    const { itemCount } = useCart()
    const userMenuRef = useRef(null)

    // Estado para controlar la renderización en el cliente
    const [isMounted, setIsMounted] = useState(false)

    // Efecto para marcar cuando el componente está montado en el cliente
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Cerrar el menú de usuario cuando se hace clic fuera de él
    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false)
            }
        }

        // Agregar el evento solo si el menú está abierto
        if (isUserMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isUserMenuOpen])

    const handleUserMenuToggle = () => {
        setIsUserMenuOpen(!isUserMenuOpen)
    }

    const handleLogout = () => {
        logout()
        setIsUserMenuOpen(false)
        setIsMenuOpen(false)
    }

    // Extraer el nombre de usuario para mostrar
    const userDisplayName = isMounted && user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : ""

    // Categorías principales
    const mainCategories = [
        { name: "INICIO", href: "/" },
        { name: "CALZADO", href: "/calzado" },
        { name: "ROPA DEPORTIVA", href: "/ropa-deportiva" },
        { name: "EQUIPOS", href: "/equipos" },
        { name: "ACCESORIOS", href: "/accesorios" },
        { name: "NUTRICIÓN", href: "/nutricion" },
    ]

    return (
        <header className="bg-white border-b border-neutral-100 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-black">SPORT</span>
              <span className="text-neutral-500">SHOP</span>
            </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {mainCategories.map((category) => (
                            <Link
                                key={category.href}
                                href={category.href}
                                className="text-neutral-900 hover:text-primary-600 font-medium text-sm whitespace-nowrap"
                            >
                                {category.name}
                            </Link>
                        ))}
                        <Link href="/ofertas" className="text-red-600 hover:text-red-700 font-medium text-sm">
                            OFERTAS
                        </Link>
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-neutral-100" aria-label="Buscar">
                            <Search className="h-5 w-5 text-neutral-700" />
                        </button>
                        <Link href="/wishlist" className="p-2 rounded-full hover:bg-neutral-100" aria-label="Favoritos">
                            <Heart className="h-5 w-5 text-neutral-700" />
                        </Link>

                        {/* User Menu - Solo renderizado en el cliente para evitar errores de hidratación */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isUserMenuOpen ? "bg-neutral-100" : "hover:bg-neutral-100"}`}
                                aria-label="Mi cuenta"
                                onClick={handleUserMenuToggle}
                                aria-expanded={isUserMenuOpen}
                            >
                                {isMounted ? (
                                    isAuthenticated ? (
                                        <>
                      <span className="hidden md:flex flex-col items-end text-sm">
                        <span className="font-medium text-neutral-900">{userDisplayName}</span>
                        <span className="text-xs text-neutral-500">Mi cuenta</span>
                      </span>
                                            <User className="h-5 w-5 text-neutral-700" />
                                        </>
                                    ) : (
                                        <>
                                            <span className="hidden md:block text-sm font-medium text-neutral-900">Iniciar sesión</span>
                                            <User className="h-5 w-5 text-neutral-700" />
                                        </>
                                    )
                                ) : (
                                    // Versión simplificada para el renderizado del servidor
                                    <User className="h-5 w-5 text-neutral-700" />
                                )}
                            </button>

                            {/* Menú desplegable con transición suave */}
                            {isMounted && (
                                <div
                                    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 transform origin-top-right transition-all duration-200 ease-in-out ${
                                        isUserMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                                    }`}
                                >
                                    {isAuthenticated ? (
                                        <>
                                            <div className="px-4 py-2 text-sm text-neutral-700 border-b border-neutral-100">
                                                Hola, {user?.firstName || "Usuario"}
                                            </div>
                                            <Link
                                                href="/perfil"
                                                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Mi Perfil
                                            </Link>
                                            <Link
                                                href="/pedidos"
                                                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Mis Pedidos
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                                            >
                                                Cerrar Sesión
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Iniciar Sesión
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Registrarse
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <Link href="/cart" className="p-2 rounded-full hover:bg-neutral-100 relative" aria-label="Carrito">
                            <ShoppingCart className="h-5 w-5 text-neutral-700" />
                            {isMounted && itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-md hover:bg-neutral-100"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                        >
                            {isMenuOpen ? <X className="h-6 w-6 text-neutral-700" /> : <Menu className="h-6 w-6 text-neutral-700" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden py-4 border-t border-neutral-100 transform transition-all duration-300 ease-in-out ${
                        isMenuOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
                    }`}
                >
                    <nav className="flex flex-col space-y-4">
                        {mainCategories.map((category) => (
                            <Link
                                key={category.href}
                                href={category.href}
                                className="text-neutral-900 hover:text-primary-600 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {category.name}
                            </Link>
                        ))}
                        <Link
                            href="/ofertas"
                            className="text-red-600 hover:text-red-700 font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            OFERTAS
                        </Link>

                        {isMounted &&
                            (isAuthenticated ? (
                                <>
                                    <div className="border-t border-neutral-100 pt-4 mt-4"></div>
                                    <Link
                                        href="/perfil"
                                        className="text-neutral-900 hover:text-primary-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Mi Perfil
                                    </Link>
                                    <Link
                                        href="/pedidos"
                                        className="text-neutral-900 hover:text-primary-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Mis Pedidos
                                    </Link>
                                    <button onClick={handleLogout} className="text-left text-neutral-900 hover:text-primary-600">
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="border-t border-neutral-100 pt-4 mt-4"></div>
                                    <Link
                                        href="/login"
                                        className="text-neutral-900 hover:text-primary-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="text-neutral-900 hover:text-primary-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            ))}
                    </nav>
                </div>
            </div>
        </header>
    )
}
