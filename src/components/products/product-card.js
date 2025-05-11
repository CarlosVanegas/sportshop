"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"

export default function ProductCard({ product }) {
    const { addToCart } = useCart()
    const [isAdding, setIsAdding] = useState(false)
    const router = useRouter()
    const { isAuthenticated } = useAuth()
    const [imageError, setImageError] = useState(false)
    const API_BASE_URL = "http://localhost:8080"
    const { toast } = useToast()

    // Manejar la adición al carrito
    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (isAdding) return

        setIsAdding(true)
        try {
            if (!isAuthenticated) {
                router.push("/login?redirect=productos")
                return
            }

            await addToCart(product.id, 1)

            // Mostrar notificación toast en lugar de alert
            toast({
                variant: "dark",
                title: "Producto añadido al carrito",
                description: `${product.description || "Producto"} se ha añadido correctamente`,
                action: (
                    <div
                        className="bg-orange-200 text-black px-3 py-1 rounded-full cursor-pointer hover:bg-orange-300 transition-colors"
                        onClick={() => router.push("/cart")}
                    >
                        Aceptar
                    </div>
                ),
            })
        } catch (error) {
            console.error("Error al añadir al carrito:", error)

            // Mostrar notificación de error
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo añadir el producto al carrito. Inténtalo de nuevo.",
            })
        } finally {
            setIsAdding(false)
        }
    }

    // Determinar la marca basada en la descripción del producto
    const getBrand = (description) => {
        const desc = description.toLowerCase()
        if (desc.includes("nike") || (desc.includes("zapatillas") && Math.random() > 0.5)) {
            return "NIKE"
        } else if (desc.includes("adidas") || (desc.includes("fútbol") && Math.random() > 0.5)) {
            return "ADIDAS"
        } else if (desc.includes("puma") || desc.includes("yoga")) {
            return "PUMA"
        } else if (desc.includes("under") || desc.includes("mancuernas")) {
            return "UNDER ARMOUR"
        } else if (desc.includes("baloncesto") && Math.random() > 0.5) {
            return "SPALDING"
        } else if (desc.includes("baloncesto")) {
            return "WILSON"
        }

        const brands = ["NIKE", "ADIDAS", "PUMA", "UNDER ARMOUR", "SPALDING", "WILSON", "REEBOK"]
        return brands[Math.floor(Math.random() * brands.length)]
    }

    // Función para manejar errores de carga de imagen
    const handleImageError = () => {
        console.log(`Error al cargar imagen: ${product.imageUrl}`)
        setImageError(true)
    }

    // Asegurarse de que el producto tenga todas las propiedades necesarias
    const productData = {
        id: product.id,
        slug: product.id?.toString() || "producto",
        brand: getBrand(product.description || ""),
        name: product.description || "Producto",
        image: product.imageUrl ? `${API_BASE_URL}${product.imageUrl}` : "/placeholder.svg",
        price: product.price || 0,
        rating: product.rating || Math.floor(Math.random() * 2) + 4, // Rating aleatorio entre 4 y 5
        category: product.category || "",
        quantityAvailable: product.quantityAvailable || 0,
    }

    return (
        <div className="group relative overflow-hidden rounded-lg bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            {/* Contenedor de imagen con overlay */}
            <div className="relative aspect-square overflow-hidden">
                <Image
                    src={productData.image || "/placeholder.svg"}
                    alt={productData.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    onError={handleImageError}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Overlay con botones de acción */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
                    <div className="flex gap-2 opacity-0 transform translate-y-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className="rounded-full bg-white p-3 text-black shadow-md transition-transform duration-300 hover:scale-110"
                            aria-label="Añadir al carrito"
                        >
                            {isAdding ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                            ) : (
                                <ShoppingCart className="h-5 w-5" />
                            )}
                        </button>

                        <button
                            className="rounded-full bg-white p-3 text-black shadow-md transition-transform duration-300 hover:scale-110 hover:text-red-500"
                            aria-label="Añadir a favoritos"
                        >
                            <Heart className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Badge de marca */}
                <div className="absolute left-3 top-3 rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium backdrop-blur-sm text-black">
                    {productData.brand}
                </div>
            </div>

            {/* Información del producto */}
            <Link href={`/productos/${productData.slug}`} className="block p-3">
                <h3 className="text-sm font-medium text-neutral-800 line-clamp-1">{productData.name}</h3>

                {/* Precio */}
                <div className="mt-1 text-base font-bold text-neutral-900">${productData.price.toFixed(2)}</div>

                {/* Estrellas de valoración */}
                <div className="mt-1 flex">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-3 w-3 ${i < productData.rating ? "text-yellow-400" : "text-neutral-200"}`}
                            fill={i < productData.rating ? "currentColor" : "none"}
                        />
                    ))}
                </div>
            </Link>
        </div>
    )
}
