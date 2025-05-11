"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import CategorySection from "@/components/products/category-section"
import ProductGrid from "@/components/products/product-grid"
import SpecialOffers from "@/components/ui/special-offers"
import Newsletter from "@/components/ui/newsletter"
import { getAllProducts, getProductsByCategory } from "@/services/productService"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("todos")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("Iniciando carga de productos, categoría:", activeCategory)
        let data = []

        try {
          if (activeCategory === "todos") {
            data = await getAllProducts()
            console.log('**222222222222222222222222222')
            console.log(data)
          } else {
            data = await getProductsByCategory(activeCategory)
            console.log('**********************************************')
            console.log(data)
          }
        } catch (err) {
          console.error("Error en la solicitud de productos:", err)
          throw err
        }

        console.log("Datos recibidos de la API:", data)

        if (!data || data.length === 0) {
          console.log("No se obtuvieron productos de la API, usando datos de muestra")
          setError("No se pudieron cargar los productos. Usando datos de muestra.")
         // setProducts(getSampleProducts(activeCategory))
        } else {
          // Asignar categorías a los productos basados en su descripción
          const productsWithCategories = data.map((product) => {
            let category = "otros"
            const description = product.description.toLowerCase()

            if (description.includes("fútbol") || description.includes("futbol") || description.includes("portero")) {
              category = "futbol"
            } else if (description.includes("baloncesto") || description.includes("basketball")) {
              category = "baloncesto"
            } else if (description.includes("running") || description.includes("zapatillas")) {
              category = "running"
            } else if (
                description.includes("yoga") ||
                description.includes("fitness") ||
                description.includes("mancuernas")
            ) {
              category = "fitness"
            }

            return { ...product, category }
          })

          // Filtrar por categoría si es necesario
          if (activeCategory !== "todos") {
            const filtered = productsWithCategories.filter((p) => p.category === activeCategory)
            setProducts(filtered)
          } else {
            setProducts(productsWithCategories)
          }
        }
      } catch (err) {
        console.error("Error al cargar productos:", err)
        setError("No se pudieron cargar los productos. Usando datos de muestra.")
        ///setProducts(getSampleProducts(activeCategory))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [activeCategory])

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
  }

  return (
      <>
      {/* Hero Banner */}
        <section className="relative bg-neutral-100">
          <div className="relative h-[500px] w-full overflow-hidden">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/images/backgrpind_sports.mp4"  type="video/mp4"/>
            </video>

            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl">
                <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-md">NUEVAS LLEGADAS</h1>
                  <p className="text-xl text-white mb-8 drop-shadow-md">Descubre lo último en equipamiento deportivo</p>
                  <Link
                      href="/productos"
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
        <CategorySection />

      {/* Featured Products */}
        <section className="section-padding bg-neutral-50 p-4">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="section-title text-black">PRODUCTOS DESTACADOS</h2>
              <Link
                  href="/productos"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center text-sm"
              >
                Ver todos <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === "todos" ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"}`}
                  onClick={() => handleCategoryChange("todos")}
              >
                Todos
              </button>
              <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === "futbol" ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"}`}
                  onClick={() => handleCategoryChange("futbol")}
              >
                Fútbol
              </button>
              <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === "baloncesto" ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"}`}
                  onClick={() => handleCategoryChange("baloncesto")}
              >
                Baloncesto
              </button>
              <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === "running" ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"}`}
                  onClick={() => handleCategoryChange("running")}
              >
                Running
              </button>
              <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === "fitness" ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 hover:bg-neutral-100"}`}
                  onClick={() => handleCategoryChange("fitness")}
              >
                Fitness
              </button>
            </div>

            {/* Mostrar información de depuración en desarrollo */}
            {process.env.NODE_ENV === "development" && (
                <div className="mb-4 p-4 bg-gray-100 rounded-lg text-black">
                  <p className="font-mono text-sm">Productos cargados: {products.length}</p>
                  <p className="font-mono text-sm">Categoría activa: {activeCategory}</p>
                  {error && <p className="font-mono text-sm text-red-500">Error: {error}</p>}
                </div>
            )}

            <ProductGrid products={products} isLoading={loading} error={error} />
          </div>
        </section>

        {/* Special Offers */}
        <SpecialOffers />

        {/* Newsletter */}
        <Newsletter />
      </>
  )
}
