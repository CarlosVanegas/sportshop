"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Newsletter() {
    const [email, setEmail] = useState("")
    const { toast } = useToast()

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle newsletter subscription
        console.log("Subscribing email:", email)
        // Reset form
        setEmail("")

        // Mostrar notificación toast en lugar de alert
        toast({
            variant: "dark",
            title: "¡Gracias por suscribirte!",
            description: "Recibirás nuestras ofertas y novedades en tu correo electrónico.",
        })
    }

    return (
        <section className="py-16 bg-neutral-900 text-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <div className="inline-block px-3 py-1 bg-neutral-800 rounded-full text-xs mb-4">Newsletter</div>
                        <h2 className="text-3xl font-bold mb-4">SUSCRÍBETE AHORA</h2>
                        <p className="text-neutral-300 max-w-md">
                            No pierdas la oportunidad de conocer lo último de SportShop y recibe ofertas exclusivas.
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-100 transition-colors"
                            >
                                SUSCRIBIRSE
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
