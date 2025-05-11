import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina clases condicionales para Tailwind CSS
 * @param {string[]} classes - Clases a combinar
 * @returns {string} - Clases combinadas
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}
