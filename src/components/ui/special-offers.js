import Link from "next/link"

export default function SpecialOffers() {
    return (
        <section className="py-16 bg-black text-white">
            <div className="container mx-auto px-4 text-center">
                <div className="inline-block px-4 py-1 bg-neutral-800 rounded-full text-sm mb-4">Exclusivo</div>
                <h2 className="text-4xl font-bold mb-4">OFERTAS ESPECIALES</h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                    Descubre nuestras promociones exclusivas en equipamiento deportivo de primera calidad.
                </p>
                <Link
                    href="/ofertas"
                    className="inline-flex items-center bg-white text-black hover:bg-neutral-100 font-medium py-3 px-8 rounded-lg transition-colors"
                >
                    VER OFERTAS
                </Link>
            </div>
        </section>
    )
}
