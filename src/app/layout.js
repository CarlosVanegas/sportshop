import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import AnnouncementBar from "@/components/ui/announcement-bar"
import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata = {
    title: "SportShop - Equipamiento deportivo de alta calidad",
    description: "Tu tienda de confianza para artículos deportivos de alta calidad",
}

export default function RootLayout({ children }) {
    return (
        <html lang="es">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
            <CartProvider>
                <AnnouncementBar />
                <Navbar />
                <main>{children}</main>
                <Footer />
                <Toaster />
            </CartProvider>
        </AuthProvider>
        </body>
        </html>
    )
}
