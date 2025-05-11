"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ArrowRight } from "lucide-react"

export default function RopaDeportivaPage() {
    const [activeFilter, setActiveFilter] = useState("todos")

    const subcategories = [
        { id: "camisetas", name: "Camisetas" },
        { id: "pantalones", name: "Pantalones" },
        { id: "sudaderas", name: "Sudaderas" },
        { id: "chaquetas", name: "Chaquetas" },
        { id: "conjuntos", name: "Conjuntos" },
    ]

    const featuredProducts = [
        {
            id: 1,
            name: "Camiseta Nike Dri-FIT",
            price: 34.99,
            image: "/sports-tshirt.png",
            category: "camisetas",
        },
        {
            id: 2,
            name: "Pantalón Adidas Training",
            price: 49.99,
            image: "/athletic-pants.png",
            category: "pantalones",
        },
        {
            id: 3,
            name: "Sudadera Under Armour",
            price: 59.99,
            image: "/sports-hoodie.png",
            category: "sudaderas",
        },
        {
            id: 4,
            name: "Chaqueta Cortavientos Puma",
            price: 79.99,
            image: "/placeholder.svg?height=300&width=300&query=sports%20jacket",
            category: "chaquetas",
        },
    ]

    const filteredProducts =
        activeFilter === "todos"
            ? featuredProducts
            : featuredProducts.filter((product) => product.category === activeFilter)

    return (
        <div className="bg-white">
            {/* Hero Banner */}
            <section className="relative bg-black">
                <div className="relative h-[500px] w-full overflow-hidden">
                    <Image
                        src="/placeholder.svg?height=500&width=1920&query=sports%20clothing%20collection"
                        alt="Colección de ropa deportiva"
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-4">
                            <div className="max-w-xl">
                                <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-md">ROPA DEPORTIVA</h1>
                                <p className="text-xl text-white mb-8 drop-shadow-md">
                                    Rendimiento y estilo para todos tus entrenamientos
                                </p>
                                <Link
                                    href="#featured"
                                    className="inline-flex items-center bg-white hover:bg-neutral-100 text-neutral-900 font-medium py-3 px-6 rounded-lg transition-colors"
                                >
                                    EXPLORAR COLECCIÓN
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">CATEGORÍAS DE ROPA</h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {subcategories.map((category) => (
                            <Link key={category.id} href={`/ropa-deportiva/${category.id}`} className="group">
                                <div className="relative h-60 rounded-lg overflow-hidden">
                                    <Image
                                        src={`/placeholder.svg?height=240&width=200&query=${category.name}%20deportivos`}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <h3 className="text-white font-bold text-xl">{category.name}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section id="featured" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">PRODUCTOS DESTACADOS</h2>
                        <Link
                            href="/productos?categoria=ropa-deportiva"
                            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                        >
                            Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === "todos" ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"}`}
                            onClick={() => setActiveFilter("todos")}
                        >
                            Todos
                        </button>
                        {subcategories.map((category) => (
                            <button
                                key={category.id}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === category.id ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"}`}
                                onClick={() => setActiveFilter(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                                    <p className="text-primary-600 font-bold">${product.price.toFixed(2)}</p>
                                    <button className="mt-3 w-full bg-neutral-900 hover:bg-neutral-800 text-white py-2 rounded-lg transition-colors">
                                        Añadir al carrito
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lookbook Section */}
            <section className="py-16 bg-neutral-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">LOOKBOOK DEPORTIVO</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative h-[500px] rounded-xl overflow-hidden">
                            <Image
                                src="/placeholder.svg?height=500&width=600&query=men%20sports%20outfit"
                                alt="Outfit deportivo hombre"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                <div className="p-6">
                                    <h3 className="text-white text-2xl font-bold mb-2">Colección Hombre</h3>
                                    <Link
                                        href="/ropa-deportiva/hombre"
                                        className="text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded-lg inline-block"
                                    >
                                        Ver colección
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-[500px] rounded-xl overflow-hidden">
                            <Image
                                src="/placeholder.svg?height=500&width=600&query=women%20sports%20outfit"
                                alt="Outfit deportivo mujer"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                <div className="p-6">
                                    <h3 className="text-white text-2xl font-bold mb-2">Colección Mujer</h3>
                                    <Link
                                        href="/ropa-deportiva/mujer"
                                        className="text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded-lg inline-block"
                                    >
                                        Ver colección
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
