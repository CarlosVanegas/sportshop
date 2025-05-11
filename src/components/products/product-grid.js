import ProductCard from "./product-card"

export default function ProductGrid({ products = [], isLoading = false, error = null }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-neutral-100 rounded-xl h-96 animate-pulse"></div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100">
                <h3 className="text-xl font-medium text-red-700 mb-2">Error</h3>
                <p className="text-red-600">{error}</p>
            </div>
        )
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-neutral-100">
                <h3 className="text-xl font-medium text-neutral-700 mb-2">No se encontraron productos</h3>
                <p className="text-neutral-500">Intenta con otra categoría o vuelve más tarde</p>
            </div>
        )
    }

    console.log("Renderizando productos:", products.length)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}
