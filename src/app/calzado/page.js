"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ArrowRight } from "lucide-react"

export default function CalzadoPage() {
    const [activeFilter, setActiveFilter] = useState("todos")

    const subcategories = [
        { id: "running", name: "Running" },
        { id: "futbol", name: "Fútbol" },
        { id: "baloncesto", name: "Baloncesto" },
        { id: "training", name: "Training" },
        { id: "casual", name: "Casual" },
    ]

    const featuredProducts = [
        {
            id: 1,
            name: "Nike Air Zoom Pegasus 39",
            price: 129.99,
            image: "/running-shoes-on-track.png",
            category: "running",
        },
        {
            id: 2,
            name: "Adidas Predator Edge",
            price: 149.99,
            image: "/vibrant-football-boots.png",
            category: "futbol",
        },
        {
            id: 3,
            name: "Under Armour Curry 9",
            price: 159.99,
            image: "/athletic-basketball-shoes.png",
            category: "baloncesto",
        },
        {
            id: 4,
            name: "New Balance Fresh Foam",
            price: 119.99,
            image: "/athletic-training-shoes.png",
            category: "training",
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
                        src="/sports-shoes-collection.png"
                        alt="Colección de calzado deportivo"
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-4">
                            <div className="max-w-xl">
                                <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-md">CALZADO DEPORTIVO</h1>
                                <p className="text-xl text-white mb-8 drop-shadow-md">
                                    Descubre nuestra colección de calzado para todos los deportes y estilos
                                </p>
                                <Link
                                    href="#featured"
                                    className="inline-flex items-center bg-white hover:bg-neutral-100 text-neutral-900 font-medium py-3 px-6 rounded-lg transition-colors"
                                >
                                    VER COLECCIÓN
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
                    <h2 className="text-3xl font-bold text-center mb-12">CATEGORÍAS DE CALZADO</h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {subcategories.map((category) => (
                            <Link key={category.id} href={`/calzado/${category.id}`} className="group">
                                <div className="relative h-60 rounded-lg overflow-hidden">
                                    <Image
                                        src={`/abstract-geometric-shapes.png?height=240&width=200&query=${category.name}%20shoes`}
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
                            href="/productos?categoria=calzado"
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

            {/* Benefits */}
            <section className="py-16 bg-neutral-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-neutral-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Entrega Rápida</h3>
                            <p className="text-neutral-300">Recibe tu calzado en 24-48 horas</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-neutral-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Calidad Garantizada</h3>
                            <p className="text-neutral-300">Productos originales con garantía</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-neutral-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Pago Seguro</h3>
                            <p className="text-neutral-300">Múltiples métodos de pago seguros</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
