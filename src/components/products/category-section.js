import Image from "next/image"
import Link from "next/link"

const categories = [
    {
        id: "running",
        name: "RUNNING",
        image: "/images/running.jpg",
    },
    {
        id: "futbol",
        name: "FÚTBOL",
            image: "/images/futbol.jpg",
    },
    {
        id: "boxing",
        name: "BOXEO",
        image: "/images/boxing.jpg",
    },
    {
        id: "swimming",
        name: "SWIMMING",
        image: "/images/swimming.jpg",
    },
    {
        id: "cycling",
        name: "CYCLING",
        image: "/images/cycling.jpg",
    },
    {
        id: "tenis",
        name: "TENIS",
        image: "/images/tenis.jpg",
    },
]

export default function CategorySection() {
    return (
        <section className="section-padding bg-white p-4">
            <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/${category.id}`} className="category-card block">
                            <div className="relative h-full w-full">
                                <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                                <div className="category-card-overlay"></div>
                                <h3 className="category-card-title">{category.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
