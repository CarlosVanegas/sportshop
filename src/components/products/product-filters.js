"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"

const categories = [
    { id: "futbol", name: "Fútbol" },
    { id: "baloncesto", name: "Baloncesto" },
    { id: "running", name: "Running" },
    { id: "fitness", name: "Fitness" },
]

export default function ProductFilters({ onFilterChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState({ min: 0, max: 200 })

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        applyFilters()
    }

    const toggleCategory = (categoryId) => {
        setSelectedCategories((prev) => {
            if (prev.includes(categoryId)) {
                return prev.filter((id) => id !== categoryId)
            } else {
                return [...prev, categoryId]
            }
        })
    }

    const handlePriceChange = (e, type) => {
        const value = Number.parseInt(e.target.value) || 0
        setPriceRange((prev) => ({
            ...prev,
            [type]: value,
        }))
    }

    const applyFilters = () => {
        onFilterChange({
            search: searchQuery,
            categories: selectedCategories,
            price: priceRange,
        })
    }

    const resetFilters = () => {
        setSearchQuery("")
        setSelectedCategories([])
        setPriceRange({ min: 0, max: 200 })
        onFilterChange({
            search: "",
            categories: [],
            price: { min: 0, max: 200 },
        })
    }

    return (
        <div className="mb-8">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full py-3 pl-4 pr-12 rounded-lg border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-primary-600"
                    aria-label="Buscar"
                >
                    <Search className="h-5 w-5" />
                </button>
            </form>

            {/* Filter Toggle Button (Mobile) */}
            <div className="md:hidden mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-full py-2 px-4 bg-neutral-100 rounded-lg text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                    {isOpen ? (
                        <>
                            <X className="h-4 w-4 mr-2" />
                            Cerrar filtros
                        </>
                    ) : (
                        <>
                            <Filter className="h-4 w-4 mr-2" />
                            Mostrar filtros
                        </>
                    )}
                </button>
            </div>

            {/* Filters */}
            <div className={`${isOpen ? "block" : "hidden"} md:block`}>
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-neutral-800 mb-3">Categorías</h3>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <label key={category.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => toggleCategory(category.id)}
                                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                                    />
                                    <span className="ml-2 text-neutral-700">{category.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-neutral-800 mb-3">Precio</h3>
                        <div className="flex items-center space-x-4">
                            <div>
                                <label className="block text-sm text-neutral-500 mb-1">Mínimo</label>
                                <input
                                    type="number"
                                    min="0"
                                    max={priceRange.max}
                                    value={priceRange.min}
                                    onChange={(e) => handlePriceChange(e, "min")}
                                    className="w-full p-2 rounded border border-neutral-200 bg-white text-neutral-800"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-500 mb-1">Máximo</label>
                                <input
                                    type="number"
                                    min={priceRange.min}
                                    value={priceRange.max}
                                    onChange={(e) => handlePriceChange(e, "max")}
                                    className="w-full p-2 rounded border border-neutral-200 bg-white text-neutral-800"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                            onClick={applyFilters}
                            className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                        >
                            Aplicar filtros
                        </button>
                        <button
                            onClick={resetFilters}
                            className="py-2 px-4 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
