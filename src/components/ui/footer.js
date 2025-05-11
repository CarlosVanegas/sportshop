import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-neutral-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* About Us */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-neutral-900">SOBRE NOSOTROS</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/nuestra-historia" className="text-neutral-600 hover:text-neutral-900">
                                    Nuestra Historia
                                </Link>
                            </li>
                            <li>
                                <Link href="/tiendas" className="text-neutral-600 hover:text-neutral-900">
                                    Tiendas
                                </Link>
                            </li>
                            <li>
                                <Link href="/trabaja-con-nosotros" className="text-neutral-600 hover:text-neutral-900">
                                    Trabaja con Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link href="/sostenibilidad" className="text-neutral-600 hover:text-neutral-900">
                                    Sostenibilidad
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-neutral-900">AYUDA</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/contacto" className="text-neutral-600 hover:text-neutral-900">
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link href="/envio-y-entrega" className="text-neutral-600 hover:text-neutral-900">
                                    Envío y Entrega
                                </Link>
                            </li>
                            <li>
                                <Link href="/devoluciones" className="text-neutral-600 hover:text-neutral-900">
                                    Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/preguntas-frecuentes" className="text-neutral-600 hover:text-neutral-900">
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-neutral-900">POLÍTICAS</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/terminos-y-condiciones" className="text-neutral-600 hover:text-neutral-900">
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/politica-de-privacidad" className="text-neutral-600 hover:text-neutral-900">
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link href="/politica-de-cookies" className="text-neutral-600 hover:text-neutral-900">
                                    Política de Cookies
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-neutral-900">SÍGUENOS</h3>
                        <div className="flex space-x-4 mb-6">
                            <Link href="https://facebook.com" className="bg-white p-2 rounded-full hover:bg-neutral-200">
                                <Facebook className="h-5 w-5 text-neutral-700" />
                            </Link>
                            <Link href="https://instagram.com" className="bg-white p-2 rounded-full hover:bg-neutral-200">
                                <Instagram className="h-5 w-5 text-neutral-700" />
                            </Link>
                            <Link href="https://twitter.com" className="bg-white p-2 rounded-full hover:bg-neutral-200">
                                <Twitter className="h-5 w-5 text-neutral-700" />
                            </Link>
                            <Link href="https://youtube.com" className="bg-white p-2 rounded-full hover:bg-neutral-200">
                                <Youtube className="h-5 w-5 text-neutral-700" />
                            </Link>
                        </div>

                        <h3 className="text-lg font-bold mb-4 text-neutral-900">MEDIOS DE PAGO</h3>
                        <div className="flex space-x-2">
                            <div className="bg-white p-2 rounded w-12 h-8"></div>
                            <div className="bg-white p-2 rounded w-12 h-8"></div>
                            <div className="bg-white p-2 rounded w-12 h-8"></div>
                            <div className="bg-white p-2 rounded w-12 h-8"></div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-neutral-200 text-center text-neutral-600 text-sm">
                    © {new Date().getFullYear()} SportShop. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    )
}
